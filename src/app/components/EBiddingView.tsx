"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, TrendingDown, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, ArrowLeft, BarChart3, Target, Zap } from "lucide-react";
import { useData } from "../context/DataContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function formatCurrency(value: number) {
  return `฿${value.toLocaleString()}`;
}

interface AIAnalysisResult {
  demandAnalysis: string;
  marketAnalysis: string;
  supplierAnalysis: string;
  priceForecast: { threeMonth: string; oneYear: string; bestTimeToBuy: string };
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
    "title": "ชื่อแผน",
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
  "priceForecast": {
    "threeMonth": "คาดการณ์ราคาอีก 3 เดือนข้างหน้า: ขึ้นหรือลง กี่%? เพราะอะไร? (อ้างอิงจากราคาปัจจุบัน ฿${mat?.unitPrice?.toLocaleString() || '?'})",
    "oneYear": "คาดการณ์ราคาอีก 1 ปีข้างหน้า: ขึ้นหรือลง กี่%? เพราะอะไร? (อ้างอิงจากราคาปัจจุบัน)",
    "bestTimeToBuy": "ช่วงเวลาที่ดีที่สุดในการเปิดประกวดราคา คือเดือนอะไร? ทำไม? (วิเคราะห์จากแนวโน้มราคาและฤดูกาล)"
  },
  "executiveSummary": "สรุปสำหรับผู้บริหาร: ทำไมต้องทำ เมื่อไหร่ต้องทำ ถ้าไม่ทำจะเกิดอะไรขึ้น (2-3 ประโยค อ้างอิงตัวเลข)"
}

