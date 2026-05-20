"use client";

import React, { useState } from "react";
import {
  Search, ChevronLeft, ChevronRight,
  SlidersHorizontal, Sparkles
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { riskAlerts, materials } from "../data/mockData";
import type { RiskLevel } from "../data/mockData";

const severityConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: "วิกฤต", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  warning: { label: "เฝ้าระวัง", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  info: { label: "ข้อมูล", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
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

export default function AlertTable() {
  const [filter, setFilter] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const perPage = 5;

  const filteredAlerts = riskAlerts
    .filter(a => filter === "all" || a.severity === filter)
    .filter(a => !searchQ || a.materialName.toLowerCase().includes(searchQ.toLowerCase()) || a.materialId.toLowerCase().includes(searchQ.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / perPage));
  const paged = filteredAlerts.slice((page - 1) * perPage, page * perPage);

  const tabs = [
    { key: "all", label: "ทั้งหมด", count: riskAlerts.length },
    { key: "critical", label: "วิกฤต", count: riskAlerts.filter(a => a.severity === "critical").length, dot: "#DC2626" },
    { key: "warning", label: "เฝ้าระวัง", count: riskAlerts.filter(a => a.severity === "warning").length, dot: "#D97706" },
    { key: "info", label: "ข้อมูล", count: riskAlerts.filter(a => a.severity === "info").length, dot: "#2563EB" },
  ];

  return (
    <div className="space-y-3 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
      {/* Filter Tabs Row */}
      <div className="flex items-center gap-1 px-1">
        {tabs.map(tab => (
          <button key={tab.key}
            onClick={() => { setFilter(tab.key); setPage(1); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-[12px] font-medium transition-all cursor-pointer
              ${filter === tab.key
                ? "bg-white text-primary-700 border border-border border-b-white font-semibold shadow-sm -mb-px z-10"
                : "text-text-secondary hover:text-text-primary hover:bg-white/50 border border-transparent"}`}>
            {tab.dot && <span className="w-2 h-2 rounded-full" style={{ background: tab.dot }} />}
            {tab.label} <span className={`${filter === tab.key ? "bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold" : "text-text-muted"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filter Controls Row */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }}
            placeholder="ค้นหาชื่อพัสดุ รหัส หรือคำอธิบาย..."
            className="w-[220px] pl-8 pr-3 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-700 outline-none focus:ring-2 focus:ring-purple-100 transition-all border-none" />
        </div>
        <select className="px-3 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-600 outline-none cursor-pointer border-none">
          <option>หมวดพัสดุ</option><option>หม้อแปลงไฟฟ้า</option><option>อุปกรณ์ป้องกัน</option><option>อุปกรณ์วัด</option>
        </select>
        <select className="px-3 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-600 outline-none cursor-pointer border-none">
          <option>ระดับความเสี่ยง</option><option>วิกฤต</option><option>เฝ้าระวัง</option><option>ข้อมูล</option>
        </select>
        <select className="px-3 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-600 outline-none cursor-pointer border-none">
          <option>สถานะ</option><option>รอดำเนินการ</option><option>อยู่ระหว่างดำเนินการ</option>
        </select>
        <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-[11px] text-gray-500 whitespace-nowrap">
          12 พ.ค. 2569 - 19 พ.ค. 2569
        </span>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer border-none font-semibold">
          <SlidersHorizontal size={13} />
          ตัวกรองเพิ่มเติม
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-border">
                <th className="w-[36px] px-3 py-2.5 text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">ลำดับ</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">รายการแจ้งเตือน</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">ระดับความเสี่ยง</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">Stock / Safety</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">Lead Time</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-text-muted uppercase tracking-wider">มูลค่าความเสี่ยง (VaR)</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">แนวโน้ม</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider">อัปเดตล่าสุด</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-text-muted uppercase tracking-wider">การดำเนินการ</th>
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

                return (
                  <React.Fragment key={alert.id}>
                    <tr className={`border-b border-border/60 hover:bg-gray-50/70 transition-colors ${isCritical ? "bg-critical-50/30" : ""}`}>
                      <td className="px-3 py-3 text-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mx-auto
                          ${isCritical ? "bg-red-500 text-white" : alert.severity === "warning" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                          {rank}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-1 h-8 rounded-full ${isCritical ? "bg-critical-500" : alert.severity === "warning" ? "bg-warning-500" : "bg-info-500"}`} />
                          <div>
                            <div className="font-bold text-[13px] text-primary-700">{alert.materialId}</div>
                            <div className="text-[11px] text-text-muted">{alert.materialName}</div>
                            {material && <div className="text-[10px] text-text-muted/60">SAP: {material.sapCode} • {material.category}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: sev.color }} />
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {material && (
                          <div>
                            <span className="text-[13px] font-bold" style={{ color: stockPct < 50 ? "#DC2626" : "#0F172A" }}>
                              {material.currentStock.toLocaleString()} / {material.safetyStock.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-text-muted ml-1">({stockPct}%)</span>
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
                            <span className="text-[13px] font-bold">{material.leadTimeWeeks}</span>
                            <span className="text-[10px] text-text-muted ml-0.5">สัปดาห์</span>
                            <div className="text-[9px] text-text-muted">ประมาณ {ltMonths} เดือน</div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[14px] font-bold" style={{ color: isCritical ? "#DC2626" : "#0F172A" }}>
                          {formatCurrency(alert.costImpact)}
                        </span>
                        <div className="text-[9px] text-text-muted">ผลกระทบการขาดแคลน</div>
                      </td>
                      <td className="px-3 py-3">
                        {material && <Sparkline data={material.sparkline} color={sev.color} />}
                      </td>
                      <td className="px-3 py-3 text-left">
                        <div className="text-[11px] text-text-secondary leading-snug">
                          {dateStr}<br/>{timeStr} น.
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button type="button" className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm
                          ${isCritical
                            ? "text-white bg-critical-600 hover:bg-critical-700"
                            : alert.severity === "warning"
                              ? "border border-warning-300 text-warning-700 hover:bg-warning-50"
                              : "border border-primary-200 text-primary-700 hover:bg-primary-50"
                          } ${expandedId === alert.id ? 'ring-2 ring-offset-1 ring-purple-300' : ''}`}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedId(expandedId === alert.id ? null : alert.id); }}>
                          {expandedId === alert.id ? 'ซ่อน' : 'ดูรายละเอียด'}
                        </button>
                      </td>
                    </tr>

                    {/* AI Recommendation inline for critical */}
                    {isCritical && (
                      <tr className="bg-primary-50/30">
                        <td></td>
                        <td colSpan={8} className="px-3 py-2">
                          <div className="flex items-center gap-2 text-[11px] flex-wrap">
                            <Sparkles size={12} className="text-success-600 shrink-0" />
                            <span className="text-text-muted">คำแนะนำ AI:</span>
                            <span className="font-semibold text-text-primary">{alert.recommendation}</span>
                            <span className="text-primary-600 font-semibold cursor-pointer hover:underline ml-1"
                              onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}>
                              ดูเหตุผลและการคำนวณ →
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Expanded Detail Panel */}
                    {expandedId === alert.id && (
                      <tr>
                        <td></td>
                        <td colSpan={8} className="px-3 py-0">
                          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5 mb-3 mt-1 animate-fade-in">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Sparkles size={14} className="text-purple-600" />
                              </div>
                              <h4 className="text-[13px] font-bold text-gray-900">รายละเอียด {alert.materialId} — {alert.materialName}</h4>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">สต๊อกปัจจุบัน</div>
                                <div className="text-[14px] font-bold text-gray-900 mt-1">{material?.currentStock.toLocaleString() ?? '-'} {material?.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Safety Stock</div>
                                <div className="text-[14px] font-bold text-gray-900 mt-1">{material?.safetyStock.toLocaleString() ?? '-'} {material?.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">EOQ ที่แนะนำ</div>
                                <div className="text-[14px] font-bold text-purple-700 mt-1">{material?.eoq.toLocaleString() ?? '-'} {material?.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">ราคาต่อหน่วย</div>
                                <div className="text-[14px] font-bold text-gray-900 mt-1">{material ? formatCurrency(material.unitPrice) : '-'}</div>
                              </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
                              <div className="text-[11px] font-bold text-gray-700 mb-2">📋 สาเหตุ</div>
                              <div className="text-[12px] text-gray-600 leading-relaxed">{alert.message}</div>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-4">
                              <div className="text-[11px] font-bold text-amber-700 mb-2">🤖 คำแนะนำ AI Copilot</div>
                              <div className="text-[12px] text-gray-700 leading-relaxed">{alert.recommendation}</div>
                              <div className="mt-2 text-[11px] text-gray-500">Confidence: <span className="font-bold text-emerald-600">{alert.confidence}%</span></div>
                            </div>

                            <div className="flex items-center gap-3">
                              {isCritical && (
                                <button type="button" className="px-4 py-2 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-sm transition-all cursor-pointer"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert(`✅ สร้าง PO สำหรับ ${alert.materialId} เรียบร้อย (Demo)`); }}>สร้างใบสั่งซื้อ (PO)</button>
                              )}
                              <button type="button" className="px-4 py-2 rounded-xl text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedId(null); }}>ปิดรายละเอียด</button>
                            </div>
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
          <span className="text-[12px] text-text-muted">
            แสดง {filteredAlerts.length > 0 ? (page - 1) * perPage + 1 : 0} - {Math.min(page * perPage, filteredAlerts.length)} จาก {filteredAlerts.length} รายการ
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-gray-50 disabled:opacity-30 cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-[12px] font-medium flex items-center justify-center cursor-pointer
                  ${p === page ? "bg-primary-600 text-white shadow-sm" : "border border-border text-text-muted hover:bg-gray-50"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-gray-50 disabled:opacity-30 cursor-pointer">
              <ChevronRight size={14} />
            </button>
            <span className="ml-3 text-[11px] text-text-muted">แสดงหน้าละ</span>
            <select className="ml-1 px-2 py-1 rounded-lg border border-border text-[11px] text-text-secondary cursor-pointer">
              <option>10</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
