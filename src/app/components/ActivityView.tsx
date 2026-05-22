"use client";

import { CheckCircle2, Clock, Truck, PackageCheck, FileText, AlertTriangle } from "lucide-react";

export default function ActivityView() {
  const kanbanColumns = [
    {
      id: "approved",
      title: "อนุมัติแผน (AI Approved)",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      items: []
    },
    {
      id: "po_created",
      title: "ออกใบสั่งซื้อ (PO Issued)",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200",
      items: [
        { id: "PO-2569-8921", material: "10067 หม้อแปลง 160 kVA", qty: 800, date: "วันนี้ 10:30 น." }
      ]
    },
    {
      id: "production",
      title: "กำลังผลิต (In Production)",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      items: [
        { id: "PO-2569-7742", material: "10066 หม้อแปลง 100 kVA", qty: 500, date: "15 พ.ค. 2569", alert: "Supplier แจ้งเลื่อนส่งมอบ 1 สัปดาห์" }
      ]
    },
    {
      id: "transit",
      title: "กำลังจัดส่ง (In Transit)",
      icon: Truck,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-200",
      items: [
        { id: "PO-2569-6511", material: "20045 อุปกรณ์ป้องกัน", qty: 1200, date: "10 พ.ค. 2569" }
      ]
    },
    {
      id: "delivered",
      title: "รับเข้าคลัง (Delivered)",
      icon: PackageCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      items: [
        { id: "PO-2569-5322", material: "10067 หม้อแปลง 160 kVA", qty: 300, date: "1 พ.ค. 2569" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full min-h-[80vh]">
      <section className="rounded-[32px] bg-white border border-slate-200 p-8 shadow-sm relative overflow-hidden shrink-0">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 shadow-sm">
            <Truck size={14} />
            Supply Chain Tracking
          </div>
          <h1 className="mt-4 text-[24px] font-bold tracking-tight text-slate-900">ติดตามสถานะใบสั่งซื้อ (PO Tracking Board)</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500 font-medium">
            ติดตามสถานะของแผนงานที่ AI เสนอและได้รับการอนุมัติแล้ว ตั้งแต่การออกใบสั่งซื้อไปจนถึงการรับของเข้าคลัง (WMS)
          </p>
        </div>
      </section>

      {/* Kanban Board */}
      <section className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px] h-full">
          {kanbanColumns.map(col => (
            <div key={col.id} className={`flex-1 rounded-3xl border ${col.bg} p-4 flex flex-col`}>
              <div className="flex items-center gap-2 mb-4 px-2">
                <col.icon size={18} className={col.color} />
                <h3 className="text-[13px] font-bold text-slate-800">{col.title}</h3>
                <span className="ml-auto bg-white/60 text-slate-600 px-2 py-0.5 rounded-full text-[11px] font-bold">
                  {col.items.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3">
                {col.items.length === 0 ? (
                  <div className="h-24 border-2 border-dashed border-slate-200/50 rounded-2xl flex items-center justify-center text-[12px] text-slate-400 font-medium">
                    ไม่มีรายการ
                  </div>
                ) : (
                  col.items.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{item.id}</span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <div className="text-[13px] font-bold text-slate-800 leading-tight mb-1">{item.material}</div>
                      <div className="text-[11px] text-purple-600 font-bold mb-3">จำนวน: {item.qty.toLocaleString()} หน่วย</div>
                      
                      {'alert' in item && item.alert && (
                        <div className="mt-2 bg-rose-50 text-rose-700 p-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-rose-100">
                          <AlertTriangle size={12} />
                          {item.alert}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
