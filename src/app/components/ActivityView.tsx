"use client";

import { Brain, CheckCircle2, Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import { aiRecommendations, riskAlerts, timelineEvents } from "../data/mockData";

export default function ActivityView() {
  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#eef6ff_0%,#ffffff_45%,#edfdf7_100%)] p-6 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
            <Brain size={14} />
            Audit Trail
          </div>
          <h1 className="mt-3 text-[22px] font-black tracking-tight text-slate-900">Activity Log และความเคลื่อนไหวของระบบ</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            รวมลำดับเหตุการณ์ที่ AI วิเคราะห์ แจ้งเตือน และเสนอคำแนะนำ เพื่อใช้เป็นหลักฐานการตัดสินใจและอธิบาย flow ให้กรรมการเห็นแบบ end-to-end
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Clock3, label: "เหตุการณ์ล่าสุด", value: `${timelineEvents.length} logs`, tone: "text-blue-700", bg: "bg-gradient-to-br from-blue-50 to-indigo-50", iconBg: "bg-blue-100" },
          { icon: ShieldCheck, label: "Alerts in Scope", value: `${riskAlerts.length} รายการ`, tone: "text-red-700", bg: "bg-gradient-to-br from-red-50 to-rose-50", iconBg: "bg-red-100" },
          { icon: CheckCircle2, label: "AI Recommendations", value: `${aiRecommendations.length} actions`, tone: "text-emerald-700", bg: "bg-gradient-to-br from-emerald-50 to-green-50", iconBg: "bg-emerald-100" },
          { icon: MessageSquareText, label: "Review Readiness", value: "พร้อมเดโม", tone: "text-purple-700", bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50", iconBg: "bg-purple-100" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className={`rounded-3xl border border-slate-100 ${card.bg} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg}`}>
                  <Icon size={18} className={card.tone} />
                </div>
                <div className="text-xs font-semibold text-slate-500">{card.label}</div>
              </div>
              <div className={`mt-3 text-[22px] font-black ${card.tone}`}>{card.value}</div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-[16px] font-bold text-slate-900">System Timeline</h2>
          <div className="mt-5 space-y-4">
            {timelineEvents.map((event, index) => (
              <div key={`${event.time}-${event.text}`} className="flex gap-4">
                <div className="flex w-8 flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary-500" />
                  {index < timelineEvents.length - 1 && <div className="mt-1 h-full w-px bg-slate-200" />}
                </div>
                <div className="flex-1 rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{event.time}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-700">{event.text}</div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-[16px] font-bold text-slate-900">Recommendation Log</h2>
          <div className="mt-5 space-y-3">
            {aiRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold text-slate-900">{recommendation.title}</div>
                  <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    ลดเสี่ยง {recommendation.reduction}
                  </div>
                </div>
                <div className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {recommendation.description}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
