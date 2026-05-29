"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, User, AlertTriangle, Shield, Info, Trash2, MessageCircle, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useData } from "../context/DataContext";

const sevIcons = { critical: AlertTriangle, warning: Shield, info: Info };
const sevColors = {
  critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  warning: { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  info: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
};

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

const DEFAULT_WELCOME: ChatMessage = {
  id: "welcome",
  role: "ai",
  content: "สวัสดีครับ! พวกเราทีมงาน PEA Brain (Multi-Agent) ผู้ช่วยวิเคราะห์ข้อมูลจัดซื้อพัสดุ (เชื่อมต่อกับ Bedrock Knowledge Base เรียบร้อย)\n\nลองถามผมได้เลย เช่น:\n- สรุปสถานะหม้อแปลง 10067 หน่อย\n- Demand ของปี 2569 คือกี่เครื่อง",
};

export default function AICopilot() {
  const { aiRecommendations } = useData();
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pea_brain_chat_history");
    if (saved) {
      try {
        // eslint-disable-next-line
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    // Load panel state
    const panelState = localStorage.getItem("pea_brain_chat_open");
    if (panelState !== null) {
      setIsOpen(panelState === "true");
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("pea_brain_chat_history", JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Save panel state
  useEffect(() => {
    localStorage.setItem("pea_brain_chat_open", String(isOpen));
  }, [isOpen]);

  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME]);
    localStorage.removeItem("pea_brain_chat_history");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setInput("");
    
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: userText }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      
      if (data.content) {
        let finalContent = data.content;
        
        // Append citations if they exist
        if (data.citations && data.citations.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const uniqueCitations = Array.from(new Set(data.citations.map((c: any) => c.reference)));
          finalContent += "\n\n<div style=\"font-size: 10px; color: #8a94ab; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 12px;\">**📚 แหล่งอ้างอิง (Knowledge Base):**<br/>" + 
            uniqueCitations.map(c => `• ${c}`).join("<br/>") + "</div>";
        }

        setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "ai", content: finalContent }]);
      } else {
        setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "ai", content: `ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI\n\n**Error Details:** ${data.error || 'Unknown Error'}` }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "ai", content: "ขออภัยครับ ไม่สามารถเชื่อมต่อกับ Server ได้" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Floating Button (when chat is closed) ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#A80689] to-[#7b0365] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(168,6,137,0.4)] hover:shadow-[0_8px_40px_rgba(168,6,137,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer group"
        title="เปิด PEA Brain Copilot"
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">AI</span>
        </span>
      </button>
    );
  }

  // ── Full Chat Panel (when open) ──
  return (
    <aside className="fixed inset-0 md:relative md:inset-auto md:w-[320px] shrink-0 bg-white/95 md:bg-white/60 backdrop-blur-3xl md:border-l border-white/60 shadow-[-10px_0_40px_rgb(0,0,0,0.03)] flex flex-col h-screen md:h-screen relative z-[60] md:z-40">
      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-100/50 bg-transparent shrink-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-purple-50 to-[#f4d4ec]/40 border border-purple-100/50 flex items-center justify-center shadow-sm">
            <Sparkles size={16} className="text-[#A80689]" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-extrabold text-gray-900 tracking-tight truncate">PEA Brain Copilot</div>
            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 font-semibold">
              <Bot size={10} className="shrink-0" /> <span className="truncate">Nova Pro Multi-Agent</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-600 px-3 h-7 rounded-full transition-all cursor-pointer shadow-sm shrink-0 group"
            title="ซ่อนหน้าต่างแชท"
          >
            <span className="text-[11px] font-extrabold whitespace-nowrap">ปิดแชท</span>
            <X size={14} className="stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-4 py-4 space-y-3 bg-gradient-to-b from-white/30 to-transparent shrink-0 border-b border-gray-100/30">
        <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1">คำแนะนำด่วน (Auto-generated)</div>
        {aiRecommendations.slice(0, 2).map((rec) => {
          const Icon = sevIcons[rec.severity];
          const colors = sevColors[rec.severity];
          return (
            <div key={rec.id} className="rounded-2xl p-3.5 border transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
              style={{ background: `${colors.bg}80`, borderColor: colors.border }}
              onClick={() => setInput(rec.title)}
            >
              <div className="flex items-start gap-2.5">
                <Icon size={14} style={{ color: colors.color }} className="mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold text-gray-900 leading-snug tracking-tight">{rec.title}</h4>
                  <p className="text-[10px] text-gray-600 leading-relaxed mt-1 line-clamp-2">{rec.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm transition-all ${
              msg.role === "user" 
                ? "bg-gradient-to-r from-[#A80689] to-[#7b0365] text-white rounded-br-sm shadow-purple-500/10" 
                : "bg-white/70 backdrop-blur-md border border-white/60 text-gray-800 rounded-bl-sm"
            }`}>
              <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px] font-bold uppercase tracking-widest">
                {msg.role === "user" ? <User size={10} /> : <Bot size={10} />}
                {msg.role === "user" ? "คุณ" : "PEA Brain"}
              </div>
              <div className={`${msg.role === "user" ? "whitespace-pre-wrap" : "text-gray-800"}`}>
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      strong: ({node, ...props}) => <strong className="font-extrabold text-gray-900" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1.5" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1.5" {...props} />,
                      li: ({node, ...props}) => <li className="leading-relaxed m-0 p-0 text-[13px]" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed text-[13px]" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-[15px] font-extrabold text-gray-900 mt-3 mb-1.5 border-b border-gray-200/60 pb-1" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-[14px] font-extrabold text-gray-900 mt-3 mb-1.5" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-[13px] font-bold text-gray-800 mt-2 mb-1" {...props} />,
                      hr: ({node, ...props}) => <hr className="my-3 border-gray-200/60" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-[12px] bg-white/70 backdrop-blur-md border border-white/60 text-gray-500 rounded-bl-sm shadow-sm flex items-center gap-2 font-bold">
              <Sparkles size={12} className="animate-pulse text-[#A80689]" /> กำลังค้นหาข้อมูลจาก RAG...
            </div>
          </div>
        )}
        <div ref={endRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-white/90 to-transparent shrink-0">
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md pl-3 pr-1.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="ถาม PEA Brain..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-[13px] font-medium outline-none text-gray-800 placeholder:text-gray-400 disabled:opacity-50 min-w-0"
          />
          <button 
            onClick={handleClearChat}
            disabled={isLoading || messages.length <= 1}
            className="w-8 h-8 shrink-0 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="ล้างประวัติแชท (Clear Chat)"
          >
            <Trash2 size={15} />
          </button>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#A80689] to-[#7b0365] text-white flex items-center justify-center disabled:opacity-50 hover:shadow-md transition-all cursor-pointer"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
