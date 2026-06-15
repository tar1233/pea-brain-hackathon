"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, FileSearch, Gavel, Users, FileText, AlertTriangle, Brain, ShieldAlert, ArrowRight, ChevronDown, ChevronRight, Package, Sparkles, Loader2, Target } from "lucide-react";
import { useData } from "../context/DataContext";

interface ApprovedPlan {
  materialId: string;
  materialName: string;
  planName: string;
  action: string;
  qty: number;
  risk: string;
  financial: string;
  supplyForecast?: string;
  mitigation?: string;
  unitPrice: number;
}

interface RiskMitigation {
  isLoading: boolean;
  plan: string | null;
  parsedPlan?: any;
  selectedOptionId?: 1 | 2;
}

const highlightNumbers = (text: string) => {
  if (!text) return text;
  // Match numbers optionally followed by common units
  const regex = /([\d,.]+(?:\s*(?:เครื่อง|วัน|สัปดาห์|เดือน|บาท|ล้านบาท|ชิ้น|แห่ง|%))?)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (!part) return null;
    // Every odd index in split with a capture group is a match
    if (i % 2 === 1) {
      return <span key={i} className="font-extrabold text-indigo-700 bg-indigo-100/40 px-1 rounded mx-0.5">{part}</span>;
    }
    return part;
  });
};

