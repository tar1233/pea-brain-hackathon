"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Clock, MapPin, User, ArrowUpRight, Trash2, Sparkles, Bell, X, MessageCircle } from "lucide-react";

interface FeedbackPin {
  id: string;
  x: number;
  y: number;
  role: string;
  name: string;
  text: string;
  timestamp: string;
  tabId?: string;
  reply?: string;
}

const DEMO_LOGS: FeedbackPin[] = [
  {
    id: "demo-1",
    x: 450, y: 250,
    role: "กรรมการ กฟภ.",
    name: "ดร. สมชาย",
    text: "โมเดล VMI น่าสนใจมาก สามารถช่วยลด Holding Cost ได้เยอะ แต่มีแผนรองรับกรณี Supplier ส่งของไม่ทันตามรอบไหม?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    tabId: "roadmap",
    reply: "เรียน ดร. สมชาย กฟภ. มีแผนรองรับโดยการกำหนด Dynamic Safety Stock เพิ่มเป็น 100 วัน และกำหนดในเงื่อนไขการประมูล (TOR) ให้ผู้ชนะแบบ VMI ต้องสำรองพัสดุขั้นต่ำ 1 งวดในคลังของผู้ขายเองพร้อมส่งมอบใน 3-7 วัน (Call-off) เพื่อลดความเสี่ยงอย่างสมบูรณ์แบบครับ"
  },
  {
    id: "demo-2",
    x: 820, y: 550,
    role: "Mentor",
    name: "พี่ตาร์",
    text: "หน้านี้เจ๋งมาก! ลองเพิ่ม Feature แจ้งเตือนผ่าน LINE Notify ส่งตรงเข้ามือถือผู้บริหารดู จะทำให้ระบบสมบูรณ์ขึ้น",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    tabId: "dashboard",
    reply: "ขอบคุณครับพี่ตาร์ ทีมงานได้เชื่อมต่อระบบ LINE Notify Alert ในหน้าเฝ้าระวังความเสี่ยงเรียบร้อยแล้ว เมื่อระดับสต็อกต่ำกว่าจุดสั่งซื้อใหม่ (ROP) ระบบจะยิงการแจ้งเตือนพร้อมลิ้งก์สรุป Dashboard เข้ามือถือผู้บริหารและเจ้าหน้าที่ทันทีครับ"
  },
  {
    id: "demo-3",
    x: 300, y: 700,
    role: "Product Owner",
    name: "ทีมจัดซื้อ",
    text: "ขอเพิ่มคอลัมน์เปรียบเทียบราคากลางกับราคา e-Bidding ครั้งล่าสุดด้วยครับ จะได้รู้ว่าประหยัดไปเท่าไหร่",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    tabId: "ebidding",
    reply: "รับทราบครับทีมจัดซื้อ ตอนนี้เราได้เพิ่มคอลัมน์เปรียบเทียบราคากลาง vs ราคา e-Bidding ล่าสุด และแสดงสรุปยอดประหยัด TCO ในตารางข้อมูลจัดซื้อเรียบร้อยแล้วครับ"
  }
];

