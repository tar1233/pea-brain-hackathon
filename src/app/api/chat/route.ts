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

// ============================================================
// PEA Brain — Multi-Agent Orchestration Architecture
// ============================================================
// 
// ┌────────────────────────────────────────────────────┐
// │                  User Question                     │
// │           + Knowledge Base (RAG) Context           │
// └──────────┬─────────────┬─────────────┬─────────────┘
//            │             │             │
//   ┌────────▼───────┐ ┌──▼──────────┐ ┌▼───────────────┐
//   │ Procurement    │ │ Math/Logic  │ │ Risk           │
//   │ Agent          │ │ Agent       │ │ Agent          │
//   │ (ผู้ช่วยจัดซื้อ)│ │ (นักคำนวณ)  │ │ (ประเมินความเสี่ยง)│
//   └────────┬───────┘ └──┬──────────┘ └┬───────────────┘
//            │             │             │
//   ┌────────▼─────────────▼─────────────▼──────────────┐
//   │              Supervisor Agent                     │
//   │         (สรุปรวมผลจาก 3 Agent)                     │
//   └───────────────────────┬───────────────────────────┘
//                           │
//                    Final Response
// ============================================================

const REGION = "us-east-1";
const MODEL_ID = "amazon.nova-pro-v1:0";
const KNOWLEDGE_BASE_ID = "8HWXS46GOZ";

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

// ============================================================
// Agent System Prompts — Each agent has a UNIQUE expertise
// ============================================================

