"use client";

import React, { useState } from "react";
import { Brain, ShieldCheck, Factory, AlertTriangle, TrendingUp, Box, CheckCircle2, Copy, FileText, Sparkles } from "lucide-react";
import { useData } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

export default function AIVendorStrategyView() {
  const { vendors } = useData();
  const [analyzed, setAnalyzed] = useState(false);

  // Hardcode 800 units for this PoC scenario
  const targetDemand = 800;
  const targetMonths = 4;

  // Process Vendor Data
  const processedVendors = (vendors || []).map((v: any) => ({
    ...v,
    availableCapacity: Math.floor((v.registeredCapacity - v.outstandingPOs) * v.reliabilityScore)
  }));

  const totalMonthlyMarketCapacity = processedVendors.reduce((acc: number, v: any) => acc + v.availableCapacity, 0);

  // Mock Market Chart Data
  const marketChartData = [
    { month: "พ.ค. 69", demand: 200, capacity: totalMonthlyMarketCapacity },
    { month: "มิ.ย. 69", demand: 200, capacity: totalMonthlyMarketCapacity },
    { month: "ก.ค. 69", demand: 200, capacity: totalMonthlyMarketCapacity },
    { month: "ส.ค. 69", demand: 200, capacity: totalMonthlyMarketCapacity },
  ];

  // AI Lot Strategy
  const lotStrategy = [
    { lot: "Lot 1 (ด่วน)", qty: 300, vendor: "บริษัท ไทยทรานสฟอร์มเมอร์ จำกัด", confidence: 95 },
    { lot: "Lot 2", qty: 300, vendor: "บริษัท เมโทร สมาร์ท กริด", confidence: 85 },
    { lot: "Lot 3", qty: 200, vendor: "บริษัท สยามอิเล็คทริค อินดัสทรี", confidence: 88 },
  ];

  const draftTOR = `1. กฟภ. ขอสงวนสิทธิ์ในการแบ่งการสั่งซื้อพัสดุ (Lot Splitting) ออกเป็น 3 สัญญา (300, 300 และ 200 เครื่อง) เพื่อลดความเสี่ยงในการส่งมอบล่าช้า
2. ผู้เสนอราคาแต่ละราย สามารถเสนอราคาและเป็นผู้ชนะการประกวดราคาได้มากกว่า 1 สัญญา แต่ต้องแสดงหลักฐานกำลังการผลิตคงเหลือ (Available Factory Capacity) ที่ผ่านการรับรอง ไม่น้อยกว่ายอดรวมของสัญญาที่ชนะ
3. หากผู้ชนะไม่สามารถส่งมอบได้ตามแผน กฟภ. มีสิทธิ์เรียกผู้ชนะในลำดับถัดไปเพื่อเจรจาทันทีโดยไม่ต้องประมูลใหม่`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftTOR);
    alert("คัดลอกร่างเงื่อนไข TOR เรียบร้อยแล้ว");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 text-white p-6 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-sky-500/20 p-2 rounded-lg">
            <Brain className="text-sky-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            AI Procurement Strategy (TOR Optimizer)
          </h1>
        </div>
        <p className="text-slate-400">
          วิเคราะห์กำลังการผลิตของตลาด (Market Capacity) และออกแบบกลยุทธ์จัดซื้อเพื่ออุดความเสี่ยงส่งมอบล่าช้า
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Market Capacity vs Demand */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Factory size={18} className="text-indigo-400" />
              ภาพรวมตลาด vs ความต้องการ (800 เครื่อง)
            </h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="demand" name="Demand ของ กฟภ." fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="capacity" name="Available Capacity รวมของตลาด" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <ReferenceLine y={800} label={{ position: 'top', value: 'เป้าหมายจัดซื้อ 800 เครื่อง', fill: '#f43f5e', fontSize: 12 }} stroke="#f43f5e" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-start gap-3">
              <Brain size={20} className="text-sky-400 mt-0.5 shrink-0" />
              <p className="text-sm text-sky-200 leading-relaxed">
                <strong>AI Insight:</strong> หากสั่งซื้อ 800 เครื่องในสัญญาเดียว จะไม่มีโรงงานใดในประเทศที่สามารถผลิตได้ทันใน 1 เดือน (กำลังผลิตสูงสุดต่อโรงงาน ≈ 400 เครื่อง) ความเสี่ยงที่ กฟภ. จะได้ของล่าช้าสูงถึง 85% แนะนำให้กระจายสัญญา (Lot Splitting)
              </p>
            </div>
          </div>

          {/* Vendors Capacity Table */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              ข้อมูลศักยภาพผู้ผลิต (Vendor Reliability Database)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3 text-center">Registered<br/>Capacity</th>
                    <th className="px-4 py-3 text-center">Outstanding<br/>POs (ค้างส่ง)</th>
                    <th className="px-4 py-3 text-center">Reliability<br/>Score</th>
                    <th className="px-4 py-3 text-center">Effective Available<br/>(เครื่อง/เดือน)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {processedVendors.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-200">{v.name}</td>
                      <td className="px-4 py-3 text-center text-slate-400">{v.registeredCapacity}</td>
                      <td className="px-4 py-3 text-center text-rose-400">{v.outstandingPOs}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs ${v.reliabilityScore >= 0.9 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {(v.reliabilityScore * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-sky-400">{v.availableCapacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Strategy Optimizer */}
        <div className="space-y-6">
          {/* Generate Button / Status */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain size={100} />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-white">AI Strategy Optimizer</h2>
            <p className="text-sm text-indigo-200 mb-6">สร้างกลยุทธ์การจัดซื้อที่อุดรอยรั่วทางกฎหมายและได้พัสดุตรงเวลา 100%</p>
            
            {!analyzed ? (
              <button 
                onClick={() => setAnalyzed(true)}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Generate TOR Strategy
              </button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-200">Strategy Generated</div>
                    <div className="text-xs text-emerald-300/70">Recommended Multiple Awards</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {lotStrategy.map((lot, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-sky-400">{lot.lot}</span>
                        <span className="text-xs text-slate-400">Target: {lot.qty} เครื่อง</span>
                      </div>
                      <div className="text-sm text-slate-300 truncate">{lot.vendor}</div>
                      <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-1.5 rounded-full" style={{ width: `${lot.confidence}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Draft TOR */}
          {analyzed && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm animate-in fade-in duration-500 delay-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-md font-semibold flex items-center gap-2">
                  <FileText size={18} className="text-amber-400" />
                  Draft TOR Conditions
                </h2>
                <button onClick={copyToClipboard} className="text-slate-400 hover:text-white transition-colors" title="Copy TOR">
                  <Copy size={16} />
                </button>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                  {draftTOR}
                </p>
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs text-amber-200/80">
                <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                <p>เงื่อนไขนี้สอดคล้องกับระเบียบจัดซื้อฯ โดยเปิดโอกาสให้มีการแข่งขันราคาอย่างเป็นธรรม (Fair Competition) และปิดความเสี่ยงเรื่องผู้ชนะทิ้งงาน</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
