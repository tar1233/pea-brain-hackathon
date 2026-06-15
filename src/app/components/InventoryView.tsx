"use client";

import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Boxes, PackageSearch, ShieldAlert, Sparkles, FileText, Brain } from "lucide-react";
import { useData } from "../context/DataContext";

function formatCurrency(value: number) {
  if (value >= 1e9) return `฿${(value / 1e9).toFixed(2)} พันล้าน`;
  if (value >= 1e6) return `฿${(value / 1e6).toFixed(1)} ล้าน`;
  return `฿${value.toLocaleString()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 shadow-[0_12px_30px_rgba(0,0,0,0.08)] text-[16.5px] font-medium">
        <p className="font-extrabold text-slate-800 mb-2">{payload[0].payload.name}</p>
        <div className="space-y-1.5">
          <p className="flex justify-between gap-6">
            <span className="text-slate-500">สต๊อกปัจจุบัน:</span>
            <span className="text-slate-800 font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="flex justify-between gap-6">
            <span className="text-purple-600">AI Forecast (3M):</span>
            <span className="text-purple-700 font-bold">{payload[1].value.toLocaleString()}</span>
          </p>
          <p className="flex justify-between gap-6">
            <span className="text-slate-500">Safety Stock:</span>
            <span className="text-slate-800 font-bold">{payload[2].value.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomLegend = () => (
  <div className="flex justify-end gap-6 text-[16.5px] font-bold text-slate-500 mb-5 mr-2">
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded bg-gradient-to-b from-blue-500 to-blue-600"></span>
      สต๊อกปัจจุบัน
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded bg-gradient-to-b from-purple-400 to-purple-600"></span>
      AI คาดการณ์ (3 เดือน)
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded bg-gradient-to-b from-slate-300 to-slate-400"></span>
      Safety Stock
    </span>
  </div>
);

export default function InventoryView() {
  const { materials } = useData();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filteredMaterials = useMemo(
    () =>
      materials.filter(
        (material) =>
          material.name.toLowerCase().includes(search.toLowerCase()) ||
          material.id.toLowerCase().includes(search.toLowerCase()) ||
          material.sapCode.includes(search)
      ),
    [search]
  );

  const stockChart = useMemo(
    () =>
      materials.map((material) => ({
        name: material.id,
        stock: material.currentStock,
        forecast: Math.max(0, material.currentStock - (material.avgMonthlyDemand * 3)),
        safety: material.safetyStock,
      })),
    []
  );

  const totalInventoryValue = materials.reduce((sum, material) => sum + material.currentStock * material.unitPrice, 0);
  const atRiskMaterials = materials.filter((material) => material.currentStock < material.safetyStock);
  const averageCoverage = Math.round(
    materials.reduce((sum, material) => sum + (material.currentStock / material.safetyStock) * 100, 0) / (materials.length || 1)
  );

  return (
    <div className="space-y-5">


      <section className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-l-4 border-purple-500 pl-3">
            <Sparkles size={16} className="text-purple-600" />
            <h2 className="text-[16.5px] font-bold text-slate-900">AI Stock Forecast (3 Months)</h2>
          </div>
          <p className="mt-2 text-[16.5px] text-slate-500 font-medium">
            AI จำลองสถานการณ์สต๊อกล่วงหน้า 3 เดือน หากไม่มีการรับของเข้า เพื่อช่วยวางแผนรับมือ
          </p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#9333ea" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  interval={0} 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip  contentStyle={{ fontSize: '13.5px' }} content={<CustomTooltip  />} cursor={{ fill: 'rgba(148,163,184,0.04)' }} />
                <Legend verticalAlign="top" content={renderCustomLegend} />
                <Bar dataKey="stock" fill="url(#colorStock)" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="forecast" fill="url(#colorForecast)" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="safety" fill="url(#colorSafety)" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
            <Brain size={16} className="text-red-600" />
            <h2 className="text-[16.5px] font-bold text-slate-900">⚠️ AI Alert: ความเสี่ยงสต๊อกขาด</h2>
          </div>
          <div className="mt-4 space-y-2.5">
            {atRiskMaterials.map((material) => {
              const gap = material.safetyStock - material.currentStock;
              const coverage = Math.round((material.currentStock / material.safetyStock) * 100);
              return (
                <div key={material.id} className="rounded-[16px] border border-red-100 bg-red-50/60 p-3">
                  <div className="flex flex-col gap-1.5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-[16.5px] font-bold text-slate-900">{material.id}</div>
                      <div className="text-[16.5px] font-medium text-slate-500">{material.name}</div>
                    </div>
                    <div className="rounded-full bg-red-500 px-2 py-0.5 text-[16.5px] font-bold text-white shadow-sm">
                      Coverage {coverage}%
                    </div>
                  </div>
                  <div className="mt-2 grid gap-2 text-[16.5px] text-slate-600 md:grid-cols-3">
                    <div>Gap: {gap.toLocaleString()}</div>
                    <div>LT: {material.leadTimeWeeks} สัปดาห์</div>
                    <div>ROP: {material.reorderPoint.toLocaleString()}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-red-200/40 pt-2">
                    <div className="flex-1 mr-2 text-[16.5px] text-red-800/80 leading-tight">
                      💡 แนะนำให้ AI วิเคราะห์แผนรับมือ
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("analyze-material", { 
                          detail: { materialId: material.id } 
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[16.5px] font-bold cursor-pointer transition shadow-sm whitespace-nowrap"
                    >
                      <Sparkles size={14} className="text-blue-300" /> ให้ AI วางแผน
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[16.5px] font-bold text-slate-900 border-l-4 border-blue-500 pl-3">Material Drilldown</h2>
            <p className="mt-1 text-[16.5px] text-slate-500 pl-3 font-medium">ค้นหารายการเพื่อดู stock, demand และมูลค่าคงคลังของแต่ละวัสดุ</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหา material id, SAP หรือชื่อรายการ..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[16.5px] outline-none transition-colors focus:border-primary-300 md:max-w-sm"
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 text-[16.5px] uppercase tracking-[0.14em] text-slate-400">
              <tr>
                <th className="px-3 py-3">Material</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Safety</th>
                <th className="px-3 py-3">Monthly Demand</th>
                <th className="px-3 py-3">EOQ</th>
                <th className="px-3 py-3">Inventory Value</th>
                <th className="px-3 py-3 text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material, index) => {
                const coverage = Math.round((material.currentStock / material.safetyStock) * 100);
                const isExpanded = expandedId === material.id;
                return (
                  <React.Fragment key={material.id}>
                    <tr className={`border-b border-slate-100 text-[16.5px] text-slate-700 ${index % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                      <td className="px-3 py-4">
                        <div className="font-bold text-slate-900">{material.id}</div>
                        <div className="mt-1 text-[16.5px] text-slate-500">{material.name}</div>
                      </td>
                      <td className="px-3 py-4">{material.currentStock.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">{material.safetyStock.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">{material.avgMonthlyDemand.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">{material.eoq.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">
                        <div className="font-semibold text-slate-900">{formatCurrency(material.currentStock * material.unitPrice)}</div>
                        <div className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[16.5px] font-semibold ${coverage < 100 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                          Coverage {coverage}%
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : material.id)}
                          className={`px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-[16.5px] font-bold cursor-pointer transition shadow-sm ${isExpanded ? 'bg-slate-100 ring-2 ring-slate-200' : 'hover:bg-slate-50'}`}
                        >
                          {isExpanded ? 'ซ่อน' : 'ดูรายละเอียด'}
                        </button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-3 py-0">
                          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5 mb-4 mt-2 animate-fade-in shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Sparkles size={14} className="text-purple-600" />
                              </div>
                              <h4 className="text-[16.5px] font-bold text-gray-900">รายละเอียด {material.id} — {material.name}</h4>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[16.5px] text-gray-400 uppercase tracking-wider">สต๊อกปัจจุบัน</div>
                                <div className="text-[16.5px] font-bold text-gray-900 mt-1">{material.currentStock.toLocaleString()} {material.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[16.5px] text-gray-400 uppercase tracking-wider">Safety Stock</div>
                                <div className="text-[16.5px] font-bold text-gray-900 mt-1">{material.safetyStock.toLocaleString()} {material.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[16.5px] text-gray-400 uppercase tracking-wider">EOQ ที่แนะนำ</div>
                                <div className="text-[16.5px] font-bold text-purple-700 mt-1">{material.eoq.toLocaleString()} {material.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[16.5px] text-gray-400 uppercase tracking-wider">ราคาต่อหน่วย</div>
                                <div className="text-[16.5px] font-bold text-gray-900 mt-1">{formatCurrency(material.unitPrice)}</div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4 flex gap-3 items-start">
                              <div className="text-[16.5px] text-gray-600">
                                <span className="font-bold text-gray-900 flex items-center gap-1.5 mb-1"><FileText size={14} className="text-amber-600"/> สถานะ</span>
                                สต๊อก {material.currentStock.toLocaleString()} {material.unit} {material.currentStock < material.safetyStock ? `ต่ำกว่า Safety Stock ${material.safetyStock.toLocaleString()} ${material.unit} (${Math.round((material.safetyStock - material.currentStock)/material.safetyStock*100)}% ต่ำกว่าเกณฑ์)` : 'อยู่ในระดับปกติ'}
                              </div>
                            </div>
                            
                            {material.currentStock < material.safetyStock && (
                              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 mb-4">
                                <div className="flex items-center gap-1.5 mb-2 font-bold text-amber-700 text-[16.5px]">
                                  <Sparkles size={14} className="text-amber-500" />
                                  คำแนะนำ AI Copilot
                                </div>
                                <div className="text-[16.5px] text-gray-700">
                                  สั่งซื้อเร่งด่วน {material.eoq.toLocaleString()} {material.unit} (EOQ-based) เพื่อเติม Safety Stock มูลค่าประมาณ {formatCurrency(material.eoq * material.unitPrice)}
                                  <div className="mt-2 text-emerald-600 font-bold">Confidence: 92%</div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  window.dispatchEvent(new CustomEvent("create-po", { 
                                    detail: { 
                                      materialId: material.id, 
                                      qty: material.eoq, 
                                      name: material.name,
                                      price: material.unitPrice 
                                    } 
                                  }));
                                }}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[16.5px] font-bold transition-colors cursor-pointer shadow-sm"
                              >
                                สร้างใบสั่งซื้อ (PO)
                              </button>
                              <button
                                type="button"
                                onClick={() => setExpandedId(null)}
                                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[16.5px] font-bold transition-colors cursor-pointer"
                              >
                                ปิดรายละเอียด
                              </button>
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
      </section>
    </div>
  );
}
