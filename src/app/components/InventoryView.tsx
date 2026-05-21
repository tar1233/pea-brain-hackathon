"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Boxes, PackageSearch, ShieldAlert, Sparkles, FileText } from "lucide-react";
import { useData } from "../context/DataContext";

function formatCurrency(value: number) {
  if (value >= 1e9) return `฿${(value / 1e9).toFixed(2)} พันล้าน`;
  if (value >= 1e6) return `฿${(value / 1e6).toFixed(1)} ล้าน`;
  return `฿${value.toLocaleString()}`;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 shadow-[0_12px_30px_rgba(0,0,0,0.08)] text-xs font-medium">
        <p className="font-extrabold text-slate-800 mb-2">{payload[0].payload.name}</p>
        <div className="space-y-1.5">
          <p className="flex justify-between gap-6">
            <span className="text-slate-500">สต๊อกปัจจุบัน:</span>
            <span className="text-slate-800 font-bold">{payload[0].value.toLocaleString()} เครื่อง</span>
          </p>
          <p className="flex justify-between gap-6">
            <span className="text-slate-500">ระดับ Safety Stock:</span>
            <span className="text-slate-800 font-bold">{payload[1].value.toLocaleString()} เครื่อง</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomLegend = () => (
  <div className="flex justify-end gap-6 text-[10px] font-bold text-slate-500 mb-5 mr-2">
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded bg-gradient-to-b from-red-500 to-rose-600"></span>
      สต๊อกต่ำกว่าเกณฑ์ (Critical)
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded bg-gradient-to-b from-[#a80689] to-[#690455]"></span>
      สต๊อกปกติ (Adequate)
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded bg-gradient-to-b from-slate-300 to-slate-400"></span>
      ระดับ Safety Stock
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
        safety: material.safetyStock,
      })),
    []
  );

  const totalInventoryValue = materials.reduce((sum, material) => sum + material.currentStock * material.unitPrice, 0);
  const atRiskMaterials = materials.filter((material) => material.currentStock < material.safetyStock);
  const averageCoverage = Math.round(
    materials.reduce((sum, material) => sum + (material.currentStock / material.safetyStock) * 100, 0) / materials.length
  );

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-md">
              <Boxes size={14} />
              Stock Planning Workspace
            </div>
            <h1 className="mt-4 text-[24px] font-bold tracking-tight text-white">
              วางแผนเติมสต็อกและจัดลำดับรายการเสี่ยง
            </h1>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-300 font-medium">
              หน้านี้รวมทั้งมุมมอง stock versus safety stock และรายละเอียดวัสดุที่ทีม planning
              ต้องใช้เพื่อตัดสินใจเติมสต็อกหรือเลื่อนรอบสั่งซื้อ
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Inventory Value", value: formatCurrency(totalInventoryValue), bg: "bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] border-[#8b5cf6]/20 shadow-[0_15px_35px_rgba(139,92,246,0.1)]", valueColor: "text-white", labelColor: "text-purple-100/90" },
              { label: "At Risk SKU", value: `${atRiskMaterials.length} รายการ`, bg: "bg-gradient-to-br from-[#4e091b] via-[#750e26] to-[#b91c1c] border-rose-500/20 shadow-[0_15px_35px_rgba(185,28,28,0.1)]", valueColor: "text-white", labelColor: "text-red-100/90" },
              { label: "Average Coverage", value: `${averageCoverage}%`, bg: "bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#059669] border-emerald-500/20 shadow-[0_15px_35px_rgba(16,185,129,0.1)]", valueColor: "text-white", labelColor: "text-emerald-100/90" },
            ].map((item) => (
              <div key={item.label} className={`rounded-[20px] border p-4.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.bg}`}>
                <div className={`text-[10px] font-bold uppercase tracking-[0.14em] ${item.labelColor}`}>{item.label}</div>
                <div className={`mt-2 text-[18px] font-bold tracking-tight ${item.valueColor}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-l-4 border-purple-500 pl-3">
            <PackageSearch size={16} className="text-primary-600" />
            <h2 className="text-[14px] font-bold text-slate-900">Stock vs Safety Stock</h2>
          </div>
          <p className="mt-2 text-[12px] text-slate-500 font-medium">
            เปรียบเทียบระดับ stock ปัจจุบันกับ safety stock เพื่อหาจุดที่ต้องเติมของทันที
          </p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#be123c" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a80689" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#70045b" stopOpacity={1}/>
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
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.04)' }} />
                <Legend verticalAlign="top" content={renderCustomLegend} />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]} maxBarSize={24}>
                  {stockChart.map((item) => (
                    <Cell key={item.name} fill={item.stock < item.safety ? "url(#colorCritical)" : "url(#colorNormal)"} />
                  ))}
                </Bar>
                <Bar dataKey="safety" fill="url(#colorSafety)" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
            <ShieldAlert size={16} className="text-red-600" />
            <h2 className="text-[14px] font-bold text-slate-900">รายการที่ต้องตามใกล้ชิด</h2>
          </div>
          <div className="mt-4 space-y-2.5">
            {atRiskMaterials.map((material) => {
              const gap = material.safetyStock - material.currentStock;
              const coverage = Math.round((material.currentStock / material.safetyStock) * 100);
              return (
                <div key={material.id} className="rounded-[16px] border border-red-100 bg-red-50/60 p-3">
                  <div className="flex flex-col gap-1.5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-[13px] font-bold text-slate-900">{material.id}</div>
                      <div className="text-[11px] font-medium text-slate-500">{material.name}</div>
                    </div>
                    <div className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      Coverage {coverage}%
                    </div>
                  </div>
                  <div className="mt-2 grid gap-2 text-[11px] text-slate-600 md:grid-cols-3">
                    <div>Gap: {gap.toLocaleString()}</div>
                    <div>LT: {material.leadTimeWeeks} สัปดาห์</div>
                    <div>ROP: {material.reorderPoint.toLocaleString()}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-end border-t border-red-200/40 pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("create-po", { 
                          detail: { 
                            materialId: material.id, 
                            qty: gap, 
                            name: material.name,
                            price: material.unitPrice 
                          } 
                        }));
                      }}
                      className="px-2 py-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg text-[9px] font-bold cursor-pointer transition shadow-sm"
                    >
                      สั่งซื้อเร่งด่วน (Urgent PO)
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
            <h2 className="text-[14px] font-bold text-slate-900 border-l-4 border-blue-500 pl-3">Material Drilldown</h2>
            <p className="mt-1 text-[12px] text-slate-500 pl-3 font-medium">ค้นหารายการเพื่อดู stock, demand และมูลค่าคงคลังของแต่ละวัสดุ</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหา material id, SAP หรือชื่อรายการ..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-300 md:max-w-sm"
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 text-[11px] uppercase tracking-[0.14em] text-slate-400">
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
                    <tr className={`border-b border-slate-100 text-sm text-slate-700 ${index % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                      <td className="px-3 py-4">
                        <div className="font-bold text-slate-900">{material.id}</div>
                        <div className="mt-1 text-xs text-slate-500">{material.name}</div>
                      </td>
                      <td className="px-3 py-4">{material.currentStock.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">{material.safetyStock.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">{material.avgMonthlyDemand.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">{material.eoq.toLocaleString()} {material.unit}</td>
                      <td className="px-3 py-4">
                        <div className="font-semibold text-slate-900">{formatCurrency(material.currentStock * material.unitPrice)}</div>
                        <div className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${coverage < 100 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                          Coverage {coverage}%
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : material.id)}
                          className={`px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm ${isExpanded ? 'bg-slate-100 ring-2 ring-slate-200' : 'hover:bg-slate-50'}`}
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
                              <h4 className="text-[13px] font-bold text-gray-900">รายละเอียด {material.id} — {material.name}</h4>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">สต๊อกปัจจุบัน</div>
                                <div className="text-[14px] font-bold text-gray-900 mt-1">{material.currentStock.toLocaleString()} {material.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Safety Stock</div>
                                <div className="text-[14px] font-bold text-gray-900 mt-1">{material.safetyStock.toLocaleString()} {material.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">EOQ ที่แนะนำ</div>
                                <div className="text-[14px] font-bold text-purple-700 mt-1">{material.eoq.toLocaleString()} {material.unit}</div>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">ราคาต่อหน่วย</div>
                                <div className="text-[14px] font-bold text-gray-900 mt-1">{formatCurrency(material.unitPrice)}</div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4 flex gap-3 items-start">
                              <div className="text-[12px] text-gray-600">
                                <span className="font-bold text-gray-900 flex items-center gap-1.5 mb-1"><FileText size={14} className="text-amber-600"/> สถานะ</span>
                                สต๊อก {material.currentStock.toLocaleString()} {material.unit} {material.currentStock < material.safetyStock ? `ต่ำกว่า Safety Stock ${material.safetyStock.toLocaleString()} ${material.unit} (${Math.round((material.safetyStock - material.currentStock)/material.safetyStock*100)}% ต่ำกว่าเกณฑ์)` : 'อยู่ในระดับปกติ'}
                              </div>
                            </div>
                            
                            {material.currentStock < material.safetyStock && (
                              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 mb-4">
                                <div className="flex items-center gap-1.5 mb-2 font-bold text-amber-700 text-[12px]">
                                  <Sparkles size={14} className="text-amber-500" />
                                  คำแนะนำ AI Copilot
                                </div>
                                <div className="text-[12px] text-gray-700">
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
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold transition-colors cursor-pointer shadow-sm"
                              >
                                สร้างใบสั่งซื้อ (PO)
                              </button>
                              <button
                                type="button"
                                onClick={() => setExpandedId(null)}
                                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[12px] font-bold transition-colors cursor-pointer"
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
