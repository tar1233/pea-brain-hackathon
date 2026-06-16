"use client";

import React from "react";
import { Brain, ShieldCheck, Factory, TrendingUp, CheckCircle2, Copy, FileText, Sparkles, DollarSign } from "lucide-react";
import { useData } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList } from "recharts";

export default function AIVendorStrategyView({ aiResult, material }: { aiResult?: any, material?: any }) {
  const { vendors } = useData();
  const [capacityUpdated, setCapacityUpdated] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const checkCapacity = () => {
        setCapacityUpdated(sessionStorage.getItem("vendor_capacity_updated") === "true");
      };
      checkCapacity();
      window.addEventListener("vendorCapacityUpdated", checkCapacity);
      return () => window.removeEventListener("vendorCapacityUpdated", checkCapacity);
    }
  }, []);

  // Process Vendor Data
  const processedVendors = (vendors || []).map((v: any) => {
    let registeredCapacity = v.registeredCapacity;
    if (capacityUpdated && (v.name.includes("ไทยทรานสฟอร์มเมอร์") || v.name.includes("ไทยทรานส์ฟอร์เมอร์"))) {
      registeredCapacity = 1000;
    }
    return {
      ...v,
      registeredCapacity,
      availableCapacity: Math.floor((registeredCapacity - v.outstandingPOs) * v.reliabilityScore)
    };
  });

  const totalMonthlyMarketCapacity = processedVendors.reduce((acc: number, v: any) => acc + v.availableCapacity, 0);

  const defaultQty = material ? (material.safetyStock > material.currentStock ? material.safetyStock - material.currentStock : material.eoq || 800) : 800;
  const annualDemand = material?.annualDemand || aiResult?.lotStrategy?.totalQty || defaultQty;
  const lotQty = Math.round(annualDemand / 3);
  const targetDemand = lotQty;
  const unit = material?.unit || "เครื่อง";
  const monthlyDemand = Math.ceil(targetDemand / 3);

  const getDemandSourceLabel = () => {
    if (material) {
      if (annualDemand === material.annualDemand) return `แผนความต้องการจัดซื้อรายปี 2569`;
      if (annualDemand === material.eoq) return `ปริมาณสั่งซื้อ EOQ ตามระบบ ERP`;
    }
    return `การประเมินความต้องการจากระบบ AI`;
  };

  // Chart Data - Lot view (3 Lots)
  const lotLabels = ["Lot 1 (ต.ค.-ธ.ค. 69)", "Lot 2 (ม.ค.-มี.ค. 70)", "Lot 3 (เม.ย.-มิ.ย. 70)"];
  const marketChartData = [
    { month: lotLabels[0], demand: lotQty, capacity: totalMonthlyMarketCapacity * 3 },
    { month: lotLabels[1], demand: lotQty, capacity: totalMonthlyMarketCapacity * 3 },
    { month: lotLabels[2], demand: annualDemand - lotQty * 2, capacity: totalMonthlyMarketCapacity * 3 },
  ];

  // AI Lot Strategy - Lot Allocation (3 Lots)
  const sortedVendors = [...processedVendors].sort((a, b) => b.availableCapacity - a.availableCapacity);
  const lotStrategy: any[] = [];
  const lotNames = ["Lot 1 (ต.ค.-ธ.ค. 69)", "Lot 2 (ม.ค.-มี.ค. 70)", "Lot 3 (เม.ย.-มิ.ย. 70)"];
  const standardRatios = [0.4, 0.3, 0.3];

  for (let l = 0; l < 3; l++) {
    const lDemand = l < 2 ? lotQty : annualDemand - lotQty * 2;
    let remaining = lDemand;
    let ratioIndex = 0;
    let vendorIdx = 0;

    while (remaining > 0 && vendorIdx < sortedVendors.length) {
      const v = sortedVendors[vendorIdx];
      let idealQty = Math.ceil(lDemand * (standardRatios[ratioIndex] || 0.2));
      if (idealQty > remaining) idealQty = remaining;

      // Capped by vendor's 3-month capacity
      const allocated = Math.min(idealQty, v.availableCapacity * 3);
      if (allocated > 0) {
        lotStrategy.push({
          lot: lotNames[l],
          qty: allocated,
          vendor: v.name,
          confidence: Math.floor(v.reliabilityScore * 100),
          reason: `ล็อตที่ ${l + 1}: กำลังผลิตสุทธิสะสม 3 เดือน (${(v.availableCapacity * 3).toLocaleString()} ${unit}) เพียงพอรับยอดจัดสรร (${allocated.toLocaleString()} ${unit})`
        });
        remaining -= allocated;
      }
      vendorIdx++;
      ratioIndex++;
    }

    if (remaining > 0) {
      // If there is still remaining demand, assign it to the vendor with the highest remaining capacity
      for (const v of sortedVendors) {
        const alreadyAllocated = lotStrategy.filter(x => x.lot === lotNames[l] && x.vendor === v.name).reduce((acc, x) => acc + x.qty, 0);
        const maxAvailableForLot = v.availableCapacity * 3;
        const potential = maxAvailableForLot - alreadyAllocated;
        if (potential > 0) {
          const addQty = Math.min(remaining, potential);
          if (addQty > 0) {
            const existingEntry = lotStrategy.find(x => x.lot === lotNames[l] && x.vendor === v.name);
            if (existingEntry) {
              existingEntry.qty += addQty;
            } else {
              lotStrategy.push({
                lot: lotNames[l],
                qty: addQty,
                vendor: v.name,
                confidence: Math.floor(v.reliabilityScore * 100),
                reason: `ล็อตที่ ${l + 1}: จัดสรรเพิ่มเติมตามกำลังผลิตสำรองสะสม (${maxAvailableForLot.toLocaleString()} ${unit})`
              });
            }
            remaining -= addQty;
            if (remaining === 0) break;
          }
        }
      }
    }
  }

  // Dynamic AI Insight Text
  const holdingCostRate = 0.20;
  const unitCost = material?.unitPrice || 150000;
  const singleHoldingCost = Math.round(annualDemand * unitCost * holdingCostRate * 0.5);
  const phasedHoldingCost = Math.round(annualDemand * unitCost * holdingCostRate * 0.2);
  const holdingSavings = singleHoldingCost - phasedHoldingCost;

  const lotCapacity = totalMonthlyMarketCapacity * 3;
  let aiInsightText = "";
  if (lotCapacity >= lotQty) {
    aiInsightText = `กำลังผลิตรวมต่อล็อต (${lotCapacity.toLocaleString()} ${unit}) เพียงพอรับยอดความต้องการต่อล็อต ${lotQty.toLocaleString()} ${unit} ได้อย่างสบาย ไม่มียอด Unfulfilled AI จึงแนะนำทยอยซื้อตามแผน VMI 3 ล็อต (ส่งมอบ ต.ค. 69, ม.ค. 70, เม.ย. 70) ช่วยลด Holding Cost จาก ฿${singleHoldingCost.toLocaleString()} เหลือ ฿${phasedHoldingCost.toLocaleString()} (ประหยัดได้ถึง ฿${holdingSavings.toLocaleString()}/ปี)`;
  } else {
    aiInsightText = `กำลังผลิตรวมต่อล็อต (${lotCapacity.toLocaleString()} ${unit}) ไม่เพียงพอต่อความต้องการ ${lotQty.toLocaleString()} ${unit}/ล็อต อาจต้องพิจารณาผู้ผลิตรายอื่นเพิ่มเติม`;
  }

  const draftTOR = `1. กฟภ. ขอสงวนสิทธิ์ในการแบ่งการส่งมอบพัสดุ (Lot Splitting) ออกเป็น 3 ล็อตหลัก ได้แก่ ล็อตที่ 1 (ต.ค.-ธ.ค. 2569: ${lotQty.toLocaleString()} ${unit}), ล็อตที่ 2 (ม.ค.-มี.ค. 2570: ${lotQty.toLocaleString()} ${unit}) และล็อตที่ 3 (เม.ย.-มิ.ย. 2570: ${(annualDemand - lotQty * 2).toLocaleString()} ${unit}) ตามนโยบาย VMI ของ กฟภ.
2. ผู้เสนอราคาแต่ละราย สามารถเสนอราคาและเป็นผู้ชนะการประกวดราคาได้มากกว่า 1 สัญญา แต่ต้องแสดงหลักฐานกำลังการผลิตคงเหลือสะสม (Available Factory Capacity) ที่ผ่านการรับรองจาก กฟภ. ไม่น้อยกว่ายอดรวมของสัญญา/ล็อตที่ได้รับจัดสรร
3. หากผู้ชนะในล็อตใดล็อตหนึ่งไม่สามารถส่งมอบพัสดุได้ตามกำหนด กฟภ. มีสิทธิ์ส่งแผนเรียกรับ (Call-off) หรือเรียกผู้ชนะในลำดับถัดไปมาดำเนินการแทนทันทีโดยไม่มีการรอปรับปรุงระบบ`;

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
    const headers = ["รอบจัดส่ง / Lot No.", "ชื่อผู้ผลิต (Vendor)", "จำนวนที่จัดสรร", "Reliability Score", "เหตุผลการจัดสรร (AI Reason)"];
    const rows = lotStrategy.map((lot: any) => [
      lot.lot,
      lot.vendor,
      lot.qty,
      `${lot.confidence}%`,
      `"${(lot.reason || '').replace(/"/g, '""')}"`
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
                ภาพรวมตลาด vs ความต้องการ ({annualDemand.toLocaleString()} {unit}/ปี = {lotQty.toLocaleString()} {unit}/ล็อต)
              </div>
              <span className="text-[16.5px] font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
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
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' , fontSize: '13.5px' }}
                    itemStyle={{ color: '#1e293b' }}
                   />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="demand" name="Demand ของ กฟภ. ต่อล็อต" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="capacity" name="Available Capacity รวมต่อล็อต (3 เดือน)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <ReferenceLine y={lotQty} label={{ position: 'top', value: `เป้าหมายต่อล็อต ${lotQty.toLocaleString()} ${unit}`, fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* TCO Comparison Section (Bulk vs VMI Staggered Delivery) */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[16.5px] font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign size={18} className="text-emerald-500" />
                    AI TCO Optimizer (Based on Historical Data)
                  </h3>
                  <p className="text-[16.5px] text-slate-500 mt-1">คำนวณความคุ้มค่าจากประวัติการเบิกจ่ายและราคาในอดีต (Historical Data): การสั่งซื้อครั้งเดียว (Bulk) vs การทยอยส่งมอบ (VMI)</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 px-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shrink-0">
                  <Sparkles size={16} className="text-emerald-600 shrink-0" />
                  <span className="text-[16.5px] font-bold text-emerald-800 whitespace-nowrap">ประหยัดทันที: ฿{(holdingSavings).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="h-[200px] w-full pl-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Bulk Delivery (รับของงวดเดียว)", cost: singleHoldingCost, fill: "#94a3b8" },
                    { name: "VMI Staggered (ทยอยรับ 3 ล็อต)", cost: phasedHoldingCost, fill: "#10b981" }
                  ]} layout="vertical" margin={{ top: 10, right: 80, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={220} tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, "Holding Cost"]} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={32}>
                      <LabelList dataKey="cost" position="right" formatter={(val: any) => `฿${Number(val).toLocaleString()}`} fill="#475569" fontSize={12} fontWeight={700} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3 shadow-inner">
                <Brain size={20} className="text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-[13.5px] text-indigo-900 leading-relaxed font-medium">
                  <strong>AI Strategy Insight:</strong> {aiInsightText}
                </p>
              </div>
            </div>
          </div>

          {/* Vendors Capacity Table (Excel Style) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="text-[16.5px] font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" />
                  ข้อมูลศักยภาพผู้ผลิต (Vendor Reliability Database)
                </h3>
              </div>
              <button 
                onClick={exportVendorCapacity}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-[14px] font-bold shadow-sm cursor-pointer whitespace-nowrap"
              >
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-200 text-slate-700 text-[16.5px]">
                    <th className="p-2 border border-slate-300 font-bold text-center">ชื่อผู้ผลิต (Vendor)</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">กำลังผลิตจดทะเบียน<br/>(Capacity)</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">ยอดค้างส่ง (Backlog)</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">Reliability Score</th>
                    <th className="p-2 border border-slate-300 font-bold text-center bg-indigo-100 text-indigo-800">กำลังผลิตสุทธิ<br/>(Available)</th>
                  </tr>
                </thead>
                <tbody>
                  {processedVendors.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50 text-[16.5px] bg-white">
                      <td className="p-2 border border-slate-300 font-medium text-slate-800">{v.name}</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-600">{v.registeredCapacity}</td>
                      <td className="p-2 border border-slate-300 text-center text-rose-500 font-medium">{v.outstandingPOs}</td>
                      <td className="p-2 border border-slate-300 text-center">
                        <span className={`px-2 py-0.5 rounded text-[16.5px] font-bold ${v.reliabilityScore >= 0.9 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
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
            <div className="flex flex-col p-4 border-b border-slate-200 bg-slate-50 gap-2">
              <div className="flex justify-between items-center">
                <h3 className="text-[16.5px] font-bold text-slate-800 flex items-center gap-2">
                  <Brain size={18} className="text-indigo-600" />
                  จำลองโควตาสูงสุดที่แนะนำต่อผู้ผลิต (AI Call-off Quota Simulation)
                </h3>
                <button 
                  onClick={exportLotAllocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-[14px] font-bold shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Export CSV
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[16.5px] px-3 py-2 rounded-lg font-medium flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0">⚠️ หมายเหตุ:</span>
                <p>ตารางนี้เป็นการจำลองโควตาการสั่งซื้อ (Call-off) ล่วงหน้าภายใต้สัญญา <strong className="font-bold">Framework Agreement ที่ประมูลผ่าน e-Bidding เรียบร้อยแล้ว</strong> เพื่อกระจายความเสี่ยงตาม Capacity จริงและป้องกันผู้ชนะทิ้งงาน (ไม่ใช่การฮั้วประมูล)</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-200 text-slate-700 text-[16.5px]">
                    <th className="p-2 border border-slate-300 font-bold text-center">รอบจัดส่ง / Lot No.</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">ผู้ผลิต (อ้างอิงจาก Framework Agreement)</th>
                    <th className="p-2 border border-slate-300 font-bold text-center bg-emerald-100 text-emerald-800">โควตาสูงสุดที่แนะนำ</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">เหตุผล (อิงตาม Capacity)</th>
                  </tr>
                </thead>
                <tbody>
                  {lotStrategy.map((lot: any, idx: number) => {
                    return (
                      <tr key={idx} className="hover:bg-slate-50 text-[16.5px] bg-white">
                        <td className="p-2 border border-slate-300 text-center text-slate-600 font-medium bg-slate-50">{lot.lot}</td>
                        <td className="p-2 border border-slate-300 text-indigo-700 font-bold">{lot.vendor}</td>
                        <td className="p-2 border border-slate-300 text-center font-black text-slate-800 bg-emerald-50">{lot.qty.toLocaleString()}</td>
                        <td className="p-2 border border-slate-300 text-slate-600 text-[16.5px]">{lot.reason}</td>
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
            <h3 className="text-[16.5px] font-bold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-amber-600" />
              AI ตรวจสอบและร่างข้อสัญญา TOR (AI Contract Review & Drafting)
            </h3>
            <p className="text-[16.5px] text-slate-500 mt-1">ข้อกำหนดสำหรับการจัดสรรโควต้าตามความสามารถของผู้ผลิต</p>
          </div>
          <button onClick={copyToClipboard} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-white p-2 rounded-lg border border-slate-200 shadow-sm" title="คัดลอกร่าง TOR">
            <Copy size={16} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-[16.5px] text-slate-800 leading-loose whitespace-pre-line font-medium">
            {draftTOR}
          </p>
        </div>
        <div className="px-5 pb-5 flex items-start gap-2 text-[16.5px] text-amber-700/80 font-medium">
          <ShieldCheck size={14} className="shrink-0 mt-0.5" />
          <p>เงื่อนไขนี้สอดคล้องกับระเบียบจัดซื้อฯ โดยเปิดโอกาสให้มีการแข่งขันราคาอย่างเป็นธรรม (Fair Competition) และปิดความเสี่ยงเรื่องผู้ชนะทิ้งงาน</p>
        </div>
      </div>
    </div>
  );
}
