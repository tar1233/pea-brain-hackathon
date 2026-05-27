import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { materials } from "../../data/mockData";

export const dynamic = "force-dynamic";

const REGION = "us-east-1";
const MODEL_ID = "amazon.nova-pro-v1:0";

const credentials = {
  accessKeyId: process.env.PEA_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.PEA_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
};

const runtimeClient = new BedrockRuntimeClient({
  region: REGION,
  credentials: credentials.accessKeyId ? credentials : undefined,
});

export async function POST(req: NextRequest) {
  try {
    let inputMaterials = materials;
    try {
      const body = await req.json();
      if (body.materials && Array.isArray(body.materials)) {
        inputMaterials = body.materials;
      }
    } catch (e) {
      // ignore
    }

    // Prepare context for the AI
    const materialsContext = inputMaterials.map((m: any) => `
ID: ${m.id} | Name: ${m.name}
Current Stock: ${m.currentStock} ${m.unit}
Safety Stock: ${m.safetyStock} | ROP: ${m.reorderPoint}
Avg Monthly Demand: ${m.avgMonthlyDemand}
Lead Time: ${m.leadTimeWeeks} weeks
Unit Price: ${m.unitPrice} THB
`).join("\n");

    const systemPrompt = `คุณคือ "Risk Agent" AI ประเมินความเสี่ยงด้าน Supply Chain ของ PEA
วิเคราะห์ข้อมูลพัสดุและระบุความเสี่ยงที่พบ (เช่น ของขาด, สต็อกเยอะเกิน)

กฎ:
1. ตอบกลับเป็น JSON Array ของ object เท่านั้น ห้ามมีข้อความอื่น
2. แต่ละ object มีโครงสร้างดังนี้:
{
  "id": "gen-id",
  "materialId": "รหัสพัสดุ",
  "materialName": "ชื่อพัสดุ",
  "type": "shortage หรือ overstock หรือ demand_surge",
  "severity": "critical หรือ warning หรือ info",
  "message": "ข้อความแจ้งเตือนสั้นๆ (สต็อกต่ำกว่าเกณฑ์ ฯลฯ)",
  "detail": "รายละเอียดเชิงลึก อ้างอิงตัวเลข",
  "recommendation": "คำแนะนำ (สั่งซื้อเร่งด่วน ฯลฯ)",
  "costImpact": ตัวเลขผลกระทบทางการเงิน (ไม่มีลูกน้ำ),
  "confidence": ความมั่นใจ (0-100)
}
3. วิเคราะห์ทุกรายการที่มีปัญหา หากตัวไหนปกติไม่ต้องสร้าง alert สำหรับตัวนั้น
4. ให้สร้าง alert อย่างน้อย 2-3 รายการที่สำคัญที่สุด`;

    const body = JSON.stringify({
      schemaVersion: "messages-v1",
      system: [{ text: systemPrompt }],
      messages: [{ role: "user", content: [{ text: `นี่คือข้อมูลพัสดุปัจจุบัน:\n${materialsContext}\nโปรดวิเคราะห์ความเสี่ยงและคืนค่าเป็น JSON array` }] }],
      inferenceConfig: {
        maxTokens: 4096,
        temperature: 0.2,
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
    let aiResponse = result.output?.message?.content?.[0]?.text || "[]";

    // Clean up potential markdown formatting
    aiResponse = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    let alerts = [];
    try {
      alerts = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON", aiResponse);
      alerts = []; // fallback to empty
    }

    return NextResponse.json({
      success: true,
      alerts: alerts,
      usage: result.usage,
    });

  } catch (error: unknown) {
    console.error("Bedrock Risk Analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
