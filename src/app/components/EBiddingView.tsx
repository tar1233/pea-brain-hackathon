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

  const { totalRequirement, simulation } = eBiddingData;

  // Dynamic AI Scenario mapping
  const getScenarioData = (id: string) => {
    switch(id) {
      case "10066":
        return {
          title: `AI Strategy & Action Plan: สายไฟ THW 1x95 sq.mm. (${id})`,
          demandData: "ยอดเบิกจ่ายพุ่ง +20% จากโครงการขยายเขต",
          marketData: "ราคาทองแดงผันผวนสูง (High Volatility)",
          supplierData: "ความเสี่ยงการส่งมอบ 45% (Liquidity Risk)",
          planA_Title: "Strategic Sourcing (จัดหาแบบกระจายความเสี่ยง)",
          planA_Action: "แบ่งสัญญาจัดซื้อเป็น 2 ส่วน (Split Award) เพื่อลดความเสี่ยงผูกขาด 50%",
          planA_Financial: "ป้องกันความเสี่ยงของขาด 100% แต่ราคาเฉลี่ยอาจเพิ่ม 2%",
          planA_Risk: "กระบวนการจัดซื้อซับซ้อนขึ้น ต้องจัดการ Supplier 2 ราย",
          planA_Qty: 200,
          planB_Title: "Hold & Wait (รอดูสถานการณ์ตลาด)",
          planB_Action: "ชะลอการสั่งซื้อ และใช้สต๊อกเท่าที่มีไปก่อน",
          planB_Financial: "ไม่เกิดค่าใช้จ่ายเพิ่ม ณ ตอนนี้",
          planB_Risk: "มีความเสี่ยงของขาดคลัง 80% หากโครงการขยายเขตเร่งตัว",
          planB_Qty: 0
        };
      case "20045":
        return {
          title: `AI Strategy & Action Plan: มิเตอร์ 15(45)A (${id})`,
          demandData: "ความต้องการใช้คงที่ (Stable Demand)",
          marketData: "ราคาตลาดมีแนวโน้มทรงตัวตลอดปี",
          supplierData: "ไม่มีความเสี่ยงด้านการส่งมอบ (Reliability 98%)",
          planA_Title: "Long-term Contract (ล็อกราคาและปริมาณ)",
          planA_Action: "เซ็นสัญญาระยะยาว 2 ปีกับ Supplier ปัจจุบันแบบลดหลั่นราคาตามโวลุ่ม",
          planA_Financial: "ล็อกราคาปัจจุบันได้ ประหยัดงบได้ 1.5% ต่อปี",
          planA_Risk: "เสียโอกาสหากราคาตลาดตกลงอย่างฉับพลัน",
          planA_Qty: 5000,
          planB_Title: "Spot Purchase (ซื้อรายครั้ง)",
          planB_Action: "จัดซื้อเป็นล็อตเล็กๆ ทุก 3 เดือน (Just-in-Time)",
          planB_Financial: "ลดต้นทุนจมจากการเก็บสต๊อก (Holding Cost)",
          planB_Risk: "ต้นทุนการจัดการสูงขึ้น (Ordering Cost) เสียเวลาทำเอกสารบ่อย",
          planB_Qty: 1200
        };
      case "10067":
      default:
        return {
          title: `AI Strategy & Action Plan: หม้อแปลง 160 kVA 3Ph (${id})`,
          demandData: "แนวโน้มเบิกจ่ายพุ่ง +15% จากพายุฤดูฝน",
          marketData: "ราคา LME ตลาดโลกลดลง 5% ใน Q4",
          supplierData: "ประวัติ Supplier A มีความเสี่ยงส่งมอบช้า",
          planA_Title: "Cost Optimization Strategy",
          planA_Action: "โอนย้ายสต๊อกคงเหลือจากคลังภาคกลางมาช่วยแก้ขัด 150 เครื่อง และเปิด e-Bidding ใหม่ใน Q4 แทน",
          planA_Financial: "ประหยัดงบจัดซื้อได้ประมาณ 3-5% (ลดความสูญเปล่า)",
          planA_Risk: "คลังภาคกลางจะมี Stock ลดลงชั่วคราวเป็นเวลา 2 สัปดาห์ (AI ควบคุมและจัดการได้)",
          planA_Qty: 150,
          planB_Title: "Emergency Direct Purchase",
          planB_Action: "ใช้วิธี \"จัดซื้อพิเศษ (Direct Purchase)\" ฉุกเฉินกับ Supplier สำรอง 300 เครื่องทันที",
          planB_Financial: "ต้องใช้งบประมาณเพิ่มขึ้นประมาณ 15% จากราคากลางเนื่องจากความเร่งด่วน",
          planB_Risk: "อาจถูก สตง. เพ่งเล็งเรื่องความโปร่งใส และต้นทุนสูงเกินความจำเป็น",
          planB_Qty: 300
        };
    }
  };

  const scenario = getScenarioData(targetMaterialId);

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
              {scenario.title}
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

        {/* Right Column: AI Analysis & Multi-Option Strategy */}
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="mb-6">
              <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                <Brain className="text-purple-600" size={20} />
                AI Strategy Options (ข้อเสนอแนะเชิงกลยุทธ์)
              </h2>
              <p className="text-[12px] text-slate-500 mt-1">AI วิเคราะห์ข้อมูลทั้งหมดแล้วพบว่าพัสดุรายการนี้มีความเสี่ยงสูง จึงเสนอ 2 ทางเลือกที่ดีที่สุดให้ผู้บริหารตัดสินใจ</p>
            </div>

            {/* Data Points Used */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Demand Data</div>
                <div className="text-[12px] font-semibold text-slate-700">{scenario.demandData}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Market Data</div>
                <div className="text-[12px] font-semibold text-slate-700">{scenario.marketData}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Supplier Data</div>
                <div className="text-[12px] font-semibold text-slate-700">{scenario.supplierData}</div>
              </div>
            </div>

            {/* Plan A */}
            <div className="mb-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 p-5 relative overflow-hidden transition-all hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl flex items-center gap-1">
                <CheckCircle2 size={12} /> Highly Recommended
              </div>
              <h3 className="text-[15px] font-bold text-emerald-900 mb-1">Plan A: {scenario.planA_Title}</h3>
              <p className="text-[12px] text-emerald-700/80 font-medium mb-4">กลยุทธ์ที่ AI แนะนำว่าคุ้มค่าที่สุดในระยะยาว</p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Action:</span> {scenario.planA_Action}</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Financial Impact:</span> {scenario.planA_Financial}</div>
                </div>
                <div className="flex gap-2">
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={12} />
                  <div className="text-[12px] text-slate-700"><span className="font-bold text-amber-600">Risk:</span> {scenario.planA_Risk}</div>
                </div>
              </div>

              <div className="mt-5 border-t border-emerald-200/50 pt-4 text-right">
                <button 
                  onClick={() => {
                    const material = materials.find(m => m.id === targetMaterialId);
                    window.dispatchEvent(new CustomEvent("create-po", { 
                      detail: { materialId: targetMaterialId, qty: scenario.planA_Qty, name: material?.name || scenario.title.split(": ")[1], price: material?.unitPrice } 
                    }));
                    if (onClose) onClose();
                    setTimeout(() => setActiveTab?.("activity"), 500);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[12px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                >
                  <CheckCircle2 size={16} /> อนุมัติ Plan A (ดำเนินการโอนย้ายทันที)
                </button>
              </div>
            </div>

            {/* Plan B */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 relative overflow-hidden transition-all hover:border-amber-300 hover:shadow-md">
              <h3 className="text-[15px] font-bold text-slate-800 mb-1">Plan B: {scenario.planB_Title}</h3>
              <p className="text-[12px] text-slate-500 font-medium mb-4">แผนสำรอง / ทางเลือกกรณีฉุกเฉิน</p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Action:</span> {scenario.planB_Action}</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Financial Impact:</span> {scenario.planB_Financial}</div>
                </div>
                <div className="flex gap-2">
                  <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={12} />
                  <div className="text-[12px] text-slate-700"><span className="font-bold text-red-600">Risk:</span> {scenario.planB_Risk}</div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4 text-right">
                <button 
                  onClick={() => {
                    const material = materials.find(m => m.id === targetMaterialId);
                    window.dispatchEvent(new CustomEvent("create-po", { 
                      detail: { materialId: targetMaterialId, qty: scenario.planB_Qty, name: material?.name || scenario.title.split(": ")[1], price: (material?.unitPrice || 150000) * 1.15 } 
                    }));
                    if (onClose) onClose();
                    setTimeout(() => setActiveTab?.("activity"), 500);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-5 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <AlertTriangle size={16} className="text-amber-500" /> เลือก Plan B (ยอมรับความเสี่ยง)
                </button>
              </div>
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
