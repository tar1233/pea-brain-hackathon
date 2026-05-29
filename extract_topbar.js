const fs = require('fs');
const transcriptPath = '/Users/tchit/.gemini/antigravity/brain/1d6b964d-eedf-46de-87af-2b2ec42200dd/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

let index = 0;
fs.mkdirSync('topbar_history', { recursive: true });

for (const line of lines) {
  if (!line) continue;
  try {
    const step = JSON.parse(line);
    if (step.content && step.content.includes("File Path: `file:///Users/tchit/Documents/Virtual_Tech_HQ/15_PEA_Hackathon_2026/pea-brain/src/app/components/TopBar.tsx`")) {
        const matches = step.content.match(/\d+: (.*)/g);
        if (matches) {
            const content = matches.map(m => m.replace(/^\d+:\s?/, '')).join('\n');
            fs.writeFileSync(`topbar_history/topbar_${index}.txt`, content);
            index++;
        }
    }
  } catch(e) {}
}
console.log(`Extracted ${index} views of TopBar.tsx`);
