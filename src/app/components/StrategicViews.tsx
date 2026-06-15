"use client";

import { BarChart3, FileText, Landmark, PackageCheck, ShoppingCart, Truck, AlertTriangle, ShieldCheck, MessageSquareText } from "lucide-react";
import { useData } from "../context/DataContext";

function formatCurrency(value: number) {
  if (value >= 1e9) return `฿${(value / 1e9).toFixed(2)} พันล้าน`;
  if (value >= 1e6) return `฿${(value / 1e6).toFixed(1)} ล้าน`;
  return `฿${value.toLocaleString()}`;
}

function PageShell({
  icon: Icon,
  title,
  description,
  eyebrow,
  accent,
  children,
}: {
  icon: typeof ShoppingCart;
  title: string;
  description: string;
  eyebrow: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[16.5px] font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-md">
            <Icon size={14} />
            {eyebrow}
          </div>
          <h1 className="mt-4 text-[24px] font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-3 text-[16.5px] leading-relaxed text-slate-300 font-medium">{description}</p>
        </div>
      </section>
      {children}
    </div>
  );
}

export function ProcurementView() {
  const { materials, riskAlerts, totalVaR } = useData();
  const recommendedOrders = riskAlerts
    .filter((alert) => alert.severity !== "info")
    .map((alert) => ({
      ...alert,
      material: materials.find((material) => material.id === alert.materialId),
    }))
    .slice(0, 4);

  return (
    <PageShell
      icon={ShoppingCart}
      eyebrow="Smart Procurement"
      title="หน้าจัดซื้อจัดจ้างอัจฉริยะ"
      description="แปลงความเสี่ยงเป็นชุดคำสั่งซื้อที่อธิบายได้ พร้อมวงเงิน ผลกระทบ และเหตุผลเพื่อใช้คุยกับทีมจัดซื้อหรือกรรมการ"
      accent="from-rose-50 via-white to-amber-50"
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "วงเงินเสี่ยงที่ต้องกันงบ", value: formatCurrency(totalVaR), bg: "bg-gradient-to-br from-red-50/60 to-rose-50/60 border-red-100", valueColor: "text-red-800" },
          { label: "เคสพร้อมออก PO", value: `${recommendedOrders.length} รายการ`, bg: "bg-gradient-to-br from-purple-50/60 to-fuchsia-50/60 border-purple-100", valueColor: "text-purple-800" },
          { label: "Lead time เฉลี่ย", value: `${Math.round(materials.reduce((sum, item) => sum + item.leadTimeWeeks, 0) / (materials.length || 1))} สัปดาห์`, bg: "bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-100", valueColor: "text-blue-800" },
        ].map((item) => (
          <article key={item.label} className={`rounded-[20px] border p-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] backdrop-blur-sm ${item.bg}`}>
            <div className="text-[16.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</div>
            <div className={`mt-2 text-[16.5px] font-bold ${item.valueColor}`}>{item.value}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {recommendedOrders.map((item) => (
          <article key={item.id} className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${item.severity === "critical" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-500"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-[16.5px] font-bold text-slate-900">{item.materialId}</div>
              <div className={`rounded-full px-3 py-1 text-[16.5px] font-bold ${item.severity === "critical" ? "bg-red-600 text-white shadow-sm" : "bg-amber-500 text-white shadow-sm"}`}>
                {item.severity}
              </div>
            </div>
            <div className="mt-2 text-[16.5px] font-bold text-slate-900">{item.material?.name}</div>
            <div className="mt-3 text-[16.5px] leading-6 text-slate-600 font-medium">{item.recommendation}</div>
            <div className="mt-4 grid gap-3 text-[16.5px] text-slate-600 md:grid-cols-3">
              <div>Stock {item.material?.currentStock.toLocaleString()}</div>
              <div>Safety {item.material?.safetyStock.toLocaleString()}</div>
              <div className={item.severity === "critical" ? "font-bold text-red-700" : "font-bold text-amber-700"}>Impact {formatCurrency(item.costImpact)}</div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[16.5px] text-slate-400 font-semibold">Confidence: <span className="font-bold text-emerald-600">{item.confidence}%</span></span>
              <button 
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("create-po", { 
                    detail: { 
                      materialId: item.materialId, 
                      qty: item.material?.eoq, 
                      name: item.materialName,
                      price: item.material?.unitPrice 
                    } 
                  }));
                }}
                className={`px-3 py-1.5 rounded-lg text-[16.5px] font-bold cursor-pointer transition-colors shadow-sm text-white ${
                  item.severity === "critical" 
                    ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/10" 
                    : "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-amber-500/10"
                }`}
              >
                ออกใบสั่งซื้อ (PO)
              </button>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

export function WarehouseView() {
  const { materials } = useData();
  return (
    <PageShell
      icon={Truck}
      eyebrow="Warehouse Monitor"
      title="หน้าคลังและการกระจายพัสดุ"
      description="ใช้เล่าให้เห็นภาพสุขภาพคลัง วัสดุที่ใกล้ขาด และรายการที่มี stock cover สูงหรือต่ำเกินไปในระดับปฏิบัติการ"
      accent="from-blue-50 via-white to-cyan-50"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {materials.map((material) => {
          const coverage = Math.round((material.currentStock / material.safetyStock) * 100);
          return (
            <article key={material.id} className="rounded-[20px] border border-slate-200 bg-white p-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[16.5px] font-bold text-slate-900">{material.id}</div>
                <div className={`rounded-full px-2.5 py-1 text-[16.5px] font-bold ${coverage < 100 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {coverage}%
                </div>
              </div>
              <div className="mt-2 text-[16.5px] font-semibold text-slate-600 leading-relaxed">{material.name}</div>
              <div className="mt-4 space-y-2 text-[16.5px] text-slate-500 font-medium">
                <div>Stock: {material.currentStock.toLocaleString()} {material.unit}</div>
                <div>Safety: {material.safetyStock.toLocaleString()} {material.unit}</div>
                <div>ROP: {material.reorderPoint.toLocaleString()} {material.unit}</div>
              </div>
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}

export function BudgetView() {
  const { materials, totalVaR } = useData();
  const procurementNeed = materials.reduce(
    (sum, material) => sum + Math.max(material.safetyStock - material.currentStock, 0) * material.unitPrice,
    0
  );
  const annualPlanValue = materials.reduce((sum, material) => sum + material.annualDemand * material.budgetPrice, 0);

  return (
    <PageShell
      icon={Landmark}
      eyebrow="Budget Intelligence"
      title="หน้าวิเคราะห์งบประมาณ"
      description="สรุปมูลค่าความเสี่ยง มูลค่าการเติมสต็อก และมุมมองวงเงินตามแผนรายปี เพื่อช่วยคุยเรื่อง budget reallocation ได้ง่ายขึ้น"
      accent="from-emerald-50 via-white to-amber-50"
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "วงเงินเติม safety stock", value: formatCurrency(procurementNeed), bg: "bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#059669] border-emerald-500/20 shadow-[0_15px_35px_rgba(16,185,129,0.1)]", valueColor: "text-white", labelColor: "text-emerald-100/90" },
          { label: "มูลค่าแผนความต้องการทั้งปี", value: formatCurrency(annualPlanValue), bg: "bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] border-blue-500/20 shadow-[0_15px_35px_rgba(59,130,246,0.1)]", valueColor: "text-white", labelColor: "text-blue-100/90" },
          { label: "Risk Exposure", value: formatCurrency(totalVaR), bg: "bg-gradient-to-br from-[#4e091b] via-[#750e26] to-[#b91c1c] border-rose-500/20 shadow-[0_15px_35px_rgba(185,28,28,0.1)]", valueColor: "text-white", labelColor: "text-red-100/90" },
        ].map((item) => (
          <article key={item.label} className={`rounded-[20px] border p-4.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.bg}`}>
            <div className={`text-[16.5px] font-bold uppercase tracking-[0.14em] ${item.labelColor}`}>{item.label}</div>
            <div className={`mt-2 text-[16.5px] font-bold tracking-tight ${item.valueColor}`}>{item.value}</div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-emerald-600" />
            <h2 className="text-[16.5px] font-bold text-slate-900">Budget Hotspots</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {materials
             .slice()
             .sort((a, b) => b.annualDemand * b.budgetPrice - a.annualDemand * a.budgetPrice)
             .slice(0, 3)
             .map((material, index) => {
               const riskColors = [
                 "text-red-800 bg-red-50/60 border-red-100/60",
                 "text-amber-800 bg-amber-50/60 border-amber-100/60",
                 "text-blue-800 bg-blue-50/60 border-blue-100/60"
               ];
               const colorSet = riskColors[index] || riskColors[2];
               return (
                 <div key={material.id} className={`rounded-2xl p-5 ${colorSet} border flex flex-col justify-between hover:shadow-md transition-all`}>
                   <div>
                     <div className="text-[16.5px] font-bold text-slate-900">{material.id}</div>
                     <div className="mt-1 text-[16.5px] text-slate-600 font-medium">{material.name}</div>
                     <div className="mt-3 text-[16.5px] font-bold text-slate-900">
                       {formatCurrency(material.annualDemand * material.budgetPrice)}
                     </div>
                     <div className="mt-1 text-[16.5px] text-slate-500 font-semibold">Annual demand x budget price</div>
                   </div>
                   <button 
                     type="button"
                     onClick={() => window.dispatchEvent(new CustomEvent("show-alert", {
                       detail: {
                         title: "ปรับปรุงแผนงบประมาณสำเร็จ",
                         content: `📊 ระบบได้จำลองการเกลี่ยงบประมาณสำหรับพัสดุ ${material.id} เรียบร้อยแล้ว\n\n(PoC Phase: ข้อมูลจำลองการปรับแผนและประเมินผลกระทบเชิงงบประมาณได้ถูกส่งไปยังระบบวางแผนงบประมาณส่วนกลาง)`,
                         type: "success"
                       }
                     }))}
                     className="mt-4 w-max px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[16.5px] font-bold cursor-pointer transition shadow-sm"
                   >
                     ปรับปรุงแผนงบ
                   </button>
                 </div>
               );
             })}
        </div>
      </section>
    </PageShell>
  );
}

export function ReportsView() {
  const { riskAlerts, materials } = useData();
  const criticalItems = riskAlerts.filter(a => a.severity === 'critical');
  const totalCriticalImpact = criticalItems.reduce((sum, a) => sum + a.costImpact, 0);

  return (
    <PageShell
      icon={FileText}
      eyebrow="Executive Pack"
      title="หน้ารายงานผู้บริหาร"
      description="สรุปภาพรวมความเสี่ยงคลังพัสดุและแผนปฏิบัติการ (Executive Summary) สำหรับการตัดสินใจระดับบริหาร"
      accent="from-violet-50 via-white to-slate-50"
    >
      <div className="rounded-[32px] bg-white border border-slate-200 p-8 shadow-sm">
        {/* Report Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">รายงานสรุปสถานการณ์คลังพัสดุ</h2>
            <p className="text-slate-500 mt-1 font-medium">รอบการประเมิน: ไตรมาส 2 / 2569 (ข้อมูลจำลอง)</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[16.5px] font-bold transition-colors">
              <FileText size={16} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#00B900] hover:bg-[#009900] text-white rounded-xl text-[16.5px] font-bold transition-colors shadow-sm">
              <MessageSquareText size={16} /> Share to LINE
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
            <div className="flex items-center gap-2 text-red-600 font-bold text-[16.5px] mb-2 uppercase tracking-wide">
              <AlertTriangle size={16} /> มูลค่าความเสี่ยงระดับวิกฤต
            </div>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(totalCriticalImpact)}</div>
            <div className="text-red-600 text-[16.5px] mt-2 font-medium">จากพัสดุวิกฤต {criticalItems.length} รายการ</div>
          </div>
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-[16.5px] mb-2 uppercase tracking-wide">
              <ShieldCheck size={16} /> ความพร้อมรวมของคลัง (Coverage)
            </div>
            <div className="text-3xl font-bold text-slate-900">62%</div>
            <div className="text-emerald-700 text-[16.5px] mt-2 font-medium">ต่ำกว่าเป้าหมาย 15% (ต้องการ 77%)</div>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-[16.5px] mb-2 uppercase tracking-wide">
              <ShoppingCart size={16} /> งบประมาณที่ต้องการเร่งด่วน
            </div>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(45000000)}</div>
            <div className="text-blue-700 text-[16.5px] mt-2 font-medium">เพื่อปิดความเสี่ยงระยะสั้น (3 เดือน)</div>
          </div>
        </div>

        {/* Action Plan Table */}
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-purple-500 pl-3">แผนปฏิบัติการ (Action Plan) สำหรับพัสดุวิกฤต</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[16.5px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">พัสดุ</th>
                <th className="px-4 py-3 font-semibold">สถานะสต๊อก</th>
                <th className="px-4 py-3 font-semibold">ข้อเสนอแนะโดย AI</th>
                <th className="px-4 py-3 font-semibold text-right">งบประมาณที่ใช้</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criticalItems.map((item, idx) => {
                const mat = materials.find(m => m.id === item.materialId);
                return (
                  <tr key={idx} className="text-[16.5px]">
                    <td className="px-4 py-4 font-bold text-slate-900">{item.materialId}</td>
                    <td className="px-4 py-4">
                      <span className="text-red-600 font-semibold">{mat?.currentStock.toLocaleString()}</span> / {mat?.safetyStock.toLocaleString()} {mat?.unit}
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-medium">
                      {item.recommendation}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900">
                      {formatCurrency(mat ? mat.eoq * mat.unitPrice : 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