export default function FeedbackLog() {
  const [history, setHistory] = useState<FeedbackPin[]>([]);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [loadingReply, setLoadingReply] = useState<{ [key: string]: boolean }>({});

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem("pea_feedback_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter((item: any) => item && typeof item === 'object' && item.id && item.role && item.text);
          const hasReplies = validItems.some((item: any) => item.reply);
          if (validItems.length === 0 || !hasReplies) {
            localStorage.setItem("pea_feedback_history", JSON.stringify(DEMO_LOGS));
            setHistory(DEMO_LOGS);
          } else {
            setHistory(validItems);
          }
        } else {
          localStorage.setItem("pea_feedback_history", JSON.stringify(DEMO_LOGS));
          setHistory(DEMO_LOGS);
        }
      } else {
        localStorage.setItem("pea_feedback_history", JSON.stringify(DEMO_LOGS));
        setHistory(DEMO_LOGS);
      }
    } catch (e) {
      console.error(e);
      localStorage.setItem("pea_feedback_history", JSON.stringify(DEMO_LOGS));
      setHistory(DEMO_LOGS);
    }
  };

  useEffect(() => {
    loadHistory();
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    window.addEventListener('feedback-history-updated', loadHistory);
    return () => window.removeEventListener('feedback-history-updated', loadHistory);
  }, []);



  const handleClearAll = () => {
    if (confirm("ต้องการลบข้อเสนอแนะทั้งหมดใช่หรือไม่? (คุณสามารถกดกู้คืนได้ภายหลัง)")) {
      localStorage.removeItem("pea_feedback_history");
      setHistory([]);
      window.dispatchEvent(new CustomEvent('feedback-history-updated'));
    }
  };

  const handleRestoreDemo = () => {
    localStorage.setItem("pea_feedback_history", JSON.stringify(DEMO_LOGS));
    setHistory(DEMO_LOGS);
    window.dispatchEvent(new CustomEvent('feedback-history-updated'));
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('th-TH')} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit'})}`;
  };

  const getRoleColor = (role: string) => {
    if (role.includes("กรรมการ")) return "bg-amber-500 text-white";
    if (role.includes("Mentor")) return "bg-purple-500 text-white";
    if (role.includes("PO") || role.includes("Product Owner")) return "bg-blue-500 text-white";
    return "bg-slate-500 text-white";
  };

  const handleDelete = (e: React.MouseEvent, indexToDelete: number) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("pea_feedback_history");
      if (saved) {
        const currentHistory = JSON.parse(saved);
        const newHistory = currentHistory.filter((_: any, i: number) => i !== indexToDelete);
        localStorage.setItem("pea_feedback_history", JSON.stringify(newHistory));
        setHistory(newHistory);
        window.dispatchEvent(new CustomEvent('feedback-history-updated'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveReply = (id: string, text: string) => {
    const updated = history.map(item => {
      if (item.id === id) {
        return { ...item, reply: text };
      }
      return item;
    });
    localStorage.setItem("pea_feedback_history", JSON.stringify(updated));
    setHistory(updated);
    window.dispatchEvent(new CustomEvent('feedback-history-updated'));
  };

  const handleCustomReplySubmit = (id: string) => {
    const text = replyInputs[id] || "";
    if (!text.trim()) return;
    handleSaveReply(id, text);
    setReplyInputs(prev => ({ ...prev, [id]: "" }));
  };

  const handleAIReply = async (item: FeedbackPin) => {
    setLoadingReply(prev => ({ ...prev, [item.id]: true }));
    
    const getPredefinedReply = (text: string) => {
      if (text.includes("VMI") || text.includes("ไม่ทัน")) {
        return "เรียน ดร. สมชาย กฟภ. มีแผนรองรับโดยการกำหนด Dynamic Safety Stock เพิ่มเป็น 100 วัน และกำหนดในเงื่อนไขการประมูล (TOR) ให้ผู้ชนะแบบ VMI ต้องสำรองพัสดุขั้นต่ำ 1 งวดในคลังของผู้ขายเองพร้อมส่งมอบใน 3-7 วัน (Call-off) เพื่อลดความเสี่ยงอย่างสมบูรณ์แบบครับ";
      }
      if (text.includes("LINE Notify") || text.includes("แจ้งเตือน")) {
        return "ขอบคุณครับพี่ตาร์ ทีมงานได้เชื่อมต่อระบบ LINE Notify Alert ในหน้าเฝ้าระวังความเสี่ยงเรียบร้อยแล้ว เมื่อระดับสต็อกต่ำกว่าจุดสั่งซื้อใหม่ (ROP) ระบบจะยิงการแจ้งเตือนพร้อมลิ้งก์สรุป Dashboard เข้ามือถือผู้บริหารและเจ้าหน้าที่ทันทีครับ";
      }
      if (text.includes("เปรียบเทียบราคากลาง") || text.includes("ประหยัด")) {
        return "รับทราบครับทีมจัดซื้อ ตอนนี้เราได้เพิ่มคอลัมน์เปรียบเทียบราคากลาง vs ราคา e-Bidding ล่าสุด และแสดงสรุปยอดประหยัด TCO ในตารางข้อมูลจัดซื้อเรียบร้อยแล้วครับ";
      }
      return "";
    };

    const localAnswer = getPredefinedReply(item.text);

    try {
      if (localAnswer) {
        await new Promise(r => setTimeout(r, 600));
        handleSaveReply(item.id, localAnswer);
      } else {
        const prompt = `คุณคือทีมพัฒนา PEA Brain ระบบผู้ช่วย AI สำหรับจัดการจัดซื้อพัสดุของการไฟฟ้าส่วนภูมิภาค (PEA)
มีผู้ใช้งานส่งข้อเสนอแนะ/คำถามมาดังนี้:
บทบาท: ${item.role}
ชื่อ: ${item.name}
ข้อความ: "${item.text}"

จงเขียนคำตอบที่สุภาพ เป็นมืออาชีพ สั้นกระชับ และระบุแนวทางพัฒนา/แก้ไขในฐานะทีมพัฒนา PEA Brain (ห้ามเกิน 3 ประโยค ห้ามถามคำถามกลับ):`;
        
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
        });
        const data = await response.json();
        if (data.content) {
          handleSaveReply(item.id, data.content.trim());
        } else {
          throw new Error("Empty AI response");
        }
      }
    } catch (err) {
      console.warn("AI reply failed, using local template:", err);
      const fallbackMsg = localAnswer || `รับทราบข้อเสนอแนะของ ${item.name} ครับ ทีมพัฒนาจะนำไปปรับปรุงระบบในส่วนนี้ให้ดียิ่งขึ้นครับ`;
      handleSaveReply(item.id, fallbackMsg);
    } finally {
      setLoadingReply(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleGotoComment = (pin: FeedbackPin) => {
    if (pin.tabId) {
      window.dispatchEvent(new CustomEvent('change-tab', { detail: { tabId: pin.tabId } }));
    }
    setTimeout(() => {
      window.scrollTo({ top: Math.max(0, pin.y - 100), behavior: 'smooth' });
    }, 100);
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-[1600px] mx-auto pt-6 px-6 lg:px-8 flex justify-center pb-8">
        <button 
          onClick={handleRestoreDemo}
          className="text-[16.5px] text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-4 py-2 rounded-full transition-colors flex items-center gap-2 font-semibold shadow-sm"
        >
          <Clock size={16} /> กู้คืนข้อมูลตัวอย่างสำหรับการพรีเซนต์ (Restore Demo Data)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in w-full max-w-[1600px] mx-auto pt-6 px-6 lg:px-8 feedback-ignore-click pb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#A80689]" />
          <h3 className="font-bold text-lg text-slate-800 tracking-tight">รายการข้อเสนอแนะ (Feedback Log)</h3>
          <span className="bg-purple-100 text-[#A80689] px-2 py-0.5 rounded-full text-[16.5px] font-bold">
            ทั้งหมด {history.length} รายการ
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRestoreDemo}
            className="text-[16.5px] text-purple-600 hover:text-white border border-purple-400 hover:bg-purple-500 px-3 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
            title="โหลดข้อมูลจำลองสำหรับการพรีเซนต์"
          >
            <Clock size={12} /> กู้คืนข้อมูล (Demo)
          </button>
          <button 
            onClick={handleClearAll}
            className="text-[16.5px] text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-3 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={12} /> ล้างข้อมูลทั้งหมด
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {history.map((pin, i) => (
          <div 
            key={i} 
            onClick={() => handleGotoComment(pin)}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className={`text-[16.5px] px-2.5 py-0.5 rounded-full font-bold ${getRoleColor(pin.role)}`}>
                  {pin.role}
                </span>
                {pin.name && (
                  <span className="text-[16.5px] font-semibold text-slate-600 flex items-center gap-1">
                    <User size={12} /> {pin.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[16.5px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> {formatDate(pin.timestamp)}
                </div>
                <button 
                  onClick={(e) => handleDelete(e, i)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 z-10 cursor-pointer"
                  title="ลบความคิดเห็น"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-semibold bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              "{pin.text}"
            </p>

            {/* Replies section */}
            {pin.reply ? (
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3.5 space-y-1 animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between text-[16.5px] font-bold text-purple-800">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-[#A80689]" />
                    <span>คำชี้แจง / การพัฒนา:</span>
                  </div>
                  <button 
                    onClick={() => handleSaveReply(pin.id, "")}
                    className="text-slate-400 hover:text-slate-600 text-[16.5px] font-medium transition cursor-pointer"
                  >
                    แก้ไข
                  </button>
                </div>
                <p className="text-[16.5px] text-slate-700 leading-relaxed font-medium">
                  {pin.reply}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-1 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <div className="text-[16.5px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <span>ตอบกลับข้อเสนอแนะนี้:</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์ตอบกลับ..."
                    value={replyInputs[pin.id] || ""}
                    onChange={(e) => setReplyInputs(prev => ({ ...prev, [pin.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomReplySubmit(pin.id)}
                    className="flex-1 text-[16.5px] font-medium border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                  <button
                    onClick={() => handleCustomReplySubmit(pin.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[16.5px] font-bold cursor-pointer transition-colors"
                  >
                    ส่ง
                  </button>
                </div>
                <button
                  onClick={() => handleAIReply(pin)}
                  disabled={loadingReply[pin.id]}
                  className="w-full py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-xl text-[16.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loadingReply[pin.id] ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span>AI กำลังร่างคำชี้แจง...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-purple-600 animate-pulse" />
                      <span>AI ช่วยร่างคำชี้แจง (Auto Response)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="mt-auto pt-3 flex justify-between items-center border-t border-slate-100 text-[16.5px] text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                <span>แท็บ: {pin.tabId === 'roadmap' ? 'Roadmap' : pin.tabId === 'dashboard' ? 'Overview' : pin.tabId === 'ebidding' ? 'e-Bidding' : pin.tabId || 'ไม่ระบุ'}</span>
              </div>
              <div className="flex items-center gap-1 text-[#A80689] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                ไปยังจุดคอมเมนต์ <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
