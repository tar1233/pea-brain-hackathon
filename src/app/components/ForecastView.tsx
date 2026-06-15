"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudSun, Sparkles, TrendingUp, Waves, Wind } from "lucide-react";
import { useData } from "../context/DataContext";

const monthLabels = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

function buildForecastSeries(values: number[]) {
  const average = Math.max(1, Math.round(values.reduce((sum, value) => sum + value, 0) / values.length));

  return monthLabels.map((month, index) => {
    const history = values[index] ?? average;
    const forecast = index < values.length ? history : Math.round(average * (1 + (index - values.length + 1) * 0.05));
    const volatility = Math.max(30, Math.round(forecast * 0.18));
    const seasonalBump = index === 2 ? 24 : index >= 5 ? 10 + index : 0;

    return {
      month,
      actual: index < values.length ? history : null,
      forecast,
      upper: forecast + volatility,
      lower: Math.max(0, forecast - volatility),
      weather: 31 + index * 0.9 + (index === 2 ? 18 : 0),
      demandIndex: 92 + Math.round((forecast / average) * 34) + seasonalBump,
    };
  });
}

function formatCompact(value: number): string {
  return value.toLocaleString("en-US");
}

export default function ForecastView() {
  const { materials, riskAlerts } = useData();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("MAT-10067");

  const selectedMaterial = useMemo(
    () => materials.find((material) => material.id === selectedMaterialId) ?? materials[0],
    [selectedMaterialId]
  );

  const forecastSeries = useMemo(() => buildForecastSeries(selectedMaterial.sparkline), [selectedMaterial]);
  const selectedAlerts = useMemo(
    () => riskAlerts.filter((alert) => alert.materialId === selectedMaterial.id),
    [selectedMaterial]
  );

  const peakForecast = Math.max(...forecastSeries.map((item) => item.forecast));
  const stockCover = (selectedMaterial.currentStock / Math.max(selectedMaterial.avgMonthlyDemand, 1)).toFixed(1);
  const demandUplift = Math.round(((peakForecast - selectedMaterial.avgMonthlyDemand) / Math.max(1, selectedMaterial.avgMonthlyDemand)) * 100);
  const weatherPeak = Math.max(...forecastSeries.map((item) => item.weather));
  const averageBand = Math.round(
    forecastSeries.reduce((sum, item) => sum + (item.upper - item.lower), 0) / forecastSeries.length
  );

  const summaryCards = [
    {
      label: "วัสดุที่เลือก",
      value: selectedMaterial.name,
      tone: "text-slate-900",
      border: "border-l-slate-400",
    },
    {
      label: "Average Monthly Demand",
      value: `${formatCompact(selectedMaterial.avgMonthlyDemand)} ${selectedMaterial.unit}`,
      tone: "text-blue-700",
      border: "border-l-blue-500",
    },
    {
      label: "Lead Time",
      value: `${selectedMaterial.leadTimeWeeks} สัปดาห์`,
      tone: "text-amber-700",
      border: "border-l-amber-500",
    },
    {
      label: "Annual Demand",
      value: `${formatCompact(selectedMaterial.annualDemand)} ${selectedMaterial.unit}`,
      tone: "text-emerald-700",
      border: "border-l-emerald-500",
    },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch xl:justify-between relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[16.5px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
              <TrendingUp size={14} />
              Demand Forecast Studio
            </div>

            <h1 className="mt-4 text-[24px] font-bold tracking-tight text-white">
              พยากรณ์ความต้องการและแรงขับด้านสภาพอากาศ
            </h1>

            <p className="mt-3 max-w-3xl text-[16.5px] leading-relaxed text-slate-300 font-medium">
              ดูภาพคาดการณ์รายวัสดุพร้อมช่วงความเชื่อมั่น และเชื่อมโยงแรงขับหลักอย่างอุณหภูมิ
              เพื่อช่วยทีมวางแผนตัดสินใจเรื่อง safety stock และรอบจัดซื้อได้เร็วขึ้น
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            {[
              { label: "ความแม่นยำเฉลี่ย (Accuracy)", value: "88.5%", bg: "bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#059669] border-emerald-500/20 shadow-[0_15px_35px_rgba(16,185,129,0.1)]", valueColor: "text-white", labelColor: "text-emerald-100/90" },
              { label: "ระดับความเสี่ยง (Risk Level)", value: "Medium", bg: "bg-gradient-to-br from-[#78350f] via-[#9a3412] to-[#ea580c] border-orange-500/20 shadow-[0_15px_35px_rgba(234,88,12,0.1)]", valueColor: "text-white", labelColor: "text-orange-100/90" },
              { label: "จำนวน AI Scenarios", value: "3 models", bg: "bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] border-[#8b5cf6]/20 shadow-[0_15px_35px_rgba(139,92,246,0.1)]", valueColor: "text-white", labelColor: "text-purple-100/90" },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-[20px] border p-4.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.bg}`}
              >
                <div className={`text-[16.5px] font-bold uppercase tracking-[0.14em] ${item.labelColor}`}>{item.label}</div>
                <div className={`mt-2 text-[16.5px] font-bold leading-tight ${item.valueColor}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        {materials.map((material) => (
          <button
            key={material.id}
            onClick={() => setSelectedMaterialId(material.id)}
            className={`rounded-full border px-4 py-2 text-[16.5px] font-bold transition-all ${
              material.id === selectedMaterial.id
                ? "border-fuchsia-300 bg-fuchsia-700 text-white shadow-[0_14px_30px_rgba(162,28,175,0.22)]"
                : "border-slate-200 bg-white text-slate-700 hover:border-fuchsia-200 hover:text-fuchsia-700"
            }`}
          >
            {material.id}
          </button>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className={`rounded-[28px] border border-slate-200 border-l-4 ${card.border} bg-white p-6 shadow-[0_16px_32px_rgba(15,23,42,0.05)]`}
          >
            <div className="text-[16.5px] font-bold uppercase tracking-[0.16em] text-slate-400">{card.label}</div>
            <div className={`mt-3 text-[16.5px] font-bold leading-snug ${card.tone}`}>{card.value}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-fuchsia-600" />
            <h2 className="text-[16.5px] font-bold text-slate-900">80% CI Forecast Band</h2>
          </div>
          <p className="mt-2 text-[16.5px] leading-7 text-slate-500">
            เปรียบเทียบข้อมูลจริงกับค่า forecast และขอบเขตความไม่แน่นอนของช่วงถัดไป
          </p>

          <div className="mt-5 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastSeries}>
                <defs>
                  <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="actualBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#dbe7f4" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip  contentStyle={{ fontSize: '13.5px' }}  />
                <Area dataKey="upper" stroke="none" fill="#f3e8ff" />
                <Area dataKey="lower" stroke="none" fill="#ffffff" />
                <Area type="monotone" dataKey="forecast" stroke="#7c3aed" fill="url(#forecastBand)" strokeWidth={3.5} />
                <Area type="monotone" dataKey="actual" stroke="#1d4ed8" fill="url(#actualBand)" strokeWidth={2.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2">
            <CloudSun size={16} className="text-amber-500" />
            <h2 className="text-[16.5px] font-bold text-slate-900">Weather Driver</h2>
          </div>
          <p className="mt-2 text-[16.5px] leading-7 text-slate-500">
            จำลองความสัมพันธ์ระหว่างอุณหภูมิกับ demand index สำหรับการวางแผนฤดูกาล
          </p>

          <div className="mt-5 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastSeries}>
                <CartesianGrid strokeDasharray="4 4" stroke="#dbe7f4" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#f59e0b" />
                <YAxis yAxisId="right" orientation="right" stroke="#0ea5e9" />
                <Tooltip  contentStyle={{ fontSize: '13.5px' }}  />
                <Legend />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="demandIndex"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ r: 3.5 }}
                  name="Demand Index"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weather"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 3.5 }}
                  name="Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-sky-600" />
            <h2 className="text-[16.5px] font-bold text-slate-900">Scenario Summary</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]/50 border border-amber-100 p-5 shadow-[0_8px_20px_rgba(251,191,36,0.05)] transition-all hover:shadow-[0_8px_20px_rgba(251,191,36,0.1)]">
              <div className="text-[16.5px] font-bold uppercase tracking-[0.16em] text-amber-700/80">Weather Peak</div>
              <div className="mt-2 text-[24px] font-bold text-amber-600">{weatherPeak}°C</div>
              <div className="mt-2 text-[16.5px] leading-relaxed text-amber-900/60 font-medium">อุณหภูมิสูงสุดในฉากจำลองปีนี้ที่ระบบใช้คาดการณ์ demand</div>
            </div>
            <div className="rounded-[20px] bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff]/50 border border-fuchsia-100 p-5 shadow-[0_8px_20px_rgba(192,38,211,0.05)] transition-all hover:shadow-[0_8px_20px_rgba(192,38,211,0.1)]">
              <div className="text-[16.5px] font-bold uppercase tracking-[0.16em] text-fuchsia-700/80">80% CI Range</div>
              <div className="mt-2 text-[24px] font-bold text-fuchsia-600">{formatCompact(averageBand)}</div>
              <div className="mt-2 text-[16.5px] leading-relaxed text-fuchsia-900/60 font-medium">ช่วงความไม่แน่นอนเฉลี่ยที่ planner ควรเผื่อ buffer เพิ่ม</div>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-sky-100 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]/60 p-5 shadow-[0_8px_20px_rgba(14,165,233,0.05)]">
            <div className="text-[16.5px] font-bold uppercase tracking-[0.16em] text-sky-700">Planning Cue</div>
            <div className="mt-2 text-[16.5px] font-bold text-sky-950">
              ควรเตรียม stock ก่อนจุดพีคของ {selectedMaterial.id} อย่างน้อย 1 lead time
            </div>
            <div className="mt-2 text-[16.5px] leading-relaxed text-sky-800/80 font-medium">
              เมื่อ forecast peak แตะ {formatCompact(peakForecast)} {selectedMaterial.unit} และ stock cover เหลือ {stockCover} เดือน
              ระบบจึงแนะนำให้ lock รอบจัดซื้อก่อนช่วงร้อนจัดเพื่อกัน shortage
            </div>
          </div>
        </article>

        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2">
            <Waves size={16} className="text-primary-600" />
            <h2 className="text-[16.5px] font-bold text-slate-900">Planner Notes</h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[20px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-slate-200/60 p-5 shadow-[0_8px_20px_rgba(15,23,42,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
              <div className="text-[16.5px] font-bold text-slate-800">ความผันผวนของสัญญาณ</div>
              <div className="mt-2.5 text-[16.5px] leading-relaxed text-slate-600 font-medium">
                ค่าเฉลี่ยต่อเดือน {formatCompact(selectedMaterial.avgMonthlyDemand)} {selectedMaterial.unit}
                เทียบกับ data history สะท้อนว่า demand ยังแกว่งตามฤดูกาลสูง
              </div>
            </div>

            <div className="rounded-[20px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-slate-200/60 p-5 shadow-[0_8px_20px_rgba(15,23,42,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
              <div className="text-[16.5px] font-bold text-slate-800">จุดที่ต้องจับตา</div>
              <div className="mt-2.5 text-[16.5px] leading-relaxed text-slate-600 font-medium">
                หากอุณหภูมิขึ้นเกิน {weatherPeak}°C ระบบจะมอง demand uplift ที่ {demandUplift > 0 ? "+" : ""}
                {demandUplift}% และต้องเผื่อ stock เพิ่มสำหรับเดือนพีค
              </div>
            </div>

            <div className="rounded-[20px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-slate-200/60 p-5 shadow-[0_8px_20px_rgba(15,23,42,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
              <div className="text-[16.5px] font-bold text-slate-800">เชื่อมกับ procurement</div>
              <div className="mt-2.5 text-[16.5px] leading-relaxed text-slate-600 font-medium">
                พบ {selectedAlerts.length} alert ที่โยงกับวัสดุนี้ ใช้หน้านี้ควบคู่กับหน้าจัดซื้อเพื่อเล่าเรื่องตั้งแต่ forecast
                ไปถึงจำนวนที่ควรอนุมัติ
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
