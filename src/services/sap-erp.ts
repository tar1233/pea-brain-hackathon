/**
 * SAP ERP Connector Plugin
 * Handles financial, budget, and procurement data integration.
 * In a real environment, this would use SAP BAPI or OData services.
 */
import { PrismaClient } from '@prisma/client';

export class SAPConnector {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getProcurementData() {
    // In reality, this queries SAP MM/FI modules
    const materials = await this.prisma.material.findMany({
      select: {
        id: true,
        sapCode: true,
        unitPrice: true,
        budgetPrice: true,
        annualDemand: true,
      }
    });
    return materials;
  }
}
