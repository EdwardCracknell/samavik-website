// Fetches TheDogSpot's public App Store screenshots once, through Apple's public lookup, for the work plate (stored in the repository; never hot-linked).
// Run: node tools/fetch-thedogspot.mjs <outdir>
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const j = await (await fetch('https://itunes.apple.com/lookup?id=6755788049&country=gb')).json();
const r = j.results[0]; console.log(r.trackName, r.sellerName, (r.screenshotUrls || []).length, 'iphone;', (r.ipadScreenshotUrls || []).length, 'ipad');
for (const [i, u] of (r.screenshotUrls || []).entries()) { const hi = u.replace(/\/\d+x\d+bb\.jpg$/, '/720x1560bb.jpg'); const b = Buffer.from(await (await fetch(hi)).arrayBuffer()); fs.writeFileSync(`${out}/thedogspot-${i + 1}${u.slice(u.lastIndexOf('.'))}`, b); console.log(u); }
