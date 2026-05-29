const fs = require('fs');
let content = fs.readFileSync('src/app/components/TopBar.tsx', 'utf8');

// Dashboard
content = content.replace(
  '      title: "หน้า Dashboard",\n      content: (\n        <div className="space-y-4">\n          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50',
  '      title: "หน้า Dashboard",\n      content: (\n        <div className="space-y-4">\n          <ScreenshotPreview src="/manual/01_dashboard.png" alt="หน้า Overview Dashboard" />\n          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50'
);

// Risk Management
content = content.replace(
  '      title: "Risk Management",\n      content: (\n        <div className="space-y-4">\n          <div className="text-[14px] text-slate-700 leading-relaxed">',
  '      title: "Risk Management",\n      content: (\n        <div className="space-y-4">\n          <ScreenshotPreview src="/manual/02_risk.png" alt="หน้า Risk Management" />\n          <div className="text-[14px] text-slate-700 leading-relaxed">'
);

// Tracking & Monitoring
content = content.replace(
  '      title: "Tracking & Monitoring",\n      content: (\n        <div className="space-y-4">\n          <div className="text-[14px] text-slate-700 leading-relaxed">',
  '      title: "Tracking & Monitoring",\n      content: (\n        <div className="space-y-4">\n          <ScreenshotPreview src="/manual/03_tracking.png" alt="หน้า Tracking & Monitoring" />\n          <div className="text-[14px] text-slate-700 leading-relaxed">'
);

// AI Copilot
content = content.replace(
  '      title: "AI Copilot (แชทบอท)",\n      content: (\n        <div className="space-y-4">\n          <div className="text-[14px] text-slate-700 leading-relaxed">',
  '      title: "AI Copilot (แชทบอท)",\n      content: (\n        <div className="space-y-4">\n          <ScreenshotPreview src="/manual/05_chat.png" alt="AI Copilot" />\n          <div className="text-[14px] text-slate-700 leading-relaxed">'
);

fs.writeFileSync('src/app/components/TopBar.tsx', content);
console.log("Added screenshots!");
