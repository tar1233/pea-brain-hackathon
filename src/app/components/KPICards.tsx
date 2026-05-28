"use client";

import { AlertTriangle, Eye, Package, DollarSign, ShieldCheck } from "lucide-react";
import { useData } from "../context/DataContext";

export default function KPICards() {
  const { criticalAlerts, warningAlerts, riskAlerts, totalVaR, materials } = useData();
  const avgCoverage = materials.length > 0
    ? Math.round(materials.reduce((sum, m) => sum + (m.currentStock / m.safetyStock) * 100, 0) / materials.length)
    : 0;

  const varDisplay = totalVaR >= 1e9
    ? `฿${(totalVaR / 1e9).toFixed(2)} พันล้าน`
    : `฿${(totalVaR / 1e6).toFixed(1)} ล้าน`;

  const kpis = [
    { 
      label: "เคสวิกฤต", 
      value: String(criticalAlerts.length), 
      sub: "ต้องดำเนินการทันที", 
      icon: AlertTriangle, 
      color: "text-red-600", 
      bgIcon: "bg-red-50", 
      border: "border-red-200 shadow-red-500/5", 
      valueColor: "text-red-700",
      reference: "เคสระดับ Critical ทั้งหมด"
    },
    { 
      label: "เฝ้าระวัง", 
      value: String(warningAlerts.length), 
      sub: "เสี่ยงเพิ่มขึ้นใน 7 วัน", 
      icon: Eye, 
      color: "text-amber-600", 
      bgIcon: "bg-amber-50", 
      border: "border-amber-200 shadow-amber-500/5", 
      valueColor: "text-amber-700",
      reference: "เคสระดับ Warning ทั้งหมด"
    },
    { 
      label: "รายการทั้งหมด", 
      value: String(riskAlerts.length), 
      sub: "ที่ต้องติดตามในระบบ", 
      icon: Package, 
      color: "text-blue-600", 
      bgIcon: "bg-blue-50", 
      border: "border-slate-200", 
      valueColor: "text-slate-800",
      reference: "รายการความเสี่ยงทั้งหมด"
    },
    { 
      label: "มูลค่าความเสี่ยงรวม", 
      value: varDisplay, 
      sub: "Value at Risk", 
      icon: DollarSign, 
      color: "text-purple-600", 
      bgIcon: "bg-purple-50", 
      border: "border-slate-200", 
      valueColor: "text-slate-800", 
      isLarge: true,
      reference: "Σ Cost Impact เคสวิกฤต"
    },
    { 
      label: "Coverage คงคลัง", 
      value: `${avgCoverage}%`, 
      sub: `เฉลี่ยจาก ${materials.length} พัสดุ`, 
      icon: ShieldCheck, 
      color: "text-emerald-600", 
      bgIcon: "bg-emerald-50", 
      border: "border-slate-200", 
      valueColor: "text-slate-800",
      reference: "เฉลี่ย (Stock / Safety Stock)"
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={i} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col relative group ${k.border}`}>
            <div className="flex items-center gap-3 mb-3 w-full">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bgIcon}`}>
                <Icon size={20} className={k.color} />
              </div>
              <span className="text-[15px] font-bold text-slate-600 leading-tight truncate">{k.label}</span>
            </div>
            <div className="mt-auto">
              <div className={`font-black tracking-tight leading-none ${k.isLarge ? "text-[24px]" : "text-[36px]"} ${k.valueColor}`}>
                {k.value}
              </div>
              <div className="text-[13px] font-medium text-slate-500 mt-2">{k.sub}</div>
              {k.reference && (
                <div className="text-[11px] font-medium text-slate-400 mt-1.5 border-t border-slate-100 pt-1">
                  *{k.reference}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
