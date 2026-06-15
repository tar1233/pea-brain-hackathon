"use client";

import React, { useState } from "react";
import {
  Search, ChevronLeft, ChevronRight, ChevronDown,
  SlidersHorizontal, Sparkles
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useData } from "../context/DataContext";
import type { RiskLevel } from "../data/awsData";
import EBiddingView from "./EBiddingView";

const severityConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: "วิกฤต", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  warning: { label: "เฝ้าระวัง", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  info: { label: "ปกติ", color: "#22C55E", bg: "#F0FDF4", border: "#BBF7D0" },
};

function formatCurrency(v: number) {
  if (v >= 1e9) return `฿${(v / 1e9).toFixed(2)} พันล้าน`;
  if (v >= 1e6) return `฿${(v / 1e6).toFixed(1)} ล้าน`;
  return `฿${v.toLocaleString()}`;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div style={{ width: 60, height: 24 }}>
      <ResponsiveContainer width={60} height={24}>
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AlertTable({ approvedPlans = [] }: { approvedPlans?: any[] }) {
  const { riskAlerts, materials } = useData();
  const [filter, setFilter] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const perPage = 5;

  const allAlerts = React.useMemo(() => {
    const alerts = [...riskAlerts];
    materials.forEach(mat => {
      if (!alerts.find(a => a.materialId === mat.id)) {
        alerts.push({
          id: `ALERT-${mat.id}`,
          materialId: mat.id,
          materialName: mat.name,
          severity: "info",
          timestamp: new Date().toISOString(),
          costImpact: 0,
          recommendation: "ระดับสต็อกอยู่ในเกณฑ์ปลอดภัย (Normal Status)",
          type: "stock",
          message: "สต็อกปกติ",
          detail: "-",
          confidence: 100
        } as any);
      }
    });
    const order: Record<string, number> = { critical: 1, warning: 2, info: 3 };
    return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
  }, [riskAlerts, materials]);

  const filteredAlerts = allAlerts.filter(a => filter === "all" || a.severity === filter)
    .filter(a => a.materialName.toLowerCase().includes(searchQ.toLowerCase()) || a.materialId.toLowerCase().includes(searchQ.toLowerCase()));
  
  const totalPages = Math.ceil(filteredAlerts.length / perPage);
  const paged = filteredAlerts.slice((page - 1) * perPage, page * perPage);

  const tabs = [
    { key: "all", label: "รายการทั้งหมด", count: allAlerts.length },
    { key: "critical", label: "วิกฤต", count: allAlerts.filter(a => a.severity === 'critical').length, dot: "#DC2626" },
    { key: "warning", label: "เฝ้าระวัง", count: allAlerts.filter(a => a.severity === 'warning').length, dot: "#D97706" },
    { key: "info", label: "ปกติ", count: allAlerts.filter(a => a.severity === 'info').length, dot: "#22C55E" }
  ];

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(paged.map(a => a.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    const newSet = new Set(selectedItems);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedItems(newSet);
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs Row */}
      <div className="flex items-center gap-1 px-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key}
            onClick={() => { setFilter(tab.key); setPage(1); }}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-t-lg text-[16.5px] md:text-[16.5px] font-medium transition-all cursor-pointer whitespace-nowrap
              ${filter === tab.key
                ? "bg-white text-primary-700 border border-border border-b-white font-semibold shadow-sm -mb-px z-10"
                : "text-text-secondary hover:text-text-primary hover:bg-white/50 border border-transparent"}`}>
            {tab.dot && <span className="w-2 h-2 rounded-full" style={{ background: tab.dot }} />}
            {tab.label} <span className={`${filter === tab.key ? "bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md text-[16.5px] md:text-[16.5px] font-bold" : "text-text-muted"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filter Controls Row */}
      <div className="flex items-center gap-2 p-2 md:p-3 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4 flex-wrap">
        <div className="relative w-full md:w-auto">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }}
            placeholder="ค้นหาชื่อพัสดุ รหัส..."
            className="w-full md:w-[240px] pl-8 pr-3 py-2 rounded-lg bg-gray-50 text-[16.5px] text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition-all border-none" />
        </div>
        <div className="hidden md:block relative">
          <select className="appearance-none w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-[16.5px] font-medium text-slate-700 outline-none cursor-pointer shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all hover:bg-slate-50">
            <option>หมวดพัสดุ</option><option>หม้อแปลงไฟฟ้า</option><option>อุปกรณ์ป้องกัน</option><option>อุปกรณ์วัด</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="hidden md:block relative">
          <select className="appearance-none w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-[16.5px] font-medium text-slate-700 outline-none cursor-pointer shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all hover:bg-slate-50">
            <option>ระดับความเสี่ยง</option><option>วิกฤต</option><option>เฝ้าระวัง</option><option>ข้อมูล</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="hidden md:block relative">
          <select className="appearance-none w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-[16.5px] font-medium text-slate-700 outline-none cursor-pointer shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all hover:bg-slate-50">
            <option>สถานะ</option><option>รอดำเนินการ</option><option>อยู่ระหว่างดำเนินการ</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <span className="hidden md:block px-3 py-2 rounded-lg bg-gray-50 text-[16.5px] text-gray-500 whitespace-nowrap">
          12 พ.ค. 2569 - 19 พ.ค. 2569
        </span>
        <div className="flex-1" />
        <button 
          onClick={() => {
            if (selectedItems.size === 0) return;
            const selectedIds = Array.from(selectedItems).join(",");
            window.dispatchEvent(new CustomEvent("analyze-material", { detail: { materialId: `BATCH-${selectedIds}` } }));
          }}
          disabled={selectedItems.size === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[16.5px] font-bold shadow-md transition-all ${
            selectedItems.size > 0 
              ? "bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white shadow-red-500/20 cursor-pointer" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          <Sparkles size={14} />
          {selectedItems.size > 0 ? `AI Batch Optimization (${selectedItems.size} รายการ)` : "AI Batch Optimization (จัดการความเสี่ยงรวม)"}
        </button>
        <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 text-[16.5px] text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer border-none font-semibold">
          <SlidersHorizontal size={14} />
          ตัวกรองเพิ่มเติม
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-border">
                <th className="w-[40px] px-3 py-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={paged.length > 0 && selectedItems.size === paged.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </th>
                <th className="w-[36px] px-3 py-3 text-center text-[16.5px] font-bold text-text-muted uppercase tracking-wider">ลำดับ</th>
                <th className="px-3 py-3 text-left text-[16.5px] font-bold text-text-muted uppercase tracking-wider">รายการแจ้งเตือน</th>
                <th className="px-3 py-3 text-center text-[16.5px] font-bold text-text-muted uppercase tracking-wider">ระดับความเสี่ยง</th>
                <th className="px-3 py-3 text-center text-[16.5px] font-bold text-text-muted uppercase tracking-wider">Stock / Safety</th>
                <th className="px-3 py-3 text-center text-[16.5px] font-bold text-text-muted uppercase tracking-wider">Lead Time</th>
                <th className="px-3 py-3 text-right text-[16.5px] font-bold text-text-muted uppercase tracking-wider">มูลค่าความเสี่ยง (VaR)</th>
                <th className="px-3 py-3 text-center text-[16.5px] font-bold text-text-muted uppercase tracking-wider">แนวโน้ม</th>
                <th className="px-3 py-3 text-left text-[16.5px] font-bold text-text-muted uppercase tracking-wider">อัปเดตล่าสุด</th>
                <th className="px-3 py-3 text-center text-[16.5px] font-bold text-text-muted uppercase tracking-wider">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((alert, idx) => {
                const material = materials.find(m => m.id === alert.materialId);
                const rank = (page - 1) * perPage + idx + 1;
                const sev = severityConfig[alert.severity];
                const stockPct = material ? Math.round((material.currentStock / material.safetyStock) * 100) : 0;
                const isCritical = alert.severity === "critical";
                const ts = new Date(alert.timestamp);
                const dateStr = ts.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" });
                const timeStr = ts.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
                const ltMonths = material ? Math.ceil(material.leadTimeWeeks / 4) : 0;
                const allPlans = approvedPlans.filter(p => p.materialId === alert.materialId || p.materialId === alert.materialId.replace('MAT-', ''));
                const planData = allPlans.length > 0 ? allPlans[allPlans.length - 1] : undefined;
                const planUpdateCount = allPlans.length;

                return (
                  <React.Fragment key={alert.id}>
                    <tr 
                      className={`border-b border-border/60 transition-colors ${
                        planData 
                          ? "bg-emerald-50/60 hover:bg-emerald-100/50 cursor-pointer" 
                          : isCritical 
                            ? "bg-critical-50/30 hover:bg-gray-50/70" 
                            : "hover:bg-gray-50/70"
                      }`}
                      onClick={() => {
                        if (planData) {
                          setExpandedId(prev => prev === alert.id ? null : alert.id);
                        }
                      }}
                    >
                      <td className="px-3 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.has(alert.id)}
                          onChange={(e) => toggleSelect(alert.id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[16.5px] font-bold mx-auto
                          ${isCritical ? "bg-red-500 text-white" : alert.severity === "warning" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                          {rank}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-1 h-8 rounded-full ${isCritical ? "bg-critical-500" : alert.severity === "warning" ? "bg-warning-500" : "bg-info-500"}`} />
                          <div>
                            <div className="font-bold text-[16.5px] text-primary-700">{alert.materialId}</div>
                            <div className="text-[16.5px] text-text-muted">{alert.materialName}</div>
                            {material && <div className="text-[16.5px] text-text-muted/60">SAP: {material.sapCode} • {material.category}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[16.5px] font-bold"
                          style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                          <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: sev.color }} />
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {material && (
                          <div>
                            <span className="text-[16.5px] font-bold" style={{ color: stockPct < 50 ? "#DC2626" : "#0F172A" }}>
                              {material.currentStock.toLocaleString()} / {material.safetyStock.toLocaleString()}
                            </span>
                            <span className="text-[16.5px] text-text-muted ml-1">({stockPct}%)</span>
                            <div className="w-[50px] h-[3px] rounded-full bg-gray-100 mt-1 mx-auto overflow-hidden">
                              <div className="h-full rounded-full" style={{
                                width: `${Math.min(stockPct, 100)}%`,
                                background: stockPct < 30 ? "#DC2626" : stockPct < 60 ? "#F59E0B" : "#22C55E",
                              }} />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {material && (
                          <div>
                            <span className="text-[16.5px] font-bold">{material.leadTimeWeeks}</span>
                            <span className="text-[16.5px] text-text-muted ml-0.5">สัปดาห์</span>
                            <div className="text-[16.5px] text-text-muted">ประมาณ {ltMonths} เดือน</div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[19px] font-bold" style={{ color: isCritical ? "#DC2626" : "#0F172A" }}>
                          {formatCurrency(alert.costImpact)}
                        </span>
                        <div className="text-[16.5px] text-text-muted">ผลกระทบการขาดแคลน</div>
                      </td>
                      <td className="px-3 py-3">
                        {material && <Sparkline data={material.sparkline} color={sev.color} />}
                      </td>
                      <td className="px-3 py-3 text-left">
                        <div className="text-[16.5px] text-text-secondary leading-snug">
                          {dateStr}<br/>{timeStr} น.
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {(() => {
                          if (planData) {
                            return (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setExpandedId(prev => prev === alert.id ? null : alert.id);
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[16.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
                              >
                                <Sparkles size={16} /> มีแผนแล้ว {planUpdateCount > 1 ? `(อัปเดท ${planUpdateCount} ครั้ง)` : ''}
                                {expandedId === alert.id ? <ChevronDown size={14} className="ml-1" /> : <ChevronRight size={14} className="ml-1" />}
                              </button>
                            );
                          }
                          return (
                            <button type="button" className={`px-4 py-2 rounded-lg text-[16.5px] font-bold cursor-pointer transition-colors shadow-sm
                              ${isCritical
                                ? "text-white bg-critical-600 hover:bg-critical-700"
                                : alert.severity === "warning"
                                  ? "border border-warning-300 text-warning-700 hover:bg-warning-50"
                                  : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                              onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                window.dispatchEvent(new CustomEvent("analyze-material", { detail: { materialId: alert.materialId } }));
                              }}>
                              ให้ AI เข้าไปวิเคราะห์
                              <ChevronRight size={16} className="ml-1 inline-block" />
                            </button>
                          );
                        })()}
                      </td>
                    </tr>

                    {/* AI Recommendation inline for critical (only if no plan) */}
                    {isCritical && !planData && (
                      <tr className="bg-primary-50/30">
                        <td></td>
                        <td></td>
                        <td colSpan={8} className="px-3 py-3">
                          <div className="flex items-center gap-2 text-[16.5px] flex-wrap">
                            <Sparkles size={16} className="text-success-600 shrink-0" />
                            <span className="text-text-muted">คำแนะนำ AI:</span>
                            <span className="font-semibold text-text-primary">{alert.recommendation}</span>
                            <span className="text-primary-600 font-semibold cursor-pointer hover:underline ml-1"
                              onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                window.dispatchEvent(new CustomEvent("analyze-material", { detail: { materialId: alert.materialId } }));
                              }}>
                              ดูเหตุผลและการคำนวณ →
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Unified Expanded Detail Panel using Embedded EBiddingView */}
                    {expandedId === alert.id && (
                      <tr>
                        <td></td>
                        <td></td>
                        <td colSpan={8} className="px-3 py-2">
                          <div className="animate-fade-in shadow-lg rounded-2xl">
                            <EBiddingView 
                              targetMaterialId={alert.materialId} 
                              embedded={true} 
                              readonly={!!planData} 
                              approvedQty={planData?.qty}
                              approvedPlan={planData}
                              onClose={() => setExpandedId(null)} 
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-[16.5px] text-text-muted">
            แสดง {filteredAlerts.length > 0 ? (page - 1) * perPage + 1 : 0} - {Math.min(page * perPage, filteredAlerts.length)} จาก {filteredAlerts.length} รายการ
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-gray-50 disabled:opacity-30 cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-[16.5px] font-medium flex items-center justify-center cursor-pointer
                  ${p === page ? "bg-primary-600 text-white shadow-sm" : "border border-border text-text-muted hover:bg-gray-50"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-gray-50 disabled:opacity-30 cursor-pointer">
              <ChevronRight size={14} />
            </button>
            <span className="ml-3 text-[16.5px] text-text-muted">แสดงหน้าละ</span>
            <select className="ml-1 px-2 py-1 rounded-lg border border-border text-[16.5px] text-text-secondary cursor-pointer">
              <option>10</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
