import sys

file_path = "src/app/components/EBiddingView.tsx"
with open(file_path, "r") as f:
    content = f.read()

import re

# We will use regex or string replace.
# Let's find the start and end indices.
start_str = "            {/* Two Plans Side by Side */}"
end_str = "              </div>\n            )}\n\n            {/* Raw AI Response */}"

start_idx = content.find(start_str)
end_idx = content.find("{/* Raw AI Response */}")

if start_idx == -1 or end_idx == -1:
    print("Could not find start or end strings")
    sys.exit(1)

new_content = """            {/* Two Plans Comparison Table (Excel Style) */}
            {!readonly && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                      <Target size={18} className="text-indigo-600" />
                      ตารางเปรียบเทียบแผนการจัดหา (Procurement Strategy Comparison)
                    </h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-700 text-[14px]">
                        <th className="p-3 border border-slate-300 font-bold text-center w-[20%]">หัวข้อการประเมิน<br/>(Evaluation Criteria)</th>
                        <th className="p-3 border border-slate-300 font-bold text-center w-[40%] bg-emerald-100 text-emerald-800">
                          <div className="flex items-center justify-center gap-1.5 mb-1"><CheckCircle2 size={16}/> AI แนะนำ</div>
                          Plan A: {aiResult.planA.title}
                        </th>
                        <th className="p-3 border border-slate-300 font-bold text-center w-[40%]">
                          Plan B: {aiResult.planB.title}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-slate-50 text-[13px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">จำนวน และ มูลค่ารวม</td>
                        <td className="p-3 border border-slate-300 font-bold text-emerald-700 bg-emerald-50/30">
                          {aiResult.planA.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planA.qty * (material?.unitPrice || 0))}
                        </td>
                        <td className="p-3 border border-slate-300 font-medium text-slate-600">
                          {aiResult.planB.qty.toLocaleString()} {material?.unit} • {formatCurrency(aiResult.planB.qty * (material?.unitPrice || 0))}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[13px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">🔮 ถ้าเลือกแผนนี้ อนาคตจะเป็นยังไง?</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.futureImpact}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.futureImpact}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[13px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">📦 สต็อกอยู่ได้อีกกี่เดือน?</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.supplyForecast}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.supplyForecast}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[13px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">💰 วิเคราะห์ต้นทุน & ความคุ้มค่า</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.costAnalysis}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.costAnalysis}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[13px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-amber-700 bg-amber-50">⚠️ สถานการณ์เลวร้ายที่อาจเกิด</td>
                        <td className="p-3 border border-slate-300 text-amber-900 bg-amber-50/50 leading-relaxed">{aiResult.planA.riskScenarios}</td>
                        <td className="p-3 border border-slate-300 text-red-900 bg-red-50/50 leading-relaxed">{aiResult.planB.riskScenarios}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[13px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">🛡️ วิธีรับมือเมื่อเกิดความเสี่ยง</td>
                        <td className="p-3 border border-slate-300 text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.mitigation}</td>
                        <td className="p-3 border border-slate-300 text-slate-700 leading-relaxed">{aiResult.planB.mitigation}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-[13px] bg-white">
                        <td className="p-3 border border-slate-300 font-bold text-slate-700 bg-slate-50">✅ ปัญหาจบไหม?</td>
                        <td className="p-3 border border-slate-300 font-semibold text-emerald-900 bg-emerald-50/30 leading-relaxed">{aiResult.planA.problemResolved}</td>
                        <td className="p-3 border border-slate-300 font-semibold text-slate-800 leading-relaxed">{aiResult.planB.problemResolved}</td>
                      </tr>
                      {/* Action Buttons Row */}
                      <tr className="bg-slate-50">
                        <td className="p-4 border border-slate-300 font-bold text-slate-700 text-center">การตัดสินใจ (Decision)</td>
                        <td className="p-4 border border-slate-300 text-center bg-emerald-50/50">
                          <button 
                            disabled={loadingPlan !== null}
                            onClick={() => {
                              setLoadingPlan('A');
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan A: ${aiResult.planA.title}`, action: aiResult.planA.futureImpact, qty: aiResult.planA.qty, risk: aiResult.planA.riskScenarios, financial: aiResult.planA.costAnalysis, supplyForecast: aiResult.planA.supplyForecast, mitigation: aiResult.planA.mitigation, unitPrice: material?.unitPrice || 0 } }));
                                if (onClose) onClose();
                                setTimeout(() => setActiveTab?.("activity"), 300);
                              }, 1000);
                            }}
                            className="inline-flex items-center justify-center w-full max-w-xs gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[13px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {loadingPlan === 'A' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} 
                            {loadingPlan === 'A' ? "กำลังดำเนินการ..." : "เลือกแผน A → วางแผนจัดซื้อ"}
                          </button>
                        </td>
                        <td className="p-4 border border-slate-300 text-center">
                          <button 
                            disabled={loadingPlan !== null}
                            onClick={() => {
                              setLoadingPlan('B');
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent("approve-plan", { detail: { materialId: targetMaterialId, materialName: material?.name || targetMaterialId, planName: `Plan B: ${aiResult.planB.title}`, action: aiResult.planB.futureImpact, qty: aiResult.planB.qty, risk: aiResult.planB.riskScenarios, financial: aiResult.planB.costAnalysis, supplyForecast: aiResult.planB.supplyForecast, mitigation: aiResult.planB.mitigation, unitPrice: (material?.unitPrice || 150000) * 1.15 } }));
                                if (onClose) onClose();
                                setTimeout(() => setActiveTab?.("activity"), 300);
                              }, 1000);
                            }}
                            className="inline-flex items-center justify-center w-full max-w-xs gap-2 rounded-xl bg-slate-200 border border-slate-300 px-5 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {loadingPlan === 'B' ? <Loader2 size={16} className="animate-spin text-amber-600" /> : <AlertTriangle size={16} className="text-amber-600" />}
                            {loadingPlan === 'B' ? "กำลังดำเนินการ..." : "เลือก Plan B"}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Raw AI Response */}"""

final_content = content[:start_idx] + new_content + content[end_idx+26:]

with open(file_path, "w") as f:
    f.write(final_content)
