import React from 'react';
import { Shield, AlertTriangle, ArrowRight, Package, Scale, MapPin, Truck, CheckCircle2, TrendingUp, BarChart3, RotateCw } from 'lucide-react';

export default function WarehouseView() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* ── Banner ── */}
      <div className="bg-gradient-to-r from-[#4A108A] to-[#E85C38] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between shadow-lg">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('/power-grid.png')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "screen" }}></div>
        
        <div className="relative z-10 flex flex-col gap-4 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold w-max border border-white/20">
            <Shield className="w-3.5 h-3.5" />
            COMMAND CENTER
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-[22px] font-bold tracking-tight">ความพร้อมคลังโดยรวม</h1>
            <div className="bg-green-500/20 text-green-100 border border-green-400/30 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              พร้อมปฏิบัติงาน 6%
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed max-w-md mt-1">
            ภาพรวมความพร้อมของคลังและระดับความเสี่ยงของสินค้าสำคัญ 
            ควรเร่งดำเนินการตามคำแนะนำเพื่อรักษาระดับความพร้อมของคลังและลดความเสี่ยงการขาดแคลน
          </p>
        </div>

        <div className="relative z-10 flex gap-4 mt-6 lg:mt-0 w-full lg:w-auto">
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 flex flex-col gap-1 min-w-[220px]">
            <div className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">มูลค่าความเสี่ยงรวม</div>
            <div className="text-[22px] font-extrabold tracking-tight leading-none">฿664.3 <span className="text-sm font-bold">ล้าน</span></div>
            <div className="text-white/70 text-xs mt-1">จากความเสี่ยง shortage<br/>และ overstock</div>
            <button onClick={() => document.getElementById('wh-priority')?.scrollIntoView({ behavior: 'smooth' })} className="mt-4 bg-white text-[#A80689] hover:bg-white/90 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 w-max cursor-pointer">
              ดูรายละเอียดความเสี่ยง <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 flex flex-col gap-1 min-w-[220px]">
            <div className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">ช่องว่าง SAFETY STOCK</div>
            <div className="text-[22px] font-extrabold tracking-tight leading-none">5,183 <span className="text-sm font-bold">รายการ</span></div>
            <div className="text-white/70 text-xs mt-1">คิดเป็นมูลค่าประมาณ<br/>฿36.5 ล้าน</div>
            <button className="mt-4 bg-white text-[#A80689] hover:bg-white/90 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 w-max">
              ดูรายการช่องว่าง <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-6 shadow-[0_8px_30px_rgb(220,38,38,0.15)] flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(220,38,38,0.25)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-white">รายการเร่งด่วน</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[22px] font-extrabold text-white tracking-tight">3</span>
            <span className="text-white/80 font-medium ml-1">รายการ</span>
          </div>
          <div className="text-xs text-white/70 mb-4">ต้องตัดสินใจก่อนส่งผลกระทบ</div>
          <div onClick={() => document.getElementById('wh-priority')?.scrollIntoView({ behavior: 'smooth' })} className="mt-auto flex items-center text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-lg w-max hover:bg-white/30 cursor-pointer transition">
            3 Critical <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-700">Coverage เฉลี่ย</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[22px] font-extrabold text-emerald-700 tracking-tight">29%</span>
          </div>
          <div className="text-xs text-gray-500 mb-4">เฉลี่ยเทียบกับ safety stock</div>
          <div className="mt-auto flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-max">
            <TrendingUp className="w-3 h-3 mr-1" /> 8% จากเดือนก่อนหน้า
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Scale className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-700">รอบรับสมดุลสต๊อก</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[22px] font-extrabold text-blue-700 tracking-tight">15</span>
            <span className="text-gray-500 font-medium ml-1">รายการ</span>
          </div>
          <div className="text-xs text-gray-500 mb-4">มูลค่ารวม ฿82.2 ล้าน</div>
          <div onClick={() => document.getElementById('wh-rebalancing')?.scrollIntoView({ behavior: 'smooth' })} className="mt-auto flex items-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg w-max cursor-pointer transition">
            ดูข้อเสนอปรับสมดุล <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-100/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-700">SKU ติดตามสัปดาห์นี้</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[22px] font-extrabold text-orange-700 tracking-tight">42</span>
            <span className="text-gray-500 font-medium ml-1">รายการ</span>
          </div>
          <div className="text-xs text-gray-500 mb-4">ความเสี่ยงปานกลางถึงสูง</div>
          <div onClick={() => document.getElementById('wh-overview')?.scrollIntoView({ behavior: 'smooth' })} className="mt-auto flex items-center text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg w-max cursor-pointer transition">
            ดูรายการติดตาม <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* ── Main Layout: 2 Columns ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-8 mt-2">
        
        {/* Left Column: Top Priority Decisions */}
        <div id="wh-priority" className="flex flex-col gap-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-[15px] font-extrabold text-gray-900 tracking-tight border-l-4 border-l-red-500 pl-3">รายการที่ต้องตัดสินใจก่อน</h2>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-red-500 bg-red-50 px-2.5 py-1.5 rounded-md">3 Critical</span>
              <span onClick={() => alert('แสดงทั้งหมด 6 รายการ (Demo Phase 2)')} className="text-[#A80689] cursor-pointer hover:underline flex items-center">ดูทั้งหมด <ArrowRight className="w-3 h-3 ml-1" /></span>
            </div>
          </div>

          {/* Alert Card 1 */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border-l-4 border-l-red-500">
            <div className="flex justify-between items-start mb-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center font-bold text-base shrink-0">1</div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-gray-900 text-[16px] tracking-tight">MAT-10066</h3>
                    <span className="bg-red-50 text-red-500 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">ขาดแคลน</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">หม้อแปลง 100 kVA (3 เฟส)</div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50/70 rounded-2xl p-4 mb-5 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-bold text-gray-900">สต๊อกเหลือ 8 เครื่อง ต่ำกว่า Safety Stock 320 เครื่อง</div>
                <div className="text-sm font-semibold text-red-500 mt-1">(ขาด 312 เครื่อง หรือ 86%)</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> มูลค่าความเสี่ยง</span>
                <span className="text-[13px] font-extrabold text-gray-800">฿13.8 ล้าน</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> พื้นที่</span>
                <span className="text-[13px] font-extrabold text-gray-800">คลังอยุธยา</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><RotateCw className="w-3.5 h-3.5" /> Lead time</span>
                <span className="text-[13px] font-extrabold text-gray-800">12 สัปดาห์</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Confidence</span>
                <span className="text-[13px] font-extrabold text-gray-800">91%</span>
              </div>
            </div>

            <div className="bg-[#FFF9F2] rounded-2xl p-5 flex justify-between items-center">
              <div>
                <div className="text-[11px] font-bold text-orange-500 uppercase tracking-wider mb-1.5">คำแนะนำ AI Copilot</div>
                <div className="text-[14px] font-extrabold text-gray-900">สั่งซื้อเพิ่ม 315 เครื่อง</div>
                <div className="text-sm text-gray-500 mt-0.5">ภายในสัปดาห์นี้</div>
              </div>
              <div className="flex flex-col gap-3 items-end">
                <button 
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("create-po", { 
                      detail: { 
                        materialId: "MAT-10066", 
                        qty: 315, 
                        name: "หม้อแปลง 100 kVA (3 เฟส)",
                        price: 127900
                      } 
                    }));
                  }}
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  สร้าง PO <ArrowRight className="w-4 h-4" />
                </button>
                <span onClick={() => alert('📝 MAT-10066: สั่งซื้อเพิ่ม 315 เครื่อง จาก Vendor A01 (โรงงานอยุธยา)\n\nเหตุผล: สต๊อกเหลือ 8 เครื่อง ต่ำกว่า Safety Stock 320 เครื่อง\nมูลค่าความเสี่ยง: ฿13.8 ล้าน\nLead time: 12 สัปดาห์\nConfidence: 91%')} className="text-xs font-bold text-[#A80689] cursor-pointer hover:underline">ดูรายละเอียด <ArrowRight className="inline w-3 h-3" /></span>
              </div>
            </div>
          </div>

          {/* Alert Card 2 */}
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border-l-4 border-l-amber-500">
            <div className="flex justify-between items-start mb-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shrink-0">2</div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-gray-900 text-[16px] tracking-tight">CT-400/5A</h3>
                    <span className="bg-orange-50 text-orange-500 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">เสี่ยงเกิน</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">หม้อแปลงกระแส 400/5A</div>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50/70 rounded-2xl p-4 mb-5 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-bold text-gray-900">สต๊อกเกินกว่า Safety Stock 120 ตัว</div>
                <div className="text-sm font-semibold text-orange-500 mt-1">(มูลค่าส่วนเกิน ฿4.2 ล้าน)</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> มูลค่าส่วนเกิน</span>
                <span className="text-[13px] font-extrabold text-gray-800">฿4.2 ล้าน</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> พื้นที่</span>
                <span className="text-[13px] font-extrabold text-gray-800">คลังชลบุรี</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><RotateCw className="w-3.5 h-3.5" /> Lead time</span>
                <span className="text-[13px] font-extrabold text-gray-800">8 สัปดาห์</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Confidence</span>
                <span className="text-[13px] font-extrabold text-gray-800">76%</span>
              </div>
            </div>

            <div className="bg-[#FFF9F2] rounded-2xl p-5 flex justify-between items-center">
              <div>
                <div className="text-[11px] font-bold text-orange-500 uppercase tracking-wider mb-1.5">คำแนะนำ AI Copilot</div>
                <div className="text-[14px] font-extrabold text-gray-900">ชะลอการสั่งซื้อ และโอนย้าย</div>
                <div className="text-sm text-gray-500 mt-0.5">ไปคลังเชียงใหม่</div>
              </div>
              <div className="flex flex-col gap-3 items-end">
                <button onClick={() => alert('🚚 แผนโอนย้าย CT-400/5A\n\nต้นทาง: คลังชลบุรี → คลังเชียงใหม่\nจำนวน: 120 ตัว\nประหยัดค่าส่วนเกิน: ฿4.2 ล้าน\n\nส่งใบโอนย้ายไปยัง SAP (Demo Phase 2)')} className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer">
                  ดูแผนโอนย้าย <ArrowRight className="w-4 h-4" />
                </button>
                <span onClick={() => alert('📝 CT-400/5A: ชะลอการสั่งซื้อ โอนย้าย 120 ตัว ไปคลังเชียงใหม่\n\nเหตุผล: สต๊อกเกิน Safety Stock 120 ตัว\nมูลค่าส่วนเกิน: ฿4.2 ล้าน\nLead time: 8 สัปดาห์\nConfidence: 76%')} className="text-xs font-bold text-[#A80689] cursor-pointer hover:underline">ดูรายละเอียด <ArrowRight className="inline w-3 h-3" /></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Warehouse Table & Rebalancing */}
        <div className="flex flex-col gap-4">
          <div id="wh-overview" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#A80689]" />
                <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">ภาพรวมคลัง</h2>
              </div>
              <span onClick={() => alert('🗺️ แผนที่คลัง: อยุธยา, ชลบุรี, เชียงใหม่, ขอนแก่น (Demo Phase 2)')} className="text-xs font-bold text-[#A80689] cursor-pointer hover:underline flex items-center">ดูแผนที่คลัง <ArrowRight className="w-3 h-3 ml-1" /></span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100/50">
                    <th className="pb-3 font-semibold">คลัง / พื้นที่</th>
                    <th className="pb-3 font-semibold text-center w-28">ความพร้อม (Coverage)</th>
                    <th className="pb-3 font-semibold text-center">สถานะความเสี่ยง</th>
                    <th className="pb-3 font-semibold text-right">มูลค่าความเสี่ยง</th>
                    <th className="pb-3 font-semibold text-center">ข้อเสนอแนะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-semibold text-gray-800 text-xs">คลังอยุธยา <span className="text-gray-400 font-normal">(ภาคกลาง)</span></td>
                    <td className="py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-bold text-gray-700 text-xs w-8 text-right">25%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">12</span>
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">3</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-bold text-gray-700 text-xs">฿198.6 ล้าน</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-[#A80689] bg-purple-50 px-2.5 py-1 rounded-md">จัดหาเพิ่ม</span></td>
                  </tr>
                  
                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-semibold text-gray-800 text-xs">คลังชลบุรี <span className="text-gray-400 font-normal">(ภาคตะวันออก)</span></td>
                    <td className="py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-bold text-gray-700 text-xs w-8 text-right">41%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: '41%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">5</span>
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">2</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-bold text-gray-700 text-xs">฿82.2 ล้าน</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-[#A80689] bg-fuchsia-50 px-2.5 py-1 rounded-md">โอนย้ายออก</span></td>
                  </tr>

                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-semibold text-gray-800 text-xs">คลังเชียงใหม่ <span className="text-gray-400 font-normal">(ภาคเหนือ)</span></td>
                    <td className="py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-bold text-gray-700 text-xs w-8 text-right">72%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">1</span>
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">4</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-bold text-gray-700 text-xs">฿24.5 ล้าน</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-[#A80689] bg-fuchsia-50 px-2.5 py-1 rounded-md">รับโอนย้าย</span></td>
                  </tr>

                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-semibold text-gray-800 text-xs">คลังนครราชสีมา <span className="text-gray-400 font-normal">(ภาคอีสาน)</span></td>
                    <td className="py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-bold text-gray-700 text-xs w-8 text-right">68%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">2</span>
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">1</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-bold text-gray-700 text-xs">฿15.7 ล้าน</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">คงสต๊อก</span></td>
                  </tr>

                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-semibold text-gray-800 text-xs">คลังสุราษฎร์ธานี <span className="text-gray-400 font-normal">(ภาคใต้)</span></td>
                    <td className="py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-bold text-gray-700 text-xs w-8 text-right">54%</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: '54%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">1</span>
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md w-5 text-center">2</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-bold text-gray-700 text-xs">฿13.3 ล้าน</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">ปรับสมดุล</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center gap-4 mt-4 text-[10px] font-medium text-gray-500 border-t border-gray-100/50 pt-5">
              <span className="font-semibold text-gray-600">Risk Cluster:</span>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> ขาดแคลน (Shortage)</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> สต๊อกเกิน (Overstock)</div>
            </div>
          </div>

          {/* Rebalancing Suggestions */}
          <div id="wh-rebalancing" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 mt-1 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-[14px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-[#A80689]" />
                ข้อเสนอแนะการปรับสมดุลสต๊อก <span className="text-gray-400 font-normal">(Rebalancing Suggestions)</span>
              </h2>
              <span onClick={() => alert('ข้อเสนอแนะปรับสมดุลทั้งหมด 15 รายการ มูลค่ารวม ฿82.2 ล้าน (Demo Phase 2)')} className="text-xs font-bold text-gray-400 hover:text-[#A80689] cursor-pointer flex items-center transition">ดูทั้งหมด <ArrowRight className="w-3 h-3 ml-1" /></span>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              {/* Transfer 1 */}
              <div className="bg-[#FCFBFF] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-purple-50/30 transition-colors duration-300">
                <div className="flex items-center gap-6 flex-1 w-full justify-between">
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">จาก คลังชลบุรี</span>
                    <span className="text-sm font-extrabold text-[#A80689]">โอนย้าย 80 เครื่อง</span>
                    <span className="text-[10px] font-bold text-gray-700 bg-white shadow-sm px-2 py-1 rounded-md mt-1.5 w-max">CT-400/5A</span>
                  </div>
                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-[#A80689]" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">ไป คลังเชียงใหม่</span>
                    <span className="text-sm font-extrabold text-gray-900">ภายใน 2 วัน</span>
                  </div>
                </div>
                <div className="hidden md:block w-px h-16 bg-gray-100 mx-2"></div>
                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                  <span className="text-[10px] text-gray-500 font-medium mb-2">คาดว่าจะลดผลกระทบได้ <span className="font-extrabold text-gray-800 text-[11px]">฿2.8 ล้าน</span></span>
                  <button className="bg-gradient-to-r from-[#A80689] to-[#7b0365] hover:from-[#8D06A8] hover:to-[#5e024d] text-white w-full px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all">
                    อนุมัติการโอนย้าย
                  </button>
                </div>
              </div>

              {/* Transfer 2 */}
              <div className="bg-purple-50/40 rounded-xl p-4 border border-purple-100/50 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-sm transition">
                <div className="flex items-center gap-6 flex-1 w-full justify-between">
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-gray-500 font-medium mb-0.5">จาก คลังชลบุรี</span>
                    <span className="text-sm font-extrabold text-[#A80689]">โอนย้าย 50 เครื่อง</span>
                    <span className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-1.5 py-0.5 rounded mt-1.5 w-max">LA-22kV</span>
                  </div>
                  <div className="flex flex-col items-center justify-center px-4">
                    <Truck className="w-6 h-6 text-purple-300" />
                    <div className="h-px w-8 bg-purple-200 mt-1"></div>
                  </div>
                  <div className="flex flex-col flex-1 text-right">
                    <span className="text-[10px] text-gray-500 font-medium mb-0.5">ไป คลังอยุธยา</span>
                    <span className="text-sm font-extrabold text-gray-800">ภายใน 3 วัน</span>
                  </div>
                </div>
                <div className="hidden md:block w-px h-12 bg-purple-100 mx-2"></div>
                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                  <span className="text-[10px] text-gray-500 font-medium mb-1.5">คาดว่าจะลดผลกระทบได้ <span className="font-bold text-gray-700">฿3.1 ล้าน</span></span>
                  <button className="bg-[#A80689] hover:bg-purple-800 text-white w-full px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition">
                    อนุมัติการโอนย้าย
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
