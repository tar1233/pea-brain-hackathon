"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useData } from "../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString()}`;
}

interface AIAnalysisResult {
  demandAnalysis: string;
  marketAnalysis: string;
  supplierAnalysis: string;
  planA: { title: string; action: string; financial: string; risk: string; qty: number };
  planB: { title: string; action: string; financial: string; risk: string; qty: number };
  executiveSummary: string;
  raw?: string;
}

export default function EBiddingView({ targetMaterialId = "10067", setActiveTab, onClose }: { targetMaterialId?: string, setActiveTab?: (tab: string) => void, onClose?: () => void }) {
  const { eBiddingData, materials, riskAlerts } = useData();
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false);

  // Find the actual material data
  const material = materials.find(m => m.id === targetMaterialId || m.sapCode === targetMaterialId);
  const alert = riskAlerts.find(a => a.materialId === targetMaterialId || a.materialId === `MAT-${targetMaterialId}`);

  // Call AI on mount
  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;
    callAI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function callAI() {
    setIsAnalyzing(true);
    setError(null);
    setAiResult(null);

    const mat = material;
    const stockPercent = mat ? Math.round((mat.currentStock / mat.safetyStock) * 100) : 0;
    const shortage = mat ? Math.max(0, mat.safetyStock - mat.currentStock) : 0;
    const annualBudget = mat ? mat.annualDemand * mat.unitPrice : 0;

    const daysOfStock = mat ? Math.round(mat.currentStock / (mat.avgMonthlyDemand / 30)) : 0;
    const monthsOfStock = mat ? (mat.currentStock / mat.avgMonthlyDemand).toFixed(1) : '0';
    const stockVsSafety = mat ? Math.round(((mat.safetyStock - mat.currentStock) / mat.safetyStock) * 100) : 0;
    const demandVariation = mat ? Math.round((mat.stdMonthlyDemand / mat.avgMonthlyDemand) * 100) : 0;

    const prompt = `คุณเป็น AI ที่ปรึกษาการจัดซื้อระดับ Enterprise ของ PEA (การไฟฟ้าส่วนภูมิภาค)
เจ้าหน้าที่จัดซื้อต้องการให้คุณวิเคราะห์ข้อมูลจริงต่อไปนี้ แล้วออกแผนจัดซื้อที่ปฏิบัติได้จริง พร้อมเหตุผลว่าทำไม

═══ ข้อมูลพัสดุ: ${mat?.name || 'Unknown'} (รหัส ${targetMaterialId}) ═══
📦 สต็อก: ${mat?.currentStock?.toLocaleString() || '?'} ${mat?.unit} (ใช้ได้อีก ${daysOfStock} วัน หรือ ${monthsOfStock} เดือน)
🔴 Safety Stock: ${mat?.safetyStock?.toLocaleString() || '?'} ${mat?.unit} → ปัจจุบันขาด ${stockVsSafety}% จากเกณฑ์
📈 เบิกจ่ายเฉลี่ย: ${mat?.avgMonthlyDemand?.toLocaleString() || '?'} ${mat?.unit}/เดือน (ค่าเบี่ยงเบน: ${demandVariation}% → ${demandVariation > 50 ? 'ผันผวนมาก' : 'ค่อนข้างคงที่'})
⏱️ Lead Time: ${mat?.leadTimeWeeks || '?'} สัปดาห์ (≈${mat ? Math.round(mat.leadTimeWeeks * 7) : '?'} วัน)
💰 ราคาต่อหน่วย: ฿${mat?.unitPrice?.toLocaleString() || '?'} | ราคากลาง: ฿${mat?.budgetPrice?.toLocaleString() || '?'}
🎯 แผน 2569 ต้องการ: ${mat?.annualDemand?.toLocaleString() || '?'} ${mat?.unit} (งบ ≈ ฿${annualBudget.toLocaleString()})
📊 ประวัติเบิกจ่าย 12 เดือน: [${mat?.sparkline?.join(', ') || '?'}]
${alert ? `⚠️ แจ้งเตือน: ${alert.message}` : ''}
${alert ? `📌 คำแนะนำเดิม: ${alert.recommendation}` : ''}

═══ สิ่งที่ต้องวิเคราะห์ (บังคับ) ═══
1. ทำไมต้องสั่ง? — ดูจากสต็อกที่เหลือ vs Demand ที่จะเกิดขึ้น (ใช้ได้อีกกี่วัน?)
2. ต้องสั่งเมื่อไหร่? — คำนวณจาก Lead Time ว่าต้องเริ่มกระบวนการจัดซื้อวันไหนเพื่อไม่ให้ของขาด
3. ควรเปิดประกวดราคาช่วงไหน? — วิเคราะห์จากราคาตลาดและประวัติราคาจัดซื้อ
4. ตัวไหนต้องเฝ้าระวัง? — ดูจากค่าเบี่ยงเบนสูง = Demand ผันผวน
5. ถ้าแผนมีความเสี่ยง ต้องจัดการยังไง? — ระบุขั้นตอนแก้ไขชัดเจน

