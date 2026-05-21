import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  aiRecommendations,
  dataSummary,
} from '../../data/mockData';

const prisma = new PrismaClient();

export async function GET() {
  // Simulate a slight network delay to show loading states
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    const materialsData = await prisma.material.findMany();
    const riskAlertsData = await prisma.riskAlert.findMany();
    const timelineEventsData = await prisma.timelineEvent.findMany({
      orderBy: { time: 'desc' }
    });

    // Parse sparkline JSON string back to array
    const materials = materialsData.map(mat => ({
      ...mat,
      sparkline: JSON.parse(mat.sparkline)
    }));

    // Re-compute derived values based on live database data
    const criticalAlerts = riskAlertsData.filter(a => a.severity === 'critical');
    const warningAlerts = riskAlertsData.filter(a => a.severity === 'warning');
    const infoAlerts = riskAlertsData.filter(a => a.severity === 'info');
    const totalVaR = riskAlertsData.reduce((sum, a) => sum + a.costImpact, 0);

    return NextResponse.json({
      materials,
      riskAlerts: riskAlertsData,
      aiRecommendations, // static layout data
      timelineEvents: timelineEventsData,
      criticalAlerts,
      warningAlerts,
      infoAlerts,
      totalVaR,
      dataSummary, // static layout data
    });
  } catch (error) {
    console.error("API Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch data from database" }, { status: 500 });
  }
}
