// Today's site (the repository's main, served from a scratch folder) at the same widths, for the side-by-side sheets.
import { chromium } from 'playwright'; import fs from 'node:fs';
const [out, widths = '1440,390', base = 'http://localhost:4211'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const w of widths.split(',').map(Number)) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(base + '/index.html', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: 'header{position:static !important}.reveal{opacity:1 !important;transform:none !important}' }); await p.waitForTimeout(400);
  for (const [k, s] of [['head', '.hero'], ['work', '#work']]) { if (k === 'head') { const bb = await (await p.$(s)).boundingBox(); await p.screenshot({ path: `${out}/today-${w}-head.png`, fullPage: true, clip: { x: 0, y: 0, width: w, height: bb.y + bb.height } }); continue; } const el = await p.$(s); await el.screenshot({ path: `${out}/today-${w}-${k}.png` }); }
  await ctx.close();
}
await b.close();
