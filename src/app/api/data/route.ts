import { NextResponse } from 'next/server';
import {
  materials,
  riskAlerts,
  aiRecommendations,
  timelineEvents,
  criticalAlerts,
  warningAlerts,
  infoAlerts,
  totalVaR,
  dataSummary,
} from '../../data/mockData';

export async function GET() {
  // Simulate a slight network delay to show loading states (optional, but good for PoC to prove it's an API)
  await new Promise(resolve => setTimeout(resolve, 600));

  return NextResponse.json({
    materials,
    riskAlerts,
    aiRecommendations,
    timelineEvents,
    criticalAlerts,
    warningAlerts,
    infoAlerts,
    totalVaR,
    dataSummary,
  });
}
