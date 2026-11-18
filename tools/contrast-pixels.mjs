// Contrast of EVERY text box on rendered pixels: the page is drawn with all text made transparent, and for each line box of text the worst
// background pixel (closest in luminance to the text colour) under it is taken. Drawings, rules, frames and pictures are all in the pixels.
// node tools/contrast-pixels.mjs [base]    -> one line per page, mode and width, and the five lowest boxes of each
import { chromium } from 'playwright'; import sharp from 'sharp';
const base = process.argv[2] || 'http://localhost:4210'; const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const pages = ['/', '/privacy', '/wordpress-migration', '/nope']; const widths = [1440, 768, 390, 320]; const b = await chromium.launch(); let lowest = { evening: 99, day: 99 }; const all = [];
for (const pg of pages) for (const mode of ['evening', 'day']) for (const w of widths) for (const menu of [false, true]) {
  if (menu && w > 980) continue;
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', bypassCSP: true }); await ctx.addInitScript((m) => { try { localStorage.setItem('samavik-mode', m); } catch (e) {} }, mode);
  const p = await ctx.newPage(); await p.goto(base + pg, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  if (menu) { await p.click('.menu-btn'); await p.waitForTimeout(200); }
  const boxes = await p.evaluate((menuOpen) => { const out = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; if (!el || el.closest('script,style,noscript,[hidden],.sr,svg')) continue; if (menuOpen && !el.closest('#site-nav') && !el.closest('.bar')) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue; const r = document.createRange(); r.selectNodeContents(n);
      for (const q of r.getClientRects()) { if (q.width < 1 || q.height < 1) continue; out.push({ t: t.slice(0, 40), x: q.left + scrollX, y: q.top + scrollY, w: q.width, h: q.height, c: cs.color }); } }
    return out; }, menu);
  await p.addStyleTag({ content: '*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-decoration-color:transparent!important;caret-color:transparent!important}::placeholder{color:transparent!important}.bar{position:static!important}' });
  const shot = menu ? await p.screenshot({ fullPage: false }) : await p.screenshot({ fullPage: true }); const raw = await sharp(shot).raw().toBuffer({ resolveWithObject: true }); const W = raw.info.width, H = raw.info.height, C = raw.info.channels;
  const res = []; for (const bx of boxes) { const col = bx.c.match(/[\d.]+/g).map(Number); const L1 = lum(col[0], col[1], col[2]); let worst = 99;
    const y0 = Math.max(0, Math.floor(bx.y + (menu ? 0 : 0))), y1 = Math.min(H, Math.ceil(bx.y + bx.h)), x0 = Math.max(0, Math.floor(bx.x)), x1 = Math.min(W, Math.ceil(bx.x + bx.w));
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * W + x) * C; const L2 = lum(raw.data[i], raw.data[i + 1], raw.data[i + 2]); const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); if (cr < worst) worst = cr; }
    if (worst < 99) res.push({ t: bx.t, cr: worst, fs: 0 }); }
  res.sort((a, c) => a.cr - c.cr); const lo = res[0]; const tag = `${pg} ${mode} ${w}${menu ? ' menu' : ''}`; all.push({ tag, boxes: res.length, lowest: lo ? +lo.cr.toFixed(2) : null, at: lo ? lo.t : '' });
  if (lo && lo.cr < lowest[mode]) lowest[mode] = lo.cr; if (lo && lo.cr < 4.5) console.log('BELOW 4.5', tag, res.slice(0, 5).map((r) => `${r.cr.toFixed(2)} "${r.t}"`)); await ctx.close();
}
await b.close(); for (const a of all) console.log(`${a.tag.padEnd(34)} ${String(a.boxes).padStart(4)} boxes  lowest ${a.lowest}  "${a.at}"`);
console.log(`LOWEST evening ${lowest.evening.toFixed(2)}  day ${lowest.day.toFixed(2)}`);
