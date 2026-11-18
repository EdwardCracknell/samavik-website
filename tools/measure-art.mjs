// Contrast of every piece of text in the head against the densest part of the drawn field beneath it.
// The page is rendered with the text made transparent; the worst background pixel (closest in luminance to the text) under each text box is taken.
import { chromium } from 'playwright'; import sharp from 'sharp';
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const rgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);
const base = process.argv[2] || 'http://localhost:4210/'; const b = await chromium.launch(); const rows = [];
for (const w of [1440, 390, 320]) for (const mode of ['evening', 'day']) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((m) => { try { localStorage.setItem('samavik-mode', m); } catch (e) {} }, mode);
  const p = await ctx.newPage(); await p.goto(base, { waitUntil: 'networkidle' }); await p.addStyleTag({ content: '.bar{position:static!important}' });
  const items = await p.evaluate(() => [...document.querySelectorAll('.head .eyebrow, .head h1 span, .head h1 em, .head .lede, .head .link, .head .key, .facts b, .facts span')].map((e) => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return { n: e.className || e.tagName + ':' + e.textContent.slice(0, 18), x: r.x, y: r.y + scrollY, w: r.width, h: r.height, color: c.color, bg: getComputedStyle(e.closest('.key') || e).backgroundColor }; }));
  await p.addStyleTag({ content: '.head *{color:transparent!important;border-color:transparent!important;text-decoration-color:transparent!important}.head .key{background:transparent!important}.head .facts li{border-color:transparent!important}.head .facts{border-color:transparent!important}.head .eyebrow::before{background:transparent!important}' });
  const png = await p.screenshot({ fullPage: true }); const raw = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  let worst = 99, which = '';
  for (const it of items) {
    if (it.bg !== 'rgba(0, 0, 0, 0)') continue; // a solid key carries its own ground
    const col = rgb(it.color); let wc = 99;
    const x0 = Math.max(0, Math.floor(it.x)), x1 = Math.min(raw.info.width, Math.ceil(it.x + it.w)), y0 = Math.floor(it.y), y1 = Math.ceil(it.y + it.h);
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) { const i = (y * raw.info.width + x) * raw.info.channels; const c = cr(col, [raw.data[i], raw.data[i + 1], raw.data[i + 2]]); if (c < wc) wc = c; }
    if (wc < worst) { worst = wc; which = it.n; }
  }
  rows.push(`${w}px ${mode}: lowest text contrast over the field ${worst.toFixed(2)}:1 (${which.toString().slice(0, 30)})`); await ctx.close();
}
console.log(rows.join('\n')); await b.close();
