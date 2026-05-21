"use client";

import { AlertTriangle, ArrowRight, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { useData } from "../context/DataContext";

export default function AlertHero() {
  const { riskAlerts, criticalAlerts, materials } = useData();
  const topAlert = riskAlerts[0];
  const topMaterial = materials.find(m => m.id === topAlert?.materialId);
  const critCount = criticalAlerts.length;
  const varMillions = topAlert ? (topAlert.costImpact / 1e6).toFixed(1) : "0.0";
  const stockPct = topMaterial ? Math.round((1 - topMaterial.currentStock / topMaterial.safetyStock) * 100) : 0;

  if (!topAlert) return null;

  return (
    <div className="rounded-2xl overflow-hidden animate-fade-in"
      style={{
        background: "linear-gradient(135deg, #991B1B 0%, #B91C1C 40%, #DC2626 100%)",
        animationDelay: "50ms", animationFillMode: "both",
      }}>
      <div className="px-5 py-4">
        {/* Header bar */}
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert size={14} className="text-red-200" />
          <span className="text-[12px] font-bold text-white/90">สิ่งที่ต้องตัดสินใจตอนนี้</span>
          <span className="px-2 py-0.5 rounded-md bg-white/15 text-[10px] font-bold text-white/90">{critCount} เคสวิกฤต</span>
          <div className="flex-1" />
          <span className="px-2 py-0.5 rounded-md bg-red-900/50 text-[10px] font-bold text-red-200 border border-red-700/50">วิกฤต</span>
        </div>

        {/* Main content */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "1.8fr 1.2fr 0.8fr" }}>
          {/* Left — action */}
          <div>
            <div className="text-[9px] text-white/40 font-bold uppercase tracking-[2px] mb-1">Action Now</div>
            <h2 className="text-[17px] font-extrabold text-white leading-tight mb-1">
              {topAlert.recommendation.split("มูลค่า")[0].trim()}
            </h2>
            <div className="flex items-start gap-1.5 mb-3">
              <AlertTriangle size={12} className="text-red-300 mt-0.5 shrink-0" />
              <p className="text-[11px] text-white/60 leading-relaxed">
                Stock {topMaterial?.currentStock.toLocaleString()} {topMaterial?.unit} ต่ำกว่า safety {topMaterial?.safetyStock.toLocaleString()} ({stockPct}% ต่ำกว่าเกณฑ์)<br />
                Lead time ยาว {topMaterial?.leadTimeWeeks} สัปดาห์ — หากไม่ดำเนินการ ความเสี่ยง shortage จะเพิ่มขึ้น
              </p>
            </div>
            <button onClick={() => document.querySelector('[class*="rounded-3xl bg-white shadow"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold border border-white/10 transition-all cursor-pointer">
              <Sparkles size={12} />
              ดูรายละเอียดทั้งหมด
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Center — VaR */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-1">
              ความเสี่ยงด้านการเงินรวม (Value at Risk)
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-white/50">฿</span>
              <span className="text-[28px] font-black text-white leading-none">{varMillions}</span>
              <span className="text-[14px] font-bold text-white/70">ล้าน</span>
            </div>
            <div className="text-[10px] text-white/40 mt-1">ผลกระทบหากเกิด shortage</div>
          </div>

          {/* Right — countdown + confidence */}
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Urgency */}
            <div className="text-center">
              <div className="text-[9px] text-white/30 font-semibold uppercase tracking-wider mb-1">ความเร่งด่วน</div>
              <div className="flex items-baseline gap-1 justify-center">
                <span className="text-[28px] font-black text-white leading-none">2</span>
                <span className="text-[11px] text-white/50 font-bold">วัน</span>
                <span className="text-[28px] font-black text-white leading-none ml-1">6</span>
                <span className="text-[11px] text-white/50 font-bold">ชม.</span>
              </div>
              <div className="text-[8px] text-white/25 mt-0.5">ก่อนความเสี่ยงจะเพิ่มขึ้น</div>
            </div>

            {/* Confidence */}
            <div className="flex items-center gap-2">
              <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#4ADE80" strokeWidth="4"
                  strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - topAlert.confidence / 100)} strokeLinecap="round"
                  style={{ animation: "ring-grow .8s ease-out forwards" }} />
              </svg>
              <div>
                <div className="text-[18px] font-black text-white leading-none">{topAlert.confidence}%</div>
                <div className="text-[8px] text-white/30">High Confidence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
