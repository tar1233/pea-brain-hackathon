import { NextRequest, NextResponse } from "next/server";
import {
  BedrockAgentRuntimeClient,
  RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { riskAlerts, materials } from "../../data/mockData";

export const dynamic = "force-dynamic";

// us-east-1 for both KB and Nova Pro Model (First-party model, no marketplace subscription needed)
const REGION = "us-east-1";

const credentials = {
  accessKeyId: process.env.PEA_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.PEA_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
};

const agentClient = new BedrockAgentRuntimeClient({
  region: REGION,
  credentials: credentials.accessKeyId ? credentials : undefined,
});

const runtimeClient = new BedrockRuntimeClient({
  region: REGION,
  credentials: credentials.accessKeyId ? credentials : undefined,
});

const KNOWLEDGE_BASE_ID = "8HWXS46GOZ";

export async function POST(req: NextRequest) {
  try {
    const { messages, jsonMode } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    
    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 });
    }

    // To prevent Context Loss in RAG (Amnesia), combine only the recent USER messages.
    // Mixing AI responses into the vector search query can confuse the similarity search.
    const recentUserMessages = messages
      .filter((m: { role: string; content: string }) => m.role === "user")
      .slice(-2)
      .map((m: { role: string; content: string }) => m.content)
      .join(" ");
    const retrievalQueryText = recentUserMessages.substring(0, 1000); // Bedrock limit is 1000 chars

    // 1. Retrieve information from Knowledge Base
    const retrieveCommand = new RetrieveCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      retrievalQuery: {
        text: retrievalQueryText,
      },
      retrievalConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults: 5,
        },
      },
    });

    const retrieveResponse = await agentClient.send(retrieveCommand);
    const retrievedResults = retrieveResponse.retrievalResults || [];
    
    let contextText = "";
    if (retrievedResults.length > 0) {
      contextText = retrievedResults
        .map((r, index) => `[ข้อมูลอ้างอิง ${index + 1}]:\n${r.content?.text}\n`)
        .join("\n");
    } else {
      contextText = "ไม่พบข้อมูลอ้างอิงในระบบ";
    }

    // Inject Live Dashboard Context into the AI
    const liveAlerts = riskAlerts
      .filter(a => a.severity === "critical")
      .map(a => `- ⚠️ ${a.materialId} (${a.materialName}): ${a.message} -> เสนอให้: ${a.recommendation}`)
      .join("\n");

    // 2. Generate answer using Amazon Nova Pro
    // If jsonMode is requested, use a strict JSON-only system prompt
    const systemPrompt = jsonMode 
      ? `คุณคือ "PEA Brain" — AI วิเคราะห์การจัดซื้อพัสดุของการไฟฟ้าส่วนภูมิภาค (PEA)

⚠️ [REAL-TIME ALERTS]:
${liveAlerts || 'ไม่มีรายการวิกฤตในขณะนี้'}

📚 [KNOWLEDGE BASE]:
${contextText}

กฎสำคัญที่สุด:
- ตอบเป็น JSON object เท่านั้น ห้ามมีข้อความอื่นใดก่อนหรือหลัง JSON
- ห้ามใช้ markdown code block (เช่น \`\`\`json)
- ตอบ JSON เปล่าๆ เลย เริ่มต้นด้วย { จบด้วย }
- วิเคราะห์จากข้อมูลจริงที่ให้มา อ้างอิงตัวเลขจริงทุกครั้ง
- ทุก field ต้องมีข้อมูลเชิงลึก ห้ามเว้นว่างหรือใส่ "-"`
      : `คุณคือ "PEA Brain" — ผู้ช่วย AI อัจฉริยะ (Agentic AI) สำหรับวางแผนจัดซื้อพัสดุของการไฟฟ้าส่วนภูมิภาค (กฟภ./PEA)
คุณเชี่ยวชาญด้าน Supply Chain, Procurement, Inventory Management และ Demand Forecasting สำหรับหม้อแปลงไฟฟ้า

⚠️ **[REAL-TIME SYSTEM ALERTS] ข้อมูลแจ้งเตือนวิกฤตบน Dashboard ปัจจุบัน:**
${liveAlerts || 'ไม่มีรายการวิกฤตในขณะนี้'}

📚 **[KNOWLEDGE BASE] ข้อมูลบริบทเชิงลึกที่ค้นพบจากเอกสาร PEA:**
<context>
${contextText}
</context>

กฎในการตอบ:
1. วิเคราะห์ข้อมูลจากทั้ง [REAL-TIME SYSTEM ALERTS] และ [KNOWLEDGE BASE]
2. แบ่งการตอบเป็น 3 มุมมอง: 📈 Demand Planner AI, 💼 Procurement AI, 📦 Warehouse AI
3. ปิดท้ายด้วย 🧠 Executive Summary สั้นๆ
4. ใช้ภาษาไทย ตอบชัดเจน กระชับ อ้างอิงตัวเลขจริง`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: [{ text: m.content }],
    }));

    // Bedrock Models (Nova, Claude) require the first message to be from a user.
    while (formattedMessages.length > 0 && formattedMessages[0].role !== "user") {
      formattedMessages.shift();
    }

    // Ensure strictly alternating roles to prevent ValidationException
    const alternatingMessages = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let expectedRole: any = "user";
    for (const msg of formattedMessages) {
      if (msg.role === expectedRole) {
        alternatingMessages.push(msg);
        expectedRole = expectedRole === "user" ? "assistant" : "user";
      } else {
        // Append text to the last message if the same role appears twice
        if (alternatingMessages.length > 0) {
          alternatingMessages[alternatingMessages.length - 1].content[0].text += "\n\n" + msg.content[0].text;
        }
      }
    }

    const body = JSON.stringify({
      schemaVersion: "messages-v1",
      system: [{ text: systemPrompt }],
      messages: alternatingMessages,
      inferenceConfig: {
        maxTokens: 2048,
        temperature: jsonMode ? 0.2 : 0.3,
        topP: 0.9,
      },
    });

    const invokeCommand = new InvokeModelCommand({
      modelId: "amazon.nova-pro-v1:0", // First-party model in us-east-1
      contentType: "application/json",
      accept: "application/json",
      body,
    });

    const response = await runtimeClient.send(invokeCommand);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const aiResponse = result.output?.message?.content?.[0]?.text || "ไม่สามารถประมวลผลได้";

    // Extract citation references to pass back to the frontend
    const citations = retrievedResults.map((r, index) => ({
      reference: `อ้างอิง ${index + 1}: ${r.location?.s3Location?.uri || 'เอกสารภายใน'}`
    }));

    return NextResponse.json({
      content: aiResponse,
      usage: result.usage,
      citations: citations,
    });
  } catch (error: unknown) {
    console.error("Bedrock error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
