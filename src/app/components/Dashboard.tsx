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
  BrainCircuit,
  Database
} from "lucide-react";
import { useData } from "../context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

type TimeframeType = 'ปัจจุบัน' | '6M' | '1Y' | '3Y' | '5Y' | '7Y' | '10Y';

// --- MOCK DASHBOARD TIMEFRAME DATA ---
// NOTE: For backtest timeframes, 'spend' represents the AI cost (lower, purple) and 'budget' represents the Human cost (higher, grey).
const TF_DATA = {
  'ปัจจุบัน': {
    kpis: [
      { title: "ความเร็ววิเคราะห์ & วางแผน", value: "10 วินาที", trend: "ประหยัดเวลา 99% (จากเดิม 3 วัน)", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "ตรวจจับความเสี่ยงวิกฤต", value: "100%", trend: "วิเคราะห์แจ้งเตือนแบบ Real-time", icon: ShieldCheck, color: "text-red-600", bg: "bg-red-50" },
      { title: "ฟิลด์ข้อมูลที่ AI ประมวลผลได้", value: "25 Fields", trend: "มากกว่าข้อมูลดิบเดิมถึง 3.5 เท่า", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
      { title: "สร้างแผน e-Bidding", value: "อัตโนมัติ", trend: "คำนวณ ROP, EOQ, Lead Time ทันที", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    budgetChart: [
      { month: "Jan", spend: 120, budget: 150 },
      { month: "Feb", spend: 140, budget: 150 },
      { month: "Mar", spend: 160, budget: 150 },
      { month: "Apr", spend: 110, budget: 150 },
      { month: "May", spend: 90, budget: 150 },
      { month: "Jun", spend: 0, budget: 150 },
    ],
    savingsChart: [
      { month: "Jan", saving: 2.1 },
      { month: "Feb", saving: 3.4 },
      { month: "Mar", saving: 1.2 },
      { month: "Apr", saving: 5.6 },
      { month: "May", saving: 8.2 },
    ]
  },
  '6M': {
    kpis: [
      { title: "ความแม่นยำระบบ (Accuracy)", value: "85.0%", trend: "+5.2% จาก Base Model", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
      { title: "งบที่ประหยัดได้ (Cost Saved)", value: "฿12.5M", trend: "เทียบกับการจัดซื้อแบบปกติ", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
      { title: "ป้องกันวิกฤตพัสดุขาด", value: "2 ครั้ง", trend: "วิเคราะห์แจ้งเตือนพายุและ FX", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "ความเร็ววิเคราะห์ & วางแผน", value: "12 วินาที", trend: "วิเคราะห์ออเดอร์นำเข้า 40% ฉุกเฉิน", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    budgetChart: [
      { month: "Jul 25", spend: 155, budget: 160 },
      { month: "Aug 25", spend: 150, budget: 165 },
      { month: "Sep 25", spend: 152, budget: 158 },
      { month: "Oct 25", spend: 155, budget: 170 },
      { month: "Nov 25", spend: 148, budget: 168 },
      { month: "Dec 25", spend: 145, budget: 165 },
    ],
    savingsChart: [
      { month: "Jul", saving: 1.5 },
      { month: "Aug", saving: 2.3 },
      { month: "Sep", saving: 1.2 },
      { month: "Oct", saving: 3.1 },
      { month: "Nov", saving: 2.4 },
      { month: "Dec", saving: 2.0 },
    ]
  },
  '1Y': {
    kpis: [
      { title: "ความแม่นยำระบบ (Accuracy)", value: "89.5%", trend: "+12.5% จาก Base Model", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
      { title: "งบที่ประหยัดได้ (Cost Saved)", value: "฿48.2M", trend: "เทียบกับการจัดซื้อแบบปกติ", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
      { title: "ป้องกันวิกฤตพัสดุขาด", value: "5 ครั้ง", trend: "ป้องกันหม้อแปลงขาดแคลน 22M", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "ความเร็ววิเคราะห์ & วางแผน", value: "11 วินาที", trend: "ตรวจจับพายุใต้ฝุ่นและ Geo-risk", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    budgetChart: [
      { month: "Feb 25", spend: 145, budget: 155 },
      { month: "Apr 25", spend: 150, budget: 165 },
      { month: "Jun 25", spend: 152, budget: 160 },
      { month: "Aug 25", spend: 155, budget: 170 },
      { month: "Oct 25", spend: 148, budget: 168 },
      { month: "Dec 25", spend: 145, budget: 165 },
    ],
    savingsChart: [
      { month: "Feb", saving: 5.2 },
      { month: "Apr", saving: 8.5 },
      { month: "Jun", saving: 6.1 },
      { month: "Aug", saving: 12.0 },
      { month: "Oct", saving: 9.4 },
      { month: "Dec", saving: 7.0 },
    ]
  },
  '3Y': {
    kpis: [
      { title: "ความแม่นยำระบบ (Accuracy)", value: "94.2%", trend: "+21.0% จาก Base Model", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
      { title: "งบที่ประหยัดได้ (Cost Saved)", value: "฿124.5M", trend: "เซฟค่าหม้อแปลงและโซลาร์เซลล์", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
      { title: "ป้องกันวิกฤตพัสดุขาด", value: "14 ครั้ง", trend: "วิกฤตชิปขาดแคลนและสงครามการค้า", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "ความเร็ววิเคราะห์ & วางแผน", value: "10 วินาที", trend: "คำนวณ Dynamic ROP ล่วงหน้า 60 วัน", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    budgetChart: [
      { month: "Jan 23", spend: 148, budget: 152 },
      { month: "Jul 23", spend: 155, budget: 165 },
      { month: "Jan 24", spend: 152, budget: 168 },
      { month: "Jul 24", spend: 140, budget: 155 },
      { month: "Jan 25", spend: 155, budget: 170 },
      { month: "Dec 25", spend: 145, budget: 165 },
    ],
    savingsChart: [
      { month: "2023", saving: 35.0 },
      { month: "2024", saving: 42.5 },
      { month: "2025", saving: 47.0 },
    ]
  },
  '5Y': {
    kpis: [
      { title: "ความแม่นยำระบบ (Accuracy)", value: "96.5%", trend: "+31.5% จาก Base Model", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
      { title: "งบที่ประหยัดได้ (Cost Saved)", value: "฿215.8M", trend: "ฝ่า COVID-19 และ Logistics Freeze", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
      { title: "ป้องกันวิกฤตพัสดุขาด", value: "28 ครั้ง", trend: "รับมือภัยพิบัติและบาทผันผวนรุนแรง", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "ความเร็ววิเคราะห์ & วางแผน", value: "10 วินาที", trend: "Safety Stock Optimization สำเร็จ", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    budgetChart: [
      { month: "2021", spend: 135, budget: 140 },
      { month: "2022", spend: 145, budget: 158 },
      { month: "2023", spend: 150, budget: 165 },
      { month: "2024", spend: 155, budget: 172 },
      { month: "2025", spend: 148, budget: 168 },
    ],
    savingsChart: [
      { month: "2021", saving: 28.5 },
      { month: "2022", saving: 45.2 },
      { month: "2023", saving: 48.0 },
      { month: "2024", saving: 41.3 },
      { month: "2025", saving: 52.8 },
    ]
  },
  '7Y': {
    kpis: [
      { title: "ความแม่นยำระบบ (Accuracy)", value: "97.2%", trend: "+42.8% จาก Base Model", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
      { title: "งบที่ประหยัดได้ (Cost Saved)", value: "฿345.5M", trend: "วิเคราะห์ความสัมพันธ์ภูมิรัฐศาสตร์", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
      { title: "ป้องกันวิกฤตพัสดุขาด", value: "45 ครั้ง", trend: "รับมือภาษีนำเข้าโซลาร์กะทันหัน", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "ความเร็ววิเคราะห์ & วางแผน", value: "9 วินาที", trend: "Counter-cyclical Purchasing ล็อกต้นทุน", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    budgetChart: [
      { month: "2019", spend: 130, budget: 135 },
      { month: "2020", spend: 125, budget: 130 },
      { month: "2021", spend: 135, budget: 140 },
      { month: "2022", spend: 145, budget: 158 },
      { month: "2023", spend: 150, budget: 165 },
      { month: "2024", spend: 155, budget: 172 },
      { month: "2025", spend: 148, budget: 168 },
    ],
    savingsChart: [
      { month: "2019", saving: 22.0 },
      { month: "2020", saving: 35.5 },
      { month: "2021", saving: 41.2 },
      { month: "2022", saving: 58.0 },
      { month: "2023", saving: 61.8 },
      { month: "2024", saving: 59.0 },
      { month: "2025", saving: 68.0 },
    ]
  },
  '10Y': {
    kpis: [
      { title: "ความแม่นยำระบบ (Accuracy)", value: "98.8%", trend: "+68.5% จาก Base Model", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
      { title: "งบที่ประหยัดได้ (Cost Saved)", value: "฿650.0M", trend: "เซฟงบประมาณจัดซื้อสูงสุดระดับทศวรรษ", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
      { title: "ป้องกันวิกฤตพัสดุขาด", value: "72 ครั้ง", trend: "บริหารความเสี่ยงแบบบูรณาการระดับชาติ", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "ความเร็ววิเคราะห์ & วางแผน", value: "8 วินาที", trend: "Decade-based Predictive Modeling", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    budgetChart: [
      { month: "2016", spend: 115, budget: 120 },
      { month: "2018", spend: 120, budget: 125 },
      { month: "2020", spend: 125, budget: 130 },
      { month: "2022", spend: 145, budget: 158 },
      { month: "2024", spend: 155, budget: 172 },
      { month: "2025", spend: 148, budget: 168 },
    ],
    savingsChart: [
      { month: "2016", saving: 15.0 },
      { month: "2018", saving: 28.2 },
      { month: "2020", saving: 45.0 },
      { month: "2022", saving: 92.5 },
      { month: "2024", saving: 110.0 },
      { month: "2025", saving: 124.3 },
    ]
  }
};

function formatCurrency(value: number) {
  if (value >= 1e9) return `฿${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `฿${(value / 1e6).toFixed(1)}M`;
  return `฿${value.toLocaleString()}`;
}

export default function Dashboard({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const { materials, riskAlerts, vendors, isLoading } = useData();
  const [approvedPlansCount, setApprovedPlansCount] = useState(0);
  const [activeTF, setActiveTF] = useState<TimeframeType>('ปัจจุบัน');
  const [isTFUpdating, setIsTFUpdating] = useState(false);

  const criticalAlerts = riskAlerts.filter(a => a.severity === 'critical');
  const criticalVaR = criticalAlerts.reduce((sum, a) => sum + (a.costImpact || 0), 0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pea_approved_plans");
      if (saved) {
        const parsed = JSON.parse(saved);
        const uniqueMaterials = new Set(parsed.map((p: any) => p.materialId));
        setApprovedPlansCount(uniqueMaterials.size);
      }
      
      const handleStorage = () => {
        const s = localStorage.getItem("pea_approved_plans");
        if (s) {
          const parsed = JSON.parse(s);
          const uniqueMaterials = new Set(parsed.map((p: any) => p.materialId));
          setApprovedPlansCount(uniqueMaterials.size);
        }
      };
      window.addEventListener("approve-plan", handleStorage);
      return () => window.removeEventListener("approve-plan", handleStorage);
    } catch {}
  }, []);

  useEffect(() => {
    setIsTFUpdating(true);
    const timer = setTimeout(() => setIsTFUpdating(false), 300);
    return () => clearTimeout(timer);
  }, [activeTF]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <BarChart3 size={32} className="animate-pulse text-purple-600" />
        <div className="text-sm font-bold text-slate-500">กำลังโหลดข้อมูล Executive Dashboard...</div>
      </div>
    );
  }

  const tfData = TF_DATA[activeTF];

  const topSuppliers = (vendors || []).slice(0, 4).map(v => ({
    name: v.name,
    score: Math.round(v.reliabilityScore * 100),
    delivery: `${Math.round(v.reliabilityScore * 100)}%`,
    volume: (v.registeredCapacity + v.outstandingPOs) * 125000,
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="rounded-[32px] bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#312e81] border border-purple-500/30 px-8 py-8 shadow-[0_10px_40px_-10px_rgba(76,29,149,0.5)] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex-1 w-full">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1.5 text-[13px] font-bold tracking-widest text-purple-100 border border-white/10 uppercase shadow-inner">
            <Briefcase size={16} className="text-purple-300" />
            {activeTF === 'ปัจจุบัน' ? "AI Executive Command Center" : `Backtest Simulation: ${activeTF}`}
          </div>
          <h1 className="text-[28px] font-black text-white leading-tight drop-shadow-md tracking-tight">
            ภาพรวมการทำงานของ PEA Brain (Multi-Agent Squad)
          </h1>
          <p className="mt-2 text-[15px] text-purple-200/90 font-medium max-w-xl leading-relaxed">
            {activeTF === 'ปัจจุบัน' 
              ? "สรุปข้อมูลการจัดการความเสี่ยงสต๊อกขาดแคลน การวางแผนจัดซื้อด้วย AI และผลประหยัดงบประมาณแบบเรียลไทม์"
              : `ประมวลผลประสิทธิภาพย้อนหลังของโมเดล AI ในช่วงเวลา ${activeTF} ที่ผ่านมา`}
          </p>

          {/* Timeframe Selector */}
          <div className="mt-4 flex bg-purple-950/40 p-1 rounded-xl border border-white/10 backdrop-blur-sm self-start overflow-x-auto max-w-full w-fit">
            {(['ปัจจุบัน', '6M', '1Y', '3Y', '5Y', '7Y', '10Y'] as TimeframeType[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTF(tf)}
                className={`px-4 py-2 rounded-lg text-[14px] font-extrabold transition-all cursor-pointer ${
                  activeTF === tf 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : 'text-purple-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 shrink-0 relative z-10 w-full md:w-auto justify-end">
          {activeTF === 'ปัจจุบัน' ? (
            <>
              <div className="bg-white rounded-2xl p-4 text-center min-w-[150px] flex-1 md:flex-none cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] transition-all shadow-xl" onClick={() => setActiveTab?.("risk")}>
                <div className="text-[13px] font-extrabold text-red-600 uppercase flex justify-center items-center gap-1.5">
                  <AlertTriangle size={14} /> ความเสี่ยงที่ต้องจัดการ
                </div>
                <div className="text-[34px] font-black text-slate-900 mt-1 leading-none tracking-tight">{criticalAlerts.length} <span className="text-[16px]">รายการ</span></div>
                <div className="text-[13px] font-bold text-red-500 mt-2">มูลค่าความเสี่ยง {formatCurrency(criticalVaR)}</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center min-w-[150px] flex-1 md:flex-none cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] transition-all shadow-xl" onClick={() => setActiveTab?.("ebidding")}>
                <div className="text-[13px] font-extrabold text-emerald-600 uppercase flex justify-center items-center gap-1.5">
                  <CheckCircle2 size={14} /> แก้ไขแล้วด้วย AI
                </div>
                <div className="text-[34px] font-black text-slate-900 mt-1 leading-none tracking-tight">{approvedPlansCount} <span className="text-[16px]">แผน</span></div>
                <div className="text-[13px] font-bold text-emerald-600 mt-2">พร้อมดำเนินการทันที</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl p-4 text-center min-w-[150px] flex-1 md:flex-none shadow-xl">
                <div className="text-[13px] font-extrabold text-amber-600 uppercase flex justify-center items-center gap-1.5">
                  <ShieldCheck size={14} /> ป้องกันวิกฤตสำเร็จ
                </div>
                <div className="text-[34px] font-black text-slate-900 mt-1 leading-none tracking-tight">{tfData.kpis[2].value}</div>
                <div className="text-[13px] font-bold text-amber-600 mt-2">อิงจากสถิติช่วง {activeTF}</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center min-w-[150px] flex-1 md:flex-none shadow-xl">
                <div className="text-[13px] font-extrabold text-emerald-600 uppercase flex justify-center items-center gap-1.5">
                  <DollarSign size={14} /> งบประหยัดสะสม
                </div>
                <div className="text-[34px] font-black text-slate-900 mt-1 leading-none tracking-tight">{tfData.kpis[1].value}</div>
                <div className="text-[13px] font-bold text-emerald-600 mt-2">สถิติช่วงย้อนหลัง {activeTF}</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* TF Updating State */}
      {isTFUpdating ? (
        <div className="flex h-[40vh] flex-col items-center justify-center space-y-4">
          <BrainCircuit size={36} className="animate-spin text-purple-600" />
          <div className="text-sm font-bold text-slate-500">PEA Brain กำลังประมวลผลฐานข้อมูลย้อนหลัง ({activeTF})...</div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Grid */}
          <section className="grid gap-4 md:grid-cols-4">
            {tfData.kpis.map((kpi, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl ${kpi.bg}`}>
                    <kpi.icon size={18} className={kpi.color} />
                  </div>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-400 uppercase tracking-wide">{kpi.title}</div>
                  <div className="text-[26px] font-extrabold text-slate-800 mt-1">{kpi.value}</div>
                  <div className="text-[13px] font-medium text-slate-500 mt-1">{kpi.trend}</div>
                </div>
              </div>
            ))}
          </section>

          {/* Charts Section */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Spend vs Budget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800">
                    {activeTF === 'ปัจจุบัน' ? "งบประมาณ vs การเบิกจ่ายจริง (ล้านบาท)" : "เปรียบเทียบต้นทุนจัดซื้อ: ดำเนินการปกติ vs ใช้ AI (ล้านบาท)"}
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    {activeTF === 'ปัจจุบัน' 
                      ? "เปรียบเทียบแผนงบประมาณจัดซื้อกับยอด PO ที่ออกจริงรายเดือน" 
                      : "แสดงผลกระทบความสูญเสียจากต้นทุนกรณีซื้อรูปแบบปกติ เทียบกับการล็อกและบริหารโดย AI"}
                  </p>
                </div>
                <span className="bg-slate-100 text-slate-500 text-[12px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                  {activeTF === 'ปัจจุบัน' ? "Simulated Data" : "Historical Simulation"}
                </span>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tfData.budgetChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    <Bar dataKey="budget" name={activeTF === 'ปัจจุบัน' ? "งบประมาณ (Budget)" : "ต้นทุนจัดซื้อปกติ (Human)"} fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="spend" name={activeTF === 'ปัจจุบัน' ? "ยอดใช้จ่าย (Spend)" : "ต้นทุนจัดซื้อจำลอง (AI)"} fill="#A80689" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Cost Savings Trend */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800">ผลการประหยัดงบประมาณด้วย AI (Cost Savings)</h3>
                  <p className="text-[12px] text-slate-500">
                    {activeTF === 'ปัจจุบัน' 
                      ? "มูลค่าที่คาดว่าจะประหยัดได้ (Expected) จากการใช้ PEA Brain" 
                      : `สถิติงบสะสมที่ประหยัดได้ในช่วงเวลาย้อนหลัง ${activeTF}`}
                  </p>
                </div>
                <span className="bg-slate-100 text-slate-500 text-[12px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                  {activeTF === 'ปัจจุบัน' ? "Projection" : "Historical Record"}
                </span>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tfData.savingsChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <span className="bg-slate-100 text-slate-500 text-[12px] px-2 py-1 rounded font-bold uppercase tracking-wider">Simulated Data</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                    <td className="px-6 py-4">ชื่อบริษัท (Supplier Name)</td>
                    <td className="px-6 py-4">Trust Score</td>
                    <td className="px-6 py-4">การส่งมอบตรงเวลา (On-Time)</td>
                    <td className="px-6 py-4">มูลค่าจัดซื้อสะสม (Volume)</td>
                  </tr>
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
      )}
    </div>
  );
}
