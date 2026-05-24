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

      {/* ===== DATA FLOW DIAGRAM ===== */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Network size={20} />
          </div>
          <div>
            <h2 className="text-[16px] font-extrabold text-slate-900">Data Flow Architecture</h2>
            <p className="text-[11px] text-slate-500 font-medium">ภาพรวมการไหลของข้อมูลจากต้นทางสู่ Dashboard</p>
          </div>
        </div>

        {/* Flow Diagram - Horizontal */}
        <div className="flex items-stretch gap-0 overflow-x-auto pb-4">

          {/* Step 1: Data Source */}
          <div className="flex-shrink-0 w-[160px]">
            <div className="bg-gradient-to-b from-amber-500 to-amber-600 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-amber-200">
              <Database size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">S3 Bucket</div>
              <div className="text-[9px] text-amber-100 text-center mt-1 font-medium">pea-hackathon-data1</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">materials.json</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">riskAlerts.json</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">totalVaR</div>
              </div>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[7px] font-bold text-slate-400 mb-1 whitespace-nowrap">API Gateway</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-purple-500 relative">
                <ArrowRight size={12} className="text-purple-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[7px] font-bold text-slate-400 mt-1 whitespace-nowrap">REST API</div>
            </div>
          </div>

          {/* Step 2: Lambda */}
          <div className="flex-shrink-0 w-[160px]">
            <div className="bg-gradient-to-b from-purple-600 to-purple-700 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-purple-200">
              <Server size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">AWS Lambda</div>
              <div className="text-[9px] text-purple-200 text-center mt-1 font-medium">Orchestrator</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Data Fetch</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Risk Calc</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">VaR Engine</div>
              </div>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[7px] font-bold text-slate-400 mb-1 whitespace-nowrap">JSON Response</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
                <ArrowRight size={12} className="text-indigo-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[7px] font-bold text-slate-400 mt-1 whitespace-nowrap">7 Raw Fields</div>
            </div>
          </div>

          {/* Step 3: PEA Brain AI */}
          <div className="flex-shrink-0 w-[180px]">
            <div className="bg-gradient-to-b from-indigo-600 to-blue-700 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-md" />
              <Sparkles size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">PEA Brain AI</div>
              <div className="text-[9px] text-indigo-200 text-center mt-1 font-medium">Feature Engineering</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Demand Forecast</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">EOQ / ROP</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Supplier Trust</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Lot Strategy</div>
              </div>
            </div>
          </div>

          {/* Arrow 3 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[7px] font-bold text-slate-400 mb-1 whitespace-nowrap">Merged Data</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 relative">
                <ArrowRight size={12} className="text-fuchsia-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[7px] font-bold text-slate-400 mt-1 whitespace-nowrap">25 Fields</div>
            </div>
          </div>

          {/* Step 4: Bedrock AI */}
          <div className="flex-shrink-0 w-[160px]">
            <div className="bg-gradient-to-b from-fuchsia-600 to-pink-600 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-fuchsia-200">
              <Sparkles size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">AWS Bedrock</div>
              <div className="text-[9px] text-fuchsia-200 text-center mt-1 font-medium">Claude 3 Haiku</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">AI Copilot Chat</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Risk Analysis</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Recommendation</div>
              </div>
            </div>
          </div>

          {/* Arrow 4 */}
          <div className="flex-shrink-0 flex items-center px-2">
            <div className="flex flex-col items-center">
              <div className="text-[7px] font-bold text-slate-400 mb-1 whitespace-nowrap">Insights</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-fuchsia-500 to-emerald-500 relative">
                <ArrowRight size={12} className="text-emerald-500 absolute -right-1.5 -top-[5px]" />
              </div>
              <div className="text-[7px] font-bold text-slate-400 mt-1 whitespace-nowrap">NLP Output</div>
            </div>
          </div>

          {/* Step 5: Dashboard */}
          <div className="flex-shrink-0 w-[160px]">
            <div className="bg-gradient-to-b from-emerald-600 to-teal-600 rounded-2xl p-4 h-full flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-200">
              <LayoutTemplate size={28} className="mb-2" />
              <div className="text-[12px] font-black text-center">Dashboard</div>
              <div className="text-[9px] text-emerald-200 text-center mt-1 font-medium">Next.js Frontend</div>
              <div className="mt-3 space-y-1 w-full">
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Overview</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">Risk Mgmt</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">e-Bidding Sim</div>
                <div className="bg-white/20 rounded px-2 py-0.5 text-[8px] text-center font-bold">AI Copilot</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legend */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
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
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">ข้อมูลดิบทั้งหมดที่ PEA ให้มา • เก็บไว้เป็นข้อมูลอ้างอิง (Reference Data)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md font-mono">s3://pea-hackathon-data1</span>
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">✓ LIVE</span>
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
          </div>
        </div>
      </section>

      {/* Arrow Connector: Bucket 1 → Bucket 2 */}
      <div className="flex flex-col items-center py-4 text-slate-400">
        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">PEA Brain AI Processing</div>
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
                <p className="text-[10px] text-fuchsia-200/80 font-medium mt-0.5">Feature Engineering + AI Analytics • ข้อมูลที่คำนวณเพิ่มเพื่อแก้ปัญหาจัดซื้อ</p>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-fuchsia-500/20 text-fuchsia-300 px-2.5 py-1 rounded-full">AI COMPUTED</span>
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
                    <thead className="bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">ปัญหาจากข้อมูลดิบ</th>
                        <th className="px-4 py-2.5">ฟิลด์ที่ขาด</th>
                        <th className="px-4 py-2.5">สิ่งที่ PEA Brain สร้าง</th>
                        <th className="px-4 py-2.5">วิธีคำนวณ</th>
                      </tr>
                    </thead>
                    <tbody className="text-[12px] font-medium text-slate-700 divide-y divide-slate-100">
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่รู้ว่าต้องซื้อกี่ชิ้น/ปี</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">avgMonthlyDemand, annualDemand</td>
                        <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Demand Forecasting</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">คำนวณจาก sparkline[] ย้อนหลัง + Seasonal Factor</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่รู้ว่าควรสั่งซื้อเมื่อไหร่</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">reorderPoint (ROP)</td>
                        <td className="px-4 py-3"><span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Dynamic ROP</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">ROP = (dailyDemand × leadTime) + safetyStock × riskFactor</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่รู้ว่าควรสั่งซื้อกี่ชิ้น</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">eoq</td>
                        <td className="px-4 py-3"><span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">EOQ Optimization</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">EOQ = √(2 × annualDemand × orderCost / holdingCost)</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">รู้แค่ severity แต่ไม่รู้วิธีแก้</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">recommendation, confidence</td>
                        <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">AI Risk Mitigation</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">Bedrock AI วิเคราะห์สถานการณ์ + แนะนำ Plan A/B</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่รู้ระยะเวลารอคอย (Lead Time)</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">leadTimeWeeks</td>
                        <td className="px-4 py-3"><span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Lead Time Estimation</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">ประมาณจากประวัติ PO + ระยะเวลาส่งมอบเฉลี่ยของ Supplier</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่มีข้อมูล PO ค้างส่ง</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">outstandingPOs</td>
                        <td className="px-4 py-3"><span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">PO Tracking</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">ติดตาม PO ที่ยังไม่ส่งมอบ → ใช้คำนวณ Available Supply</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่รู้กำลังการผลิตของ Supplier</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">registeredCapacity</td>
                        <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Capacity Analytics</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">กำลังการผลิตจดทะเบียนของแต่ละ Supplier → จับคู่กับ Demand</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่มีอัตราค้างจ่าย / ความน่าเชื่อถือ</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">reliabilityScore, trustScore</td>
                        <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Supplier Trust Score</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">คำนวณจาก On-Time %, Capacity Utilization, อัตราค้างจ่าย</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่มีแนวโน้มราคาตลาด</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">priceTrend[], bestTimeToBuy</td>
                        <td className="px-4 py-3"><span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Price Forecasting</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">AI วิเคราะห์ราคาย้อนหลัง → พยากรณ์ช่วงเวลาที่ซื้อได้ราคาดี</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/30">
                        <td className="px-4 py-3 text-red-600 font-bold text-[11px]">ไม่รู้ว่าควรซอยสัญญาไหม</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-400">lotStrategy, lotSchedule</td>
                        <td className="px-4 py-3"><span className="bg-fuchsia-100 text-fuchsia-700 text-[10px] font-bold px-2 py-0.5 rounded-full">AI Lot Strategy</span></td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">AI วิเคราะห์ปริมาณ + ตลาด → แนะนำซอย/ไม่ซอย Lot</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-fuchsia-50 rounded-xl border border-indigo-100 p-4">
              <p className="text-[12px] text-indigo-900 font-bold mb-2">📊 สรุป: จากข้อมูลดิบ 7 fields → PEA Brain สร้างเพิ่ม 18+ fields (10 ช่องว่างที่ต้องเติม)</p>
              <p className="text-[11px] text-indigo-700 font-medium">
                Sandbox ให้แค่ <strong>&quot;สถานะปัจจุบัน&quot;</strong> (Stock เหลือเท่าไหร่, มีความเสี่ยงอะไร) แต่ PEA Brain เติม <strong>&quot;การตัดสินใจ&quot;</strong> (ควรสั่งเมื่อไหร่, สั่งกี่ชิ้น, ซอยสัญญาไหม, ใช้ Supplier ไหน) — นี่คือ Value ที่ทีมเราสร้างให้ PEA ครับ 🚀
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Arrow Connector: Bucket 2 → Bucket 3 */}
      <div className="flex flex-col items-center py-4 text-slate-400">
        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Merge &amp; Serve to Frontend</div>
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
                <p className="text-[10px] text-emerald-200/80 font-medium mt-0.5">Raw + Engineered = Merged Data • ข้อมูลทั้งหมดที่ Dashboard, Risk, e-Bidding ใช้แสดงผล</p>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full animate-pulse">● LIVE</span>
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
              <div className="flex gap-4 mb-4 text-[10px] font-bold">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> จาก API (มีข้อมูลจริง)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300" /> AI คำนวณ</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> จำลอง (Simulated)</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-emerald-50 text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 w-8">#</th>
                        <th className="px-3 py-2">หมวด</th>
                        <th className="px-3 py-2">Field Name</th>
                        <th className="px-3 py-2">คำอธิบาย</th>
                        <th className="px-3 py-2 text-center">แหล่งที่มา</th>
                        <th className="px-3 py-2">ตัวอย่างค่า (10067)</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
                      {/* === MATERIALS (from API) === */}
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">1</td>
                        <td className="px-3 py-2" rowSpan={7}><span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">📦 Materials</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">id</td>
                        <td className="px-3 py-2">รหัสพัสดุ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">10067</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">2</td>
                        <td className="px-3 py-2 font-mono text-[10px]">name</td>
                        <td className="px-3 py-2">ชื่อพัสดุ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">160 kVA Transformer 3Ph</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">3</td>
                        <td className="px-3 py-2 font-mono text-[10px]">currentStock</td>
                        <td className="px-3 py-2">สต๊อกปัจจุบัน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-red-600 font-bold">12</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">4</td>
                        <td className="px-3 py-2 font-mono text-[10px]">safetyStock</td>
                        <td className="px-3 py-2">สต๊อกขั้นต่ำ (Safety Stock)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">250</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">5</td>
                        <td className="px-3 py-2 font-mono text-[10px]">sparkline[]</td>
                        <td className="px-3 py-2">แนวโน้มสต๊อก 6 เดือนย้อนหลัง</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">[400,380,250,150,80,12]</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">6</td>
                        <td className="px-3 py-2 font-mono text-[10px]">budgetPrice</td>
                        <td className="px-3 py-2">ราคากลาง (งบประมาณ)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">฿150,000</td>
                      </tr>
                      <tr className="bg-emerald-50/40">
                        <td className="px-3 py-2 text-slate-400">7</td>
                        <td className="px-3 py-2 font-mono text-[10px]">unitPrice</td>
                        <td className="px-3 py-2">ราคาตลาดปัจจุบัน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">฿192,800</td>
                      </tr>

                      {/* === AI COMPUTED FIELDS === */}
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">8</td>
                        <td className="px-3 py-2" rowSpan={5}><span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">🧠 AI Supply Chain</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">avgMonthlyDemand</td>
                        <td className="px-3 py-2">ปริมาณใช้เฉลี่ย/เดือน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-indigo-600">80 (จาก sparkline)</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">9</td>
                        <td className="px-3 py-2 font-mono text-[10px]">annualDemand</td>
                        <td className="px-3 py-2">ปริมาณใช้ต่อปี</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-indigo-600">960 (80 × 12)</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">10</td>
                        <td className="px-3 py-2 font-mono text-[10px]">leadTimeWeeks</td>
                        <td className="px-3 py-2">ระยะเวลารอคอย (สัปดาห์)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-indigo-600">12 สัปดาห์ (≈90 วัน)</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">11</td>
                        <td className="px-3 py-2 font-mono text-[10px]">reorderPoint (ROP)</td>
                        <td className="px-3 py-2">จุดสั่งซื้อใหม่</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-indigo-600">480 เครื่อง</td>
                      </tr>
                      <tr className="bg-indigo-50/40">
                        <td className="px-3 py-2 text-slate-400">12</td>
                        <td className="px-3 py-2 font-mono text-[10px]">eoq</td>
                        <td className="px-3 py-2">ปริมาณสั่งซื้อที่คุ้มทุน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-indigo-600">800 เครื่อง</td>
                      </tr>

                      {/* === RISK ALERTS (from API + AI) === */}
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">13</td>
                        <td className="px-3 py-2" rowSpan={4}><span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">⚠️ Risk Alerts</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">severity, materialId, message</td>
                        <td className="px-3 py-2">ระดับความรุนแรง + ข้อความ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">critical, alt-1</td>
                      </tr>
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">14</td>
                        <td className="px-3 py-2 font-mono text-[10px]">costImpact</td>
                        <td className="px-3 py-2">ผลกระทบทางการเงิน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">฿231.36M</td>
                      </tr>
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">15</td>
                        <td className="px-3 py-2 font-mono text-[10px]">recommendation</td>
                        <td className="px-3 py-2">AI แนะนำวิธีแก้ไข</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-indigo-600">เร่งจัดซื้อ + Plan B</td>
                      </tr>
                      <tr className="bg-red-50/30">
                        <td className="px-3 py-2 text-slate-400">16</td>
                        <td className="px-3 py-2 font-mono text-[10px]">confidence, bufferDays</td>
                        <td className="px-3 py-2">ความมั่นใจ + สต๊อกยื้อได้กี่วัน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] text-indigo-600">95%, 4 วัน</td>
                      </tr>

                      {/* === SUPPLIER (Simulated) === */}
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">17</td>
                        <td className="px-3 py-2" rowSpan={4}><span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">🏭 Suppliers</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">vendors[].name</td>
                        <td className="px-3 py-2">รายชื่อผู้ค้า 5 ราย</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">ไทยทรานสฟอร์มเมอร์ ฯลฯ</td>
                      </tr>
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">18</td>
                        <td className="px-3 py-2 font-mono text-[10px]">registeredCapacity</td>
                        <td className="px-3 py-2">กำลังการผลิตจดทะเบียน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">400 เครื่อง/ปี</td>
                      </tr>
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">19</td>
                        <td className="px-3 py-2 font-mono text-[10px]">outstandingPOs</td>
                        <td className="px-3 py-2">PO ค้างส่ง (ยังไม่ส่งมอบ)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">150 เครื่อง</td>
                      </tr>
                      <tr className="bg-amber-50/30">
                        <td className="px-3 py-2 text-slate-400">20</td>
                        <td className="px-3 py-2 font-mono text-[10px]">reliabilityScore</td>
                        <td className="px-3 py-2">อัตราค้างจ่าย / ความน่าเชื่อถือ</td>
                        <td className="px-3 py-2 text-center"><span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded">SIM</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">0.95 (95%)</td>
                      </tr>

                      {/* === eBIDDING (AI Computed) === */}
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">21</td>
                        <td className="px-3 py-2" rowSpan={4}><span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">📋 e-Bidding</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">totalRequirement</td>
                        <td className="px-3 py-2">ปริมาณที่ต้องจัดซื้อทั้งหมด</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">800 เครื่อง</td>
                      </tr>
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">22</td>
                        <td className="px-3 py-2 font-mono text-[10px]">simulation.steps[]</td>
                        <td className="px-3 py-2">สถานการณ์จำลอง (3 ขั้นตอน)</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">Forecast → Crisis → Recovery</td>
                      </tr>
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">23</td>
                        <td className="px-3 py-2 font-mono text-[10px]">priceTrend[]</td>
                        <td className="px-3 py-2">แนวโน้มราคาย้อนหลัง 7 เดือน</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">฿145K→฿155K→฿147K</td>
                      </tr>
                      <tr className="bg-purple-50/30">
                        <td className="px-3 py-2 text-slate-400">24</td>
                        <td className="px-3 py-2 font-mono text-[10px]">dynamicROP, bufferDays</td>
                        <td className="px-3 py-2">จุดสั่งซื้อ + วันสำรอง</td>
                        <td className="px-3 py-2 text-center"><span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded">AI</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">480 เครื่อง, 4 วัน</td>
                      </tr>

                      {/* === GLOBAL (from API) === */}
                      <tr className="bg-slate-50">
                        <td className="px-3 py-2 text-slate-400">25</td>
                        <td className="px-3 py-2"><span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">📊 Global</span></td>
                        <td className="px-3 py-2 font-mono text-[10px]">totalVaR</td>
                        <td className="px-3 py-2">มูลค่าความเสี่ยงรวม</td>
                        <td className="px-3 py-2 text-center"><span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded">API</span></td>
                        <td className="px-3 py-2 font-mono text-[10px] font-bold">฿345.8M</td>
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
                <div className="text-[10px] font-bold text-emerald-600 uppercase">จาก API (มีจริง)</div>
              </div>
              <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 text-center">
                <div className="text-[24px] font-black text-indigo-700">11</div>
                <div className="text-[10px] font-bold text-indigo-600 uppercase">AI คำนวณเพิ่ม</div>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 text-center">
                <div className="text-[24px] font-black text-amber-700">4</div>
                <div className="text-[10px] font-bold text-amber-600 uppercase">จำลอง (Supplier)</div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-4">
              <p className="text-[12px] text-emerald-900 font-bold mb-2">✅ Data Pipeline Summary: 25 fields ใน 5 หมวด → ขับเคลื่อน 4 หน้าจอ</p>
              <p className="text-[11px] text-emerald-700 font-medium">
                📦 Materials (7 API) + 🧠 AI Supply Chain (5 AI) + ⚠️ Risk (4 API+AI) + 🏭 Suppliers (4 SIM) + 📋 e-Bidding (4 AI) + 📊 Global (1 API) → <strong>Dashboard, Risk Management, e-Bidding, AI Copilot</strong>
              </p>
            </div>

          </div>
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
