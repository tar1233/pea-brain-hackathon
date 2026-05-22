"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Award,
  BarChart3,
  TrendingDown,
  Clock,
  Briefcase,
  AlertTriangle,
  Zap,
  CheckCircle2,
  BrainCircuit
} from "lucide-react";
import { useData } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

function formatCurrency(value: number) {
  if (value >= 1e9) return `฿${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `฿${(value / 1e6).toFixed(1)}M`;
  return `฿${value.toLocaleString()}`;
}

export default function Dashboard({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const { materials, riskAlerts, isLoading } = useData();
  const [approvedPlansCount, setApprovedPlansCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pea_approved_plans");
      if (saved) {
        const parsed = JSON.parse(saved);
        setApprovedPlansCount(parsed.length);
      }
      
      const handleStorage = () => {
        const s = localStorage.getItem("pea_approved_plans");
        if (s) setApprovedPlansCount(JSON.parse(s).length);
      };
      window.addEventListener("approve-plan", handleStorage);
      return () => window.removeEventListener("approve-plan", handleStorage);
    } catch {}
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <BarChart3 size={32} className="animate-pulse text-purple-600" />
        <div className="text-sm font-bold text-slate-500">กำลังโหลดข้อมูล Executive Dashboard...</div>
      </div>
    );
  }

  // Mock Executive Data
  const budgetData = [
    { month: "Jan", spend: 120, budget: 150 },
    { month: "Feb", spend: 140, budget: 150 },
    { month: "Mar", spend: 160, budget: 150 },
    { month: "Apr", spend: 110, budget: 150 },
    { month: "May", spend: 90, budget: 150 },
    { month: "Jun", spend: 0, budget: 150 },
  ];

  const costSavingsData = [
    { month: "Jan", saving: 2.1 },
    { month: "Feb", saving: 3.4 },
    { month: "Mar", saving: 1.2 },
    { month: "Apr", saving: 5.6 },
    { month: "May", saving: 8.2 },
  ];

  const topSuppliers = [
    { name: "บริษัท ไทยทรานสฟอร์เมอร์ จำกัด", score: 98, delivery: "100%", volume: 45000000 },
    { name: "เจริญสายไฟและสายเคเบิ้ล", score: 92, delivery: "95%", volume: 32000000 },
    { name: "อีเลคทริค พาวเวอร์ ซัพพลาย", score: 85, delivery: "88%", volume: 18000000 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="rounded-[32px] border border-slate-200 bg-white px-8 py-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold tracking-widest text-purple-700 uppercase">
            <Briefcase size={14} />
            AI Executive Command Center
          </div>
          <h1 className="text-[22px] font-extrabold text-slate-900 leading-tight">
            ภาพรวมการทำงานของ PEA Brain (AI Copilot)
          </h1>
          <p className="mt-2 text-[13px] text-slate-500 font-medium max-w-xl">
            สรุปข้อมูลการจัดการความเสี่ยงสต๊อกขาดแคลน การวางแผนจัดซื้อด้วย AI และผลประหยัดงบประมาณ
          </p>
        </div>
        <div className="flex gap-4 shrink-0 relative z-10">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center min-w-[140px] cursor-pointer hover:bg-red-100 transition" onClick={() => setActiveTab?.("risk")}>
            <div className="text-[10px] font-bold text-red-500 uppercase flex justify-center items-center gap-1">
              <AlertTriangle size={12} /> ความเสี่ยงที่ต้องจัดการ
            </div>
            <div className="text-[20px] font-extrabold text-red-700 mt-1">{riskAlerts.filter(a => a.severity === 'critical').length} รายการ</div>
            <div className="text-[10px] font-bold text-red-500 mt-1">มูลค่าความเสี่ยง ฿145.2M</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center min-w-[140px] cursor-pointer hover:bg-emerald-100 transition" onClick={() => setActiveTab?.("ebidding")}>
            <div className="text-[10px] font-bold text-emerald-600 uppercase flex justify-center items-center gap-1">
              <CheckCircle2 size={12} /> แก้ไขแล้วด้วย AI
            </div>
            <div className="text-[20px] font-extrabold text-emerald-700 mt-1">{approvedPlansCount} แผน</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-1">พร้อมดำเนินการทันที</div>
          </div>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { title: "ระยะเวลาจัดทำแผนเฉลี่ย", value: "5 นาที", trend: "ประหยัด 98% (จาก 3 วัน)", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
          { title: "มูลค่า Cost Savings (AI)", value: "฿20.5M", trend: "ประหยัดต้นทุนได้ 3.2%", icon: TrendingDown, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "ความแม่นยำ AI เฝ้าระวัง", value: "94%", trend: "คาดการณ์ของขาดล่วงหน้า", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "อัตราความสำเร็จ e-Bidding", value: "88%", trend: "ลดปัญหาไม่มีผู้เสนอราคา", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${kpi.bg}`}>
                <kpi.icon size={18} className={kpi.color} />
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{kpi.title}</div>
              <div className="text-[22px] font-extrabold text-slate-800 mt-1">{kpi.value}</div>
              <div className="text-[11px] font-medium text-slate-500 mt-1">{kpi.trend}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Spend vs Budget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-[15px] font-bold text-slate-800">งบประมาณ vs การเบิกจ่ายจริง (ล้านบาท)</h3>
            <p className="text-[12px] text-slate-500">เปรียบเทียบแผนงบประมาณจัดซื้อกับยอด PO ที่ออกจริงรายเดือน</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="budget" name="งบประมาณ (Budget)" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="spend" name="ยอดใช้จ่าย (Spend)" fill="#A80689" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Cost Savings Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-[15px] font-bold text-slate-800">ผลการประหยัดงบประมาณด้วย AI (Cost Savings)</h3>
            <p className="text-[12px] text-slate-500">มูลค่าที่ประหยัดได้จากการใช้ PEA Brain แนะนำช่วงเวลาจัดซื้อ</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costSavingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `฿${val}M`} />
                <Tooltip formatter={(value: any) => [`฿${value}M`, "Cost Saved"]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="saving" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Top Suppliers Table */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">การติดตามพฤติกรรม Supplier ด้วย AI (AI Supplier Analytics)</h3>
            <p className="text-[12px] text-slate-500 mt-1">ประเมินจากคุณภาพการส่งมอบตรงเวลา เพื่อช่วย AI คำนวณความเสี่ยงของขาดแคลน</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">ชื่อบริษัท (Supplier Name)</th>
                <th className="px-6 py-4">Trust Score</th>
                <th className="px-6 py-4">การส่งมอบตรงเวลา (On-Time)</th>
                <th className="px-6 py-4">มูลค่าจัดซื้อสะสม (Volume)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topSuppliers.map((sup, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800 text-[13px]">{sup.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-100 rounded-full h-2 max-w-[80px]">
                        <div className={`h-2 rounded-full ${sup.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${sup.score}%` }}></div>
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">{sup.score}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700 text-[12px]">{sup.delivery}</td>
                  <td className="px-6 py-4 font-bold text-[#A80689] text-[13px]">{formatCurrency(sup.volume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
