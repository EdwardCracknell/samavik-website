// More checks behind REPORT.md. node tools/checks.mjs <outdir>
import { chromium } from 'playwright'; import fs from 'node:fs'; import zlib from 'node:zlib'; import sharp from 'sharp';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true }); const base = 'http://localhost:4210'; const b = await chromium.launch(); const R = {};

// 1. no JavaScript: evening, everything readable, the menu reachable as plain links
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: false }); const p = await ctx.newPage(); await p.goto(base + '/', { waitUntil: 'load' });
  await p.screenshot({ path: `${out}/nojs-${w}-top.png`, fullPage: false });
  await p.screenshot({ path: `${out}/nojs-${w}-full.png`, fullPage: true });
  R[`nojs-${w}`] = await p.evaluate(() => ({ htmlClass: document.documentElement.className, theme: getComputedStyle(document.body).backgroundColor, navLinksVisible: [...document.querySelectorAll('#site-nav a')].every((a) => a.getBoundingClientRect().width > 0 && getComputedStyle(a).visibility === 'visible'), menuBtnShown: getComputedStyle(document.querySelector('.menu-btn')).display, hiddenSections: [...document.querySelectorAll('.arrive')].filter((e) => getComputedStyle(e).opacity !== '1').length, overflow: document.documentElement.scrollWidth > innerWidth }));
  await ctx.close();
}
// 2. no flash of the wrong mode: when the theme attribute is set relative to the first paint
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addInitScript(() => { try { localStorage.setItem('samavik-mode', 'day'); } catch (e) {} window.__t = {}; const sa = Element.prototype.setAttribute; Element.prototype.setAttribute = function (k, v) { if (k === 'data-theme' && !window.__t.themeSetAt) { window.__t.themeSetAt = performance.now(); window.__t.readyStateThen = document.readyState; window.__t.stylesheetsParsedThen = document.styleSheets.length; } return sa.call(this, k, v); }; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__t[e.name] = e.startTime; }).observe({ type: 'paint', buffered: true }); });
  const p = await ctx.newPage(); await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForTimeout(300);
  R.noFlash = await p.evaluate(() => ({ ...window.__t, bodyBg: getComputedStyle(document.body).backgroundColor, themeColour: document.querySelector('meta[name=theme-color]').content }));
  // and with storage blocked: the page must still work, in evening
  await ctx.close();
  const c2 = await b.newContext({ viewport: { width: 1440, height: 900 } }); await c2.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
  const p2 = await c2.newPage(); const errs = []; p2.on('pageerror', (e) => errs.push(String(e))); await p2.goto(base + '/', { waitUntil: 'networkidle' }); await p2.click('.mode');
  R.storageBlocked = { pageErrors: errs, themeAfterSwitch: await p2.evaluate(() => document.documentElement.getAttribute('data-theme')), themeColour: await p2.evaluate(() => document.querySelector('meta[name=theme-color]').content) }; await c2.close();
}
// 3. keyboard walk on each page: every stop is on screen when focused and shows a visible focus mark
for (const pg of ['/', '/privacy', '/wordpress-migration']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage(); await p.goto(base + pg, { waitUntil: 'networkidle' });
  const stops = []; for (let i = 0; i < 70; i++) { await p.keyboard.press('Tab'); const s = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const r = e.getBoundingClientRect(); const c = getComputedStyle(e); const vis = (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) >= 2) || c.boxShadow !== 'none' || c.borderTopColor !== c.borderBottomColor; return { t: (e.getAttribute('aria-label') || e.textContent || e.id || e.tagName).trim().slice(0, 28) + (e.textContent.trim().length < 3 ? ' <' + e.tagName + '.' + e.className + '>' : ''), onscreen: r.top >= 0 && r.bottom <= innerHeight + 1, vis, h: Math.round(r.height), w: Math.round(r.width), tag: e.tagName }; }); if (!s) break; if (stops.length && stops[0].t === s.t && stops.length > 3) break; stops.push(s); }
  R['keys' + pg] = { stops: stops.length, offscreen: stops.filter((s) => !s.onscreen).length, noFocusMark: stops.filter((s) => !s.vis).map((s) => s.t), under44: stops.filter((s) => s.h < 44 && s.tag !== 'A').map((s) => s.t + ' ' + s.w + 'x' + s.h), order: stops.map((s) => s.t).join(' | ').slice(0, 400) }; await ctx.close();
}
// 4. print: pages on A4 for each page, ink on white
for (const pg of ['/', '/privacy', '/wordpress-migration']) {
  const ctx = await b.newContext({ viewport: { width: 794, height: 1123 } }); const p = await ctx.newPage(); await p.goto(base + pg, { waitUntil: 'networkidle' }); await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
  await p.emulateMedia({ media: 'print' }); const pdf = await p.pdf({ format: 'A4', printBackground: false, preferCSSPageSize: true }); const name = pg.replace(/\W+/g, '') || 'home'; fs.writeFileSync(`${out}/print-${name}.pdf`, pdf);
  R['print' + pg] = { pdfPages: (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length, bg: await p.evaluate(() => getComputedStyle(document.body).backgroundColor + ' ' + getComputedStyle(document.body).color) };
  await p.screenshot({ path: `${out}/print-${name}.png`, fullPage: true }); await ctx.close();
}
await b.close(); console.log(JSON.stringify(R, null, 1));
