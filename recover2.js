const fs = require('fs');
const transcriptPath = '/Users/tchit/.gemini/antigravity/brain/1d6b964d-eedf-46de-87af-2b2ec42200dd/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

let bestMatch = "";
let maxLines = 0;

for (const line of lines) {
  if (!line) continue;
  try {
    const step = JSON.parse(line);
    if (step.content && step.content.includes("File Path: `file:///Users/tchit/Documents/Virtual_Tech_HQ/15_PEA_Hackathon_2026/pea-brain/src/app/components/TopBar.tsx`")) {
        // extract the content
        let code = step.content;
        const matches = code.match(/\d+: (.*)/g);
        if (matches && matches.length > maxLines) {
            maxLines = matches.length;
            bestMatch = matches.map(m => m.replace(/^\d+:\s?/, '')).join('\n');
        }
    }
  } catch(e) {}
}

if (bestMatch) {
    fs.writeFileSync('TopBar_recovered.tsx', bestMatch);
    console.log("Recovered lines: " + maxLines);
} else {
    console.log("No match found");
}
