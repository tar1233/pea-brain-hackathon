"use client";

import React from "react";
import { Download, Table as TableIcon, FileSpreadsheet } from "lucide-react";

interface BiddingPlanRow {
  id: number;
  code: string;
  bidNo: string;
  projectCode: string;
  qty: number;
  unitPrice: number;
  standardPrice: number;
  totalBudget: number;
  stockForecast: number;
  biddingStage: string;
  approvalStage: string;
  contractStage: string;
  minCapacity: number;
  maxCapacity: string;
  monthlyDemand: number;
  schedule: {
    oct: number; nov: number; dec: number;
    jan: number; feb: number; mar: number;
    apr: number; may: number; jun: number;
    jul: number; aug: number; sep: number;
  };
}

const mockBiddingData: BiddingPlanRow[] = [
  {
    id: 1,
    code: "10067",
    bidNo: "VMI-Q1-2569",
    projectCode: "Z151A",
    qty: 614,
    unitPrice: 150000,
    standardPrice: 150000,
    totalBudget: 92100000,
    stockForecast: 12,
    biddingStage: "แจกแบบ-เสนอราคา",
    approvalStage: "อนุมัติ",
    contractStage: "สัญญา (Lot 1)",
    minCapacity: 300,
    maxCapacity: "800 - 2,000",
    monthlyDemand: 204,
    schedule: {
      oct: 204, nov: 205, dec: 205,
      jan: 0, feb: 0, mar: 0,
      apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0,
    }
  },
  {
    id: 2,
    code: "10067",
    bidNo: "VMI-Q2-2569",
    projectCode: "Z151A",
    qty: 614,
    unitPrice: 150000,
    standardPrice: 150000,
    totalBudget: 92100000,
    stockForecast: 12,
    biddingStage: "แจกแบบ-เสนอราคา",
    approvalStage: "อนุมัติ",
    contractStage: "สัญญา (Lot 2)",
    minCapacity: 300,
    maxCapacity: "800 - 2,000",
    monthlyDemand: 204,
    schedule: {
      oct: 0, nov: 0, dec: 0,
      jan: 204, feb: 205, mar: 205,
      apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0,
    }
  },
  {
    id: 3,
    code: "10067",
    bidNo: "VMI-Q3-2569",
    projectCode: "Z151A",
    qty: 613,
    unitPrice: 150000,
    standardPrice: 150000,
    totalBudget: 91950000,
    stockForecast: 12,
    biddingStage: "แจกแบบ-เสนอราคา",
    approvalStage: "รออนุมัติ",
    contractStage: "เตรียมจัดหา",
    minCapacity: 300,
    maxCapacity: "800 - 2,000",
    monthlyDemand: 204,
    schedule: {
      oct: 0, nov: 0, dec: 0,
      jan: 0, feb: 0, mar: 0,
      apr: 204, may: 204, jun: 205,
      jul: 0, aug: 0, sep: 0,
    }
  },
  {
    id: 4,
    code: "10067",
    bidNo: "VMI-Q4-2569",
    projectCode: "Z151A",
    qty: 613,
    unitPrice: 150000,
    standardPrice: 150000,
    totalBudget: 91950000,
    stockForecast: 12,
    biddingStage: "แจกแบบ-เสนอราคา",
    approvalStage: "รออนุมัติ",
    contractStage: "เตรียมจัดหา",
    minCapacity: 300,
    maxCapacity: "800 - 2,000",
    monthlyDemand: 204,
    schedule: {
      oct: 0, nov: 0, dec: 0,
      jan: 0, feb: 0, mar: 0,
      apr: 0, may: 0, jun: 0,
      jul: 204, aug: 204, sep: 205,
    }
  }
];

