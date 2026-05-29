"use client";

import { Search, Bell, Download, ChevronDown, HelpCircle, Loader2, BrainCircuit, BookOpen, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";

const tabConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "ภาพรวมการตัดสินใจ",
    subtitle: "Executive command center",
  },
  forecast: {
    title: "พยากรณ์ Demand",
    subtitle: "Forecast and seasonality insight",
  },
  inventory: {
    title: "วางแผนเติมสต็อก",
    subtitle: "Stock planning workspace",
  },
  risk: {
    title: "แจ้งเตือนความเสี่ยง",
    subtitle: "Prioritized risk alerts",
  },
  procurement: {
    title: "จัดซื้อจัดจ้างอัจฉริยะ",
    subtitle: "Procurement action board",
  },
  warehouse: {
    title: "ภาพรวมผู้บริหารคลัง",
    subtitle: "Executive warehouse command center",
  },
  budget: {
    title: "วิเคราะห์งบประมาณ",
    subtitle: "Budget and exposure insight",
  },
  reports: {
    title: "รายงานผู้บริหาร",
    subtitle: "Presentation-ready summary",
  },
  activity: {
    title: "ประวัติกิจกรรม (System Logs)",
    subtitle: "AI recommendation audit trail & system timeline",
  },
  roadmap: {
    title: "AI Training & แผนงานโครงสร้างระบบ",
    subtitle: "Backtesting, Sprint Updates, Architecture & Timeline",
  },
};

interface TopBarProps {
  activeTab: string;
  onMenuClick?: () => void;
}

