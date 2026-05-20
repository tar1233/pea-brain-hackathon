"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import AICopilot from "./components/AICopilot";
import Dashboard from "./components/Dashboard";
import ForecastView from "./components/ForecastView";
import InventoryView from "./components/InventoryView";
import AlertsView from "./components/AlertsView";
import {
  BudgetView,
  ProcurementView,
  ReportsView,
} from "./components/StrategicViews";
import WarehouseView from "./components/WarehouseView";

/* ─── Watermark: Logo + Name + Grid ─── */
function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* ── Center: PEA BRAIN logo image + brand text ── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.05 }}>
        <div className="flex flex-col items-center gap-5 select-none">
          <img
            src="/pea-official-logo.png"
            alt=""
            width={160}
            height={160}
            style={{ filter: "grayscale(20%) opacity(0.8)" }}
          />
          <div className="flex flex-col items-center">
            <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: 2, color: "#A80689", lineHeight: 1 }}>
              PEA Brain
            </div>
            
            {/* Golden Heartbeat Line */}
            <div className="w-[120%] flex items-center justify-center mt-2 mb-2" style={{ color: "#EDC878" }}>
              <div className="flex-1 h-[2px] bg-[#EDC878] rounded-full"></div>
              <svg width="30" height="15" viewBox="0 0 40 20" fill="none" className="mx-1" stroke="#EDC878" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 10 H8 L12 4 L18 16 L24 2 L30 14 L34 10 H40" />
              </svg>
              <div className="flex-1 h-[2px] bg-[#EDC878] rounded-full"></div>
            </div>

            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 0.5, color: "#A80689", opacity: 0.8 }}>
              ขับเคลื่อนการจัดซื้อพลังงานด้วย AI เพื่ออนาคตที่ยั่งยืน
            </div>
          </div>
        </div>
      </div>

      {/* ── Repeating diagonal text ── */}
      <div className="watermark-text" />

      {/* ── Power Grid illustration image (bottom-right) ── */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[450px]"
        style={{ opacity: 0.04 }}>
        <img
          src="/power-grid.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom right",
            filter: "saturate(0.3) opacity(0.8)",
          }}
        />
      </div>
    </div>
  );
}


import ActivityView from "./components/ActivityView";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "forecast":
        return <ForecastView />;
      case "inventory":
        return <InventoryView />;
      case "procurement":
        return <ProcurementView />;
      case "warehouse":
        return <WarehouseView />;
      case "budget":
        return <BudgetView />;
      case "reports":
        return <ReportsView />;
      case "activity":
        return <ActivityView />;
      case "risk":
      default:
        return <AlertsView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f5fb]">
      {/* Background watermark */}
      <Watermark />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Center + Right */}
      <div className="flex flex-1 overflow-hidden relative z-[1]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar activeTab={activeTab} />
          <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(249,246,255,0.95)_0%,rgba(245,247,252,0.96)_100%)]">
            <div className="px-6 py-5 space-y-4">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* AI Copilot Panel */}
        <AICopilot />
      </div>
    </div>
  );
}