const AGENT_PROMPTS = {
  procurement: `คุณคือ "Procurement Agent" — ผู้เชี่ยวชาญด้านการจัดซื้อจัดจ้างของการไฟฟ้าส่วนภูมิภาค (กฟภ.)
คุณรู้ลึกเรื่อง:
- ระเบียบการจัดซื้อจัดจ้างภาครัฐ (พ.ร.บ.จัดซื้อจัดจ้าง 2560)
- ขั้นตอนการจัดซื้อแต่ละวิธี (e-bidding, เฉพาะเจาะจง, คัดเลือก)
- การบริหาร Vendor/Supplier และเงื่อนไขสัญญา
- กฎระเบียบราคากลาง งบประมาณ และการเบิกจ่าย

=== ตัวอย่างการวิเคราะห์ที่ดี (Case Study) ===
หม้อแปลง 160 kVA 3 เฟส รหัส SAP 10067:
- ความต้องการ/ปี: 2,454 เครื่อง | ราคาต่อหน่วย: 150,000 บาท | งบรวม: ~368 ล้านบาท
- ปัญหา: ซื้อทีเดียว Holding Cost = 47.3M/ปี และไม่มีที่เก็บสินค้า 2,454 เครื่อง
- แนะนำ: ทยอยซื้อ 4 รอบ (รายไตรมาส) รอบละ ~614 เครื่อง รอบละ 3 Lot (อัตรา 40/30/30%)
- ผลลัพธ์: Holding Cost ลดเหลือ 18.9M/ปี ประหยัด 28.4M/ปี
- กำลังผลิตรวมต่อไตรมาส: ~2,097 เครื่อง (เพียงพอรับ 614/รอบ) ไม่มี Unfulfilled
- ใช้สัญญากรอบราคา (Frame Agreement) ล็อคราคาทั้งปี ทยอยเรียกของ

กฎในการตอบ:
1. ตอบเฉพาะมุมมองด้านการจัดซื้อจัดจ้างเท่านั้น
2. แนะนำทยอยซื้อ (Quarterly) เป็นหลักเสมอ เพื่อลด TCO
3. อ้างอิงระเบียบและข้อกฎหมายที่เกี่ยวข้อง
4. ใช้ภาษาไทย กระชับ ชัดเจน อ้างอิงตัวเลขจริง
5. ตอบไม่เกิน 200 คำ`,

  math: `คุณคือ "Math & Logic Agent" — ผู้เชี่ยวชาญด้านคำนวณ Supply Chain ของ กฟภ.
คุณรู้ลึกเรื่อง:
- สูตร EOQ = √(2DS/H)
- สูตร ROP = (Average Daily Demand × Lead Time) + Safety Stock
- Safety Stock = Z × σ × √LT
- Total Cost of Ownership (TCO) = ต้นทุนสินค้า + Holding Cost
- Holding Cost = มูลค่าสต็อกเฉลี่ย × อัตรา Holding Cost (ปกติ 20%/ปี)

=== ตัวอย่างการคำนวณ TCO (Case Study) ===
หม้อแปลง 160 kVA: 2,454 เครื่อง/ปี @ 150,000 บาท = 368.1M

ซื้อทีเดียว:
  Holding Cost = 2,454 × 150,000 × 20% × 0.5 (สต็อกเฉลี่ย 50%) = 36,810,000 บาท/ปี
  TCO = 368,100,000 + 36,810,000 = 404,910,000 บาท

ทยอยซื้อ 4 รอบ (รอบละ 614 เครื่อง):
  Holding Cost = 2,454 × 150,000 × 20% × 0.2 (สต็อกเฉลี่ย 20%) = 14,724,000 บาท/ปี
  TCO = 368,100,000 + 14,724,000 = 382,824,000 บาท

ประหยัด: 404.9M - 382.8M = 22.1M/ปี (ลด 60% ของ Holding Cost)

กฎในการตอบ:
1. ต้องแสดงสูตรและขั้นตอนคำนวณที่ชัดเจน
2. ใส่ตัวเลขจริงจากข้อมูลที่ให้มาลงในสูตร
3. เปรียบเทียบ TCO ซื้อทีเดียว vs ทยอยซื้อเสมอ
4. สรุปผลลัพธ์เป็นตัวเลขที่ actionable
5. ตอบไม่เกิน 200 คำ`,

  risk: `คุณคือ "Risk Assessment Agent" — ผู้เชี่ยวชาญด้านประเมินความเสี่ยง Supply Chain ของ กฟภ.
คุณรู้ลึกเรื่อง:
- การประเมินความเสี่ยง Stockout (สินค้าขาดมือ)
- วิเคราะห์ผลกระทบทางการเงิน (Cost Impact)
- Vendor Risk Assessment (ความเสี่ยงจาก Supplier)
- Lead Time Variability Risk
- แผนบรรเทาความเสี่ยง (Mitigation Plan)

=== ตัวอย่างการประเมินความเสี่ยง (Case Study) ===
หม้อแปลง 160 kVA: สต็อกเหลือ 12 เครื่อง (ใช้ได้อีก 1 วัน) Lead Time 84 วัน ช่องว่าง 83 วัน
ความเสี่ยงหลัก:
- ซื้อทีเดียว 2,454 เครื่อง → Vendor ผลิตไม่ทัน + ไม่มีที่เก็บ + Holding Cost 47.3M
- ทยอยซื้อ 4 รอบ → Vendor ผลิตได้ + ลด Holding Cost เหลือ 18.9M + ถ้า Vendor ทิ้งงานมีรายอื่นพยุง

กฎในการตอบ:
1. ต้องระบุระดับความเสี่ยง (🔴 วิกฤต / 🟡 เตือน / 🟢 ปกติ)
2. ประเมินผลกระทบเป็นตัวเงิน (บาท)
3. เสนอ Mitigation Plan ที่ actionable
4. ห้ามอ้างอิงสงคราม โควิด แผ่นดินไหว หรือเหตุการณ์มหภาคที่ทำนายไม่ได้
5. ใช้ภาษาไทย กระชับ ชัดเจน
6. ตอบไม่เกิน 200 คำ`,
};

const SUPERVISOR_PROMPT = `คุณคือ "Supervisor Agent" ของระบบ PEA Brain — หน้าที่คือสังเคราะห์คำตอบจาก 3 Agent ผู้เชี่ยวชาญ
แล้วสรุปเป็นคำตอบเดียวที่ครบถ้วนและเข้าใจง่าย

คุณจะได้รับผลวิเคราะห์จาก:
1. 💼 Procurement Agent — มุมมองด้านจัดซื้อจัดจ้าง
2. 🧮 Math & Logic Agent — มุมมองด้านคำนวณ Supply Chain
3. ⚠️ Risk Agent — มุมมองด้านประเมินความเสี่ยง

กฎในการตอบ:
1. สรุปรวมแต่ละมุมมองให้เป็นหมวดหมู่ชัดเจน โดยใส่ emoji กำกับ
2. ปิดท้ายด้วย "🧠 Executive Summary" สั้นๆ 2-3 บรรทัด
3. ถ้า Agent ตัวใดให้ข้อมูลที่ขัดแย้งกัน ให้ระบุและเสนอแนวทาง
4. ใช้ภาษาไทย เป็นทางการแต่อ่านง่าย อ้างอิงตัวเลขจริง
5. ห้ามบอกว่าคุณเป็น AI หรือเป็น Supervisor ตอบในฐานะ "PEA Brain"`;

