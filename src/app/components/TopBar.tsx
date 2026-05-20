"use client";

import { Search, Bell, Download, ChevronDown, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { criticalAlerts } from "../data/mockData";

const tabConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "ภาพรวมการตัดสินใจ",
    subtitle: "Executive command center",
  },
  forecast: {
    title: "พยากรณ์ Demand",
    subtitle: "Forecast and seasonality insight",
  },
  inventory: {
    title: "วางแผนเติมสต็อก",
    subtitle: "Stock planning workspace",
  },
  risk: {
    title: "แจ้งเตือนความเสี่ยง",
    subtitle: "Prioritized risk alerts",
  },
  procurement: {
    title: "จัดซื้อจัดจ้างอัจฉริยะ",
    subtitle: "Procurement action board",
  },
  warehouse: {
    title: "ภาพรวมผู้บริหารคลัง",
    subtitle: "Executive warehouse command center",
  },
  budget: {
    title: "วิเคราะห์งบประมาณ",
    subtitle: "Budget and exposure insight",
  },
  reports: {
    title: "รายงานผู้บริหาร",
    subtitle: "Presentation-ready summary",
  },
  activity: {
    title: "ประวัติกิจกรรม (System Logs)",
    subtitle: "AI recommendation audit trail & system timeline",
  },
};

interface TopBarProps {
  activeTab: string;
}

export default function TopBar({ activeTab }: TopBarProps) {
  const [now, setNow] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const current = tabConfig[activeTab] ?? tabConfig.risk;
  const alertBadge = activeTab === "risk" ? criticalAlerts.length : null;

  const dateStr = isMounted ? now.toLocaleDateString("th-TH", {
    day: "numeric", month: "long", year: "numeric",
  }) : "";
  const timeStr = isMounted ? now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-gray-100/60 bg-white/60 px-8 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[14px] font-bold text-[#5c2b86]">{current.title}</h1>
          {alertBadge ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-critical-600 text-[9px] font-bold text-white">
              {alertBadge}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[11px] text-[#8a94ab]">{current.subtitle}</div>
      </div>

      <div className="flex-1" />

      {/* Date */}
      <span className="text-[11px] text-[#8a94ab]">{dateStr} • {timeStr} น.</span>

      {/* Icons */}
      <button className="w-8 h-8 rounded-lg hover:bg-primary-50 flex items-center justify-center text-[#8793ac] transition-colors cursor-pointer">
        <Search size={15} />
      </button>
      <button className="w-8 h-8 rounded-lg hover:bg-primary-50 flex items-center justify-center text-[#8793ac] transition-colors cursor-pointer">
        <HelpCircle size={15} />
      </button>
      <button className="w-8 h-8 rounded-lg hover:bg-primary-50 flex items-center justify-center text-[#8793ac] relative transition-colors cursor-pointer">
        <Bell size={15} />
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-critical-600 text-white text-[8px] font-bold flex items-center justify-center">
          {criticalAlerts.length}
        </span>
      </button>

      {/* Export & Share */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => alert("📄 กำลังสร้างไฟล์ PDF รายงานสรุปความเสี่ยง... (Demo Phase 2)")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#d9dfeb] bg-white hover:bg-primary-50 text-[11px] font-semibold text-[#475569] transition-colors cursor-pointer shadow-sm"
        >
          <Download size={13} />
          Export PDF
        </button>
        <button 
          onClick={() => alert("✅ ระบบได้ทำการส่งสรุปความเสี่ยง 10067 และ 10066 เข้า LINE กลุ่ม 'ผู้บริหาร PEA จัดซื้อ' เรียบร้อยแล้ว!")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#06c755]/20 bg-[#06c755]/10 hover:bg-[#06c755]/20 text-[11px] font-bold text-[#05a546] transition-colors cursor-pointer shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M22.28,10.66C22.28,6.01,17.7,2.25,12,2.25C6.3,2.25,1.72,6.01,1.72,10.66c0,4.18,3.56,7.74,8.38,8.35c0.33,0.07,0.78,0.22,0.89,0.52c0.1,0.26,0.03,0.67,0,0.92c-0.04,0.34-0.2,0.99-0.2,0.99c-0.04,0.16-0.17,0.66,0.58,0.35c0.75-0.31,4.06-2.4,5.55-4.11C20.61,15.25,22.28,13.14,22.28,10.66z"/>
          </svg>
          Share to LINE
        </button>
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Profile */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d04ca6] to-[#9f2c80] border-2 border-[#f3d3e7] flex items-center justify-center text-[10px] font-bold text-white">
          {activeTab === "warehouse" ? "วญ" : "ขภ"}
        </div>
        <div className="hidden lg:block">
          <div className="text-[11px] font-semibold text-text-primary leading-tight">
            {activeTab === "warehouse" ? "คุณวรัญญู จันทร์ศิริ" : "คุณขวัญภิชา"}
          </div>
          <div className="text-[9px] text-text-muted">
            {activeTab === "warehouse" ? "ผู้บริหารคลัง" : "Supply Planner"}
          </div>
        </div>
        <ChevronDown size={12} className="text-text-muted" />
      </div>
    </header>
  );
}
