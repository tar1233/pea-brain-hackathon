"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, TrendingDown, AlertTriangle, CheckCircle2, ShieldAlert, Loader2, Sparkles, RefreshCw, ArrowLeft, BarChart3, Target, Zap } from "lucide-react";
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

  const material = materials.find(m => m.id === targetMaterialId || m.sapCode === targetMaterialId);
  const alert = riskAlerts.find(a => a.materialId === targetMaterialId || a.materialId === `MAT-${targetMaterialId}`);

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
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      const content = data.content || "";
      try {
        const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        setAiResult({ ...parsed, raw: content });
      } catch {
        setAiResult({
          demandAnalysis: "AI วิเคราะห์แล้ว (ดูรายละเอียดด้านล่าง)", marketAnalysis: "-", supplierAnalysis: "-",
          planA: { title: "ดูคำแนะนำ AI", action: content.substring(0, 300), financial: "-", risk: "-", qty: mat?.eoq || 0 },
          planB: { title: "ทางเลือกสำรอง", action: "กรุณาอ่านคำแนะนำ AI", financial: "-", risk: "-", qty: 0 },
          executiveSummary: "", raw: content,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (!eBiddingData) return null;
  const { simulation } = eBiddingData;
  const daysOfStock = material ? Math.round(material.currentStock / (material.avgMonthlyDemand / 30)) : 0;
  const stockPercent = material ? Math.round((material.currentStock / material.safetyStock) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* ═══ HERO HEADER ═══ */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1145] via-[#0f0f1a] to-[#0a192f]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 pt-8 pb-10">
          {/* Back button */}
          <button onClick={onClose} className="mb-6 inline-flex items-center gap-2 text-[12px] text-white/50 hover:text-white/80 transition font-medium cursor-pointer">
            <ArrowLeft size={14} /> กลับหน้า Risk Management
          </button>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-[10px] font-bold tracking-widest text-purple-300 uppercase mb-4">
                <Sparkles size={13} className="text-purple-400" />
                AI-Powered Analysis • AWS Bedrock + RAG
              </div>
              <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-white">
                {material?.name || targetMaterialId}
              </h1>
              <p className="mt-2 text-[14px] text-white/50 font-medium">
                รหัส SAP: {material?.sapCode || targetMaterialId} • {material?.category || 'หม้อแปลงไฟฟ้า'}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">สต็อกเหลือ</div>
                <div className={`text-[28px] font-black ${stockPercent < 30 ? 'text-red-400' : 'text-white'}`}>{daysOfStock}</div>
                <div className="text-[11px] text-white/50 font-medium">วัน</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">Safety Stock</div>
                <div className={`text-[28px] font-black ${stockPercent < 30 ? 'text-red-400' : 'text-amber-400'}`}>{stockPercent}%</div>
                <div className="text-[11px] text-white/50 font-medium">ของเกณฑ์</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px]">
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">ราคาต่อหน่วย</div>
                <div className="text-[22px] font-black text-white">{formatCurrency(material?.unitPrice || 0)}</div>
                <div className="text-[11px] text-white/50 font-medium">Budget: {formatCurrency(material?.budgetPrice || 0)}</div>
              </div>
            </div>
          </div>

          {/* Live Data Bar */}
          <div className="mt-6 flex flex-wrap gap-3 text-[11px]">
            {[
              { label: "สต็อก", value: `${material?.currentStock?.toLocaleString()} ${material?.unit}`, icon: "📦" },
              { label: "Safety Stock", value: `${material?.safetyStock?.toLocaleString()} ${material?.unit}`, icon: "🔴" },
              { label: "Demand/เดือน", value: `${material?.avgMonthlyDemand?.toLocaleString()} (σ=${material?.stdMonthlyDemand})`, icon: "📈" },
              { label: "Lead Time", value: `${material?.leadTimeWeeks} สัปดาห์`, icon: "⏱️" },
              { label: "EOQ", value: `${material?.eoq?.toLocaleString()} ${material?.unit}`, icon: "🎯" },
              { label: "แผน 2569", value: `${material?.annualDemand?.toLocaleString()} ${material?.unit}`, icon: "📋" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="text-white/40">{item.label}:</span>
                <span className="font-bold text-white/90">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">

        {/* Loading */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-purple-900 border-t-purple-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><Brain className="text-purple-400 animate-pulse" size={30} /></div>
            </div>
            <div className="text-center">
              <div className="text-[18px] font-bold text-white">AI กำลังวิเคราะห์ข้อมูลจริง...</div>
              <div className="text-[13px] text-white/50 mt-2">Amazon Nova Pro + PEA Knowledge Base (RAG)</div>
              <div className="text-[12px] text-purple-400 mt-3 font-medium animate-pulse">ส่งข้อมูลสต็อก {material?.currentStock} {material?.unit}, Demand {material?.avgMonthlyDemand}/{material?.unit}/เดือน, Lead Time {material?.leadTimeWeeks} สัปดาห์...</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <AlertTriangle className="text-amber-500" size={48} />
            <div className="text-[15px] font-bold text-white">ไม่สามารถเชื่อมต่อ AI ได้</div>
            <div className="text-[13px] text-white/50 max-w-md text-center">{error}</div>
            <button onClick={() => { hasCalledRef.current = false; callAI(); }} className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-[13px] font-bold cursor-pointer hover:bg-purple-700 transition">ลองอีกครั้ง</button>
          </div>
        )}

        {/* ═══ AI RESULTS ═══ */}
        {aiResult && !isAnalyzing && (
          <>
            {/* Row 1: Price Chart + 3 Analysis Cards */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Price Chart — 3 cols */}
              <div className="lg:col-span-3 rounded-2xl bg-white/[0.04] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[16px] font-bold text-white flex items-center gap-2"><BarChart3 size={18} className="text-blue-400" /> แนวโน้มราคาตลาด</h2>
                    <p className="text-[11px] text-white/40 mt-1">แหล่งข้อมูล: ประวัติใบสั่งซื้อ PEA (SAP) • ดัชนีราคาโลหะโลก (LME) • ราคากลางกระทรวงพาณิชย์</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 border border-emerald-500/20">
                    <TrendingDown size={13} /> ราคามีแนวโน้มลดลง
                  </div>
                </div>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulation.priceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(val) => `฿${(val/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e1b4b', color: '#fff' }} formatter={(value: any, name: any) => [formatCurrency(Number(value) || 0), name === 'price' ? "ปีปัจจุบัน" : "ปีก่อนหน้า"]} />
                      <ReferenceLine x="May" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="lastYearPrice" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#1e1b4b' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3 Analysis Cards — 2 cols */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target size={13} /> ทำไมต้องสั่ง? (Demand)</div>
                  <p className="text-[13px] text-white/80 leading-relaxed font-medium">{aiResult.demandAnalysis}</p>
                </div>
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BarChart3 size={13} /> เปิดประมูลเมื่อไหร่? (Market)</div>
                  <p className="text-[13px] text-white/80 leading-relaxed font-medium">{aiResult.marketAnalysis}</p>
                </div>
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap size={13} /> ต้องเริ่มสั่งเมื่อไหร่? (Supplier)</div>
                  <p className="text-[13px] text-white/80 leading-relaxed font-medium">{aiResult.supplierAnalysis}</p>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            {aiResult.executiveSummary && (
              <div className="rounded-2xl bg-purple-500/10 border border-purple-500/20 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} className="text-purple-400" />
                  <span className="text-[13px] font-bold text-purple-300 uppercase tracking-wider">สรุปสำหรับผู้บริหาร (Executive Summary)</span>
                </div>
                <p className="text-[15px] leading-relaxed font-semibold text-white/90">{aiResult.executiveSummary}</p>
              </div>
            )}

            {/* Row 2: Two Plans Side by Side */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Plan A */}
              <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/5 p-6 relative overflow-hidden hover:border-emerald-400 transition-all">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 text-[10px] font-bold rounded-bl-2xl flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> AI แนะนำ
                </div>
                <h3 className="text-[18px] font-bold text-emerald-300 mb-2">Plan A: {aiResult.planA.title}</h3>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider mb-1">📋 ขั้นตอนปฏิบัติงาน</div>
                    <p className="text-[13px] text-white/80 leading-relaxed">{aiResult.planA.action}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-blue-400/70 uppercase tracking-wider mb-1">💰 ผลกระทบทางการเงิน</div>
                    <p className="text-[13px] text-white/80 leading-relaxed">{aiResult.planA.financial}</p>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                    <div className="text-[10px] font-bold text-amber-400/70 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={11} /> ความเสี่ยง & วิธีรับมือ</div>
                    <p className="text-[12px] text-amber-200/80 leading-relaxed">{aiResult.planA.risk}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
                  <div className="text-[12px] text-emerald-300/70 font-medium">จำนวน: {aiResult.planA.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planA.qty * (material?.unitPrice || 0))}</div>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan A: ${aiResult.planA.title}`, action: aiResult.planA.action, qty: aiResult.planA.qty, risk: aiResult.planA.risk, financial: aiResult.planA.financial, unitPrice: material?.unitPrice || 0 } }));
                      if (onClose) onClose();
                      setTimeout(() => setActiveTab?.("activity"), 300);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-[13px] font-bold text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> เลือกแผนนี้ → วางแผนจัดซื้อ
                  </button>
                </div>
              </div>

              {/* Plan B */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 relative overflow-hidden hover:border-white/20 transition-all">
                <h3 className="text-[18px] font-bold text-white/80 mb-2">Plan B: {aiResult.planB.title}</h3>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">📋 ขั้นตอนปฏิบัติงาน</div>
                    <p className="text-[13px] text-white/60 leading-relaxed">{aiResult.planB.action}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">💰 ผลกระทบทางการเงิน</div>
                    <p className="text-[13px] text-white/60 leading-relaxed">{aiResult.planB.financial}</p>
                  </div>
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                    <div className="text-[10px] font-bold text-red-400/70 uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldAlert size={11} /> ความเสี่ยง & วิธีรับมือ</div>
                    <p className="text-[12px] text-red-200/70 leading-relaxed">{aiResult.planB.risk}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[12px] text-white/40 font-medium">จำนวน: {aiResult.planB.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planB.qty * (material?.unitPrice || 0))}</div>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan B: ${aiResult.planB.title}`, action: aiResult.planB.action, qty: aiResult.planB.qty, risk: aiResult.planB.risk, financial: aiResult.planB.financial, unitPrice: (material?.unitPrice || 150000) * 1.15 } }));
                      if (onClose) onClose();
                      setTimeout(() => setActiveTab?.("activity"), 300);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-[13px] font-bold text-white/80 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <AlertTriangle size={16} className="text-amber-400" /> เลือก Plan B
                  </button>
                </div>
              </div>
            </div>

            {/* Raw AI Response */}
            {aiResult.raw && (
              <details className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <summary className="px-6 py-4 text-[12px] font-bold text-white/40 cursor-pointer hover:bg-white/[0.03] transition flex items-center gap-2">
                  <Brain size={14} className="text-purple-400" /> ดู Raw AI Response จาก Amazon Nova Pro
                  {!isAnalyzing && (
                    <button onClick={(e) => { e.preventDefault(); hasCalledRef.current = false; callAI(); }} className="ml-auto text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px]">
                      <RefreshCw size={12} /> วิเคราะห์ใหม่
                    </button>
                  )}
                </summary>
                <div className="px-6 pb-6 text-[11px] text-white/50 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto font-mono">{aiResult.raw}</div>
              </details>
            )}
          </>
        )}
      </main>
    </div>
  );
}
