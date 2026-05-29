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

  const defaultQty = material ? (material.safetyStock > material.currentStock ? material.safetyStock - material.currentStock : material.eoq || 800) : 800;
  const annualDemand = material?.annualDemand || aiResult?.lotStrategy?.totalQty || defaultQty;
  const quarterlyDemand = Math.ceil(annualDemand / 4);
  const targetDemand = quarterlyDemand;
  const unit = material?.unit || "เครื่อง";
  const monthlyDemand = Math.ceil(targetDemand / 3);

  const getDemandSourceLabel = () => {
    if (material) {
      if (annualDemand === material.annualDemand) return `แผนความต้องการจัดซื้อรายปี 2569`;
      if (annualDemand === material.eoq) return `ปริมาณสั่งซื้อ EOQ ตามระบบ ERP`;
    }
    return `การประเมินความต้องการจากระบบ AI`;
  };

  // Chart Data - quarterly view
  const quarterLabels = ["รอบ 1 (พ.ค. 69)", "รอบ 2 (ส.ค. 69)", "รอบ 3 (พ.ย. 69)", "รอบ 4 (ก.พ. 70)"];
  const marketChartData = quarterLabels.map(label => ({
    month: label,
    demand: quarterlyDemand,
    capacity: totalMonthlyMarketCapacity * 3,
  }));

  // AI Lot Strategy - Quarterly Allocation (4 rounds)
  const sortedVendors = [...processedVendors].sort((a, b) => b.availableCapacity - a.availableCapacity);
  const lotStrategy: any[] = [];
  let lotNumber = 1;
  const quarterNames = ["รอบ 1 (พ.ค. 69)", "รอบ 2 (ส.ค. 69)", "รอบ 3 (พ.ย. 69)", "รอบ 4 (ก.พ. 70)"];
  const standardRatios = [0.4, 0.3, 0.3];

  for (let q = 0; q < 4; q++) {
    const qDemand = q < 3 ? quarterlyDemand : annualDemand - quarterlyDemand * 3;
    let remaining = qDemand;
    let ratioIndex = 0;
    let vendorIdx = 0;

    while (remaining > 0 && vendorIdx < sortedVendors.length) {
      const v = sortedVendors[vendorIdx];
      let idealQty = Math.ceil(qDemand * (standardRatios[ratioIndex] || 0.2));
      if (idealQty > remaining) idealQty = remaining;

      const allocated = Math.min(idealQty, v.availableCapacity);
      if (allocated > 0) {
        lotStrategy.push({
          lot: `Lot ${lotNumber} (${quarterNames[q]})`,
          qty: allocated,
          vendor: v.name,
          confidence: Math.floor(v.reliabilityScore * 100),
          reason: `รอบที่ ${q + 1}: กำลังผลิตสุทธิ (${v.availableCapacity} ${unit}/เดือน) รับ Lot นี้ได้ (${allocated} ${unit})`
        });
        remaining -= allocated;
        lotNumber++;
      }
      vendorIdx++;
      ratioIndex++;
    }
  }

  // Dynamic AI Insight Text
  const maxSingleVendorCapacity = sortedVendors.length > 0 ? sortedVendors[0].availableCapacity : 0;
  const isSingleVendorEnough = maxSingleVendorCapacity >= targetDemand;

  // Holding Cost Comparison
  const holdingCostRate = 0.20;
  const unitCost = material?.unitPrice || 150000;
  const singleHoldingCost = Math.round(annualDemand * unitCost * holdingCostRate * 0.5);
  const phasedHoldingCost = Math.round(annualDemand * unitCost * holdingCostRate * 0.2);
  const holdingSavings = singleHoldingCost - phasedHoldingCost;

  let aiInsightText = "";
  const quarterlyCapacity = totalMonthlyMarketCapacity * 3;
  if (quarterlyCapacity >= quarterlyDemand) {
    aiInsightText = `กำลังผลิตรวมต่อไตรมาส (${quarterlyCapacity.toLocaleString()} ${unit}) เพียงพอรับยอด ${quarterlyDemand.toLocaleString()} ${unit}/รอบ ได้อย่างสบาย ไม่มี Unfulfilled AI จึงแนะนำทยอยซื้อ 4 รอบ รอบละ 3 Lot (อัตรา 40%, 30%, 30%) ช่วยลด Holding Cost จาก ฿${singleHoldingCost.toLocaleString()} เหลือ ฿${phasedHoldingCost.toLocaleString()} (ประหยัด ฿${holdingSavings.toLocaleString()}/ปี)`;
  } else {
    aiInsightText = `กำลังผลิตต่อไตรมาส (${quarterlyCapacity.toLocaleString()} ${unit}) ไม่เพียงพอต่อความต้องการ ${quarterlyDemand.toLocaleString()} ${unit}/รอบ อาจต้องขยายเป็น 5 รอบแทน`;
  }

  const qtys = lotStrategy.map((l: any) => l.qty).join(', ');
  const draftTOR = `1. กฟภ. ขอสงวนสิทธิ์ในการแบ่งการสั่งซื้อพัสดุ (Lot Splitting) ออกเป็น ${lotStrategy.length} สัญญา (${qtys} ${unit}) เพื่อลดความเสี่ยงในการส่งมอบล่าช้า
2. ผู้เสนอราคาแต่ละราย สามารถเสนอราคาและเป็นผู้ชนะการประกวดราคาได้มากกว่า 1 สัญญา แต่ต้องแสดงหลักฐานกำลังการผลิตคงเหลือ (Available Factory Capacity) ที่ผ่านการรับรอง ไม่น้อยกว่ายอดรวมของสัญญาที่ชนะ
3. หากผู้ชนะไม่สามารถส่งมอบได้ตามแผน กฟภ. มีสิทธิ์เรียกผู้ชนะในลำดับถัดไปเพื่อเจรจาทันทีโดยไม่ต้องประมูลใหม่`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftTOR);
    alert("คัดลอกร่างเงื่อนไข TOR เรียบร้อยแล้ว");
  };


  const exportVendorCapacity = () => {
    const headers = ["ชื่อผู้ผลิต (Vendor)", "กำลังผลิตจดทะเบียน (Capacity)", "ยอดค้างส่ง (Backlog)", "Reliability Score", "กำลังผลิตสุทธิ (Available)"];
    const rows = processedVendors.map((v: any) => [
      v.name, v.registeredCapacity, v.outstandingPOs, v.reliability, v.availableCapacity
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "vendor_capacity.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportLotAllocation = () => {
    const strategy = aiResult?.lotStrategy?.strategy || [];
    const headers = ["Lot No.", "ชื่อผู้ผลิต (Vendor)", "จำนวนที่จัดสรร", "เหตุผลการจัดสรร (AI Reason)"];
    const rows = strategy.map((lot: any, idx: number) => [
      idx + 1, lot.vendor, lot.allocation, `"${(lot.reason || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "lot_allocation.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-transparent text-slate-800 mt-6">
      <div className="w-full space-y-6">
        
        {/* Left Col: Market Capacity vs Demand */}
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex flex-col sm:flex-row sm:items-center gap-2 text-slate-800">
              <div className="flex items-center gap-2">
                <Factory size={18} className="text-indigo-500" />
                ภาพรวมตลาด vs ความต้องการ ({annualDemand.toLocaleString()} {unit}/ปี = {quarterlyDemand.toLocaleString()} {unit}/รอบ)
              </div>
              <span className="text-xs font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                (อ้างอิง: {getDemandSourceLabel()})
              </span>
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
                  <Bar dataKey="demand" name="Demand ของ กฟภ. ต่อรอบ" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="capacity" name="Available Capacity รวมต่อไตรมาส" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <ReferenceLine y={quarterlyDemand} label={{ position: 'top', value: `เป้าหมายต่อรอบ ${quarterlyDemand.toLocaleString()} ${unit}`, fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
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

          {/* Vendors Capacity Table (Excel Style) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" />
                  ข้อมูลศักยภาพผู้ผลิต (Vendor Reliability Database)
                </h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-200 text-slate-700 text-[14px]">
                    <th className="p-2 border border-slate-300 font-bold text-center">ชื่อผู้ผลิต (Vendor)</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">กำลังผลิตจดทะเบียน<br/>(Capacity)</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">ยอดค้างส่ง (Backlog)</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">Reliability Score</th>
                    <th className="p-2 border border-slate-300 font-bold text-center bg-indigo-100 text-indigo-800">กำลังผลิตสุทธิ<br/>(Available)</th>
                  </tr>
                </thead>
                <tbody>
                  {processedVendors.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50 text-[14px] bg-white">
                      <td className="p-2 border border-slate-300 font-medium text-slate-800">{v.name}</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-600">{v.registeredCapacity}</td>
                      <td className="p-2 border border-slate-300 text-center text-rose-500 font-medium">{v.outstandingPOs}</td>
                      <td className="p-2 border border-slate-300 text-center">
                        <span className={`px-2 py-0.5 rounded text-[12px] font-bold ${v.reliabilityScore >= 0.9 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {(v.reliabilityScore * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-sky-600 bg-sky-50">{v.availableCapacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Lot Allocation Table (Excel Style) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                  <Brain size={18} className="text-indigo-600" />
                  ตารางแผนกระจายการจัดสรรพัสดุ (AI Lot Allocation)
                </h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-200 text-slate-700 text-[14px]">
                    <th className="p-2 border border-slate-300 font-bold text-center">รอบจัดส่ง / Lot No.</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">ผู้ผลิตที่ได้งาน</th>
                    <th className="p-2 border border-slate-300 font-bold text-center bg-emerald-100 text-emerald-800">จำนวนที่จัดสรร</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">เหตุผลการจัดสรร (AI Reason)</th>
                  </tr>
                </thead>
                <tbody>
                  {lotStrategy.map((lot: any, idx: number) => {
                  
  const exportVendorCapacity = () => {
    const headers = ["ชื่อผู้ผลิต (Vendor)", "กำลังผลิตจดทะเบียน (Capacity)", "ยอดค้างส่ง (Backlog)", "Reliability Score", "กำลังผลิตสุทธิ (Available)"];
    const rows = processedVendors.map((v: any) => [
      v.name, v.registeredCapacity, v.outstandingPOs, v.reliability, v.availableCapacity
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "vendor_capacity.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportLotAllocation = () => {
    const strategy = aiResult?.lotStrategy?.strategy || [];
    const headers = ["Lot No.", "ชื่อผู้ผลิต (Vendor)", "จำนวนที่จัดสรร", "เหตุผลการจัดสรร (AI Reason)"];
    const rows = strategy.map((lot: any, idx: number) => [
      idx + 1, lot.vendor, lot.allocation, `"${(lot.reason || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "lot_allocation.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
                      <tr key={idx} className="hover:bg-slate-50 text-[14px] bg-white">
                        <td className="p-2 border border-slate-300 text-center text-slate-600 font-medium bg-slate-50">{lot.lot}</td>
                        <td className="p-2 border border-slate-300 text-indigo-700 font-bold">{lot.vendor}</td>
                        <td className="p-2 border border-slate-300 text-center font-black text-slate-800 bg-emerald-50">{lot.qty.toLocaleString()}</td>
                        <td className="p-2 border border-slate-300 text-slate-600 text-[13px]">{lot.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Draft TOR (Moved to bottom for horizontal layout) */}
      <div className="mt-6 w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-amber-600" />
              ร่างเงื่อนไขและข้อกำหนด TOR (Draft TOR Conditions)
            </h3>
            <p className="text-[12px] text-slate-500 mt-1">ข้อกำหนดสำหรับการจัดสรรโควต้าตามความสามารถของผู้ผลิต</p>
          </div>
          <button onClick={copyToClipboard} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-white p-2 rounded-lg border border-slate-200 shadow-sm" title="คัดลอกร่าง TOR">
            <Copy size={16} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-[13px] text-slate-800 leading-loose whitespace-pre-line font-medium">
            {draftTOR}
          </p>
        </div>
        <div className="px-5 pb-5 flex items-start gap-2 text-xs text-amber-700/80 font-medium">
          <ShieldCheck size={14} className="shrink-0 mt-0.5" />
          <p>เงื่อนไขนี้สอดคล้องกับระเบียบจัดซื้อฯ โดยเปิดโอกาสให้มีการแข่งขันราคาอย่างเป็นธรรม (Fair Competition) และปิดความเสี่ยงเรื่องผู้ชนะทิ้งงาน</p>
        </div>
      </div>
    </div>
  );
}
