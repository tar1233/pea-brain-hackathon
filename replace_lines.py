import sys

file_path = "src/app/components/EBiddingView.tsx"
with open(file_path, "r") as f:
    lines = f.readlines()

new_content = """            {/* Financial & Procurement Summary Table (Excel Style) */}
            {(() => {
              const unitPrice = material?.unitPrice || 150000;
              const annualDemand = material?.annualDemand || 800;
              const goodsCost = annualDemand * unitPrice;
              const singleHC = Math.round(goodsCost * 0.20 * 0.5);
              const phasedHC = Math.round(goodsCost * 0.20 * 0.2);
              const singleTCO = goodsCost + singleHC;
              const phasedTCO = goodsCost + phasedHC;
              const savings = singleHC - phasedHC;
              return (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                  <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-600" />
                        ตารางวิเคราะห์ความคุ้มค่าและสรุปข้อมูลจัดหา (Financial & Procurement Summary)
                      </h3>
                      <p className="text-[12px] text-slate-500 mt-1">เปรียบเทียบ TCO และสรุปปัจจัยการจัดหาจาก AI</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-200 text-slate-700 text-[14px]">
                          <th className="p-2 border border-slate-300 font-bold text-center w-[20%]">หมวดหมู่ (Category)</th>
                          <th className="p-2 border border-slate-300 font-bold text-center w-[25%]">หัวข้อการวิเคราะห์ (Analysis Topic)</th>
                          <th className="p-2 border border-slate-300 font-bold text-center w-[55%]">รายละเอียด / มูลค่า (Details / Value)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* AI Insights Section */}
                        <tr className="hover:bg-slate-50 text-[14px] bg-white">
                          <td className="p-2 border border-slate-300 font-bold text-slate-800 align-top bg-slate-50" rowSpan={3}>
                            <div className="flex flex-col items-center gap-2 justify-center h-full pt-4">
                              <Brain size={24} className="text-indigo-600"/> 
                              <span className="text-center">สรุปสถานการณ์<br/>(AI Insights)</span>
                            </div>
                          </td>
                          <td className="p-2 border border-slate-300 font-bold text-blue-700 flex items-center gap-2"><Target size={14}/> ทำไมต้องสั่ง? (Demand)</td>
                          <td className="p-2 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.demandAnalysis}</td>
                        </tr>
                        <tr className="hover:bg-slate-50 text-[14px] bg-white">
                          <td className="p-2 border border-slate-300 font-bold text-amber-700 flex items-center gap-2"><BarChart3 size={14}/> เปิดประมูลเมื่อไหร่? (Market)</td>
                          <td className="p-2 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.marketAnalysis}</td>
                        </tr>
                        <tr className="hover:bg-slate-50 text-[14px] bg-white">
                          <td className="p-2 border border-slate-300 font-bold text-red-700 flex items-center gap-2"><Zap size={14}/> ต้องเริ่มสั่งเมื่อไหร่? (Supplier)</td>
                          <td className="p-2 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.supplierAnalysis}</td>
                        </tr>

                        {/* Financial Section */}
                        <tr className="hover:bg-slate-50 text-[14px] bg-white">
                          <td className="p-2 border border-slate-300 font-bold text-slate-800 align-top bg-slate-50" rowSpan={6}>
                            <div className="flex flex-col items-center gap-2 justify-center h-full pt-8">
                              <TrendingDown size={24} className="text-emerald-600"/> 
                              <span className="text-center">เปรียบเทียบต้นทุนรวม<br/>(TCO & Holding Cost)</span>
                            </div>
                          </td>
                          <td className="p-2 border border-slate-300 font-medium text-slate-700">มูลค่าสินค้ารวม (Total Goods Cost)</td>
                          <td className="p-2 border border-slate-300 text-slate-800 font-medium">฿{goodsCost.toLocaleString()}</td>
                        </tr>
                        <tr className="hover:bg-slate-50 text-[14px] bg-white">
                          <td className="p-2 border border-slate-300 font-medium text-slate-700">Holding Cost: ซื้อทีเดียว (สต็อกเฉลี่ย 50%)</td>
                          <td className="p-2 border border-slate-300 text-red-600 font-medium">฿{singleHC.toLocaleString()}</td>
                        </tr>
                        <tr className="hover:bg-slate-50 text-[14px] bg-white">
                          <td className="p-2 border border-slate-300 font-medium text-slate-700">Holding Cost: ทยอยซื้อ (สต็อกเฉลี่ย 20%)</td>
                          <td className="p-2 border border-slate-300 text-emerald-600 font-medium">฿{phasedHC.toLocaleString()}</td>
                        </tr>
                        <tr className="hover:bg-red-50 text-[14px] bg-red-50/50">
                          <td className="p-2 border border-slate-300 font-bold text-red-800 flex items-center gap-2">🔴 TCO ซื้อทีเดียว (Single Purchase)</td>
                          <td className="p-2 border border-slate-300 text-red-800 font-black">฿{singleTCO.toLocaleString()}</td>
                        </tr>
                        <tr className="hover:bg-emerald-50 text-[14px] bg-emerald-50/50">
                          <td className="p-2 border border-slate-300 font-bold text-emerald-800 flex items-center gap-2">🟢 TCO ทยอยซื้อ 4 รอบ (Phased Purchase)</td>
                          <td className="p-2 border border-slate-300 text-emerald-800 font-black">฿{phasedTCO.toLocaleString()}</td>
                        </tr>
                        <tr className="hover:bg-yellow-50 text-[14px] bg-gradient-to-r from-amber-50 to-yellow-50">
                          <td className="p-2 border border-slate-300 font-bold text-amber-800 flex items-center gap-2">💰 ประหยัดได้ทั้งหมด (Total Savings)</td>
                          <td className="p-2 border border-slate-300 text-amber-700 font-black text-[16px]">฿{savings.toLocaleString()} / ปี</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
"""

# Replace lines 419 to 549 (0-indexed: 418 to 549)
lines[418:549] = [new_content + "\n"]

with open(file_path, "w") as f:
    f.writelines(lines)
