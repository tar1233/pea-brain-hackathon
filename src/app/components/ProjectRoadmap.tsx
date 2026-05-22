"use client";

import { CheckCircle2, Circle, Clock, Code2, Database, LayoutTemplate, Map, Network, Server, Sparkles, Box, User, ArrowRight } from "lucide-react";

export default function ProjectRoadmap() {
  const sprints = [
    {
      id: "sprint-1",
      name: "Sprint 1: Core Architecture & Framework",
      status: "completed",
      date: "Week 1",
      tasks: [
        "Initialize Next.js 14 with App Router & Turbopack",
        "Setup TailwindCSS and premium UI system",
        "Build Dashboard layout & Core Navigation",
        "Implement Supply Chain Math models (EOQ, ROP)"
      ]
    },
    {
      id: "sprint-2",
      name: "Sprint 2: AI Integration & Risk Intelligence",
      status: "completed",
      date: "Week 2",
      tasks: [
        "Integrate AWS API Gateway & AWS Bedrock",
        "Build PEA Brain Copilot UI (ChatPanel)",
        "Implement AI-driven Risk Detection engine",
        "Develop Inventory Analysis & Forecasting views"
      ]
    },
    {
      id: "sprint-3",
      name: "Sprint 3: Automation & Procurement Flow",
      status: "in-progress",
      date: "Week 3",
      tasks: [
        "Automate e-Bidding strategy generation",
        "Create Procurement Planning tracking view",
        "Add PDF Export and LINE notification demos",
        "Finalize UI Polish and Micro-animations"
      ]
    },
    {
      id: "sprint-4",
      name: "Sprint 4: AI Model Tuning & Backtesting",
      status: "pending",
      date: "Post-Hackathon",
      tasks: [
        "ทดสอบความแม่นยำโมเดลย้อนหลัง (Backtesting) ด้วยข้อมูลจริง 3-5 ปี",
        "เทรนและปรับจูน AI เพื่อลด Error ในการพยากรณ์ Demand ขั้นสูงสุด",
        "สร้าง Data Pipeline สำหรับตรวจสอบและทำความสะอาดข้อมูลแบบอัตโนมัติ",
        "ทดสอบนำร่อง (Pilot Test) ในคลังจริงเพื่อประเมินประสิทธิภาพโมเดล"
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
