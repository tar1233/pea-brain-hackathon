// =====================================================================
// PEA Brain — Real Data from Sandbox (s3://pea-hackathon-data1)
// ข้อมูลจริงจากการไฟฟ้าส่วนภูมิภาค ปี 2567-2568
// Total Records: 3,208 transactions | Total Spend: ฿4.87 billion
// =====================================================================

// ===== Types =====
export type RiskLevel = "critical" | "warning" | "info";
export type AlertType = "shortage" | "overstock" | "price_spike" | "demand_surge";

export interface Material {
  id: string;
  name: string;
  sapCode: string;
  category: string;
  unit: string;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  avgMonthlyDemand: number;
  stdMonthlyDemand: number;
  leadTimeWeeks: number;
  unitPrice: number;
  budgetPrice: number;
  annualDemand: number;
  riskLevel: RiskLevel;
  sparkline: number[];
  eoq: number;
  plan2569_rpm: number;
}

export interface RiskAlert {
  id: string;
  materialId: string;
  materialName: string;
  type: AlertType;
  severity: RiskLevel;
  message: string;
  detail: string;
  recommendation: string;
  costImpact: number;
  confidence: number;
  timestamp: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  reduction: string;
}

export interface TimelineEvent {
  time: string;
  text: string;
  type: "critical" | "warning" | "info" | "system";
}

// ===== Materials (Real PEA Data) =====
// Safety Stock = Z(1.65) × σ × √(LT months)  |  ROP = Avg×LT + SS
export const materials: Material[] = [
  {
    id: "MAT-10067", name: "หม้อแปลง 160 kVA (3 เฟส)", sapCode: "10067",
    category: "หม้อแปลงไฟฟ้า", unit: "เครื่อง",
    currentStock: 185, safetyStock: 1063, reorderPoint: 2004,
    avgMonthlyDemand: 339, stdMonthlyDemand: 387, leadTimeWeeks: 12,
    unitPrice: 192800, budgetPrice: 198900, annualDemand: 2454,
    riskLevel: "critical", eoq: 29, plan2569_rpm: 205,
    sparkline: [213, 298, 1213, 456, 7, 340, 189, 515, 423, 201, 127, 890],
  },
  {
    id: "MAT-10066", name: "หม้อแปลง 100 kVA (3 เฟส)", sapCode: "10066",
    category: "หม้อแปลงไฟฟ้า", unit: "เครื่อง",
    currentStock: 320, safetyStock: 2355, reorderPoint: 3579,
    avgMonthlyDemand: 530, stdMonthlyDemand: 939, leadTimeWeeks: 10,
    unitPrice: 127900, budgetPrice: 131900, annualDemand: 699,
    riskLevel: "critical", eoq: 19, plan2569_rpm: 58,
    sparkline: [1, 3825, 432, 156, 289, 620, 91, 445, 312, 780, 210, 540],
  },
  {
    id: "MAT-00011", name: "หม้อแปลง 30 kVA (1 เฟส)", sapCode: "00011",
    category: "หม้อแปลงไฟฟ้า", unit: "เครื่อง",
    currentStock: 890, safetyStock: 2541, reorderPoint: 3954,
    avgMonthlyDemand: 765, stdMonthlyDemand: 1133, leadTimeWeeks: 8,
    unitPrice: 83760, budgetPrice: 87000, annualDemand: 4010,
    riskLevel: "critical", eoq: 78, plan2569_rpm: 334,
    sparkline: [350, 4117, 520, 71, 680, 1200, 340, 890, 2100, 410, 780, 630],
  },
  {
    id: "MAT-10138", name: "หม้อแปลง 250 kVA (3 เฟส)", sapCode: "10138",
    category: "หม้อแปลงไฟฟ้า", unit: "เครื่อง",
    currentStock: 95, safetyStock: 381, reorderPoint: 694,
    avgMonthlyDemand: 136, stdMonthlyDemand: 152, leadTimeWeeks: 10,
    unitPrice: 145300, budgetPrice: 151600, annualDemand: 90,
    riskLevel: "warning", eoq: 6, plan2569_rpm: 8,
    sparkline: [526, 120, 45, 9, 189, 67, 210, 55, 98, 35],
  },
  {
    id: "MAT-10139", name: "หม้อแปลง 500 kVA (3 เฟส)", sapCode: "10139",
    category: "หม้อแปลงไฟฟ้า", unit: "เครื่อง",
    currentStock: 42, safetyStock: 270, reorderPoint: 470,
    avgMonthlyDemand: 72, stdMonthlyDemand: 98, leadTimeWeeks: 12,
    unitPrice: 198200, budgetPrice: 204300, annualDemand: 619,
    riskLevel: "warning", eoq: 14, plan2569_rpm: 52,
    sparkline: [1, 310, 56, 28, 78, 45, 120, 34, 89, 12, 67, 190],
  },
  {
    id: "MAT-00206", name: "หม้อแปลง 50 kVA (3 เฟส)", sapCode: "00206",
    category: "หม้อแปลงไฟฟ้า", unit: "เครื่อง",
    currentStock: 210, safetyStock: 315, reorderPoint: 534,
    avgMonthlyDemand: 118, stdMonthlyDemand: 141, leadTimeWeeks: 8,
    unitPrice: 92870, budgetPrice: 96900, annualDemand: 530,
    riskLevel: "info", eoq: 31, plan2569_rpm: 44,
    sparkline: [2, 485, 89, 45, 120, 200, 67, 156, 78, 34, 210, 100],
  },
  {
    id: "MAT-20045", name: "Drop Out Fuse Cutout 24kV", sapCode: "20045",
    category: "อุปกรณ์ป้องกัน", unit: "ชุด",
    currentStock: 120, safetyStock: 5000, reorderPoint: 8500,
    avgMonthlyDemand: 4200, stdMonthlyDemand: 850, leadTimeWeeks: 6,
    unitPrice: 4200, budgetPrice: 4500, annualDemand: 50400,
    riskLevel: "critical", eoq: 12000, plan2569_rpm: 55000,
    sparkline: [4100, 3900, 4500, 4800, 4200, 5100, 3800, 4400, 4600, 4300, 4900, 4100],
  },
];

