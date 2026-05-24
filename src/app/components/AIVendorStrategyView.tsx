"use client";

import React from "react";
import { Brain, ShieldCheck, Factory, TrendingUp, CheckCircle2, Copy, FileText, Sparkles } from "lucide-react";
import { useData } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

export default function AIVendorStrategyView({ aiResult, material }: { aiResult?: any, material?: any }) {
  const { vendors } = useData();

  // Process Vendor Data
  const processedVendors = (vendors || []).map((v: any) => ({
    ...v,
    availableCapacity: Math.floor((v.registeredCapacity - v.outstandingPOs) * v.reliabilityScore)
  }));

  const totalMonthlyMarketCapacity = processedVendors.reduce((acc: number, v: any) => acc + v.availableCapacity, 0);

  const targetDemand = material?.annualDemand || aiResult?.lotStrategy?.totalQty || 800;
  const unit = material?.unit || "เครื่อง";
  const monthlyDemand = Math.ceil(targetDemand / 4);

  // Mock Market Chart Data
  const marketChartData = [
    { month: "พ.ค. 69", demand: monthlyDemand, capacity: totalMonthlyMarketCapacity },
    { month: "มิ.ย. 69", demand: monthlyDemand, capacity: totalMonthlyMarketCapacity },
    { month: "ก.ค. 69", demand: monthlyDemand, capacity: totalMonthlyMarketCapacity },
    { month: "ส.ค. 69", demand: monthlyDemand, capacity: totalMonthlyMarketCapacity },
  ];

  // AI Lot Strategy (Dynamic Calculation based on capacity)
  let remainingDemand = targetDemand;
  const lotStrategy: any[] = [];
  
  // Sort vendors by effective capacity, descending
  const sortedVendors = [...processedVendors].sort((a, b) => b.availableCapacity - a.availableCapacity);

  sortedVendors.forEach((vendor, idx) => {
    if (remainingDemand <= 0) return;
    
    // Allocate either their full capacity or whatever demand is left, whichever is smaller
    const allocateQty = Math.min(vendor.availableCapacity, remainingDemand);
    
    if (allocateQty <= 0) return;

    lotStrategy.push({
      lot: `Lot ${idx + 1}${idx === 0 ? " (ด่วน)" : ""}`,
      qty: allocateQty,
      vendor: vendor.name,
      confidence: Math.floor(vendor.reliabilityScore * 100)
    });

    remainingDemand -= allocateQty;
  });

  // If there's still demand left (market capacity < demand), assign the rest to the top vendor
  if (remainingDemand > 0 && lotStrategy.length > 0) {
    lotStrategy[0].qty += remainingDemand;
  }

  // Dynamic AI Insight Text
  const maxSingleVendorCapacity = sortedVendors.length > 0 ? sortedVendors[0].availableCapacity : 0;
  const isSingleVendorEnough = maxSingleVendorCapacity >= targetDemand;

  let aiInsightText = "";
  if (!isSingleVendorEnough) {
    aiInsightText = `กำลังผลิตรวมตลาดเพียงพอสำหรับ ${targetDemand} ${unit} แต่เนื่องจากผู้ผลิตแต่ละรายมียอดค้างส่ง (Outstanding POs) สูง ทำให้ไม่มีโรงงานใดมี "กำลังผลิตคงเหลือ (Available Capacity)" พอรับยอดเต็มจำนวนได้ในสัญญาเดียว (รับได้สูงสุดเพียง ${maxSingleVendorCapacity} ${unit}/ราย) ระบบ AI จึงออกแบบกลยุทธ์กระจายสัญญา (Lot Splitting) ออกเป็น ${lotStrategy.length} สัญญาเพื่ออุดรอยรั่วและรับประกันการส่งมอบ 100%`;
  } else {
    aiInsightText = `กำลังผลิตจริงของผู้ผลิตรายใหญ่เพียงพอสำหรับรับยอด ${targetDemand} ${unit} ในสัญญาเดียว สามารถเปิดประกวดราคาแบบสัญญาเดียวได้ อย่างไรก็ตามการแบ่ง Lot อาจช่วยเพิ่มการแข่งขันด้านราคาได้`;
  }

  const qtys = lotStrategy.map((l: any) => l.qty).join(', ');
  const draftTOR = `1. กฟภ. ขอสงวนสิทธิ์ในการแบ่งการสั่งซื้อพัสดุ (Lot Splitting) ออกเป็น ${lotStrategy.length} สัญญา (${qtys} ${unit}) เพื่อลดความเสี่ยงในการส่งมอบล่าช้า
2. ผู้เสนอราคาแต่ละราย สามารถเสนอราคาและเป็นผู้ชนะการประกวดราคาได้มากกว่า 1 สัญญา แต่ต้องแสดงหลักฐานกำลังการผลิตคงเหลือ (Available Factory Capacity) ที่ผ่านการรับรอง ไม่น้อยกว่ายอดรวมของสัญญาที่ชนะ
3. หากผู้ชนะไม่สามารถส่งมอบได้ตามแผน กฟภ. มีสิทธิ์เรียกผู้ชนะในลำดับถัดไปเพื่อเจรจาทันทีโดยไม่ต้องประมูลใหม่`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftTOR);
    alert("คัดลอกร่างเงื่อนไข TOR เรียบร้อยแล้ว");
  };

  return (
    <div className="bg-white text-slate-800 p-6 md:p-8 rounded-2xl mt-8 border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100">
            <Brain className="text-indigo-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            AI Procurement Strategy (TOR Optimizer)
          </h1>
        </div>
        <p className="text-slate-500">
          วิเคราะห์กำลังการผลิตของตลาด (Market Capacity) และออกแบบกลยุทธ์จัดซื้อเพื่ออุดความเสี่ยงส่งมอบล่าช้า
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Market Capacity vs Demand */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <Factory size={18} className="text-indigo-500" />
              ภาพรวมตลาด vs ความต้องการ ({targetDemand} {unit})
            </h2>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                    itemStyle={{ color: '#1e293b' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="demand" name="Demand ของ กฟภ." fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="capacity" name="Available Capacity รวมของตลาด" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <ReferenceLine y={targetDemand} label={{ position: 'top', value: `เป้าหมายจัดซื้อ ${targetDemand} ${unit}`, fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
              <Brain size={20} className="text-indigo-600 mt-0.5 shrink-0" />
              <p className="text-sm text-indigo-900 leading-relaxed">
                <strong>AI Insight:</strong> {aiInsightText}
              </p>
            </div>
          </div>

          {/* Vendors Capacity Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <TrendingUp size={18} className="text-emerald-500" />
              ข้อมูลศักยภาพผู้ผลิต (Vendor Reliability Database)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3 text-center">Registered<br/>Capacity</th>
                    <th className="px-4 py-3 text-center">Outstanding<br/>POs (ค้างส่ง)</th>
                    <th className="px-4 py-3 text-center">Reliability<br/>Score</th>
                    <th className="px-4 py-3 text-center">Effective Available<br/>(เครื่อง/เดือน)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedVendors.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{v.name}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{v.registeredCapacity}</td>
                      <td className="px-4 py-3 text-center text-rose-500">{v.outstandingPOs}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${v.reliabilityScore >= 0.9 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {(v.reliabilityScore * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-sky-600">{v.availableCapacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Strategy Optimizer */}
        <div className="space-y-6">
          {/* Strategy View */}
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Brain size={100} className="text-indigo-900" />
            </div>
            <h2 className="text-lg font-bold mb-2 text-indigo-900">AI Strategy Optimizer</h2>
            <p className="text-sm text-indigo-700/80 mb-6">สร้างกลยุทธ์การจัดซื้อที่อุดรอยรั่วทางกฎหมายและได้พัสดุตรงเวลา 100%</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-emerald-800">Strategy Generated</div>
                  <div className="text-xs text-emerald-600">Recommended Multiple Awards</div>
                </div>
              </div>

              <div className="space-y-3">
                {lotStrategy.map((lot: any, idx: number) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-indigo-600">{lot.lot}</span>
                      <span className="text-xs font-medium text-slate-500">Target: {lot.qty} {unit}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-700 truncate">{lot.vendor}</div>
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-1.5 rounded-full" style={{ width: `${lot.confidence}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Draft TOR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-bold flex items-center gap-2 text-amber-600">
                <FileText size={18} />
                Draft TOR Conditions
              </h2>
              <button onClick={copyToClipboard} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Copy TOR">
                <Copy size={16} />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-mono font-medium">
                {draftTOR}
              </p>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs text-amber-700/80 font-medium">
              <ShieldCheck size={14} className="shrink-0 mt-0.5" />
              <p>เงื่อนไขนี้สอดคล้องกับระเบียบจัดซื้อฯ โดยเปิดโอกาสให้มีการแข่งขันราคาอย่างเป็นธรรม (Fair Competition) และปิดความเสี่ยงเรื่องผู้ชนะทิ้งงาน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
