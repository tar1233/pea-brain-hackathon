"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  ClipboardList,
  DollarSign,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
// Actual data comes from the global context
import { useData } from "../context/DataContext";

function formatCurrency(value: number) {
  if (value >= 1e9) return `฿${(value / 1e9).toFixed(2)} พันล้าน`;
  if (value >= 1e6) return `฿${(value / 1e6).toFixed(1)} ล้าน`;
  return `฿${value.toLocaleString()}`;
}

export default function Dashboard({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const data = useData();

  if (data.isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Sparkles size={32} className="animate-pulse text-primary-500" />
        <div className="text-sm font-bold text-slate-500">กำลังดึงข้อมูล Dashboard เรียลไทม์...</div>
      </div>
    );
  }

  const { materials, riskAlerts, timelineEvents, criticalAlerts } = data;

  const coverage = Math.round(
    materials.reduce((sum, material) => sum + (material.currentStock / material.safetyStock) * 100, 0) / materials.length
  );
  const topRisks = [...riskAlerts].sort((a, b) => b.costImpact - a.costImpact).slice(0, 3);
  const totalAnnualDemand = materials.reduce((sum, material) => sum + material.annualDemand, 0);
  const totalShortageUnits = materials.reduce(
    (sum, material) => sum + Math.max(material.safetyStock - material.currentStock, 0),
    0
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-purple-500/10 bg-gradient-to-br from-[#2e0854] via-[#5c0670] to-[#b33617] px-8 py-10 text-white shadow-[0_20px_50px_rgba(46,16,138,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "url('/power-grid.png')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "overlay" }}></div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold tracking-widest text-white/90 uppercase">
              <Brain size={14} />
              Command Center
            </div>
            <h1 className="max-w-4xl text-[20px] font-bold leading-tight tracking-tight">
              ภาพรวมการตัดสินใจสำหรับทีมวางแผนพัสดุ
            </h1>
            <p className="mt-3 max-w-3xl text-[12px] leading-relaxed text-white/70 font-medium">
              ระบบกำลังติดตาม {riskAlerts.length} สัญญาณความเสี่ยงจากข้อมูลจริงของพัสดุกลุ่มหม้อแปลง
              และจัดลำดับให้ทีมตัดสินใจจากผลกระทบเชิงธุรกิจ ความพร้อมคงคลัง และระยะเวลาจัดซื้อ
            </p>
          </div>
          <div className="grid min-w-[520px] gap-5 sm:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.05)] hover:bg-white/20 transition-all">
              <div className="flex items-center gap-2 text-white/90">
                <ShieldCheck size={16} />
                <span className="text-[11px] font-bold tracking-wider uppercase">ดัชนีความพร้อมรวม</span>
              </div>
              <div className="mt-3">
                <div className="text-[20px] font-bold leading-none tracking-tight">{coverage}%</div>
                <div className="mt-1.5 text-[10px] font-bold text-emerald-300">
                  +1.5% ดีขึ้นจากสัปดาห์ก่อน
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.05)] hover:bg-white/20 transition-all">
              <div className="flex items-center gap-2 text-white/90">
                <AlertTriangle size={16} />
                <span className="text-[11px] font-bold tracking-wider uppercase">Shortage Gap</span>
              </div>
              <div className="mt-3">
                <div className="text-[20px] font-bold leading-none tracking-tight">{totalShortageUnits.toLocaleString()}</div>
                <div className="mt-1.5 text-[10px] font-bold text-rose-300">
                  หน่วยที่ต่ำกว่า safety stock ในภาพรวม
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: AlertTriangle,
            label: "เคสวิกฤต",
            value: `${criticalAlerts.length} รายการ`,
            note: "ต้องตัดสินใจภายในรอบจัดซื้อถัดไป",
            tone: "from-[#4e091b] via-[#750e26] to-[#b91c1c] border border-rose-500/20 shadow-[0_15px_35px_rgba(185,28,28,0.1)]",
            iconBg: "bg-white/10 border border-white/10",
            iconColor: "text-white",
            textColor: "text-white",
            labelColor: "text-red-100/90",
            noteColor: "text-red-100/70",
            isCritical: true,
          },
          {
            icon: ShieldCheck,
            label: "Coverage คงคลัง",
            value: `${coverage}%`,
            note: "เฉลี่ยเทียบกับ safety stock",
            tone: "from-[#064e3b] via-[#065f46] to-[#059669] border border-emerald-500/20 shadow-[0_15px_35px_rgba(16,185,129,0.1)]",
            iconBg: "bg-white/10 border border-white/10",
            iconColor: "text-white",
            textColor: "text-white",
            labelColor: "text-emerald-100/90",
            noteColor: "text-emerald-100/70",
          },
          {
            icon: TrendingUp,
            label: "Demand ทั้งปี",
            value: totalAnnualDemand.toLocaleString(),
            note: "หน่วยรวมของพัสดุหลักปี 2569",
            tone: "from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] border border-blue-500/20 shadow-[0_15px_35px_rgba(59,130,246,0.1)]",
            iconBg: "bg-white/10 border border-white/10",
            iconColor: "text-white",
            textColor: "text-white",
            labelColor: "text-blue-100/90",
            noteColor: "text-blue-100/70",
          },
          {
            icon: ClipboardList,
            label: "รายการที่ต้องตาม",
            value: `${materials.length} SKU`,
            note: "พร้อม drill-down ในหน้าวิเคราะห์รายรายการ",
            tone: "from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] border border-purple-500/20 shadow-[0_15px_35px_rgba(139,92,246,0.1)]",
            iconBg: "bg-white/10 border border-white/10",
            iconColor: "text-white",
            textColor: "text-white",
            labelColor: "text-purple-100/90",
            noteColor: "text-purple-100/70",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className={`rounded-2xl bg-gradient-to-br ${card.tone} p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg} shadow-sm`}>
                  <Icon size={16} className={card.iconColor} />
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${card.labelColor}`}>{card.label}</div>
              </div>
              <div className={`mt-2.5 text-[18px] font-bold tracking-tight ${card.textColor}`}>{card.value}</div>
              <div className={`mt-0.5 text-[11px] font-medium ${card.noteColor}`}>{card.note}</div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Top Priority</div>
              <h2 className="mt-1 text-[14px] font-bold text-gray-900 tracking-tight">รายการที่ควรตัดสินใจก่อน</h2>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-3.5 py-1 text-[11px] font-bold text-white shadow-sm shadow-red-500/10 animate-pulse">
              {criticalAlerts.length} Critical
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {topRisks.map((alert, index) => {
              const material = materials.find((item) => item.id === alert.materialId);
              const severityColor = alert.severity === 'critical' 
                ? { border: 'border-l-red-500', bg: 'bg-red-50/40', rankBg: 'bg-red-500', rankText: 'text-white', impactBg: 'bg-gradient-to-br from-red-50 to-rose-50', impactBorder: 'border-red-100', impactValue: 'text-red-700' }
                : alert.severity === 'warning'
                ? { border: 'border-l-amber-500', bg: 'bg-amber-50/30', rankBg: 'bg-amber-100', rankText: 'text-amber-700', impactBg: 'bg-gradient-to-br from-amber-50 to-orange-50', impactBorder: 'border-amber-100', impactValue: 'text-amber-700' }
                : { border: 'border-l-blue-400', bg: 'bg-blue-50/30', rankBg: 'bg-blue-100', rankText: 'text-blue-700', impactBg: 'bg-gradient-to-br from-blue-50 to-indigo-50', impactBorder: 'border-blue-100', impactValue: 'text-blue-700' };
              return (
                <div
                  key={alert.id}
                  className={`rounded-[20px] border border-gray-100 ${severityColor.bg} ${severityColor.border} border-l-4 p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${severityColor.rankBg} text-[11px] font-bold ${severityColor.rankText}`}>
                          {index + 1}
                        </span>
                        <span className="text-[13px] font-bold text-slate-900">{alert.materialId}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm">
                          {material?.name}
                        </span>
                      </div>
                      <div className="mt-2 text-[12px] font-semibold leading-relaxed text-slate-800">{alert.message}</div>
                      <div className="mt-1 text-[11px] leading-relaxed text-slate-500 font-medium">{alert.recommendation}</div>
                    </div>

                    <div className={`min-w-[210px] shrink-0 rounded-[16px] border ${severityColor.impactBorder} ${severityColor.impactBg} p-3.5 shadow-sm`}>
                      <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">Impact</div>
                      <div className={`mt-1.5 text-[15px] font-bold ${severityColor.impactValue}`}>{formatCurrency(alert.costImpact)}</div>
                      <div className="mt-1 text-[10px] leading-relaxed text-slate-500 font-semibold">
                        Lead time {material?.leadTimeWeeks ?? "-"} สัปดาห์ • conf {alert.confidence}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-[30px] border border-[#dde4f0] bg-white p-6 shadow-[0_12px_30px_rgba(148,163,184,0.10)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles size={16} className="text-primary-600" />
              <h2 className="text-[14px] font-bold text-slate-900">ความเคลื่อนไหวล่าสุดของระบบ</h2>
            </div>

            <div className="mt-4 space-y-2.5">
              {timelineEvents.map((event) => (
                <div key={`${event.time}-${event.text}`} className="flex gap-3">
                  <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#b40e92]" />
                  <div className="flex-1 rounded-[16px] bg-[#f7f9fd] px-4 py-2.5">
                    <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8ea0bd]">{event.time}</div>
                    <div className="mt-1 text-[11px] leading-relaxed text-slate-700 font-medium">{event.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="button"
            onClick={() => setActiveTab?.("activity")}
            className="mt-5 inline-flex w-max items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-[12px] font-bold text-[#a30787] transition-colors hover:bg-slate-50 cursor-pointer"
          >
            เปิด Activity Log
            <ArrowRight size={14} />
          </button>
        </article>
      </section>
    </div>
  );
}