export default function ProcurementPlanTable({
  materialId = "10067",
  materialName = "หม้อแปลง 160 kVA 3 เฟส",
  material,
}: {
  materialId?: string;
  materialName?: string;
  material?: any;
}) {

  const formatCurrency = (val: number) => new Intl.NumberFormat("th-TH").format(val);


  // Dynamically adjust mock data based on actual material to ensure consistency

  const exportToCSV = () => {
    // Basic CSV generation for Procurement Plan
    const headers = [
      "ลำดับ", "รหัสพัสดุ", "เลขที่ประมูล", "รหัสโครงการ", "จำนวน", "ราคาต่อหน่วย", "ราคามาตรฐาน", "งบประมาณ", 
      "คาดการณ์คงคลัง", "สถานะประกวดราคา", "สถานะสัญญา", "กำลังผลิตขั้นต่ำ", "กำลังผลิตรวม", "Demand/เดือน",
      "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."
    ];
    
    const rows = dynamicBiddingData.map(row => [
      row.id, row.code, row.bidNo, row.projectCode, row.qty, row.unitPrice, row.standardPrice, row.totalBudget,
      row.stockForecast, row.biddingStage, row.contractStage, row.minCapacity, row.maxCapacity, row.monthlyDemand,
      row.schedule.oct, row.schedule.nov, row.schedule.dec, row.schedule.jan, row.schedule.feb, row.schedule.mar,
      row.schedule.apr, row.schedule.may, row.schedule.jun, row.schedule.jul, row.schedule.aug, row.schedule.sep
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    
    // Add BOM for UTF-8 Excel compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `procurement_plan_${materialId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dynamicBiddingData = material ? mockBiddingData.map((row) => {
    // Total mock qty is calculated dynamically
    const totalMockQty = mockBiddingData.reduce((acc, r) => acc + r.qty, 0);
    const globalScale = (material.annualDemand || totalMockQty) / totalMockQty;
    const newQty = Math.round(row.qty * globalScale);
    const newUnitPrice = material.unitPrice || row.unitPrice;
    
    // adjust schedule proportionally
    const s = row.schedule;
    const newSchedule = {
      oct: Math.round(s.oct * globalScale), nov: Math.round(s.nov * globalScale), dec: Math.round(s.dec * globalScale),
      jan: Math.round(s.jan * globalScale), feb: Math.round(s.feb * globalScale), mar: Math.round(s.mar * globalScale),
      apr: Math.round(s.apr * globalScale), may: Math.round(s.may * globalScale), jun: Math.round(s.jun * globalScale),
      jul: Math.round(s.jul * globalScale), aug: Math.round(s.aug * globalScale), sep: Math.round(s.sep * globalScale),
    };

    return {
      ...row,
      qty: newQty,
      unitPrice: newUnitPrice,
      standardPrice: newUnitPrice * 1.05,
      totalBudget: newQty * (newUnitPrice * 1.05),
      stockForecast: material.currentStock || row.stockForecast,
      monthlyDemand: material.monthlyDemand || row.monthlyDemand,
      schedule: newSchedule
    };
  }) : mockBiddingData;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
        <div>
          <h3 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-indigo-600" />
            แผนดำเนินการจัดหาพัสดุหลักปี 2568 (อ้างอิงฟอร์ม Excel)
          </h3>
          <p className="text-[14px] text-slate-500 mt-1">
            พัสดุ: {materialName} | แผนจัดซื้อและตารางส่งมอบรายเดือน
          </p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[14px] font-medium shadow-sm cursor-pointer">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[2000px]">
          <thead>
            {/* Main Header Row */}
            <tr className="bg-slate-200 text-slate-700 text-[15px]">
              <th className="p-2 border border-slate-300 font-bold text-center" colSpan={4}>ข้อมูลโครงการ</th>
              <th className="p-2 border border-slate-300 font-bold text-center" colSpan={4}>งบประมาณและราคา (บาท)</th>
              <th className="p-2 border border-slate-300 font-bold text-center" colSpan={3}>สถานะการจัดหา</th>
              <th className="p-2 border border-slate-300 font-bold text-center" colSpan={3}>ข้อมูลอ้างอิงการผลิต/ความต้องการ</th>
              <th className="p-2 border border-slate-300 font-bold text-center bg-indigo-100 text-indigo-800" colSpan={12}>ตารางแผนส่งมอบ ปี 2568 (จำนวนเครื่อง)</th>
            </tr>
            {/* Sub Header Row */}
            <tr className="bg-slate-100 text-slate-600 text-[14px] whitespace-nowrap">
              <th className="p-2 border border-slate-300 font-semibold text-center">ที่</th>
              <th className="p-2 border border-slate-300 font-semibold text-center">รหัส</th>
              <th className="p-2 border border-slate-300 font-semibold text-center">Bid No.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center">งบ/โครงการ</th>
              
              <th className="p-2 border border-slate-300 font-semibold text-right">จำนวน</th>
              <th className="p-2 border border-slate-300 font-semibold text-right">ราคา/หน่วย</th>
              <th className="p-2 border border-slate-300 font-semibold text-right">ราคากลาง</th>
              <th className="p-2 border border-slate-300 font-semibold text-right">วงเงินรวม VAT</th>
              
              <th className="p-2 border border-slate-300 font-semibold text-center">คาดการณ์คงคลัง</th>
              <th className="p-2 border border-slate-300 font-semibold text-center">ประกวดราคา</th>
              <th className="p-2 border border-slate-300 font-semibold text-center">จัดหา/สัญญา</th>
              
              <th className="p-2 border border-slate-300 font-semibold text-center">กำลังผลิตขั้นต่ำ(66)</th>
              <th className="p-2 border border-slate-300 font-semibold text-center">กำลังผลิต(67)</th>
              <th className="p-2 border border-slate-300 font-semibold text-center">Demand/เดือน</th>
              
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">ต.ค.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">พ.ย.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">ธ.ค.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">ม.ค.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">ก.พ.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">มี.ค.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">เม.ย.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">พ.ค.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">มิ.ย.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">ก.ค.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">ส.ค.</th>
              <th className="p-2 border border-slate-300 font-semibold text-center bg-indigo-50">ก.ย.</th>
            </tr>
          </thead>
          <tbody className="text-[15px]">
            {dynamicBiddingData.map((row) => (
              <tr key={row.bidNo} className="hover:bg-amber-50/50 transition-colors border-b border-slate-200 bg-white">
                <td className="p-2 border-r border-slate-200 text-center">{row.id}</td>
                <td className="p-2 border-r border-slate-200 text-center text-slate-500">{row.code}</td>
                <td className="p-2 border-r border-slate-200 font-medium text-indigo-700">{row.bidNo}</td>
                <td className="p-2 border-r border-slate-200 text-center">{row.projectCode}</td>
                
                <td className="p-2 border-r border-slate-200 text-right font-bold">{formatCurrency(row.qty)}</td>
                <td className="p-2 border-r border-slate-200 text-right">{formatCurrency(row.unitPrice)}</td>
                <td className="p-2 border-r border-slate-200 text-right text-slate-500">{formatCurrency(row.standardPrice)}</td>
                <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-700">{formatCurrency(row.totalBudget)}</td>
                
                <td className="p-2 border-r border-slate-200 text-center">{formatCurrency(row.stockForecast)}</td>
                <td className="p-2 border-r border-slate-200 text-center text-[13px]">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded whitespace-nowrap inline-block">{row.biddingStage}</span>
                </td>
                <td className="p-2 border-r border-slate-200 text-center text-[13px]">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded whitespace-nowrap inline-block">{row.contractStage}</span>
                </td>
                
                <td className="p-2 border-r border-slate-200 text-center text-slate-500">{formatCurrency(row.minCapacity)}</td>
                <td className="p-2 border-r border-slate-200 text-center text-slate-500">{row.maxCapacity}</td>
                <td className="p-2 border-r border-slate-200 text-center font-semibold">{formatCurrency(row.monthlyDemand)}</td>
                
                {/* Schedule */}
                {Object.values(row.schedule).map((val, idx) => (
                  <td key={idx} className={`p-2 border-r border-slate-200 text-center ${val > 0 ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-slate-300'}`}>
                    {val > 0 ? formatCurrency(val) : '-'}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-slate-50 font-bold text-[15px] border-t-2 border-slate-300">
              <td colSpan={4} className="p-2 border-r border-slate-300 text-right text-slate-600">รวมทั้งหมด:</td>
              <td className="p-2 border-r border-slate-300 text-right">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.qty, 0))}</td>
              <td colSpan={2} className="p-2 border-r border-slate-300 bg-slate-100"></td>
              <td className="p-2 border-r border-slate-300 text-right text-emerald-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.totalBudget, 0))}</td>
              <td colSpan={6} className="p-2 border-r border-slate-300 bg-slate-100"></td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.oct, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.nov, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.dec, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.jan, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.feb, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.mar, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.apr, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.may, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.jun, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.jul, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.aug, 0))}</td>
              <td className="p-2 border-r border-slate-300 text-center text-indigo-700">{formatCurrency(dynamicBiddingData.reduce((acc, row) => acc + row.schedule.sep, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
