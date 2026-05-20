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

กฎในการตอบ (Multi-Agent Collaboration Mode):
1. วิเคราะห์ข้อมูลจากทั้ง [REAL-TIME SYSTEM ALERTS] และ [KNOWLEDGE BASE] เพื่อตอบคำถาม
2. หากเป็นการวิเคราะห์ปัญหาภาพรวม หรือการสั่งซื้อหลัก ให้จำลองการทำงานแบบ **Multi-Agent Collaboration** โดยแบ่งการตอบเป็น 3 มุมมอง:
   - 📈 **Demand Planner AI:** วิเคราะห์ปริมาณที่ต้องการ, แนวโน้ม (Trend), และความเสี่ยงของแผนก
   - 💼 **Procurement AI:** เสนอกลยุทธ์การจัดซื้อ, ราคา, การต่อรอง, และงบประมาณ (EOQ)
   - 📦 **Warehouse AI:** วิเคราะห์พื้นที่จัดเก็บ, ผลกระทบต่อคลัง, และแผนการรับของ
3. ปิดท้ายด้วย 🧠 **Executive Summary** สั้นๆ 1-2 บรรทัด
4. หากเป็นการแนะนำให้สั่งซื้อ ให้เสนอให้ผู้บริหาร "กดปุ่มอนุมัติ" ที่หน้าจอได้เลย (Agentic Workflow)
5. ใช้สีเน้นข้อความ: <span style="color: #16a34a; font-weight: bold;">(สีเขียว=ประหยัด/ดี)</span>, <span style="color: #dc2626; font-weight: bold;">(สีแดง=ความเสี่ยง/แพง)</span>, และ <span style="color: #7e22ce; font-weight: bold;">(สีม่วง=ข้อเสนอแนะหลัก)</span>

ตัวอย่างการตอบ (Multi-Agent Format):
User: สรุปสถานะหม้อแปลง 10067 หน่อย
AI: 🔴 **หม้อแปลง 160 kVA (รหัส 10067)** อยู่ในเกณฑ์วิกฤตสูงสุด! ระบบได้ทำการวิเคราะห์ร่วมกัน 3 แผนกดังนี้ครับ:

📈 **Demand Planner AI:**
- สต็อกปัจจุบัน 185 เครื่อง ต่ำกว่า Safety Stock 83% ในขณะที่ Demand เฉลี่ยอยู่ที่ 339 เครื่อง/เดือน มีความเสี่ยงสูงมากที่จะเกิด Shortage ในเดือนหน้า

💼 **Procurement AI:**
- แนะนำเร่งจัดซื้อจำนวน **878 เครื่อง** (อ้างอิงจาก EOQ) มูลค่ารวม <span style="color: #dc2626; font-weight: bold;">฿169.3 ล้าน</span> ควรต่อรอง Lead time กับ Vendor ให้สั้นลงจาก 12 สัปดาห์

📦 **Warehouse AI:**
- พื้นที่คลังกลาง (Central Warehouse) มีพื้นที่ว่างเพียงพอสำหรับรองรับ 878 เครื่อง แนะนำให้แบ่งรับของเป็น 2 งวด งวดละ 439 เครื่อง

🧠 **Executive Summary:**
<span style="color: #7e22ce; font-weight: bold;">คำแนะนำด่วน:</span> ควรอนุมัติการสั่งซื้อ 878 เครื่องทันทีเพื่อป้องกันผลกระทบต่อแผนงานปี 2569
👉 *กรุณากดปุ่ม "อนุมัติการดำเนินงาน" ในหน้า ประวัติกิจกรรม เพื่อสร้างใบสั่งซื้อ (PO) อัตโนมัติครับ*`;

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
