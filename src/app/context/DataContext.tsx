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
  eBiddingData: any;
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
        
        json.eBiddingData = {
          targetMaterial: "หม้อแปลง 160 kVA 3Ph (10067)",
          totalRequirement: 800,
          simulation: {
            scenario: "Supplier ผันผวน (800 -> 500) และแผนสำรอง (Plan B)",
            steps: [
              {
                id: 1,
                title: "วิเคราะห์ความต้องการเบื้องต้น",
                detail: "ระบบประเมินความต้องการใช้หม้อแปลง 800 เครื่องภายใน Q3",
                aiAction: "แนะนำให้ประมูล 100% (800 เครื่อง) ในช่วงนี้ เนื่องจากกราฟราคาตลาดโลกกำลังทรงตัวก่อนจะปรับขึ้น",
                status: "completed"
              },
              {
                id: 2,
                title: "Supplier ขาดส่ง & การประเมินความเสี่ยง",
                detail: "Supplier A แจ้งว่าสามารถส่งมอบได้เพียง 500 เครื่อง (ขาด 300 เครื่องจากสัญญา)",
                aiAction: "AI เช็คประวัติ Supplier A พบว่า 'มีความเสี่ยงสูง' (Reliability 40%) จึงไม่อนุมัติให้รอ แต่แนะนำให้ใช้ 'Plan B' โอนย้ายพัสดุ (Borrowing) จากคลังการไฟฟ้าภาคกลางที่ Overstock อยู่ 150 เครื่องมาใช้ด่วน แทนการรีบซื้อราคาแพง",
                status: "active"
              },
              {
                id: 3,
                title: "รอดพ้นวิกฤต & ประหยัดงบประมาณ",
                detail: "นำเข้าหม้อแปลงจากคลังภาคกลาง 150 เครื่อง บวกกับ Safety Stock เดิม ทำให้รอดพ้นวิกฤตขาดแคลนไปได้ 2 เดือน",
                aiAction: "AI แนะนำให้ยกเลิกสัญญาส่วนที่เหลือกับ Supplier A และตั้งงบประมาณเตรียมประกวดราคารอบใหม่ใน Q4 ซึ่งคาดว่าราคาตลาดจะลดลง 5% ช่วยเซฟงบประมาณชาติได้มหาศาล",
                status: "pending"
              }
            ],
            priceTrend: [
              { month: "Jan", price: 145000 },
              { month: "Feb", price: 148000 },
              { month: "Mar", price: 152000 },
              { month: "Apr", price: 155000 },
              { month: "May", price: 153000 },
              { month: "Jun", price: 150000, projected: true },
              { month: "Jul", price: 147000, projected: true },
            ]
          }
        };

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
