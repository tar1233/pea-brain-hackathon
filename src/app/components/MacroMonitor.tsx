"use client";

import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, TrendingUp, TrendingDown, Newspaper, RefreshCw, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function MacroMonitor() {
  const [exchangeRate, setExchangeRate] = useState(35.42);
  const [copperPrice, setCopperPrice] = useState(8450);
  const [exchangeRateChange, setExchangeRateChange] = useState(0.15);
  const [copperPriceChange, setCopperPriceChange] = useState(-1.20);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/macro-data');
      if (res.ok) {
        const data = await res.json();
        setExchangeRate(data.usdThb);
        setExchangeRateChange(data.usdThbChange);
        setCopperPrice(data.copperPrice);
        setCopperPriceChange(data.copperChange);
      }
    } catch (err) {
      console.error("Error fetching live macro data:", err);
    } finally {
      // Small timeout to give user feedback of update
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch on load
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const sparklineData = Array.from({ length: 10 }).map((_, i) => ({ val: exchangeRate + (Math.random() * 0.2 - 0.1) }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      {/* Exchange Rate Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -z-10" />
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase">
            <DollarSign size={16} className="text-blue-500" />
            USD/THB (Real-time FX)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">API: BOT Open Data</span>
            {isUpdating && <RefreshCw size={12} className="text-slate-400 animate-spin" />}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="text-[32px] font-black text-slate-800">{exchangeRate.toFixed(2)}</div>
          <div className={`flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${
            exchangeRateChange >= 0 ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50'
          }`}>
            {exchangeRateChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {exchangeRateChange >= 0 ? '+' : ''}{exchangeRateChange.toFixed(2)}%
          </div>
        </div>
        <div className="h-8 w-full mt-2 opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-500 font-medium leading-tight">
            <span className="font-bold text-blue-600">วิเคราะห์:</span> ต้นทุนนำเข้า (Import Cost)<br/>
            <span className="font-bold text-slate-700">Action:</span> ประเมินจุดคุ้มทุนเพื่อสลับใช้ Local Sourcing
          </p>
        </div>
      </div>

      {/* LME Copper Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[100px] -z-10" />
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 uppercase">
            <Globe size={16} className="text-amber-500" />
            LME Copper (USD/MT)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">API: LME Direct</span>
            {isUpdating && <RefreshCw size={12} className="text-slate-400 animate-spin" />}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="text-[32px] font-black text-slate-800">{copperPrice.toLocaleString()}</div>
          <div className={`flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${
            copperPriceChange >= 0 ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50'
          }`}>
            {copperPriceChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {copperPriceChange >= 0 ? '+' : ''}{copperPriceChange.toFixed(2)}%
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium flex items-center gap-1"><Zap size={10} className="text-emerald-500"/> AI Agent มอนิเตอร์เพื่อรอจังหวะซื้อเข้า</p>
        <div className="mt-2 pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-500 font-medium leading-tight">
            <span className="font-bold text-amber-600">วิเคราะห์:</span> วัฏจักรราคาโลหะ (Price Cycle)<br/>
            <span className="font-bold text-slate-700">Action:</span> คำนวณจุดล็อกราคาทำสัญญา Long-term
          </p>
        </div>
      </div>

      {/* News Feed Card */}
      <div className="bg-indigo-900 rounded-2xl p-5 border border-indigo-700 shadow-sm relative overflow-hidden group text-white">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/20 blur-2xl rounded-full" />
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-[12px] font-bold text-indigo-200 uppercase">
            <Newspaper size={16} className="text-fuchsia-400" />
            Macro-economic Alerts
          </div>
          <span className="text-[9px] text-indigo-300 font-medium bg-indigo-800/50 px-1.5 py-0.5 rounded border border-indigo-500/30">Source: GDELT Project</span>
        </div>
        
        <div className="space-y-3">
          <div className="bg-indigo-800/50 backdrop-blur-sm rounded-xl p-3 border border-indigo-500/30">
            <div className="flex justify-between items-start">
              <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase mb-1 inline-block">Trade War Alert</span>
              <span className="text-[9px] text-indigo-300">2 mins ago</span>
            </div>
            <p className="text-[12px] font-medium leading-tight">สหรัฐฯ เล็งขึ้นภาษีนำเข้าโซลาร์เซลล์จีน 30% ส่งผลกระทบ Supply Chain ทั่วโลก</p>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-bold bg-indigo-950/50 p-2 rounded-lg border border-emerald-500/20">
            <Zap size={14} /> AI Action: เสนอสั่งซื้อแผงโซลาร์ล่วงหน้า 3 เดือนทันที
          </div>
          
          <div className="mt-1 pt-2 border-t border-indigo-500/30">
            <p className="text-[10px] text-indigo-200 font-medium leading-tight">
              <span className="font-bold text-fuchsia-400">วิเคราะห์:</span> ความเสี่ยงภูมิรัฐศาสตร์ (Geo-politics)<br/>
              <span className="font-bold text-white">Action:</span> ซอยสัญญา (Lot Split) เพื่อกระจายความเสี่ยง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
