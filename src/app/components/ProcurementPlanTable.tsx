"use client";

import React from "react";
import { Download, Calendar, Package, AlertCircle } from "lucide-react";

interface PlanItem {
  round: number;
  month: string;
  year: number;
  totalQty: number;
  allocations: {
    vendor: string;
    qty: number;
    capacity: number;
    utilization: number;
    status: string;
  }[];
}

const mockPlanData: PlanItem[] = [
  {
    round: 1,
    month: "พฤษภาคม",
    year: 2569,
    totalQty: 614,
    allocations: [
      { vendor: "บริษัท ถิรไทย จำกัด (มหาชน)", qty: 246, capacity: 300, utilization: 82, status: "Normal" },
      { vendor: "บริษัท เจริญชัยหม้อแปลงไฟฟ้า จำกัด", qty: 184, capacity: 200, utilization: 92, status: "High" },
      { vendor: "บริษัท เอกรัฐวิศวกรรม จำกัด (มหาชน)", qty: 184, capacity: 199, utilization: 92, status: "High" }
    ]
  },
  {
    round: 2,
    month: "สิงหาคม",
    year: 2569,
    totalQty: 614,
    allocations: [
      { vendor: "บริษัท ถิรไทย จำกัด (มหาชน)", qty: 246, capacity: 300, utilization: 82, status: "Normal" },
      { vendor: "บริษัท เจริญชัยหม้อแปลงไฟฟ้า จำกัด", qty: 184, capacity: 200, utilization: 92, status: "High" },
      { vendor: "บริษัท เอกรัฐวิศวกรรม จำกัด (มหาชน)", qty: 184, capacity: 199, utilization: 92, status: "High" }
    ]
  },
  {
    round: 3,
    month: "พฤศจิกายน",
    year: 2569,
    totalQty: 614,
    allocations: [
      { vendor: "บริษัท ถิรไทย จำกัด (มหาชน)", qty: 246, capacity: 300, utilization: 82, status: "Normal" },
      { vendor: "บริษัท เจริญชัยหม้อแปลงไฟฟ้า จำกัด", qty: 184, capacity: 200, utilization: 92, status: "High" },
      { vendor: "บริษัท เอกรัฐวิศวกรรม จำกัด (มหาชน)", qty: 184, capacity: 199, utilization: 92, status: "High" }
    ]
  },
  {
    round: 4,
    month: "กุมภาพันธ์",
    year: 2570,
    totalQty: 612,
    allocations: [
      { vendor: "บริษัท ถิรไทย จำกัด (มหาชน)", qty: 246, capacity: 300, utilization: 82, status: "Normal" },
      { vendor: "บริษัท เจริญชัยหม้อแปลงไฟฟ้า จำกัด", qty: 184, capacity: 200, utilization: 92, status: "High" },
      { vendor: "บริษัท เอกรัฐวิศวกรรม จำกัด (มหาชน)", qty: 182, capacity: 199, utilization: 91, status: "High" }
    ]
  }
];

export default function ProcurementPlanTable({
  materialId = "10067",
  materialName = "หม้อแปลง 160 kVA 3 เฟส",
  totalQty = 2454
}: {
  materialId?: string;
  materialName?: string;
  totalQty?: number;
}) {

  const handleExportCSV = () => {
    // 1. Create CSV Header
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Thai characters
    csvContent += "รอบที่,เดือนส่งมอบ,จำนวนรวม (เครื่อง),ผู้ผลิต,จำนวนที่สั่ง (เครื่อง),กำลังผลิต (เครื่อง/เดือน),อัตราการใช้กำลังผลิต (%)\n";

    // 2. Iterate data
    mockPlanData.forEach(plan => {
      plan.allocations.forEach((alloc, index) => {
        const roundText = index === 0 ? plan.round : "";
        const monthText = index === 0 ? `${plan.month} ${plan.year}` : "";
        const totalText = index === 0 ? plan.totalQty : "";
        
        csvContent += `${roundText},${monthText},${totalText},${alloc.vendor},${alloc.qty},${alloc.capacity},${alloc.utilization}\n`;
      });
    });

    // 3. Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProcurementPlan_${materialId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <div>
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600" />
            ตารางแผนการจัดส่ง (Procurement Timeline & Allocation)
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">
            พัสดุ: {materialName} | ยอดรวม: {totalQty.toLocaleString()} เครื่อง
          </p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[13px] font-medium shadow-sm"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-[13px]">
              <th className="p-3 border-b border-slate-200 font-semibold w-16 text-center">รอบที่</th>
              <th className="p-3 border-b border-slate-200 font-semibold w-32">เดือนส่งมอบ</th>
              <th className="p-3 border-b border-slate-200 font-semibold text-center w-24">รวม (เครื่อง)</th>
              <th className="p-3 border-b border-slate-200 font-semibold">ผู้ผลิต (Vendor)</th>
              <th className="p-3 border-b border-slate-200 font-semibold text-right w-24">สั่งซื้อ</th>
              <th className="p-3 border-b border-slate-200 font-semibold text-right w-24">Capacity</th>
              <th className="p-3 border-b border-slate-200 font-semibold text-center w-32">Utilization</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {mockPlanData.map((plan, planIdx) => (
              <React.Fragment key={plan.round}>
                {plan.allocations.map((alloc, allocIdx) => {
                  const isFirst = allocIdx === 0;
                  const isLast = allocIdx === plan.allocations.length - 1;
                  
                  return (
                    <tr 
                      key={`${plan.round}-${alloc.vendor}`} 
                      className={`
                        hover:bg-indigo-50/30 transition-colors
                        ${isLast ? 'border-b-[2px] border-slate-200' : 'border-b border-slate-100'}
                      `}
                    >
                      {/* Only show round, month, total on first row of the group */}
                      {isFirst ? (
                        <>
                          <td className="p-3 text-center font-bold text-slate-700 bg-white" rowSpan={plan.allocations.length}>
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                              {plan.round}
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-800 bg-white" rowSpan={plan.allocations.length}>
                            {plan.month} {plan.year}
                          </td>
                          <td className="p-3 text-center font-bold text-indigo-600 bg-white" rowSpan={plan.allocations.length}>
                            {plan.totalQty}
                          </td>
                        </>
                      ) : null}
                      
                      {/* Vendor specific data */}
                      <td className="p-3 text-slate-700 flex items-center gap-2">
                        <Package size={14} className="text-slate-400" />
                        {alloc.vendor}
                      </td>
                      <td className="p-3 text-right font-medium text-slate-800">{alloc.qty}</td>
                      <td className="p-3 text-right text-slate-500">{alloc.capacity}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${alloc.utilization > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${alloc.utilization}%` }}
                            />
                          </div>
                          <span className={`text-[11px] font-bold w-8 text-right ${alloc.utilization > 90 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {alloc.utilization}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 bg-amber-50 text-[12px] text-amber-700 flex items-center gap-2 border-t border-amber-100">
        <AlertCircle size={14} className="text-amber-600 shrink-0" />
        <span>ระบบจำกัดการสั่งซื้อไม่ให้เกิน 95% ของกำลังการผลิตสูงสุดของแต่ละผู้ผลิต เพื่อลดความเสี่ยงการส่งมอบล่าช้า (Delay Delivery Risk)</span>
      </div>
      </div>
    </>
  );
}
