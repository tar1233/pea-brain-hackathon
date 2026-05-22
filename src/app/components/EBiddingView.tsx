"use client";

import React, { useState } from "react";
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { useData } from "../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString()}`;
}

export default function EBiddingView() {
  const { eBiddingData } = useData();
  const [activeStepId, setActiveStepId] = useState(2);

  if (!eBiddingData) return null;

  const { targetMaterial, totalRequirement, simulation } = eBiddingData;

  const renderTimelineIcon = (status: string, id: number) => {
    if (status === "completed" || id < activeStepId) return <CheckCircle2 className="text-emerald-500" size={24} />;
    if (status === "active" || id === activeStepId) return <AlertTriangle className="text-amber-500 animate-pulse" size={24} />;
    return <Clock className="text-slate-400" size={24} />;
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
              เจาะลึกกลยุทธ์การจัดซื้อ: {targetMaterial}
            </h1>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-blue-100/80 font-medium">
              Multi-Agent AI วิเคราะห์เทรนด์ราคาและประเมินความเสี่ยง Supplier เพื่อหาจังหวะที่เหมาะสมที่สุดในการเปิดประกวดราคา 
              พร้อมรับมือความไม่แน่นอนแบบ Real-time
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
                    formatter={(value: any) => [formatCurrency(Number(value) || 0), "ราคาตลาด"]}
                  />
                  <ReferenceLine x="May" stroke="#cbd5e1" strokeDasharray="3 3" />
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
                <h2 className="text-[16px] font-bold text-slate-900">Supplier Uncertainty Simulator</h2>
                <p className="text-[12px] text-slate-500 mt-1">จำลองสถานการณ์ความไม่แน่นอน และการพลิกแพลงของ AI</p>
              </div>
              <button 
                onClick={() => setActiveStepId(prev => prev < 3 ? prev + 1 : 1)}
                className="flex items-center gap-1.5 rounded-lg bg-[#A80689] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#8A0570] transition-colors"
              >
                <PlayCircle size={14} /> {activeStepId === 3 ? "รีเซ็ต" : "เล่นเหตุการณ์ถัดไป"}
              </button>
            </div>

            <div className="flex-1 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
              
              <div className="space-y-8 relative">
                {simulation.steps.map((step: any) => {
                  const isActive = step.id === activeStepId;
                  const isPast = step.id < activeStepId;
                  
                  return (
                    <div key={step.id} className={`relative flex gap-4 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : isPast ? 'opacity-60 scale-100' : 'opacity-30 scale-95'}`}>
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                        {renderTimelineIcon(step.status, step.id)}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`rounded-2xl border p-4 ${isActive ? 'border-amber-200 bg-amber-50/30 shadow-md shadow-amber-500/5' : 'border-slate-100 bg-white'}`}>
                          <h3 className={`text-[14px] font-bold ${isActive ? 'text-amber-900' : 'text-slate-900'}`}>
                            Step {step.id}: {step.title}
                          </h3>
                          <p className="mt-2 text-[12px] text-slate-600 leading-relaxed">
                            {step.detail}
                          </p>
                          
                          {(isActive || isPast) && (
                            <div className={`mt-4 rounded-xl p-3 ${isActive ? 'bg-amber-100/50 text-amber-900' : 'bg-slate-50 text-slate-700'}`}>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Brain size={14} className={isActive ? "text-amber-600" : "text-slate-400"} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">AI Decision</span>
                              </div>
                              <p className="text-[12px] leading-relaxed font-medium">
                                {step.aiAction}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
