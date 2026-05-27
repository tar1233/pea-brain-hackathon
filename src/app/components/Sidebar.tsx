"use client";

import {
  LayoutDashboard, TrendingUp, AlertTriangle,
  ShoppingCart, Settings, Sparkles,
  Package, BarChart3, Shield, Clock3, Landmark, FileText,
  Brain, PackageSearch, ShieldAlert, Map, ShieldCheck, Activity, Trash2
} from "lucide-react";
import Image from "next/image";
import { useData } from "../context/DataContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { criticalAlerts } = useData();

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "risk", label: "Risk Management", icon: ShieldAlert, badge: criticalAlerts.length, bgBadge: "bg-red-500 text-white" },
    { id: "activity", label: "Tracking & Monitoring", icon: Clock3 },
    { id: "backtest", label: "AI Training & Backtesting", icon: Activity },
    { id: "roadmap", label: "Project Roadmap", icon: Map },
  ];

  return (
    <aside className="w-[260px] shrink-0 sticky top-0 h-screen flex flex-col relative overflow-hidden border-r border-white/10 shadow-[12px_0_40px_rgba(83,0,93,0.15)]"
      style={{ background: "linear-gradient(180deg, #8c0aa8 0%, #6d108d 28%, #5b1f6b 58%, #7d365c 100%)" }}>

      {/* ── Power Grid Background Image ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "screen",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 20%, black 60%)",
          maskImage: "linear-gradient(to bottom, transparent 20%, black 60%)"
        }}>
        <img
          src="/power-grid.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "bottom",
            filter: "invert(1) grayscale(100%) opacity(20%)"
          }}
        />
      </div>

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 relative z-10">
        <div className="flex items-center gap-3">
          <img
            src="/pea-official-logo.png"
            alt="PEA Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-white font-extrabold text-[16px] tracking-tight">PEA</span>
              <span className="text-[#EDC878] font-extrabold text-[16px]">Brain</span>
            </div>
            <div className="text-[#EDC878]/80 text-[8px] font-medium tracking-wide mt-[-1px]">
              ขับเคลื่อนการจัดซื้อพลังงานด้วย AI เพื่ออนาคตที่ยั่งยืน
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot CTA */}
      <div className="mx-3 mb-5 p-4 rounded-2xl border border-white/12 cursor-pointer transition-all hover:border-white/25 relative z-10 shadow-[0_18px_35px_rgba(46,0,66,0.22)]"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.05) 100%)" }}>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-300" />
          <span className="text-[12px] font-bold text-white">AI Copilot</span>
        </div>
        <div className="text-[10px] text-white/72 mt-1">วิเคราะห์ความเสี่ยงด้วย AI</div>
      </div>

      <div className="mx-4 h-px bg-white/8 relative z-10" />

      {/* Menu */}
      <nav className="flex-1 px-3 pt-2 space-y-1 overflow-y-auto relative z-10">
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const badgeValue = item.id === "risk" ? criticalAlerts.length : item.badge;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-2xl text-[12px] transition-all duration-300 cursor-pointer
                ${isActive
                  ? "bg-white/20 text-white font-semibold shadow-[0_8px_30px_rgba(255,255,255,0.12)] border border-white/30 backdrop-blur-md"
                  : "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent"
                }`}>
              <Icon size={15} className={isActive ? "text-[#EDC878] drop-shadow-md" : "text-white/70"} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {badgeValue && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center bg-critical-600 text-white">
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 relative z-10">
        <div className="mx-1 h-px bg-white/8 mb-2" />
        <div className="flex items-center gap-2 px-2">
          <Settings size={13} className="text-white/70" />
          <span className="text-[10px] text-white/72">ตั้งค่า</span>
        </div>
        <button
          onClick={() => {
            if (confirm('ล้างแผนจัดซื้อทั้งหมด? (เพื่อทดสอบใหม่)')) {
              localStorage.removeItem('pea_approved_plans');
              window.dispatchEvent(new CustomEvent('clear-plans'));
              window.location.reload();
            }
          }}
          className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] text-red-300 hover:text-red-200 hover:bg-red-500/15 border border-transparent hover:border-red-400/20 transition-all cursor-pointer"
        >
          <Trash2 size={12} />
          <span>เคลียร์แผนทั้งหมด (Test)</span>
        </button>
      </div>
    </aside>
  );
}
