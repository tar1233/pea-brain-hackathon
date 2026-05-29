import sys

# Patch page.tsx
with open("src/app/page.tsx", "r") as f:
    content = f.read()

if "isSidebarOpen" not in content:
    # Add state
    import_react = 'import { useState, useEffect } from "react";'
    new_state = """  const [isSidebarOpen, setIsSidebarOpen] = useState(false);"""
    
    # We need to find the Home component
    content = content.replace("export default function Home() {", f"export default function Home() {{\n{new_state}")
    
    # We need to pass setIsSidebarOpen to TopBar and Sidebar
    content = content.replace(
        "<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />",
        '<div className={`fixed inset-0 z-[9999] bg-black/50 transition-opacity md:hidden ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsSidebarOpen(false)} />\n      <div className={`fixed md:static inset-y-0 left-0 z-[10000] transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>\n        <Sidebar activeTab={activeTab} setActiveTab={(tab) => {setActiveTab(tab); setIsSidebarOpen(false);}} />\n      </div>'
    )
    
    content = content.replace(
        "<TopBar activeTab={activeTab} />",
        "<TopBar activeTab={activeTab} onMenuClick={() => setIsSidebarOpen(true)} />"
    )
    
    with open("src/app/page.tsx", "w") as f:
        f.write(content)

# Patch TopBar.tsx
with open("src/app/components/TopBar.tsx", "r") as f:
    content = f.read()

if "onMenuClick" not in content:
    import_lucide = 'import { Search, Bell, Download, ChevronDown, HelpCircle, Loader2, BrainCircuit } from "lucide-react";'
    new_import_lucide = 'import { Search, Bell, Download, ChevronDown, HelpCircle, Loader2, BrainCircuit, Menu } from "lucide-react";'
    content = content.replace(import_lucide, new_import_lucide)
    
    props = "interface TopBarProps {\n  activeTab: string;\n}"
    new_props = "interface TopBarProps {\n  activeTab: string;\n  onMenuClick?: () => void;\n}"
    content = content.replace(props, new_props)
    
    func = "export default function TopBar({ activeTab }: TopBarProps) {"
    new_func = "export default function TopBar({ activeTab, onMenuClick }: TopBarProps) {"
    content = content.replace(func, new_func)
    
    header = '    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-gray-100/60 bg-white/60 px-8 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">'
    new_header = '    <header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-gray-100/60 bg-white/60 px-4 md:px-8 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">\n      <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">\n        <Menu size={24} />\n      </button>'
    content = content.replace(header, new_header)
    
    # Hide date and time on very small screens to make room
    date_span = '<span className="text-[13px] text-[#8a94ab]">{dateStr} • {timeStr} น.</span>'
    new_date_span = '<span className="hidden md:inline text-[13px] text-[#8a94ab]">{dateStr} • {timeStr} น.</span>'
    content = content.replace(date_span, new_date_span)
    
    with open("src/app/components/TopBar.tsx", "w") as f:
        f.write(content)

print("Patched layout")
