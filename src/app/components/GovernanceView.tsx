import React, { useState, useRef } from "react";
import { ShieldAlert, FileSignature, AlertTriangle, CheckCircle2, AlertOctagon, UserCheck, Search, Scale, FileText, UploadCloud, X, Upload, Loader2 } from "lucide-react";

export default function GovernanceView() {
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [hasUploadedDocument, setHasUploadedDocument] = useState(false);
  
  // Action states
  const [isTorReviewed, setIsTorReviewed] = useState(false);
  const [isPriceAdjusted, setIsPriceAdjusted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploadModalOpen(true);
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setHasUploadedDocument(true);
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setUploadSuccess(false);
        }, 2000);
      }, 2500);
    }
  };
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-purple-600" size={32} />
            Governance & AI Safety
          </h1>
          <p className="text-slate-500 mt-2 text-[16.5px] md:text-[16.5px] font-medium max-w-2xl">
            ระบบกำกับดูแลการทำงานของ AI และการควบคุมความเสี่ยง (Redflag Analysis) ตามนโยบายจัดซื้อจัดจ้าง
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2.5 rounded-xl text-[16.5px] font-bold flex items-center gap-2">
          <CheckCircle2 size={18} />
          Human-in-the-loop Active
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt" 
      />

      {/* 1. PCO Risk-Sharing Draft Status */}
      <section className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <FileSignature size={28} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-[16.5px] font-extrabold text-slate-800">PCO Contractual Bottleneck Mitigation</h2>
              <span className="bg-emerald-100 text-emerald-700 text-[16.5px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={14} /> Draft Completed
              </span>
            </div>
            <p className="text-[16.5px] text-slate-600 font-medium mb-4">
              ตามที่ Mentor เสนอแนะ โมเดล PCO (Purchase and Consignment Order) อาจมีประเด็นทับซ้อนเรื่องกรรมสิทธิ์สินทรัพย์ตาม พ.ร.บ. จัดซื้อจัดจ้างฯ ทีมงานได้เตรียม **ร่างข้อกำหนดการโอนความเสี่ยงและเพดานความรับผิดชอบ (Risk Transfer & Liability Caps Draft)** สำหรับสต็อกฝากขายไว้ล่วงหน้า เพื่ออุดช่องโหว่ทางกฎหมายนี้แล้ว
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                <Scale className="text-slate-400" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-[16.5px] font-bold text-slate-700">เอกสารแนบท้ายสัญญา PCO-2026 (ฉบับร่าง)</h4>
                <p className="text-[16.5px] text-slate-500">พร้อมใช้งานทันทีหากคณะกรรมการสอบถามถึงความพร้อมทางกฎหมาย (Legal Feasibility)</p>
              </div>
              <button 
                onClick={() => setIsDraftModalOpen(true)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 rounded-xl text-[16.5px] font-bold text-slate-600 transition-colors flex items-center gap-2"
              >
                <FileText size={16} /> ดูฉบับร่าง
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Redflag Analysis (Domain Expertise) */}
      <section className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16.5px] md:text-[20px] font-black text-slate-800">Redflag Analysis (AI Inspector)</h2>
          </div>
          <button 
            onClick={handleUploadClick}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-xl text-[16.5px] font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow"
          >
            <UploadCloud size={16} /> อัปโหลดเอกสาร TOR / BOQ เพื่อตรวจสอบ
          </button>
        </div>

        {!hasUploadedDocument ? (
          <div className="space-y-4">
            <div 
              onClick={handleUploadClick}
              className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer rounded-2xl md:rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[250px] transition-all group shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 bg-white group-hover:bg-indigo-100 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-600 mb-4 shadow-sm transition-colors">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-[13.5px] font-bold text-slate-700 group-hover:text-indigo-700 mb-2">คลิกเพื่ออัปโหลดเอกสาร</h3>
              <p className="text-[16.5px] text-slate-500 max-w-sm mx-auto">
                รองรับไฟล์ PDF, Word หรือ TXT เพื่อให้ AI จำลองการตรวจสอบล็อกสเปกและความผิดปกติของราคา
              </p>
            </div>
            
            <div className="text-center">
              <a 
                href="/Sample_TOR_PEA.txt" 
                download="Sample_TOR_PEA.txt"
                className="inline-flex items-center gap-2 text-[16.5px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
              >
                <FileText size={16} /> ดาวน์โหลดเอกสารตัวอย่าง (Sample_TOR) เพื่อใช้ทดสอบ
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Document Preview Pane */}
            <div className="flex-1 bg-slate-100 rounded-2xl md:rounded-3xl border border-slate-300 p-2 md:p-4 shadow-inner flex flex-col relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <FileText size={100} className="text-slate-500" />
              </div>
              <div className="bg-white rounded-t-xl border-b border-slate-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[16.5px] font-bold text-slate-600">
                  <FileText size={16} className="text-indigo-500" />
                  Sample_TOR_PEA.pdf
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
              </div>
              <div className="bg-white flex-1 p-6 md:p-8 font-serif text-slate-800 text-[16.5px] md:text-[16.5px] leading-relaxed shadow-sm overflow-y-auto max-h-[500px] border-x border-b border-slate-200 rounded-b-xl relative">
                <h4 className="text-center font-bold text-[16.5px] mb-6 border-b border-slate-200 pb-4">ข้อกำหนดรายละเอียด (TOR) การจัดซื้อพัสดุ</h4>
                
                <p className="font-bold mb-2">1. รายการพัสดุ: Drop Out Fuse</p>
                <div className="pl-4 mb-4 space-y-2">
                  <p>รหัสวัสดุ: <span className="bg-rose-100 text-rose-800 font-bold px-1 rounded ring-1 ring-rose-300">20045</span></p>
                  <p>จำนวนที่ต้องการ: 1,500 ชุด</p>
                  <p>คุณสมบัติทางเทคนิค: ตามมาตรฐาน กฟภ. ฉบับแก้ไขล่าสุด</p>
                  <p className="flex items-center gap-2">
                    ผู้ผ่านการพิจารณาคุณสมบัติเบื้องต้น: 
                    <span className="bg-rose-100 text-rose-800 font-bold px-1 rounded flex items-center gap-1 ring-1 ring-rose-300">
                      บริษัท นอร์ทเทิร์น กรีน เอ็นเนอร์ยี่ <AlertTriangle size={14} className="text-rose-600" />
                    </span>
                  </p>
                  <p className="text-rose-500 text-[16.5px] font-sans font-bold flex items-center gap-1 mt-1"><AlertOctagon size={12}/> AI Inspector: พบผู้เสนอราคารายเดียวใน 3 ไตรมาสหลังสุด (ความเสี่ยงล็อกสเปก)</p>
                </div>

                <div className="w-full h-px bg-slate-100 my-6"></div>

                <p className="font-bold mb-2">2. รายการพัสดุ: หม้อแปลง 100 kVA 3Ph</p>
                <div className="pl-4 space-y-2">
                  <p>รหัสวัสดุ: 10066</p>
                  <p>จำนวนที่ต้องการ: 300 เครื่อง</p>
                  <p className="flex items-center gap-2">
                    ราคากลางอ้างอิง: 
                    <span className="bg-amber-100 text-amber-800 font-bold px-1 rounded flex items-center gap-1 ring-1 ring-amber-300">
                      85,000 บาท/เครื่อง <Search size={14} className="text-amber-600" />
                    </span>
                  </p>
                  <p className="text-amber-600 text-[16.5px] font-sans font-bold flex items-center gap-1 mt-1"><AlertTriangle size={12}/> AI Inspector: ต่ำกว่าราคาตลาดปัจจุบัน (120,500 บาท) เสี่ยงต่อการประมูลล้มเหลว</p>
                </div>
              </div>
            </div>

            {/* Redflag Cards Pane */}
            <div className="w-full lg:w-[450px] xl:w-[500px] flex flex-col gap-4">
              <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity">
                  <AlertOctagon size={80} className="text-rose-600" />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16.5px] font-extrabold text-slate-800">Spec Lock Detection</h3>
                    <p className="text-[16.5px] text-slate-500 font-medium">ตรวจจับการล็อกสเปกวัสดุ</p>
                  </div>
                  <span className="ml-auto bg-rose-100 text-rose-700 text-[16.5px] font-black px-2 py-0.5 rounded uppercase">Suspicious</span>
                </div>
                
                <div className="bg-white border border-rose-100 rounded-xl p-4 relative z-10 shadow-sm">
                  <p className="text-[16.5px] font-bold text-rose-800 mb-2">Drop Out Fuse (20045)</p>
                  <p className="text-[16.5px] text-slate-600 mb-3 leading-relaxed">
                    AI ตรวจพบการกำหนดสเปกผูกขาด มีเพียง <strong>บจก. นอร์ทเทิร์น กรีน เอ็นเนอร์ยี่</strong> รายเดียวที่ผ่านเกณฑ์ใน 3 ไตรมาสล่าสุด
                  </p>
                  
                  {!isTorReviewed ? (
                    <button 
                      onClick={() => setIsTorReviewed(true)}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[16.5px] font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Search size={14} /> ทบทวน TOR เพื่อเพิ่มการแข่งขัน
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[16.5px] font-bold flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200">
                      <CheckCircle2 size={14} /> ส่งแจ้งเตือนกลับไปยังคณะกรรมการร่าง TOR แล้ว
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity">
                  <Search size={80} className="text-amber-600" />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16.5px] font-extrabold text-slate-800">Price Reference Check</h3>
                    <p className="text-[16.5px] text-slate-500 font-medium">ตรวจราคากลางผิดปกติ</p>
                  </div>
                  <span className="ml-auto bg-amber-100 text-amber-700 text-[16.5px] font-black px-2 py-0.5 rounded uppercase">Anomaly</span>
                </div>
                
                <div className="bg-white border border-amber-100 rounded-xl p-4 relative z-10 shadow-sm">
                  <p className="text-[16.5px] font-bold text-amber-800 mb-2">100 kVA 3Ph (10066)</p>
                  <p className="text-[16.5px] text-slate-600 mb-3 leading-relaxed">
                    งบประมาณ ฿85,000 <span className="text-amber-600 font-bold">ต่ำกว่าตลาด (฿120,500)</span> อย่างมีนัยสำคัญ เสี่ยงประมูลล้ม
                  </p>
                  
                  {!isPriceAdjusted ? (
                    <button 
                      onClick={() => setIsPriceAdjusted(true)}
                      className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[16.5px] font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <AlertTriangle size={14} /> ให้ AI ปรับราคากลางใหม่ (฿121,000)
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[16.5px] font-bold flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200">
                      <CheckCircle2 size={14} /> เสนอขอปรับราคากลางใหม่ (รอ หน.ผก. อนุมัติ)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. AI Autonomy Governance (Human-in-the-loop) */}
      <section className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 className="text-[16.5px] font-extrabold text-slate-800">AI Autonomy \u0026 Approval Gates</h3>
            <p className="text-[16.5px] text-slate-500 font-medium">กลไกควบคุมอำนาจการตัดสินใจของ AI (Human-in-the-loop)</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-100">
          
          {/* Step 1: AI Analyzes */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto bg-white border-2 border-indigo-200 rounded-full flex items-center justify-center mb-3 shadow-sm">
              <span className="text-2xl">🤖</span>
            </div>
            <h4 className="text-[16.5px] font-bold text-slate-800">PEA Brain วิเคราะห์ข้อมูล</h4>
            <p className="text-[16.5px] text-slate-500 mt-1 px-4">สร้างแผนจัดซื้อ, คำนวณ ROP, หาวิธีลดต้นทุน</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center">
            <div className="w-16 h-0.5 bg-slate-300 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
            </div>
          </div>

          {/* Step 2: Gate (Suspended) */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center mb-3 shadow-sm relative">
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[16.5px] font-bold">!</div>
              <ShieldAlert size={24} className="text-amber-500" />
            </div>
            <h4 className="text-[16.5px] font-bold text-amber-800">ระบบระงับการสั่งซื้ออัตโนมัติ</h4>
            <p className="text-[16.5px] text-amber-700/80 mt-1 px-4">ระบบจะไม่ส่งคำสั่งซื้อเองเด็ดขาด สถานะจะถูกล็อกเป็น Pending</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center">
            <div className="w-16 h-0.5 bg-slate-300 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
            </div>
          </div>

          {/* Step 3: Human Action */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto bg-emerald-50 border-2 border-emerald-400 rounded-full flex items-center justify-center mb-3 shadow-sm">
              <UserCheck size={24} className="text-emerald-500" />
            </div>
            <h4 className="text-[16.5px] font-bold text-emerald-800">PO Approval Gate</h4>
            <p className="text-[16.5px] text-emerald-700/80 mt-1 px-4">มนุษย์ (เจ้าหน้าที่/PO) ต้องตรวจสอบและกดยืนยัน (Approve) เท่านั้น</p>
          </div>

        </div>

        <div className="mt-6 bg-purple-50/50 border border-purple-100 rounded-xl p-4 text-center">
          <p className="text-[16.5px] text-purple-900 font-bold">
            "AI เป็นเพียงผู้ช่วยวิเคราะห์ (Copilot) อำนาจอนุมัติและอนุมัติงบประมาณยังคงอยู่ที่บุคลากรของ PEA 100%"
          </p>
        </div>
      </section>

      {/* Modals */}
      {isDraftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileSignature size={20} />
                </div>
                <div>
                  <h3 className="text-[16.5px] font-extrabold text-slate-800">ร่างเอกสารแนบท้าย PCO-2026</h3>
                  <p className="text-[16.5px] text-slate-500 font-medium">Risk Transfer & Liability Caps</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDraftModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-100 flex-1">
              <div className="bg-white p-8 md:p-12 shadow-sm rounded-xl font-serif text-slate-800 space-y-6 max-w-2xl mx-auto border border-slate-200">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-4 opacity-50"><span className="text-[16.5px] font-sans text-slate-500">ครุฑ</span></div>
                  <h4 className="font-bold text-[16.5px]">บันทึกข้อตกลงแนบท้ายสัญญา</h4>
                  <p className="text-[16.5px]">เรื่อง การบริหารจัดการความเสี่ยงและกรรมสิทธิ์ในระบบฝากขาย (Consignment)</p>
                </div>
                <div className="space-y-4 text-[16.5px] leading-relaxed">
                  <p><strong>ข้อ 1. กรรมสิทธิ์และความเสี่ยงภัย</strong></p>
                  <p className="pl-4">คู่สัญญาตกลงให้กรรมสิทธิ์ในพัสดุยังคงเป็นของผู้ขาย จนกว่าผู้ซื้อ (การไฟฟ้าส่วนภูมิภาค) จะได้ทำการเบิกจ่ายและนำออกจากคลังสินค้าของผู้ขาย (Vendor Warehouse) อย่างไรก็ตาม หากเกิดความสูญหายหรือเสียหายในระหว่างการเก็บรักษา ให้เป็นความรับผิดชอบของผู้ขายทั้งสิ้น</p>
                  <p><strong>ข้อ 2. เพดานความรับผิดชอบ (Liability Caps)</strong></p>
                  <p className="pl-4">ในกรณีที่ผู้ขายไม่สามารถส่งมอบพัสดุได้ตาม Lead Time ที่กำหนดผ่านระบบ PCO ผู้ขายยินยอมชดใช้ค่าปรับในอัตรา 0.2% ของมูลค่าพัสดุที่ล่าช้าต่อวัน แต่รวมแล้วไม่เกิน 10% ของมูลค่าสัญญารวม</p>
                  <p><strong>ข้อ 3. การตรวจสอบสต็อกโดย AI</strong></p>
                  <p className="pl-4">ผู้ซื้อขอสงวนสิทธิ์ในการเชื่อมต่อระบบ PEA Brain เพื่อดึงข้อมูลสถานะคลังสินค้าแบบเรียลไทม์ (API Integration) หากพบความเสี่ยงระดับ Critical ผู้ซื้อมีสิทธิ์ปรับเปลี่ยนจุดส่งมอบโดยไม่ต้องแจ้งล่วงหน้าเกิน 24 ชั่วโมง</p>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between text-[16.5px]">
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-400 mb-2"></div>
                    <p>(ผู้มีอำนาจลงนาม กฟภ.)</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-400 mb-2"></div>
                    <p>(ผู้มีอำนาจลงนาม ผู้ขาย)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsDraftModalOpen(false)}
                className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-[16.5px] hover:bg-slate-700 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="text-[16.5px] font-extrabold text-slate-800">Redflag Analysis</h3>
                  <p className="text-[16.5px] text-slate-500 font-medium">อัปโหลดเอกสาร TOR เพื่อให้ AI ตรวจสอบ</p>
                </div>
              </div>
              <button 
                onClick={() => !isUploading && setIsUploadModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors disabled:opacity-50"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {!uploadSuccess ? (
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                    isUploading ? "border-slate-300 bg-slate-50" : "border-rose-300 bg-rose-50/50"
                  }`}
                >
                  {isUploading && (
                    <>
                      <Loader2 size={40} className="text-slate-400 animate-spin mb-4" />
                      <h4 className="text-[16.5px] font-bold text-slate-700">กำลังให้ AI วิเคราะห์เอกสาร...</h4>
                      <p className="text-[16.5px] text-slate-500 mt-2">โปรดรอสักครู่ ระบบกำลังอ่านเงื่อนไขและเทียบเคียงสเปก</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="border-2 border-emerald-200 bg-emerald-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full shadow-md flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-[16.5px] font-extrabold text-emerald-800">วิเคราะห์สำเร็จ!</h4>
                  <p className="text-[16.5px] text-emerald-700 mt-2 font-medium">พบความเสี่ยง Spec Lock 1 รายการ (แสดงผลในตารางด้านล่าง)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
