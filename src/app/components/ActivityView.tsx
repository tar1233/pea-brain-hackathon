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
}

export default function ActivityView({ approvedPlans = [] }: { approvedPlans?: ApprovedPlan[] }) {
  const { materials, riskAlerts } = useData();
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);
  const [riskMitigations, setRiskMitigations] = useState<Record<string, RiskMitigation>>({});
  const [trackingMitigations, setTrackingMitigations] = useState<Record<string, RiskMitigation>>({});

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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `⚠️ AI ตรวจพบความเสี่ยงด้านการจัดส่งสำหรับแผน "${planName}" ของพัสดุ ${mat?.name || materialId}. Supplier อาจส่งมอบล่าช้า 15 วัน เนื่องจากขาดแคลนวัตถุดิบ (Force Majeure) สต็อกปัจจุบัน: ${mat?.currentStock} ${mat?.unit}. กรุณาวิเคราะห์และจัดทำแผนรับมือการจัดส่งล่าช้า โดยส่งกลับมาเป็น JSON format ตามโครงสร้างนี้เท่านั้น (ห้ามมี markdown code block): {"demandAI": "คำแนะนำสั้นๆ", "procurementAI": "คำแนะนำสั้นๆ", "warehouseAI": "คำแนะนำสั้นๆ", "executiveSummary": "สรุปสั้นๆ", "updatedAction": "Action plan ใหม่ที่อัพเดทแล้ว"}` }],
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
      { id: 2, title: "จัดทำ TOR", icon: FileSearch, status: isApproved ? "active" as const : "pending" as const },
      { id: 3, title: "เปิด e-Bidding", icon: Gavel, status: "pending" as const },
      { id: 4, title: "ประเมินผล", icon: Users, status: "pending" as const },
      { id: 5, title: "ออก PO", icon: FileText, status: "pending" as const },
      { id: 6, title: "รับของ", icon: CheckCircle2, status: "pending" as const },
    ];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <section className="rounded-[32px] bg-white border border-slate-200 p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 shadow-sm">
            <Brain size={14} />
            Procurement Planning
          </div>
          <h1 className="mt-4 text-[24px] font-bold tracking-tight text-slate-900">แผนการจัดซื้อ (Procurement Planning)</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500 font-medium">
            ติดตามแผนจัดซื้อสินค้าแต่ละตัว • AI เฝ้าระวังความเสี่ยงอัตโนมัติ • วิเคราะห์แผนรับมือทันทีเมื่อเกิดปัญหา
          </p>
        </div>
      </section>

      {/* Material List */}
      <section className="space-y-3">
        {materials.map(mat => {
          const alert = riskAlerts.find(a => a.materialId === mat.id || a.materialId === mat.sapCode || a.materialId === `MAT-${mat.sapCode}`);
          const plan = approvedPlans.find(p => p.materialId === mat.id || p.materialId === mat.sapCode);
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
                className="w-full px-6 py-4 flex items-center gap-5 text-left cursor-pointer hover:bg-slate-50 transition"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  mat.riskLevel === 'critical' ? 'bg-red-100 text-red-600' : 
                  mat.riskLevel === 'warning' ? 'bg-amber-100 text-amber-600' : 
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  <Package size={22} />
                </div>

                {/* Material Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-slate-900 truncate">{mat.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">{mat.sapCode}</span>
                    {plan && (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1">
                        <CheckCircle2 size={10} /> มีแผนแล้ว
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span>สต็อก: <strong className={stockPercent < 30 ? 'text-red-600' : 'text-slate-700'}>{mat.currentStock.toLocaleString()} {mat.unit}</strong></span>
                    <span>•</span>
                    <span>ใช้ได้อีก <strong className={daysOfStock < 30 ? 'text-red-600' : 'text-slate-700'}>{daysOfStock} วัน</strong></span>
                    <span>•</span>
                    <span>Safety Stock: <strong className={stockPercent < 30 ? 'text-red-600' : 'text-slate-700'}>{stockPercent}%</strong></span>
                  </div>
                </div>

                {/* Risk Badge */}
                {alert && (
                  <div className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                    alert.severity === 'critical' ? 'bg-red-50 text-red-700 border border-red-100' : 
                    'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    <AlertTriangle size={11} />
                    {alert.severity === 'critical' ? 'วิกฤต' : 'เตือน'}
                  </div>
                )}

                {/* Procurement Progress Mini */}
                <div className="shrink-0 flex items-center gap-1">
                  {steps.map(s => (
                    <div key={s.id} className={`w-2.5 h-2.5 rounded-full ${
                      s.status === 'completed' ? 'bg-emerald-500' : 
                      s.status === 'active' ? 'bg-blue-500 animate-pulse' : 
                      'bg-slate-200'
                    }`} title={s.title} />
                  ))}
                </div>

                {/* Expand Arrow */}
                {isExpanded ? <ChevronDown size={18} className="text-slate-400 shrink-0" /> : <ChevronRight size={18} className="text-slate-400 shrink-0" />}
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 space-y-5">
                  {/* Risk Alert + AI Auto Monitoring */}
                  {alert && !plan && (
                    <div className={`rounded-xl p-4 border ${
                      alert.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <ShieldAlert className={alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} size={20} />
                        <div className="flex-1">
                          <div className="text-[12px] font-bold text-slate-800 mb-0.5">⚠️ AI เฝ้าระวัง: {alert.message}</div>
                          <div className="text-[11px] text-slate-600 mb-3">{alert.detail}</div>

                          {/* AI Auto Risk Mitigation */}
                          {!mitigation ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAIRiskAnalysis(mat.id, alert.message); }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer hover:bg-purple-700 transition shadow-sm"
                            >
                              <Sparkles size={12} /> AI วิเคราะห์แผนรับมือทันที
                            </button>
                          ) : mitigation.isLoading ? (
                            <div className="flex items-center gap-2 text-[11px] text-purple-600 font-bold">
                              <Loader2 size={14} className="animate-spin" /> AI กำลังวิเคราะห์แผนรับมือ...
                            </div>
                          ) : (
                            <div className="mt-2 rounded-xl bg-white border border-purple-100 p-3">
                              <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                                <Brain size={12} /> AI แผนรับมือความเสี่ยง (Real-time)
                              </div>
                              <div className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap">{mitigation.plan}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approved Plan Summary & Tracking */}
                  {plan && (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="text-emerald-600" size={16} />
                          <span className="text-[12px] font-bold text-emerald-800">{plan.planName}</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 leading-relaxed mb-2">{plan.action}</p>
                        <div className="flex gap-3 text-[10px]">
                          <span className="bg-white/80 px-2 py-1 rounded-md font-bold text-slate-600">📦 {plan.qty.toLocaleString()} หน่วย</span>
                          <span className="bg-white/80 px-2 py-1 rounded-md font-bold text-slate-600">💰 {plan.financial}</span>
                        </div>
                      </div>

                      {/* Post-Plan AI Tracking */}
                      <div className="rounded-xl p-4 border bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                          <Clock className="text-blue-500" size={20} />
                          <div className="flex-1">
                            <div className="text-[12px] font-bold text-slate-800 mb-0.5">🚚 AI เฝ้าระวังการจัดส่ง (Tracking)</div>
                            <div className="text-[11px] text-slate-600 mb-3">พบความเสี่ยง: ผู้ผลิตหลักแจ้งเตือนปัญหา Supply Chain อาจทำให้ส่งมอบล่าช้า 15 วัน เสี่ยงกระทบสต็อกที่จะหมดในอีก {daysOfStock} วัน</div>

                            {!trackingMitigations[mat.id] ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAITrackingAnalysis(mat.id, plan.planName); }}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white cursor-pointer hover:bg-blue-700 transition shadow-sm"
                              >
                                <Sparkles size={12} /> ให้ AI วิเคราะห์แผนสำรอง
                              </button>
                            ) : trackingMitigations[mat.id].isLoading ? (
                              <div className="flex items-center gap-2 text-[11px] text-blue-600 font-bold">
                                <Loader2 size={14} className="animate-spin" /> AI กำลังวิเคราะห์แผนสำรอง...
                              </div>
                            ) : (
                              <div className="mt-2 space-y-3">
                                {trackingMitigations[mat.id].parsedPlan ? (
                                  <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm animate-fade-in">
                                    <div className="flex items-center gap-1.5 mb-4 text-[11px] font-bold text-blue-800 uppercase tracking-wider border-b border-blue-50 pb-2">
                                      <Brain size={14} className="text-blue-600" /> AI แผนรับมือการจัดส่งล่าช้า
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                                        <div className="text-[10px] font-bold text-purple-700 mb-1 flex items-center gap-1"><Target size={11} /> Demand Planner AI</div>
                                        <div className="text-[11px] text-slate-700 leading-relaxed">{trackingMitigations[mat.id].parsedPlan.demandAI}</div>
                                      </div>
                                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                        <div className="text-[10px] font-bold text-blue-700 mb-1 flex items-center gap-1"><FileText size={11} /> Procurement AI</div>
                                        <div className="text-[11px] text-slate-700 leading-relaxed">{trackingMitigations[mat.id].parsedPlan.procurementAI}</div>
                                      </div>
                                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                                        <div className="text-[10px] font-bold text-amber-700 mb-1 flex items-center gap-1"><Package size={11} /> Warehouse AI</div>
                                        <div className="text-[11px] text-slate-700 leading-relaxed">{trackingMitigations[mat.id].parsedPlan.warehouseAI}</div>
                                      </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
                                      <div className="text-[10px] font-bold text-slate-700 mb-1">Executive Summary</div>
                                      <div className="text-[12px] text-slate-800 font-medium leading-relaxed">{trackingMitigations[mat.id].parsedPlan.executiveSummary}</div>
                                    </div>
                                    <div className="flex justify-end">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.dispatchEvent(new CustomEvent("approve-plan", {
                                            detail: {
                                              ...plan,
                                              action: trackingMitigations[mat.id].parsedPlan.updatedAction || plan.action,
                                              mitigation: trackingMitigations[mat.id].parsedPlan.executiveSummary || plan.mitigation,
                                              supplyForecast: `[อัพเดทล่าช้า 15 วัน] ${plan.supplyForecast || ''}`,
                                              planName: plan.planName.includes("(Updated)") ? plan.planName : `${plan.planName} (Updated)`
                                            }
                                          }));
                                          // Add visual feedback
                                          const btn = e.currentTarget;
                                          const origHtml = btn.innerHTML;
                                          btn.innerHTML = "✅ อัพเดทแผนเรียบร้อย";
                                          btn.classList.add("bg-emerald-600", "hover:bg-emerald-700");
                                          btn.classList.remove("bg-slate-800", "hover:bg-slate-900");
                                          setTimeout(() => {
                                            btn.innerHTML = origHtml;
                                            btn.classList.remove("bg-emerald-600", "hover:bg-emerald-700");
                                            btn.classList.add("bg-slate-800", "hover:bg-slate-900");
                                          }, 2000);
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-[11px] font-bold text-white cursor-pointer hover:bg-slate-900 transition shadow-sm"
                                      >
                                        <Sparkles size={12} className="text-blue-300" /> ปรับปรุงแผนรับมือ
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="rounded-xl bg-white border border-blue-100 p-3">
                                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                                      <Brain size={12} /> AI แผนรับมือการจัดส่งล่าช้า
                                    </div>
                                    <div className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap">{trackingMitigations[mat.id].plan}</div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Procurement Steps Timeline */}
                  <div className="flex items-center gap-2">
                    {steps.map((step, idx) => (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition ${
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
                      <p className="text-[12px] text-slate-400 font-medium">ยังไม่มีแผนจัดซื้อ — ไปที่หน้า <strong>Risk Management</strong> แล้วกด &ldquo;ให้ AI วิเคราะห์&rdquo; เพื่อเลือกแผน</p>
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
