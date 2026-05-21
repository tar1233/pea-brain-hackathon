import { PrismaClient } from "@prisma/client";
import { materials, riskAlerts, timelineEvents } from "../src/app/data/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Materials
  for (const mat of materials) {
    await prisma.material.upsert({
      where: { id: mat.id },
      update: {},
      create: {
        id: mat.id,
        name: mat.name,
        category: mat.category,
        sapCode: mat.sapCode,
        currentStock: mat.currentStock,
        safetyStock: mat.safetyStock,
        reorderPoint: mat.reorderPoint,
        eoq: mat.eoq,
        unit: mat.unit,
        unitPrice: mat.unitPrice,
        leadTimeWeeks: mat.leadTimeWeeks,
        avgMonthlyDemand: mat.avgMonthlyDemand,
        annualDemand: mat.annualDemand,
        budgetPrice: mat.budgetPrice,
        sparkline: JSON.stringify(mat.sparkline),
      },
    });
  }
  console.log("Materials seeded");

  // 2. Seed Risk Alerts
  for (const alert of riskAlerts) {
    await prisma.riskAlert.upsert({
      where: { id: alert.id },
      update: {},
      create: {
        id: alert.id,
        materialId: alert.materialId,
        materialName: alert.materialName,
        severity: alert.severity,
        message: alert.message,
        recommendation: alert.recommendation,
        confidence: alert.confidence,
        costImpact: alert.costImpact,
        timestamp: alert.timestamp,
      },
    });
  }
  console.log("Risk Alerts seeded");

  // 3. Seed Timeline Events
  for (const event of timelineEvents) {
    await prisma.timelineEvent.create({
      data: {
        time: event.time,
        text: event.text,
      },
    });
  }
  console.log("Timeline Events seeded");

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
