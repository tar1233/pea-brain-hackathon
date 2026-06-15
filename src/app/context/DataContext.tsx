"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  materials as awsMaterials, 
  riskAlerts, 
  aiRecommendations, 
  timelineEvents, 
  dataSummary 
} from "../data/awsData";
import type { Material, RiskAlert, AIRecommendation, TimelineEvent } from "../data/awsData";

interface DataContextType {
  materials: Material[];
  riskAlerts: RiskAlert[];
  aiRecommendations: AIRecommendation[];
  timelineEvents: TimelineEvent[];
  criticalAlerts: RiskAlert[];
  warningAlerts: RiskAlert[];
  infoAlerts: RiskAlert[];
  totalVaR: number;
  setRiskAlerts: (alerts: RiskAlert[]) => void;
  runAutoRiskAnalysis: () => Promise<void>;
  isAnalyzingRisk: boolean;
  eBiddingData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSummary: any;
  isLoading: boolean;
  error: string | null;
  vendors: any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

import { calculateEOQ, calculateDynamicROP, calculateBufferDays } from "../utils/supplyChainAI";

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<DataContextType, "isLoading" | "error" | "setRiskAlerts" | "runAutoRiskAnalysis" | "isAnalyzingRisk"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);

  const setRiskAlerts = (newAlerts: RiskAlert[]) => {
    if (!data) return;
    
    // Add timestamps and default fields if missing
    const formattedAlerts = newAlerts.map(a => ({
      ...a,
      timestamp: a.timestamp || new Date().toISOString(),
      confidence: a.confidence || 95,
      recommendation: a.recommendation || "รอการพิจารณา",
    }));

    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        riskAlerts: formattedAlerts,
        criticalAlerts: formattedAlerts.filter(a => a.severity === 'critical'),
        warningAlerts: formattedAlerts.filter(a => a.severity === 'warning'),
        infoAlerts: formattedAlerts.filter(a => a.severity === 'info'),
        totalVaR: formattedAlerts.reduce((sum, a) => sum + (a.costImpact || 0), 0)
      };
    });
  };

  const runAutoRiskAnalysis = async () => {
    if (!data || !data.materials) return;
    setIsAnalyzingRisk(true);
    try {
      const res = await fetch("/api/analyze-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materials: data.materials }),
      });
      const result = await res.json();
      if (result.success && result.alerts && result.alerts.length > 0) {
        // Tag them so user knows they are AI generated real-time
        const taggedAlerts = result.alerts.map((a: any) => ({
          ...a,
          message: `🤖 [AI วิเคราะห์] ${a.message}`
        }));
        setRiskAlerts(taggedAlerts);
        
        // Also log to timeline
        setData(prev => {
          if (!prev) return prev;
          const newEvent = {
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            text: `🤖 Risk Agent วิเคราะห์ข้อมูลพัสดุ ${data.materials.length} รายการเสร็จสิ้น พบความเสี่ยง ${taggedAlerts.length} รายการ`,
            type: "system" as const
          };
          return {
            ...prev,
            timelineEvents: [newEvent, ...prev.timelineEvents].slice(0, 10)
          };
        });
      }
    } catch (err) {
      console.error("Failed to run AI risk analysis", err);
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  useEffect(() => {
    async function loadRealData() {
      try {
        setIsLoading(true);
        // Load data exclusively from awsData (Source of Truth)
        const jsonData = {
          materials: awsMaterials,
          riskAlerts: riskAlerts,
          aiRecommendations: aiRecommendations,
          timelineEvents: timelineEvents,
          dataSummary: dataSummary,
          criticalAlerts: riskAlerts.filter((a: RiskAlert) => a.severity === "critical"),
          warningAlerts: riskAlerts.filter((a: RiskAlert) => a.severity === "warning"),
          infoAlerts: riskAlerts.filter((a: RiskAlert) => a.severity === "info"),
          totalVaR: dataSummary.totalSpend * 0.11, // Estimated var from PO JSON
          vendors: [
            { id: "v1", name: "บริษัท ไทยทรานสฟอร์มเมอร์ จำกัด", registeredCapacity: 400, outstandingPOs: 150, reliabilityScore: 0.95 },
            { id: "v2", name: "บริษัท สยามอิเล็คทริค อินดัสทรี", registeredCapacity: 250, outstandingPOs: 50, reliabilityScore: 0.88 },
            { id: "v3", name: "บริษัท บางกอกพาวเวอร์ ซัพพลาย", registeredCapacity: 150, outstandingPOs: 0, reliabilityScore: 0.92 },
            { id: "v4", name: "บริษัท นอร์ทเทิร์น กรีน เอ็นเนอร์ยี่", registeredCapacity: 200, outstandingPOs: 100, reliabilityScore: 0.80 },
            { id: "v5", name: "บริษัท เมโทร สมาร์ท กริด", registeredCapacity: 300, outstandingPOs: 220, reliabilityScore: 0.85 }
          ],
          eBiddingData: {
            targetMaterial: "หม้อแปลง 160 kVA 3Ph (10067)",
            totalRequirement: 800,
            simulation: {
              process: [],
              totalCalculatedLeadTimeDays: 90,
              criticalThresholdQty: 100,
              currentStockQty: 200,
              riskScore: 20,
              aiDecisionLog: [],
              priceTrend: []
            }
          }
        };

        setData(jsonData);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading real AWS data");
      } finally {
        setIsLoading(false);
      }
    }

    loadRealData();
  }, []);

  return (
    <DataContext.Provider value={{ ...data, vendors: data?.vendors || [], isLoading, error, setRiskAlerts, runAutoRiskAnalysis, isAnalyzingRisk } as DataContextType}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