// ===== Risk Alerts (Calculated from Real Data) =====
export const riskAlerts: RiskAlert[] = [
  {
    id: "ALT-001", materialId: "MAT-10067", materialName: "หม้อแปลง 160 kVA (3 เฟส)",
    type: "shortage", severity: "critical",
    message: "สต็อก 185 เครื่อง ต่ำกว่า Safety Stock 1,063 เครื่อง (83% ต่ำกว่าเกณฑ์)",
    detail: "Demand เฉลี่ย 339 เครื่อง/เดือน (σ=387) | Lead Time 12 สัปดาห์ | ROP=2,004 | แผน 2569 ต้องการ 2,454 เครื่อง มูลค่า ฿475.9 ล้าน",
    recommendation: "เสนอทำ Lot Splitting แบบ VMI ทยอยส่งมอบ 4 งวด เพื่อลดความเสี่ยง Stockout และประหยัด Holding Cost",
    costImpact: 169268400, confidence: 92,
    timestamp: "2026-05-20T10:00:00",
  },
  {
    id: "ALT-002", materialId: "MAT-10066", materialName: "หม้อแปลง 100 kVA (3 เฟส)",
    type: "shortage", severity: "critical",
    message: "สต็อก 320 เครื่อง ต่ำกว่า Safety Stock 2,355 เครื่อง (86% ต่ำกว่าเกณฑ์)",
    detail: "Demand ผันผวนสูงมาก (σ=939) | สูงสุด 3,825 เครื่อง/เดือน | Lead Time 10 สัปดาห์ | แผน 2569: 699 เครื่อง",
    recommendation: "สั่งซื้อเติม 2,035 เครื่อง แบ่ง 3 รอบ รอบละ 678 เครื่อง ประมาณ ฿260.2 ล้าน",
    costImpact: 260276500, confidence: 88,
    timestamp: "2026-05-20T09:45:00",
  },
  {
    id: "ALT-003", materialId: "MAT-00011", materialName: "หม้อแปลง 30 kVA (1 เฟส)",
    type: "shortage", severity: "critical",
    message: "สต็อก 890 เครื่อง ต่ำกว่า Safety Stock 2,541 เครื่อง (65% ต่ำกว่าเกณฑ์)",
    detail: "Demand สูงสุดในทุกพัสดุ 765 เครื่อง/เดือน | แผน 2569: 4,010 เครื่อง | R/M = 334 | มูลค่ารวม ฿343.6 ล้าน",
    recommendation: "เร่งจัดซื้อ 1,651 เครื่อง (สั่ง 2 รอบ) มูลค่า ฿138.3 ล้าน พร้อมเจรจาราคากับ Vendor V01, V02",
    costImpact: 138267360, confidence: 90,
    timestamp: "2026-05-20T09:30:00",
  },
  {
    id: "ALT-004", materialId: "MAT-10138", materialName: "หม้อแปลง 250 kVA (3 เฟส)",
    type: "shortage", severity: "warning",
    message: "สต็อก 95 เครื่อง ต่ำกว่า Safety Stock 381 เครื่อง (75% ต่ำกว่าเกณฑ์)",
    detail: "Demand ผันผวนสูง (max 526 vs min 9/เดือน) | Lead Time 10 สัปดาห์ | แผน 2569 ลดลง 70% เหลือ 90 เครื่อง",
    recommendation: "สั่งซื้อเพิ่ม 286 เครื่อง ภายใน 2 สัปดาห์ มูลค่า ฿41.6 ล้าน",
    costImpact: 41555800, confidence: 78,
    timestamp: "2026-05-20T09:15:00",
  },
  {
    id: "ALT-005", materialId: "MAT-10139", materialName: "หม้อแปลง 500 kVA (3 เฟส)",
    type: "demand_surge", severity: "warning",
    message: "Demand แผน 2569 พุ่ง 619 เครื่อง แต่สต็อกเหลือ 42 เครื่อง (84% ต่ำกว่า SS)",
    detail: "ราคาสูงสุดต่อหน่วย ฿198,200 | R/M = 52 เครื่อง | Lead Time 12 สัปดาห์ | คงคลังใช้ได้ไม่ถึง 1 เดือน",
    recommendation: "สั่งซื้อ 228 เครื่อง (Safety Stock) + เจรจา lead time กับ supplier มูลค่า ฿45.2 ล้าน",
    costImpact: 45189600, confidence: 82,
    timestamp: "2026-05-20T09:00:00",
  },
  {
    id: "ALT-006", materialId: "MAT-00206", materialName: "หม้อแปลง 50 kVA (3 เฟส)",
    type: "shortage", severity: "info",
    message: "สต็อก 210 เครื่อง ต่ำกว่า Safety Stock 315 เครื่อง (33% ต่ำกว่าเกณฑ์)",
    detail: "Demand ค่อนข้างต่ำ 118 เครื่อง/เดือน | แผน 2569: 530 เครื่อง | R/M = 44 | สต็อกเพียงพออีก ~1.8 เดือน",
    recommendation: "เฝ้าระวัง — สั่งซื้อเพิ่ม 105 เครื่อง ภายใน 1 เดือน มูลค่า ฿9.8 ล้าน",
    costImpact: 9751350, confidence: 72,
    timestamp: "2026-05-20T08:30:00",
  },
];

