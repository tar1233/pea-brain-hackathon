"use client";

import { Search, Bell, Download, ChevronDown, HelpCircle, Loader2, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";

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
  roadmap: {
    title: "AI Training & แผนงานโครงสร้างระบบ",
    subtitle: "Backtesting, Sprint Updates, Architecture & Timeline",
  },
};

interface TopBarProps {
  activeTab: string;
}

export default function TopBar({ activeTab }: TopBarProps) {
  const { criticalAlerts, runAutoRiskAnalysis, isAnalyzingRisk } = useData();
  const [now, setNow] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line
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


      {/* Spacer */}

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
