import { NextRequest, NextResponse } from "next/server";
import {
  BedrockAgentRuntimeClient,
  RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

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
    const { messages } = await req.json();

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
      .filter((m: any) => m.role === "user")
      .slice(-2)
      .map((m: any) => m.content)
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

import { riskAlerts, materials } from "../../data/mockData";

    // ... inside POST ...
    
    // Inject Live Dashboard Context into the AI
    const liveAlerts = riskAlerts
      .filter(a => a.severity === "critical")
      .map(a => `- ⚠️ ${a.materialId} (${a.materialName}): ${a.message} -> เสนอให้: ${a.recommendation}`)
      .join("\n");

    // 2. Generate answer using Amazon Nova Pro
    const systemPrompt = `คุณคือ "PEA Brain" — ผู้ช่วย AI อัจฉริยะ (Agentic AI) สำหรับวางแผนจัดซื้อพัสดุของการไฟฟ้าส่วนภูมิภาค (กฟภ./PEA)
คุณเชี่ยวชาญด้าน Supply Chain, Procurement, Inventory Management และ Demand Forecasting สำหรับหม้อแปลงไฟฟ้า

⚠️ **[REAL-TIME SYSTEM ALERTS] ข้อมูลแจ้งเตือนวิกฤตบน Dashboard ปัจจุบัน:**
${liveAlerts || 'ไม่มีรายการวิกฤตในขณะนี้'}

📚 **[KNOWLEDGE BASE] ข้อมูลบริบทเชิงลึกที่ค้นพบจากเอกสาร PEA:**
<context>
${contextText}
</context>

กฎในการตอบ:
1. วิเคราะห์ข้อมูลจากทั้ง [REAL-TIME SYSTEM ALERTS] และ [KNOWLEDGE BASE] เพื่อตอบคำถาม
2. ตอบเป็นภาษาไทย สั้น กระชับ อ้างอิงตัวเลขและข้อมูลจริง
3. ใช้ emoji (🔴 วิกฤต 🟡 เฝ้าระวัง 🟢 ปกติ) เพื่อความสวยงาม
4. หากพบว่ารายการที่ผู้ใช้ถาม ตรงกับรายการใน [REAL-TIME SYSTEM ALERTS] ให้แสดงความเร่งด่วนและเสนอให้ผู้ใช้ดำเนินการทันที
5. หากเป็นการแนะนำให้สั่งซื้อ ให้เสนอให้ผู้บริหาร "กดปุ่มอนุมัติ" ที่หน้าจอได้เลย (Agentic Workflow)
6. หากพูดถึง "ราคาถูก/คุ้มที่สุด" ให้ใช้สีเขียว <span style="color: #16a34a; font-weight: bold;">(ข้อความ)</span> และ "ราคาแพงที่สุด" ให้ใช้สีแดง <span style="color: #dc2626; font-weight: bold;">(ข้อความ)</span>
7. หากมีข้อความที่เป็น "คำแนะนำ" ให้ทำตัวหนาและใช้สีม่วง (ธีมหลักของ PEA) เช่น <span style="color: #7e22ce; font-weight: bold;">คำแนะนำ:</span>

ตัวอย่างการตอบคำถาม (Few-Shot Examples):
User: สรุปสถานะหม้อแปลง 10067 หน่อย
AI: 🔴 **หม้อแปลง 160 kVA (รหัส 10067)** อยู่ในเกณฑ์วิกฤตสูงสุดบน Dashboard วันนี้ครับ!
- **สถานะ**: สต็อกปัจจุบัน 185 เครื่อง (ต่ำกว่า Safety Stock 83%)
- <span style="color: #7e22ce; font-weight: bold;">คำแนะนำด่วน:</span> ระบบคำนวณแล้วว่าควรเร่งสั่งซื้อ 878 เครื่อง (มูลค่าประมาณ ฿169.3 ล้าน) เพื่อหลีกเลี่ยง Shortage Gap
👉 *กรุณากดปุ่ม "อนุมัติการดำเนินงาน" ในหน้า ประวัติกิจกรรม (Logs) เพื่อให้ระบบส่งคำสั่งไปยังแผนกจัดซื้ออัตโนมัติครับ*

User: แล้ว 10066 ละ
AI: 🔴 **หม้อแปลง 100 kVA (รหัส 10066)** ก็มีการแจ้งเตือนบนระบบเช่นกันครับ
- **สถานะ**: สต็อกต่ำกว่า Safety Stock 86% และ Demand ผันผวนสูงมาก
- <span style="color: #7e22ce; font-weight: bold;">คำแนะนำด่วน:</span> แนะนำให้แบ่งสั่งซื้อเป็น 3 รอบ รวม 2,035 เครื่อง (มูลค่า ฿260.2 ล้าน) เพื่อกระจายความเสี่ยงครับ
👉 *สามารถกดดูรายละเอียดเพิ่มเติมและอนุมัติใบสั่งซื้อได้ที่หน้า พัสดุคงคลัง ครับ*`;

    let formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: [{ text: m.content }],
    }));

    // Bedrock Models (Nova, Claude) require the first message to be from a user.
    while (formattedMessages.length > 0 && formattedMessages[0].role !== "user") {
      formattedMessages.shift();
    }

    // Ensure strictly alternating roles to prevent ValidationException
    const alternatingMessages = [];
    let expectedRole = "user";
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
        maxTokens: 1024,
        temperature: 0.3, // Lower temperature for more accurate RAG response
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
