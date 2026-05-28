"use client";

import { CheckCircle2, Circle, Clock, Code2, Database, LayoutTemplate, Map, Network, Server, Sparkles, Box, User, ArrowRight, HardDrive, Zap, BarChart3, BrainCircuit, TrendingUp, AlertTriangle, RefreshCw, Calculator, ClipboardList, Blocks, Palette, Smartphone, Container, Plug, Cloud, GitBranch, Rocket, Activity, ShieldAlert } from "lucide-react";

import { useData } from "../context/DataContext";

export default function ProjectRoadmap() {
  const { dataSummary } = useData();

  const sprints = [
    {
      id: "sprint-1",
      name: "Phase 1: Orientation & Proposal",
      status: "completed",
      date: "5 - 13 May",
      tasks: [
        "Orientation & Workshop (Build-Measure-Learn)",
        "กำหนด Core Architecture และเทคโนโลยีที่ใช้",
        "ออกแบบโครงสร้าง (Conceptual Framework) ของ PEA Brain",
        "ส่ง Proposal แผนการพัฒนา PoC (13 May)"
      ]
    },
    {
      id: "sprint-2",
      name: "Phase 2: PoC Development (Part 1)",
      status: "completed",
      date: "19 - 30 May",
      tasks: [
        "พัฒนาระบบ Dashboard และ UI หลักทั้งหมด",
        "เชื่อมต่อ AWS Bedrock และสร้าง PEA Brain Copilot",
        "พัฒนาระบบวิเคราะห์ความเสี่ยงและพยากรณ์ Demand",
        "ทดสอบความแม่นยำของ Data Model"
      ]
    },
    {
      id: "sprint-3",
      name: "Phase 3: PoC Development (Part 2)",
      status: "in-progress",
      date: "31 May - 11 Jun (CURRENT)",
      tasks: [
        "[x] สร้าง Multi-Agent Architecture (Risk, Math, Procurement)",
        "[x] สร้างฟีเจอร์ Procurement Automation (e-Bidding)",
        "[x] อัปเดต Prompt Rules (บังคับ AI อธิบายเหตุผล, มีอ้างอิง, แสดงรายละเอียดแผน)",
        "พัฒนาระบบ Export รายงานและสรุปผลสำหรับผู้บริหาร",
        "เตรียมระบบสำหรับ Demo เสมือนจริง"
      ]
    },
    {
      id: "sprint-4",
      name: "Phase 4: Optimization & Final Pitching",
      status: "pending",
      date: "15 - 17 Jun",
      tasks: [
        "วางแผน Train AI Model (Fine-tuning) ให้เก่งและแม่นยำขึ้นเฉพาะด้านสายงาน PEA",
        "ออกแบบกระบวนการ Backtesting จำลองเทียบเคียงข้อมูลการจัดซื้อในอดีต",
        "สรุป Business Value และ ROI ที่ PEA จะได้รับ",
        "นำเสนอผลงาน (Final Pitching) ต่อคณะกรรมการ",
        "ส่งมอบผลงาน PoC ฉบับสมบูรณ์"
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <section className="rounded-[32px] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] border border-slate-700/50 p-8 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.16em] text-fuchsia-200 shadow-inner">
            <Map size={14} className="text-fuchsia-300" />
            Project Roadmap
          </div>
          <h1 className="mt-4 text-[24px] font-black tracking-tight text-white drop-shadow-md">แผนงานและโครงสร้างระบบ (Architecture & Timeline)</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-300/90 font-medium">
            สรุปโครงสร้างเทคโนโลยีที่ใช้พัฒนา (Tech Stack) และแผนการดำเนินงาน (Sprint Updates) ของ PEA Brain
          </p>
        </div>
      </section>

      {/* ===== ARCHITECTURE DATA FLOW (Light Theme Redesign) ===== */}
      <section className="rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-purple-50/50 border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-400/10 transition-all duration-700" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-fuchsia-400/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">

          {/* ===== ROW 1: Data Storage & AI Engine ===== */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">

            {/* Data Storage (Top-Left) */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-[14px] text-amber-600"><Database size={16} /></div>
                <h3 className="text-[14px] font-black text-slate-800">Data Storage & Memory (แหล่งเก็บข้อมูล)</h3>
              </div>
              <div className="bg-white/80 rounded-2xl border border-slate-200 p-4 backdrop-blur-md shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-amber-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-amber-600 shrink-0"><HardDrive size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Amazon S3</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Data Lake (ฐานเก็บไฟล์ขนาดใหญ่)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-blue-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-blue-600 shrink-0"><Database size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Amazon RDS / Prisma DB</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Relational Data (ข้อมูลตาราง/โครงสร้าง)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600 shrink-0"><Zap size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Amazon DynamoDB</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Fast NoSQL (หน่วยความจำแชท)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Hub */}
            <div className="flex flex-col items-center px-4">
              {/* Dashed lines going left and right */}
              <div className="relative">
                <div className="absolute top-1/2 -left-[60px] w-[60px] h-px border-t-2 border-dashed border-slate-300" />
                <div className="absolute top-1/2 -right-[60px] w-[60px] h-px border-t-2 border-dashed border-slate-300" />
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-center border-[4px] border-white relative group-hover:shadow-[0_0_60px_rgba(168,85,247,0.4)] transition-shadow duration-500 z-20">
                  <div className="absolute inset-[3px] rounded-full bg-white/95 backdrop-blur-sm" />
                  <div className="text-center relative z-10">
                    <div className="text-[26px] font-black text-slate-900 leading-none tracking-tight">PEA</div>
                    <div className="text-[18px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600 leading-none">Brain</div>
                    <div className="text-[13px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Agentic AI</div>
                  </div>
                </div>
              </div>
              {/* Dashed line going down */}
              <div className="w-px h-8 border-l-2 border-dashed border-slate-300" />
            </div>

            {/* AI Engine (Top-Right) */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-fuchsia-100 flex items-center justify-center text-[14px] text-fuchsia-600"><BrainCircuit size={16} /></div>
                <h3 className="text-[14px] font-black text-slate-800">Multi-Agent Framework (มันสมอง AI)</h3>
              </div>
              <div className="bg-white/80 rounded-2xl border border-slate-200 p-4 backdrop-blur-md shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex flex-col gap-2 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-fuchsia-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-100 to-purple-50 flex items-center justify-center text-fuchsia-600 shrink-0"><BrainCircuit size={14} /></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[13px] font-bold text-slate-800">Bedrock Agent Squad</div>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                      <div className="text-[12px] text-slate-500 font-medium">Multi-Agent Orchestration (ประสานงาน AI หลายตัว)</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-[44px] text-[13px] font-semibold text-fuchsia-700">
                    <span className="bg-fuchsia-50 px-1.5 py-0.5 rounded flex items-center gap-1"><User size={13}/> Procurement Agent (ผู้ช่วยจัดซื้อ)</span>
                    <span className="bg-fuchsia-50 px-1.5 py-0.5 rounded flex items-center gap-1"><Calculator size={13}/> Math Agent (นักคำนวณ)</span>
                    <span className="bg-fuchsia-50 px-1.5 py-0.5 rounded flex items-center gap-1"><AlertTriangle size={13}/> Risk Agent (ประเมินความเสี่ยง)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-purple-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-violet-50 flex items-center justify-center text-purple-600 shrink-0"><Sparkles size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Amazon Nova Pro / Claude</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Foundation Model (โมเดลภาษา)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-pink-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center text-pink-600 shrink-0"><AlertTriangle size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Bedrock Guardrails</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Safety (ควบคุมความปลอดภัยข้อมูล)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ROW 2: Data Processing (Center) ===== */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start mb-6">
            {/* Dashed line from left box */}
            <div className="flex items-center justify-end pt-10">
              <div className="w-full h-px border-t-2 border-dashed border-slate-300" />
            </div>

            {/* Data Processing (Center Box) */}
            <div className="relative w-[340px]">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-[14px] text-rose-600"><RefreshCw size={16} /></div>
                <h3 className="text-[14px] font-black text-slate-800">Data Processing (ท่อประมวลผลข้อมูล)</h3>
              </div>
              <div className="bg-white/80 rounded-2xl border border-slate-200 p-4 backdrop-blur-md shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-rose-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-red-50 flex items-center justify-center text-rose-600 shrink-0"><Network size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS Step Functions</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Workflow (จัดการลำดับการทำงาน)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-orange-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-[14px] shrink-0 font-black text-orange-600">λ</div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS Lambda</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Serverless (ประมวลผลไร้เซิร์ฟเวอร์)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-yellow-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-100 to-amber-50 flex items-center justify-center text-amber-600 shrink-0"><ClipboardList size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS Glue</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">ETL (เตรียมและดึงข้อมูลอัตโนมัติ)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashed line from right box */}
            <div className="flex items-center justify-start pt-10">
              <div className="w-full h-px border-t-2 border-dashed border-slate-300" />
            </div>
          </div>

          {/* ===== ROW 3: Frontend + Backend + Cloud/DevOps ===== */}
          <div className="grid grid-cols-3 gap-6">

            {/* Frontend */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[14px] text-emerald-600"><Blocks size={16} /></div>
                <h3 className="text-[14px] font-black text-slate-800">Frontend Delivery (หน้าจอผู้ใช้)</h3>
              </div>
              <div className="bg-white/80 rounded-2xl border border-slate-200 p-4 backdrop-blur-md shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600 shrink-0"><Rocket size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS Amplify</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Secure Hosting (โฮสต์เว็บอย่างปลอดภัย)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-teal-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-100 to-cyan-50 flex items-center justify-center text-teal-600 shrink-0"><Blocks size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Next.js 14</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">React Framework (โครงสร้างเว็บ)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-green-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-green-600 shrink-0"><Palette size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Tailwind CSS</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Enterprise UI (ออกแบบเพื่อความสวยงาม)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center text-[14px] text-cyan-600"><Container size={16} /></div>
                <h3 className="text-[14px] font-black text-slate-800">API & Integration (เชื่อมต่อระบบ)</h3>
              </div>
              <div className="bg-white/80 rounded-2xl border border-slate-200 p-4 backdrop-blur-md shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-cyan-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-50 flex items-center justify-center text-cyan-600 shrink-0"><Plug size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Amazon API Gateway</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Secure API (จุดรับส่งข้อมูลที่ปลอดภัย)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-sky-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center text-[14px] shrink-0 font-black text-sky-600">λ</div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS Lambda</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Microservices (ระบบจัดการหลังบ้านย่อย)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-indigo-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-50 flex items-center justify-center text-indigo-600 shrink-0"><Activity size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">Amazon CloudWatch</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Monitoring (เฝ้าระวังความผิดปกติ)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud / DevOps */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[14px] text-slate-600"><Cloud size={16} /></div>
                <h3 className="text-[14px] font-black text-slate-800">Deployment (การติดตั้ง & ความปลอดภัย)</h3>
              </div>
              <div className="bg-white/80 rounded-2xl border border-slate-200 p-4 backdrop-blur-md shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-slate-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-gray-50 flex items-center justify-center text-slate-600 shrink-0"><GitBranch size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS CI/CD Pipeline</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">CI/CD (ระบบส่งมอบโค้ดอัตโนมัติ)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-slate-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-gray-50 flex items-center justify-center text-slate-600 shrink-0"><Box size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS CloudFormation</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">IaC (จัดการเซิร์ฟเวอร์ด้วยโค้ด)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/30 hover:bg-slate-50/50 transition-colors shadow-sm relative z-10 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-gray-50 flex items-center justify-center text-slate-600 shrink-0"><User size={14} /></div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-bold text-slate-800">AWS IAM</div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">Access Control (ควบคุมสิทธิ์เข้าถึงข้อมูล)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== 3 DATA BUCKETS START ===== */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Network size={20} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-slate-900">Data Flow Architecture</h2>
            <p className="text-[13px] text-slate-500 font-medium">ภาพรวมการไหลของข้อมูลจากต้นทางสู่ Dashboard</p>
          </div>
        </div>

        {/* Flow Diagram - Horizontal */}
        <div className="flex items-stretch gap-0 overflow-x-auto pb-4">

          {/* Step 1: Data Source */}
          <div className="flex-shrink-0 w-[160px]">
            <div className="bg-gradient-to-b from-amber-500 to-amber-600 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-amber-200">
              <Database size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">S3 Bucket</div>
              <div className="text-[12px] text-amber-100 text-center mt-1 font-medium">pea-hackathon-data1</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">materials.json</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">riskAlerts.json</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">totalVaR</div>
              </div>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[13px] font-bold text-slate-400 mb-1 whitespace-nowrap">API Gateway</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-purple-500 relative">
                <ArrowRight size={12} className="text-purple-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[13px] font-bold text-slate-400 mt-1 whitespace-nowrap">REST API</div>
            </div>
          </div>

          {/* Step 2: Lambda */}
          <div className="flex-shrink-0 w-[160px]">
            <div className="bg-gradient-to-b from-purple-600 to-purple-700 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-purple-200">
              <Server size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">AWS Lambda</div>
              <div className="text-[12px] text-purple-200 text-center mt-1 font-medium">Orchestrator</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">Data Fetch</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">Risk Calc</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">VaR Engine</div>
              </div>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[13px] font-bold text-slate-400 mb-1 whitespace-nowrap">JSON Response</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
                <ArrowRight size={12} className="text-indigo-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[13px] font-bold text-slate-400 mt-1 whitespace-nowrap">7 Raw Fields</div>
            </div>
          </div>

          {/* Step 3: PEA Brain AI */}
          <div className="flex-shrink-0 w-[180px]">
            <div className="bg-gradient-to-b from-indigo-600 to-blue-700 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-md" />
              <Sparkles size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">PEA Brain AI</div>
              <div className="text-[12px] text-indigo-200 text-center mt-1 font-medium">Feature Engineering</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">Demand Forecast</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">EOQ / ROP</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">Supplier Trust</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">Lot Strategy</div>
              </div>
            </div>
          </div>

          {/* Arrow 3 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[13px] font-bold text-slate-400 mb-1 whitespace-nowrap">Merged Data</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 relative">
                <ArrowRight size={12} className="text-fuchsia-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[13px] font-bold text-slate-400 mt-1 whitespace-nowrap">25 Fields</div>
            </div>
          </div>

          {/* Step 4: Bedrock AI */}
          <div className="flex-shrink-0 w-[180px]">
            <div className="bg-gradient-to-b from-fuchsia-600 to-pink-600 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-fuchsia-200">
              <Sparkles size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">Bedrock Multi-Agent</div>
              <div className="text-[12px] text-fuchsia-200 text-center mt-1 font-medium">Model-Agnostic Architecture</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">1. Supervisor (Claude 3.5 Sonnet)</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">2. Math Agent (Amazon Nova Pro)</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">3. Risk Agent (Meta Llama 3)</div>
              </div>
            </div>
          </div>

          {/* Arrow 4 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[13px] font-bold text-slate-400 mb-1 whitespace-nowrap">Insights</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-fuchsia-500 to-emerald-500 relative">
                <ArrowRight size={12} className="text-emerald-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[13px] font-bold text-slate-400 mt-1 whitespace-nowrap">NLP Output</div>
            </div>
          </div>

          {/* Step 5: Dashboard */}
          <div className="flex-shrink-0 w-[160px]">
            <div className="bg-gradient-to-b from-emerald-600 to-teal-600 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-200">
              <LayoutTemplate size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">Dashboard</div>
              <div className="text-[12px] text-emerald-200 text-center mt-1 font-medium">Next.js Frontend</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">Overview</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">Risk Mgmt</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">e-Bidding Sim</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[13px] text-center font-bold">AI Copilot</div>
              </div>
            </div>
          </div>

        </div>

        {/* Detail Grid: ใช้ทำอะไร / ทำเพื่ออะไร / ประโยชน์ */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 border-t border-slate-100 pt-6">
          {/* S3 Details */}
          <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100 flex flex-col gap-2">
            <div className="text-[13px] font-black text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" /> Data Source (S3)
            </div>
            <div className="text-[12px] leading-relaxed text-slate-600 space-y-1.5">
              <div>
                <span className="font-bold text-amber-900">ใช้ทำอะไร:</span> เก็บไฟล์ข้อมูลดิบ (Raw Data) เช่น ข้อมูลพัสดุและรายการเสี่ยง
              </div>
              <div>
                <span className="font-bold text-amber-900">ทำเพื่ออะไร:</span> เป็นแหล่งข้อมูลกลางคลาวด์ที่ปลอดภัยและพร้อมใช้งานตลอดเวลา
              </div>
              <div>
                <span className="font-bold text-amber-900">ประโยชน์:</span> ลดภาระการคิวรี่บนระบบ ERP/WMS หลัก ทำให้การทำงานรวดเร็วขึ้น
              </div>
            </div>
          </div>

          {/* Lambda Details */}
          <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100 flex flex-col gap-2">
            <div className="text-[13px] font-black text-purple-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" /> Processing (Lambda)
            </div>
            <div className="text-[12px] leading-relaxed text-slate-600 space-y-1.5">
              <div>
                <span className="font-bold text-purple-900">ใช้ทำอะไร:</span> ดึงข้อมูลดิบจาก S3 มาประมวลผลคำนวณระดับความเสี่ยงเบื้องต้น
              </div>
              <div>
                <span className="font-bold text-purple-900">ทำเพื่ออะไร:</span> ทำงานเป็นตัวประสานระบบ (Orchestrator) จัดรูปแบบข้อมูลให้ระบบ AI
              </div>
              <div>
                <span className="font-bold text-purple-900">ประโยชน์:</span> ประมวลผลแบบ Serverless จ่ายตามจริง ทำงานเร็วระดับมิลลิวินาที
              </div>
            </div>
          </div>

          {/* PEA Brain Details */}
          <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 flex flex-col gap-2">
            <div className="text-[13px] font-black text-indigo-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" /> AI Engine (PEA Brain)
            </div>
            <div className="text-[12px] leading-relaxed text-slate-600 space-y-1.5">
              <div>
                <span className="font-bold text-indigo-900">ใช้ทำอะไร:</span> คำนวณแบบจำลองขั้นสูง (Demand Forecast, EOQ/ROP, Lot Strategy)
              </div>
              <div>
                <span className="font-bold text-indigo-900">ทำเพื่ออะไร:</span> ทำ Feature Engineering และสร้างตัวแปรเพื่อประกอบการวิเคราะห์เชิงลึก
              </div>
              <div>
                <span className="font-bold text-indigo-900">ประโยชน์:</span> วางแผนบริหารคลังสินค้าโดยอิงตามสถิติและความเสี่ยงจริง แทนการกะเกณฑ์
              </div>
            </div>
          </div>

          {/* Bedrock Details */}
          <div className="bg-fuchsia-50/50 rounded-xl p-3 border border-fuchsia-100 flex flex-col gap-2">
            <div className="text-[13px] font-black text-fuchsia-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-fuchsia-600 shrink-0" /> LLM (Bedrock)
            </div>
            <div className="text-[12px] leading-relaxed text-slate-600 space-y-1.5">
              <div>
                <span className="font-bold text-fuchsia-900">ใช้ทำอะไร:</span> ทำงานประสานงานกันระหว่าง AI Agents (Supervisor, Math, Risk)
              </div>
              <div>
                <span className="font-bold text-fuchsia-900">ทำเพื่ออะไร:</span> สรุปวิเคราะห์ผลกระทบและข้อเสนอแนะแนะแนวทางแก้ไขความเสี่ยง
              </div>
              <div>
                <span className="font-bold text-fuchsia-900">ประโยชน์:</span> ผู้บริหารเข้าใจสถานการณ์ได้ทันทีผ่านภาษาคน (Natural Language)
              </div>
            </div>
          </div>

          {/* Dashboard Details */}
          <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 flex flex-col gap-2">
            <div className="text-[13px] font-black text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" /> Frontend (Dashboard)
            </div>
            <div className="text-[12px] leading-relaxed text-slate-600 space-y-1.5">
              <div>
                <span className="font-bold text-emerald-900">ใช้ทำอะไร:</span> แสดงผลแดชบอร์ด รายงานความเสี่ยง และแบบจำลองจัดซื้อ e-Bidding
              </div>
              <div>
                <span className="font-bold text-emerald-900">ทำเพื่ออะไร:</span> ให้เจ้าหน้าที่และผู้บริหารโต้ตอบและสั่งการฉุกเฉินได้ในที่เดียว
              </div>
              <div>
                <span className="font-bold text-emerald-900">ประโยชน์:</span> ตัดสินใจอนุมัติแผนและออกใบสั่งซื้อ (PO) รวดเร็ว ป้องกันสายโซ่อุปทานขาด
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-[13px] font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Data Source (S3)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-600" /> Processing (Lambda)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-600" /> AI Engine (PEA Brain)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-fuchsia-600" /> LLM (Bedrock)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600" /> Frontend (Dashboard)</span>
        </div>
      </section>

      {/* ===== S3 DATA BUCKET (Original Reference) ===== */}
      <section className="relative">
        {/* Bucket Shape */}
        <div className="rounded-[32px] border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50/80 to-white p-1.5">
          
          {/* Bucket Handle / Header */}
          <div className="bg-slate-800 rounded-t-[26px] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Database size={18} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-white tracking-tight">🪣 S3 Data Bucket — ข้อมูลเริ่มต้นจาก Sandbox</h2>
                <p className="text-[13px] text-slate-400 font-medium mt-0.5">ข้อมูลดิบทั้งหมดที่ PEA ให้มา • เก็บไว้เป็นข้อมูลอ้างอิง (Reference Data)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md font-mono">s3://pea-hackathon-data1</span>
              <span className="text-[12px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">✓ LIVE</span>
            </div>
          </div>

          {/* Bucket Body */}
          <div className="bg-white rounded-b-[26px] p-6">

            {/* Materials Table */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                materials[] — พัสดุ ({`3 รายการ`})
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-[13px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">id</th>
                        <th className="px-4 py-2.5">name</th>
                        <th className="px-4 py-2.5 text-right">currentStock</th>
                        <th className="px-4 py-2.5 text-right">safetyStock</th>
                        <th className="px-4 py-2.5 text-center">sparkline</th>
                        <th className="px-4 py-2.5 text-right">budgetPrice</th>
                        <th className="px-4 py-2.5 text-right">unitPrice</th>
                      </tr>
                    </thead>
                    <tbody className="text-[12px] font-medium text-slate-700 divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-indigo-600 font-bold">10067</td>
                        <td className="px-4 py-3">160 kVA Transformer 3Ph</td>
                        <td className="px-4 py-3 text-right text-red-600 font-bold">12</td>
                        <td className="px-4 py-3 text-right">250</td>
                        <td className="px-4 py-3 text-center text-[13px] text-slate-400 font-mono">[400,380,250,150,80,12]</td>
                        <td className="px-4 py-3 text-right">฿150,000</td>
                        <td className="px-4 py-3 text-right">฿192,800</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-indigo-600 font-bold">10066</td>
                        <td className="px-4 py-3">100 kVA Transformer 3Ph</td>
                        <td className="px-4 py-3 text-right text-red-600 font-bold">5</td>
                        <td className="px-4 py-3 text-right">100</td>
                        <td className="px-4 py-3 text-center text-[13px] text-slate-400 font-mono">[120,100,80,60,40,5]</td>
                        <td className="px-4 py-3 text-right">฿85,000</td>
                        <td className="px-4 py-3 text-right">฿120,500</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-indigo-600 font-bold">20045</td>
                        <td className="px-4 py-3">Drop Out Fuse Cutout 24kV</td>
                        <td className="px-4 py-3 text-right">120</td>
                        <td className="px-4 py-3 text-right">5,000</td>
                        <td className="px-4 py-3 text-center text-[13px] text-slate-400 font-mono">[6000,5200,4100,3000,2100,120]</td>
                        <td className="px-4 py-3 text-right">฿4,200</td>
                        <td className="px-4 py-3 text-right">฿4,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Risk Alerts Table */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                riskAlerts[] — การแจ้งเตือนความเสี่ยง ({`3 รายการ`})
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-[13px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">id</th>
                        <th className="px-4 py-2.5">severity</th>
                        <th className="px-4 py-2.5">materialId</th>
                        <th className="px-4 py-2.5">message</th>
                        <th className="px-4 py-2.5 text-right">costImpact</th>
                      </tr>
                    </thead>
                    <tbody className="text-[12px] font-medium text-slate-700 divide-y divide-slate-100">
                      <tr className="hover:bg-red-50/30">
                        <td className="px-4 py-3 font-mono text-slate-400">alt-1</td>
                        <td className="px-4 py-3"><span className="bg-red-100 text-red-700 text-[13px] font-bold px-2 py-0.5 rounded-full">critical</span></td>
                        <td className="px-4 py-3 font-mono text-indigo-600 font-bold">10067</td>
                        <td className="px-4 py-3 text-[13px] max-w-[300px]">พายุโซนร้อนเข้าภาคเหนือ หม้อแปลง 160kVA ขาดแคลนวิกฤต (12/250)</td>
                        <td className="px-4 py-3 text-right text-red-600 font-bold">฿231.36M</td>
                      </tr>
                      <tr className="hover:bg-red-50/30">
                        <td className="px-4 py-3 font-mono text-slate-400">alt-2</td>
                        <td className="px-4 py-3"><span className="bg-red-100 text-red-700 text-[13px] font-bold px-2 py-0.5 rounded-full">critical</span></td>
                        <td className="px-4 py-3 font-mono text-indigo-600 font-bold">10066</td>
                        <td className="px-4 py-3 text-[13px] max-w-[300px]">สต๊อกหม้อแปลง 100kVA ต่ำกว่าเกณฑ์ (5/100) ไม่เพียงพอรับมือภัยพิบัติ</td>
                        <td className="px-4 py-3 text-right text-red-600 font-bold">฿114.47M</td>
                      </tr>
                      <tr className="hover:bg-amber-50/30">
                        <td className="px-4 py-3 font-mono text-slate-400">alt-3</td>
                        <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 text-[13px] font-bold px-2 py-0.5 rounded-full">warning</span></td>
                        <td className="px-4 py-3 font-mono text-indigo-600 font-bold">20045</td>
                        <td className="px-4 py-3 text-[13px] max-w-[300px]">Drop Out Fuse ขาดสต๊อก แต่ซัพพลายเออร์ส่งของล่าช้า 2 สัปดาห์</td>
                        <td className="px-4 py-3 text-right text-amber-600 font-bold">฿21.96M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* totalVaR */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[13px] font-bold text-slate-700">totalVaR</span>
                <span className="text-[13px] text-slate-400">— มูลค่าความเสี่ยงรวม (Value at Risk)</span>
              </div>
              <span className="text-[20px] font-black text-slate-800">฿345,835,000 <span className="text-[12px] font-medium text-slate-500">(฿345.8M)</span></span>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[13px] text-emerald-800 font-medium">
                <strong>API Endpoint:</strong> <span className="font-mono text-[13px]">GET /default/pea-brain-orchestrator</span> • <strong>Source:</strong> AWS Lambda → S3 (pea-hackathon-data1) • <strong>Status:</strong> <span className="text-emerald-600 font-bold">✓ Connected</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Arrow Connector: Bucket 1 → Bucket 2 */}
      <div className="flex flex-col items-center py-4 text-slate-400">
        <div className="text-[13px] font-bold uppercase tracking-widest text-indigo-500 mb-1">PEA Brain AI Processing</div>
        <div className="w-px h-6 bg-gradient-to-b from-slate-300 to-indigo-400" />
        <ArrowRight size={20} className="text-indigo-500 rotate-90 animate-pulse" />
        <div className="w-px h-6 bg-gradient-to-b from-indigo-400 to-fuchsia-400" />
      </div>

      {/* ===== ENGINEERED DATA BUCKET (What PEA Brain Creates) ===== */}
      <section className="relative">
        <div className="rounded-[32px] border-2 border-dashed border-fuchsia-300 bg-gradient-to-b from-fuchsia-50/50 to-white p-1.5">
          
          {/* Bucket Handle / Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-fuchsia-900 rounded-t-[26px] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                <Sparkles size={18} className="text-fuchsia-400" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-white tracking-tight">🧠 PEA Brain Engineered Bucket — ข้อมูลที่ AI สร้างขึ้น</h2>
                <p className="text-[13px] text-fuchsia-200/80 font-medium mt-0.5">Feature Engineering + AI Analytics • ข้อมูลที่คำนวณเพิ่มเพื่อแก้ปัญหาจัดซื้อ</p>
              </div>
            </div>
            <span className="text-[12px] font-bold bg-fuchsia-500/20 text-fuchsia-300 px-2.5 py-1 rounded-full">AI COMPUTED</span>
          </div>

          {/* Bucket Body */}
          <div className="bg-white rounded-b-[26px] p-6">

            {/* Problem → Solution Mapping */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500" />
                Gap Analysis — ช่องว่างจากข้อมูลดิบ → สิ่งที่ PEA Brain เติมเต็ม
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-[13px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">ปัญหาจากข้อมูลดิบ</th>
                        <th className="px-4 py-2.5">ฟิลด์ที่ขาด</th>
                        <th className="px-4 py-2.5">สิ่งที่ PEA Brain สร้าง</th>
                        <th className="px-4 py-2.5">วิธีคำนวณ</th>
                      </tr>
                    </thead>
                    <tbody className="text-[12px] font-medium text-slate-700 divide-y divide-slate-100">
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่รู้ว่าต้องซื้อกี่ชิ้น/ปี</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">avgMonthlyDemand, annualDemand</td>
                        <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-2 py-0.5 rounded-full">Demand Forecasting</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">คำนวณจาก sparkline[] ย้อนหลัง + Seasonal Factor</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่รู้ว่าควรสั่งซื้อเมื่อไหร่</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">reorderPoint (ROP)</td>
                        <td className="px-4 py-3"><span className="bg-purple-100 text-purple-700 text-[13px] font-bold px-2 py-0.5 rounded-full">Dynamic ROP</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">ROP = (dailyDemand × leadTime) + safetyStock × riskFactor</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่รู้ว่าควรสั่งซื้อกี่ชิ้น</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">eoq</td>
                        <td className="px-4 py-3"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-2 py-0.5 rounded-full">EOQ Optimization</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">EOQ = √(2 × annualDemand × orderCost / holdingCost)</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">รู้แค่ severity แต่ไม่รู้วิธีแก้</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">recommendation, confidence</td>
                        <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 text-[13px] font-bold px-2 py-0.5 rounded-full">AI Risk Mitigation</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">Bedrock AI วิเคราะห์สถานการณ์ + แนะนำ Plan A/B</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่รู้ระยะเวลารอคอย (Lead Time)</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">leadTimeWeeks</td>
                        <td className="px-4 py-3"><span className="bg-cyan-100 text-cyan-700 text-[13px] font-bold px-2 py-0.5 rounded-full">Lead Time Estimation</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">ประมาณจากประวัติ PO + ระยะเวลาส่งมอบเฉลี่ยของ Supplier</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่มีข้อมูล PO ค้างส่ง</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">outstandingPOs</td>
                        <td className="px-4 py-3"><span className="bg-rose-100 text-rose-700 text-[13px] font-bold px-2 py-0.5 rounded-full">PO Tracking</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">ติดตาม PO ที่ยังไม่ส่งมอบ → ใช้คำนวณ Available Supply</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่รู้กำลังการผลิตของ Supplier</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">registeredCapacity</td>
                        <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-[13px] font-bold px-2 py-0.5 rounded-full">Capacity Analytics</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">กำลังการผลิตจดทะเบียนของแต่ละ Supplier → จับคู่กับ Demand</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่มีอัตราค้างจ่าย / ความน่าเชื่อถือ</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">reliabilityScore, trustScore</td>
                        <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-[13px] font-bold px-2 py-0.5 rounded-full">Supplier Trust Score</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">คำนวณจาก On-Time %, Capacity Utilization, อัตราค้างจ่าย</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่มีแนวโน้มราคาตลาด</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">priceTrend[], bestTimeToBuy</td>
                        <td className="px-4 py-3"><span className="bg-teal-100 text-teal-700 text-[13px] font-bold px-2 py-0.5 rounded-full">Price Forecasting</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">AI วิเคราะห์ราคาย้อนหลัง → พยากรณ์ช่วงเวลาที่ซื้อได้ราคาดี</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[13px]">ไม่รู้ว่าควรซอยสัญญาไหม</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-slate-400">lotStrategy, lotSchedule</td>
                        <td className="px-4 py-3"><span className="bg-fuchsia-100 text-fuchsia-700 text-[13px] font-bold px-2 py-0.5 rounded-full">AI Lot Strategy</span></td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">AI วิเคราะห์ปริมาณ + ตลาด → แนะนำซอย/ไม่ซอย Lot</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-fuchsia-50 rounded-xl border border-indigo-100 p-4">
              <p className="text-[12px] text-indigo-900 font-bold mb-2">📊 สรุป: จากข้อมูลดิบ 7 fields → PEA Brain สร้างเพิ่ม 18+ fields (10 ช่องว่างที่ต้องเติม)</p>
              <p className="text-[13px] text-indigo-700 font-medium">
                Sandbox ให้แค่ <strong>&quot;สถานะปัจจุบัน&quot;</strong> (Stock เหลือเท่าไหร่, มีความเสี่ยงอะไร) แต่ PEA Brain เติม <strong>&quot;การตัดสินใจ&quot;</strong> (ควรสั่งเมื่อไหร่, สั่งกี่ชิ้น, ซอยสัญญาไหม, ใช้ Supplier ไหน) — นี่คือ Value ที่ทีมเราสร้างให้ PEA ครับ 🚀
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Arrow Connector: Bucket 2 → Bucket 3 */}
      <div className="flex flex-col items-center py-4 text-slate-400">
        <div className="text-[13px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Merge &amp; Serve to Frontend</div>
        <div className="w-px h-6 bg-gradient-to-b from-fuchsia-300 to-emerald-400" />
        <ArrowRight size={20} className="text-emerald-500 rotate-90 animate-pulse" />
        <div className="w-px h-6 bg-gradient-to-b from-emerald-400 to-emerald-600" />
      </div>

      {/* ===== LIVE DATA BUCKET (Current App State) ===== */}
      <section className="relative">
        <div className="rounded-[32px] border-2 border-dashed border-emerald-300 bg-gradient-to-b from-emerald-50/50 to-white p-1.5">
          
          {/* Bucket Handle / Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 rounded-t-[26px] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Server size={18} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-white tracking-tight">🚀 PEA Brain Live Bucket — ข้อมูลปัจจุบันที่ App ใช้งาน</h2>
                <p className="text-[13px] text-emerald-200/80 font-medium mt-0.5">Raw + Engineered = Merged Data • ข้อมูลทั้งหมดที่ Dashboard, Risk, e-Bidding ใช้แสดงผล</p>
              </div>
            </div>
            <span className="text-[12px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full animate-pulse">● LIVE</span>
          </div>

          {/* Bucket Body */}
          <div className="bg-white rounded-b-[26px] p-6">

            {/* Full Data Catalog */}
            <div className="mb-6">
              <h3 className="text-[13px] font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                AI Data Requirements — ข้อมูลทั้งหมดที่ระบบ AI ต้องใช้
              </h3>

              {/* Legend */}
              <div className="flex gap-4 mb-4 text-[13px] font-bold">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> จาก API (มีข้อมูลจริง)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300" /> AI คำนวณ</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> จำลอง (Simulated)</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-emerald-50 text-[12px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 w-8">#</th>
                        <th className="px-3 py-2">หมวด</th>
                        <th className="px-3 py-2">Field Name</th>
                        <th className="px-3 py-2">คำอธิบาย</th>
                        <th className="px-3 py-2 text-center">แหล่งที่มา</th>
                        <th className="px-3 py-2">ตัวอย่างค่า (10067)</th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px] font-medium text-slate-700 divide-y divide-slate-100">
                      {/* === MATERIALS (from API) === */}
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">1</td>
                        <td className="px-3 py-2" rowSpan={7}><span className="text-[13px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">📦 Materials</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">id</td>
                        <td className="px-3 py-2">รหัสพัสดุ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">10067</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">2</td>
                        <td className="px-3 py-2 font-mono text-[13px]">name</td>
                        <td className="px-3 py-2">ชื่อพัสดุ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">160 kVA Transformer 3Ph</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">3</td>
                        <td className="px-3 py-2 font-mono text-[13px]">currentStock</td>
                        <td className="px-3 py-2">สต๊อกปัจจุบัน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-red-600 font-bold">12</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">4</td>
                        <td className="px-3 py-2 font-mono text-[13px]">safetyStock</td>
                        <td className="px-3 py-2">สต๊อกขั้นต่ำ (Safety Stock)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">250</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">5</td>
                        <td className="px-3 py-2 font-mono text-[13px]">sparkline[]</td>
                        <td className="px-3 py-2">แนวโน้มสต๊อก 6 เดือนย้อนหลัง</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">[400,380,250,150,80,12]</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">6</td>
                        <td className="px-3 py-2 font-mono text-[13px]">budgetPrice</td>
                        <td className="px-3 py-2">ราคากลาง (งบประมาณ)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">฿150,000</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">7</td>
                        <td className="px-3 py-2 font-mono text-[13px]">unitPrice</td>
                        <td className="px-3 py-2">ราคาตลาดปัจจุบัน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">฿192,800</td>
                      </tr>

                      {/* === AI COMPUTED FIELDS === */}
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">8</td>
                        <td className="px-3 py-2" rowSpan={5}><span className="text-[13px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">🧠 AI Supply Chain</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">avgMonthlyDemand</td>
                        <td className="px-3 py-2">ปริมาณใช้เฉลี่ย/เดือน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-indigo-600">80 (จาก sparkline)</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">9</td>
                        <td className="px-3 py-2 font-mono text-[13px]">annualDemand</td>
                        <td className="px-3 py-2">ปริมาณใช้ต่อปี</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-indigo-600">960 (80 × 12)</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">10</td>
                        <td className="px-3 py-2 font-mono text-[13px]">leadTimeWeeks</td>
                        <td className="px-3 py-2">ระยะเวลารอคอย (สัปดาห์)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-indigo-600">12 สัปดาห์ (≈90 วัน)</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">11</td>
                        <td className="px-3 py-2 font-mono text-[13px]">reorderPoint (ROP)</td>
                        <td className="px-3 py-2">จุดสั่งซื้อใหม่</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-indigo-600">480 เครื่อง</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">12</td>
                        <td className="px-3 py-2 font-mono text-[13px]">eoq</td>
                        <td className="px-3 py-2">ปริมาณสั่งซื้อที่คุ้มทุน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-indigo-600">800 เครื่อง</td>
                      </tr>

                      {/* === RISK ALERTS (from API + AI) === */}
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">13</td>
                        <td className="px-3 py-2" rowSpan={4}><span className="text-[13px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">⚠️ Risk Alerts</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">severity, materialId, message</td>
                        <td className="px-3 py-2">ระดับความรุนแรง + ข้อความ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">critical, alt-1</td>
                      </tr>
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">14</td>
                        <td className="px-3 py-2 font-mono text-[13px]">costImpact</td>
                        <td className="px-3 py-2">ผลกระทบทางการเงิน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">฿231.36M</td>
                      </tr>
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">15</td>
                        <td className="px-3 py-2 font-mono text-[13px]">recommendation</td>
                        <td className="px-3 py-2">AI แนะนำวิธีแก้ไข</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-indigo-600">เร่งจัดซื้อ + Plan B</td>
                      </tr>
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">16</td>
                        <td className="px-3 py-2 font-mono text-[13px]">confidence, bufferDays</td>
                        <td className="px-3 py-2">ความมั่นใจ + สต๊อกยื้อได้กี่วัน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] text-indigo-600">95%, 4 วัน</td>
                      </tr>

                      {/* === SUPPLIER (Simulated) === */}
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">17</td>
                        <td className="px-3 py-2" rowSpan={4}><span className="text-[13px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">🏭 Suppliers</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">vendors[].name</td>
                        <td className="px-3 py-2">รายชื่อผู้ค้า 5 ราย</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[13px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">ไทยทรานสฟอร์มเมอร์ ฯลฯ</td>
                      </tr>
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">18</td>
                        <td className="px-3 py-2 font-mono text-[13px]">registeredCapacity</td>
                        <td className="px-3 py-2">กำลังการผลิตจดทะเบียน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[13px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">400 เครื่อง/ปี</td>
                      </tr>
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">19</td>
                        <td className="px-3 py-2 font-mono text-[13px]">outstandingPOs</td>
                        <td className="px-3 py-2">PO ค้างส่ง (ยังไม่ส่งมอบ)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[13px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">150 เครื่อง</td>
                      </tr>
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">20</td>
                        <td className="px-3 py-2 font-mono text-[13px]">reliabilityScore</td>
                        <td className="px-3 py-2">อัตราค้างจ่าย / ความน่าเชื่อถือ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[13px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">0.95 (95%)</td>
                      </tr>

                      {/* === eBIDDING (AI Computed) === */}
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">21</td>
                        <td className="px-3 py-2" rowSpan={4}><span className="text-[13px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">📋 e-Bidding</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">totalRequirement</td>
                        <td className="px-3 py-2">ปริมาณที่ต้องจัดซื้อทั้งหมด</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">800 เครื่อง</td>
                      </tr>
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">22</td>
                        <td className="px-3 py-2 font-mono text-[13px]">simulation.steps[]</td>
                        <td className="px-3 py-2">สถานการณ์จำลอง (3 ขั้นตอน)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">Forecast → Crisis → Recovery</td>
                      </tr>
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">23</td>
                        <td className="px-3 py-2 font-mono text-[13px]">priceTrend[]</td>
                        <td className="px-3 py-2">แนวโน้มราคาย้อนหลัง 7 เดือน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">฿145K→฿155K→฿147K</td>
                      </tr>
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">24</td>
                        <td className="px-3 py-2 font-mono text-[13px]">dynamicROP, bufferDays</td>
                        <td className="px-3 py-2">จุดสั่งซื้อ + วันสำรอง</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[13px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">480 เครื่อง, 4 วัน</td>
                      </tr>

                      {/* === GLOBAL (from API) === */}
                      <tr className="bg-slate-50">
                        <td className="px-3 py-2 text-slate-400">25</td>
                        <td className="px-3 py-2"><span className="text-[13px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">📊 Global</span></td>
                        <td className="px-3 py-2 font-mono text-[13px]">totalVaR</td>
                        <td className="px-3 py-2">มูลค่าความเสี่ยงรวม</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[13px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[13px] font-bold">฿345.8M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 text-center">
                <div className="text-[24px] font-black text-emerald-700">10</div>
                <div className="text-[13px] font-bold text-emerald-600 uppercase">จาก API (มีจริง)</div>
              </div>
              <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 text-center">
                <div className="text-[24px] font-black text-indigo-700">11</div>
                <div className="text-[13px] font-bold text-indigo-600 uppercase">AI คำนวณเพิ่ม</div>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 text-center">
                <div className="text-[24px] font-black text-amber-700">4</div>
                <div className="text-[13px] font-bold text-amber-600 uppercase">จำลอง (Supplier)</div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-4">
              <p className="text-[12px] text-emerald-900 font-bold mb-2">✅ Data Pipeline Summary: 25 fields ใน 5 หมวด → ขับเคลื่อน 4 หน้าจอ</p>
              <p className="text-[13px] text-emerald-700 font-medium">
                📦 Materials (7 API) + 🧠 AI Supply Chain (5 AI) + ⚠️ Risk (4 API+AI) + 🏭 Suppliers (4 SIM) + 📋 e-Bidding (4 AI) + 📊 Global (1 API) → <strong>Dashboard, Risk Management, e-Bidding, AI Copilot</strong>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== PROMPT ENGINEERING & GUARDRAILS ===== */}
      <section className="relative mt-8 mb-8">
        <div className="rounded-[32px] border-2 border-dashed border-amber-300 bg-gradient-to-b from-amber-50/50 to-white p-1.5">
          <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 rounded-t-[26px] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <BrainCircuit size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-white tracking-tight">🛡️ Prompt Engineering & Guardrails</h2>
                <p className="text-[13px] text-amber-100 font-medium mt-0.5">กฎและข้อบังคับที่ใช้ควบคุม AI (อัปเดตล่าสุด)</p>
              </div>
            </div>
            <span className="text-[12px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">AI RULES</span>
          </div>
          
          <div className="bg-white rounded-b-[26px] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Rule 1: JSON Schema */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Code2 size={12} /></div>
                  <h3 className="text-[13px] font-bold text-slate-800">บังคับโครงสร้างข้อมูล (JSON Schema)</h3>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-3">ควบคุมให้ AI วิเคราะห์แนวโน้มราคา พร้อมระบุ <span className="font-bold text-blue-600">เหตุผลประกอบ</span> และ <span className="font-bold text-blue-600">แหล่งอ้างอิง</span> เสมอ</p>
                <div className="bg-slate-800 rounded-xl p-3 overflow-x-auto">
                  <pre className="text-[13px] text-emerald-400 font-mono leading-relaxed">
{`"priceForecast": {
  "threeMonth": "...เนื่องจาก [ดัชนี LME...] (อ้างอิง: [...])",
  "oneYear": "...เพราะ [ปัจจัยระดับมหภาค...] (อ้างอิง: [...])",
  "bestTimeToBuy": "ช่วงเดือน X-Y เพราะ [เหตุผลซัพพลายเออร์]"
}`}
                  </pre>
                </div>
              </div>

              {/* Rule 2: Strict Prompting */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle size={12} /></div>
                  <h3 className="text-[13px] font-bold text-slate-800">กฎข้อบังคับเด็ดขาด (Strict Guidelines)</h3>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-3">ป้องกันปัญหา AI ตอบกำกวม หรือถามคำถามผู้ใช้กลับ (Hallucination Prevention)</p>
                <ul className="space-y-2 text-[13px] font-medium text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">■</span>
                    ห้ามถามคำถามกลับ ห้ามเขียน "...ไหม?" ต้องตอบเป็นข้อสรุปเท่านั้น
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">■</span>
                    ทุกคำตอบต้องเป็น "ข้อสรุป" ที่มีเหตุผลว่า "เพราะอะไร"
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">■</span>
                    ห้ามแนะนำเดือนที่ผ่านไปแล้ว (ระบบจะป้อน Current Date ให้)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">■</span>
                    ทุก field ต้องมีคำตอบจริง ห้ามเว้นว่าง ห้ามตอบ "-"
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===== AI FINE-TUNING & BACKTESTING STRATEGY ===== */}
      <section className="relative mt-8 mb-8">
        <div className="rounded-[32px] border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50/50 to-white p-1.5">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-t-[26px] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-white tracking-tight">🚀 AI Fine-tuning & Backtesting Strategy</h2>
                <p className="text-[13px] text-indigo-100 font-medium mt-0.5">แผนงานเสริมความฉลาดให้ AI และการทดสอบความแม่นยำ (Phase 4)</p>
              </div>
            </div>
            <span className="text-[12px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">UPCOMING</span>
          </div>
          
          <div className="bg-white rounded-b-[26px] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Fine-tuning Plan */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-fuchsia-100 flex items-center justify-center text-fuchsia-600"><BrainCircuit size={12} /></div>
                  <h3 className="text-[13px] font-bold text-slate-800">แผนการเทรน AI (Fine-tuning Plan)</h3>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-4">ปรับแต่ง Amazon Bedrock Models ให้เข้าใจบริบทการทำงานของ กฟภ. (PEA Context) อย่างลึกซึ้ง</p>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <div className="text-[13px] font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Database size={13} className="text-slate-400"/> 1. PEA Historical Data (ข้อมูลในอดีต)</div>
                    <p className="text-[13px] text-slate-500">นำข้อมูลใบสั่งซื้อ (PO), ราคากลาง, และบันทึกปัญหาจาก SAP ย้อนหลัง 5 ปี มาสร้าง Dataset สำหรับเทรน AI</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <div className="text-[13px] font-bold text-slate-700 mb-1 flex items-center gap-1.5"><AlertTriangle size={13} className="text-slate-400"/> 2. Risk Scenarios (กรณีศึกษาความเสี่ยง)</div>
                    <p className="text-[13px] text-slate-500">ป้อนเคสวิกฤตที่เคยเกิด (เช่น น้ำท่วมใหญ่ 2554, วิกฤตโควิด) เพื่อสอน AI ถึงวิธีแก้ปัญหาจริงที่ กฟภ. เคยใช้</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <div className="text-[13px] font-bold text-slate-700 mb-1 flex items-center gap-1.5"><ClipboardList size={13} className="text-slate-400"/> 3. RAG Knowledge Base (อ้างอิงระเบียบ)</div>
                    <p className="text-[13px] text-slate-500">เชื่อมต่อพ.ร.บ. จัดซื้อจัดจ้างฯ 2560 เข้าเป็นคลังข้อมูล เพื่อให้ AI แนะนำแผนที่ <span className="text-red-500 font-bold">"ไม่ผิดกฎหมาย"</span> 100%</p>
                  </div>
                </div>
              </div>

              {/* Backtesting Plan */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><Activity size={12} /></div>
                  <h3 className="text-[13px] font-bold text-slate-800">แผนจำลองการทดสอบ (Backtesting Strategy)</h3>
                </div>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-4">ทดสอบว่าถ้าใช้ PEA Brain ตั้งแต่ 3 ปีก่อน จะช่วยประหยัดเงินและลดความเสี่ยงได้จริงหรือไม่?</p>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-emerald-50 rounded-full blur-xl" />
                    <div className="text-[13px] font-bold text-emerald-700 mb-1 flex items-center gap-1.5"><Calculator size={13}/> 1. Cost Optimization Test</div>
                    <p className="text-[13px] text-slate-500">เปรียบเทียบ "ราคาจริงที่จัดซื้อไป" vs "ราคาที่ AI แนะนำให้ซื้อ (ตามช่วงเวลา LME)" วัดผลกำไร/ขาดทุน</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-amber-50 rounded-full blur-xl" />
                    <div className="text-[13px] font-bold text-amber-700 mb-1 flex items-center gap-1.5"><ShieldAlert size={13}/> 2. Crisis Prevention Test</div>
                    <p className="text-[13px] text-slate-500">ย้อนกลับไปตอนที่มี "วิกฤตของขาด" ตรวจสอบว่าระบบ Dynamic ROP ของ AI จะส่งแจ้งเตือนทันเวลาหรือไม่</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-blue-50 rounded-full blur-xl" />
                    <div className="text-[13px] font-bold text-blue-700 mb-1 flex items-center gap-1.5"><User size={13}/> 3. Human vs AI Simulation</div>
                    <p className="text-[13px] text-slate-500">นำข้อมูลจัดซื้อย้อนหลังมา 10 โครงการ ให้ผู้เชี่ยวชาญ (PEA Staff) และ AI จัดทำแผนเทียบกัน</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto">
        {/* Sprint Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">Sprint Updates & Timeline</h2>
              <p className="text-[13px] text-slate-500 font-medium">ความคืบหน้าของโครงการและแผนงานในอนาคต</p>
            </div>
          </div>

          <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-8 pb-4">
            {sprints.map((sprint) => {
              const isCompleted = sprint.status === "completed";
              const isInProgress = sprint.status === "in-progress";
              const isPending = sprint.status === "pending";

              return (
                <div key={sprint.id} className="relative">
                  {/* Status Indicator */}
                  <div className={`absolute -left-[35px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center
                    ${isCompleted ? "bg-emerald-500" : isInProgress ? "bg-blue-500 animate-pulse" : "bg-slate-300"}
                  `}>
                    {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                    {isInProgress && <Code2 size={10} className="text-white" />}
                    {isPending && <Circle size={8} className="text-white fill-white" />}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className={`text-[14px] font-extrabold ${isCompleted ? "text-slate-900" : isInProgress ? "text-blue-700" : "text-slate-400"}`}>
                        {sprint.name}
                      </h3>
                      <span className="text-[13px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                        {sprint.date}
                      </span>
                    </div>
                    
                    <div className={`mt-3 space-y-2 ${isPending ? "opacity-60" : ""}`}>
                      {sprint.tasks.map((taskStr, i) => {
                        const isTaskSpecificCompleted = taskStr.startsWith("[x] ");
                        const taskText = taskStr.replace("[x] ", "");
                        const finalIsCompleted = isCompleted || isTaskSpecificCompleted;

                        return (
                          <div key={i} className="flex items-start gap-2">
                            {finalIsCompleted ? (
                               <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-500" />
                            ) : isInProgress ? (
                               <Circle size={14} className="shrink-0 mt-0.5 text-blue-400" />
                            ) : (
                               <Circle size={14} className="shrink-0 mt-0.5 text-slate-300" />
                            )}
                            <span className={`text-[12px] font-medium leading-relaxed ${finalIsCompleted ? "text-slate-700" : isInProgress ? "text-slate-800" : "text-slate-500"}`}>
                              {taskText}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {isInProgress && (
                      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 inline-block">
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-blue-700 uppercase tracking-widest">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                          </span>
                          Current Focus
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