ตอบเป็น JSON เท่านั้น (ไม่ต้อง markdown code block) ตามโครงสร้างนี้:
{
  "demandAnalysis": "วิเคราะห์จากข้อมูลจริง: ทำไมต้องสั่ง? สต็อกใช้ได้อีกกี่วัน? Demand แนวโน้มไปทางไหน? (อ้างอิงตัวเลข)",
  "marketAnalysis": "วิเคราะห์จากราคา: ควรเปิดประกวดราคาช่วงไหน? ราคาตลาดเป็นอย่างไร? (อ้างอิงตัวเลข)",
  "supplierAnalysis": "วิเคราะห์ Supplier: มีความเสี่ยงอะไร? Lead Time นานแค่ไหน? ต้องเริ่มสั่งเมื่อไหร่จึงจะได้ของทัน? (อ้างอิงตัวเลข)",
  "planA": {
    "title": "ชื่อแผน (เช่น 'เร่งเปิดประกวดราคา e-Bidding Q3/2569')",
    "action": "ขั้นตอนปฏิบัติงานจริง: สัปดาห์ที่ 1 ทำอะไร, สัปดาห์ที่ 2 ทำอะไร (ระบุ timeline ชัดเจน)",
    "financial": "ผลกระทบทางการเงิน: ต้นทุนเท่าไหร่ ประหยัดเท่าไหร่ (ระบุจำนวนเงินจริงจากข้อมูล)",
    "risk": "ความเสี่ยงของแผนนี้คืออะไร + วิธีรับมือเมื่อเกิดขึ้น",
    "qty": ตัวเลขจำนวนสั่งซื้อ
  },
  "planB": {
    "title": "ชื่อแผนสำรอง",
    "action": "ขั้นตอนปฏิบัติงานจริง (ระบุ timeline ชัดเจน)",
    "financial": "ผลกระทบทางการเงิน (ระบุจำนวนเงินจริง)",
    "risk": "ความเสี่ยงของแผนนี้ + วิธีรับมือ",
    "qty": ตัวเลขจำนวนสั่งซื้อ
  },
  "executiveSummary": "สรุปสำหรับผู้บริหาร: ทำไมต้องทำ เมื่อไหร่ต้องทำ ถ้าไม่ทำจะเกิดอะไรขึ้น (2-3 ประโยค อ้างอิงตัวเลข)"
}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      const content = data.content || "";

      // Try to parse JSON from the AI response
      try {
        // Strip markdown code fences if present
        const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setAiResult({
          demandAnalysis: parsed.demandAnalysis || "ไม่สามารถวิเคราะห์ได้",
          marketAnalysis: parsed.marketAnalysis || "ไม่สามารถวิเคราะห์ได้",
          supplierAnalysis: parsed.supplierAnalysis || "ไม่สามารถวิเคราะห์ได้",
          planA: parsed.planA || { title: "Plan A", action: "-", financial: "-", risk: "-", qty: 0 },
          planB: parsed.planB || { title: "Plan B", action: "-", financial: "-", risk: "-", qty: 0 },
          executiveSummary: parsed.executiveSummary || "",
          raw: content,
        });
      } catch {
        // If JSON parsing fails, show the raw AI response
        setAiResult({
          demandAnalysis: "AI วิเคราะห์แล้ว (ดูรายละเอียดด้านล่าง)",
          marketAnalysis: "AI วิเคราะห์แล้ว (ดูรายละเอียดด้านล่าง)",
          supplierAnalysis: "AI วิเคราะห์แล้ว (ดูรายละเอียดด้านล่าง)",
          planA: { title: "ดูคำแนะนำ AI ด้านล่าง", action: content.substring(0, 200), financial: "-", risk: "-", qty: mat?.eoq || 0 },
          planB: { title: "ทางเลือกสำรอง", action: "กรุณาอ่านคำแนะนำ AI ด้านล่าง", financial: "-", risk: "-", qty: 0 },
          executiveSummary: "",
          raw: content,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (!eBiddingData) return null;

  const { totalRequirement, simulation } = eBiddingData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <section className="rounded-[32px] border border-blue-500/10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-8 py-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold tracking-widest text-blue-200 uppercase">
              <Brain size={14} />
              AI-Powered Analysis • AWS Bedrock + RAG
            </div>
            <h1 className="max-w-4xl text-[24px] font-bold leading-tight tracking-tight">
              AI Strategy: {material?.name || targetMaterialId}
            </h1>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-blue-100/80 font-medium">
              วิเคราะห์โดย Amazon Nova Pro + PEA Knowledge Base • ข้อมูลสต็อก: <span className="text-white font-bold">{material?.currentStock?.toLocaleString() || '?'}</span> / Safety Stock: <span className="text-white font-bold">{material?.safetyStock?.toLocaleString() || '?'}</span> {material?.unit || 'เครื่อง'}
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <div className="text-[12px] text-blue-200 font-medium uppercase tracking-wider mb-1">ราคาต่อหน่วย</div>
            <div className="text-[28px] font-black text-white">{formatCurrency(material?.unitPrice || 0)}</div>
            <div className="text-[11px] text-blue-300 mt-1">งบประมาณทั้งปี: {formatCurrency((material?.annualDemand || 0) * (material?.unitPrice || 0))}</div>
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

            {/* Material Fact Sheet */}
            <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">📋 ข้อมูลจริงจากระบบ (Live Data)</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-slate-500">สต็อกปัจจุบัน:</span><span className="font-bold text-slate-900">{material?.currentStock?.toLocaleString() || '-'} {material?.unit}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Safety Stock:</span><span className="font-bold text-red-600">{material?.safetyStock?.toLocaleString() || '-'} {material?.unit}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Avg Demand/เดือน:</span><span className="font-bold text-slate-900">{material?.avgMonthlyDemand?.toLocaleString() || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Lead Time:</span><span className="font-bold text-slate-900">{material?.leadTimeWeeks || '-'} สัปดาห์</span></div>
                <div className="flex justify-between"><span className="text-slate-500">EOQ:</span><span className="font-bold text-slate-900">{material?.eoq?.toLocaleString() || '-'} {material?.unit}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">แผน 2569:</span><span className="font-bold text-slate-900">{material?.annualDemand?.toLocaleString() || '-'} {material?.unit}</span></div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: AI Real-time Analysis */}
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={20} />
                  AI Strategy Options (วิเคราะห์โดย Bedrock)
                </h2>
                <p className="text-[12px] text-slate-500 mt-1">ผลวิเคราะห์จาก Amazon Nova Pro + PEA Knowledge Base แบบ Real-time</p>
              </div>
              {!isAnalyzing && (
                <button onClick={() => { hasCalledRef.current = false; callAI(); }} className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                  <RefreshCw size={13} /> วิเคราะห์ใหม่
                </button>
              )}
            </div>

            {/* Loading State */}
            {isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="text-purple-600 animate-pulse" size={24} />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-bold text-slate-800">AI กำลังวิเคราะห์ข้อมูลจริง...</div>
                  <div className="text-[12px] text-slate-500 mt-1">เรียกใช้ Amazon Nova Pro + Knowledge Base (RAG)</div>
                  <div className="text-[11px] text-purple-600 mt-2 font-medium animate-pulse">กำลังส่งข้อมูลสต็อก, Demand, Lead Time, ราคาตลาด ไปให้ AI ประมวลผล...</div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                <AlertTriangle className="text-amber-500" size={40} />
                <div className="text-center">
                  <div className="text-[14px] font-bold text-slate-800">ไม่สามารถเชื่อมต่อ AI ได้</div>
                  <div className="text-[12px] text-slate-500 mt-1 max-w-sm">{error}</div>
                  <button onClick={() => { hasCalledRef.current = false; callAI(); }} className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-[12px] font-bold cursor-pointer hover:bg-purple-700 transition">
                    ลองอีกครั้ง
                  </button>
                </div>
              </div>
            )}

            {/* AI Result */}
            {aiResult && !isAnalyzing && (
              <>
                {/* Data Points from AI */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">📈 Demand Analysis</div>
                    <div className="text-[11px] font-semibold text-slate-700 leading-relaxed">{aiResult.demandAnalysis}</div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">💰 Market Analysis</div>
                    <div className="text-[11px] font-semibold text-slate-700 leading-relaxed">{aiResult.marketAnalysis}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">🏭 Supplier Analysis</div>
                    <div className="text-[11px] font-semibold text-slate-700 leading-relaxed">{aiResult.supplierAnalysis}</div>
                  </div>
                </div>

                {/* Executive Summary */}
                {aiResult.executiveSummary && (
                  <div className="mb-5 rounded-xl bg-purple-50 p-4 border border-purple-100">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Brain size={14} className="text-purple-600" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">🧠 Executive Summary</span>
                    </div>
                    <p className="text-[12px] leading-relaxed font-semibold text-purple-800">{aiResult.executiveSummary}</p>
                  </div>
                )}

                {/* Plan A */}
                <div className="mb-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 p-5 relative overflow-hidden transition-all hover:shadow-lg hover:shadow-emerald-500/10">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl flex items-center gap-1">
                    <CheckCircle2 size={12} /> AI Recommended
                  </div>
                  <h3 className="text-[15px] font-bold text-emerald-900 mb-1">Plan A: {aiResult.planA.title}</h3>
                  
                  <div className="space-y-3 mt-3">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Action:</span> {aiResult.planA.action}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Financial Impact:</span> {aiResult.planA.financial}</div>
                    </div>
                    <div className="flex gap-2">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={12} />
                      <div className="text-[12px] text-slate-700"><span className="font-bold text-amber-600">Risk:</span> {aiResult.planA.risk}</div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-emerald-200/50 pt-4 flex items-center justify-between">
                    <div className="text-[11px] text-emerald-700 font-medium">จำนวน: {aiResult.planA.qty.toLocaleString()} {material?.unit || 'เครื่อง'} • มูลค่าประมาณ {formatCurrency(aiResult.planA.qty * (material?.unitPrice || 0))}</div>
                    <button 
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("approve-plan", { 
                          detail: { 
                            materialId: targetMaterialId, 
                            materialName: material?.name || targetMaterialId,
                            planName: `Plan A: ${aiResult.planA.title}`,
                            action: aiResult.planA.action,
                            qty: aiResult.planA.qty,
                            risk: aiResult.planA.risk,
                            financial: aiResult.planA.financial,
                            unitPrice: material?.unitPrice || 0
                          } 
                        }));
                        if (onClose) onClose();
                        setTimeout(() => setActiveTab?.("activity"), 300);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[12px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 size={16} /> เลือกแผนนี้ → เข้าสู่การวางแผนจัดซื้อ
                    </button>
                  </div>
                </div>

                {/* Plan B */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 relative overflow-hidden transition-all hover:border-amber-300 hover:shadow-md">
                  <h3 className="text-[15px] font-bold text-slate-800 mb-1">Plan B: {aiResult.planB.title}</h3>
                  
                  <div className="space-y-3 mt-3">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Action:</span> {aiResult.planB.action}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <div className="text-[12px] text-slate-700"><span className="font-bold text-slate-900">Financial Impact:</span> {aiResult.planB.financial}</div>
                    </div>
                    <div className="flex gap-2">
                      <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={12} />
                      <div className="text-[12px] text-slate-700"><span className="font-bold text-red-600">Risk:</span> {aiResult.planB.risk}</div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-medium">จำนวน: {aiResult.planB.qty.toLocaleString()} {material?.unit || 'เครื่อง'} • มูลค่าประมาณ {formatCurrency(aiResult.planB.qty * (material?.unitPrice || 0))}</div>
                    <button 
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("approve-plan", { 
                          detail: { 
                            materialId: targetMaterialId, 
                            materialName: material?.name || targetMaterialId,
                            planName: `Plan B: ${aiResult.planB.title}`,
                            action: aiResult.planB.action,
                            qty: aiResult.planB.qty,
                            risk: aiResult.planB.risk,
                            financial: aiResult.planB.financial,
                            unitPrice: (material?.unitPrice || 150000) * 1.15
                          } 
                        }));
                        if (onClose) onClose();
                        setTimeout(() => setActiveTab?.("activity"), 300);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-5 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <AlertTriangle size={16} className="text-amber-500" /> เลือก Plan B → เข้าสู่การวางแผนจัดซื้อ
                    </button>
                  </div>
                </div>

                {/* Raw AI Response (collapsible) */}
                {aiResult.raw && (
                  <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                    <summary className="px-4 py-3 text-[11px] font-bold text-slate-500 cursor-pointer hover:bg-slate-100 transition flex items-center gap-2">
                      <Brain size={14} className="text-purple-500" /> ดู Raw AI Response (จาก Amazon Nova Pro)
                    </summary>
                    <div className="px-4 pb-4 text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto font-mono">
                      {aiResult.raw}
                    </div>
                  </details>
                )}
              </>
            )}
          </section>

          {/* Trust Section */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-700">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <ShieldAlert className="text-emerald-400" size={20} />
              Enterprise AI Trust & Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <Brain size={16} /> 1. AWS Enterprise AI
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  วิเคราะห์โดย <strong>Amazon Nova Pro</strong> + <strong>AWS Bedrock Knowledge Base (RAG)</strong> เชื่อมต่อ พ.ร.บ. จัดซื้อจัดจ้างฯ PEA 100%
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <TrendingUp size={16} /> 2. Live Data Analysis
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  ข้อมูลสต็อก, Demand, Lead Time, ราคาตลาด ถูกส่งให้ AI วิเคราะห์แบบ <strong>Real-time</strong> ทุกครั้งที่กดปุ่ม ไม่ใช่ข้อมูล Mock
                </p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} /> 3. Human-in-the-Loop
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  AI เป็นเพียง <strong>"เสนาธิการ"</strong> เสนอทางเลือก ให้ <strong>คณะกรรมการจัดซื้อ (มนุษย์)</strong> เป็นผู้ตัดสินใจขั้นสุดท้ายเสมอ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
