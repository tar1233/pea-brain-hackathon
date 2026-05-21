/**
 * WMS Connector Plugin
 * Handles warehouse inventory, stock levels, and physical logistics data.
 */
import { PrismaClient } from '@prisma/client';

export class WMSConnector {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getInventoryData() {
    // Queries WMS system for live physical inventory
    const materials = await this.prisma.material.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        currentStock: true,
        safetyStock: true,
        reorderPoint: true,
        eoq: true,
        unit: true,
        leadTimeWeeks: true,
        avgMonthlyDemand: true,
        sparkline: true,
      }
    });
    return materials;
  }
}
