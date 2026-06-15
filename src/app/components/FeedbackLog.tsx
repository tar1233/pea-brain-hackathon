"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Clock, MapPin, User, ArrowUpRight, Trash2 } from "lucide-react";

interface FeedbackPin {
  id: string;
  x: number;
  y: number;
  role: string;
  name: string;
  text: string;
  timestamp: string;
  tabId?: string;
}

const DEMO_LOGS: FeedbackPin[] = [
  {
    id: "demo-1",
    x: 450, y: 250,
    role: "กรรมการ กฟภ.",
    name: "ดร. สมชาย",
    text: "โมเดล VMI น่าสนใจมาก สามารถช่วยลด Holding Cost ได้เยอะ แต่มีแผนรองรับกรณี Supplier ส่งของไม่ทันตามรอบไหม?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    tabId: "roadmap"
  },
  {
    id: "demo-2",
    x: 820, y: 550,
    role: "Mentor",
    name: "พี่ตาร์",
    text: "หน้านี้เจ๋งมาก! ลองเพิ่ม Feature แจ้งเตือนผ่าน LINE Notify ส่งตรงเข้ามือถือผู้บริหารดู จะทำให้ระบบสมบูรณ์ขึ้น",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    tabId: "dashboard"
  },
  {
    id: "demo-3",
    x: 300, y: 700,
    role: "Product Owner",
    name: "ทีมจัดซื้อ",
    text: "ขอเพิ่มคอลัมน์เปรียบเทียบราคากลางกับราคา e-Bidding ครั้งล่าสุดด้วยครับ จะได้รู้ว่าประหยัดไปเท่าไหร่",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    tabId: "ebidding"
  }
];

export default function FeedbackLog() {
  const [history, setHistory] = useState<FeedbackPin[]>([]);
  const [isLocalhost, setIsLocalhost] = useState(false);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem("pea_feedback_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
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

  const handleGotoComment = (pin: FeedbackPin) => {
    // Switch tab if tabId exists
    if (pin.tabId) {
      window.dispatchEvent(new CustomEvent('change-tab', { detail: { tabId: pin.tabId } }));
    }
    // Scroll to the Y position
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
    <div className="space-y-4 animate-fade-in w-full max-w-[1600px] mx-auto pt-6 px-6 lg:px-8 feedback-ignore-click">
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
            className="text-[16.5px] text-purple-600 hover:text-white border border-purple-400 hover:bg-purple-500 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
            title="โหลดข้อมูลจำลองสำหรับการพรีเซนต์"
          >
            <Clock size={12} /> กู้คืนข้อมูล (Demo)
          </button>
          <button 
            onClick={handleClearAll}
            className="text-[16.5px] text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            <Trash2 size={12} /> ล้างข้อมูลทั้งหมด
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {history.map((pin, i) => (
          <div 
            key={i} 
            onClick={() => handleGotoComment(pin)}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className={`text-[16.5px] px-2 py-0.5 rounded-full font-bold ${getRoleColor(pin.role)}`}>
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
                  className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 z-10"
                  title="ลบความคิดเห็น"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p className="text-[16.5px] text-slate-700 leading-relaxed font-medium">
              "{pin.text}"
            </p>

            <div className="mt-auto pt-2 flex justify-between items-center border-t border-slate-100 text-[16.5px] text-slate-500">
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
