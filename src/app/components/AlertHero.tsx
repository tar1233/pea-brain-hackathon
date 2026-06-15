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
    <div className="rounded-3xl overflow-hidden animate-fade-in shadow-lg border border-red-900/20"
      style={{
        background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #dc2626 100%)",
        animationDelay: "50ms", animationFillMode: "both",
      }}>
      <div className="px-4 py-4 md:px-6 md:py-5">
        {/* Header bar */}
        <div className="flex items-center gap-2 mb-3 md:mb-4 flex-wrap">
          <ShieldAlert size={16} className="text-white animate-pulse shrink-0" />
          <span className="text-[16.5px] md:text-[16.5px] font-bold text-white tracking-wide">🚨 แจ้งเตือนวิกฤตอันดับ 1 ที่ต้องจัดการทันที</span>
          <div className="flex-1" />
          <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg bg-black/30 text-[16.5px] md:text-[16.5px] font-bold text-white uppercase tracking-wider shrink-0">
            Critical Priority
          </span>
        </div>

        {/* Main content — stack on mobile, 3-col on desktop */}
        <div className="flex flex-col md:grid md:gap-5 gap-3" style={{ gridTemplateColumns: "2fr 1fr 1fr" } as React.CSSProperties}>
          {/* Top / Left — Problem */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[16.5px] md:text-[22px] font-black text-white leading-tight mb-3 md:mb-4 drop-shadow-md">
              {topMaterial?.name} ({topMaterial?.id})
            </h2>
            
            <div className="flex flex-col gap-2 mb-4 md:mb-6">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-black/20 text-white/90 text-[16.5px] md:text-[16.5px] font-bold rounded uppercase tracking-wider shrink-0">ปัญหา</span>
                <span className="text-[16.5px] md:text-[16.5px] font-medium text-white leading-snug">
                  สต๊อกเหลือเพียง <strong className="text-[16.5px] md:text-[16.5px] text-yellow-300">{topMaterial?.currentStock.toLocaleString()}</strong> {topMaterial?.unit} (ต่ำกว่าเกณฑ์ <strong className="text-yellow-300">{stockPct}%</strong>)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-black/20 text-white/90 text-[16.5px] md:text-[16.5px] font-bold rounded uppercase tracking-wider shrink-0">ผลกระทบ</span>
                <span className="text-[16.5px] md:text-[16.5px] font-medium text-white leading-snug">
                  จะเกิดความเสียหายระดับ <strong>รุนแรง</strong> หากไม่แก้ไขภายใน 2 วัน
                </span>
              </div>
            </div>
            
            <div>
              <button 
                className="inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-xl bg-white text-red-700 text-[16.5px] md:text-[16.5px] font-extrabold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all cursor-pointer w-full md:w-auto justify-center"
                onClick={(e) => { 
                  e.preventDefault(); 
                  window.dispatchEvent(new CustomEvent("analyze-material", { detail: { materialId: topMaterial?.id } })); 
                }}
              >
                <Sparkles size={16} className="text-red-600" />
                ให้ AI สร้างแผนจัดซื้อด่วน
              </button>
            </div>
          </div>
          
          {/* Impact + Deadline row on mobile, separate cols on desktop */}
          <div className="grid grid-cols-2 md:contents gap-3">
            {/* Center — Impact */}
            <div className="flex flex-col items-center justify-center bg-black/15 rounded-2xl p-3 md:p-5 border border-white/10 backdrop-blur-sm">
              <div className="text-[16.5px] md:text-[16.5px] text-white/70 font-bold uppercase tracking-widest mb-2 md:mb-3 text-center">
                มูลค่าความเสียหาย<br className="md:hidden" /> (Value at Risk)
              </div>
              <div className="flex items-baseline gap-1 md:gap-2.5">
                <span className="text-[16.5px] md:text-[16.5px] text-white/70 font-bold">฿</span>
                <span className="text-[28px] md:text-[40px] font-black text-white leading-none tracking-tight drop-shadow-lg">{varMillions}</span>
                <span className="text-[16.5px] md:text-[16.5px] font-bold text-white/90">ล้าน</span>
              </div>
            </div>

            {/* Right — Urgency */}
            <div className="flex flex-col items-center justify-center bg-black/15 rounded-2xl p-3 md:p-5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
              <div className="text-[16.5px] md:text-[16.5px] text-white/70 font-bold uppercase tracking-widest mb-2 md:mb-3 relative z-10 text-center">
                เส้นตาย (Deadline)
              </div>
              <div className="flex items-baseline gap-1 md:gap-2.5 justify-center relative z-10">
                <span className="text-[28px] md:text-[40px] font-black text-white leading-none tracking-tight drop-shadow-lg">2</span>
                <span className="text-[16.5px] md:text-[16.5px] text-white/80 font-bold">วัน</span>
                <span className="text-[28px] md:text-[40px] font-black text-white leading-none tracking-tight drop-shadow-lg ml-1 md:ml-2">6</span>
                <span className="text-[16.5px] md:text-[16.5px] text-white/80 font-bold">ชม.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
