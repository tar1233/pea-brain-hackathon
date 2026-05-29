import sys

file_path = "src/app/components/EBiddingView.tsx"
with open(file_path, "r") as f:
    content = f.read()

# We want to move <AIVendorStrategyView aiResult={aiResult} material={material} />
# to AFTER the "Two Plans Comparison Table (Excel Style)"

target = "<AIVendorStrategyView aiResult={aiResult} material={material} />"

if target in content:
    content = content.replace(target, "")
    
    # Find the end of the Two Plans Comparison Table
    end_of_table = "              </div>\n            )}\n\n            {/* Raw AI Response */}"
    
    if end_of_table in content:
        new_insertion = """              </div>
            )}

            {/* Detailed Execution Plan for Plan A (AI Recommended) */}
            <div className="mt-8 mb-4">
              <div className="flex items-center gap-2 px-2 border-l-4 border-indigo-500 mb-2">
                <h2 className="text-lg font-bold text-slate-800">รายละเอียดแผนงานที่ AI แนะนำ (Plan A Execution Details)</h2>
              </div>
              <p className="text-[13px] text-slate-500 px-2 mb-4">ข้อมูลเชิงลึกด้านศักยภาพผู้ผลิต แผนการจัดสรรโควต้า (Lot Allocation) และร่างเงื่อนไข TOR เพื่อลดความเสี่ยง</p>
              <AIVendorStrategyView aiResult={aiResult} material={material} />
            </div>

            {/* Raw AI Response */}"""
        content = content.replace(end_of_table, new_insertion)
        
        with open(file_path, "w") as f:
            f.write(content)
        print("Rearranged AIVendorStrategyView successfully.")
    else:
        print("Could not find end of table.")
else:
    print("Could not find target component.")

