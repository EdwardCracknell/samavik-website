// Fails on ANY console message (log excepted... no: errors, warnings, info, debug), page error, failed request or CSP violation, on every page, in Chromium, WebKit and Firefox.
// node tools/console-check.mjs [base]
import { chromium, firefox, webkit } from 'playwright';
const base = process.argv[2] || 'http://localhost:4210'; let bad = 0;
for (const [name, type] of [['chromium', chromium], ['webkit', webkit], ['firefox', firefox]]) {
  const b = await type.launch();
  for (const pg of ['/', '/privacy', '/wordpress-migration', '/nope']) for (const w of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } }); await ctx.addInitScript(() => document.addEventListener('securitypolicyviolation', (e) => console.error('CSP ' + e.violatedDirective + ' ' + e.blockedURI)));
    const p = await ctx.newPage(); const msgs = [];
    p.on('console', (m) => msgs.push(`${m.type()}: ${m.text()}`)); p.on('pageerror', (e) => msgs.push('pageerror: ' + e)); p.on('requestfailed', (r) => msgs.push('requestfailed: ' + r.url()));
    p.on('response', (r) => { if (r.status() >= 400 && !(pg === '/nope' && r.url().endsWith('/nope'))) msgs.push(`http ${r.status()}: ${r.url()}`); });
    await p.goto(base + pg, { waitUntil: 'networkidle' }); await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } }); await p.waitForTimeout(300);
    if (w === 390 && pg === '/') { await p.click('.menu-btn'); await p.keyboard.press('Escape'); }
    const real = msgs.filter((m) => !(pg === '/nope' && /status of 404|404/.test(m) && m.startsWith('error: Failed to load resource'))); /* the 404 page's own status is reported by the engine as one console line: expected */
    if (real.length) { bad++; console.log(`FAIL ${name} ${pg} ${w}px:`, real); } await ctx.close();
  }
  await b.close(); console.log(name, 'done');
}
if (bad) process.exit(1); console.log('console-check: no console message of any kind, in three engines, on every page');
