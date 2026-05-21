"use client";

import { Brain, CheckCircle2, Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import { aiRecommendations, riskAlerts, timelineEvents } from "../data/mockData";

export default function ActivityView() {
  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#fffbf2_0%,#ffffff_45%,#eff6ff_100%)] p-6 shadow-[0_15px_30px_rgba(0,0,0,0.015)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800 shadow-sm">
            <Brain size={14} />
            Audit Trail
          </div>
          <h1 className="mt-4 text-[20px] font-bold tracking-tight text-slate-900">Activity Log และความเคลื่อนไหวของระบบ</h1>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-600 font-medium">
            รวมลำดับเหตุการณ์ที่ AI วิเคราะห์ แจ้งเตือน และเสนอคำแนะนำ เพื่อใช้เป็นหลักฐานการตัดสินใจและอธิบาย flow ให้กรรมการเห็นแบบ end-to-end
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Clock3, label: "เหตุการณ์ล่าสุด", value: `${timelineEvents.length} logs`, tone: "text-blue-800", bg: "bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-100", iconBg: "bg-blue-50 border border-blue-100" },
          { icon: ShieldCheck, label: "Alerts in Scope", value: `${riskAlerts.length} รายการ`, tone: "text-red-800", bg: "bg-gradient-to-br from-red-50/60 to-rose-50/60 border-red-100", iconBg: "bg-red-50 border border-red-100" },
          { icon: CheckCircle2, label: "AI Recommendations", value: `${aiRecommendations.length} actions`, tone: "text-emerald-800", bg: "bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-100", iconBg: "bg-emerald-50 border border-emerald-100" },
          { icon: MessageSquareText, label: "Review Readiness", value: "พร้อมเดโม", tone: "text-purple-800", bg: "bg-gradient-to-br from-purple-50/60 to-fuchsia-50/60 border-purple-100", iconBg: "bg-purple-50 border border-purple-100" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className={`rounded-[20px] border p-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] backdrop-blur-sm ${card.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                  <Icon size={18} className={card.tone} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{card.label}</div>
              </div>
              <div className={`mt-3 text-[18px] font-bold ${card.tone}`}>{card.value}</div>
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
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
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
