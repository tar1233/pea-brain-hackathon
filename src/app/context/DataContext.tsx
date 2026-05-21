"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Material, RiskAlert, AIRecommendation, TimelineEvent } from "../data/mockData";

interface DataContextType {
  materials: Material[];
  riskAlerts: RiskAlert[];
  aiRecommendations: AIRecommendation[];
  timelineEvents: TimelineEvent[];
  criticalAlerts: RiskAlert[];
  warningAlerts: RiskAlert[];
  infoAlerts: RiskAlert[];
  totalVaR: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSummary: any;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<DataContextType, "isLoading" | "error"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Always route through Next.js backend proxy to bypass CORS
        const apiUrl = "/api/data";
        console.log("Fetching from:", apiUrl);
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        
        // Handle Lambda payload (which might not include computed fields)
        if (!json.riskAlerts) json.riskAlerts = [];
        json.riskAlerts = json.riskAlerts.map((a: any) => ({
          ...a,
          confidence: a.confidence || 95,
          recommendation: a.recommendation || "รอการตัดสินใจจากผู้ดูแลระบบ",
          timestamp: a.timestamp || new Date().toISOString(),
          materialName: a.materialName || "Unknown Material",
        }));
        
        if (!json.materials) json.materials = [];
        // Ensure all material fields exist to prevent UI crashes
        json.materials = json.materials.map((m: any) => ({
          ...m,
          avgMonthlyDemand: m.avgMonthlyDemand || 40,
          annualDemand: m.annualDemand || 480,
          leadTimeWeeks: m.leadTimeWeeks || 12,
          unit: m.unit || "EA",
          reorderPoint: m.reorderPoint || 300,
          eoq: m.eoq || 150,
          currentStock: m.currentStock || 0,
          safetyStock: m.safetyStock || 0,
          budgetPrice: m.budgetPrice || 0,
          unitPrice: m.unitPrice || 0,
        }));

        if (!json.criticalAlerts) {
          json.criticalAlerts = json.riskAlerts.filter((a: RiskAlert) => a.severity === 'critical');
        }
        if (!json.warningAlerts) {
          json.warningAlerts = json.riskAlerts.filter((a: RiskAlert) => a.severity === 'warning');
        }
        if (!json.infoAlerts) {
          json.infoAlerts = json.riskAlerts.filter((a: RiskAlert) => a.severity === 'info');
        }
        if (!json.timelineEvents) json.timelineEvents = [];
        if (!json.aiRecommendations) json.aiRecommendations = [];
        if (!json.dataSummary) json.dataSummary = "";
        if (json.totalVaR === undefined) json.totalVaR = 0;

        setData(json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const value = {
    ...(data as Omit<DataContextType, "isLoading" | "error">),
    isLoading,
    error,
  };

  return (
    <DataContext.Provider value={value}>
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
