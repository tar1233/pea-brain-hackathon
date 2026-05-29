import sys

file_path = "src/app/components/ProcurementPlanTable.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Insert the exportToCSV function inside the component
insert_point = "  const dynamicBiddingData ="
export_func = """
  const exportToCSV = () => {
    // Basic CSV generation for Procurement Plan
    const headers = [
      "ลำดับ", "รหัสพัสดุ", "เลขที่ประมูล", "รหัสโครงการ", "จำนวน", "ราคาต่อหน่วย", "ราคามาตรฐาน", "งบประมาณ", 
      "คาดการณ์คงคลัง", "สถานะประกวดราคา", "สถานะสัญญา", "กำลังผลิตขั้นต่ำ", "กำลังผลิตรวม", "Demand/เดือน",
      "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."
    ];
    
    const rows = dynamicBiddingData.map(row => [
      row.id, row.code, row.bidNo, row.projectCode, row.qty, row.unitPrice, row.standardPrice, row.totalBudget,
      row.stockForecast, row.biddingStage, row.contractStage, row.minCapacity, row.maxCapacity, row.monthlyDemand,
      row.schedule.oct, row.schedule.nov, row.schedule.dec, row.schedule.jan, row.schedule.feb, row.schedule.mar,
      row.schedule.apr, row.schedule.may, row.schedule.jun, row.schedule.jul, row.schedule.aug, row.schedule.sep
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\\n");
    
    // Add BOM for UTF-8 Excel compatibility
    const blob = new Blob(["\\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `procurement_plan_${materialId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

"""

if insert_point in content and "exportToCSV" not in content:
    content = content.replace(insert_point, export_func + insert_point)
    
    # Attach to button
    content = content.replace(
        '<button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[14px] font-medium shadow-sm">',
        '<button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[14px] font-medium shadow-sm cursor-pointer">'
    )
    
    with open(file_path, "w") as f:
        f.write(content)
    print("Added exportToCSV to ProcurementPlanTable")
else:
    print("Could not find insert point or exportToCSV already exists")

