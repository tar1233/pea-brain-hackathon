const fs = require('fs');
let content = fs.readFileSync('src/app/components/TopBar.tsx', 'utf8');

// Add onMenuClick to Props
content = content.replace(
  'interface TopBarProps {\n  activeTab: string;\n}',
  'interface TopBarProps {\n  activeTab: string;\n  onMenuClick?: () => void;\n}'
);

content = content.replace(
  'export default function TopBar({ activeTab }: TopBarProps) {',
  'export default function TopBar({ activeTab, onMenuClick }: TopBarProps) {'
);

// Add Menu button to header
content = content.replace(
  '<header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-gray-100/60 bg-white/60 px-8 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">\n      <div>',
  `<header className="flex h-[72px] shrink-0 items-center gap-4 border-b border-gray-100/60 bg-white/60 px-4 md:px-8 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
      <button 
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
      <div>`
);

fs.writeFileSync('src/app/components/TopBar.tsx', content);
