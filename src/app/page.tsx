"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, Printer, X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useData } from "./context/DataContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import AICopilot from "./components/AICopilot";
import Dashboard from "./components/Dashboard";
import ForecastView from "./components/ForecastView";
import InventoryView from "./components/InventoryView";
import AlertsView from "./components/AlertsView";
import EBiddingView from "./components/EBiddingView";
import {
  BudgetView,
  ProcurementView,
  ReportsView,
} from "./components/StrategicViews";
import WarehouseView from "./components/WarehouseView";
import ProjectRoadmap from "./components/ProjectRoadmap";

/* ─── Watermark: Logo + Name + Grid ─── */
function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* ── Center: PEA BRAIN logo image + brand text ── */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.05 }}>
        <div className="flex flex-col items-center gap-5 select-none">
          <img
            src="/pea-official-logo.png"
            alt=""
            width={160}
            height={160}
            style={{ filter: "grayscale(20%) opacity(0.8)" }}
          />
          <div className="flex flex-col items-center">
            <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: 2, color: "#A80689", lineHeight: 1 }}>
              PEA Brain
            </div>
            
            {/* Golden Heartbeat Line */}
            <div className="w-[120%] flex items-center justify-center mt-2 mb-2" style={{ color: "#EDC878" }}>
              <div className="flex-1 h-[2px] bg-[#EDC878] rounded-full"></div>
              <svg width="30" height="15" viewBox="0 0 40 20" fill="none" className="mx-1" stroke="#EDC878" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 10 H8 L12 4 L18 16 L24 2 L30 14 L34 10 H40" />
              </svg>
              <div className="flex-1 h-[2px] bg-[#EDC878] rounded-full"></div>
            </div>

            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 0.5, color: "#A80689", opacity: 0.8 }}>
              ขับเคลื่อนการจัดซื้อพลังงานด้วย AI เพื่ออนาคตที่ยั่งยืน
            </div>
          </div>
        </div>
      </div>

      {/* ── Repeating diagonal text ── */}
      <div className="watermark-text" />

      {/* ── Power Grid illustration image (bottom-right) ── */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[450px]"
        style={{ opacity: 0.04 }}>
        <img
          src="/power-grid.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom right",
            filter: "saturate(0.3) opacity(0.8)",
          }}
        />
      </div>
    </div>
  );
}