สำคัญมาก: ตอบเป็น JSON เท่านั้น ห้ามมี text อื่นนอก JSON ห้ามมี markdown code block`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], jsonMode: true }),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      const content = data.content || "";
      // Robust JSON extraction
      let jsonStr = content;
      // Remove markdown fences
      jsonStr = jsonStr.replace(/```json\s*/gi, "").replace(/```\s*/gi, "");
      // Try to extract JSON object from text
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];
      jsonStr = jsonStr.trim();

      try {
        const parsed = JSON.parse(jsonStr);
        setAiResult({
          demandAnalysis: parsed.demandAnalysis || "ไม่สามารถวิเคราะห์ได้",
          marketAnalysis: parsed.marketAnalysis || "ไม่สามารถวิเคราะห์ได้",
          supplierAnalysis: parsed.supplierAnalysis || "ไม่สามารถวิเคราะห์ได้",
          priceForecast: parsed.priceForecast || { threeMonth: "-", oneYear: "-", bestTimeToBuy: "-" },
          planA: parsed.planA || { title: "Plan A", action: "-", financial: "-", risk: "-", qty: 0 },
          planB: parsed.planB || { title: "Plan B", action: "-", financial: "-", risk: "-", qty: 0 },
          executiveSummary: parsed.executiveSummary || "",
          raw: content,
        });
      } catch {
        setAiResult({
          demandAnalysis: "AI วิเคราะห์แล้ว (ดูรายละเอียดด้านล่าง)",
          marketAnalysis: "กรุณาดู Raw AI Response ด้านล่าง",
          supplierAnalysis: "กรุณาดู Raw AI Response ด้านล่าง",
          priceForecast: { threeMonth: "-", oneYear: "-", bestTimeToBuy: "-" },
          planA: { title: "ดูคำแนะนำ AI ด้านล่าง", action: content.substring(0, 300), financial: "-", risk: "-", qty: mat?.eoq || 0 },
          planB: { title: "ทางเลือกสำรอง", action: "กรุณาอ่านคำแนะนำ AI", financial: "-", risk: "-", qty: 0 },
          executiveSummary: "",
          raw: content,
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
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* ═══ HERO HEADER ═══ */}
      <header className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white">
        <div className="max-w-[1400px] mx-auto px-8 pt-6 pb-8">
          <button onClick={onClose} className="mb-5 inline-flex items-center gap-2 text-[12px] text-white/60 hover:text-white transition font-medium cursor-pointer">
            <ArrowLeft size={14} /> กลับหน้า Risk Management
          </button>

          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white/80 uppercase mb-3">
                <Sparkles size={13} />
                AI-Powered Analysis • AWS Bedrock + RAG
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-tight">
                {material?.name || targetMaterialId}
              </h1>
              <p className="mt-1.5 text-[13px] text-white/60 font-medium">
                รหัส SAP: {material?.sapCode || targetMaterialId} • {material?.category || 'หม้อแปลงไฟฟ้า'}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[110px]">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">สต็อกเหลือ</div>
                <div className={`text-[30px] font-black leading-none ${stockPercent < 30 ? 'text-red-300' : 'text-white'}`}>{daysOfStock}</div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">วัน</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[110px]">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Safety Stock</div>
                <div className={`text-[30px] font-black leading-none ${stockPercent < 30 ? 'text-red-300' : 'text-amber-300'}`}>{stockPercent}%</div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">ของเกณฑ์</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[130px]">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">ราคาต่อหน่วย</div>
                <div className="text-[24px] font-black leading-none">{formatCurrency(material?.unitPrice || 0)}</div>
                <div className="text-[11px] text-white/50 font-medium mt-0.5">ราคากลาง: {formatCurrency(material?.budgetPrice || 0)}</div>
              </div>
            </div>
          </div>

          {/* Live Data Chips */}
          <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
            {[
              { label: "สต็อก", value: `${material?.currentStock?.toLocaleString()} ${material?.unit}`, icon: "📦" },
              { label: "Safety Stock", value: `${material?.safetyStock?.toLocaleString()} ${material?.unit}`, icon: "🔴" },
              { label: "Demand/เดือน", value: `${material?.avgMonthlyDemand?.toLocaleString()} (σ=${material?.stdMonthlyDemand})`, icon: "📈" },
              { label: "Lead Time", value: `${material?.leadTimeWeeks} สัปดาห์`, icon: "⏱️" },
              { label: "EOQ", value: `${material?.eoq?.toLocaleString()} ${material?.unit}`, icon: "🎯" },
              { label: "แผน 2569", value: `${material?.annualDemand?.toLocaleString()} ${material?.unit}`, icon: "📋" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <span>{item.icon}</span>
                <span className="text-white/50">{item.label}:</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="max-w-[1400px] mx-auto px-8 py-6 space-y-6">

        {/* Loading */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><Brain className="text-purple-600 animate-pulse" size={30} /></div>
            </div>
            <div className="text-center">
              <div className="text-[18px] font-bold text-slate-800">AI กำลังวิเคราะห์ข้อมูลจริง...</div>
              <div className="text-[13px] text-slate-500 mt-2">Amazon Nova Pro + PEA Knowledge Base (RAG)</div>
              <div className="text-[12px] text-purple-600 mt-3 font-medium animate-pulse">ส่งข้อมูลสต็อก {material?.currentStock} {material?.unit}, Demand {material?.avgMonthlyDemand}/{material?.unit}/เดือน, Lead Time {material?.leadTimeWeeks} สัปดาห์...</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <AlertTriangle className="text-amber-500" size={48} />
            <div className="text-[15px] font-bold text-slate-800">ไม่สามารถเชื่อมต่อ AI ได้</div>
            <div className="text-[13px] text-slate-500 max-w-md text-center">{error}</div>
            <button onClick={() => { hasCalledRef.current = false; callAI(); }} className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-[13px] font-bold cursor-pointer hover:bg-purple-700 transition">ลองอีกครั้ง</button>
          </div>
        )}

        {/* ═══ AI RESULTS ═══ */}
        {aiResult && !isAnalyzing && (
          <>
            {/* Row 1: Price Chart + 3 Analysis Cards */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Price Chart */}
              <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500" /> แนวโน้มราคาตลาด</h2>
                    <p className="text-[11px] text-slate-400 mt-1">แหล่งข้อมูล: ประวัติใบสั่งซื้อ PEA (SAP) • ดัชนีราคาโลหะโลก (LME) • ราคากลางกระทรวงพาณิชย์</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 border border-emerald-100">
                    <TrendingDown size={13} /> ราคามีแนวโน้มลดลง
                  </div>
                </div>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulation.priceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `฿${(val/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} formatter={(value: any, name: any) => [formatCurrency(Number(value) || 0), name === 'price' ? "ปีปัจจุบัน (Forecast)" : "ปีก่อนหน้า"]} />
                      <ReferenceLine x="May" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="lastYearPrice" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3 Analysis Cards */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target size={13} /> ทำไมต้องสั่ง? (Demand)</div>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.demandAnalysis}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><BarChart3 size={13} /> เปิดประมูลเมื่อไหร่? (Market)</div>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.marketAnalysis}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap size={13} /> ต้องเริ่มสั่งเมื่อไหร่? (Supplier)</div>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.supplierAnalysis}</p>
                </div>
              </div>
            </div>

            {/* Price Forecast Section */}
            {aiResult.priceForecast && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <TrendingDown size={18} className="text-indigo-500" /> AI คาดการณ์ราคา (Price Forecast)
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">📊 อีก 3 เดือนข้างหน้า</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.priceForecast.threeMonth}</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                    <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">📈 อีก 1 ปีข้างหน้า</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{aiResult.priceForecast.oneYear}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">🎯 ช่วงเวลาที่ดีที่สุดในการซื้อ</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-bold">{aiResult.priceForecast.bestTimeToBuy}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            {aiResult.executiveSummary && (
              <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={18} className="text-purple-600" />
                  <span className="text-[13px] font-bold text-purple-800 uppercase tracking-wider">สรุปสำหรับผู้บริหาร (Executive Summary)</span>
                </div>
                <p className="text-[15px] leading-relaxed font-semibold text-slate-800">{aiResult.executiveSummary}</p>
              </div>
            )}

            {/* Two Plans Side by Side */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Plan A */}
              <div className="rounded-2xl border-2 border-emerald-400 bg-white p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 text-[10px] font-bold rounded-bl-2xl flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> AI แนะนำ
                </div>
                <h3 className="text-[18px] font-bold text-emerald-800 mb-1">Plan A: {aiResult.planA.title}</h3>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">📋 ขั้นตอนปฏิบัติงาน</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{aiResult.planA.action}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">💰 ผลกระทบทางการเงิน</div>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{aiResult.planA.financial}</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={11} /> ความเสี่ยง & วิธีรับมือ</div>
                    <p className="text-[12px] text-amber-800 leading-relaxed">{aiResult.planA.risk}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[12px] text-slate-500 font-medium">จำนวน: {aiResult.planA.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planA.qty * (material?.unitPrice || 0))}</div>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan A: ${aiResult.planA.title}`, action: aiResult.planA.action, qty: aiResult.planA.qty, risk: aiResult.planA.risk, financial: aiResult.planA.financial, unitPrice: material?.unitPrice || 0 } }));
                      if (onClose) onClose();
                      setTimeout(() => setActiveTab?.("activity"), 300);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[13px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> เลือกแผนนี้ → วางแผนจัดซื้อ
                  </button>
                </div>
              </div>

              {/* Plan B */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 relative overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                <h3 className="text-[18px] font-bold text-slate-700 mb-1">Plan B: {aiResult.planB.title}</h3>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">📋 ขั้นตอนปฏิบัติงาน</div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{aiResult.planB.action}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">💰 ผลกระทบทางการเงิน</div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{aiResult.planB.financial}</p>
                  </div>
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                    <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldAlert size={11} /> ความเสี่ยง & วิธีรับมือ</div>
                    <p className="text-[12px] text-red-800 leading-relaxed">{aiResult.planB.risk}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[12px] text-slate-400 font-medium">จำนวน: {aiResult.planB.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planB.qty * (material?.unitPrice || 0))}</div>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan B: ${aiResult.planB.title}`, action: aiResult.planB.action, qty: aiResult.planB.qty, risk: aiResult.planB.risk, financial: aiResult.planB.financial, unitPrice: (material?.unitPrice || 150000) * 1.15 } }));
                      if (onClose) onClose();
                      setTimeout(() => setActiveTab?.("activity"), 300);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-5 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <AlertTriangle size={16} className="text-amber-500" /> เลือก Plan B
                  </button>
                </div>
              </div>
            </div>

            {/* Raw AI Response */}
            {aiResult.raw && (
              <details className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <summary className="px-6 py-4 text-[12px] font-bold text-slate-400 cursor-pointer hover:bg-slate-50 transition flex items-center gap-2">
                  <Brain size={14} className="text-purple-500" /> ดู Raw AI Response จาก Amazon Nova Pro
                  {!isAnalyzing && (
                    <button onClick={(e) => { e.preventDefault(); hasCalledRef.current = false; callAI(); }} className="ml-auto text-purple-600 hover:text-purple-800 flex items-center gap-1 text-[11px] font-bold">
                      <RefreshCw size={12} /> วิเคราะห์ใหม่
                    </button>
                  )}
                </summary>
                <div className="px-6 pb-6 text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto font-mono border-t border-slate-100 pt-4">{aiResult.raw}</div>
              </details>
            )}
          </>
        )}
      </main>
    </div>
  );
}
