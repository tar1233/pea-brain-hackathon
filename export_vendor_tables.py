import sys

file_path = "src/app/components/AIVendorStrategyView.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Insert the export functions inside the component
insert_point = "  return ("
export_funcs = """
  const exportVendorCapacity = () => {
    const headers = ["ชื่อผู้ผลิต (Vendor)", "กำลังผลิตจดทะเบียน (Capacity)", "ยอดค้างส่ง (Backlog)", "Reliability Score", "กำลังผลิตสุทธิ (Available)"];
    const rows = processedVendors.map((v: any) => [
      v.name, v.registeredCapacity, v.outstandingPOs, v.reliability, v.availableCapacity
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\\n");
    const blob = new Blob(["\\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "vendor_capacity.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportLotAllocation = () => {
    const strategy = aiResult?.lotStrategy?.strategy || [];
    const headers = ["Lot No.", "ชื่อผู้ผลิต (Vendor)", "จำนวนที่จัดสรร", "เหตุผลการจัดสรร (AI Reason)"];
    const rows = strategy.map((lot: any, idx: number) => [
      idx + 1, lot.vendor, lot.allocation, `"${(lot.reason || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\\n");
    const blob = new Blob(["\\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "lot_allocation.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

"""

if insert_point in content and "exportVendorCapacity" not in content:
    content = content.replace(insert_point, export_funcs + insert_point)

# Add Download button to Vendor Capacity Table
# Find the header of the Vendor Capacity table
old_vendor_header = """        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 p-4 border-b border-slate-200 bg-slate-50">
            <TrendingUp size={18} className="text-emerald-600" />
            <h2 className="text-[16px] font-bold text-slate-800">ข้อมูลศักยภาพผู้ผลิต (Vendor Reliability Database)</h2>
          </div>"""
          
new_vendor_header = """        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              <h2 className="text-[16px] font-bold text-slate-800">ข้อมูลศักยภาพผู้ผลิต (Vendor Reliability Database)</h2>
            </div>
            <button onClick={exportVendorCapacity} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
              <FileText size={14} /> Export CSV
            </button>
          </div>"""
content = content.replace(old_vendor_header, new_vendor_header)

# Add Download button to AI Lot Allocation Table
old_lot_header = """        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 p-4 border-b border-slate-200 bg-slate-50">
            <Brain size={18} className="text-indigo-600" />
            <h2 className="text-[16px] font-bold text-slate-800">แผนกระจายการจัดสรรพัสดุ (AI Lot Allocation)</h2>
          </div>"""
          
new_lot_header = """        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-indigo-600" />
              <h2 className="text-[16px] font-bold text-slate-800">แผนกระจายการจัดสรรพัสดุ (AI Lot Allocation)</h2>
            </div>
            <button onClick={exportLotAllocation} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
              <FileText size={14} /> Export CSV
            </button>
          </div>"""
content = content.replace(old_lot_header, new_lot_header)

with open(file_path, "w") as f:
    f.write(content)
print("Added export buttons to AIVendorStrategyView")

