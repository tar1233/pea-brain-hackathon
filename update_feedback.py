import sys

file_path = "src/app/components/FeedbackLog.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add Trash icon import
import_lucide = 'import { MessageSquare, Clock, MapPin, User, ArrowUpRight } from "lucide-react";'
new_import_lucide = 'import { MessageSquare, Clock, MapPin, User, ArrowUpRight, Trash2 } from "lucide-react";'
if import_lucide in content:
    content = content.replace(import_lucide, new_import_lucide)

# Add isLocalhost state
state_block = """  const [history, setHistory] = useState<FeedbackPin[]>([]);"""
new_state_block = """  const [history, setHistory] = useState<FeedbackPin[]>([]);
  const [isLocalhost, setIsLocalhost] = useState(false);"""
if state_block in content:
    content = content.replace(state_block, new_state_block)

# Check localhost in useEffect
use_effect_block = """  useEffect(() => {
    loadHistory();
    window.addEventListener('feedback-history-updated', loadHistory);
    return () => window.removeEventListener('feedback-history-updated', loadHistory);
  }, []);"""
new_use_effect_block = """  useEffect(() => {
    loadHistory();
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    window.addEventListener('feedback-history-updated', loadHistory);
    return () => window.removeEventListener('feedback-history-updated', loadHistory);
  }, []);"""
if use_effect_block in content:
    content = content.replace(use_effect_block, new_use_effect_block)

# Add handleDelete
delete_func = """
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
"""
insert_handle = "  const handleGotoComment = (pin: FeedbackPin) => {"
if insert_handle in content and "handleDelete" not in content:
    content = content.replace(insert_handle, delete_func + "\n" + insert_handle)

# Add Trash button
date_block = """              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock size={10} /> {formatDate(pin.timestamp)}
              </div>"""
new_date_block = """              <div className="flex items-center gap-2">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> {formatDate(pin.timestamp)}
                </div>
                {isLocalhost && (
                  <button 
                    onClick={(e) => handleDelete(e, i)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 z-10"
                    title="ลบความคิดเห็น"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>"""
if date_block in content:
    content = content.replace(date_block, new_date_block)

with open(file_path, "w") as f:
    f.write(content)
print("Updated FeedbackLog.tsx")
