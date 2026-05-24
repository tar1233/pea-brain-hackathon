"use client";

import { CheckCircle2, Circle, Clock, Code2, Database, LayoutTemplate, Map, Network, Server, Sparkles, Box, User, ArrowRight } from "lucide-react";

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
      status: "in-progress",
      date: "19 - 30 May (Current)",
      tasks: [
        "พัฒนาระบบ Dashboard และ UI หลักทั้งหมด",
        "เชื่อมต่อ AWS Bedrock และสร้าง PEA Brain Copilot",
        "พัฒนาระบบวิเคราะห์ความเสี่ยงและพยากรณ์ Demand",
        "ทดสอบความแม่นยำของ Data Model (Backtesting)"
      ]
    },
    {
      id: "sprint-3",
      name: "Phase 3: PoC Development (Part 2)",
      status: "pending",
      date: "31 May - 11 Jun",
      tasks: [
        "สร้างฟีเจอร์ Procurement Automation (e-Bidding)",
        "พัฒนาระบบ Export รายงานและสรุปผลสำหรับผู้บริหาร",
        "ปรับจูน AI เพื่อลด Error (Fine-tuning & Optimization)",
        "เตรียมระบบสำหรับ Demo เสมือนจริง"
      ]
    },
    {
      id: "sprint-4",
      name: "Phase 4: Final Pitching",
      status: "pending",
      date: "15 - 17 Jun",
      tasks: [
        "เตรียมความพร้อมสำหรับ Demo Day",
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia-200 shadow-inner">
            <Map size={14} className="text-fuchsia-300" />
            Project Roadmap
          </div>
          <h1 className="mt-4 text-[24px] font-black tracking-tight text-white drop-shadow-md">แผนงานและโครงสร้างระบบ (Architecture & Timeline)</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-300/90 font-medium">
            สรุปโครงสร้างเทคโนโลยีที่ใช้พัฒนา (Tech Stack) และแผนการดำเนินงาน (Sprint Updates) ของ PEA Brain
          </p>
        </div>
      </section>

      {/* Sandbox Data & Transformation */}
      {/* Sandbox Raw Data (Full) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-slate-900">ข้อมูลดิบจาก Sandbox (Raw API Response)</h2>
            <p className="text-[11px] text-slate-500 font-medium">ข้อมูลทั้งหมดที่ได้รับจาก AWS Lambda Orchestrator ผ่าน API Gateway</p>
          </div>
          <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">LIVE from API</span>
        </div>

        {/* Materials Table */}
        <div className="mb-6">
          <h3 className="text-[13px] font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            materials[] — พัสดุ ({`3 รายการ`})
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
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
                    <td className="px-4 py-3 text-center text-[10px] text-slate-400 font-mono">[400,380,250,150,80,12]</td>
                    <td className="px-4 py-3 text-right">฿150,000</td>
                    <td className="px-4 py-3 text-right">฿192,800</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-indigo-600 font-bold">10066</td>
                    <td className="px-4 py-3">100 kVA Transformer 3Ph</td>
                    <td className="px-4 py-3 text-right text-red-600 font-bold">5</td>
                    <td className="px-4 py-3 text-right">100</td>
                    <td className="px-4 py-3 text-center text-[10px] text-slate-400 font-mono">[120,100,80,60,40,5]</td>
                    <td className="px-4 py-3 text-right">฿85,000</td>
                    <td className="px-4 py-3 text-right">฿120,500</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-indigo-600 font-bold">20045</td>
                    <td className="px-4 py-3">Drop Out Fuse Cutout 24kV</td>
                    <td className="px-4 py-3 text-right">120</td>
                    <td className="px-4 py-3 text-right">5,000</td>
                    <td className="px-4 py-3 text-center text-[10px] text-slate-400 font-mono">[6000,5200,4100,3000,2100,120]</td>
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
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
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
                    <td className="px-4 py-3"><span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">critical</span></td>
                    <td className="px-4 py-3 font-mono text-indigo-600 font-bold">10067</td>
                    <td className="px-4 py-3 text-[11px] max-w-[300px]">พายุโซนร้อนเข้าภาคเหนือ หม้อแปลง 160kVA ขาดแคลนวิกฤต (12/250)</td>
                    <td className="px-4 py-3 text-right text-red-600 font-bold">฿231.36M</td>
                  </tr>
                  <tr className="hover:bg-red-50/30">
                    <td className="px-4 py-3 font-mono text-slate-400">alt-2</td>
                    <td className="px-4 py-3"><span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">critical</span></td>
                    <td className="px-4 py-3 font-mono text-indigo-600 font-bold">10066</td>
                    <td className="px-4 py-3 text-[11px] max-w-[300px]">สต๊อกหม้อแปลง 100kVA ต่ำกว่าเกณฑ์ (5/100) ไม่เพียงพอรับมือภัยพิบัติ</td>
                    <td className="px-4 py-3 text-right text-red-600 font-bold">฿114.47M</td>
                  </tr>
                  <tr className="hover:bg-amber-50/30">
                    <td className="px-4 py-3 font-mono text-slate-400">alt-3</td>
                    <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">warning</span></td>
                    <td className="px-4 py-3 font-mono text-indigo-600 font-bold">20045</td>
                    <td className="px-4 py-3 text-[11px] max-w-[300px]">Drop Out Fuse ขาดสต๊อก แต่ซัพพลายเออร์ส่งของล่าช้า 2 สัปดาห์</td>
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
            <span className="text-[11px] text-slate-400">— มูลค่าความเสี่ยงรวม (Value at Risk)</span>
          </div>
          <span className="text-[20px] font-black text-slate-800">฿345,835,000 <span className="text-[12px] font-medium text-slate-500">(฿345.8M)</span></span>
        </div>

        <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-[11px] text-emerald-800 font-medium">
            <strong>API Endpoint:</strong> <span className="font-mono text-[10px]">GET /default/pea-brain-orchestrator</span> • <strong>Source:</strong> AWS Lambda → S3 (pea-hackathon-data1) • <strong>Status:</strong> <span className="text-emerald-600 font-bold">✓ Connected</span>
          </p>
        </div>
      </section>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left Column: Tech Stack & Architecture */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Network size={20} />
              </div>
              <div>
                <h2 className="text-[16px] font-extrabold text-slate-900">System Architecture</h2>
                <p className="text-[11px] text-slate-500 font-medium">โครงสร้างระบบและเทคโนโลยีหลักที่ใช้งาน</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frontend */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-3">
                  <LayoutTemplate size={16} />
                  <span className="text-[12px] font-bold uppercase tracking-widest">Frontend</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[12px] text-slate-700 font-medium">
                    <Box size={12} className="text-indigo-400" /> Next.js 14 (App Router)
                  </li>
                  <li className="flex items-center gap-2 text-[12px] text-slate-700 font-medium">
                    <Box size={12} className="text-indigo-400" /> TailwindCSS & Lucide Icons
                  </li>
                  <li className="flex items-center gap-2 text-[12px] text-slate-700 font-medium">
                    <Box size={12} className="text-indigo-400" /> Recharts (Data Visualization)
                  </li>
                </ul>
              </div>

              {/* AI & Backend */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-fuchsia-600 mb-3">
                  <Sparkles size={16} />
                  <span className="text-[12px] font-bold uppercase tracking-widest">AI & Backend</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[12px] text-slate-700 font-medium">
                    <Box size={12} className="text-fuchsia-400" /> AWS Bedrock (Claude 3 / Llama)
                  </li>
                  <li className="flex items-center gap-2 text-[12px] text-slate-700 font-medium">
                    <Box size={12} className="text-fuchsia-400" /> AWS API Gateway
                  </li>
                  <li className="flex items-center gap-2 text-[12px] text-slate-700 font-medium">
                    <Box size={12} className="text-fuchsia-400" /> Prisma ORM & Database
                  </li>
                </ul>
              </div>
            </div>

            {/* Data Flow Diagram (Simple) */}
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-5 text-white flex flex-col items-center justify-center gap-3 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start">Data Flow</span>
              <div className="flex items-center justify-center gap-2 w-full text-[11px] font-medium text-slate-200">
                <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                  <User size={14} className="text-sky-300" /> User
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-white/10 to-white/30 relative">
                  <ArrowRight size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50" />
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                  <Server size={14} className="text-fuchsia-300" /> API Gateway
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-white/10 to-white/30 relative">
                  <ArrowRight size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50" />
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                  <Database size={14} className="text-emerald-300" /> Bedrock AI / DB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sprint Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">Sprint Updates & Timeline</h2>
              <p className="text-[11px] text-slate-500 font-medium">ความคืบหน้าของโครงการและแผนงานในอนาคต</p>
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                        {sprint.date}
                      </span>
                    </div>
                    
                    <div className={`mt-3 space-y-2 ${isPending ? "opacity-60" : ""}`}>
                      {sprint.tasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${isCompleted ? "text-emerald-500" : isInProgress ? "text-blue-400" : "text-slate-300"}`} />
                          <span className={`text-[12px] font-medium leading-relaxed ${isCompleted ? "text-slate-700" : isInProgress ? "text-slate-800" : "text-slate-500"}`}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>

                    {isInProgress && (
                      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 inline-block">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-widest">
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
