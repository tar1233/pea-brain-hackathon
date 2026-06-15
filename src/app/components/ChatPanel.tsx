"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Bot, Send, User, X } from "lucide-react";
import { useData } from "../context/DataContext";

type ChatMessage = {
  id: string;
  role: "ai" | "user" | "alert";
  content: string;
  timestamp: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "seed-1",
    role: "ai",
    content: "PEA Brain พร้อมช่วยสรุปความเสี่ยงและคำแนะนำด้านพัสดุ ถามได้เลย เช่น 'สรุปวันนี้' หรือ 'วัสดุที่เสี่ยงที่สุด'",
    timestamp: "09:00",
  },
];

interface ChatPanelProps {
  onClose: () => void;
}

function nowLabel() {
  return new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const { materials, riskAlerts, totalVaR } = useData();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const topRisk = useMemo(() => [...riskAlerts].sort((a, b) => b.costImpact - a.costImpact)[0], []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getResponse = (prompt: string) => {
    const normalized = prompt.toLowerCase();
    if (normalized.includes("สรุป")) {
      return `วันนี้มี ${riskAlerts.length} สัญญาณความเสี่ยง โดย ${topRisk.materialId} มีผลกระทบสูงสุด ${Math.round(
        topRisk.costImpact / 1_000_000
      )} ล้านบาท และมูลค่าความเสี่ยงรวมอยู่ที่ ${Math.round(totalVaR / 1_000_000)} ล้านบาท`;
    }

    if (normalized.includes("เสี่ยงที่สุด") || normalized.includes("urgent")) {
      return `${topRisk.materialId} - ${topRisk.materialName}\n${topRisk.message}\nคำแนะนำ: ${topRisk.recommendation}`;
    }

    const matchedMaterial = materials.find(
      (material) =>
        normalized.includes(material.id.toLowerCase()) ||
        normalized.includes(material.sapCode.toLowerCase())
    );

    if (matchedMaterial) {
      return `${matchedMaterial.name}\nStock ${matchedMaterial.currentStock.toLocaleString()} / Safety ${matchedMaterial.safetyStock.toLocaleString()} ${matchedMaterial.unit}\nLead time ${matchedMaterial.leadTimeWeeks} สัปดาห์\nAverage demand ${matchedMaterial.avgMonthlyDemand.toLocaleString()} ${matchedMaterial.unit}/เดือน`;
    }

    if (normalized.includes("vmi") || normalized.includes("ทยอยส่งมอบ") || normalized.includes("lot") || normalized.includes("กฎหมาย") || normalized.includes("ระเบียบ")) {
      return `กลยุทธ์ VMI (ทยอยส่งมอบ) และการแบ่ง Lot Splitting สามารถทำได้ตาม **พ.ร.บ. จัดซื้อจัดจ้าง พ.ศ. 2560** ภายใต้รูปแบบ "สัญญากรอบราคา (Frame Agreement)" 
      
วิธีนี้เปิดโอกาสให้แข่งขันราคาอย่างเป็นธรรม และ PEA สามารถเรียกของได้ตามความต้องการจริง (Call-off) ช่วยลดความเสี่ยงที่ผู้ชนะรายเดียวจะทิ้งงาน และประหยัด Holding Cost ได้มหาศาลครับ`;
    }

    return "ผมช่วยได้ทั้งสรุปความเสี่ยง, ค้นหาวัสดุ, และอธิบายข้อกฎหมายจัดซื้อ (เช่น VMI, Lot Splitting) ลองถามด้วยคำว่า 'สรุปวันนี้' หรือ 'VMI ผิดระเบียบไหม' ได้ครับ";
  };

  const handleSend = (preset?: string) => {
    const prompt = (preset ?? input).trim();
    if (!prompt) return;

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: prompt, timestamp: nowLabel() },
    ]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `ai-${Date.now()}`, role: "ai", content: getResponse(prompt), timestamp: nowLabel() },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
            <Bot size={18} />
          </div>
          <div>
            <div className="text-[16.5px] font-bold">PEA Brain Copilot</div>
            <div className="text-[16.5px] text-white/55">ถามภาพรวมความเสี่ยงหรือ drill-down รายวัสดุ</div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 text-[16.5px] leading-6 ${
              message.role === "user" ? "bg-primary-600 text-white" : "bg-white/8 text-white/90"
            }`}
          >
            <div className="mb-2 flex items-center gap-2 text-[16.5px] uppercase tracking-[0.14em] text-white/50">
              {message.role === "user" ? <User size={12} /> : message.role === "alert" ? <AlertTriangle size={12} /> : <Bot size={12} />}
              {message.role}
              <span className="ml-auto">{message.timestamp}</span>
            </div>
            <div className="whitespace-pre-line">{message.content}</div>
          </div>
        ))}

        {isTyping && (
          <div className="rounded-2xl bg-white/8 px-4 py-3 text-[16.5px] text-white/70">
            PEA Brain กำลังสรุปข้อมูล...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {["สรุปวันนี้", "วัสดุที่เสี่ยงที่สุด", "ตรวจสอบสัญญา VMI"].map((question) => (
            <button
              key={question}
              onClick={() => handleSend(question)}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[16.5px] font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              {question}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSend();
            }}
            placeholder="ถามเกี่ยวกับความเสี่ยงหรือวัสดุ..."
            className="flex-1 bg-transparent text-[16.5px] text-white outline-none placeholder:text-white/35"
          />
          <button onClick={() => handleSend()} className="rounded-xl bg-primary-600 p-2 text-white transition-colors hover:bg-primary-500">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
