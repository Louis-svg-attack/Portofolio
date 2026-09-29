const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// --- HTML img src ---
// Card 1 (3rd PLACE): cert2.jpg -> cert1.jpg
h = h.replace(
  'src="cert2.jpg" alt="3rd PLACE - Pentest Exposed Quiz Competition"',
  'src="cert1.jpg" alt="3rd PLACE - Pentest Exposed Quiz Competition"'
);
// Card 2 (Finalis): cert3.jpg -> cert2.jpg
h = h.replace(
  'src="cert3.jpg" alt="Finalis - Jember Cyber Clash 2026"',
  'src="cert2.jpg" alt="Finalis - Jember Cyber Clash 2026"'
);
// Card 3 (Webinar): cert1.jpg -> cert3.jpg
h = h.replace(
  'src="cert1.jpg" alt="PENTEST EXPOSED: Webinar Participant"',
  'src="cert3.jpg" alt="PENTEST EXPOSED: Webinar Participant"'
);

// --- JS certificatesData array ---
// index 0 (3rd PLACE): cert2.jpg -> cert1.jpg
h = h.replace(/("3rd PLACE[^"]*"[\s\S]*?image:\s*)"cert2\.jpg"/, '$1"cert1.jpg"');
// index 1 (Finalis): cert3.jpg -> cert2.jpg
h = h.replace(/("Finalis[^"]*"[\s\S]*?image:\s*)"cert3\.jpg"/, '$1"cert2.jpg"');
// index 2 (Webinar): cert1.jpg -> cert3.jpg
h = h.replace(/("PENTEST EXPOSED[^"]*"[\s\S]*?image:\s*)"cert1\.jpg"/, '$1"cert3.jpg"');

fs.writeFileSync('index.html', h, 'utf8');

// Verify
const lines = h.split('\n');
const results = [];
lines.forEach((l, i) => { if (/cert[123]\.jpg/.test(l)) results.push((i+1) + ' ' + l.trim().substring(0, 90)); });
console.log('Done. Changes:');
results.forEach(r => console.log(r));
