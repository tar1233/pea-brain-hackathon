import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

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
    const { documentText } = await req.json();

    const systemPrompt = `คุณคือผู้ช่วย AI ด้านการจัดซื้อพัสดุของการไฟฟ้าส่วนภูมิภาค (PEA)
หน้าที่ของคุณคือดึงข้อมูล "กำลังผลิตขั้นต่ำ" และ "กำลังผลิตสูงสุด" จากข้อความเอกสารของ Vendor ที่ให้มา
ตอบเป็น JSON เท่านั้น โครงสร้าง:
{
  "minCapacity": <number>,
  "maxCapacity": "<number> - <number>" (หรือข้อความตามที่พบ),
  "vendorName": "<string>"
}`;

    const body = JSON.stringify({
      schemaVersion: "messages-v1",
      system: [{ text: systemPrompt }],
      messages: [{ role: "user", content: [{ text: `ข้อความจากเอกสาร: \n${documentText}` }] }],
      inferenceConfig: { maxTokens: 1024, temperature: 0.1 },
    });

    const invokeCommand = new InvokeModelCommand({ modelId: MODEL_ID, contentType: "application/json", accept: "application/json", body });
    const response = await runtimeClient.send(invokeCommand);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    let aiResponse = result.output?.message?.content?.[0]?.text || "{}";
    
    // Clean up potential markdown formatting
    aiResponse = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json({ success: true, data: JSON.parse(aiResponse) });
  } catch (error: any) {
    console.error("Bedrock Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
