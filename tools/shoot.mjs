// Screenshots for review. node tools/shoot.mjs <outdir> <page> <widths,comma> <modes,comma> [sections,comma|full]
import { chromium } from 'playwright'; import fs from 'node:fs';
const [out, pg = '/', widths = '1440', modes = 'evening', secs = 'full', base = 'http://localhost:4210'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const w of widths.split(',').map(Number)) for (const m of modes.split(',')) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await ctx.addInitScript((mode) => { try { localStorage.setItem('samavik-mode', mode); } catch (e) {} }, m);
  const p = await ctx.newPage(); const errs = []; p.on('console', (x) => { if (x.type() === 'error') errs.push(x.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(base + pg, { waitUntil: 'networkidle' }); await p.addStyleTag({ content: '.bar,header{position:static !important}' }); await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); }); await p.waitForTimeout(600);
  const name = pg.replace(/\W+/g, '') || 'home';
  if (secs === 'full') { await p.screenshot({ path: `${out}/${name}-${w}-${m}-full.png`, fullPage: true }); }
  else for (const s of secs.split(',')) { if (s === '.head') { const bb = await (await p.$('.head')).boundingBox(); await p.screenshot({ path: `${out}/${name}-${w}-${m}-head.png`, fullPage: true, clip: { x: 0, y: 0, width: w, height: bb.y + bb.height } }); continue; } const el = await p.$(s); if (!el) { console.log('no', s); continue; } await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(250); await el.screenshot({ path: `${out}/${name}-${w}-${m}-${s.replace(/\W+/g, '')}.png` }); }
  if (errs.length) console.log(w, m, 'ERRORS', errs);
  await ctx.close();
}
await b.close();
