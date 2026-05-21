"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Boxes, PackageSearch, ShieldAlert } from "lucide-react";
import { materials } from "../data/mockData";

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
  const [search, setSearch] = useState("");
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
      <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#fffbf2_0%,#ffffff_45%,#eff6ff_100%)] p-6 shadow-[0_15px_30px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800 shadow-sm">
              <Boxes size={14} />
              Stock Planning Workspace
            </div>
            <h1 className="mt-4 text-[20px] font-bold tracking-tight text-slate-900">
              วางแผนเติมสต็อกและจัดลำดับรายการเสี่ยง
            </h1>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-600 font-medium">
              หน้านี้รวมทั้งมุมมอง stock versus safety stock และรายละเอียดวัสดุที่ทีม planning
              ต้องใช้เพื่อตัดสินใจเติมสต็อกหรือเลื่อนรอบสั่งซื้อ
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Inventory Value", value: formatCurrency(totalInventoryValue), bg: "bg-gradient-to-br from-purple-50/60 to-fuchsia-50/60 border-purple-100", valueColor: "text-purple-800" },
              { label: "At Risk SKU", value: `${atRiskMaterials.length} รายการ`, bg: "bg-gradient-to-br from-red-50/60 to-rose-50/60 border-red-100", valueColor: "text-red-800" },
              { label: "Average Coverage", value: `${averageCoverage}%`, bg: "bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-100", valueColor: "text-emerald-800" },
            ].map((item) => (
              <div key={item.label} className={`rounded-[20px] border p-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] backdrop-blur-sm ${item.bg}`}>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</div>
                <div className={`mt-2 text-[18px] font-bold ${item.valueColor}`}>{item.value}</div>
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
          <div className="mt-6 h-[340px]">
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
                <Bar dataKey="stock" radius={[6, 6, 0, 0]} maxBarSize={30}>
                  {stockChart.map((item) => (
                    <Cell key={item.name} fill={item.stock < item.safety ? "url(#colorCritical)" : "url(#colorNormal)"} />
                  ))}
                </Bar>
                <Bar dataKey="safety" fill="url(#colorSafety)" radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
            <ShieldAlert size={16} className="text-red-600" />
            <h2 className="text-[14px] font-bold text-slate-900">รายการที่ต้องตามใกล้ชิด</h2>
          </div>
          <div className="mt-5 space-y-3">
            {atRiskMaterials.map((material) => {
              const gap = material.safetyStock - material.currentStock;
              const coverage = Math.round((material.currentStock / material.safetyStock) * 100);
              return (
                <div key={material.id} className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{material.id}</div>
                      <div className="mt-1 text-sm text-slate-600">{material.name}</div>
                    </div>
                    <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      Coverage {coverage}%
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                    <div>Gap ถึง safety: {gap.toLocaleString()} {material.unit}</div>
                    <div>Lead time: {material.leadTimeWeeks} สัปดาห์</div>
                    <div>ROP: {material.reorderPoint.toLocaleString()} {material.unit}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-end border-t border-red-200/40 pt-2.5">
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
                      className="px-2.5 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
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
                return (
                  <tr key={material.id} className={`border-b border-slate-100 text-sm text-slate-700 ${index % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
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
                        onClick={() => window.dispatchEvent(new CustomEvent("show-alert", {
                          detail: {
                            title: `รายละเอียดพัสดุ ${material.id}`,
                            content: `📦 ชื่อพัสดุ: ${material.name}\n\n• สต๊อกคงเหลือ: ${material.currentStock.toLocaleString()} ${material.unit}\n• จุดสั่งซื้อใหม่ (ROP): ${material.reorderPoint.toLocaleString()} ${material.unit}\n• ปริมาณสั่งซื้อที่เหมาะสม (EOQ): ${material.eoq.toLocaleString()} ${material.unit}\n• มูลค่าคงคลัง: ${formatCurrency(material.currentStock * material.unitPrice)}`,
                            type: "info"
                          }
                        }))}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