export default function ActivityView({ approvedPlans = [] }: { approvedPlans?: ApprovedPlan[] }) {
  const { materials, riskAlerts, vendors } = useData();
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);
  const [riskMitigations, setRiskMitigations] = useState<Record<string, RiskMitigation>>({});
  const [trackingMitigations, setTrackingMitigations] = useState<Record<string, RiskMitigation>>({});
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string} | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auto-expand the most recently approved material
  useEffect(() => {
    if (approvedPlans.length > 0) {
      setExpandedMaterial(approvedPlans[approvedPlans.length - 1].materialId);
    }
  }, [approvedPlans.length]);

  // Simulate AI risk monitoring — auto-analyze when alert exists
  async function handleAIRiskAnalysis(materialId: string, alertMessage: string) {
    setRiskMitigations(prev => ({ ...prev, [materialId]: { isLoading: true, plan: null } }));
    try {
      const mat = materials.find(m => m.id === materialId || m.sapCode === materialId);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `⚠️ ระบบเฝ้าระวังตรวจพบความเสี่ยง: "${alertMessage}" สำหรับพัสดุ ${mat?.name || materialId} (สต็อก: ${mat?.currentStock} ${mat?.unit}, Safety Stock: ${mat?.safetyStock}). กรุณาแนะนำวิธีจัดการความเสี่ยงนี้แบบสั้นกระชับ 3-4 ข้อ เป็นภาษาไทย ระบุขั้นตอนชัดเจน` }],
        }),
      });
      const data = await res.json();
      setRiskMitigations(prev => ({ ...prev, [materialId]: { isLoading: false, plan: data.content || "ไม่สามารถวิเคราะห์ได้" } }));
    } catch {
      setRiskMitigations(prev => ({ ...prev, [materialId]: { isLoading: false, plan: "เกิดข้อผิดพลาดในการเชื่อมต่อ AI" } }));
    }
  }

  // Simulate AI tracking analysis — auto-analyze delivery delays
  async function handleAITrackingAnalysis(materialId: string, planName: string) {
    setTrackingMitigations(prev => ({ ...prev, [materialId]: { isLoading: true, plan: null } }));
    try {
      const mat = materials.find(m => m.id === materialId || m.sapCode === materialId);
      const vendorListText = vendors?.map(v => `- ชื่อ: ${v.name}, โควต้า: ${v.registeredCapacity}, POค้าง: ${v.outstandingPOs}, ความน่าเชื่อถือ: ${(v.reliabilityScore * 100).toFixed(0)}%`).join('\\n') || 'ไม่มีข้อมูล';
      
      const dailyDemand = Math.ceil((mat?.avgMonthlyDemand || 0) / 30);
      const stockSurvivalDays = Math.floor((mat?.currentStock || 0) / (dailyDemand || 1));
      // A 15-day delay on a Just-In-Time schedule means exactly 15 days of stockout
      const shortfallDays = 15;
      const exactShortageQty = shortfallDays * dailyDemand;
      
      // Calculate realistic rush lead time (e.g. 20% of standard lead time, minimum 7 days)
      const standardLeadTimeDays = (mat?.leadTimeWeeks || 4) * 7;
      const rushLeadTimeDays = Math.max(7, Math.ceil(standardLeadTimeDays * 0.2));
      const isOldSupplierFaster = 15 < rushLeadTimeDays;

      let strategicActionPlan = "";
      if (isOldSupplierFaster) {
        strategicActionPlan = `*สรุปขั้นตอน:* เนื่องจากสั่งผลิตด่วนเจ้าใหม่ (ใช้เวลา ${rushLeadTimeDays} วัน) ช้ากว่ารอเจ้าเก่า (15 วัน) การเปิด PO สั่งผลิตใหม่จึงผิดหลักการ! กลยุทธ์ที่ต้องเสนอคือ:
- ทางเลือก 1 (Option 1): ติดต่อ Supplier ในรายชื่อด้านบน เพื่อกว้านซื้อ "สต็อกพร้อมส่ง (Ready Stock)" ที่ส่งได้ภายใน 3 วัน จำนวน ${exactShortageQty} เครื่อง (ยอมจ่ายพรีเมียม 10%)
- ทางเลือก 2 (Option 2): ทำเรื่อง "ยืมพัสดุ (Internal Transfer)" จากคลัง กฟภ. เขตอื่นจำนวน ${exactShortageQty} เครื่อง (ไม่มีค่าของเพิ่ม มีแค่ค่าขนส่ง)
- Action Plan หลัก: แจ้งลดยอดเจ้าเก่าลง ${exactShortageQty} เครื่อง และดำเนินการตาม Option 1 หรือ 2`;
      } else {
        strategicActionPlan = `*สรุปขั้นตอน:* เสนอ Action Plan แบบ "อุดรอยรั่ว":
- ทางเลือก 1 (Option 1): สั่งซื้อด่วนพิเศษกับ Supplier A (เลือกชื่อจากข้อมูล) จำนวน ${exactShortageQty} เครื่อง
- ทางเลือก 2 (Option 2): สั่งซื้อด่วนพิเศษกับ Supplier B (เลือกชื่อจากข้อมูล) จำนวน ${exactShortageQty} เครื่อง
- Action Plan หลัก: ติดต่อเจรจาขอยกเลิกเจ้าเก่าลง ${exactShortageQty} เครื่อง เพื่อป้องกัน Overstock และเปิด PO ใหม่กับ Supplier ที่เลือก`;
      }

      const promptContent = `⚠️ AI ตรวจพบความเสี่ยงด้านการจัดส่งสำหรับแผน "${planName}" ของพัสดุ ${mat?.name || materialId}. Supplier อาจส่งมอบล่าช้า 15 วัน เนื่องจากขาดแคลนวัตถุดิบ (Force Majeure) 

[ข้อมูลพัสดุปัจจุบันสำหรับการคำนวณ]
- สต็อกปัจจุบัน: ${mat?.currentStock} ${mat?.unit}
- Safety Stock: ${mat?.safetyStock} ${mat?.unit}
- ความต้องการใช้เฉลี่ย (Demand): ${mat?.avgMonthlyDemand} ${mat?.unit}/เดือน (คิดเป็น ${dailyDemand} ${mat?.unit}/วัน)
- การประเมินผลกระทบจริง: สต็อกปัจจุบันที่มีอยู่ จะรองรับการใช้งานได้เพียง ${stockSurvivalDays} วัน
- ดังนั้น ในช่วงที่ของส่งล่าช้า 15 วัน เราจะเผชิญภาวะของขาดสต็อกจริง (Stockout) เป็นเวลา ${shortfallDays} วัน
- ปริมาณขั้นต่ำสุดที่ต้องหามาทดแทนเร่งด่วน: ${exactShortageQty} ${mat?.unit} (คำนวณจาก ${shortfallDays} วัน x ${dailyDemand} เครื่อง/วัน)
- ระยะเวลาส่งมอบปกติ (Lead Time): ${mat?.leadTimeWeeks} สัปดาห์ (${standardLeadTimeDays} วัน)
- การประเมิน Lead Time กรณีสั่งด่วน (Rush Order) จากเจ้าใหม่: ประมาณ ${rushLeadTimeDays} วัน (ประเมินที่ 20% ของเวลาปกติ)
- ราคาต่อหน่วย: ${mat?.unitPrice} บาท

[ข้อมูล Supplier ทางเลือก เพื่อหาผู้ทดแทน]
${vendorListText}

คำสั่งพิเศษ: กรุณาวิเคราะห์และจัดทำแผนรับมือการจัดส่งล่าช้าระหว่างขนส่ง โดยให้วิเคราะห์ทั้งหมดแบบ Multi-Agent เสนอทางออกที่ดีที่สุด 2 ทางเพื่อให้เตรียมแผนรับมือทัน พร้อมเอาข้อมูลที่ควรรู้มาด้วย 
*ข้อบังคับการวิเคราะห์เชิงลึก (Deep Analysis Required):* 
1. **Impact Analysis (ผลกระทบ 15 วัน):** ให้ระบุความจริงว่าสต็อกจะอยู่ได้แค่ ${stockSurvivalDays} วัน และจะเกิดปัญหาของขาดจริง (Stockout) เป็นเวลา ${shortfallDays} วัน คิดเป็นจำนวน ${exactShortageQty} เครื่อง
2. **Speed Comparison (เปรียบเทียบความเร็ว):** ประเมินเทียบกันให้เห็นชัดเจนว่า การรอเจ้าเก่า (มาส่งใน 15 วัน) กับการสั่งด่วนเจ้าใหม่ (ใช้เวลา ${rushLeadTimeDays} วัน) ฝั่งไหนไวกว่ากัน (ในกรณีนี้ ${isOldSupplierFaster ? "รอเจ้าเก่าไวกว่า!" : "สั่งเจ้าใหม่ไวกว่า!"}) 
3. **Financial Impact (กำไร/ขาดทุน):** ประเมินต้นทุนส่วนต่างของการสั่ง ${exactShortageQty} เครื่องจากทางเลือกใหม่
4. **Root Cause & Long-term Fix:** ระบุสาเหตุที่วิกฤตนี้เกิดเพราะจุดสั่งซื้อเดิม (ROP) ไม่สะท้อน Lead Time ผลิตลอตแรก (${standardLeadTimeDays} วัน) และสั่งให้ AI แนะนำการแก้ปัญหาด้วย Dynamic ROP ที่แจ้งเตือนล่วงหน้าที่สต็อก 100 วัน
${strategicActionPlan}
- ห้ามตอบกว้างๆ ต้องใช้ตัวเลข ${exactShortageQty} เครื่องเป็นเป้าหมายหลักในการแก้ปัญหา

ส่งกลับมาเป็น JSON format ตามโครงสร้างนี้เท่านั้น ห้ามใช้ข้อความซ้ำกับตัวอย่าง ให้วิเคราะห์และสร้างข้อความขึ้นมาใหม่ทั้งหมด:
{"agents":{"demand":"<วิเคราะห์ Demand>","procurement":"<วิเคราะห์ Supplier>","warehouse":"<วิเคราะห์สต็อก>"},"impactAnalysis":"<สรุปผลกระทบ>","speedComparison":"<เปรียบเทียบเวลา>","financialImpact":"<วิเคราะห์ต้นทุน>","executiveSummary":"<สรุปภาพรวม>","option1":{"title":"ทางเลือกที่ 1: <ชื่อ>","reason":"<เหตุผลที่ AI แนะนำทางเลือกนี้>","desc":"<รายละเอียดวิธีการ จำนวน ราคา>","risk":"<ความเสี่ยงของทางเลือกนี้>","outcome":"<ผลลัพธ์ที่คาดหวัง>","steps":["<ขั้นตอน 1>","<ขั้นตอน 2>","<ขั้นตอน 3>"]},"option2":{"title":"ทางเลือกที่ 2: <ชื่อ>","reason":"<เหตุผลที่ AI เสนอทางเลือกสำรองนี้>","desc":"<รายละเอียดวิธีการ จำนวน ราคา>","risk":"<ความเสี่ยงของทางเลือกนี้>","outcome":"<ผลลัพธ์ที่คาดหวัง>","steps":["<ขั้นตอน 1>","<ขั้นตอน 2>","<ขั้นตอน 3>"]},"needToKnow":["<ข้อมูล 1>","<ข้อมูล 2>"],"updatedAction":"Action plan ใหม่"}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptContent }],
          jsonMode: true
        }),
      });
      const data = await res.json();
      let parsedPlan = null;
      try {
        const textContent = (data.content || "").replace(/```json/g, "").replace(/```/g, "").trim();
        parsedPlan = JSON.parse(textContent);
      } catch (e) {}
      
      setTrackingMitigations(prev => ({ ...prev, [materialId]: { isLoading: false, plan: data.content || "ไม่สามารถวิเคราะห์ได้", parsedPlan } }));
    } catch {
      setTrackingMitigations(prev => ({ ...prev, [materialId]: { isLoading: false, plan: "เกิดข้อผิดพลาดในการเชื่อมต่อ AI" } }));
    }
  }

  const getProcurementSteps = (materialId: string) => {
    const plan = approvedPlans.find(p => p.materialId === materialId);
    const isApproved = !!plan;

    return [
      { id: 1, title: "วิเคราะห์ & เลือกแผน", icon: Brain, status: isApproved ? "completed" as const : "pending" as const },
      { id: 2, title: "จัดทำ TOR", icon: FileSearch, status: isApproved ? "completed" as const : "pending" as const },
      { id: 3, title: "เปิด e-Bidding", icon: Gavel, status: isApproved ? "completed" as const : "pending" as const },
      { id: 4, title: "ประเมินผล", icon: Users, status: isApproved ? "completed" as const : "pending" as const },
      { id: 5, title: "ออก PO", icon: FileText, status: isApproved ? "active" as const : "pending" as const },
      { id: 6, title: "รับของ", icon: CheckCircle2, status: "pending" as const },
    ];
  };

  return (
    <div className="space-y-6 relative">
      {/* Success Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 animate-fade-in-up transition-all duration-300">
          <div className="bg-emerald-600 text-white px-5 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] border border-emerald-500/50 flex items-start gap-3">
            <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-100" size={20} />
            <div>
              <div className="font-bold text-[16.5px] leading-tight">{toastMessage.title}</div>
              <div className="text-[16.5px] text-emerald-100 mt-1">{toastMessage.desc}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="rounded-2xl md:rounded-[32px] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] border border-slate-700/50 p-4 md:p-8 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-3 py-1 md:px-3.5 md:py-1.5 text-[16.5px] md:text-[16.5px] font-bold uppercase tracking-[0.16em] text-emerald-100 shadow-inner">
            <Brain size={14} className="text-emerald-300" />
            Procurement Planning
          </div>
          <h1 className="mt-3 md:mt-4 text-[16.5px] md:text-[24px] font-black tracking-tight text-white drop-shadow-md">แผนการจัดซื้อ (Procurement Planning)</h1>
          <p className="mt-2 md:mt-3 text-[16.5px] md:text-[16.5px] leading-relaxed text-slate-300/90 font-medium">
            ติดตามแผนจัดซื้อสินค้าแต่ละตัว • AI เฝ้าระวังความเสี่ยงอัตโนมัติ • วิเคราะห์แผนรับมือทันทีเมื่อเกิดปัญหา
          </p>
        </div>
      </section>

      {/* Material List */}
      <section className="space-y-3">
        {materials.map(mat => {
          const allPlansForMat = approvedPlans.filter(p => p.materialId === mat.id || p.materialId === mat.sapCode);
          const alert = riskAlerts.find(a => a.materialId === mat.id || a.materialId === mat.sapCode || a.materialId === `MAT-${mat.sapCode}`);
          const plan = allPlansForMat.length > 0 ? allPlansForMat[allPlansForMat.length - 1] : undefined;
          const planHistory = allPlansForMat.length > 1 ? allPlansForMat.slice(0, -1).reverse() : [];
          const isExpanded = expandedMaterial === mat.id || expandedMaterial === mat.sapCode;
          const steps = getProcurementSteps(mat.id);
          const daysOfStock = Math.round(mat.currentStock / (mat.avgMonthlyDemand / 30));
          const stockPercent = Math.round((mat.currentStock / mat.safetyStock) * 100);
          const mitigation = riskMitigations[mat.id] || riskMitigations[mat.sapCode];

          return (
            <div key={mat.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
              {/* Material Row — always visible */}
              <button
                onClick={() => setExpandedMaterial(isExpanded ? null : mat.id)}
                className="w-full px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-5 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                {/* Top row on mobile: Icon + Name + SAP + Arrow */}
                <div className="flex items-center gap-3 w-full md:contents">
                  {/* Icon */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    mat.riskLevel === 'critical' ? 'bg-red-100 text-red-600' : 
                    mat.riskLevel === 'warning' ? 'bg-amber-100 text-amber-600' : 
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Package size={20} />
                  </div>

                  {/* Material Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[16.5px] md:text-[16.5px] font-bold text-slate-900 truncate">{mat.name}</h3>
                      <span className="text-[16.5px] md:text-[16.5px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">{mat.sapCode}</span>
                      {plan && (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[16.5px] md:text-[16.5px] font-bold shrink-0 flex items-center gap-1">
                          <CheckCircle2 size={12} /> มีแผนแล้ว
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile: Arrow + Risk Badge */}
                  <div className="flex items-center gap-2 md:hidden">
                    {alert && (
                      <div className={`shrink-0 px-2 py-1 rounded-lg text-[16.5px] font-bold flex items-center gap-1 ${
                        alert.severity === 'critical' ? 'bg-red-50 text-red-700 border border-red-100' : 
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        <AlertTriangle size={12} />
                        {alert.severity === 'critical' ? 'วิกฤต' : 'เตือน'}
                      </div>
                    )}
                    {isExpanded ? <ChevronDown size={16} className="text-slate-400 shrink-0" /> : <ChevronRight size={16} className="text-slate-400 shrink-0" />}
                  </div>
                </div>

                {/* Stats row — always visible */}
                <div className="flex items-center gap-2 md:gap-3 text-[16.5px] md:text-[16.5px] text-slate-500 flex-wrap pl-[52px] md:pl-0 -mt-1 md:mt-0">
                  <span>สต็อก: <strong className={stockPercent < 30 ? 'text-red-600' : 'text-slate-700'}>{mat.currentStock.toLocaleString()} {mat.unit}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>ใช้ได้อีก <strong className={daysOfStock < 30 ? 'text-red-600' : 'text-slate-700'}>{daysOfStock} วัน</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Safety Stock: <strong className={stockPercent < 30 ? 'text-red-600' : 'text-slate-700'}>{stockPercent}%</strong></span>
                </div>

                {/* Desktop-only elements */}
                {/* Risk Badge */}
                {alert && (
                  <div className={`hidden md:flex shrink-0 px-3 py-1.5 rounded-lg text-[16.5px] font-bold items-center gap-1 ${
                    alert.severity === 'critical' ? 'bg-red-50 text-red-700 border border-red-100' : 
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    <AlertTriangle size={14} />
                    {alert.severity === 'critical' ? 'วิกฤต' : 'เตือน'}
                  </div>
                )}

                {/* Procurement Progress Mini */}
                <div className="shrink-0 hidden md:flex items-center gap-1">
                  {steps.map(s => (
                    <div key={s.id} className={`w-2.5 h-2.5 rounded-full ${
                      s.status === 'completed' ? 'bg-emerald-500' : 
                      s.status === 'active' ? 'bg-blue-500 animate-pulse' : 
                      'bg-slate-200'
                    }`} title={s.title} />
                  ))}
                </div>

                {/* Expand Arrow - Desktop */}
                <div className="hidden md:block">
                  {isExpanded ? <ChevronDown size={18} className="text-slate-400 shrink-0" /> : <ChevronRight size={18} className="text-slate-400 shrink-0" />}
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-3 py-3 md:px-6 md:py-5 space-y-4 md:space-y-5">
                  {/* Risk Alert + AI Auto Monitoring */}
                  {alert && !plan && (
                    <div className={`rounded-xl p-4 border ${
                      alert.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <ShieldAlert className={alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} size={20} />
                        <div className="flex-1">
                          <div className="text-[16.5px] font-bold text-slate-800 mb-0.5">⚠️ AI เฝ้าระวัง: {alert.message}</div>
                          <div className="text-[16.5px] text-slate-600 mb-3">{alert.detail}</div>

                          {/* AI Auto Risk Mitigation */}
                          {!mitigation ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAIRiskAnalysis(mat.id, alert.message); }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-[16.5px] font-bold text-white cursor-pointer hover:bg-purple-700 transition shadow-sm"
                            >
                              <Sparkles size={12} /> AI วิเคราะห์แผนรับมือทันที
                            </button>
                          ) : mitigation.isLoading ? (
                            <div className="flex items-center gap-2 text-[16.5px] text-purple-600 font-bold">
                              <Loader2 size={14} className="animate-spin" /> AI กำลังวิเคราะห์แผนรับมือ...
                            </div>
                          ) : (
                            <div className="mt-2 rounded-xl bg-white border border-purple-100 p-3">
                              <div className="flex items-center gap-1.5 mb-2 text-[16.5px] font-bold text-purple-700 uppercase tracking-wider">
                                <Brain size={12} /> AI แผนรับมือความเสี่ยง (Real-time)
                              </div>
                              <div className="text-[16.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{mitigation.plan}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                      {/* Approved Plan Summary & Tracking */}
                      {plan && (
                        <div className="space-y-4">
                          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-4">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-slate-600" />
                                <h4 className="text-[16.5px] font-bold text-slate-800">สรุปแผนดำเนินการ (Approved Plan Summary)</h4>
                              </div>
                            </div>
                            <div className="overflow-x-auto"><table className="w-full text-left text-[16.5px] border-collapse min-w-[700px]">
                              <tbody className="divide-y divide-slate-100">
                                {/* Original Plan Row */}
                                <tr className="hover:bg-slate-50/50">
                                  <td className="px-4 py-4 font-bold text-slate-700 w-[20%] align-top bg-slate-50/30 whitespace-nowrap">
                                    แผนหลักเดิม
                                  </td>
                                  <td className="px-4 py-4 text-slate-700 align-top border-l border-slate-200">
                                    <div className="font-bold mb-1 text-[16.5px]">{allPlansForMat.find((p: any) => !p.planName?.startsWith('[แผนใหม่]'))?.planName || `รอส่งมอบ ${mat.name}`}</div>
                                    <div className="text-slate-600 mb-2.5 leading-relaxed">{allPlansForMat.find((p: any) => !p.planName?.startsWith('[แผนใหม่]'))?.action || 'รอการส่งมอบตามกำหนดการเดิมจาก Supplier หลัก'}</div>
                                    <div className="flex flex-wrap gap-2 text-[16.5px]">
                                      <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700 border border-slate-200/60">📦 {(allPlansForMat.find((p: any) => !p.planName?.startsWith('[แผนใหม่]'))?.qty || plan?.qty || Math.round(mat.avgMonthlyDemand / 30) * mat.safetyStock || 0).toLocaleString()} หน่วย</span>
                                      <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700 border border-slate-200/60">💰 {allPlansForMat.find((p: any) => !p.planName?.startsWith('[แผนใหม่]'))?.financial || 'เป็นไปตามงบประมาณเดิม'}</span>
                                    </div>
                                  </td>
                                </tr>
                                
                                {/* Mitigation Plan Row (if exists) */}
                                {allPlansForMat.length > 0 && plan.planName?.startsWith('[แผนใหม่]') && (
                                  <tr className="hover:bg-emerald-50/30 bg-emerald-50/10">
                                    <td className="px-4 py-4 font-bold text-emerald-800 w-[20%] align-top bg-emerald-50/50 border-t border-emerald-100 whitespace-nowrap">
                                      <div className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-600"/> แผนรับมือฉุกเฉิน</div>
                                    </td>
                                    <td className="px-4 py-4 text-emerald-900 align-top border-l border-emerald-100 border-t">
                                      <div className="font-bold mb-1 text-[16.5px]">{plan.planName}</div>
                                      <div className="text-emerald-800 mb-2.5 leading-relaxed">{plan.action}</div>
                                      <div className="flex flex-wrap gap-2 text-[16.5px]">
                                        <span className="bg-emerald-100/80 px-2.5 py-1 rounded-md font-medium text-emerald-800 border border-emerald-200/60">📦 {plan.qty.toLocaleString()} หน่วย</span>
                                        <span className="bg-emerald-100/80 px-2.5 py-1 rounded-md font-medium text-emerald-800 border border-emerald-200/60">💰 {plan.financial}</span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table></div>
                          </div>
                      {!(allPlansForMat.length > 0 && plan?.planName?.startsWith('[แผนใหม่]')) && (
                        <div className="rounded-xl p-4 border bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                          <Clock className="text-blue-500" size={20} />
                          <div className="flex-1">
                            <div className="text-[16.5px] font-bold text-slate-800 mb-0.5">🚚 AI เฝ้าระวังการจัดส่ง (Tracking)</div>
                            <div className="text-[16.5px] text-slate-600 mb-3">พบความเสี่ยง: ผู้ผลิตหลักแจ้งเตือนปัญหา Supply Chain อาจทำให้ส่งมอบล่าช้า 15 วัน เสี่ยงกระทบสต็อกที่จะหมดในอีก {daysOfStock} วัน</div>

                            {!trackingMitigations[mat.id] ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAITrackingAnalysis(mat.id, plan.planName); }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[16.5px] font-bold text-white cursor-pointer hover:bg-blue-700 transition shadow-sm"
                              >
                                <Sparkles size={12} /> ให้ AI วิเคราะห์แผนสำรอง
                              </button>
                            ) : trackingMitigations[mat.id].isLoading ? (
                              <div className="flex items-center gap-2 text-[16.5px] text-blue-600 font-bold">
                                <Loader2 size={14} className="animate-spin" /> AI กำลังวิเคราะห์แผนสำรอง...
                              </div>
                            ) : (
                              <>
                                {!trackingMitigations[mat.id].selectedOptionId ? (
                                  <div className="mt-2 space-y-3">
                                    {trackingMitigations[mat.id].parsedPlan ? (
                                      <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm animate-fade-in">
                                        <div className="flex items-center gap-1.5 mb-4 text-[16.5px] font-bold text-blue-800 uppercase tracking-wider border-b border-blue-50 pb-2">
                                          <Brain size={20} className="text-blue-600" /> AI แผนรับมือการจัดส่งล่าช้า
                                        </div>
                                        
                                        {/* Multi-Agent & Deep Analysis Summary Table */}
                                        <div className="rounded-xl border border-slate-200 bg-white mb-4 overflow-hidden">
                                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                            <h4 className="text-[16.5px] font-bold text-slate-800 flex items-center gap-2"><Brain size={20} className="text-slate-600"/> สรุปข้อมูลวิเคราะห์เชิงลึก (Deep Analysis)</h4>
                                          </div>
                                          <div className="overflow-x-auto"><table className="w-full text-left text-[16.5px] min-w-[600px]">
                                            <tbody className="divide-y divide-slate-100">
                                              {trackingMitigations[mat.id].parsedPlan.agents && (
                                                <>
                                                  <tr className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-2.5 font-bold text-slate-700 w-1/4 align-top whitespace-nowrap">🎯 Demand Planner AI</td>
                                                    <td className="px-4 py-2.5 text-slate-600">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.agents.demand)}</td>
                                                  </tr>
                                                  <tr className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-2.5 font-bold text-slate-700 w-1/4 align-top whitespace-nowrap">💼 Procurement AI</td>
                                                    <td className="px-4 py-2.5 text-slate-600">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.agents.procurement)}</td>
                                                  </tr>
                                                  <tr className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-2.5 font-bold text-slate-700 w-1/4 align-top whitespace-nowrap">📦 Warehouse AI</td>
                                                    <td className="px-4 py-2.5 text-slate-600">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.agents.warehouse)}</td>
                                                  </tr>
                                                </>
                                              )}
                                              {trackingMitigations[mat.id].parsedPlan.impactAnalysis && (
                                                <tr className="hover:bg-slate-50/50 bg-red-50/30">
                                                  <td className="px-4 py-2.5 font-bold text-red-700 w-1/4 align-top whitespace-nowrap">⚠️ Impact Analysis</td>
                                                  <td className="px-4 py-2.5 text-red-800">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.impactAnalysis)}</td>
                                                </tr>
                                              )}
                                              {trackingMitigations[mat.id].parsedPlan.speedComparison && (
                                                <tr className="hover:bg-slate-50/50">
                                                  <td className="px-4 py-2.5 font-bold text-slate-700 w-1/4 align-top whitespace-nowrap">⏱️ Speed Comparison</td>
                                                  <td className="px-4 py-2.5 text-slate-600">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.speedComparison)}</td>
                                                </tr>
                                              )}
                                              {trackingMitigations[mat.id].parsedPlan.financialImpact && (
                                                <tr className="hover:bg-slate-50/50">
                                                  <td className="px-4 py-2.5 font-bold text-slate-700 w-1/4 align-top whitespace-nowrap">💰 Financial Impact</td>
                                                  <td className="px-4 py-2.5 text-slate-600">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.financialImpact)}</td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table></div>
                                        </div>

                                        {/* Executive Summary */}
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
                                          <div className="text-[16.5px] font-bold text-slate-700 mb-1">Executive Summary</div>
                                          <div className="text-[16.5px] text-slate-800 font-medium leading-relaxed">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.executiveSummary)}</div>
                                        </div>

                                        {/* Emergency Decision Matrix Table */}
                                        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm mb-4">
                                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                                            <Target size={20} className="text-slate-600" />
                                            <h4 className="text-[16.5px] font-bold text-slate-800">ตารางเปรียบเทียบแผนฉุกเฉิน (Emergency Decision Matrix)</h4>
                                          </div>
                                          <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse text-[16.5px] min-w-[800px]">
                                              <thead>
                                                <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-600">
                                                  <th className="px-4 py-3 font-bold w-1/4">หัวข้อการประเมิน</th>
                                                  <th className="px-4 py-3 font-bold w-[37.5%] border-l border-slate-200 bg-emerald-50/50">
                                                    <div className="flex items-center gap-2">
                                                      <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[16.5px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                                                        <Sparkles size={10} /> AI แนะนำ
                                                      </span>
                                                      <span className="text-emerald-900">{trackingMitigations[mat.id].parsedPlan.option1?.title || 'ทางเลือกที่ 1'}</span>
                                                    </div>
                                                  </th>
                                                  <th className="px-4 py-3 font-bold w-[37.5%] border-l border-slate-200">
                                                    {trackingMitigations[mat.id].parsedPlan.option2?.title || 'ทางเลือกที่ 2'}
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50/50">
                                                  <td className="px-4 py-3 font-bold text-slate-700 bg-slate-50/30 align-top">เหตุผลที่แนะนำ<br/><span className="text-[16.5px] font-normal text-slate-500">(AI Reasoning)</span></td>
                                                  <td className="px-4 py-3 text-emerald-800 bg-emerald-50/30 border-l border-slate-200 font-medium leading-relaxed">{trackingMitigations[mat.id].parsedPlan.option1?.reason || 'แก้ปัญหา Stockout ได้ทันท่วงทีและมีประสิทธิภาพสูงสุดตามเงื่อนไขเวลา'}</td>
                                                  <td className="px-4 py-3 text-slate-600 border-l border-slate-200 leading-relaxed">{trackingMitigations[mat.id].parsedPlan.option2?.reason || 'เป็นแผนสำรองฉุกเฉินกรณีที่ไม่สามารถทำตามแผนหลักได้'}</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50/50">
                                                  <td className="px-4 py-3 font-bold text-slate-700 bg-slate-50/30 align-top">รายละเอียด</td>
                                                  <td className="px-4 py-3 text-slate-600 border-l border-slate-200">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.option1?.desc)}</td>
                                                  <td className="px-4 py-3 text-slate-600 border-l border-slate-200">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.option2?.desc)}</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50/50">
                                                  <td className="px-4 py-3 font-bold text-slate-700 bg-slate-50/30 align-top">ผลลัพธ์ที่คาดหวัง</td>
                                                  <td className="px-4 py-3 text-emerald-700 border-l border-slate-200 font-medium">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.option1?.outcome)}</td>
                                                  <td className="px-4 py-3 text-blue-700 border-l border-slate-200 font-medium">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.option2?.outcome)}</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50/50">
                                                  <td className="px-4 py-3 font-bold text-slate-700 bg-slate-50/30 align-top">ความเสี่ยง</td>
                                                  <td className="px-4 py-3 text-red-600 border-l border-slate-200">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.option1?.risk)}</td>
                                                  <td className="px-4 py-3 text-red-600 border-l border-slate-200">{highlightNumbers(trackingMitigations[mat.id].parsedPlan.option2?.risk)}</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50/50">
                                                  <td className="px-4 py-3 font-bold text-slate-700 bg-slate-50/30 align-top">ขั้นตอนดำเนินการ</td>
                                                  <td className="px-4 py-3 text-slate-600 border-l border-slate-200 align-top">
                                                    <ul className="list-decimal pl-4 space-y-1">
                                                      {(trackingMitigations[mat.id].parsedPlan.option1?.steps || []).map((s: string, i: number) => <li key={i}>{highlightNumbers(s)}</li>)}
                                                    </ul>
                                                  </td>
                                                  <td className="px-4 py-3 text-slate-600 border-l border-slate-200 align-top">
                                                    <ul className="list-decimal pl-4 space-y-1">
                                                      {(trackingMitigations[mat.id].parsedPlan.option2?.steps || []).map((s: string, i: number) => <li key={i}>{highlightNumbers(s)}</li>)}
                                                    </ul>
                                                  </td>
                                                </tr>
                                                <tr className="bg-slate-50/30">
                                                  <td className="px-4 py-4"></td>
                                                  <td className="px-4 py-4 border-l border-slate-200">
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        const selectedOption = trackingMitigations[mat.id].parsedPlan.option1;
                                                        setTrackingMitigations(prev => ({
                                                          ...prev,
                                                          [mat.id]: { ...prev[mat.id], selectedOptionId: 1 }
                                                        }));
                                                        window.dispatchEvent(new CustomEvent("approve-plan", {
                                                          detail: {
                                                            ...plan,
                                                            action: `[ทางเลือกที่ 1] ${selectedOption?.title || ''}: ${selectedOption?.desc || ''}`,
                                                            mitigation: `ความเสี่ยง: ${selectedOption?.risk || '-'} | ผลลัพธ์: ${selectedOption?.outcome || '-'}`,
                                                            supplyForecast: `[อัพเดทล่าช้า 15 วัน] ${plan?.supplyForecast || ''}`,
                                                            planName: `[แผนใหม่] ทางเลือกที่ 1: ${selectedOption?.title || 'อัปเดตแผนรับมือ'}`
                                                          }
                                                        }));
                                                        showToast('อัปเดตแผนรับมือสำเร็จ', `เลือกทางเลือกที่ 1: ${selectedOption?.title} เรียบร้อยแล้ว ระบบได้จัดเก็บข้อมูลลงประวัติ`);
                                                      }}
                                                      className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[16.5px] font-bold text-white cursor-pointer transition shadow-sm ${
                                                        trackingMitigations[mat.id].selectedOptionId === 1 
                                                          ? 'bg-emerald-600 ring-2 ring-emerald-500 ring-offset-2' 
                                                          : 'bg-emerald-600 hover:bg-emerald-700'
                                                      }`}
                                                    >
                                                      <CheckCircle2 size={16} /> 
                                                      {trackingMitigations[mat.id].selectedOptionId === 1 ? '✅ อนุมัติแผนนี้แล้ว' : 'เลือกแผนนี้ (AI แนะนำ)'}
                                                    </button>
                                                  </td>
                                                  <td className="px-4 py-4 border-l border-slate-200">
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        const selectedOption = trackingMitigations[mat.id].parsedPlan.option2;
                                                        setTrackingMitigations(prev => ({
                                                          ...prev,
                                                          [mat.id]: { ...prev[mat.id], selectedOptionId: 2 }
                                                        }));
                                                        window.dispatchEvent(new CustomEvent("approve-plan", {
                                                          detail: {
                                                            ...plan,
                                                            action: `[ทางเลือกที่ 2] ${selectedOption?.title || ''}: ${selectedOption?.desc || ''}`,
                                                            mitigation: `ความเสี่ยง: ${selectedOption?.risk || '-'} | ผลลัพธ์: ${selectedOption?.outcome || '-'}`,
                                                            supplyForecast: `[อัพเดทล่าช้า 15 วัน] ${plan?.supplyForecast || ''}`,
                                                            planName: `[แผนใหม่] ทางเลือกที่ 2: ${selectedOption?.title || 'อัปเดตแผนรับมือ'}`
                                                          }
                                                        }));
                                                        showToast('อัปเดตแผนรับมือสำเร็จ', `เลือกทางเลือกที่ 2: ${selectedOption?.title} เรียบร้อยแล้ว ระบบได้จัดเก็บข้อมูลลงประวัติ`);
                                                      }}
                                                      className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[16.5px] font-bold cursor-pointer transition shadow-sm ${
                                                        trackingMitigations[mat.id].selectedOptionId === 2 
                                                          ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2' 
                                                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                                      }`}
                                                    >
                                                      <CheckCircle2 size={16} className={trackingMitigations[mat.id].selectedOptionId === 2 ? 'text-white' : 'text-slate-400'} /> 
                                                      {trackingMitigations[mat.id].selectedOptionId === 2 ? '✅ อนุมัติแผนนี้แล้ว' : 'เลือกแผนนี้ (ทางเลือกสำรอง)'}
                                                    </button>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>

                                        {/* Need to Know */}
                                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 mb-4">
                                          <div className="text-[16.5px] font-bold text-amber-800 mb-2 flex items-center gap-1"><AlertTriangle size={12} /> ข้อมูลสำคัญที่ควรรู้ (Need to Know)</div>
                                          <ul className="list-disc pl-4 text-[16.5px] text-slate-700 leading-relaxed space-y-1">
                                            {(trackingMitigations[mat.id].parsedPlan.needToKnow || []).map((item: string, i: number) => (
                                              <li key={i}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>

                                      </div>
                                    ) : (
                                      <div className="rounded-xl bg-white border border-blue-100 p-3">
                                        <div className="flex items-center gap-1.5 mb-2 text-[16.5px] font-bold text-blue-700 uppercase tracking-wider">
                                          <Brain size={12} /> AI แผนรับมือการจัดส่งล่าช้า
                                        </div>
                                        <div className="text-[16.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{trackingMitigations[mat.id].plan}</div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="mt-3 rounded-xl p-4 border border-emerald-200 border-dashed bg-emerald-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
                                    <div className="flex items-start gap-2 max-w-[80%]">
                                      <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                                      <div className="flex flex-col">
                                        <span className="text-[16.5px] font-bold text-emerald-800">
                                          {trackingMitigations[mat.id].selectedOptionId === 1 
                                            ? trackingMitigations[mat.id].parsedPlan.option1?.title 
                                            : trackingMitigations[mat.id].parsedPlan.option2?.title}
                                        </span>
                                        <span className="text-[16.5px] text-emerald-700 mt-0.5">
                                          {trackingMitigations[mat.id].selectedOptionId === 1 
                                            ? trackingMitigations[mat.id].parsedPlan.option1?.desc 
                                            : trackingMitigations[mat.id].parsedPlan.option2?.desc}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTrackingMitigations(prev => ({
                                          ...prev,
                                          [mat.id]: { ...prev[mat.id], selectedOptionId: undefined }
                                        }));
                                      }}
                                      className="text-[16.5px] text-emerald-700 underline hover:text-emerald-900 font-bold"
                                    >
                                      แก้ไขหรือดูทางเลือกอื่นอีกครั้ง
                                    </button>
                                  </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                  {/* Procurement Steps Timeline */}
                  <div className="flex items-center gap-2">
                    {steps.map((step, idx) => (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[16.5px] font-bold transition ${
                          step.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                          step.status === 'active' ? 'bg-blue-100 text-blue-700 border border-blue-200 ring-2 ring-blue-200' : 
                          'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          <step.icon size={13} />
                          <span className="hidden xl:inline">{step.title}</span>
                          <span className="xl:hidden">{step.id}</span>
                        </div>
                        {idx < steps.length - 1 && <ArrowRight size={12} className="text-slate-300 shrink-0" />}
                      </div>
                    ))}
                  </div>

                  {/* No Plan Yet — CTA */}
                  {!plan && (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center">
                      <p className="text-[16.5px] text-slate-400 font-medium">ยังไม่มีแผนจัดซื้อ — ไปที่หน้า <strong>Risk Management</strong> แล้วกด &ldquo;ให้ AI วิเคราะห์&rdquo; เพื่อเลือกแผน</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
