"use client";

import { Brain, CheckCircle2, Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import { useData } from "../context/DataContext";

export default function ActivityView() {
  const { aiRecommendations, riskAlerts, timelineEvents } = useData();
  return (
    <div className="space-y-5">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-md">
            <Brain size={14} />
            Audit Trail
          </div>
          <h1 className="mt-4 text-[24px] font-bold tracking-tight text-white">Activity Log และความเคลื่อนไหวของระบบ</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-300 font-medium">
            รวมลำดับเหตุการณ์ที่ AI วิเคราะห์ แจ้งเตือน และเสนอคำแนะนำ เพื่อใช้เป็นหลักฐานการตัดสินใจและอธิบาย flow ให้กรรมการเห็นแบบ end-to-end
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Clock3, label: "เหตุการณ์ล่าสุด", value: `${timelineEvents.length} logs`, tone: "text-white", labelTone: "text-blue-100/90", bg: "bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] border-blue-500/20 shadow-[0_15px_35px_rgba(59,130,246,0.1)]", iconBg: "bg-white/10 border border-white/10", iconColor: "text-white" },
          { icon: ShieldCheck, label: "Alerts in Scope", value: `${riskAlerts.length} รายการ`, tone: "text-white", labelTone: "text-red-100/90", bg: "bg-gradient-to-br from-[#4e091b] via-[#750e26] to-[#b91c1c] border-rose-500/20 shadow-[0_15px_35px_rgba(185,28,28,0.1)]", iconBg: "bg-white/10 border border-white/10", iconColor: "text-white" },
          { icon: CheckCircle2, label: "AI Recommendations", value: `${aiRecommendations.length} actions`, tone: "text-white", labelTone: "text-emerald-100/90", bg: "bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#059669] border-emerald-500/20 shadow-[0_15px_35px_rgba(16,185,129,0.1)]", iconBg: "bg-white/10 border border-white/10", iconColor: "text-white" },
          { icon: MessageSquareText, label: "Review Readiness", value: "พร้อมเดโม", tone: "text-white", labelTone: "text-purple-100/90", bg: "bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] border-[#8b5cf6]/20 shadow-[0_15px_35px_rgba(139,92,246,0.1)]", iconBg: "bg-white/10 border border-white/10", iconColor: "text-white" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className={`rounded-[20px] border p-4.5 backdrop-blur-sm ${card.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                  <Icon size={18} className={card.iconColor} />
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-[0.14em] ${card.labelTone}`}>{card.label}</div>
              </div>
              <div className={`mt-3 text-[18px] font-bold tracking-tight ${card.tone}`}>{card.value}</div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[14px] font-bold text-slate-900">System Timeline</h2>
          <div className="mt-5 space-y-4">
            {timelineEvents.map((event, index) => (
              <div key={`${event.time}-${event.text}`} className="flex gap-4">
                <div className="flex w-8 flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary-500" />
                  {index < timelineEvents.length - 1 && <div className="mt-1 h-full w-px bg-slate-200" />}
                </div>
                <div className="flex-1 rounded-[20px] bg-slate-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{event.time}</div>
                  <div className="mt-2 text-[12px] leading-relaxed text-slate-700 font-medium">{event.text}</div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-[14px] font-bold text-slate-900">Recommendation Log</h2>
          <div className="mt-5 space-y-3">
            {aiRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-bold text-slate-900">{recommendation.title}</div>
                    <div className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white shrink-0 shadow-sm">
                      ลดเสี่ยง {recommendation.reduction}
                    </div>
                  </div>
                  <div className="mt-2 whitespace-pre-line text-[12px] leading-relaxed text-slate-600 font-medium">
                    {recommendation.description}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (recommendation.id === "rec-1") {
                        window.dispatchEvent(new CustomEvent("create-po", { 
                          detail: { 
                            materialId: "MAT-10067", 
                            qty: 878, 
                            name: "หม้อแปลง 160 kVA (3 เฟส)",
                            price: 192800 
                          } 
                        }));
                      } else if (recommendation.id === "rec-2") {
                        window.dispatchEvent(new CustomEvent("create-po", { 
                          detail: { 
                            materialId: "MAT-10066", 
                            qty: 678, 
                            name: "หม้อแปลง 100 kVA (3 เฟส)",
                            price: 127900 
                          } 
                        }));
                      } else {
                        window.dispatchEvent(new CustomEvent("show-alert", { 
                          detail: { 
                            title: "อนุมัติการดำเนินงานสำเร็จ", 
                            content: `ระบบได้ทำการอนุมัติการดำเนินการสำหรับ "${recommendation.title}" เรียบร้อยแล้ว (PoC Phase)`,
                            type: "success"
                          } 
                        }));
                      }
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-[#059669] to-[#0d9488] hover:from-[#047857] hover:to-[#0f766e] text-white rounded-full text-[12px] font-bold cursor-pointer transition shadow-sm shadow-emerald-500/20"
                  >
                    อนุมัติการดำเนินงาน
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