// ============================================================
// Helper: Call a single Bedrock agent
// ============================================================

async function callAgent(
  agentName: string,
  systemPrompt: string,
  userQuestion: string,
  contextText: string,
  liveAlerts: string
): Promise<{ agent: string; response: string }> {
  const fullSystemPrompt = `${systemPrompt}

⚠️ [REAL-TIME ALERTS]:
${liveAlerts || 'ไม่มีรายการวิกฤตในขณะนี้'}

📚 [KNOWLEDGE BASE]:
${contextText}`;

  const body = JSON.stringify({
    schemaVersion: "messages-v1",
    system: [{ text: fullSystemPrompt }],
    messages: [{ role: "user", content: [{ text: userQuestion }] }],
    inferenceConfig: {
      maxTokens: 800,
      temperature: 0.3,
      topP: 0.9,
    },
  });

  const invokeCommand = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  try {
    const response = await runtimeClient.send(invokeCommand);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const text = result.output?.message?.content?.[0]?.text || "ไม่สามารถประมวลผลได้";
    return { agent: agentName, response: text };
  } catch (error) {
    console.error(`[${agentName}] Error:`, error);
    return { agent: agentName, response: `⚠️ ${agentName} ไม่สามารถประมวลผลได้ในขณะนี้` };
  }
}

// ============================================================
// Helper: Call Supervisor to synthesize all agent responses
// ============================================================

async function callSupervisor(
  userQuestion: string,
  agentResults: { agent: string; response: string }[],
  contextText: string,
  liveAlerts: string,
  jsonMode: boolean = false
): Promise<string> {
  let promptText = SUPERVISOR_PROMPT;

  if (jsonMode) {
    promptText = `คุณคือ "Supervisor Agent" ของระบบ PEA Brain — หน้าที่คือสังเคราะห์คำตอบจาก 3 Agent ผู้เชี่ยวชาญ แล้วแปลงเป็น JSON ที่สมบูรณ์แบบ

คุณจะได้รับผลวิเคราะห์จาก:
1. 💼 Procurement Agent — มุมมองด้านจัดซื้อจัดจ้าง
2. 🧮 Math & Logic Agent — มุมมองด้านคำนวณ Supply Chain
3. ⚠️ Risk Agent — มุมมองด้านประเมินความเสี่ยง

กฎสำคัญที่สุด (JSON MODE):
- สังเคราะห์ข้อมูลจากทั้ง 3 Agent เพื่อเติมคำตอบใน JSON schema ที่ผู้ใช้ส่งมาให้
- ห้ามสร้าง JSON schema เอง ต้องใช้รูปแบบที่ผู้ใช้ระบุใน prompt ท้ายสุด
- ตอบเป็น JSON object เท่านั้น ห้ามมีข้อความอื่นใดก่อนหรือหลัง JSON
- ห้ามใช้ markdown code block (เช่น \`\`\`json)
- วิเคราะห์จากข้อมูลจริงของ Agent อ้างอิงตัวเลขจริง
- ทุก field ต้องมีข้อมูลเชิงลึก ห้ามเว้นว่างหรือใส่ "-"`;
  }

  const synthesizedContext = agentResults
    .map((r) => `[ผลวิเคราะห์จาก ${r.agent}]:\n${r.response}`)
    .join("\n\n");

  const supervisorInput = `คำถามจากผู้ใช้: "${userQuestion}"

ผลวิเคราะห์จาก 3 Agent ผู้เชี่ยวชาญ:
${synthesizedContext}

โปรดสังเคราะห์คำตอบรวมที่ครบถ้วน`;

  const fullSystemPrompt = `${promptText}

⚠️ [REAL-TIME ALERTS]:
${liveAlerts || 'ไม่มีรายการวิกฤตในขณะนี้'}

📚 [KNOWLEDGE BASE]:
${contextText}`;

  const body = JSON.stringify({
    schemaVersion: "messages-v1",
    system: [{ text: fullSystemPrompt }],
    messages: [{ role: "user", content: [{ text: supervisorInput }] }],
    inferenceConfig: {
      maxTokens: 2048,
      temperature: 0.25,
      topP: 0.9,
    },
  });

  const invokeCommand = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await runtimeClient.send(invokeCommand);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.output?.message?.content?.[0]?.text || "ไม่สามารถสรุปผลได้";
}

