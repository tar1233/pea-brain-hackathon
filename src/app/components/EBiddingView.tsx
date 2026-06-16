"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, TrendingDown, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, ArrowLeft, BarChart3, Target, Zap, Package, Clock, Loader2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import AIVendorStrategyView from "./AIVendorStrategyView";
import ProcurementPlanTable from "./ProcurementPlanTable";

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

    // Pre-calculate variables to guarantee absolute consistency across LLM and UI
    const annualQty = mat?.annualDemand || mat?.eoq || 800;
    const unitPrice = mat?.unitPrice || 150000;
    const lotQty = Math.round(annualQty / 3);
    const monthlyDemand = mat?.avgMonthlyDemand || 339.4;
    const currentStock = mat?.currentStock || 0;
    const requiredStockForWait = Math.ceil(monthlyDemand * 3);
    const isEmergencyNeeded = currentStock < requiredStockForWait;
    const emergencyQty = isEmergencyNeeded ? Math.ceil(requiredStockForWait - currentStock) : 0;
    const emergencyUnitPrice = Math.round(unitPrice * 1.15);
    const emergencyBudget = emergencyQty * Math.round((mat?.budgetPrice || unitPrice * 1.05) * 1.15);

    const holdingCostRate = 0.20;
    const singleHoldingCost = Math.round(annualQty * unitPrice * holdingCostRate * 0.5);
    const phasedHoldingCost = Math.round(annualQty * unitPrice * holdingCostRate * 0.2);
    const holdingSavings = singleHoldingCost - phasedHoldingCost;

    if (readonly) {
      const finalQty = approvedQty || mat?.eoq || 0;
      const annualQtyRO = mat?.annualDemand || mat?.eoq || 800;
      const holdingCostRO = Math.round(annualQtyRO * (mat?.unitPrice || 150000) * 0.20 * 0.3);
      setAiResult({
        demandAnalysis: `สต็อก ${mat?.currentStock?.toLocaleString()} ${mat?.unit} ใช้ได้อีก ${daysOfStock} วัน (Demand เฉลี่ย ${mat?.avgMonthlyDemand}/${mat?.unit}/เดือน) → ต้องสั่งทันที`,
        marketAnalysis: `ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} เทียบราคากลาง ฿${mat?.budgetPrice?.toLocaleString()} ควรประกวดราคาโดยเร็ว`,
        supplierAnalysis: `Lead Time ${mat?.leadTimeWeeks} สัปดาห์ (${leadTimeDays} วัน) สต็อกเหลือ ${daysOfStock} วัน → ต้องเร่ง Supplier`,
        emergencyPlan: isEmergencyNeeded ? `1. ดำเนินการจัดซื้อวิธีพิเศษกรณีฉุกเฉินจำนวน ${emergencyQty.toLocaleString()} เครื่อง ในเดือน ก.ค. 2569\n2. ขอโอนย้ายพัสดุจากคลังภูมิภาคอื่น\n3. จัดทำสัญญากรอบราคา e-Bidding แบบ VMI 3 ล็อต` : "",
        priceForecast: { threeMonth: "แนวโน้มราคาทรงตัว ±5%", oneYear: "คาดว่าราคาจะปรับตัวตามต้นทุนวัตถุดิบ", bestTimeToBuy: "ช่วงนี้ถึง 3 เดือนข้างหน้า" },
        lotStrategy: { recommendation: "สั่ง 3 Lot", totalQty: annualQtyRO, numLots: 3, qtyPerLot: Math.ceil(annualQtyRO / 3), reason: "ลดความเสี่ยงและ Holding Cost", savings: `≈฿${holdingCostRO.toLocaleString()}` },
        lotSchedule: [],
        planA: { title: "จัดซื้อทุก 4 เดือน (แบ่ง 3 งวด - VMI Compliant)", qty: finalQty, futureImpact: `สอดรับกับนโยบาย VMI ที่ฝากของได้สูงสุด 5 เดือน`, supplyForecast: "สินค้าทยอยเข้าทุกๆ 4 เดือน ไม่ล้นคลัง", costAnalysis: "TCO ต่ำ และไม่ละเมิดเงื่อนไขระยะเวลาฝากคลัง", riskScenarios: "จัดซื้อบ่อยขึ้น แต่ตอบโจทย์ข้อจำกัดฝาก VMI 5 เดือน", mitigation: "ใช้สัญญากรอบราคา (Frame Agreement)", problemResolved: "แก้ปัญหาของขาด + สอดคล้องข้อจำกัด VMI 5 เดือน" },
        planB: { title: "สั่งซื้อ 1 สัญญารวม (Annual - Non-Compliant Risk)", qty: annualQtyRO, futureImpact: `ขัดกับเงื่อนไข VMI ฝากของได้แค่ 5 เดือน กฟภ. ต้องรับภาระสต็อก`, supplyForecast: `ได้ของทั้งหมด แต่ต้องล้นเข้าคลัง กฟภ. หลังเดือนที่ 5`, costAnalysis: `คลังเต็ม + Holding Cost กฟภ. สูงมากในช่วงปลายปี`, riskScenarios: "ขัดกับเงื่อนไข VMI (ฝากได้แค่ 5 เดือน) คลังมีพื้นที่ไม่พอ", mitigation: "ต้องเตรียมเช่าพื้นที่คลังสินค้านอก กฟภ. เพิ่มเติม", problemResolved: "แก้ของขาด แต่สร้างปัญหาคลังเต็มและขัดนโยบาย" },
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

    // Current date for AI awareness
    const now = new Date();
    const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const currentMonth = thaiMonths[now.getMonth()];
    const currentYear = now.getFullYear() + 543; // พ.ศ.
    const currentMonthNum = now.getMonth() + 1; // 1-12
    const remainingMonths = 12 - currentMonthNum;

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

Holding Cost (อัตรา ${holdingCostRate * 100}%): ซื้อทีเดียว = ${singleHoldingCost.toLocaleString()} บาท/ปี | ทยอย 3 ล็อต = ${phasedHoldingCost.toLocaleString()} บาท/ปี | ประหยัด ${holdingSavings.toLocaleString()} บาท/ปี

ข้อมูลการคำนวณของระบบที่คุณต้องนำมาอ้างอิงและวิเคราะห์ให้ตรงกัน:
- ความต้องการในช่วงรอ e-Bidding (ก.ค. - ก.ย. 2569): ${requiredStockForWait.toLocaleString()} เครื่อง
- สต็อกคงเหลือปัจจุบัน: ${currentStock.toLocaleString()} เครื่อง
- สถานะ: ${isEmergencyNeeded ? `สต็อกขาดแคลนสะสม ${emergencyQty.toLocaleString()} เครื่อง จึงต้องแนะนำให้ทำแผนจัดซื้อกรณีฉุกเฉินวิธีพิเศษทันทีในเดือน ก.ค. 2569 จำนวน ${emergencyQty.toLocaleString()} เครื่อง (ราคาพรีเมียม 15% = ฿${emergencyUnitPrice.toLocaleString()}/หน่วย) เพื่อรองรับการใช้งานช่วงประกวดราคา 3 เดือน` : 'สต็อกเพียงพอสำหรับช่วงจัดหา'}
- แผนหลัก (Plan A): ประกวดราคา e-Bidding สัญญากรอบราคา (Frame Agreement VMI) สำหรับงวดถัดไปจำนวน ${annualQty.toLocaleString()} เครื่อง แบ่งเป็น 3 ล็อต ล็อตละ ${lotQty.toLocaleString()} เครื่อง ทยอยส่งมอบทุก 4 เดือน (ล็อต 1: ต.ค. 2569, ล็อต 2: ม.ค. 2570, ล็อต 3: เม.ย. 2570) เพื่อสอดรับกับเกณฑ์ VMI ของ กฟภ. (ฝากของได้สูงสุด 5 เดือน)

กฎ: ห้ามอ้างอิงสงคราม โควิด แผ่นดินไหว หรือเหตุการณ์มหภาคที่ทำนายไม่ได้
กฎ: วิเคราะห์จากข้อมูลจริงที่ให้มาเท่านั้น ต้องเปรียบเทียบซื้อทีเดียว vs ทยอยซื้อ ว่า TCO อันไหนต่ำกว่า
กฎ: ห้ามถามคำถามกลับ ห้ามเขียน "...ไหม?" ต้องตอบเป็นข้อสรุปเท่านั้น
กฎ: แนะนำให้ตั้ง Dynamic ROP ล่วงหน้าที่สต็อก 100 วัน เพื่อรองรับ Lead Time รอบแรก ${leadTimeDays} วันแบบไร้รอยต่อ
กฎ: ทุก field ต้องมีคำตอบจริง มีตัวเลขประกอบ ห้ามเว้นว่าง ห้ามเขียนว่า "-"
กฎ: ห้ามแนะนำเดือนที่ผ่านไปแล้ว วันนี้คือ ${currentMonth} ${currentYear}

ตอบ JSON ตามนี้ (ห้ามมี markdown ห้ามมี text อื่น):
{
  "demandAnalysis": "สต็อกปัจจุบัน ${currentStock} เครื่อง ต่ำกว่า Safety Stock (${mat?.safetyStock} เครื่อง) และมีความต้องการใช้งานเฉลี่ย ${monthlyDemand} เครื่อง/เดือน ซึ่งในช่วงระยะเวลารอจัดหา e-Bidding (ก.ค.-ก.ย. 2569) รวม 3 เดือน มีความต้องการใช้งานสะสม ${requiredStockForWait} เครื่อง ทำให้สต็อกปัจจุบันขาดแคลนในช่วงดังกล่าว",
  "marketAnalysis": "ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} ต่ำกว่าราคากลาง ฿${mat?.budgetPrice?.toLocaleString()} แนะนำให้เข้าทำสัญญากรอบราคา e-Bidding ทันทีในเดือนกรกฎาคม 2569 เพื่อล็อคราคาประมูลไว้ล่วงหน้าก่อนที่ราคาในตลาดจะปรับตัวสูงขึ้นในไตรมาส 4",
  "supplierAnalysis": "Lead Time การประกวดราคาปกติ 12 สัปดาห์ (${leadTimeDays} วัน) ในขณะที่สต็อกคงคลังเหลือใช้งานได้เพียง ${daysOfStock} วัน ทำให้เกิดช่องว่างการจัดหา ${gapDays} วันในช่วงเปลี่ยนผ่านสัญญา จึงต้องการจัดหาเสริมด่วน",
  "emergencyPlan": "1. อนุมัติจัดซื้อวิธีพิเศษกรณีฉุกเฉินทันทีในเดือนกรกฎาคม 2569 จำนวน ${emergencyQty} เครื่อง ที่ราคาพรีเมียม 15% (฿${emergencyUnitPrice.toLocaleString()}/หน่วย) เพื่อรักษาระดับสต็อกไม่ให้ขาดแคลน\\n2. เจรจาขอโอนย้ายพัสดุบางส่วนจากคลังส่วนภูมิภาคอื่นที่มีสต็อกคงเหลือส่วนเกิน\\n3. ปรับระดับการเบิกจ่ายให้สอดคล้องกับความจำเป็นเร่งด่วนเท่านั้น",
  "costOptimization": {
    "singlePurchaseCost": "ซื้อทีเดียว: ต้นทุนสินค้า ฿${(annualQty * unitPrice).toLocaleString()} + Holding Cost ฿${singleHoldingCost.toLocaleString()} = TCO ฿${(annualQty * unitPrice + singleHoldingCost).toLocaleString()}",
    "phasedPurchaseCost": "ทยอยซื้อ 3 ล็อต (VMI): ต้นทุนสินค้า ฿${(annualQty * unitPrice).toLocaleString()} + Holding Cost ฿${phasedHoldingCost.toLocaleString()} = TCO ฿${(annualQty * unitPrice + phasedHoldingCost).toLocaleString()}",
    "savingsAmount": "ประหยัดได้ ฿${holdingSavings.toLocaleString()} จากการใช้สัญญากรณีทยอยส่งมอบตามเกณฑ์ VMI ของ กฟภ. (ฝากสูงสุด 5 เดือน)",
    "recommendation": "แนะนำสัญญาจัดหาแบบ Frame Agreement ทยอยเรียกรับพัสดุ 3 ล็อต เพราะประหยัด TCO ได้สูงกว่าและสอดคล้องระเบียบ VMI"
  },
  "planA": {
    "title": "จัดซื้อแบบสัญญากรอบราคาแบ่ง 3 งวด (VMI Frame Agreement)",
    "qty": ${annualQty},
    "futureImpact": "ลดค่าใช้จ่ายการถือครองพัสดุ (Holding Cost) ของ กฟภ. ลงถึง ฿${holdingSavings.toLocaleString()} ต่อปี และสอดคล้องกับนโยบาย VMI ที่จำกัดการฝากส่งของผู้ผลิตได้สูงสุดไม่เกิน 5 เดือน",
    "supplyForecast": "ทยอยรับพัสดุเป็น 3 ล็อต (ล็อตละ ${lotQty} เครื่อง ในเดือน ต.ค. 2569, ม.ค. 2570 และ เม.ย. 2570) ช่วยรักษาระดับคงคลังให้อยู่ในเกณฑ์ปลอดภัยโดยไม่ล้นคลัง",
    "costAnalysis": "ต้นทุนรวม TCO ต่ำสุดเนื่องจากไม่มีค่าปรับคลังล้นและลดภาระการจัดเก็บพัสดุจมของ กฟภ.",
    "riskScenarios": "อาจเกิดความล่าช้าในการส่งมอบล็อตใดล็อตหนึ่งจากผู้ผลิตเนื่องจากกำลังการผลิตตึงตัว",
    "mitigation": "ร่างสัญญากำหนดให้ผู้ชนะต้องมีโควตากำลังการผลิตว่างที่ผ่านการตรวจสอบก่อนจัดสรรล็อต",
    "problemResolved": "แก้ปัญหาพัสดุขาดแคลนระยะยาวได้อย่างยั่งยืน และเป็นไปตามกฎระเบียบจัดเก็บ VMI 5 เดือน 100%"
  },
  "planB": {
    "title": "จัดซื้อสัญญารวมปีเดียวรับมอบครั้งเดียว (Annual Single Purchase)",
    "qty": ${annualQty},
    "futureImpact": "ขัดกับนโยบาย VMI (ฝากได้สูงสุด 5 เดือน) ทำให้ กฟภ. ต้องรับพัสดุเข้าเก็บเองทั้งหมดในคลัง ส่งผลให้เกิดภาวะคลังล้นและสต็อกเสื่อมสภาพ",
    "supplyForecast": "พัสดุเข้าเก็บคลัง กฟภ. พร้อมกันทั้งหมด เกิดขีดจำกัดความสามารถในการจัดเก็บช่วงปลายปี",
    "costAnalysis": "มี Holding Cost สูงถึง ฿${singleHoldingCost.toLocaleString()} ต่อปี และอาจมีค่าใช้จ่ายเพิ่มเติมในการเช่าคลังสินค้าภายนอก กฟภ. รองรับ",
    "riskScenarios": "ผิดกฎระเบียบ VMI ปัจจุบัน และมีความเสี่ยงคลังแตก (Overstock) สูงมาก",
    "mitigation": "ต้องของบประมาณเพิ่มพิเศษเพื่อขยายพื้นที่คลังสินค้าหรือเช่าคลังนอกมารองรับพัสดุล็อตใหญ่",
    "problemResolved": "แก้ปัญหาสต็อกขาดแคลนได้ แต่สร้างปัญหาระเบียบวินัยการคลังและค่าใช้จ่ายแอบแฝงสูงมาก"
  },
  "priceForecast": {
    "threeMonth": "ราคาคาดว่าจะคงตัว แต่จะเริ่มปรับขึ้น 12-15% ในไตรมาส 4 เนื่องจากสงครามการค้ากระทบวัตถุดิบนำเข้า",
    "oneYear": "แนวโน้มราคาเฉลี่ยอาจสูงขึ้น 15% จากต้นทุนทองแดงและเหล็กซิลิคอนที่สูงขึ้น",
    "bestTimeToBuy": "กรกฎาคม 2569 (เพื่อล็อคราคาสัญญา Frame Agreement ก่อนตลาดพุ่ง)"
  },
  "lotStrategy": {
    "recommendation": "สั่งจัดหาแบบสัญญากรอบราคาแบ่ง 3 Lot ทยอยรับมอบ",
    "totalQty": ${annualQty},
    "numLots": 3,
    "qtyPerLot": ${lotQty},
    "reason": "สอดคล้องกับขีดจำกัดผู้ผลิตและเกณฑ์การเก็บรักษา VMI ไม่เกิน 5 เดือน",
    "savings": "ประหยัด Holding Cost ได้ ฿${holdingSavings.toLocaleString()}/ปี"
  },
  "lotSchedule": [
    { "lot": 1, "qty": ${lotQty}, "orderMonth": "กรกฎาคม 2569", "receiveMonth": "ตุลาคม 2569", "action": "ประมูลและส่งมอบล็อตที่ 1" },
    { "lot": 2, "qty": ${lotQty}, "orderMonth": "กรกฎาคม 2569", "receiveMonth": "มกราคม 2570", "action": "ส่งมอบล็อตที่ 2" },
    { "lot": 3, "qty": ${annualQty - lotQty * 2}, "orderMonth": "กรกฎาคม 2569", "receiveMonth": "เมษายน 2570", "action": "ส่งมอบล็อตที่ 3" }
  ],
  "executiveSummary": "ตรวจพบสต็อกปัจจุบัน (${currentStock} เครื่อง) เหลือใช้เพียง ${daysOfStock} วัน และไม่พอช่วงรอ e-Bidding (ขาดแคลนสะสม ${emergencyQty} เครื่อง) AI แนะนำอนุมัติจัดซื้อวิธีพิเศษกรณีฉุกเฉินจำนวน ${emergencyQty} เครื่องในเดือน ก.ค. 2569 ทันที และเปิดประมูล e-Bidding แบบสัญญา Frame Agreement 3 ล็อต ทยอยส่งมอบ (VMI) เพื่อลดต้นทุนจมลง ฿${holdingSavings.toLocaleString()} ต่อปี"
}

สำคัญมาก: ตอบเป็น JSON เท่านั้น ห้ามมี text อื่นนอก JSON ห้ามมี markdown
กฎเด็ดขาด: ทุกคำตอบต้องเป็น "ข้อสรุป" ที่มีเหตุผลว่า "เพราะ..." ห้ามถามคำถามกลับ ห้ามเขียน "...ไหม?" "...หรือไม่?" ห้ามเว้นว่าง ห้ามใช้ "-" และห้ามใช้สัญลักษณ์ดอลลาร์ ($) เป็นอันขาด ให้ใช้เครื่องหมายบาท (฿) เสมอในการแสดงผลค่าเงิน`;

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
          title: p?.title || "จัดซื้อแบบสัญญากรอบราคาแบ่ง 3 งวด (VMI Frame Agreement)",
          qty: p?.qty || annualQty,
          futureImpact: p?.futureImpact || `ลดค่าใช้จ่ายการถือครองพัสดุ (Holding Cost) ของ กฟภ. ลงถึง ฿${holdingSavings.toLocaleString()} ต่อปี และสอดคล้องกับนโยบาย VMI ที่จำกัดการฝากส่งของผู้ผลิตได้สูงสุดไม่เกิน 5 เดือน`,
          supplyForecast: p?.supplyForecast || `ทยอยรับพัสดุเป็น 3 ล็อต (ล็อตละ ${lotQty.toLocaleString()} เครื่อง ในเดือน ต.ค. 2569, ม.ค. 2570 และ เม.ย. 2570) ช่วยรักษาระดับคงคลังให้อยู่ในเกณฑ์ปลอดภัยโดยไม่ล้นคลัง`,
          costAnalysis: p?.costAnalysis || `TCO ต่ำที่สุด ไม่เสียค่าปรับคลังสินค้า และไม่ขัดระเบียบ VMI`,
          riskScenarios: p?.riskScenarios || `อาจเกิดความล่าช้าในการส่งมอบล็อตใดล็อตหนึ่งจากผู้ผลิตเนื่องจากกำลังการผลิตตึงตัว`,
          mitigation: p?.mitigation || `ร่างสัญญากำหนดให้ผู้ชนะต้องมีโควตากำลังการผลิตว่างที่ผ่านการตรวจสอบก่อนจัดสรรล็อต`,
          problemResolved: p?.problemResolved || `แก้ปัญหาพัสดุขาดแคลนระยะยาวได้อย่างยั่งยืน และเป็นไปตามกฎระเบียบจัดเก็บ VMI 5 เดือน 100%`
        });
        const defaultPlanB = (p: any) => ({
          title: p?.title || "จัดซื้อสัญญารวมปีเดียวรับมอบครั้งเดียว (Annual Single Purchase)",
          qty: p?.qty || annualQty,
          futureImpact: p?.futureImpact || `ขัดกับเงื่อนไข VMI ปัจจุบันที่ให้ฝากของได้แค่ 5 เดือน กฟภ. ต้องรับของเข้าคลังเองทั้งหมดในเดือนที่ 6`,
          supplyForecast: p?.supplyForecast || `รับมอบของล็อตใหญ่ แต่ กฟภ. จะไม่มีพื้นที่จัดเก็บเพียงพอสำหรับ ${annualQty.toLocaleString()} เครื่อง`,
          costAnalysis: p?.costAnalysis || `Holding Cost ตกเป็นภาระ กฟภ. สูงมาก ≈฿${singleHoldingCost.toLocaleString()} บาท/ปี`,
          riskScenarios: p?.riskScenarios || `ขัดกับเงื่อนไข VMI (ฝากได้แค่ 5 เดือน) ทำให้คลัง กฟภ. แตก (Overstock) และผิดระเบียบ`,
          mitigation: p?.mitigation || `หากจำเป็นต้องซื้อ ต้องของบประมาณฉุกเฉินเพื่อเช่าคลังสินค้านอก กฟภ. รองรับพัสดุส่วนเกิน`,
          problemResolved: p?.problemResolved || `แก้ปัญหาของขาดได้ แต่สร้างปัญหาใหญ่เรื่องพื้นที่คลังเต็มและผิดนโยบาย`
        });

        setAiResult({
          demandAnalysis: parsed.demandAnalysis || `สต็อกปัจจุบัน ${currentStock} เครื่อง ต่ำกว่า Safety Stock (${mat?.safetyStock} เครื่อง) และมีความต้องการใช้งานเฉลี่ย ${monthlyDemand} เครื่อง/เดือน ซึ่งในช่วงระยะเวลารอจัดหา e-Bidding (ก.ค.-ก.ย. 2569) รวม 3 เดือน มีความต้องการใช้งานสะสม ${requiredStockForWait} เครื่อง ทำให้สต็อกปัจจุบันขาดแคลนในช่วงดังกล่าว`,
          marketAnalysis: parsed.marketAnalysis || `ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} ต่ำกว่าราคากลาง ฿${mat?.budgetPrice?.toLocaleString()} แนะนำให้เข้าทำสัญญากรอบราคา e-Bidding ทันทีในเดือนกรกฎาคม 2569 เพื่อล็อคราคาประมูลไว้ล่วงหน้าก่อนที่ราคาในตลาดจะปรับตัวสูงขึ้นในไตรมาส 4`,
          supplierAnalysis: parsed.supplierAnalysis || `Lead Time การประกวดราคาปกติ 12 สัปดาห์ (${leadTimeDays} วัน) ในขณะที่สต็อกคงคลังเหลือใช้งานได้เพียง ${daysOfStock} วัน ทำให้เกิดช่องว่างการจัดหา ${gapDays} วันในช่วงเปลี่ยนผ่านสัญญา จึงต้องการจัดหาเสริมด่วน`,
          emergencyPlan: parsed.emergencyPlan || (isEmergencyNeeded ? `1. อนุมัติจัดซื้อวิธีพิเศษกรณีฉุกเฉินทันทีในเดือนกรกฎาคม 2569 จำนวน ${emergencyQty} เครื่อง ที่ราคาพรีเมียม 15% (฿${emergencyUnitPrice.toLocaleString()}/หน่วย) เพื่อรักษาระดับสต็อกไม่ให้ขาดแคลน\n2. เจรจาขอโอนย้ายพัสดุบางส่วนจากคลังส่วนภูมิภาคอื่นที่มีสต็อกคงเหลือส่วนเกิน\n3. ปรับระดับการเบิกจ่ายให้สอดคล้องกับความจำเป็นเร่งด่วนเท่านั้น` : ""),
          costOptimization: parsed.costOptimization || undefined,
          priceForecast: parsed.priceForecast || { threeMonth: `ราคาคาดว่าจะคงตัว แต่จะเริ่มปรับขึ้น 12-15% ในไตรมาส 4 เนื่องจากสงครามการค้ากระทบวัตถุดิบนำเข้า`, oneYear: `แนวโน้มราคาเฉลี่ยอาจสูงขึ้น 15% จากต้นทุนทองแดงและเหล็กซิลิคอนที่สูงขึ้น`, bestTimeToBuy: `กรกฎาคม 2569 (เพื่อล็อคราคาสัญญา Frame Agreement ก่อนตลาดพุ่ง)` },
          lotStrategy: parsed.lotStrategy || { recommendation: `สั่งจัดหาแบบสัญญากรอบราคาแบ่ง 3 Lot ทยอยรับมอบ`, totalQty: annualQty, numLots: 3, qtyPerLot: lotQty, reason: `สอดคล้องกับขีดจำกัดผู้ผลิตและเกณฑ์การเก็บรักษา VMI ไม่เกิน 5 เดือน`, savings: `ประหยัด Holding Cost ได้ ฿${holdingSavings.toLocaleString()}/ปี` },
          lotSchedule: parsed.lotSchedule || [],
          planA: defaultPlanA(parsed.planA),
          planB: defaultPlanB(parsed.planB),
          executiveSummary: parsed.executiveSummary || `ตรวจพบสต็อกปัจจุบัน (${currentStock} เครื่อง) เหลือใช้เพียง ${daysOfStock} วัน และไม่พอช่วงรอ e-Bidding (ขาดแคลนสะสม ${emergencyQty} เครื่อง) AI แนะนำอนุมัติจัดซื้อวิธีพิเศษกรณีฉุกเฉินจำนวน ${emergencyQty} เครื่องในเดือน ก.ค. 2569 ทันที และเปิดประมูล e-Bidding แบบสัญญา Frame Agreement 3 ล็อต ทยอยส่งมอบ (VMI) เพื่อลดต้นทุนจมลง ฿${holdingSavings.toLocaleString()} ต่อปี`,
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
        setAiResult({
          demandAnalysis: `สต็อกปัจจุบัน ${currentStock} เครื่อง ต่ำกว่า Safety Stock (${mat?.safetyStock} เครื่อง) และมีความต้องการใช้งานเฉลี่ย ${monthlyDemand} เครื่อง/เดือน ซึ่งในช่วงระยะเวลารอจัดหา e-Bidding (ก.ค.-ก.ย. 2569) รวม 3 เดือน มีความต้องการใช้งานสะสม ${requiredStockForWait} เครื่อง ทำให้สต็อกปัจจุบันขาดแคลนในช่วงดังกล่าว`,
          marketAnalysis: `ราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString()} ต่ำกว่าราคากลาง ฿${mat?.budgetPrice?.toLocaleString()} แนะนำให้เข้าทำสัญญากรอบราคา e-Bidding ทันทีในเดือนกรกฎาคม 2569 เพื่อล็อคราคาประมูลไว้ล่วงหน้าก่อนที่ราคาในตลาดจะปรับตัวสูงขึ้นในไตรมาส 4`,
          supplierAnalysis: `Lead Time การประกวดราคาปกติ 12 สัปดาห์ (${leadTimeDays} วัน) ในขณะที่สต็อกคงคลังเหลือใช้งานได้เพียง ${daysOfStock} วัน ทำให้เกิดช่องว่างการจัดหา ${gapDays} วันในช่วงเปลี่ยนผ่านสัญญา จึงต้องการจัดหาเสริมด่วน`,
          emergencyPlan: isEmergencyNeeded ? `1. อนุมัติจัดซื้อวิธีพิเศษกรณีฉุกเฉินทันทีในเดือนกรกฎาคม 2569 จำนวน ${emergencyQty} เครื่อง ที่ราคาพรีเมียม 15% (฿${emergencyUnitPrice.toLocaleString()}/หน่วย) เพื่อรักษาระดับสต็อกไม่ให้ขาดแคลน\n2. เจรจาขอโอนย้ายพัสดุบางส่วนจากคลังส่วนภูมิภาคอื่นที่มีสต็อกคงเหลือส่วนเกิน\n3. ปรับระดับการเบิกจ่ายให้สอดคล้องกับความจำเป็นเร่งด่วนเท่านั้น` : "",
          priceForecast: { threeMonth: `ราคาคาดว่าจะคงตัว แต่จะเริ่มปรับขึ้น 12-15% ในไตรมาส 4 เนื่องจากสงครามการค้ากระทบวัตถุดิบนำเข้า`, oneYear: `แนวโน้มราคาเฉลี่ยอาจสูงขึ้น 15% จากต้นทุนทองแดงและเหล็กซิลิคอนที่สูงขึ้น`, bestTimeToBuy: `กรกฎาคม 2569 (เพื่อล็อคราคาสัญญา Frame Agreement ก่อนตลาดพุ่ง)` },
          lotStrategy: { recommendation: `สั่งจัดหาแบบสัญญากรอบราคาแบ่ง 3 Lot ทยอยรับมอบ`, totalQty: annualQty, numLots: 3, qtyPerLot: lotQty, reason: `สอดคล้องกับขีดจำกัดผู้ผลิตและเกณฑ์การเก็บรักษา VMI ไม่เกิน 5 เดือน`, savings: `ประหยัด Holding Cost ได้ ฿${holdingSavings.toLocaleString()}/ปี` },
          lotSchedule: [],
          planA: { title: "จัดซื้อแบบสัญญากรอบราคาแบ่ง 3 งวด (VMI Frame Agreement)", qty: annualQty, futureImpact: `ลดค่าใช้จ่ายการถือครองพัสดุ (Holding Cost) ของ กฟภ. ลงถึง ฿${holdingSavings.toLocaleString()} ต่อปี และสอดคล้องกับนโยบาย VMI ที่จำกัดการฝากส่งของผู้ผลิตได้สูงสุดไม่เกิน 5 เดือน`, supplyForecast: `ทยอยรับพัสดุเป็น 3 ล็อต (ล็อตละ ${lotQty.toLocaleString()} เครื่อง ในเดือน ต.ค. 2569, ม.ค. 2570 และ เม.ย. 2570) ช่วยรักษาระดับคงคลังให้อยู่ในเกณฑ์ปลอดภัยโดยไม่ล้นคลัง`, costAnalysis: `TCO ต่ำที่สุด ไม่ต้องเสียค่าเช่าคลังเพิ่ม`, riskScenarios: `ตอบโจทย์ข้อจำกัดการฝาก VMI 5 เดือนของ กฟภ. อย่างสมบูรณ์`, mitigation: `ใช้สัญญากรอบราคา (Frame Agreement) จัดซื้อทั้งปีแต่ทยอยเรียก`, problemResolved: `แก้ของขาด + สอดคล้องนโยบายฝาก VMI 5 เดือน 100%` },
          planB: { title: "จัดซื้อสัญญารวมปีเดียวรับมอบครั้งเดียว (Annual Single Purchase)", qty: annualQty, futureImpact: `ขัดกับเงื่อนไข VMI ปัจจุบันที่ฝากของได้แค่ 5 เดือน`, supplyForecast: `ล้นเข้าคลัง กฟภ. ทั้งหมดหลังเดือนที่ 5 เนื่องจากฝากต่อไม่ได้`, costAnalysis: `ภาระ Holding Cost ตกหนักที่ กฟภ. ≈฿${Math.round(annualQty * (mat?.unitPrice || 150000) * 0.20 * 0.5).toLocaleString()} บาท/ปี`, riskScenarios: `ผิดเงื่อนไข VMI 5 เดือน ทำให้คลัง กฟภ. แตก (Overstock)`, mitigation: `ต้องชี้แจงผู้บริหารเพื่อของบประมาณเช่าพื้นที่คลังสินค้านอก`, problemResolved: `แก้ปัญหาของขาด แต่สร้างปัญหาเรื่องพื้นที่คลังเต็มและผิดนโยบาย` },
          executiveSummary: `ตรวจพบสต็อกปัจจุบัน (${currentStock} เครื่อง) เหลือใช้เพียง ${daysOfStock} วัน และไม่พอช่วงรอ e-Bidding (ขาดแคลนสะสม ${emergencyQty} เครื่อง) AI แนะนำอนุมัติจัดซื้อวิธีพิเศษกรณีฉุกเฉินจำนวน ${emergencyQty} เครื่องในเดือน ก.ค. 2569 ทันที และเปิดประมูล e-Bidding แบบสัญญา Frame Agreement 3 ล็อต ทยอยส่งมอบ (VMI) เพื่อลดต้นทุนจมลง ฿${holdingSavings.toLocaleString()} ต่อปี`,
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
                <p className="text-[16.5px] leading-relaxed font-semibold text-slate-800">{aiResult.executiveSummary.replaceAll('$', '฿')}</p>
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
                        <td className="p-2 border border-slate-300 font-bold text-slate-800 align-top bg-slate-50" rowSpan={4}>
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
                      <tr className="hover:bg-slate-50 text-[16.5px] bg-red-50/10">
                        <td className="p-2 border border-slate-300 font-bold text-rose-700 flex items-center gap-2"><AlertTriangle size={14} className="text-rose-500"/> แผนเผชิญเหตุฉุกเฉิน (Emergency Plan)</td>
                        <td className="p-2 border border-slate-300 text-slate-700 leading-relaxed whitespace-pre-line font-medium">{aiResult.emergencyPlan}</td>
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
                        <td className="p-2 border border-slate-300 font-medium text-slate-700">Holding Cost: ทยอยซื้อ 3 ล็อต (VMI) (สต็อกเฉลี่ย 20%)</td>
                        <td className="p-2 border border-slate-300 text-emerald-600 font-medium">฿{aiResult.financials.phasedHC.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-red-50 text-[16.5px] bg-red-50/50">
                        <td className="p-2 border border-slate-300 font-bold text-red-800 flex items-center gap-2">🔴 TCO ซื้อทีเดียว (Single Purchase)</td>
                        <td className="p-2 border border-slate-300 text-red-800 font-black">฿{aiResult.financials.singleTCO.toLocaleString()}</td>
                      </tr>
                      <tr className="hover:bg-emerald-50 text-[16.5px] bg-emerald-50/50">
                        <td className="p-2 border border-slate-300 font-bold text-emerald-800 flex items-center gap-2">🟢 TCO ทยอยซื้อ 3 ล็อต (Phased Purchase)</td>
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
