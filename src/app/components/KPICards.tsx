"use client";

import { AlertTriangle, Eye, Package, DollarSign, ShieldCheck } from "lucide-react";
import { criticalAlerts, warningAlerts, riskAlerts, totalVaR, materials } from "../data/mockData";

export default function KPICards() {
  const avgCoverage = materials.length > 0
    ? Math.round(materials.reduce((sum, m) => sum + (m.currentStock / m.safetyStock) * 100, 0) / materials.length)
    : 0;

  const varDisplay = totalVaR >= 1e9
    ? `฿${(totalVaR / 1e9).toFixed(2)} พันล้าน`
    : `฿${(totalVaR / 1e6).toFixed(1)} ล้าน`;

  const kpis = [
    { label: "เคสวิกฤต", value: String(criticalAlerts.length), sub: "ต้องดำเนินการทันที", icon: AlertTriangle, color: "#fff", textColor: "#fff", labelColor: "rgba(255,255,255,0.85)", subColor: "rgba(255,255,255,0.7)", bg: "linear-gradient(135deg,#DC2626,#E11D48)", iconBg: "rgba(255,255,255,0.2)" },
    { label: "เฝ้าระวัง", value: String(warningAlerts.length), sub: "เสี่ยงเพิ่มขึ้นใน 7 วัน", icon: Eye, color: "#D97706", textColor: "#92400E", labelColor: "#B45309", subColor: "#9CA3AF", bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", iconBg: "rgba(255,255,255,0.8)" },
    { label: "ทั้งหมด", value: String(riskAlerts.length), sub: "รายการแจ้งเตือนในระบบ", icon: Package, color: "#2563EB", textColor: "#1E40AF", labelColor: "#2563EB", subColor: "#9CA3AF", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", iconBg: "rgba(255,255,255,0.8)" },
    { label: "มูลค่าความเสี่ยงรวม", value: varDisplay, sub: "Value at Risk", icon: DollarSign, color: "#7C3AED", textColor: "#5B21B6", labelColor: "#7C3AED", subColor: "#9CA3AF", bg: "linear-gradient(135deg,#F5F3FF,#EDE9FE)", iconBg: "rgba(255,255,255,0.8)", isLarge: true },
    { label: "Coverage คงคลัง", value: `${avgCoverage}%`, sub: `เฉลี่ยจาก ${materials.length} พัสดุ`, icon: ShieldCheck, color: "#16A34A", textColor: "#166534", labelColor: "#16A34A", subColor: "#9CA3AF", bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", iconBg: "rgba(255,255,255,0.8)" },
  ];

  return (
    <div className="grid grid-cols-5 gap-3 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={i} className="rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1"
            style={{ background: k.bg }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: k.iconBg }}>
                <Icon size={16} style={{ color: k.color }} />
              </div>
              <span className="text-[11px] font-semibold" style={{ color: k.labelColor }}>{k.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-extrabold leading-none ${k.isLarge ? "text-[16px]" : "text-[22px]"}`} style={{ color: k.textColor }}>{k.value}</span>
            </div>
            <div className="text-[10px] mt-1" style={{ color: k.subColor }}>{k.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
