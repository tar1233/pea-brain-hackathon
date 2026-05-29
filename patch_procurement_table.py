import sys

file_path = "src/app/components/ProcurementPlanTable.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace the component signature
old_sig = "export default function ProcurementPlanTable({ materialId, materialName }: { materialId: string, materialName: string }) {"
new_sig = "export default function ProcurementPlanTable({ materialId, materialName, material }: { materialId: string, materialName: string, material?: any }) {"

if old_sig in content:
    content = content.replace(old_sig, new_sig)

# We need to insert dynamic data calculation
insert_point = "  return ("
dynamic_code = """
  // Dynamically adjust mock data based on actual material to ensure consistency
  const dynamicBiddingData = material ? mockBiddingData.map((row) => {
    // Total mock qty is 2620 (1150 + 1470)
    const ratio = row.qty / 2620;
    const newQty = Math.round((material.annualDemand || 2620) * ratio);
    const newUnitPrice = material.unitPrice || row.unitPrice;
    
    // adjust schedule proportionally
    const s = row.schedule;
    const newSchedule = {
      oct: Math.round(s.oct * ratio), nov: Math.round(s.nov * ratio), dec: Math.round(s.dec * ratio),
      jan: Math.round(s.jan * ratio), feb: Math.round(s.feb * ratio), mar: Math.round(s.mar * ratio),
      apr: Math.round(s.apr * ratio), may: Math.round(s.may * ratio), jun: Math.round(s.jun * ratio),
      jul: Math.round(s.jul * ratio), aug: Math.round(s.aug * ratio), sep: Math.round(s.sep * ratio),
    };

    return {
      ...row,
      qty: newQty,
      unitPrice: newUnitPrice,
      standardPrice: newUnitPrice * 1.05,
      totalBudget: newQty * (newUnitPrice * 1.05),
      stockForecast: material.currentStock || row.stockForecast,
      monthlyDemand: material.monthlyDemand || row.monthlyDemand,
      schedule: newSchedule
    };
  }) : mockBiddingData;

  return ("""

if insert_point in content:
    content = content.replace(insert_point, dynamic_code)

# Replace all occurrences of `mockBiddingData.map` and `mockBiddingData.reduce` with `dynamicBiddingData`
# inside the render function.
# Wait, actually it's easier to just replace inside the return block.
content = content.replace("mockBiddingData.map(", "dynamicBiddingData.map(")
content = content.replace("mockBiddingData.reduce(", "dynamicBiddingData.reduce(")

# But wait, there is `mockBiddingData.reduce` in the original code? Let's assume yes.

with open(file_path, "w") as f:
    f.write(content)
print("Patched ProcurementPlanTable")
