"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, TrendingDown, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, ArrowLeft, BarChart3, Target, Zap, Package, Clock } from "lucide-react";
import { useData } from "../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString()}`;
}

interface PlanDetail {
  title: string;
  qty: number;
  futureImpact: string;
  supplyForecast: string;
  costAnalysis: string;
  riskScenarios: string;
  mitigation: string;
  problemResolved: string;
}

interface AIAnalysisResult {
  demandAnalysis: string;
  marketAnalysis: string;
  supplierAnalysis: string;
  emergencyPlan: string;
  priceForecast: { threeMonth: string; oneYear: string; bestTimeToBuy: string };
  lotStrategy: { recommendation: string; totalQty: number; numLots: number; qtyPerLot: number; reason: string; savings: string };
  lotSchedule: Array<{ lot: number; qty: number; orderMonth: string; receiveMonth: string; action: string }>;
  planA: PlanDetail;
  planB: PlanDetail;
  executiveSummary: string;
  raw?: string;
}

export default function EBiddingView({ targetMaterialId = "10067", setActiveTab, onClose }: { targetMaterialId?: string, setActiveTab?: (tab: string) => void, onClose?: () => void }) {
  const { eBiddingData, materials, riskAlerts } = useData();
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false);

  const material = materials.find(m => m.id === targetMaterialId || m.sapCode === targetMaterialId);
  const alert = riskAlerts.find(a => a.materialId === targetMaterialId || a.materialId === `MAT-${targetMaterialId}`);

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;
    callAI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function callAI() {
    setIsAnalyzing(true);
    setError(null);
    setAiResult(null);

    const mat = material;
    const annualBudget = mat ? mat.annualDemand * mat.unitPrice : 0;
    const daysOfStock = mat ? Math.round(mat.currentStock / (mat.avgMonthlyDemand / 30)) : 0;
    const monthsOfStock = mat ? (mat.currentStock / mat.avgMonthlyDemand).toFixed(1) : '0';
    const stockVsSafety = mat ? Math.round(((mat.safetyStock - mat.currentStock) / mat.safetyStock) * 100) : 0;
    const demandVariation = mat ? Math.round((mat.stdMonthlyDemand / mat.avgMonthlyDemand) * 100) : 0;
    const leadTimeDays = mat ? Math.round(mat.leadTimeWeeks * 7) : 0;
    const gapDays = leadTimeDays - daysOfStock;
    const shortfallQty = mat ? Math.round((gapDays / 30) * mat.avgMonthlyDemand) : 0;

    const prompt = `คุณเป็นที่ปรึกษาจัดซื้อระดับ Enterprise ของ PEA (การไฟฟ้าส่วนภูมิภาค)

═══ ข้อมูลพัสดุ: ${mat?.name} (${targetMaterialId}) ═══
สต็อก: ${mat?.currentStock} ${mat?.unit} (ใช้ได้อีก ${daysOfStock} วัน = ${monthsOfStock} เดือน)
Safety Stock: ${mat?.safetyStock} ${mat?.unit} | ขาด: ${stockVsSafety}%
เบิกจ่าย: ${mat?.avgMonthlyDemand} ${mat?.unit}/เดือน (ค่าเบี่ยงเบน ${demandVariation}%)
Lead Time: ${mat?.leadTimeWeeks} สัปดาห์ (${leadTimeDays} วัน)
ราคา: ฿${mat?.unitPrice?.toLocaleString()}/หน่วย | ราคากลาง: ฿${mat?.budgetPrice?.toLocaleString()}
แผน 2569: ${mat?.annualDemand} ${mat?.unit} (งบ ≈ ฿${annualBudget.toLocaleString()})
EOQ: ${mat?.eoq} ${mat?.unit}
ประวัติเบิกจ่าย 12 เดือน: [${mat?.sparkline?.join(', ')}]
${alert ? `แจ้งเตือน: ${alert.message} | คำแนะนำเดิม: ${alert.recommendation}` : ''}

⚠️ วิกฤต: สต็อกเหลือ ${daysOfStock} วัน แต่ Lead Time ${leadTimeDays} วัน → ช่องว่าง ${gapDays} วัน ที่จะไม่มีของใช้!
ระหว่างช่องว่างนี้จะขาดของ ≈ ${shortfallQty} ${mat?.unit}

═══ กฎ: ห้ามถามคำถามกลับ ห้ามเขียน "...ไหม?" ต้องตอบเป็นข้อสรุปเท่านั้น ═══
═══ กฎ: ทุก field ต้องมีคำตอบจริง ห้ามเว้นว่าง ห้ามเขียนว่า "-" ═══
═══ กฎ: ทุกคำตอบต้องมีเหตุผลกำกับว่า "เพราะ..." ═══

ตอบ JSON ตามนี้ (ห้ามมี markdown ห้ามมี text อื่น):
{
  "demandAnalysis": "[ตอบ] สต็อก ${mat?.currentStock} ชิ้น ใช้ได้อีก X วัน เพราะ Demand เฉลี่ย ${mat?.avgMonthlyDemand} ต่อเดือน ≈ X ต่อวัน → ต้องสั่งทันทีเพราะ... (ระบุเหตุผลจากตัวเลข)",
  "marketAnalysis": "[ตอบ] ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} สูงกว่าราคากลาง ฿${mat?.budgetPrice?.toLocaleString()} อยู่ X% เพราะ... ควรเปิดประกวดราคาเดือน X เพราะ... ถ้าจัดซื้อเร่งด่วนราคาจะแพงขึ้น X% เพราะ...(ระบุเหตุผลจริง เช่น ราคาทองแดงโลกขึ้น, ค่าขนส่งสูง, ไม่มี competitive bidding)",
  "supplierAnalysis": "[ตอบ] Lead Time ${mat?.leadTimeWeeks} สัปดาห์ = ${leadTimeDays} วัน แต่สต็อกเหลือ ${daysOfStock} วัน → ช่องว่าง ${gapDays} วัน ต้องเจรจา Supplier ให้ส่งเร็วขึ้นเหลือ X สัปดาห์ เพราะ... หรือหา Supplier สำรองที่ส่งได้ใน X สัปดาห์",
  "emergencyPlan": "[ตอบเป็นข้อ]\n1. ขอยืมจากคลังภูมิภาคอื่น จำนวน ${shortfallQty} ชิ้น เพื่ออุดช่องว่าง ${gapDays} วัน เพราะ...\n2. ยื่นจัดซื้อเร่งด่วนตามระเบียบพัสดุ มาตรา X เพราะ...\n3. ปรับลดการเบิกจ่ายเหลือ X ชิ้น/เดือน (ลดลง X%) โดยจัดลำดับความสำคัญ เพราะ...\n4. แจ้งหน่วยงาน X, Y, Z ว่าอาจได้รับผลกระทบ เพราะ...",
  "planA": {
    "title": "ชื่อแผนสั้นๆ",
    "qty": ตัวเลข,
    "futureImpact": "[ตอบ] สั่ง X ชิ้น → สต็อกรวมจะเป็น X ชิ้น ใช้ได้อีก X เดือน (คำนวณ: X ÷ ${mat?.avgMonthlyDemand} = X เดือน) ความต้องการทั้งปี ${mat?.annualDemand} ชิ้น ครอบคลุม X% เพราะ...",
    "supplyForecast": "[ตอบ] สั่ง X ชิ้น + สต็อกเดิม ${mat?.currentStock} = X ชิ้น ÷ ${mat?.avgMonthlyDemand} ต่อเดือน = อยู่ได้อีก X เดือน ต้องสั่งเพิ่มอีกรอบเดือน X เพราะ... ปัญหาขาดแคลนจะจบใน X เดือน เพราะ...",
    "costAnalysis": "[ตอบ] ต้นทุนรวม = X ชิ้น × ฿${mat?.unitPrice?.toLocaleString()} = ฿X ประหยัดกว่าราคากลาง X% = ฿X เพราะ... คุ้มค่ากว่าไม่ทำอะไร เพราะถ้าไม่สั่งจะเกิด...",
    "riskScenarios": "[ตอบ] 1) Demand พุ่ง 20%: สต็อกจะหมดเร็วขึ้น X เดือน ต้องสั่งเพิ่มอีก X ชิ้น 2) ราคาขึ้น 15%: งบจะเพิ่ม ฿X ต้องขออนุมัติเพิ่ม 3) Supplier ส่งช้า 2 สัปดาห์: ต้องยืมจากคลังอื่น X ชิ้น",
    "mitigation": "[ตอบ] 1) ถ้า Demand พุ่ง → สั่งเพิ่มอีก X ชิ้นในเดือน X โดยใช้วิธี... 2) ถ้าราคาขึ้น → ล็อคราคาล่วงหน้ากับ Supplier โดย... 3) ถ้าส่งช้า → ยืมจากคลัง X จำนวน X ชิ้น แล้วคืนเมื่อของมาถึง",
    "problemResolved": "[ตอบ] สั่ง X ชิ้น → สต็อก X ชิ้น เหนือ Safety Stock ${mat?.safetyStock} ชิ้น → ปัญหาจบ/ไม่จบ เพราะ... ถ้ายังไม่จบ ต้องสั่งเพิ่มอีก X ชิ้นในเดือน X"
  },
  "planB": {
    "title": "ชื่อแผนสำรอง",
    "qty": ตัวเลข,
    "futureImpact": "[ตอบ] สั่ง X ชิ้น → สต็อกอยู่ได้ X เดือน ครอบคลุม X% ของแผนปี เพราะ...",
    "supplyForecast": "[ตอบ] อยู่ได้ X เดือน ต้องสั่งเพิ่มอีกเดือน X เพราะ... ปัญหาจะจบใน X เดือน",
    "costAnalysis": "[ตอบ] ต้นทุน ฿X ประหยัด/แพงกว่า Plan A อยู่ ฿X เพราะ...",
    "riskScenarios": "[ตอบ] 1) ความเสี่ยง X: จะเกิดผลกระทบ Y เพราะ... 2) ความเสี่ยง X: จะเกิดผลกระทบ Y เพราะ...",
    "mitigation": "[ตอบ] 1) ถ้าเกิดความเสี่ยง X → ทำ Y เพราะ... 2) ถ้าเกิดความเสี่ยง X → ทำ Y เพราะ...",
    "problemResolved": "[ตอบ] สต็อกจะกลับมาเหนือ Safety Stock ใน X เดือน เพราะ... ต้องสั่งเพิ่มอีก X ครั้ง"
  },
  "priceForecast": {
    "threeMonth": "[ตอบ] ราคาจะขึ้น/ลง X% จาก ฿${mat?.unitPrice?.toLocaleString()} เป็น ฿X เพราะ... (ระบุเหตุผลเช่น ราคาวัตถุดิบ, อัตราแลกเปลี่ยน, สถานการณ์ตลาดโลก)",
    "oneYear": "[ตอบ] ราคาจะขึ้น/ลง X% เป็น ฿X เพราะ... (ระบุปัจจัยที่มีผล 2-3 ปัจจัย)",
    "bestTimeToBuy": "[ตอบ] ช่วง เดือน X-Y เพราะ... (ระบุเหตุผล 2-3 ข้อ เช่น ราคาวัตถุดิบลดลง, สิ้นปีงบ Supplier ลดราคา)"
  },
  "lotStrategy": {
    "recommendation": "[ตอบ] แนะนำสั่ง X Lot เพราะ... (ถ้าแนะนำ 1 Lot ห้ามเขียนว่าประหยัดเทียบกับสั่งทีเดียว)",
    "totalQty": ตัวเลข,
    "numLots": ตัวเลข,
    "qtyPerLot": ตัวเลข,
    "reason": "[ตอบ] คุ้มค่าที่สุดเพราะ... (ระบุเหตุผลด้านต้นทุน คลัง ความเสี่ยง)",
    "savings": "[ตอบ] ประหยัด ฿X เทียบกับวิธีอื่น เพราะ... (ถ้าสั่ง 1 Lot ให้เทียบกับการซอยหลาย Lot)"
  },
  "lotSchedule": [
    { "lot": 1, "qty": ตัวเลข, "orderMonth": "เดือน X ปี 2569", "receiveMonth": "เดือน X ปี 2569 (คำนวณจาก Lead Time ${mat?.leadTimeWeeks} สัปดาห์)", "action": "ทำ TOR → เปิดประกวดราคา → ออก PO" }
  ],
  "executiveSummary": "[ตอบ] สต็อกเหลือ ${daysOfStock} วัน แต่ Lead Time ${leadTimeDays} วัน ช่องว่าง ${gapDays} วัน → ต้องดำเนินการทันที เพราะ... ถ้าไม่ทำจะเกิด... (สรุป 2-3 ประโยค อ้างอิงตัวเลข)"
}

สำคัญมาก: ตอบเป็น JSON เท่านั้น ห้ามมี text อื่นนอก JSON ห้ามมี markdown
กฎเด็ดขาด: ทุกคำตอบต้องเป็น "ข้อสรุป" ที่มีเหตุผลว่า "เพราะ..." ห้ามถามคำถามกลับ ห้ามเขียน "...ไหม?" "...หรือไม่?" ห้ามเว้นว่าง ห้ามใช้ "-"
ถ้าแนะนำ 1 Lot ให้เทียบประหยัดกับซอยหลาย Lot ถ้าแนะนำหลาย Lot ให้เทียบกับสั่งทีเดียว`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], jsonMode: true }),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      const content = data.content || "";
      // Robust JSON extraction with repair
      let jsonStr = content;
      // Remove markdown fences
      jsonStr = jsonStr.replace(/```json\s*/gi, "").replace(/```\s*/gi, "");
      // Remove any text before first { and after last }
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      } else if (firstBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace);
      }
      jsonStr = jsonStr.trim();

      // Try to repair truncated JSON (AI might run out of tokens)
      const repairJson = (s: string): string => {
        let openBraces = 0, openBrackets = 0;
        let inString = false, escape = false;
        for (let i = 0; i < s.length; i++) {
          const c = s[i];
          if (escape) { escape = false; continue; }
          if (c === '\\') { escape = true; continue; }
          if (c === '"') { inString = !inString; continue; }
          if (inString) continue;
          if (c === '{') openBraces++;
          if (c === '}') openBraces--;
          if (c === '[') openBrackets++;
          if (c === ']') openBrackets--;
        }
        // Remove trailing comma before closing
        s = s.replace(/,\s*$/, '');
        // Close any unclosed strings
        if (inString) s += '"';
        // Close unclosed arrays and objects
        while (openBrackets > 0) { s += ']'; openBrackets--; }
        while (openBraces > 0) { s += '}'; openBraces--; }
        return s;
      };

      let parsed = null;
      // Attempt 1: Parse as-is
      try { parsed = JSON.parse(jsonStr); } catch { /* continue */ }
      // Attempt 2: Repair and parse
      if (!parsed) {
        try { parsed = JSON.parse(repairJson(jsonStr)); } catch { /* continue */ }
      }
      // Attempt 3: Try to extract partial JSON by cutting at last valid key
      if (!parsed) {
        try {
          // Find last complete key-value pair
          const lastQuote = jsonStr.lastIndexOf('"');
          if (lastQuote > 0) {
            // Find the end of the last complete value
            const truncated = jsonStr.substring(0, lastQuote + 1);
            parsed = JSON.parse(repairJson(truncated));
          }
        } catch { /* continue */ }
      }

      if (parsed) {
        setAiResult({
          demandAnalysis: parsed.demandAnalysis || "ไม่สามารถวิเคราะห์ได้",
          marketAnalysis: parsed.marketAnalysis || "ไม่สามารถวิเคราะห์ได้",
          supplierAnalysis: parsed.supplierAnalysis || "ไม่สามารถวิเคราะห์ได้",
          emergencyPlan: parsed.emergencyPlan || "",
          priceForecast: parsed.priceForecast || { threeMonth: "-", oneYear: "-", bestTimeToBuy: "-" },
          lotStrategy: parsed.lotStrategy || { recommendation: "-", totalQty: 0, numLots: 1, qtyPerLot: 0, reason: "-", savings: "-" },
          lotSchedule: parsed.lotSchedule || [],
          planA: parsed.planA || { title: "Plan A", qty: 0, futureImpact: "-", supplyForecast: "-", costAnalysis: "-", riskScenarios: "-", mitigation: "-", problemResolved: "-" },
          planB: parsed.planB || { title: "Plan B", qty: 0, futureImpact: "-", supplyForecast: "-", costAnalysis: "-", riskScenarios: "-", mitigation: "-", problemResolved: "-" },
          executiveSummary: parsed.executiveSummary || "",
          raw: content,
        });
      } else {
        setAiResult({
          demandAnalysis: "AI วิเคราะห์แล้ว (ดูรายละเอียดด้านล่าง)",
          marketAnalysis: "กรุณาดู Raw AI Response ด้านล่าง",
          supplierAnalysis: "กรุณาดู Raw AI Response ด้านล่าง",
          emergencyPlan: "",
          priceForecast: { threeMonth: "-", oneYear: "-", bestTimeToBuy: "-" },
          lotStrategy: { recommendation: "-", totalQty: 0, numLots: 1, qtyPerLot: 0, reason: "-", savings: "-" },
          lotSchedule: [],
          planA: { title: "ดูคำแนะนำ AI ด้านล่าง", qty: mat?.eoq || 0, futureImpact: "-", supplyForecast: "-", costAnalysis: content.substring(0, 500), riskScenarios: "-", mitigation: "-", problemResolved: "-" },
          planB: { title: "ทางเลือกสำรอง", qty: 0, futureImpact: "-", supplyForecast: "-", costAnalysis: "-", riskScenarios: "-", mitigation: "-", problemResolved: "-" },
          executiveSummary: "",
          raw: content,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (!eBiddingData) return null;
  const { simulation } = eBiddingData;
  const daysOfStock = material ? Math.round(material.currentStock / (material.avgMonthlyDemand / 30)) : 0;
  const stockPercent = material ? Math.round((material.currentStock / material.safetyStock) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* ═══ HERO HEADER ═══ */}
      <header className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white">
        <div className="max-w-[1400px] mx-auto px-8 pt-6 pb-8">
          <button onClick={onClose} className="mb-5 inline-flex items-center gap-2 text-[12px] text-white/60 hover:text-white transition font-medium cursor-pointer">
            <ArrowLeft size={14} /> กลับหน้า Risk Management
          </button>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white/80 uppercase mb-3">
                <Sparkles size={13} />
                AI-Powered Analysis • AWS Bedrock + RAG
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-tight">
                {material?.name || targetMaterialId}
              </h1>
              <p className="mt-1.5 text-[13px] text-white/60 font-medium">
                รหัส SAP: {material?.sapCode || targetMaterialId} • {material?.category || 'หม้อแปลงไฟฟ้า'}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[110px]">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">สต็อกเหลือ</div>
                <div className={`text-[30px] font-black leading-none ${stockPercent < 30 ? 'text-red-300' : 'text-white'}`}>{daysOfStock}</div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">วัน</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[110px]">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Safety Stock</div>
                <div className={`text-[30px] font-black leading-none ${stockPercent < 30 ? 'text-red-300' : 'text-amber-300'}`}>{stockPercent}%</div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">ของเกณฑ์</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[130px]">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">ราคาต่อหน่วย</div>
                <div className="text-[24px] font-black leading-none">{formatCurrency(material?.unitPrice || 0)}</div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">ราคากลาง: {formatCurrency(material?.budgetPrice || 0)}</div>
              </div>
            </div>
          </div>

          {/* Live Data Chips */}
          <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
            {[
              { label: "สต็อก", value: `${material?.currentStock?.toLocaleString()} ${material?.unit}`, icon: "📦" },
              { label: "Safety Stock", value: `${material?.safetyStock?.toLocaleString()} ${material?.unit}`, icon: "🔴" },
              { label: "Demand/เดือน", value: `${material?.avgMonthlyDemand?.toLocaleString()} (σ=${material?.stdMonthlyDemand})`, icon: "📈" },
              { label: "Lead Time", value: `${material?.leadTimeWeeks} สัปดาห์`, icon: "⏱️" },
              { label: "EOQ", value: `${material?.eoq?.toLocaleString()} ${material?.unit}`, icon: "🎯" },
              { label: "แผน 2569", value: `${material?.annualDemand?.toLocaleString()} ${material?.unit}`, icon: "📋" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <span>{item.icon}</span>
                <span className="text-white/50">{item.label}:</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">

        {/* Loading */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><Brain className="text-purple-600 animate-pulse" size={30} /></div>
            </div>
            <div className="text-center">
              <div className="text-[18px] font-bold text-slate-800">AI กำลังวิเคราะห์ข้อมูลจริง...</div>
              <div className="text-[13px] text-slate-500 mt-2">Amazon Nova Pro + PEA Knowledge Base (RAG)</div>
              <div className="text-[12px] text-purple-600 mt-3 font-medium animate-pulse">ส่งข้อมูลสต็อก {material?.currentStock} {material?.unit}, Demand {material?.avgMonthlyDemand}/{material?.unit}/เดือน, Lead Time {material?.leadTimeWeeks} สัปดาห์...</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <AlertTriangle className="text-amber-500" size={48} />
            <div className="text-[15px] font-bold text-slate-800">ไม่สามารถเชื่อมต่อ AI ได้</div>
            <div className="text-[13px] text-slate-500 max-w-md text-center">{error}</div>
            <button onClick={() => { hasCalledRef.current = false; callAI(); }} className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-[13px] font-bold cursor-pointer hover:bg-purple-700 transition">ลองอีกครั้ง</button>
          </div>
        )}

        {/* ═══ AI RESULTS ═══ */}
        {aiResult && !isAnalyzing && (
          <>
            {/* Row 1: Price Chart + 3 Analysis Cards */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Price Chart */}
              <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500" /> แนวโน้มราคาตลาด</h2>
                    <p className="text-[11px] text-slate-400 mt-1">แหล่งข้อมูล: ประวัติใบสั่งซื้อ PEA (SAP) • ดัชนีราคาโลหะโลก (LME) • ราคากลางกระทรวงพาณิชย์</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 border border-emerald-100">
                    <TrendingDown size={13} /> ราคามีแนวโน้มลดลง
                  </div>
                </div>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulation.priceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `฿${(val/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} formatter={(value: any, name: any) => [formatCurrency(Number(value) || 0), name === 'price' ? "ปีปัจจุบัน (Forecast)" : "ปีก่อนหน้า"]} />
                      <ReferenceLine x="May" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="lastYearPrice" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3 Analysis Cards */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target size={13} /> ทำไมต้องสั่ง? (Demand)</div>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.demandAnalysis}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BarChart3 size={13} /> เปิดประมูลเมื่อไหร่? (Market)</div>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.marketAnalysis}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap size={13} /> ต้องเริ่มสั่งเมื่อไหร่? (Supplier)</div>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.supplierAnalysis}</p>
                </div>
              </div>
            </div>

            {/* Emergency Plan - Critical Gap Alert */}
            {aiResult.emergencyPlan && (
              <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 p-6 shadow-sm border-2 border-red-300">
                <h2 className="text-[16px] font-bold text-red-800 flex items-center gap-2 mb-3">
                  <ShieldAlert size={20} className="text-red-600" /> 🚨 แผนฉุกเฉิน: สต็อกจะหมดก่อนของมาถึง!
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl bg-red-100 border border-red-200 p-3 text-center">
                    <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">สต็อกเหลือ</div>
                    <div className="text-[28px] font-black text-red-700">{material ? Math.round((material.currentStock / (material.avgMonthlyDemand / 30))) : '?'}</div>
                    <div className="text-[10px] text-red-400">วัน</div>
                  </div>
                  <div className="rounded-xl bg-orange-100 border border-orange-200 p-3 text-center">
                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">Lead Time</div>
                    <div className="text-[28px] font-black text-orange-700">{material ? Math.round(material.leadTimeWeeks * 7) : '?'}</div>
                    <div className="text-[10px] text-orange-400">วัน</div>
                  </div>
                  <div className="rounded-xl bg-yellow-100 border border-yellow-200 p-3 text-center">
                    <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">ช่องว่างวิกฤต</div>
                    <div className="text-[28px] font-black text-yellow-700">{material ? Math.round(material.leadTimeWeeks * 7) - Math.round((material.currentStock / (material.avgMonthlyDemand / 30))) : '?'}</div>
                    <div className="text-[10px] text-yellow-500">วัน ที่ต้องอุด</div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/80 border border-red-200 p-4">
                  <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-line">{aiResult.emergencyPlan}</p>
                </div>
              </div>
            )}

            {/* Price Forecast Section */}
            {aiResult.priceForecast && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <TrendingDown size={18} className="text-indigo-500" /> AI คาดการณ์ราคา (Price Forecast)
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">📊 อีก 3 เดือนข้างหน้า</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.priceForecast.threeMonth}</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                    <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">📈 อีก 1 ปีข้างหน้า</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.priceForecast.oneYear}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">🎯 ช่วงเวลาที่ดีที่สุดในการซื้อ</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-bold">{aiResult.priceForecast.bestTimeToBuy}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lot Strategy */}
            {aiResult.lotStrategy && aiResult.lotStrategy.recommendation !== "-" && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Package size={18} className="text-indigo-500" /> กลยุทธ์การสั่ง Lot (Lot Strategy)
                </h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 text-center">
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">จำนวนรวม</div>
                    <div className="text-[24px] font-black text-indigo-700">{aiResult.lotStrategy.totalQty.toLocaleString()}</div>
                    <div className="text-[10px] text-indigo-400">{material?.unit}</div>
                  </div>
                  <div className="rounded-xl bg-purple-50 border border-purple-100 p-4 text-center">
                    <div className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">แบ่งเป็น</div>
                    <div className="text-[24px] font-black text-purple-700">{aiResult.lotStrategy.numLots}</div>
                    <div className="text-[10px] text-purple-400">รอบ</div>
                  </div>
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-center">
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">รอบละ</div>
                    <div className="text-[24px] font-black text-blue-700">{aiResult.lotStrategy.qtyPerLot.toLocaleString()}</div>
                    <div className="text-[10px] text-blue-400">{material?.unit}</div>
                  </div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">ประหยัดได้</div>
                    <div className="text-[14px] font-black text-emerald-700">{aiResult.lotStrategy.savings}</div>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                  <div className="text-[12px] font-bold text-slate-800">แนะนำ: {aiResult.lotStrategy.recommendation}</div>
                  <div className="text-[12px] text-slate-600 leading-relaxed">{aiResult.lotStrategy.reason}</div>
                </div>
              </div>
            )}

            {/* Lot Schedule Timeline */}
            {aiResult.lotSchedule && aiResult.lotSchedule.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-indigo-500" /> แผนกำหนดการสั่งซื้อ (Procurement Schedule)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Lot</th>
                        <th className="text-left py-2 px-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">จำนวน</th>
                        <th className="text-left py-2 px-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">เริ่มจัดซื้อ</th>
                        <th className="text-left py-2 px-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">คาดว่าได้ของ</th>
                        <th className="text-left py-2 px-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">สิ่งที่ต้องทำ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiResult.lotSchedule.map((s, i) => (
                        <tr key={i} className={`border-b border-slate-100 ${i === 0 ? 'bg-indigo-50/50' : ''}`}>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                              {s.lot}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800">{s.qty?.toLocaleString()} {material?.unit}</td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${i === 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                              {i === 0 && <AlertTriangle size={10} />}
                              {s.orderMonth}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{s.receiveMonth}</td>
                          <td className="py-3 px-3 text-slate-600 max-w-[300px]">{s.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            {aiResult.executiveSummary && (
              <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={18} className="text-purple-600" />
                  <span className="text-[13px] font-bold text-purple-800 uppercase tracking-wider">สรุปสำหรับผู้บริหาร (Executive Summary)</span>
                </div>
                <p className="text-[15px] leading-relaxed font-semibold text-slate-800">{aiResult.executiveSummary}</p>
              </div>
            )}

            {/* Two Plans Side by Side */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Plan A */}
              <div className="rounded-2xl border-2 border-emerald-400 bg-white p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 text-[10px] font-bold rounded-bl-2xl flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> AI แนะนำ
                </div>
                <h3 className="text-[18px] font-bold text-emerald-800 mb-1">Plan A: {aiResult.planA.title}</h3>
                <div className="text-[11px] text-slate-400 mb-4">จำนวน: {aiResult.planA.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planA.qty * (material?.unitPrice || 0))}</div>
                
                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">🔮 ถ้าเลือกแผนนี้ อนาคตจะเป็นยังไง?</div>
                    <p className="text-[12px] text-slate-700 leading-relaxed">{aiResult.planA.futureImpact}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">📦 สต็อกอยู่ได้อีกกี่เดือน? ต้องสั่งเพิ่มอีกไหม?</div>
                    <p className="text-[12px] text-slate-700 leading-relaxed">{aiResult.planA.supplyForecast}</p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                    <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">💰 วิเคราะห์ต้นทุน & ความคุ้มค่า</div>
                    <p className="text-[12px] text-slate-700 leading-relaxed">{aiResult.planA.costAnalysis}</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={11} /> สถานการณ์เลวร้ายที่อาจเกิด</div>
                    <p className="text-[12px] text-amber-900 leading-relaxed">{aiResult.planA.riskScenarios}</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 border border-purple-100 p-3">
                    <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">🛡️ วิธีรับมือเมื่อเกิดความเสี่ยง</div>
                    <p className="text-[12px] text-slate-700 leading-relaxed">{aiResult.planA.mitigation}</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">✅ ปัญหาจบไหม? ต้องทำอะไรต่อ?</div>
                    <p className="text-[12px] text-slate-800 leading-relaxed font-semibold">{aiResult.planA.problemResolved}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan A: ${aiResult.planA.title}`, action: aiResult.planA.futureImpact, qty: aiResult.planA.qty, risk: aiResult.planA.riskScenarios, financial: aiResult.planA.costAnalysis, unitPrice: material?.unitPrice || 0 } }));
                      if (onClose) onClose();
                      setTimeout(() => setActiveTab?.("activity"), 300);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[13px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> เลือกแผนนี้ → วางแผนจัดซื้อ
                  </button>
                </div>
              </div>

              {/* Plan B */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 relative overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                <h3 className="text-[18px] font-bold text-slate-700 mb-1">Plan B: {aiResult.planB.title}</h3>
                <div className="text-[11px] text-slate-400 mb-4">จำนวน: {aiResult.planB.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planB.qty * (material?.unitPrice || 0))}</div>
                
                <div className="space-y-3">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">🔮 ถ้าเลือกแผนนี้ อนาคตจะเป็นยังไง?</div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{aiResult.planB.futureImpact}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">📦 สต็อกอยู่ได้อีกกี่เดือน? ต้องสั่งเพิ่มอีกไหม?</div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{aiResult.planB.supplyForecast}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">💰 วิเคราะห์ต้นทุน & ความคุ้มค่า</div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{aiResult.planB.costAnalysis}</p>
                  </div>
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                    <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldAlert size={11} /> สถานการณ์เลวร้ายที่อาจเกิด</div>
                    <p className="text-[12px] text-red-900 leading-relaxed">{aiResult.planB.riskScenarios}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">🛡️ วิธีรับมือเมื่อเกิดความเสี่ยง</div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{aiResult.planB.mitigation}</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">✅ ปัญหาจบไหม? ต้องทำอะไรต่อ?</div>
                    <p className="text-[12px] text-slate-700 leading-relaxed font-semibold">{aiResult.planB.problemResolved}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan B: ${aiResult.planB.title}`, action: aiResult.planB.futureImpact, qty: aiResult.planB.qty, risk: aiResult.planB.riskScenarios, financial: aiResult.planB.costAnalysis, unitPrice: (material?.unitPrice || 150000) * 1.15 } }));
                      if (onClose) onClose();
                      setTimeout(() => setActiveTab?.("activity"), 300);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-5 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <AlertTriangle size={16} className="text-amber-500" /> เลือก Plan B
                  </button>
                </div>
              </div>
            </div>

            {/* Raw AI Response */}
            {aiResult.raw && (
              <details className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <summary className="px-6 py-4 text-[12px] font-bold text-slate-400 cursor-pointer hover:bg-slate-50 transition flex items-center gap-2">
                  <Brain size={14} className="text-purple-500" /> ดู Raw AI Response จาก Amazon Nova Pro
                  {!isAnalyzing && (
                    <button onClick={(e) => { e.preventDefault(); hasCalledRef.current = false; callAI(); }} className="ml-auto text-purple-600 hover:text-purple-800 flex items-center gap-1 text-[11px] font-bold">
                      <RefreshCw size={12} /> วิเคราะห์ใหม่
                    </button>
                  )}
                </summary>
                <div className="px-6 pb-6 text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto font-mono border-t border-slate-100 pt-4">{aiResult.raw}</div>
              </details>
            )}
          </>
        )}
      </main>
    </div>
  );
}
