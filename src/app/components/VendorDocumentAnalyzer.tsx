"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertTriangle, Sparkles, Send, FileSpreadsheet, Brain, Zap, Clock, ShieldAlert } from "lucide-react";

export default function VendorDocumentAnalyzer({ materialName }: { materialName: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "done">("idle");
  const [showEmail, setShowEmail] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === "idle") startAnalysis();
  };

  const startAnalysis = () => {
    setStatus("uploading");
    setTimeout(() => setStatus("analyzing"), 1200);
    setTimeout(() => setStatus("done"), 4000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden mt-8 mb-8">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <ShieldAlert className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 text-[16.5px]">Vendor Collaboration & Risk Analysis</h3>
            <p className="text-[16.5px] text-indigo-600 font-medium">พื้นที่ทำงานร่วมกับคู่ค้า • ให้ AI ช่วยอ่านสัญญาและแผนส่งมอบ</p>
          </div>
        </div>
        {status === "done" && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[16.5px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} /> AI Analyzed
          </span>
        )}
      </div>

      <div className="p-6">
        {status === "idle" && (
          <div 
            className="border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center bg-indigo-50/30 hover:bg-indigo-50/80 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={startAnalysis}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Upload className="text-indigo-500" size={28} />
            </div>
            <h4 className="text-[16.5px] font-bold text-indigo-900 mb-2">ลากไฟล์ใบเสนอราคา / แผนส่งมอบ (PDF, Excel) มาวางที่นี่</h4>
            <p className="text-[16.5px] text-slate-500 max-w-md mx-auto">
              PEA Brain จะช่วยดึงข้อมูลราคา เงื่อนไขสัญญา และแผนการส่งมอบ มาเทียบกับความต้องการของ กฟภ. เพื่อหาความเสี่ยงทันที
            </p>
            <div className="mt-6 flex justify-center gap-4 text-[16.5px] text-slate-400 font-medium">
              <span className="flex items-center gap-1"><FileText size={14} /> Contract.pdf</span>
              <span className="flex items-center gap-1"><FileSpreadsheet size={14} /> DeliveryPlan.xlsx</span>
            </div>
          </div>
        )}

        {(status === "uploading" || status === "analyzing") && (
          <div className="py-16 text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                {status === "uploading" ? <Upload className="text-indigo-600 animate-bounce" /> : <Brain className="text-indigo-600 animate-pulse" size={32} />}
              </div>
            </div>
            <div>
              <h4 className="text-[16.5px] font-bold text-indigo-900">
                {status === "uploading" ? "กำลังอัปโหลดเอกสาร..." : "AI กำลังอ่านและวิเคราะห์ข้อมูลจากเอกสาร Vendor..."}
              </h4>
              <p className="text-[16.5px] text-slate-500 mt-2">
                {status === "uploading" ? "100% เสร็จสิ้น" : "สกัดเงื่อนไขสัญญา • ตรวจสอบราคากลาง • เปรียบเทียบแผนส่งมอบกับพื้นที่คลัง"}
              </p>
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left: Vendor Document View */}
              <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden flex flex-col">
                <div className="bg-slate-200/50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  <span className="text-[16.5px] font-bold text-slate-700">Vendor_Delivery_Plan_2026.xlsx</span>
                </div>
                <div className="p-4 flex-1 text-[16.5px] text-slate-600 font-mono">
                  <table className="w-full text-left bg-white border border-slate-200">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 border-b">งวดที่</th>
                        <th className="p-2 border-b">วันที่ส่งมอบ (Vendor)</th>
                        <th className="p-2 border-b">จำนวน (เครื่อง)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b">1</td>
                        <td className="p-2 border-b font-bold text-red-600 bg-red-50">15 ส.ค. 2569 (ล่าช้า)</td>
                        <td className="p-2 border-b">50</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">2</td>
                        <td className="p-2 border-b">15 ก.ย. 2569</td>
                        <td className="p-2 border-b">100</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b">3</td>
                        <td className="p-2 border-b font-bold text-amber-600 bg-amber-50">15 ต.ค. 2569</td>
                        <td className="p-2 border-b font-bold text-amber-600 bg-amber-50">300 (Overstock)</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-4 bg-white p-3 border border-slate-200">
                    <div className="font-bold text-slate-800 mb-1 border-b pb-1">เงื่อนไขสัญญา (Terms)</div>
                    <ul className="list-disc pl-4 space-y-1 mt-2 text-slate-500">
                      <li>ราคาต่อหน่วย: ฿152,000 (ไม่รวม VAT)</li>
                      <li>เงื่อนไขชำระเงิน: เครดิต 30 วัน</li>
                      <li className="text-red-500 font-bold">*ค่าปรับล่าช้า: ไม่ระบุ (N/A)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: AI Analysis & Recommendation */}
              <div className="flex flex-col gap-4">
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="text-red-600" size={18} />
                    <h4 className="font-bold text-red-900 text-[16.5px]">ความเสี่ยงที่ AI ตรวจพบ (Risk Detected)</h4>
                  </div>
                  <ul className="space-y-3 text-[16.5px] text-red-800 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span><strong className="text-red-900">แผนส่งมอบงวด 1 ล่าช้า 15 วัน:</strong> จะทำให้ของขาดสต็อกในเขต กฟน.1 (VaR: ฿2.5M)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span><strong className="text-red-900">Overstock งวดที่ 3:</strong> ส่งมอบพร้อมกัน 300 เครื่อง จะทำให้พื้นที่คลัง กฟภ. ล้นเกินพิกัด 120% (Holding Cost เพิ่ม ฿1.2M)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">•</span>
                      <span><strong className="text-red-900">สัญญามีช่องโหว่:</strong> Vendor ไม่ได้ระบุเปอร์เซ็นต์ค่าปรับกรณีส่งมอบล่าช้า</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-indigo-600" size={18} />
                    <h4 className="font-bold text-indigo-900 text-[16.5px]">คำแนะนำจาก AI (Action Required)</h4>
                  </div>
                  <p className="text-[16.5px] text-indigo-800 leading-relaxed mb-4">
                    เพื่อป้องกันของขาดและสต็อกล้นคลัง แนะนำให้เจรจาปรับแผน (Reschedule) งวดที่ 1 ให้เร็วขึ้น และกระจายงวดที่ 3 ออกเป็น 2 งวดย่อย รวมถึงบังคับใส่เงื่อนไขค่าปรับ 0.2% ต่อวัน
                  </p>
                  <button 
                    onClick={() => setShowEmail(true)}
                    disabled={showEmail}
                    className={`w-full py-2.5 rounded-xl text-[16.5px] font-bold flex items-center justify-center gap-2 transition-all ${
                      showEmail ? 'bg-indigo-200 text-indigo-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 cursor-pointer'
                    }`}
                  >
                    <Zap size={16} /> ให้ AI ร่าง Email เจรจาต่อรอง
                  </button>
                </div>
              </div>
            </div>

            {/* Email Draft Section */}
            {showEmail && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                  <h4 className="font-bold text-slate-800 text-[16.5px] flex items-center gap-2">
                    <Send size={16} className="text-emerald-600" />
                    ร่างจดหมายอิเล็กทรอนิกส์ (Draft Email)
                  </h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-[16.5px] font-bold uppercase tracking-widest">
                    Generated by PEA Brain
                  </span>
                </div>
                
                <div className="space-y-3 text-[16.5px] text-slate-700">
                  <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                    <span className="font-semibold text-slate-500 text-right">To:</span>
                    <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg">sales@thaitransformer.co.th</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                    <span className="font-semibold text-slate-500 text-right">Subject:</span>
                    <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold">ขอปรับปรุงแผนจัดส่งและเงื่อนไขสัญญา {materialName}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-2 items-start mt-2">
                    <span className="font-semibold text-slate-500 text-right pt-2">Message:</span>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-lg leading-relaxed font-sans whitespace-pre-line">
                      เรียน ทีมงานฝ่ายขาย บริษัท ร่วมค้าผู้ผลิตหม้อแปลงไฟฟ้าไทย จำกัด,
                      
                      จากการตรวจสอบแผนการส่งมอบพัสดุ {materialName} กฟภ. ขอเสนอให้มีการปรับปรุงแผนดังนี้เพื่อความสอดคล้องกับพื้นที่คลัง:
                      
                      1. **ขอเลื่อนงวดที่ 1** จากวันที่ 15 ส.ค. 2569 เป็นวันที่ 1 ส.ค. 2569 (เนื่องจากระดับความต้องการเร่งด่วน)
                      2. **ขอแยกงวดที่ 3** (300 เครื่อง) ออกเป็น 2 งวดย่อย (งวดละ 150 เครื่อง ห่างกัน 15 วัน) เพื่อไม่ให้เกินความจุกระทบของพื้นที่คลังส่วนกลาง
                      3. **เงื่อนไขค่าปรับ:** ขอให้ระบุค่าปรับในกรณีส่งมอบล่าช้าที่อัตรา 0.2% ต่อวันของมูลค่าสินค้าที่ส่งมอบล่าช้า ตามระเบียบ กฟภ.
                      
                      รบกวนพิจารณาและส่งแผนฉบับแก้ไขกลับมาภายใน 3 วันทำการ
                      
                      ขอแสดงความนับถือ,
                      แผนกจัดหาพัสดุ
                      การไฟฟ้าส่วนภูมิภาค
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end gap-3">
                  <button className="px-5 py-2 rounded-xl text-[16.5px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    แก้ไขข้อความ (Edit)
                  </button>
                  <button className="px-5 py-2 rounded-xl text-[16.5px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-colors flex items-center gap-2 cursor-pointer">
                    <Send size={14} /> ส่ง Email ทันที
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
