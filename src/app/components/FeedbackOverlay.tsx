"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, Send, User, MapPin, ChevronDown } from "lucide-react";

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

interface SavedUser {
  role: string;
  name: string;
}

export default function FeedbackOverlay() {
  const [isModeOn, setIsModeOn] = useState(false);
  const [pins, setPins] = useState<FeedbackPin[]>([]);
  const [activeDraft, setActiveDraft] = useState<{ x: number; y: number } | null>(null);
  
  const [formRole, setFormRole] = useState("คณะกรรมการ (Judge)");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const rolesList = ["คณะกรรมการ (Judge)", "Product Owner (PO)", "Mentor", "ผู้ใช้งานทั่วไป"];

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedPins = localStorage.getItem("pea_feedback_comments");
      if (savedPins) {
        setPins(JSON.parse(savedPins));
      }
      
      const savedUser = localStorage.getItem("pea_feedback_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as SavedUser;
        if (parsed.role) setFormRole(parsed.role);
        if (parsed.name) setFormName(parsed.name);
      }
    } catch (e) {
      console.error("Error loading feedback data", e);
    }
  }, []);

  // Listen to toggle events from Sidebar
  useEffect(() => {
    const handler = () => {
      setIsModeOn(prev => !prev);
    };
    window.addEventListener('toggle-feedback', handler);
    return () => window.removeEventListener('toggle-feedback', handler);
  }, []);

  // Dispatch state change whenever isModeOn changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('feedback-state-change', { detail: { isOn: isModeOn } }));
  }, [isModeOn]);

  // Global click listener to drop pins (replaces the fixed overlay)
  useEffect(() => {
    if (!isModeOn) return;
    
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Ignore clicks on sidebar, existing pins, or the draft popup
      if (target.closest("aside") || target.closest(".feedback-ignore-click")) {
        return;
      }
      
      // Prevent default interactions (like following links) while in feedback mode
      e.preventDefault();
      e.stopPropagation();
      
      setActiveDraft({ x: e.pageX, y: e.pageY });
      setFormText("");
    };

    // Use capture phase to intercept before React onClick handlers
    document.addEventListener("click", handleGlobalClick, { capture: true });
    
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, [isModeOn]);

  const handleSavePin = () => {
    if (!activeDraft || !formText.trim()) return;

    const newPin: FeedbackPin = {
      id: "pin-" + Date.now(),
      x: activeDraft.x,
      y: activeDraft.y,
      role: formRole,
      name: formName,
      text: formText,
      timestamp: new Date().toISOString(),
      tabId: localStorage.getItem("pea_active_tab") || "risk",
    };

    const newPins = [...pins, newPin];
    setPins(newPins);
    localStorage.setItem("pea_feedback_comments", JSON.stringify(newPins));
    
    // Add to history log
    const savedHistory = localStorage.getItem("pea_feedback_history");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    localStorage.setItem("pea_feedback_history", JSON.stringify([...history, newPin]));
    window.dispatchEvent(new CustomEvent('feedback-history-updated'));
    
    // Remember user
    localStorage.setItem("pea_feedback_user", JSON.stringify({ role: formRole, name: formName }));
    
    setActiveDraft(null);
  };

  const handleCancelDraft = () => {
    setActiveDraft(null);
  };

  const handleDeletePin = (id: string) => {
    const newPins = pins.filter(p => p.id !== id);
    setPins(newPins);
    localStorage.setItem("pea_feedback_comments", JSON.stringify(newPins));
  };

  // Helper to format date
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('th-TH')} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit'})}`;
  };

  // Get color by role
  const getRoleColor = (role: string) => {
    if (role.includes("กรรมการ")) return "bg-amber-500";
    if (role.includes("Mentor")) return "bg-purple-500";
    if (role.includes("PO") || role.includes("Product Owner")) return "bg-blue-500";
    return "bg-slate-500";
  };

  return (
    <>
      {/* Mode Indicator Overlay Header */}
      {isModeOn && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-amber-500 z-[9998] animate-pulse pointer-events-none" />
      )}

      {/* Render existing pins */}
      {isModeOn && pins.map((pin) => (
        <div 
          key={pin.id}
          className="absolute z-[9998] feedback-ignore-click"
          style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -100%)" }}
          onMouseEnter={() => setHoveredPin(pin.id)}
          onMouseLeave={() => setHoveredPin(null)}
        >
          <div className="relative group cursor-pointer">
            <MapPin 
              size={32} 
              className={`drop-shadow-md ${getRoleColor(pin.role).replace("bg-", "text-")} fill-white`} 
            />
            
            {/* Tooltip */}
            {(hoveredPin === pin.id || activeDraft === null) && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+8px)] w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${getRoleColor(pin.role)}`} />
                    <span className="text-[11px] font-bold text-slate-700">{pin.role}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeletePin(pin.id); }}
                    className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
                {pin.name && (
                  <div className="text-[12px] font-semibold text-slate-900 mb-1 flex items-center gap-1">
                    <User size={10} /> {pin.name}
                  </div>
                )}
                <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{pin.text}</p>
                <div className="text-[9px] text-slate-400 mt-2 text-right">
                  {formatDate(pin.timestamp)}
                </div>
                {/* Triangle pointer */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Render Draft Popup */}
      {isModeOn && activeDraft && (
        <div 
          className="absolute z-[9999] feedback-ignore-click bg-white rounded-2xl shadow-2xl border border-amber-200 p-4 w-72 animate-in zoom-in-95 duration-150"
          style={{ 
            left: activeDraft.x, 
            top: activeDraft.y,
            transform: "translate(-50%, -100%)",
            marginTop: "-16px" // Offset slightly above the clicked point
          }}
        >
          {/* Triangle pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white z-10" />
          <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 border-8 border-transparent border-t-amber-200 z-0" />

          <div className="flex justify-between items-center mb-3 relative z-20">
            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-amber-500" />
              เพิ่มข้อเสนอแนะ
            </h3>
            <button onClick={handleCancelDraft} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">ตำแหน่ง (Role)</label>
              <div 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`w-full text-[12px] p-2 rounded-lg bg-slate-50 border cursor-pointer flex justify-between items-center transition-colors ${
                  isRoleDropdownOpen ? "border-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.2)]" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="text-slate-700 font-medium">{formRole}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
              </div>
              
              {isRoleDropdownOpen && (
                <div className="absolute top-[105%] left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[10001] animate-in fade-in slide-in-from-top-2 duration-150">
                  {rolesList.map(r => (
                    <div 
                      key={r}
                      onClick={() => { setFormRole(r); setIsRoleDropdownOpen(false); }}
                      className={`px-3 py-2.5 text-[12px] cursor-pointer transition-colors flex items-center ${
                        formRole === r 
                          ? 'bg-amber-50 text-amber-700 font-bold' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">ชื่อ (ไม่บังคับ)</label>
              <input 
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="เช่น อ.เอก, พี่หนุ่ม"
                className="w-full text-[12px] p-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">ข้อเสนอแนะ</label>
              <textarea 
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="พิมพ์ข้อเสนอแนะที่นี่..."
                rows={3}
                className="w-full text-[12px] p-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleCancelDraft}
                className="flex-1 py-2 rounded-xl text-[12px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSavePin}
                disabled={!formText.trim()}
                className="flex-1 py-2 rounded-xl text-[12px] font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Send size={12} />
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
