import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PEA High-Impact Scenario...");

  // 1. Seed Materials (WMS + SAP Merged Scenario)
  const materials = [
    { id: "10067", name: "160 kVA Transformer 3Ph", category: "Transformers", sapCode: "SAP-T160", budgetPrice: 150000, unitPrice: 192800, currentStock: 12, safetyStock: 250, reorderPoint: 300, eoq: 150, unit: "EA", leadTimeWeeks: 12, avgMonthlyDemand: 40, annualDemand: 480, sparkline: "[400, 380, 250, 150, 80, 12]" },
    { id: "10066", name: "100 kVA Transformer 3Ph", category: "Transformers", sapCode: "SAP-T100", budgetPrice: 85000, unitPrice: 120500, currentStock: 5, safetyStock: 100, reorderPoint: 150, eoq: 80, unit: "EA", leadTimeWeeks: 10, avgMonthlyDemand: 20, annualDemand: 240, sparkline: "[120, 100, 80, 60, 40, 5]" },
    { id: "20045", name: "Drop Out Fuse Cutout 24kV", category: "Switchgear", sapCode: "SAP-F24", budgetPrice: 4200, unitPrice: 4500, currentStock: 120, safetyStock: 5000, reorderPoint: 6000, eoq: 4000, unit: "EA", leadTimeWeeks: 4, avgMonthlyDemand: 1500, annualDemand: 18000, sparkline: "[6000, 5200, 4100, 3000, 2100, 120]" },
  ];

  for (const m of materials) {
    await prisma.material.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }

  // 2. Seed Risk Alerts (Critical Storm Scenario)
  const alerts = [
    { id: "alt-1", severity: "critical", materialId: "10067", materialName: "160 kVA Transformer 3Ph", message: "พายุโซนร้อนเข้าภาคเหนือ หม้อแปลง 160kVA ขาดแคลนวิกฤต (12/250) เสี่ยงกระทบการกู้ไฟ 42,000 ครัวเรือน", recommendation: "โอนย้ายสต๊อกจากคลังภาคกลางด่วน (มีของ 800 ลูก)", confidence: 99, costImpact: 231360000, timestamp: new Date().toISOString() },
    { id: "alt-2", severity: "critical", materialId: "10066", materialName: "100 kVA Transformer 3Ph", message: "สต๊อกหม้อแปลง 100kVA ต่ำกว่าเกณฑ์ (5/100) ไม่เพียงพอรับมือภัยพิบัติ", recommendation: "สั่งซื้อฉุกเฉิน (Emergency PR)", confidence: 95, costImpact: 114475000, timestamp: new Date().toISOString() },
    { id: "alt-3", severity: "warning", materialId: "20045", materialName: "Drop Out Fuse Cutout 24kV", message: "Drop Out Fuse ขาดสต๊อก แต่ซัพพลายเออร์แจ้งส่งของล่าช้า 2 สัปดาห์", recommendation: "เจรจาขอยืมจากการไฟฟ้าส่วนภูมิภาคเขตข้างเคียง", confidence: 85, costImpact: 21960000, timestamp: new Date().toISOString() }
  ];

  for (const a of alerts) {
    await prisma.riskAlert.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }

  // 3. Seed Timeline Events
  const events = [
    { id: "evt-1", time: "08:00 AM", text: "กรมอุตุฯ แจ้งเตือนพายุโซนร้อนถล่มภาคเหนือ เสาไฟล้ม 180 ต้น" },
    { id: "evt-2", time: "10:30 AM", text: "เบิกจ่ายหม้อแปลงไปแล้วกว่า 95% ของคลังเชียงใหม่" },
    { id: "evt-3", time: "11:45 AM", text: "AI คาดการณ์หม้อแปลงจะหมดคลังภายใน 4 ชั่วโมงข้างหน้า" },
    { id: "evt-4", time: "Now", text: "เตรียมสร้างใบสั่งโอนย้ายฉุกเฉินจากส่วนกลาง (รออนุมัติ)" },
  ];

  await prisma.timelineEvent.deleteMany({});
  for (const e of events) {
    await prisma.timelineEvent.create({ data: e });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