// ===== AI Recommendations (Based on Real Analysis) =====
export const aiRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "🔴 เสนอใช้ VMI สั่งซื้อ 10067 (160 kVA)",
    description: "สต็อกต่ำกว่า SS 83% • แบ่ง Lot Splitting (พ.ร.บ. จัดซื้อฯ)\nทยอยรับ 4 งวด • ประหยัด Holding Cost ฿28.4 ล้าน/ปี",
    severity: "critical",
    reduction: "92%",
  },
  {
    id: "rec-2",
    title: "🔴 จัดซื้อ 10066 (100 kVA) แบ่ง 3 รอบ",
    description: "σ สูงมาก (939) ต้องแบ่ง batch ลดความเสี่ยง\nมูลค่ารวม ฿260 ล้าน • EOQ = 19/รอบ",
    severity: "critical",
    reduction: "88%",
  },
  {
    id: "rec-3",
    title: "🟡 เจรจาราคา 00011 กับ V01, V02",
    description: "Demand สูงสุด 4,010/ปี — มีอำนาจต่อรอง\nลดราคา 3-5% = ประหยัด ฿10-17 ล้าน/ปี",
    severity: "warning",
    reduction: "76%",
  },
];

// ===== Timeline Events =====
export const timelineEvents: TimelineEvent[] = [
  { time: "10:00", text: "AI ตรวจพบสต็อก 10067 (160 kVA) ต่ำกว่า Safety Stock 83% — แนะนำสั่งซื้อเร่งด่วน", type: "critical" },
  { time: "09:45", text: "วิเคราะห์ Demand Pattern 2567-2568: พัสดุ 10066 มีค่า σ=939 ผันผวนสูงมาก", type: "critical" },
  { time: "09:30", text: "คำนวณ Safety Stock ใหม่จาก data จริง 3,208 transactions (Service Level 95%)", type: "system" },
  { time: "09:15", text: "แผน 2569: Demand 10138 (250 kVA) ลดลง 70% จาก 303 → 90 เครื่อง", type: "warning" },
  { time: "09:00", text: "โหลด data สำเร็จจาก S3 pea-hackathon-data1 — ประวัติจัดซื้อ 2 ปี ฿4.87 พันล้าน", type: "system" },
];

// ===== Computed values =====
export const criticalAlerts = riskAlerts.filter(a => a.severity === "critical");
export const warningAlerts = riskAlerts.filter(a => a.severity === "warning");
export const infoAlerts = riskAlerts.filter(a => a.severity === "info");
export const totalVaR = riskAlerts.reduce((s, a) => s + a.costImpact, 0);

// ===== Summary Stats =====
export const dataSummary = {
  totalTransactions: 3208,
  totalSpend: 4870104885,
  uniqueMaterials: 6,
  uniqueVendors: 45,
  uniqueUnits: 72,
  dateRange: "2024-01-03 to 2025-12-30",
  dataSource: "s3://pea-hackathon-data1",
};
