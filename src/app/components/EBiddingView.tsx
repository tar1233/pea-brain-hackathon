"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, TrendingDown, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, ArrowLeft, BarChart3, Target, Zap, Package, Clock, Loader2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import AIVendorStrategyView from "./AIVendorStrategyView";
import ProcurementPlanTable from "./ProcurementPlanTable";
import VendorDocumentAnalyzer from "./VendorDocumentAnalyzer";

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
  financials?: {
    goodsCost: number;
    singleHC: number;
    phasedHC: number;
    singleTCO: number;
    phasedTCO: number;
    savings: number;
  };
  raw?: string;
  costOptimization?: {
    singlePurchaseCost: string;
    phasedPurchaseCost: string;
    savingsAmount: string;
    recommendation: string;
  };
}

export default function EBiddingView({ targetMaterialId = "10067", setActiveTab, onClose, embedded = false, readonly = false, approvedQty, approvedPlan }: { targetMaterialId?: string, setActiveTab?: (tab: string) => void, onClose?: () => void, embedded?: boolean, readonly?: boolean, approvedQty?: number, approvedPlan?: any }) {
  const { eBiddingData, materials, riskAlerts } = useData();
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showPlanTable, setShowPlanTable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false);

  const isBatch = targetMaterialId.startsWith('BATCH');

  // Provide a mock aggregated material if it's a batch, otherwise find from real data
  const material = isBatch ? {
    id: targetMaterialId,
    sapCode: targetMaterialId,
    name: "พัสดุจัดซื้อรวม (Batch Optimization)",
    category: "อุปกรณ์จัดซื้อรวม",
    unit: "เครื่อง",
    unitPrice: 150000,
    budgetPrice: 150000,
    currentStock: 450,
    safetyStock: 600,
    avgMonthlyDemand: 204,
    stdMonthlyDemand: 20,
    leadTimeWeeks: 12,
    eoq: 2454,
    annualDemand: 2454,
    sparkline: [200, 210, 190, 205, 200, 215, 195, 210, 205, 200, 190, 204]
  } : materials.find(m => m.id === targetMaterialId || m.sapCode === targetMaterialId);

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

    // Ensure mat is never undefined to prevent "undefined" strings in AI prompt
    const mat = material || materials[0] || {
      id: "unknown", sapCode: "00000", name: "ไม่ทราบชื่อพัสดุ", category: "ทั่วไป", unit: "ชิ้น",
      currentStock: 0, safetyStock: 100, reorderPoint: 50, avgMonthlyDemand: 50, stdMonthlyDemand: 5,
      leadTimeWeeks: 4, unitPrice: 10000, budgetPrice: 10000, annualDemand: 600, eoq: 200, sparkline: [0]
    };
    
    const daysOfStock = Math.round(mat.currentStock / (mat.avgMonthlyDemand / 30));
    const leadTimeDays = Math.round(mat.leadTimeWeeks * 7);
    const gapDays = leadTimeDays - daysOfStock;

    if (readonly) {
      const finalQty = approvedQty || mat?.eoq || 0;
      const annualQtyRO = mat?.annualDemand || mat?.eoq || 800;
      const holdingCostRO = Math.round(annualQtyRO * (mat?.unitPrice || 150000) * 0.20 * 0.3);
      setAiResult({
        demandAnalysis: `สต็อก ${mat?.currentStock?.toLocaleString()} ${mat?.unit} ใช้ได้อีก ${daysOfStock} วัน (Demand เฉลี่ย ${mat?.avgMonthlyDemand}/${mat?.unit}/เดือน) → ต้องสั่งทันที`,
        marketAnalysis: `ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} เทียบราคากลาง ฿${mat?.budgetPrice?.toLocaleString()} ควรประกวดราคาโดยเร็ว`,
        supplierAnalysis: `Lead Time ${mat?.leadTimeWeeks} สัปดาห์ (${leadTimeDays} วัน) สต็อกเหลือ ${daysOfStock} วัน → ต้องเร่ง Supplier`,
        emergencyPlan: "",
        priceForecast: { threeMonth: "แนวโน้มราคาทรงตัว ±5%", oneYear: "คาดว่าราคาจะปรับตัวตามต้นทุนวัตถุดิบ", bestTimeToBuy: "ช่วงนี้ถึง 3 เดือนข้างหน้า" },
        lotStrategy: { recommendation: "สั่ง 4 Lot", totalQty: annualQtyRO, numLots: 4, qtyPerLot: Math.ceil(annualQtyRO / 4), reason: "ลดความเสี่ยงและ Holding Cost", savings: `≈฿${holdingCostRO.toLocaleString()}` },
        lotSchedule: [],
        planA: { title: "จัดซื้อรายไตรมาส (Quarterly)", qty: finalQty, futureImpact: `ลด Holding Cost ≈฿${holdingCostRO.toLocaleString()}/ปี`, supplyForecast: "สินค้าทยอยเข้าตามแผน", costAnalysis: "TCO ต่ำกว่าซื้อทีเดียว", riskScenarios: "จัดซื้อบ่อยขึ้น แต่ใช้สัญญากรอบราคาแก้ได้", mitigation: "ใช้สัญญากรอบราคาล็อคราคาทั้งปี", problemResolved: "รักษาสมดุลสต็อก ไม่ล้น ไม่ขาด" },
        planB: { title: "สั่งซื้อ 1 สัญญารวม (Single Award)", qty: annualQtyRO, futureImpact: `ล็อคราคาตลอดปี อาจได้ Volume Discount 3-5%`, supplyForecast: `ได้ของครบ ${annualQtyRO.toLocaleString()} ${mat?.unit} ในรอบเดียว`, costAnalysis: `Holding Cost สูง ≈฿${Math.round(annualQtyRO * (mat?.unitPrice || 150000) * 0.20 * 0.5).toLocaleString()} บาท/ปี`, riskScenarios: "Supplier ผลิตไม่ทัน กระทบแผนทั้งปี", mitigation: "กำหนดค่าปรับล่าช้า + Delivery Schedule ชัดเจน", problemResolved: "แก้ปัญหาของขาดได้ แต่ Holding Cost สูง" },
        executiveSummary: `แผนจัดซื้อได้รับการอนุมัติเรียบร้อยแล้ว • จำนวน ${finalQty.toLocaleString()} ${mat?.unit || 'หน่วย'} • มูลค่า ≈฿${(finalQty * (mat?.unitPrice || 0)).toLocaleString()}`,
        financials: {
          goodsCost: Math.round(annualQtyRO * (mat?.unitPrice || 0)),
          singleHC: Math.round(annualQtyRO * (mat?.unitPrice || 0) * 0.20 * 0.5),
          phasedHC: Math.round(annualQtyRO * (mat?.unitPrice || 0) * 0.20 * 0.2),
          singleTCO: Math.round(annualQtyRO * (mat?.unitPrice || 0)) + Math.round(annualQtyRO * (mat?.unitPrice || 0) * 0.20 * 0.5),
          phasedTCO: Math.round(annualQtyRO * (mat?.unitPrice || 0)) + Math.round(annualQtyRO * (mat?.unitPrice || 0) * 0.20 * 0.2),
          savings: Math.round(annualQtyRO * (mat?.unitPrice || 0) * 0.20 * 0.5) - Math.round(annualQtyRO * (mat?.unitPrice || 0) * 0.20 * 0.2)
        }
      });
      setIsAnalyzing(false);
      return;
    }

    const annualBudget = mat ? mat.annualDemand * mat.unitPrice : 0;
    const monthsOfStock = mat ? (mat.currentStock / mat.avgMonthlyDemand).toFixed(1) : '0';
    const stockVsSafety = mat ? Math.round(((mat.safetyStock - mat.currentStock) / mat.safetyStock) * 100) : 0;
    const demandVariation = mat ? Math.round((mat.stdMonthlyDemand / mat.avgMonthlyDemand) * 100) : 0;
    const shortfallQty = mat ? Math.round((gapDays / 30) * mat.avgMonthlyDemand) : 0;

    // Current date for AI awareness
    const now = new Date();
    const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const currentMonth = thaiMonths[now.getMonth()];
    const currentYear = now.getFullYear() + 543; // พ.ศ.
    const currentMonthNum = now.getMonth() + 1; // 1-12
    const remainingMonths = 12 - currentMonthNum;

    const annualQty = mat?.annualDemand || mat?.eoq || 800;
    const quarterlyQty = Math.ceil(annualQty / 4);

    const holdingCostRate = 0.20;
    const singleHoldingCost = Math.round(annualQty * (mat?.unitPrice || 0) * holdingCostRate * 0.5);
    const phasedHoldingCost = Math.round(annualQty * (mat?.unitPrice || 0) * holdingCostRate * 0.2);
    const holdingSavings = singleHoldingCost - phasedHoldingCost;

    const prompt = `คุณเป็นที่ปรึกษาจัดซื้อระดับ Enterprise ของ PEA (การไฟฟ้าส่วนภูมิภาค)
เน้นวิเคราะห์ต้นทุนรวม (Total Cost of Ownership) เพื่อหาแผนที่ประหยัดที่สุดให้องค์กร

📅 วันที่ปัจจุบัน: ${now.getDate()} ${currentMonth} ${currentYear} (เดือนที่ ${currentMonthNum} ของปี)
⏰ เหลืออีก ${remainingMonths} เดือนก่อนสิ้นปีงบประมาณ

═══ ข้อมูลพัสดุ: ${mat?.name} (${targetMaterialId}) ═══
สต็อก: ${mat?.currentStock} ${mat?.unit} (ใช้ได้อีก ${daysOfStock} วัน = ${monthsOfStock} เดือน)
Safety Stock: ${mat?.safetyStock} ${mat?.unit} | ขาด: ${stockVsSafety}%
เบิกจ่าย: ${mat?.avgMonthlyDemand} ${mat?.unit}/เดือน (ค่าเบี่ยงเบน ${demandVariation}%)
Lead Time: รอบแรก (Initial Order) = ${mat?.leadTimeWeeks} สัปดาห์ (${leadTimeDays} วัน) | ทยอยรับรอบถัดไป (Call-off) = 3-7 วัน
ราคา: ฿${mat?.unitPrice?.toLocaleString()}/หน่วย | ราคากลาง: ฿${mat?.budgetPrice?.toLocaleString()}
แผน 2569: ${mat?.annualDemand} ${mat?.unit} (งบ ≈ ฿${annualBudget.toLocaleString()})
EOQ: ${mat?.eoq} ${mat?.unit}
ประวัติเบิกจ่าย 12 เดือน: [${mat?.sparkline?.join(', ')}]
${alert ? `แจ้งเตือน: ${alert.message} | คำแนะนำเดิม: ${alert.recommendation}` : ''}

Holding Cost (อัตรา ${holdingCostRate * 100}%): ซื้อทีเดียว = ${singleHoldingCost.toLocaleString()} บาท/ปี | ทยอย 4 รอบ = ${phasedHoldingCost.toLocaleString()} บาท/ปี | ประหยัด ${holdingSavings.toLocaleString()} บาท/ปี

กฎ: ห้ามอ้างอิงสงคราม โควิด แผ่นดินไหว หรือเหตุการณ์มหภาคที่ทำนายไม่ได้
กฎ: วิเคราะห์จากข้อมูลจริงที่ให้มาเท่านั้น ต้องเปรียบเทียบซื้อทีเดียว vs ทยอยซื้อ ว่า TCO อันไหนต่ำกว่า
กฎ: ห้ามถามคำถามกลับ ห้ามเขียน "...ไหม?" ต้องตอบเป็นข้อสรุปเท่านั้น
กฎ: แนะนำให้ตั้ง Dynamic ROP ล่วงหน้าที่สต็อก 100 วัน เพื่อรองรับ Lead Time รอบแรก ${leadTimeDays} วันแบบไร้รอยต่อ
กฎ: ทุก field ต้องมีคำตอบจริง มีตัวเลขประกอบ ห้ามเว้นว่าง ห้ามเขียนว่า "-"
กฎ: ห้ามแนะนำเดือนที่ผ่านไปแล้ว วันนี้คือ ${currentMonth} ${currentYear}

ตอบ JSON ตามนี้ (ห้ามมี markdown ห้ามมี text อื่น):
{
  "demandAnalysis": "สต็อก ${mat?.currentStock} ชิ้น ใช้ได้อีก X วัน (Demand เฉลี่ย ${mat?.avgMonthlyDemand}/เดือน) → ต้องสั่งทันที",
  "marketAnalysis": "ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} สูง/ต่ำกว่าราคากลาง X% ควรประกวดราคาเดือน X",
  "supplierAnalysis": "Lead Time ${mat?.leadTimeWeeks} สัปดาห์ (${leadTimeDays} วัน) สต็อกเหลือ ${daysOfStock} วัน → ช่องว่าง ${gapDays} วัน ต้องเร่ง Supplier",
  "emergencyPlan": "1. ขอยืมจากคลังภูมิภาคอื่น\n2. ยื่นจัดซื้อเร่งด่วน\n3. ปรับลดการเบิกจ่าย",
  "costOptimization": {
    "singlePurchaseCost": "ซื้อทีเดียว: ต้นทุนสินค้า + Holding Cost ${singleHoldingCost.toLocaleString()} บาท = TCO รวม",
    "phasedPurchaseCost": "ทยอยซื้อ 4 รอบ: ต้นทุนสินค้า + Holding Cost ${phasedHoldingCost.toLocaleString()} บาท = TCO รวม",
    "savingsAmount": "ประหยัดได้ ${holdingSavings.toLocaleString()} บาท จากการลด Holding Cost",
    "recommendation": "แนะนำทยอยซื้อ เพราะ TCO ต่ำกว่า"
  },
  "planA": {
    "title": "จัดซื้อรายไตรมาส (Quarterly - TCO Optimized)",
    "qty": ตัวเลข,
    "futureImpact": "ลด Holding Cost ได้ ${holdingSavings.toLocaleString()} บาท/ปี เพราะเก็บสต็อกทีละน้อย",
    "supplyForecast": "รับมอบสินค้าเป็นรอบ ตรงกับกำลังผลิตของ Vendor",
    "costAnalysis": "TCO = ต้นทุนสินค้า + Holding Cost ${phasedHoldingCost.toLocaleString()} บาท (ประหยัดกว่าซื้อทีเดียว)",
    "riskScenarios": "จัดซื้อบ่อยขึ้น เพิ่มภาระเอกสาร แต่ใช้สัญญากรอบราคาแก้ได้",
    "mitigation": "ใช้สัญญากรอบราคา (Frame Agreement) ล็อคราคาทั้งปี แล้วทยอยเรียกของ",
    "problemResolved": "รักษาสมดุลสต็อกให้เหมาะสม ไม่ล้นคลัง ไม่ขาดของ"
  },
  "planB": {
    "title": "จัดซื้อรายปีแบบทยอยส่งมอบ (Annual with Phased Deliveries)",
    "qty": ตัวเลข,
    "futureImpact": "ล็อคราคาตลอดปี ได้ Volume Discount แลกกับสัญญาผูกพันระยะยาว",
    "supplyForecast": "รับมอบเป็นงวด (ทุกไตรมาส) ป้องกันปัญหาไม่มีที่เก็บ",
    "costAnalysis": "TCO ลดลงจาก Volume Discount + ลด Holding Cost ด้วยการทยอยส่งมอบ",
    "riskScenarios": "ถ้า Supplier ผลิตไม่ทันในรอบใด อาจกระทบแผนงานต่อเนื่องทั้งปี",
    "mitigation": "กำหนด Delivery Schedule ให้ชัดเจนในสัญญา พร้อมค่าปรับหากล่าช้า",
    "problemResolved": "แก้ปัญหาสต็อกล้นคลัง ลดภาระงานจัดซื้อซ้ำ ได้ราคาดีกว่า"
  },
  "priceForecast": {
    "threeMonth": "ราคาจะขึ้น/ลง X% เป็น ฿X",
    "oneYear": "แนวโน้มราคาขึ้น/ลง X%",
    "bestTimeToBuy": "ช่วง เดือน X-Y"
  },
  "lotStrategy": {
    "recommendation": "สั่ง X Lot",
    "totalQty": ตัวเลข,
    "numLots": ตัวเลข,
    "qtyPerLot": ตัวเลข,
    "reason": "ลดความเสี่ยงและคุ้มค่าที่สุด",
    "savings": "ประหยัด ฿X"
  },
  "lotSchedule": [
    { "lot": 1, "qty": ตัวเลข, "orderMonth": "เดือน X ปี 2569", "receiveMonth": "เดือน X ปี 2569", "action": "เปิด PO" }
  ],
  "executiveSummary": "สต็อกเหลือ ${daysOfStock} วัน Lead Time ${leadTimeDays} วัน → ต้องเร่งจัดซื้อด่วน"
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
        // Helper: fill missing plan fields with meaningful defaults
        const defaultPlanA = (p: any) => ({
          title: p?.title || "จัดซื้อรายไตรมาส (Quarterly - TCO Optimized)",
          qty: p?.qty || mat?.eoq || Math.ceil((mat?.annualDemand || 800) / 4),
          futureImpact: p?.futureImpact || `ลด Holding Cost ได้ประมาณ ฿${Math.round((mat?.annualDemand || 800) * (mat?.unitPrice || 150000) * 0.20 * 0.3).toLocaleString()} บาท/ปี จากการทยอยซื้อ`,
          supplyForecast: p?.supplyForecast || `รับมอบสินค้าเป็นรอบ ทุก ${Math.ceil((mat?.leadTimeWeeks || 12) * 1.2)} สัปดาห์ ตรงกับกำลังผลิต Vendor`,
          costAnalysis: p?.costAnalysis || `TCO ต่ำกว่าซื้อทีเดียว เพราะ Holding Cost ลดลง`,
          riskScenarios: p?.riskScenarios || `จัดซื้อบ่อยขึ้น เพิ่มภาระเอกสาร แต่ใช้สัญญากรอบราคาแก้ได้`,
          mitigation: p?.mitigation || `ใช้สัญญากรอบราคา (Frame Agreement) ล็อคราคาทั้งปี แล้วทยอยเรียกของ`,
          problemResolved: p?.problemResolved || `รักษาสมดุลสต็อกให้เหมาะสม ไม่ล้นคลัง ไม่ขาดของ`
        });
        const defaultPlanB = (p: any) => ({
          title: p?.title || "สั่งซื้อ 1 สัญญารวม (Single Award - Annual)",
          qty: p?.qty || mat?.annualDemand || mat?.eoq || 800,
          futureImpact: p?.futureImpact || `ล็อคราคาตลอดปี อาจได้ Volume Discount 3-5% แต่แลกด้วยสัญญาผูกพันระยะยาว`,
          supplyForecast: p?.supplyForecast || `ได้ของครบในรอบเดียว แต่ต้องมีพื้นที่จัดเก็บ ${(mat?.annualDemand || 800).toLocaleString()} ${mat?.unit || 'หน่วย'}`,
          costAnalysis: p?.costAnalysis || `Holding Cost สูงกว่า ≈฿${Math.round((mat?.annualDemand || 800) * (mat?.unitPrice || 150000) * 0.20 * 0.5).toLocaleString()} บาท/ปี เพราะเก็บสต็อกมาก`,
          riskScenarios: p?.riskScenarios || `ถ้า Supplier ผลิตไม่ทัน จะกระทบแผนทั้งปี / ต้นทุนจัดเก็บสูง`,
          mitigation: p?.mitigation || `กำหนด Delivery Schedule ชัดเจนในสัญญา พร้อมค่าปรับหากล่าช้า`,
          problemResolved: p?.problemResolved || `แก้ปัญหาของขาดได้ทันที แต่มีความเสี่ยงด้าน Holding Cost สูง`
        });

        setAiResult({
          demandAnalysis: parsed.demandAnalysis || `สต็อก ${mat?.currentStock} ชิ้น ใช้ได้อีก ${daysOfStock} วัน (Demand เฉลี่ย ${mat?.avgMonthlyDemand}/เดือน) → ต้องสั่งทันที`,
          marketAnalysis: parsed.marketAnalysis || `ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} ควรเปรียบเทียบกับราคากลาง ฿${mat?.budgetPrice?.toLocaleString()}`,
          supplierAnalysis: parsed.supplierAnalysis || `Lead Time ${mat?.leadTimeWeeks} สัปดาห์ (${leadTimeDays} วัน) สต็อกเหลือ ${daysOfStock} วัน → ต้องเร่ง Supplier`,
          emergencyPlan: parsed.emergencyPlan || "",
          costOptimization: parsed.costOptimization || undefined,
          priceForecast: parsed.priceForecast || { threeMonth: `แนวโน้มราคาทรงตัว ±5%`, oneYear: `คาดว่าราคาจะปรับตัวตามต้นทุนวัตถุดิบ`, bestTimeToBuy: `ช่วงนี้ถึง 3 เดือนข้างหน้า` },
          lotStrategy: parsed.lotStrategy || { recommendation: `สั่ง 4 Lot`, totalQty: mat?.annualDemand || 800, numLots: 4, qtyPerLot: Math.ceil((mat?.annualDemand || 800) / 4), reason: `ลดความเสี่ยงและ Holding Cost`, savings: `≈฿${Math.round((mat?.annualDemand || 800) * (mat?.unitPrice || 150000) * 0.20 * 0.3).toLocaleString()}` },
          lotSchedule: parsed.lotSchedule || [],
          planA: defaultPlanA(parsed.planA),
          planB: defaultPlanB(parsed.planB),
          executiveSummary: parsed.executiveSummary || `สต็อกเหลือ ${daysOfStock} วัน Lead Time ${leadTimeDays} วัน → ต้องเร่งจัดซื้อทันที`,
          financials: {
            goodsCost: Math.round(annualQty * (mat?.unitPrice || 0)),
            singleHC: singleHoldingCost,
            phasedHC: phasedHoldingCost,
            singleTCO: Math.round(annualQty * (mat?.unitPrice || 0)) + singleHoldingCost,
            phasedTCO: Math.round(annualQty * (mat?.unitPrice || 0)) + phasedHoldingCost,
            savings: holdingSavings
          },
          raw: content,
        });
      } else {
        const annualQtyFallback = mat?.annualDemand || mat?.eoq || 800;
        const qtyPerLotFallback = Math.ceil(annualQtyFallback / 4);
        const holdingCostSavings = Math.round(annualQtyFallback * (mat?.unitPrice || 150000) * 0.20 * 0.3);
        
        setAiResult({
          demandAnalysis: `สต็อก ${mat?.currentStock?.toLocaleString()} ${mat?.unit} ใช้ได้อีก ${daysOfStock} วัน (Demand เฉลี่ย ${mat?.avgMonthlyDemand}/${mat?.unit}/เดือน) → ต้องสั่งทันที`,
          marketAnalysis: `ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} เทียบราคากลาง ฿${mat?.budgetPrice?.toLocaleString()} ควรเปิดประกวดราคาโดยเร็ว`,
          supplierAnalysis: `Lead Time ${mat?.leadTimeWeeks} สัปดาห์ (${leadTimeDays} วัน) สต็อกเหลือ ${daysOfStock} วัน → ช่องว่าง ${gapDays} วัน ต้องเร่ง Supplier`,
          emergencyPlan: "",
          priceForecast: { threeMonth: `แนวโน้มราคาทรงตัว ±5%`, oneYear: `คาดว่าราคาจะปรับตัวตามต้นทุนวัตถุดิบ`, bestTimeToBuy: `ช่วงนี้ถึง 3 เดือนข้างหน้า` },
          lotStrategy: { recommendation: `สั่ง 4 Lot`, totalQty: annualQtyFallback, numLots: 4, qtyPerLot: qtyPerLotFallback, reason: `ลดความเสี่ยงและ Holding Cost`, savings: `≈฿${holdingCostSavings.toLocaleString()}` },
          lotSchedule: [],
          planA: { title: "จัดซื้อรายไตรมาส (Quarterly - TCO Optimized)", qty: qtyPerLotFallback, futureImpact: `กระจายความเสี่ยงให้ผู้ผลิตหลายราย ลด Holding Cost ≈฿${holdingCostSavings.toLocaleString()}/ปี`, supplyForecast: `สินค้าทยอยเข้าตามแผนรายไตรมาส`, costAnalysis: `TCO ต่ำกว่าซื้อทีเดียว เพราะ Holding Cost ลดลงอย่างมีนัยสำคัญ`, riskScenarios: `จัดซื้อบ่อยขึ้น แต่ใช้สัญญากรอบราคาแก้ได้`, mitigation: `ใช้สัญญากรอบราคาล็อคราคาทั้งปี`, problemResolved: `แก้ปัญหาของขาดได้แน่นอน` },
          planB: { title: "สั่งซื้อ 1 สัญญารวม (Single Award - Annual)", qty: annualQtyFallback, futureImpact: `ล็อคราคาตลอดปี อาจได้ Volume Discount 3-5% แต่ Holding Cost สูงกว่า`, supplyForecast: `ได้ของครบ ${annualQtyFallback.toLocaleString()} ${mat?.unit || 'หน่วย'} ในรอบเดียว`, costAnalysis: `Holding Cost สูง ≈฿${Math.round(annualQtyFallback * (mat?.unitPrice || 150000) * 0.20 * 0.5).toLocaleString()} บาท/ปี`, riskScenarios: `Supplier ผลิตไม่ทัน กระทบแผนทั้งปี / พื้นที่จัดเก็บไม่พอ`, mitigation: `กำหนดค่าปรับล่าช้าในสัญญา + Delivery Schedule ชัดเจน`, problemResolved: `แก้ปัญหาของขาดได้ แต่มีความเสี่ยง Holding Cost สูง` },
          executiveSummary: `สต็อกเหลือ ${daysOfStock} วัน Lead Time ${leadTimeDays} วัน → ต้องเร่งจัดซื้อด่วน`,
          financials: {
            goodsCost: Math.round(annualQtyFallback * (mat?.unitPrice || 0)),
            singleHC: Math.round(annualQtyFallback * (mat?.unitPrice || 0) * 0.20 * 0.5),
            phasedHC: Math.round(annualQtyFallback * (mat?.unitPrice || 0) * 0.20 * 0.2),
            singleTCO: Math.round(annualQtyFallback * (mat?.unitPrice || 0)) + Math.round(annualQtyFallback * (mat?.unitPrice || 0) * 0.20 * 0.5),
            phasedTCO: Math.round(annualQtyFallback * (mat?.unitPrice || 0)) + Math.round(annualQtyFallback * (mat?.unitPrice || 0) * 0.20 * 0.2),
            savings: Math.round(annualQtyFallback * (mat?.unitPrice || 0) * 0.20 * 0.5) - Math.round(annualQtyFallback * (mat?.unitPrice || 0) * 0.20 * 0.2)
          },
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
    <div className={embedded ? "w-full bg-[#f4f6fb] rounded-2xl overflow-hidden border border-slate-200 mt-2 pb-6" : "min-h-screen bg-[#f4f6fb]"}>
      {/* ═══ HERO HEADER ═══ */}
      <header className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white">
        <div className={`max-w-[1400px] mx-auto px-8 ${embedded ? 'pt-6 pb-6' : 'pt-6 pb-8'}`}>
          {!embedded && (
            <button onClick={onClose} className="mb-5 inline-flex items-center gap-2 text-[16.5px] text-white/60 hover:text-white transition font-medium cursor-pointer">
              <ArrowLeft size={14} /> กลับหน้า Risk Management
            </button>
          )}

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[16.5px] font-bold tracking-widest text-white/80 uppercase mb-3">
                <Sparkles size={13} />
                AI-Powered Analysis • AWS Bedrock + RAG
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-tight">
                {targetMaterialId.startsWith('BATCH-') ? "แผนจัดซื้อรวม (Batch Optimization Strategy)" : (material?.name || targetMaterialId)}
              </h1>
              <p className="mt-1.5 text-[16.5px] text-white/60 font-medium">
                รหัส SAP: {targetMaterialId.startsWith('BATCH-') ? targetMaterialId : (material?.sapCode || targetMaterialId)} • {targetMaterialId.startsWith('BATCH-') ? 'การรวมความต้องการพัสดุหลายรายการ' : (material?.category || 'หม้อแปลงไฟฟ้า')}
              </p>
            </div>

            {/* Key Metrics */}
            {!targetMaterialId.startsWith('BATCH-') ? (
              <div className="flex gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[110px]">
                  <div className="text-[16.5px] text-white/50 font-bold uppercase tracking-wider mb-0.5">สต็อกเหลือ</div>
                  <div className={`text-[30px] font-black leading-none ${stockPercent < 30 ? 'text-red-300' : 'text-white'}`}>{daysOfStock}</div>
                  <div className="text-[16.5px] text-white/50 font-medium mt-0.5">วัน</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[110px]">
                  <div className="text-[16.5px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Safety Stock</div>
                  <div className={`text-[30px] font-black leading-none ${stockPercent < 30 ? 'text-red-300' : 'text-amber-300'}`}>{stockPercent}%</div>
                  <div className="text-[16.5px] text-white/50 font-medium mt-0.5">ของเกณฑ์</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[130px]">
                  <div className="text-[16.5px] text-white/50 font-bold uppercase tracking-wider mb-0.5">ราคาต่อหน่วย</div>
                  <div className="text-[24px] font-black leading-none">{formatCurrency(material?.unitPrice || 0)}</div>
                  <div className="text-[16.5px] text-white/50 font-medium mt-0.5">ราคากลาง: {formatCurrency(material?.budgetPrice || 0)}</div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[140px]">
                  <div className="text-[16.5px] text-white/50 font-bold uppercase tracking-wider mb-0.5">พัสดุในแผนรวม</div>
                  <div className="text-[30px] font-black leading-none text-amber-300">
                    {targetMaterialId === 'BATCH-VMI' ? "ทั้งหมด" : targetMaterialId.replace('BATCH-', '').split(',').length}
                  </div>
                  <div className="text-[16.5px] text-white/50 font-medium mt-0.5">รายการ</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[140px]">
                  <div className="text-[16.5px] text-white/50 font-bold uppercase tracking-wider mb-0.5">รูปแบบสัญญา</div>
                  <div className="text-[24px] font-black leading-none text-emerald-300 mt-1">Frame</div>
                  <div className="text-[16.5px] text-white/50 font-medium mt-1">Agreement</div>
                </div>
              </div>
            )}
          </div>

          {/* Live Data Chips */}
          {!targetMaterialId.startsWith('BATCH-') && (
            <div className="mt-5 flex flex-wrap gap-2 text-[16.5px]">
              {[
                { label: "สต็อก", value: `${material?.currentStock?.toLocaleString()} ${material?.unit}`, icon: "📦" },
                { label: "Safety Stock", value: `${material?.safetyStock?.toLocaleString()} ${material?.unit}`, icon: "🔴" },
                { label: "Demand/เดือน", value: `${material?.avgMonthlyDemand?.toLocaleString()} (σ=${material?.stdMonthlyDemand ?? 15})`, icon: "📈" },
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
          )}
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
              <div className="text-[16.5px] font-bold text-slate-800">AI กำลังวิเคราะห์ข้อมูลจริง...</div>
              <div className="text-[16.5px] text-slate-500 mt-2">Amazon Nova Pro + PEA Knowledge Base (RAG)</div>
              <div className="text-[16.5px] text-purple-600 mt-3 font-medium animate-pulse">ส่งข้อมูลสต็อก {material?.currentStock} {material?.unit}, Demand {material?.avgMonthlyDemand}/{material?.unit}/เดือน, Lead Time {material?.leadTimeWeeks} สัปดาห์...</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <AlertTriangle className="text-amber-500" size={48} />
            <div className="text-[16.5px] font-bold text-slate-800">ไม่สามารถเชื่อมต่อ AI ได้</div>
            <div className="text-[16.5px] text-slate-500 max-w-md text-center">{error}</div>
            <button onClick={() => { hasCalledRef.current = false; callAI(); }} className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-[16.5px] font-bold cursor-pointer hover:bg-purple-700 transition">ลองอีกครั้ง</button>
          </div>
        )}

        {/* ═══ AI RESULTS ═══ */}
        {aiResult && !isAnalyzing && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Executive Summary - Moved to Top */}
            {aiResult.executiveSummary && (
              <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={18} className="text-purple-600" />
                  <span className="text-[16.5px] font-bold text-purple-800 uppercase tracking-wider">สรุปสำหรับผู้บริหาร (Executive Summary)</span>
                </div>
                <p className="text-[16.5px] leading-relaxed font-semibold text-slate-800">{aiResult.executiveSummary}</p>
              </div>
            )}

            {/* Procurement Plan Table (Excel-like Grid) */}
            {!error && showPlanTable && (
              <ProcurementPlanTable
                materialId={targetMaterialId}
                materialName={material?.name || targetMaterialId}
                material={material}
              />
            )}

            {/* Financial & Procurement Summary Table (Driven by AI Result) */}
            {aiResult?.financials && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h3 className="text-[16.5px] font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 size={18} className="text-indigo-600" />
                      ตารางวิเคราะห์ความคุ้มค่าและสรุปข้อมูลจัดหา (Financial & Procurement Summary)
                    </h3>
                    <p className="text-[16.5px] text-slate-500 mt-1">วิเคราะห์ความคุ้มค่าและสรุปปัจจัยการจัดหาจากข้อมูลในอดีต (Historical Data AI Analysis)</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-700 text-[16.5px]">
                        <th className="p-2 border border-slate-300 font-bold text-center w-[20%]">หมวดหมู่ (Category)</th>
                        <th className="p-2 border border-slate-300 font-bold text-center w-[25%]">หัวข้อการวิเคราะห์ (Analysis Topic)</th>
                        <th className="p-2 border border-slate-300 font-bold text-center w-[55%]">รายละเอียด / มูลค่า (Details / Value)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* AI Insights Section */}
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-2 border border-slate-300 font-bold text-slate-800 align-top bg-slate-50" rowSpan={3}>
                          <div className="flex flex-col items-center gap-2 justify-center h-full pt-4">
                            <Brain size={24} className="text-indigo-600"/> 
                            <span className="text-center">สรุปสถานการณ์<br/>(AI Insights)</span>
                          </div>
                        </td>
                        <td className="p-2 border border-slate-300 font-bold text-blue-700 flex items-center gap-2"><Target size={14}/> ทำไมต้องสั่ง? (Historical Demand Analysis)</td>
                        <td className="p-2 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.demandAnalysis}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-2 border border-slate-300 font-bold text-amber-700 flex items-center gap-2"><BarChart3 size={14}/> เปิดประมูลเมื่อไหร่? (Market)</td>
                        <td className="p-2 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.marketAnalysis}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-2 border border-slate-300 font-bold text-red-700 flex items-center gap-2"><Zap size={14}/> ต้องเริ่มสั่งเมื่อไหร่? (Supplier)</td>
                        <td className="p-2 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.supplierAnalysis}</td>
                      </tr>

                      {/* Financial Section */}
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-2 border border-slate-300 font-bold text-slate-800 align-top bg-slate-50" rowSpan={6}>
                          <div className="flex flex-col items-center gap-2 justify-center h-full pt-8">
                            <TrendingDown size={24} className="text-emerald-600"/> 
                            <span className="text-center">เปรียบเทียบความคุ้มค่า<br/>จากข้อมูลในอดีต<br/>(Historical TCO)</span>
                          </div>
                        </td>
                        <td className="p-2 border border-slate-300 font-medium text-slate-700">
                          มูลค่าสินค้ารวมรายปี 2569 (Annual Goods Cost) <br/>
                          <span className="text-[16.5px] text-emerald-600 font-medium">
                            *อ้างอิงจากยอดใช้งาน 1 ปี (<span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">{material?.annualDemand?.toLocaleString() || 800}</span> ชิ้น) × ราคาปัจจุบัน
                          </span>
                        </td>
                        <td className="p-2 border border-slate-300 text-slate-800 font-medium">฿{aiResult.financials.goodsCost.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-2 border border-slate-300 font-medium text-slate-700">Holding Cost: ซื้อทีเดียว (สต็อกเฉลี่ย 50%)</td>
                        <td className="p-2 border border-slate-300 text-red-600 font-medium">฿{aiResult.financials.singleHC.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-2 border border-slate-300 font-medium text-slate-700">Holding Cost: ทยอยซื้อ (สต็อกเฉลี่ย 20%)</td>
                        <td className="p-2 border border-slate-300 text-emerald-600 font-medium">฿{aiResult.financials.phasedHC.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-red-50 text-[16.5px] bg-red-50/50">
                        <td className="p-2 border border-slate-300 font-bold text-red-800 flex items-center gap-2">🔴 TCO ซื้อทีเดียว (Single Purchase)</td>
                        <td className="p-2 border border-slate-300 text-red-800 font-black">฿{aiResult.financials.singleTCO.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-emerald-50 text-[16.5px] bg-emerald-50/50">
                        <td className="p-2 border border-slate-300 font-bold text-emerald-800 flex items-center gap-2">🟢 TCO ทยอยซื้อ 4 รอบ (Phased Purchase)</td>
                        <td className="p-2 border border-slate-300 text-emerald-800 font-black">฿{aiResult.financials.phasedTCO.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-yellow-50 text-[16.5px] bg-gradient-to-r from-amber-50 to-yellow-50">
                        <td className="p-2 border border-slate-300 font-bold text-amber-800 flex items-center gap-2">💰 ประหยัดได้ทั้งหมด (Total Savings)</td>
                        <td className="p-2 border border-slate-300 text-amber-700 font-black text-[16.5px]">฿{aiResult.financials.savings.toLocaleString()} / ปี</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* Vendor Collaboration / Document Upload Section */}
            {!readonly && (
              <VendorDocumentAnalyzer materialName={material?.name || targetMaterialId} />
            )}

            {/* ═══ APPROVED PLAN SUMMARY (readonly mode) ═══ */}
            {readonly && approvedPlan && (
              <div className="bg-white rounded-xl shadow-sm border border-emerald-200 overflow-hidden mt-6">
                <div className="flex justify-between items-center p-4 border-b border-emerald-200 bg-emerald-50">
                  <div>
                    <h3 className="text-[16.5px] md:text-[16.5px] font-bold text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      แผนที่ AI แนะนำ (อนุมัติแล้ว)
                    </h3>
                    <p className="text-[16.5px] md:text-[16.5px] text-emerald-700 mt-1">สรุปแผนจัดซื้อที่ผ่านการอนุมัติเรียบร้อยแล้ว</p>
                  </div>
                  <span className="shrink-0 bg-emerald-600 text-white px-3 py-1 rounded-full text-[16.5px] font-bold uppercase tracking-wider">
                    Approved ✓
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-700 w-[25%] bg-slate-50/50 text-[16.5px]">📋 ชื่อแผน</td>
                        <td className="px-4 py-3 text-[16.5px] font-bold text-emerald-800">{approvedPlan.planName || 'แผนจัดซื้ออนุมัติ'}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-700 w-[25%] bg-slate-50/50 text-[16.5px]">🎯 การดำเนินการ</td>
                        <td className="px-4 py-3 text-[16.5px] text-slate-700 leading-relaxed">{approvedPlan.action || 'จัดซื้อตามแผนที่อนุมัติ'}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-700 w-[25%] bg-slate-50/50 text-[16.5px]">📦 จำนวนสั่งซื้อ</td>
                        <td className="px-4 py-3 text-[16.5px]">
                          <span className="font-bold text-emerald-700">{(approvedPlan.qty || 0).toLocaleString()} {material?.unit || 'หน่วย'}</span>
                          {approvedPlan.unitPrice && (
                            <span className="ml-2 text-[16.5px] text-slate-500">
                              (มูลค่า ≈ ฿{((approvedPlan.qty || 0) * (approvedPlan.unitPrice || 0)).toLocaleString()})
                            </span>
                          )}
                        </td>
                      </tr>
                      {approvedPlan.financial && (
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-700 w-[25%] bg-slate-50/50 text-[16.5px]">💰 วิเคราะห์การเงิน</td>
                          <td className="px-4 py-3 text-[16.5px] text-slate-700 leading-relaxed">{approvedPlan.financial}</td>
                        </tr>
                      )}
                      {approvedPlan.supplyForecast && (
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-700 w-[25%] bg-slate-50/50 text-[16.5px]">📦 การพยากรณ์ Supply</td>
                          <td className="px-4 py-3 text-[16.5px] text-slate-700 leading-relaxed">{approvedPlan.supplyForecast}</td>
                        </tr>
                      )}
                      {approvedPlan.risk && (
                        <tr className="hover:bg-amber-50/30">
                          <td className="px-4 py-3 font-bold text-amber-700 w-[25%] bg-amber-50/50 text-[16.5px]">⚠️ ความเสี่ยง</td>
                          <td className="px-4 py-3 text-[16.5px] text-amber-800 leading-relaxed">{approvedPlan.risk}</td>
                        </tr>
                      )}
                      {approvedPlan.mitigation && (
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-700 w-[25%] bg-slate-50/50 text-[16.5px]">🛡️ แผนรับมือ</td>
                          <td className="px-4 py-3 text-[16.5px] text-slate-700 leading-relaxed">{approvedPlan.mitigation}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Two Plans Comparison Table (Excel Style) */}
            {!readonly && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h3 className="text-[16.5px] font-bold text-slate-800 flex items-center gap-2">
                      <Target size={18} className="text-indigo-600" />
                      ตารางเปรียบเทียบแผนการจัดหา (Procurement Strategy Comparison)
                    </h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-700 text-[16.5px]">
                        <th className="p-3 border border-slate-300 font-bold text-center w-[20%]">หัวข้อการประเมิน<br/>(Evaluation Criteria)</th>
                        <th className="p-3 border border-slate-300 font-bold text-center w-[40%] bg-emerald-100 text-emerald-800">
                          <div className="flex items-center justify-center gap-1.5 mb-1"><CheckCircle2 size={16}/> AI แนะนำ</div>
                          Plan A: {aiResult.planA.title}
                        </th>
                        <th className="p-3 border border-slate-300 font-bold text-center w-[40%]">
                          Plan B: {aiResult.planB.title}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">จำนวน และ มูลค่ารวม</td>
                        <td className="p-3 border border-slate-300 font-bold text-emerald-700 bg-emerald-50/30">
                          {aiResult.planA.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planA.qty * (material?.unitPrice || 0))}
                        </td>
                        <td className="p-3 border border-slate-300 font-medium text-slate-600">
                          {aiResult.planB.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planB.qty * (material?.unitPrice || 0))}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">🔮 ถ้าเลือกแผนนี้ อนาคตจะเป็นยังไง?</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.futureImpact}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.futureImpact}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">📦 สต็อกอยู่ได้อีกกี่เดือน?</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.supplyForecast}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.supplyForecast}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">💰 วิเคราะห์ต้นทุน & ความคุ้มค่า</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.costAnalysis}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.costAnalysis}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-amber-700 bg-amber-50">⚠️ สถานการณ์เลวร้ายที่อาจเกิด</td>
                        <td className="p-3 border border-slate-300 text-amber-900 bg-amber-50/50 leading-relaxed">{aiResult.planA.riskScenarios}</td>
                        <td className="p-3 border border-slate-300 text-red-900 bg-red-50/50 leading-relaxed">{aiResult.planB.riskScenarios}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">🛡️ วิธีรับมือเมื่อเกิดความเสี่ยง</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.mitigation}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.mitigation}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">✅ ปัญหาจบไหม?</td>
                        <td className="p-3 border border-slate-300 font-semibold text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.problemResolved}</td>
                        <td className="p-3 border border-slate-300 font-semibold text-slate-800 leading-relaxed">{aiResult.planB.problemResolved}</td>
                      </tr>
                      {/* Action Buttons Row */}
                      <tr className="bg-slate-50">
                        <td className="p-4 border border-slate-300 font-bold text-slate-700 text-center">การตัดสินใจ (Decision)</td>
                        <td className="p-4 border border-slate-300 text-center bg-emerald-50/50">
                          <button 
                            disabled={loadingPlan !== null}
                            onClick={() => {
                              setLoadingPlan('A');
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan A: ${aiResult.planA.title}`, action: aiResult.planA.futureImpact, qty: aiResult.planA.qty, risk: aiResult.planA.riskScenarios, financial: aiResult.planA.costAnalysis, supplyForecast: aiResult.planA.supplyForecast, mitigation: aiResult.planA.mitigation, unitPrice: material?.unitPrice || 0 } }));
                                if (onClose) onClose();
                                setTimeout(() => setActiveTab?.("activity"), 300);
                              }, 1000);
                            }}
                            className="inline-flex items-center justify-center w-full max-w-xs gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[16.5px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {loadingPlan === 'A' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} 
                            {loadingPlan === 'A' ? "กำลังดำเนินการ..." : "เลือกแผน A → วางแผนจัดซื้อ"}
                          </button>
                        </td>
                        <td className="p-4 border border-slate-300 text-center">
                          <button 
                            disabled={loadingPlan !== null}
                            onClick={() => {
                              setLoadingPlan('B');
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan B: ${aiResult.planB.title}`, action: aiResult.planB.futureImpact, qty: aiResult.planB.qty, risk: aiResult.planB.riskScenarios, financial: aiResult.planB.costAnalysis, supplyForecast: aiResult.planB.supplyForecast, mitigation: aiResult.planB.mitigation, unitPrice: (material?.unitPrice || 150000) * 1.15 } }));
                                if (onClose) onClose();
                                setTimeout(() => setActiveTab?.("activity"), 300);
                              }, 1000);
                            }}
                            className="inline-flex items-center justify-center w-full max-w-xs gap-2 rounded-xl bg-slate-200 border border-slate-300 px-5 py-3 text-[16.5px] font-bold text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {loadingPlan === 'B' ? <Loader2 size={16} className="animate-spin text-amber-600" /> : <AlertTriangle size={16} className="text-amber-600" />}
                            {loadingPlan === 'B' ? "กำลังดำเนินการ..." : "เลือก Plan B"}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detailed Execution Plan for Plan A (AI Recommended) */}
            <div className="mt-8 mb-4">
              <div className="flex items-center gap-2 px-2 border-l-4 border-indigo-500 mb-2">
                <h2 className="text-lg font-bold text-slate-800">รายละเอียดแผนงานที่ AI แนะนำ (Plan A Execution Details)</h2>
              </div>
              <p className="text-[16.5px] text-slate-500 px-2 mb-4">ข้อมูลเชิงลึกด้านศักยภาพผู้ผลิต แผนการจัดสรรโควต้า (Lot Allocation) และร่างเงื่อนไข TOR เพื่อลดความเสี่ยง</p>
              <AIVendorStrategyView aiResult={aiResult} material={material} />
            </div>

            {/* Raw AI Response */}          {aiResult.raw && (
              <details className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <summary className="px-6 py-4 text-[16.5px] font-bold text-slate-400 cursor-pointer hover:bg-slate-50 transition flex items-center gap-2">
                  <Brain size={14} className="text-purple-500" /> ดู Raw AI Response จาก Amazon Nova Pro
                  {!isAnalyzing && (
                    <button onClick={(e) => { e.preventDefault(); hasCalledRef.current = false; callAI(); }} className="ml-auto text-purple-600 hover:text-purple-800 flex items-center gap-1 text-[16.5px] font-bold">
                      <RefreshCw size={12} /> วิเคราะห์ใหม่
                    </button>
                  )}
                </summary>
                <div className="px-6 pb-6 text-[16.5px] text-slate-600 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto font-mono border-t border-slate-100 pt-4">{aiResult.raw}</div>
              </details>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
