"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, FileSearch, Gavel, Users, FileText, AlertTriangle, Brain, ArrowRight, ShieldAlert } from "lucide-react";

interface ApprovedPlan {
  materialId: string;
  materialName: string;
  planName: string;
  action: string;
  qty: number;
  risk: string;
  financial: string;
  unitPrice: number;
}

export default function ActivityView() {
  const [approvedPlan, setApprovedPlan] = useState<ApprovedPlan | null>(null);

  useEffect(() => {
    const handleApprove = (e: Event) => {
      const ev = e as CustomEvent<ApprovedPlan>;
      setApprovedPlan(ev.detail);
    };
    window.addEventListener("approve-plan", handleApprove);
    return () => window.removeEventListener("approve-plan", handleApprove);
  }, []);

  // Procurement planning steps
  const planningSteps = [
    {
      id: 1,
      title: "วิเคราะห์ความเสี่ยง & เลือกแผน",
      subtitle: "Risk Analysis & Plan Selection",
      icon: Brain,
      color: "bg-purple-500",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      status: approvedPlan ? "completed" as const : "active" as const,
      detail: approvedPlan 
        ? `เลือกแล้ว: ${approvedPlan.planName} • จำนวน ${approvedPlan.qty.toLocaleString()} หน่วย`
        : "รอเลือกแผนจากหน้า Risk Management",
      risk: null,
    },
    {
      id: 2,
      title: "จัดทำ TOR / ร่างขอบเขตงาน",
      subtitle: "Terms of Reference Preparation",
      icon: FileSearch,
      color: "bg-blue-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      status: approvedPlan ? "active" as const : "pending" as const,
      detail: approvedPlan 
        ? `กำหนดคุณลักษณะ ${approvedPlan.materialName} จำนวน ${approvedPlan.qty.toLocaleString()} หน่วย • ราคากลาง ฿${(approvedPlan.qty * approvedPlan.unitPrice).toLocaleString()} • AI แนะนำ: ${approvedPlan.action.substring(0, 120)}...`
        : "รอข้อมูลจากแผนที่เลือก",
      risk: approvedPlan ? "ต้องตรวจสอบ Spec ให้ครบถ้วนก่อนเปิดประมูล เพื่อป้องกันการอุทธรณ์" : null,
    },
    {
      id: 3,
      title: "เปิดประกวดราคา e-Bidding",
      subtitle: "e-Bidding Announcement",
      icon: Gavel,
      color: "bg-amber-500",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50",
      status: "pending" as const,
      detail: approvedPlan 
        ? `ประกาศเชิญชวนผู้ค้าผ่านระบบ e-GP • ระยะเวลาเปิดรับข้อเสนอ 15 วันทำการ • วงเงินประกวดราคา ≈ ฿${(approvedPlan.qty * approvedPlan.unitPrice).toLocaleString()}`
        : "รอจัดทำ TOR ให้เสร็จก่อน",
      risk: approvedPlan ? `⚠️ ความเสี่ยงจากแผนที่เลือก: ${approvedPlan.risk}` : null,
    },
    {
      id: 4,
      title: "ประเมินข้อเสนอ & คัดเลือกผู้ขาย",
      subtitle: "Bid Evaluation & Vendor Selection",
      icon: Users,
      color: "bg-indigo-500",
      borderColor: "border-indigo-200",
      bgColor: "bg-indigo-50",
      status: "pending" as const,
      detail: "คณะกรรมการพิจารณาผล • เปรียบเทียบราคาและคุณสมบัติ • ตรวจสอบคุณสมบัติผู้ค้า (Vendor Qualification)",
      risk: "AI จะช่วยเปรียบเทียบราคาเสนอกับราคาตลาด (LME) เพื่อให้มั่นใจว่าได้ราคาที่เหมาะสม",
    },
    {
      id: 5,
      title: "อนุมัติผล & ออกใบสั่งซื้อ (PO)",
      subtitle: "Approval & Purchase Order",
      icon: FileText,
      color: "bg-emerald-500",
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-50",
      status: "pending" as const,
      detail: "ผู้มีอำนาจลงนามอนุมัติ • ระบบออก PO อัตโนมัติ • ส่งข้อมูลเข้า SAP ERP",
      risk: null,
    },
    {
      id: 6,
      title: "ติดตามการส่งมอบ & รับของเข้าคลัง",
      subtitle: "Delivery Tracking & Receiving",
      icon: CheckCircle2,
      color: "bg-teal-500",
      borderColor: "border-teal-200",
      bgColor: "bg-teal-50",
      status: "pending" as const,
      detail: approvedPlan 
        ? `AI จะเฝ้าระวัง Lead Time และแจ้งเตือนหากมีความเสี่ยงส่งมอบล่าช้า`
        : "ติดตามสถานะการจัดส่งจาก Supplier จนถึงรับเข้าคลัง WMS",
      risk: null,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <section className="rounded-[32px] bg-white border border-slate-200 p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 shadow-sm">
            <Brain size={14} />
            Procurement Planning
          </div>
          <h1 className="mt-4 text-[24px] font-bold tracking-tight text-slate-900">แผนการจัดซื้อ (Procurement Planning)</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500 font-medium">
            ติดตามขั้นตอนการจัดซื้อตั้งแต่วิเคราะห์ความเสี่ยง → จัดทำ TOR → เปิดประกวดราคา → คัดเลือกผู้ค้า → ออก PO → รับของ ทุกขั้นตอนมี AI คอยช่วยเฝ้าระวังความเสี่ยง
          </p>
        </div>
      </section>

      {/* Approved Plan Summary */}
      {approvedPlan && (
        <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-emerald-900">{approvedPlan.planName}</h3>
              <p className="text-[12px] text-emerald-700 mt-1 leading-relaxed">{approvedPlan.action}</p>
              <div className="flex gap-4 mt-3 text-[11px]">
                <span className="bg-white/80 px-2.5 py-1 rounded-lg font-bold text-slate-700">📦 {approvedPlan.materialName}</span>
                <span className="bg-white/80 px-2.5 py-1 rounded-lg font-bold text-slate-700">🔢 {approvedPlan.qty.toLocaleString()} หน่วย</span>
                <span className="bg-white/80 px-2.5 py-1 rounded-lg font-bold text-slate-700">💰 {approvedPlan.financial}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Planning Timeline */}
      <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-slate-200" />

          <div className="space-y-1">
            {planningSteps.map((step, idx) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";
              const isPending = step.status === "pending";

              return (
                <div key={step.id} className="relative">
                  <div className={`flex gap-5 p-4 rounded-2xl transition-all ${
                    isActive ? `${step.bgColor} border ${step.borderColor} shadow-sm` : 
                    isCompleted ? 'bg-emerald-50/50' : 
                    'hover:bg-slate-50'
                  }`}>
                    {/* Step Circle */}
                    <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                      isCompleted ? 'bg-emerald-500 text-white' : 
                      isActive ? `${step.color} text-white ring-4 ring-white` : 
                      'bg-white text-slate-400 border border-slate-200'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={22} /> : <step.icon size={22} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-[14px] font-bold ${isCompleted ? 'text-emerald-700' : isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                          ขั้นตอน {step.id}: {step.title}
                        </h3>
                        {isCompleted && (
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">✓ เสร็จแล้ว</span>
                        )}
                        {isActive && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">◉ กำลังดำเนินการ</span>
                        )}
                        {isPending && (
                          <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">รอดำเนินการ</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mb-2">{step.subtitle}</p>
                      <p className={`text-[12px] leading-relaxed ${isCompleted || isActive ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                        {step.detail}
                      </p>

                      {/* Risk Warning */}
                      {step.risk && (isCompleted || isActive) && (
                        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                          <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={14} />
                          <div className="text-[11px] text-amber-700 font-medium leading-relaxed">{step.risk}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrow between steps */}
                  {idx < planningSteps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowRight size={14} className="text-slate-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
