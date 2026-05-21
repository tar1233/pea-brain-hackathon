"use client";

import { BarChart3, FileText, Landmark, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import { materials, riskAlerts, totalVaR } from "../data/mockData";

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
      <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#fffbf2_0%,#ffffff_45%,#eff6ff_100%)] p-6 shadow-[0_15px_30px_rgba(0,0,0,0.015)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800 shadow-sm">
            <Icon size={14} />
            {eyebrow}
          </div>
          <h1 className="mt-4 text-[20px] font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-600 font-medium">{description}</p>
        </div>
      </section>
      {children}
    </div>
  );
}

export function ProcurementView() {
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
          { label: "Lead time เฉลี่ย", value: `${Math.round(materials.reduce((sum, item) => sum + item.leadTimeWeeks, 0) / materials.length)} สัปดาห์`, bg: "bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-100", valueColor: "text-blue-800" },
        ].map((item) => (
          <article key={item.label} className={`rounded-[20px] border p-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] backdrop-blur-sm ${item.bg}`}>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</div>
            <div className={`mt-2 text-[18px] font-bold ${item.valueColor}`}>{item.value}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {recommendedOrders.map((item) => (
          <article key={item.id} className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${item.severity === "critical" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-500"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-slate-900">{item.materialId}</div>
              <div className={`rounded-full px-3 py-1 text-xs font-bold ${item.severity === "critical" ? "bg-red-600 text-white shadow-sm" : "bg-amber-500 text-white shadow-sm"}`}>
                {item.severity}
              </div>
            </div>
            <div className="mt-2 text-[14px] font-bold text-slate-900">{item.material?.name}</div>
            <div className="mt-3 text-[12px] leading-6 text-slate-600 font-medium">{item.recommendation}</div>
            <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-3">
              <div>Stock {item.material?.currentStock.toLocaleString()}</div>
              <div>Safety {item.material?.safetyStock.toLocaleString()}</div>
              <div className={item.severity === "critical" ? "font-bold text-red-700" : "font-bold text-amber-700"}>Impact {formatCurrency(item.costImpact)}</div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400 font-semibold">Confidence: <span className="font-bold text-emerald-600">{item.confidence}%</span></span>
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
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-sm text-white ${
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
                <div className="text-sm font-bold text-slate-900">{material.id}</div>
                <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${coverage < 100 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {coverage}%
                </div>
              </div>
              <div className="mt-2 text-[12px] font-semibold text-slate-600 leading-relaxed">{material.name}</div>
              <div className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
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
          { label: "วงเงินเติม safety stock", value: formatCurrency(procurementNeed), bg: "bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-100", valueColor: "text-emerald-800" },
          { label: "มูลค่าแผนความต้องการทั้งปี", value: formatCurrency(annualPlanValue), bg: "bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-100", valueColor: "text-blue-800" },
          { label: "Risk Exposure", value: formatCurrency(totalVaR), bg: "bg-gradient-to-br from-red-50/60 to-rose-50/60 border-red-100", valueColor: "text-red-800" },
        ].map((item) => (
          <article key={item.label} className={`rounded-[20px] border p-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] backdrop-blur-sm ${item.bg}`}>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</div>
            <div className={`mt-2 text-[18px] font-bold ${item.valueColor}`}>{item.value}</div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-emerald-600" />
            <h2 className="text-[14px] font-bold text-slate-900">Budget Hotspots</h2>
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
                     <div className="text-sm font-bold text-slate-900">{material.id}</div>
                     <div className="mt-1 text-xs text-slate-600 font-medium">{material.name}</div>
                     <div className="mt-3 text-[14px] font-bold text-slate-900">
                       {formatCurrency(material.annualDemand * material.budgetPrice)}
                     </div>
                     <div className="mt-1 text-[10px] text-slate-500 font-semibold">Annual demand x budget price</div>
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
                     className="mt-4 w-max px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
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
  return (
    <PageShell
      icon={FileText}
      eyebrow="Executive Pack"
      title="หน้ารายงานผู้บริหาร"
      description="จัดโครงเรื่องสำหรับ presentation หรือ export report โดยรวมประเด็นสำคัญที่ผู้บริหารต้องเห็นในไม่กี่วินาที"
      accent="from-violet-50 via-white to-slate-50"
    >
      <section className="grid gap-4 xl:grid-cols-3">
        {[
          {
            icon: PackageCheck,
            title: "1. ภาพรวมพัสดุเสี่ยง",
            text: "เปิดด้วยเคส critical และ coverage คงคลังเฉลี่ย เพื่อให้ผู้บริหารเห็น urgency ทันที",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            cardBg: "bg-gradient-to-br from-red-50/30 to-white border-red-100/50",
          },
          {
            icon: ShoppingCart,
            title: "2. แผนจัดซื้อที่ควรอนุมัติ",
            text: "ต่อด้วยปริมาณที่ควรสั่ง วงเงิน และผลกระทบหากไม่ดำเนินการภายใน lead time",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            cardBg: "bg-gradient-to-br from-purple-50/30 to-white border-purple-100/50",
          },
          {
            icon: BarChart3,
            title: "3. งบประมาณและผลตอบแทน",
            text: "ปิดด้วยภาพรวม Value at Risk, annual demand value และโอกาสลดต้นทุนจากการวางแผนแม่นขึ้น",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            cardBg: "bg-gradient-to-br from-emerald-50/30 to-white border-emerald-100/50",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className={`rounded-[24px] border p-5 shadow-[0_12px_24px_rgba(0,0,0,0.01)] hover:shadow-md transition-all ${item.cardBg} flex flex-col justify-between`}>
              <div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBg}`}>
                  <Icon size={18} className={item.iconColor} />
                </div>
                <div className="mt-4 text-[14px] font-bold text-slate-900">{item.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{item.text}</div>
              </div>
              <button 
                type="button" 
                onClick={() => window.dispatchEvent(new CustomEvent("show-alert", {
                  detail: {
                    title: `พรีวิวสไลด์รายงานผู้บริหาร`,
                    content: `📊 จำลองการสร้างและดึงข้อมูลสรุปผลพยากรณ์รวมถึงความเสี่ยงพัสดุในหัวข้อ:\n"${item.title}"\n\n(PoC Phase: ระบบได้ประกอบสไลด์นำเสนออัตโนมัติ พร้อมสำหรับการดึงไปใช้ประกอบการรายงานผู้บริหารระดับสูง)`,
                    type: "info"
                  }
                }))}
                className="mt-4 w-max px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition shadow-sm"
              >
                ดูพรีวิวสไลด์
              </button>
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}
