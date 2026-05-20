"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, User, AlertTriangle, Shield, Info, ArrowRight, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { aiRecommendations } from "../data/mockData";

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
  content: "สวัสดีครับ! ผม PEA Brain ผู้ช่วยวิเคราะห์ข้อมูลจัดซื้อพัสดุ (เชื่อมต่อกับ Bedrock Knowledge Base เรียบร้อย)\n\nลองถามผมได้เลย เช่น:\n- สรุปสถานะหม้อแปลง 10067 หน่อย\n- Demand ของปี 2569 คือกี่เครื่อง",
};

export default function AICopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pea_brain_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("pea_brain_chat_history", JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
        
        // Append citations if they exist to show off the RAG capability to judges
        if (data.citations && data.citations.length > 0) {
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

  return (
    <aside className="w-[320px] shrink-0 bg-white/60 backdrop-blur-3xl border-l border-white/60 shadow-[-10px_0_40px_rgb(0,0,0,0.03)] flex flex-col h-screen relative z-40">
      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-100/50 bg-transparent shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-50 to-[#f4d4ec]/40 border border-purple-100/50 flex items-center justify-center shadow-sm">
            <Sparkles size={16} className="text-[#A80689]" />
          </div>
          <div>
            <div className="text-[13px] font-extrabold text-gray-900 tracking-tight">PEA Brain Copilot</div>
            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 font-semibold">
              <Bot size={10} /> AWS Bedrock RAG Connected
            </div>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all cursor-pointer"
          title="ล้างประวัติแชท"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Recommendations (Scrollable top half) */}
      <div className="px-4 py-4 space-y-3 bg-gradient-to-b from-white/30 to-transparent shrink-0 border-b border-gray-100/30">
        <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1">คำแนะนำด่วน (Auto-generated)</div>
        {aiRecommendations.slice(0, 2).map((rec, i) => {
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
              <div className={`${msg.role === "user" ? "whitespace-pre-wrap" : "text-gray-800"} prose-sm`}>
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      strong: ({node, ...props}) => <strong className="font-extrabold text-gray-900" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 my-1 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-1 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="leading-snug m-0 p-0 font-medium" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-snug font-medium" {...props} />,
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
        <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-100 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="ถาม PEA Brain..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-[13px] font-medium outline-none text-gray-800 placeholder:text-gray-400 disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A80689] to-[#7b0365] text-white flex items-center justify-center disabled:opacity-50 hover:shadow-md transition-all cursor-pointer"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
