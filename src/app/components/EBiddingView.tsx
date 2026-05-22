"use client";

import React, { useState } from "react";
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Clock, PlayCircle, ShieldAlert } from "lucide-react";
import { useData } from "../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString()}`;
}

export default function EBiddingView({ targetMaterialId = "10067", setActiveTab, onClose }: { targetMaterialId?: string, setActiveTab?: (tab: string) => void, onClose?: () => void }) {
  const { eBiddingData, materials } = useData();

  if (!eBiddingData) return null;

  const { targetMaterial, totalRequirement, simulation } = eBiddingData;

  const renderTimelineIcon = (id: number) => {
    return <CheckCircle2 className="text-emerald-500" size={24} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <section className="rounded-[32px] border border-blue-500/10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-8 py-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold tracking-widest text-blue-200 uppercase">
              <Brain size={14} />
              e-Bidding AI Optimizer
            </div>
            <h1 className="max-w-4xl text-[24px] font-bold leading-tight tracking-tight">
              AI Strategy & Action Plan: {targetMaterialId}
            </h1>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-blue-100/80 font-medium">
              แผนยุทธศาสตร์จัดซื้อฉบับสมบูรณ์ วิเคราะห์โดย Multi-Agent AI (Demand Forecasting, Price Trend Analysis, และ Supplier Risk Management) พร้อมให้คุณพิจารณาอนุมัติ
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <div className="text-[12px] text-blue-200 font-medium uppercase tracking-wider mb-1">เป้าหมายจัดซื้อ (Target Requirement)</div>
            <div className="text-[36px] font-black text-white">{totalRequirement.toLocaleString()} <span className="text-[16px] font-normal text-blue-200">เครื่อง</span></div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Price Trend & Strategy */}
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">AI Price Benchmarking</h2>
                <p className="text-[12px] text-slate-500 mt-1">วิเคราะห์พยากรณ์ราคาวัสดุเพื่อกำหนดจังหวะเปิดประมูล</p>
                <div className="mt-2 text-[10px] text-slate-400 font-medium">
                  <span className="font-semibold text-slate-500">แหล่งข้อมูล (Data Sources):</span> 1. ประวัติใบสั่งซื้อ PEA (SAP) 2. ดัชนีราคาโลหะโลก (LME) 3. ราคากลางกระทรวงพาณิชย์
                </div>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 border border-emerald-100">
                <TrendingDown size={14} /> ราคาตลาดมีแนวโน้มลดลง
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulation.priceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `฿${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any) => [
                      formatCurrency(Number(value) || 0), 
                      name === 'price' ? "ปีปัจจุบัน (Forecast)" : "ปีก่อนหน้า (Historical)"
                    ]}
                  />
                  <ReferenceLine x="May" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="lastYearPrice" 
                    stroke="#94a3b8" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#94a3b8' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-xl bg-indigo-50/50 p-4 border border-indigo-100">
              <h3 className="text-[13px] font-bold text-indigo-900 mb-2">💡 คำแนะนำจาก Bidding Agent:</h3>
              <p className="text-[12px] text-indigo-700/80 leading-relaxed font-medium">
                "เทรนด์ราคาเหล็กในตลาดโลกกำลังลดลง คาดการณ์ว่าราคาหม้อแปลงจะลดลงอีก 3-5% ใน Q4 
                แนะนำให้เปิดประกวดราคารอบแรกที่ 800 เครื่อง (ครอบคลุม Demand ปัจจุบัน) และรอดูสถานการณ์ก่อนเปิดประมูลรอบเสริม"
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: Supplier Uncertainty Simulation */}
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">AI Action Plan (แผนการดำเนินการ)</h2>
                <p className="text-[12px] text-slate-500 mt-1">สรุปการตัดสินใจและแผนสำรองแบบ End-to-End</p>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
              
              <div className="space-y-8 relative">
                {simulation.steps.map((step: any) => {
                  return (
                    <div key={step.id} className="relative flex gap-4 transition-all duration-500 opacity-100 scale-100">
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                        {renderTimelineIcon(step.id)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="rounded-2xl border p-4 border-slate-100 bg-white shadow-sm">
                          <h3 className="text-[14px] font-bold text-slate-900">
                            Step {step.id}: {step.title}
                          </h3>
                          <p className="mt-2 text-[12px] text-slate-600 leading-relaxed">
                            {step.detail}
                          </p>
                          
                          <div className="mt-4 rounded-xl p-3 bg-purple-50 text-purple-900 border border-purple-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Brain size={14} className="text-purple-600" />
                              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">AI Recommendation</span>
                            </div>
                            <p className="text-[12px] leading-relaxed font-semibold text-purple-800">
                              {step.aiAction}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Approve Action */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 font-medium">
                อนุมัติแผนนี้เพื่อสร้างเอกสารสั่งซื้อ (PO) อัตโนมัติและส่งเข้า Workflow ทันที
              </div>
              <button 
                onClick={() => {
                  const material = materials.find(m => m.id === targetMaterialId);
                  window.dispatchEvent(new CustomEvent("create-po", { 
                    detail: { 
                      materialId: targetMaterialId, 
                      qty: material?.eoq || totalRequirement, 
                      name: targetMaterial,
                      price: material?.unitPrice 
                    } 
                  }));
                  // Optional: switch to activity tab after a delay to see tracking
                  if (onClose) onClose();
                  setTimeout(() => {
                    setActiveTab?.("activity");
                  }, 500);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-[13px] font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 size={18} />
                อนุมัติแผนงาน (Approve AI Plan)
              </button>
            </div>
          </section>
          <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-700">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <ShieldAlert className="text-emerald-400" size={20} />
              Enterprise AI Trust & Compliance (การรับรองระบบ)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <Brain size={16} /> 1. AWS Enterprise AI
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  พยากรณ์ราคาแม่นยำด้วย <strong>Amazon Forecast</strong> (ระดับเดียวกับ Amazon Supply Chain) และ <strong>AWS Bedrock + RAG</strong> เชื่อมต่อ พ.ร.บ. จัดซื้อจัดจ้างฯ PEA เพื่อให้ AI วิเคราะห์ภายใต้กรอบกฎหมาย 100%
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <TrendingUp size={16} /> 2. Backtesting Validation
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  พิสูจน์ความแม่นยำด้วย <strong>Historical Backtesting</strong> นำข้อมูลจัดซื้อย้อนหลัง 3 ปีมาทดสอบกับ AI เพื่อหาค่า Cost-Saving จริง โดยไม่ต้องเสี่ยงทดสอบกับระบบใช้งานปัจจุบัน
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} /> 3. Human-in-the-Loop
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  AI เป็นเพียง <strong>"เสนาธิการ"</strong> จัดเตรียม Executive Summary และ e-Bidding Scenario ให้ <strong>คณะกรรมการจัดซื้อ (มนุษย์)</strong> เป็นผู้ตัดสินใจและลงนามอนุมัติขั้นสุดท้ายเสมอ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