import ActivityView from "./components/ActivityView";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [analyzingMaterialId, setAnalyzingMaterialId] = useState<string | null>(null);
  const { materials, isLoading, error } = useData();

  // Approved plans — persisted at page level so they survive tab switches
  interface ApprovedPlanData {
    materialId: string;
    materialName: string;
    planName: string;
    action: string;
    qty: number;
    risk: string;
    financial: string;
    supplyForecast?: string;
    mitigation?: string;
    unitPrice: number;
  }
  const [approvedPlans, setApprovedPlans] = useState<ApprovedPlanData[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pea_approved_plans");
      if (saved) {
        setApprovedPlans(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load approved plans", e);
    }
  }, []);

  // Save to localStorage whenever approvedPlans changes (except initial empty mount)
  useEffect(() => {
    if (approvedPlans.length > 0) {
      localStorage.setItem("pea_approved_plans", JSON.stringify(approvedPlans));
    } else if (localStorage.getItem("pea_approved_plans") && approvedPlans.length === 0) {
      // If state is empty but we have localstorage, it might be the initial render before mount.
      // We don't want to clear localstorage immediately.
    }
  }, [approvedPlans]);

  useEffect(() => {
    const handleApprove = (e: Event) => {
      const ev = e as CustomEvent<ApprovedPlanData>;
      setApprovedPlans(prev => {
        const exists = prev.find(p => p.materialId === ev.detail.materialId);
        const newPlans = exists 
          ? prev.map(p => p.materialId === ev.detail.materialId ? ev.detail : p)
          : [...prev, ev.detail];
        // Also save immediately here just to be safe
        localStorage.setItem("pea_approved_plans", JSON.stringify(newPlans));
        return newPlans;
      });
    };
    window.addEventListener("approve-plan", handleApprove);
    return () => window.removeEventListener("approve-plan", handleApprove);
  }, []);

  interface POPending {
    isOpen: boolean;
    step: number;
    materialId: string;
    materialName: string;
    qty: number;
    price: number;
    poNumber: string;
  }

  const [poProgress, setPoProgress] = useState<POPending | null>(null);

  interface AlertModalState {
    isOpen: boolean;
    title: string;
    content: string;
    type?: "info" | "success" | "warning";
  }

  const [alertModal, setAlertModal] = useState<AlertModalState | null>(null);

  useEffect(() => {
    const handleShowAlert = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; content: string; type?: "info" | "success" | "warning" }>;
      const { title, content, type } = customEvent.detail;
      setAlertModal({
        isOpen: true,
        title: title || "รายละเอียด",
        content: content || "",
        type: type || "info"
      });
    };

    window.addEventListener("show-alert", handleShowAlert);
    return () => window.removeEventListener("show-alert", handleShowAlert);
  }, []);

  useEffect(() => {
    const handleCreatePO = (e: Event) => {
      const customEvent = e as CustomEvent<{ materialId: string; qty?: number; name?: string; price?: number }>;
      const { materialId, qty, name, price } = customEvent.detail;
      
      const material = materials.find(m => m.id === materialId);
      const mName = name || material?.name || materialId;
      const mQty = qty || material?.eoq || 100;
      const mPrice = price || material?.unitPrice || 150000;
      const poNum = "PO-2569-" + Math.floor(100000 + Math.random() * 900000);

      setPoProgress({
        isOpen: true,
        step: 1,
        materialId,
        materialName: mName,
        qty: mQty,
        price: mPrice,
        poNumber: poNum
      });
    };

    window.addEventListener("create-po", handleCreatePO);
    return () => window.removeEventListener("create-po", handleCreatePO);
  }, [materials]);

  useEffect(() => {
    const handleAnalyzeMaterial = (e: Event) => {
      const customEvent = e as CustomEvent<{ materialId: string }>;
      setAnalyzingMaterialId(customEvent.detail.materialId);
    };
    window.addEventListener("analyze-material", handleAnalyzeMaterial);
    return () => window.removeEventListener("analyze-material", handleAnalyzeMaterial);
  }, []);

  useEffect(() => {
    if (!poProgress || !poProgress.isOpen || poProgress.step >= 3) return;

    const timer = setTimeout(() => {
      setPoProgress(prev => {
        if (!prev) return null;
        return {
          ...prev,
          step: prev.step + 1
        };
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [poProgress]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "forecast":
        return <ForecastView />;
      case "inventory":
        return <InventoryView />;
      case "procurement":
        return <ProcurementView />;
      case "warehouse":
        return <WarehouseView />;
      case "budget":
        return <BudgetView />;
      case "reports":
        return <ReportsView />;
      case "activity":
        return <ActivityView approvedPlans={approvedPlans} />;
      case "roadmap":
        return <ProjectRoadmap />;
      case "risk":
      default:
        return <AlertsView approvedPlans={approvedPlans} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f6f5fb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#A80689]" />
          <div className="text-sm font-bold text-slate-600">กำลังเชื่อมต่อระบบฐานข้อมูล PEA...</div>
        </div>
      </div>
    );
  }

  if (error || !materials) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f6f5fb]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">เกิดข้อผิดพลาดในการเชื่อมต่อ</h2>
          <p className="text-sm text-slate-500 mb-4">{error || "ไม่สามารถโหลดข้อมูลจากระบบได้"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#A80689] hover:bg-[#8A0570] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f5fb]">
      {/* Background watermark */}
      <Watermark />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Center + Right */}
      <div className="flex flex-1 overflow-hidden relative z-[1]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar activeTab={activeTab} />
          <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(249,246,255,0.95)_0%,rgba(245,247,252,0.96)_100%)]">
            <div className="px-6 py-5 space-y-4">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* AI Copilot Panel */}
        <AICopilot />
      </div>

      {/* EBidding AI Action Plan Modal — Full Screen */}
      {analyzingMaterialId && (
        <div className="fixed inset-0 z-[90] bg-[#f4f6fb] overflow-y-auto">
          <button 
            onClick={() => setAnalyzingMaterialId(null)}
            className="fixed top-5 right-5 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 flex items-center justify-center text-white transition z-50 cursor-pointer shadow-lg"
          >
            <X size={22} />
          </button>
          <div className="min-h-screen">
            <EBiddingView targetMaterialId={analyzingMaterialId} setActiveTab={setActiveTab} onClose={() => setAnalyzingMaterialId(null)} />
          </div>
        </div>
      )}

      {/* PO Creation Progress/Document Modal */}
      {poProgress && poProgress.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 animate-scale-in max-h-[95vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FileText className="text-purple-600 animate-pulse" size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">ระบบสร้างใบสั่งซื้ออัจฉริยะ (PEA PO Generator)</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    สถานะ: {poProgress.step === 1 ? "🔍 กำลังวิเคราะห์คงคลัง..." : poProgress.step === 2 ? "🔌 กำลังส่งข้อมูลไปยัง SAP ERP..." : "✅ เสร็จสมบูรณ์"}
                  </p>
                </div>
              </div>
              {poProgress.step === 3 && (
                <button 
                  onClick={() => setPoProgress(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="py-6 flex-1 overflow-y-auto min-h-0">
              {poProgress.step < 3 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="text-purple-600 animate-spin" size={24} />
                    </div>
                  </div>
                  
                  <div className="w-full max-w-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${poProgress.step >= 1 ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                        {poProgress.step > 1 ? "✓" : "1"}
                      </div>
                      <span className={`text-sm ${poProgress.step === 1 ? "font-bold text-purple-600" : "text-slate-500 font-medium"}`}>
                        ตรวจสอบประวัติคงคลังและงบประมาณ
                      </span>
                    </div>
                    <div className="h-6 w-0.5 bg-slate-200 ml-3" />
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${poProgress.step >= 2 ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                        {poProgress.step > 2 ? "✓" : "2"}
                      </div>
                      <span className={`text-sm ${poProgress.step === 2 ? "font-bold text-purple-600" : "text-slate-500 font-medium"}`}>
                        บันทึกข้อมูลและเชื่อมโยง ERP SAP
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Step 3: Show PO Document */
                <div className="space-y-6">
                  {/* Success Banner */}
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-800">สร้างเอกสารใบสั่งซื้อเสร็จสมบูรณ์!</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">เลขที่ PO: {poProgress.poNumber} • ส่งข้อมูลเข้าฐานข้อมูลระบบ SAP ของ PEA เรียบร้อยแล้ว</p>
                    </div>
                  </div>

                  {/* Premium PO Document Sheet */}
                  <div className="print-only-document border border-slate-200 rounded-2xl bg-slate-50/50 p-6 shadow-inner font-sans text-xs text-slate-800 space-y-4">
                    
                    {/* PO Header */}
                    <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <img src="/pea-official-logo.png" alt="PEA Logo" className="w-12 h-12 object-contain" />
                        <div>
                          <h5 className="font-extrabold text-[13px] text-slate-900">การไฟฟ้าส่วนภูมิภาค</h5>
                          <p className="text-[10px] text-slate-500">PROVINCIAL ELECTRICITY AUTHORITY</p>
                          <p className="text-[9px] text-slate-400 mt-1">200 ถนนงามวงศ์วาน ลาดยาว จตุจักร กรุงเทพฯ 10900</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h5 className="font-extrabold text-[14px] text-[#A80689]">ใบสั่งซื้อพัสดุ / Purchase Order</h5>
                        <p className="font-bold text-[11px] text-slate-700 mt-1">เลขที่ PO: {poProgress.poNumber}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">วันที่ออกเอกสาร: {new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>
                    </div>

                    {/* Vendor & Delivery info */}
                    <div className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-4">
                      <div>
                        <h6 className="font-bold text-slate-500 uppercase tracking-wider text-[9px] mb-1">ผู้ขาย / Vendor:</h6>
                        <p className="font-bold text-slate-900 text-[11px]">บริษัท ร่วมค้าผู้ผลิตหม้อแปลงไฟฟ้าไทย จำกัด</p>
                        <p className="text-slate-500 mt-1">112/4 เขตอุตสาหกรรมบางปู จ.สมุทรปราการ</p>
                        <p className="text-slate-500">โทร: 02-345-6789 • อีเมล: contact@thaitransformer.co.th</p>
                      </div>
                      <div>
                        <h6 className="font-bold text-slate-500 uppercase tracking-wider text-[9px] mb-1">สถานที่จัดส่ง / Delivery Location:</h6>
                        <p className="font-bold text-slate-900 text-[11px]">คลังพัสดุกลาง การไฟฟ้าส่วนภูมิภาค (PEA Central Warehouse)</p>
                        <p className="text-slate-500 mt-1">แผนกคลังพัสดุและจัดเก็บรักษา กองพัสดุ</p>
                        <p className="text-slate-500">กำหนดส่งมอบ: ภายในระยะเวลาจัดซื้อ {materials.find(m => m.id === poProgress.materialId)?.leadTimeWeeks ?? 10} สัปดาห์</p>
                      </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                          <th className="py-2">รหัสพัสดุ (SAP)</th>
                          <th className="py-2">รายการ</th>
                          <th className="py-2 text-right">จำนวน</th>
                          <th className="py-2 text-right">ราคาต่อหน่วย</th>
                          <th className="py-2 text-right">จำนวนเงินรวม</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200 text-[11px] text-slate-900 font-medium">
                          <td className="py-3 font-bold">{poProgress.materialId}</td>
                          <td className="py-3">
                            <div>{poProgress.materialName}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">ประเภท: หม้อแปลงไฟฟ้ากำลัง (PEA Spec)</div>
                          </td>
                          <td className="py-3 text-right font-bold">{poProgress.qty.toLocaleString()} เครื่อง</td>
                          <td className="py-3 text-right">฿{poProgress.price.toLocaleString()}</td>
                          <td className="py-3 text-right font-bold">฿{(poProgress.qty * poProgress.price).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end pt-2">
                      <div className="w-64 space-y-1.5 text-right">
                        <div className="flex justify-between text-slate-500">
                          <span>มูลค่ารวม (Subtotal):</span>
                          <span className="font-semibold text-slate-700">฿{(poProgress.qty * poProgress.price).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                          <span className="font-semibold text-slate-700">฿{(poProgress.qty * poProgress.price * 0.07).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-[13px]">
                          <span>ยอดเงินสุทธิ (Total Value):</span>
                          <span className="text-[#A80689]">฿{Math.round(poProgress.qty * poProgress.price * 1.07).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Signature / Approval */}
                    <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[10px] text-slate-500">
                      <div>
                        <span className="font-semibold text-slate-400">ระบบอนุมัติอัตโนมัติ:</span>
                        <span className="ml-1 text-emerald-600 font-bold">ผ่านเกณฑ์ Risk Mitigation & EOQ Limits</span>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-slate-900 border-b border-dashed border-slate-400 pb-1 px-4 mb-1">
                          อนุมัติผ่านระบบกองจัดหาพัสดุ (PEA AI-Sign)
                        </div>
                        <span>ผู้มีอำนาจสั่งซื้อ / Authorized Signature</span>
                      </div>
                    </div>

                  </div>

                  {/* Modal Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2 shrink-0">
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-600 transition cursor-pointer shadow-sm"
                    >
                      <Printer size={13} />
                      พิมพ์เอกสาร
                    </button>
                    <button 
                      onClick={() => setPoProgress(null)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#A80689] to-[#7b0365] hover:opacity-90 text-[11px] font-bold text-white transition cursor-pointer shadow-sm shadow-purple-500/10"
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
      {/* Custom Alert/Info Modal */}
      {alertModal && alertModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  alertModal.type === "success" 
                    ? "bg-emerald-50 text-emerald-600" 
                    : alertModal.type === "warning" 
                    ? "bg-amber-50 text-amber-600" 
                    : "bg-purple-50 text-[#A80689]"
                }`}>
                  {alertModal.type === "success" ? (
                    <CheckCircle2 size={20} />
                  ) : alertModal.type === "warning" ? (
                    <AlertCircle size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>
                <h4 className="font-extrabold text-[15px] text-slate-900 tracking-tight">{alertModal.title}</h4>
              </div>
              <button 
                onClick={() => setAlertModal(null)} 
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-line font-medium p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 max-h-[60vh] overflow-y-auto">
              {alertModal.content}
            </div>

            <div className="flex justify-end pt-1">
              <button 
                onClick={() => setAlertModal(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A80689] to-[#7b0365] hover:opacity-95 text-xs font-bold text-white transition cursor-pointer shadow-sm shadow-purple-500/10"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
