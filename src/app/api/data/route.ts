import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SAPConnector } from '../../../services/sap-erp';
import { WMSConnector } from '../../../services/wms-system';
import { AIOrchestrator } from '../../../services/ai-orchestrator';

// Initialize core database connection
const prisma = new PrismaClient();

// Instantiate Plugin Connectors
const sapPlugin = new SAPConnector(prisma);
const wmsPlugin = new WMSConnector(prisma);
const aiCore = new AIOrchestrator(prisma);

export async function GET() {
  // Simulate network latency for API Gateway routing
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    // 1. Fetch data from PEA existing systems via Plugins
    const sapData = await sapPlugin.getProcurementData();
    const wmsData = await wmsPlugin.getInventoryData();
    
    // Merge SAP (Financial/Procurement) + WMS (Inventory) data
    const materials = wmsData.map(wmsItem => {
      const sapItem = sapData.find(sap => sap.id === wmsItem.id);
      return {
        ...wmsItem,
        ...sapItem, // merges unitPrice, budgetPrice, annualDemand
        sparkline: JSON.parse(wmsItem.sparkline)
      };
    });

    // 2. Fetch Multi-Agent Intelligence Layer
    const riskAlertsData = await aiCore.getRiskAlerts();
    const timelineEventsData = await aiCore.getTimelineEvents();
    const { aiRecommendations, dataSummary } = await aiCore.getLayoutData();

    // 3. API Gateway Data Aggregation
    const criticalAlerts = riskAlertsData.filter(a => a.severity === 'critical');
    const warningAlerts = riskAlertsData.filter(a => a.severity === 'warning');
    const infoAlerts = riskAlertsData.filter(a => a.severity === 'info');
    const totalVaR = riskAlertsData.reduce((sum, a) => sum + a.costImpact, 0);

    // Return unified payload to Frontend Dashboard
    return NextResponse.json({
      materials,
      riskAlerts: riskAlertsData,
      aiRecommendations,
      timelineEvents: timelineEventsData,
      criticalAlerts,
      warningAlerts,
      infoAlerts,
      totalVaR,
      dataSummary,
    });
  } catch (error) {
    console.error("API Gateway Error:", error);
    return NextResponse.json({ error: "API Gateway failed to connect to PEA Plugins" }, { status: 500 });
  }
}