export default function TopBar({ activeTab, onMenuClick }: TopBarProps) {
  const { criticalAlerts, runAutoRiskAnalysis, isAnalyzingRisk } = useData();
  const [now, setNow] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [showManual, setShowManual] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const current = tabConfig[activeTab] ?? tabConfig.risk;
  const alertBadge = activeTab === "risk" ? criticalAlerts.length : null;

  const dateStr = isMounted ? now.toLocaleDateString("th-TH", {
    day: "numeric", month: "long", year: "numeric",
  }) : "";
  const timeStr = isMounted ? now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <>
    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-gray-100/60 bg-white/60 px-4 md:px-8 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
      <button 
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[16px] font-bold text-[#5c2b86]">{current.title}</h1>
          {alertBadge ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-critical-600 text-[9px] font-bold text-white">
              {alertBadge}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[13px] text-[#8a94ab]">{current.subtitle}</div>
      </div>

      <div className="flex-1" />

      {/* Date */}
      <span className="text-[13px] text-[#8a94ab]">{dateStr} • {timeStr} น.</span>


      {/* Spacer */}
      <button
        onClick={() => setShowManual(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/60 text-[13px] font-bold text-purple-700 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-300 transition-all cursor-pointer shadow-sm hover:shadow group"
        title="เปิดคู่มือการใช้งาน"
      >
        <BookOpen size={15} className="text-purple-500 group-hover:scale-110 transition-transform shrink-0" />
        <span className="hidden sm:inline">คู่มือ</span>
      </button>
      <div className="w-px h-5 bg-border" />

      {/* Profile */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d04ca6] to-[#9f2c80] border-2 border-[#f3d3e7] flex items-center justify-center text-[12px] font-bold text-white">
          {activeTab === "warehouse" ? "วญ" : "ขภ"}
        </div>
        <div className="hidden lg:block">
          <div className="text-[13px] font-semibold text-text-primary leading-tight">
            {activeTab === "warehouse" ? "คุณวรัญญู จันทร์ศิริ" : "คุณขวัญภิชา"}
          </div>
          <div className="text-[12px] text-text-muted">
            {activeTab === "warehouse" ? "ผู้บริหารคลัง" : "Supply Planner"}
          </div>
        </div>
        <ChevronDown size={12} className="text-text-muted" />
      </div>
    </header>
      {showManual && <ManualModal onClose={() => setShowManual(false)} />}
    </>
  );
}

/* ────────────────────────────────────────────── */
/*  Manual Modal Component                        */
/* ────────────────────────────────────────────── */
function ManualModal({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState(0);

  // Screenshot preview helper
  const ScreenshotPreview = ({ src, alt }: { src: string; alt: string }) => (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-3 mb-3">
      <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center gap-2">
        <div className="flex gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-400"/><div className="w-2.5 h-2.5 rounded-full bg-amber-400"/><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"/></div>
        <span className="text-[12px] text-slate-500 font-medium">📸 ตัวอย่างหน้าจอ — {alt}</span>
      </div>
      <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
    </div>
  );

  const sections = [
    {
      id: "overview",
      icon: "🏠",
      title: "ภาพรวมระบบ",
      content: (
        <div className="space-y-4">
          <p className="text-[14px] text-slate-700 leading-relaxed">
            <strong>PEA Brain (Multi-Agent Squad)</strong> ถูกออกแบบมาเพื่อให้ผู้บริหารและทีมจัดหา <strong>เห็นผลลัพธ์ที่เป็นรูปธรรมและตัดสินใจได้ทันที</strong> โดยมุ่งเน้นไปที่ประโยชน์หลัก 4 ด้าน:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "⚡ ความเร็ววิเคราะห์ & วางแผน", desc: "ลดเวลาจาก 3 วัน เหลือเพียง 10 วินาที (ประหยัดเวลา 99%)" },
              { title: "🎯 ตรวจจับความเสี่ยงวิกฤต", desc: "100% Real-time ป้องกันสต็อกขาดแคลนก่อนเกิดปัญหา" },
              { title: "🧠 ประมวลผลข้อมูลเชิงลึก", desc: "AI วิเคราะห์ตัวแปรมากถึง 25 Fields เพื่อหาแผนจัดซื้อที่ดีที่สุด" },
              { title: "💰 ลดต้นทุน & คุ้มค่าที่สุด", desc: "ประหยัดงบประมาณสูงสุด (Cost Savings) และสร้างแผน E-BIDDING อัตโนมัติ" },
            ].map((a, i) => (
              <div key={i} className="rounded-xl bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200/60 p-3">
                <div className="text-[14px] font-bold text-slate-800">{a.title}</div>
                <div className="text-[14px] text-slate-600 mt-0.5">{a.desc}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 mt-3">
            <div className="text-[14px] font-bold text-emerald-800 mb-1">📊 ข้อมูลที่ผู้บริหารต้องรู้ (Executive Insights)</div>
            <div className="text-[14px] text-emerald-700 leading-relaxed">
              ระบบแสดง <strong>มูลค่าความเสี่ยงรวม (VaR)</strong> และ <strong>แนวโน้มการประหยัดงบประมาณ (Cost Savings)</strong> เปรียบเทียบกับการเบิกจ่ายจริงแบบเรียลไทม์ เพื่อให้ผู้บริหารมองเห็นความคุ้มค่าและตัดสินใจเชิงกลยุทธ์ได้อย่างแม่นยำ
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "menu",
      icon: "📋",
      title: "เมนูหลัก",
      content: (
        <div className="space-y-3">
          <p className="text-[14px] text-slate-700">ระบบมี 4 เมนูหลักใน Sidebar:</p>
          {[
            { icon: "📊", name: "Overview", desc: "Dashboard สรุปภาพรวม KPI ทั้งหมด มูลค่าความเสี่ยง สต็อกเฉลี่ย และตารางแจ้งเตือนด่วน" },
            { icon: "🛡️", name: "Risk Management", desc: "ตารางแจ้งเตือนความเสี่ยงทุกรายการ กรองตามระดับ Critical/Warning/Info พร้อมปุ่มให้ AI วิเคราะห์" },
            { icon: "⏱️", name: "Tracking & Monitoring", desc: "ติดตามแผนที่อนุมัติแล้ว ดู Stepper 4 ขั้นตอน สร้าง PO อัตโนมัติ และ AI เฝ้าระวังการจัดส่ง" },
            { icon: "🗺️", name: "AI Training & Roadmap", desc: "แผนพัฒนาระบบ Phase 1-4, Feedback Log, Backtest Simulator" },
          ].map((m, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:border-purple-200 hover:bg-purple-50/20 transition-colors">
              <div className="text-[20px] shrink-0">{m.icon}</div>
              <div>
                <div className="text-[14px] font-bold text-slate-800">{m.name}</div>
                <div className="text-[14px] text-slate-600 mt-0.5 leading-relaxed">{m.desc}</div>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[14px] text-amber-800 mt-2">
            💡 <strong>บนมือถือ:</strong> กดปุ่ม ☰ มุมบนซ้ายเพื่อเปิด Sidebar
          </div>
          <div className="mt-4">
            <div className="text-[14px] font-bold text-slate-800 mb-2">🔧 ปุ่มด้านล่าง Sidebar</div>
            <div className="space-y-2">
              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                <div className="text-[20px] shrink-0">💬</div>
                <div>
                  <div className="text-[14px] font-bold text-amber-800">โหมดเสนอแนะ</div>
                  <div className="text-[14px] text-amber-700 mt-0.5 leading-relaxed">
                    เปิด/ปิดโหมดเสนอแนะ (Feedback Mode) — เมื่อเปิด ปุ่มจะเปลี่ยนเป็นสีเหลือง สามารถกดที่ส่วนต่างๆ ของหน้าจอเพื่อส่งข้อเสนอแนะ/แจ้งปัญหาได้ ข้อมูลจะบันทึกในหน้า AI Training & Roadmap → Feedback Log
                  </div>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50/50 p-3">
                <div className="text-[20px] shrink-0">🗑️</div>
                <div>
                  <div className="text-[14px] font-bold text-red-800">เคลียร์แผนทั้งหมด (Test)</div>
                  <div className="text-[14px] text-red-700 mt-0.5 leading-relaxed">
                    ล้างแผนจัดซื้อทั้งหมดที่อนุมัติไปแล้ว ใช้สำหรับ<strong>ทดสอบระบบใหม่ตั้งแต่ต้น</strong> — กดแล้วระบบจะถามยืนยันก่อน จากนั้นจะ Reload หน้าเว็บใหม่ รายการทั้งหมดจะกลับเป็น "ยังไม่มีแผน"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dashboard",
      icon: "📊",
      title: "หน้า Dashboard",
      content: (
        <div className="space-y-4">
          <ScreenshotPreview src="/manual/01_dashboard.png" alt="หน้า Overview Dashboard" />
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4">
            <div className="text-[14px] font-bold text-indigo-800 mb-2">🎯 Hero Banner (ส่วนบนสุด)</div>
            <div className="text-[14px] text-indigo-700 leading-relaxed">
              แถบ Gradient สีม่วง-ทอง แสดงข้อมูลสรุปสำคัญ: มูลค่าความเสี่ยงรวม (VaR), สต็อกเฉลี่ย, ประสิทธิภาพ AI
            </div>
          </div>
          <div className="text-[14px] font-bold text-slate-800">📊 KPI Cards (5 การ์ด)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px]">
            {["📦 พัสดุ Critical", "⚠️ แจ้งเตือนทั้งหมด", "🕐 Lead Time เฉลี่ย", "💰 มูลค่าความเสี่ยง", "✅ แผนอนุมัติแล้ว"].map((k, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="w-1.5 h-4 rounded-full bg-indigo-400"></div>
                <span className="font-medium text-slate-700">{k}</span>
              </div>
            ))}
          </div>
          <div className="text-[14px] font-bold text-slate-800 mt-2">📋 ตารางสรุปแจ้งเตือนด่วน</div>
          <div className="text-[14px] text-slate-600 leading-relaxed">
            รายการที่อยู่ในตารางนี้คือ <strong>พัสดุวิกฤต (Critical)</strong> ที่ AI คัดกรองมาให้พิจารณาก่อน สามารถกดปุ่มสีแดง <span className="inline-block px-1.5 py-0.5 bg-red-600 text-white text-[12px] rounded">ให้ AI เข้าไปวิเคราะห์</span> ได้ทันที
          </div>
        </div>
      ),
    },
    {
      id: "risk",
      icon: "🛡️",
      title: "Risk Management",
      content: (
        <div className="space-y-4">
          <ScreenshotPreview src="/manual/02_risk.png" alt="หน้า Risk Management" />
          <div className="text-[14px] text-slate-700 leading-relaxed">
            หน้านี้คือ <strong>ศูนย์กลางการจัดการความเสี่ยง</strong> ทุกรายการจัดซื้อที่มีปัญหาจะถูกนำมารวมไว้ที่นี่ แบ่งเป็น 3 ระดับ:
          </div>
          <div className="flex flex-col gap-2">
            {[
              { level: "Critical (วิกฤต)", bg: "bg-red-50 border-red-200", text: "text-red-700", desc: "สต็อกต่ำกว่า Safety, Lead Time ยาวนาน ต้องรีบจัดซื้อทันที" },
              { level: "Warning (เฝ้าระวัง)", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", desc: "เริ่มมีความเสี่ยง สต็อกใกล้หมด แต่ยังพอมีเวลาดำเนินการ" },
              { level: "Info (ปกติ)", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", desc: "สต็อกปกติ แต่แสดงไว้ให้ทราบข้อมูล" },
            ].map((r, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${r.bg}`}>
                <div className={`text-[14px] font-bold ${r.text} w-[130px] shrink-0`}>{r.level}</div>
                <div className={`text-[14px] ${r.text} leading-relaxed`}>{r.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-100">
            <div className="text-[14px] font-bold text-purple-800 mb-2">🤖 การทำงานของ AI Copilot</div>
            <ol className="list-decimal list-inside text-[14px] text-purple-800 leading-relaxed space-y-1.5">
              <li>กดปุ่ม &quot;ให้ AI วิเคราะห์&quot; ที่หน้ารายการที่ต้องการ</li>
              <li>AI จะสรุป <strong>Executive Summary</strong> ให้ทันทีว่าทำไมถึงวิกฤต</li>
              <li>AI จะคำนวณ TCO (Total Cost of Ownership) เปรียบเทียบแผน A และ B</li>
              <li>เลือกแผนที่ AI แนะนำ และกดส่งไปหน้า Tracking ได้เลย</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "tracking",
      icon: "⏱️",
      title: "Tracking & Monitoring",
      content: (
        <div className="space-y-4">
          <ScreenshotPreview src="/manual/03_tracking.png" alt="หน้า Tracking & Monitoring" />
          <div className="text-[14px] text-slate-700 leading-relaxed">
            ติดตามแผนที่อนุมัติไปแล้ว พร้อม Stepper 4 ขั้นตอน:
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 overflow-x-auto">
            <span className="text-[12px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">✅ วิเคราะห์</span>
            <span className="text-slate-400">→</span>
            <span className="text-[12px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">✅ อนุมัติแผน</span>
            <span className="text-slate-400">→</span>
            <span className="text-[12px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">🔵 จัดซื้อ (PO)</span>
            <span className="text-slate-400">→</span>
            <span className="text-[12px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">⬜ ส่งมอบ</span>
          </div>
          <div className="text-[14px] font-bold text-slate-800 mt-4 mb-2">ฟีเจอร์สำคัญ:</div>
          <ul className="space-y-2">
            {[
              "กดขยายรายการ → ดูสรุปแผน + AI เฝ้าระวังการจัดส่ง",
              "ปุ่ม \"AI วิเคราะห์แผนสำรอง\" → สร้างแผนฉุกเฉินเมื่อ Supplier ล่าช้า",
              "ตาราง Deep Analysis — Multi-Agent วิเคราะห์: Demand + Procurement + Warehouse",
              "Emergency Decision Matrix — เปรียบเทียบ 2 ทางเลือก พร้อมเหตุผล",
              "ปุ่ม \"สร้าง PO อัตโนมัติ\" → สร้างใบสั่งซื้อ + พิมพ์เอกสารได้",
            ].map((li, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-slate-700 leading-relaxed">
                <span className="text-purple-500 mt-0.5">›</span> {li}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "ai_copilot",
      icon: "💬",
      title: "AI Copilot (แชทบอท)",
      content: (
        <div className="space-y-4">
          <ScreenshotPreview src="/manual/05_chat.png" alt="AI Copilot" />
          <div className="text-[14px] text-slate-700 leading-relaxed">
            ระบบมี <strong>AI Assistant</strong> อยู่มุมขวาล่างของหน้าจอ (ไอคอน 💬) สามารถสอบถามข้อมูลเชิงลึกได้ทุกเรื่อง เช่น:
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              "\"ช่วยสรุปภาพรวมความเสี่ยงของเดือนนี้ให้หน่อย\"",
              "\"หม้อแปลง 160 kVA ขาดสต็อกเพราะอะไร?\"",
              "\"ถ้าเพิ่ม Safety Stock อีก 10% จะต้องใช้งบเพิ่มเท่าไหร่?\"",
              "\"สถิติ Vendor เจ้านี้ ส่งของตรงเวลาไหม?\""
            ].map((q, i) => (
              <div key={i} className="px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-100 text-[14px] text-purple-800 font-medium italic">
                {q}
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mt-2">
            <div className="text-[14px] font-bold text-slate-800 mb-1">💡 ความสามารถพิเศษ</div>
            <div className="text-[14px] text-slate-600 leading-relaxed">
              AI สามารถ <strong>ค้นหาข้อมูลจาก RAG (Knowledge Base)</strong> ของระเบียบพัสดุ PEA และประวัติการสั่งซื้อย้อนหลัง เพื่อให้คำตอบที่อ้างอิงจากข้อมูลจริงขององค์กร
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "walkthrough",
      icon: "🎯",
      title: "Case Study: พาเล่น",
      content: (
        <div className="space-y-6">
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="text-[14px] font-bold text-red-800 mb-1">🚨 สถานการณ์: หม้อแปลง 160 kVA ใกล้หมดสต็อก!</div>
            <div className="text-[14px] text-red-700 font-medium">สต็อกเหลือ 12 เครื่อง • Demand 339/เดือน • ใช้ได้อีก 1 วัน!</div>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-200 before:via-purple-100 before:to-transparent">
            {[
              {
                step: "1",
                title: "เปิดหน้า Dashboard",
                desc: "เห็น KPI \"พัสดุ Critical = 2\" และตารางแจ้งเตือนด่วน รายการ 10067",
                action: "กดปุ่ม \"ให้ AI สร้างแผนจัดซื้อด่วน\"",
                img: "01_dashboard.png"
              },
              {
                step: "2",
                title: "AI วิเคราะห์ (5 วินาที)",
                desc: "เห็น Executive Summary + TCO เปรียบเทียบ: ซื้อทีเดียว ฿520M vs ทยอยซื้อ ฿492M → ประหยัด ฿28M/ปี",
                action: "กด \"เลือกแผน A → วางแผนจัดซื้อ\"",
                img: "08_ai_analysis.png"
              },
              {
                step: "3",
                title: "ไปหน้า Tracking",
                desc: "เห็น Stepper: ✅ วิเคราะห์ → ✅ อนุมัติแผน → 🔵 จัดซื้อ PO → ⬜ ส่งมอบ",
                action: "กดขยายรายการ 10067",
                img: "11_cs_tracking.png"
              },
              {
                step: "4",
                title: "ดู Deep Analysis",
                desc: "AI เฝ้าระวังการจัดส่งให้ด้วย หาก Supplier เสี่ยงส่งช้า AI จะสร้าง Decision Matrix",
                action: "กดปุ่ม \"AI วิเคราะห์แผนสำรอง\"",
                img: "09_plan_comparison.png"
              },
              {
                step: "5",
                title: "เปรียบเทียบ Emergency Decision",
                desc: "AI เทียบให้ว่า จะยืมของจากคลังอื่น หรือจะเร่งรัด Supplier เดิม อันไหนคุ้มกว่ากัน",
                action: "กด \"ยืนยันแผน A (ยืมคลังใกล้เคียง)\"",
                img: "12_cs_emergency.png"
              }
            ].map((s, i) => (
              <div key={i} className="relative flex items-start gap-4 md:gap-6">
                <div className="sticky top-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-[14px] shadow-sm z-10">
                  {s.step}
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-purple-200 transition-colors">
                  <h4 className="text-[14px] font-bold text-slate-900">{s.title}</h4>
                  <p className="mt-1 text-[14px] text-slate-600 leading-relaxed">{s.desc}</p>
                  <div className="text-[14px] text-purple-600 font-bold mt-2 mb-2">👆 {s.action}</div>
                  {s.img && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                      <img src={`/manual/${s.img}`} alt={s.title} className="w-full h-auto object-cover object-top" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    }
  ];

  return (
    <div className="fixed inset-0 z-[20000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 md:pr-4 md:py-4 md:pl-[276px] animate-in fade-in duration-200">
      <div className="w-full max-w-[1100px] max-h-[96vh] bg-white rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-indigo-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900 tracking-tight">📘 คู่มือการใช้งาน PEA Brain</h2>
              <p className="text-[12px] text-slate-500 font-medium">ระบบสนับสนุนการตัดสินใจจัดซื้อพัสดุอัจฉริยะ</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-white/80 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden min-h-0">
          {/* Sidebar */}
          <div className="w-[220px] md:w-[240px] border-r border-slate-100 bg-slate-50/50 overflow-y-auto shrink-0 hidden sm:block">
            <div className="p-2 space-y-0.5">
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all cursor-pointer ${
                    activeSection === i
                      ? "bg-purple-100 text-purple-800 font-bold shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <span className="mr-1.5">{s.icon}</span>{s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Section Tabs */}
          <div className="sm:hidden flex overflow-x-auto border-b border-slate-100 bg-slate-50 shrink-0">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(i)}
                className={`px-3 py-2 text-[14px] whitespace-nowrap font-medium border-b-2 transition-colors ${
                  activeSection === i ? "border-purple-600 text-purple-700 bg-purple-50" : "border-transparent text-slate-500"
                }`}
              >
                {s.icon} {s.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[22px]">{sections[activeSection].icon}</span>
              <h3 className="text-[18px] font-extrabold text-slate-900">{sections[activeSection].title}</h3>
            </div>
            {sections[activeSection].content}
          </div>
        </div>
      </div>
    </div>
  );
}
