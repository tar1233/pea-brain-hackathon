import sys

file_path = "src/app/components/AIVendorStrategyView.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_tor_header = """      {/* Draft TOR (Moved to bottom for horizontal layout) */}
      <div className="mt-6 max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-bold flex items-center gap-2 text-amber-600">
            <FileText size={18} />
            Draft TOR Conditions
          </h2>"""

new_tor_header = """      {/* Draft TOR (Moved to bottom for horizontal layout) */}
      <div className="mt-6 w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-amber-600" />
              ร่างเงื่อนไขและข้อกำหนด TOR (Draft TOR Conditions)
            </h3>
            <p className="text-[12px] text-slate-500 mt-1">ข้อกำหนดสำหรับการจัดสรรโควต้าตามความสามารถของผู้ผลิต</p>
          </div>"""

if old_tor_header in content:
    content = content.replace(old_tor_header, new_tor_header)
    content = content.replace('<button onClick={copyToClipboard} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" title="Copy TOR">', '<button onClick={copyToClipboard} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-white p-2 rounded-lg border border-slate-200 shadow-sm" title="คัดลอกร่าง TOR">')
    # Change the inner box
    content = content.replace('<div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner">', '<div className="p-5">')
    # Update the notice text
    content = content.replace('<div className="mt-4 flex items-start gap-2 text-xs text-amber-700/80 font-medium">', '<div className="px-5 pb-5 flex items-start gap-2 text-xs text-amber-700/80 font-medium">')
    
    with open(file_path, "w") as f:
        f.write(content)
    print("Updated Draft TOR")
else:
    print("Could not find Draft TOR header")