// ============================================================
// Helper: Format messages for Bedrock (alternating roles)
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatMessagesForBedrock(messages: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatted = messages.map((m: any) => ({
    role: m.role === "ai" ? "assistant" : "user",
    content: [{ text: m.content }],
  }));

  // Bedrock requires first message to be from user
  while (formatted.length > 0 && formatted[0].role !== "user") {
    formatted.shift();
  }

  // Ensure strictly alternating roles
  const alternating = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let expectedRole: any = "user";
  for (const msg of formatted) {
    if (msg.role === expectedRole) {
      alternating.push(msg);
      expectedRole = expectedRole === "user" ? "assistant" : "user";
    } else {
      if (alternating.length > 0) {
        alternating[alternating.length - 1].content[0].text += "\n\n" + msg.content[0].text;
      }
    }
  }

  return alternating;
}

// ============================================================
// Main API Route — POST /api/chat
// ============================================================

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

    // ── Step 1: Retrieve from Knowledge Base (RAG) ──
    const recentUserMessages = messages
      .filter((m: { role: string; content: string }) => m.role === "user")
      .slice(-2)
      .map((m: { role: string; content: string }) => m.content)
      .join(" ");
    const retrievalQueryText = recentUserMessages.substring(0, 1000);

    const retrieveCommand = new RetrieveCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      retrievalQuery: { text: retrievalQueryText },
      retrievalConfiguration: {
        vectorSearchConfiguration: { numberOfResults: 5 },
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

    // Inject live dashboard alerts
    const liveAlerts = riskAlerts
      .filter(a => a.severity === "critical")
      .map(a => `- ⚠️ ${a.materialId} (${a.materialName}): ${a.message} -> เสนอให้: ${a.recommendation}`)
      .join("\n");

    // ── Step 2: Multi-Agent Orchestration (Always executed for both Chat & EBidding JSON) ──
    console.log("[Multi-Agent] Starting parallel agent execution...");
    const startTime = Date.now();

    // Run all 3 agents in PARALLEL
    const [procurementResult, mathResult, riskResult] = await Promise.all([
      callAgent("💼 Procurement Agent (ผู้ช่วยจัดซื้อ)", AGENT_PROMPTS.procurement, lastUserMessage.content, contextText, liveAlerts),
      callAgent("🧮 Math & Logic Agent (นักคำนวณ)", AGENT_PROMPTS.math, lastUserMessage.content, contextText, liveAlerts),
      callAgent("⚠️ Risk Agent (ประเมินความเสี่ยง)", AGENT_PROMPTS.risk, lastUserMessage.content, contextText, liveAlerts),
    ]);

    const agentTime = Date.now() - startTime;
    console.log(`[Multi-Agent] 3 agents completed in ${agentTime}ms`);

    // ── Step 3: Supervisor synthesizes all agent outputs ──
    console.log("[Supervisor] Synthesizing agent outputs...");
    const supervisorResponse = await callSupervisor(
      lastUserMessage.content,
      [procurementResult, mathResult, riskResult],
      contextText,
      liveAlerts,
      jsonMode
    );

    const totalTime = Date.now() - startTime;
    console.log(`[Multi-Agent] Total orchestration time: ${totalTime}ms`);

    // Extract citations
    const citations = retrievedResults.map((r, index) => ({
      reference: `อ้างอิง ${index + 1}: ${r.location?.s3Location?.uri || 'เอกสารภายใน'}`
    }));

    return NextResponse.json({
      content: supervisorResponse,
      usage: { agentCount: 3, supervisorCalls: 1, totalCalls: 4, orchestrationTimeMs: totalTime },
      citations: citations,
      agentMode: "multi-agent",
      agentDetails: [
        { name: "Procurement Agent", response: procurementResult.response },
        { name: "Math & Logic Agent", response: mathResult.response },
        { name: "Risk Agent", response: riskResult.response },
      ],
    });
  } catch (error: unknown) {
    console.error("Bedrock Multi-Agent error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
