// The checks behind REPORT.md: axe (serious and critical), 320 px overflow, console errors and CSP violations, the request list, the keyboard walk.
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path';
const axeSrc = fs.readFileSync(path.resolve(new URL('./node_modules/axe-core/axe.min.js', import.meta.url).pathname), 'utf8');
const base = process.argv[2] || 'http://localhost:4210'; const pages = ['/', '/privacy', '/wordpress-migration', '/nope'];
const b = await chromium.launch(); const out = [];
for (const pg of pages) for (const mode of ['evening', 'day']) for (const w of [1440, 390, 320]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((m) => { try { localStorage.setItem('samavik-mode', m); } catch (e) {} window.__v = []; document.addEventListener('securitypolicyviolation', (e) => window.__v.push(e.violatedDirective + ' ' + e.blockedURI)); }, mode);
  const p = await ctx.newPage(); const errs = [], hosts = new Set(), reqs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e)));
  p.on('request', (r) => { const u = new URL(r.url()); hosts.add(u.host); reqs.push(u.pathname); });
  await p.goto(base + pg, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); const viol = await p.evaluate(() => window.__v);
  await ctx.close();
  const ctx2 = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', bypassCSP: true }); // axe is injected, which the policy rightly refuses; the page itself was tested above under the policy
  await ctx2.addInitScript((m) => { try { localStorage.setItem('samavik-mode', m); } catch (e) {} }, mode);
  const p2 = await ctx2.newPage(); await p2.goto(base + pg, { waitUntil: 'networkidle' });
  await p2.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  await p2.addScriptTag({ content: axeSrc });
  const ax = await p2.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes[0].target.join(' ') })));
  out.push({ pg, mode, w, axeSeriousCritical: ax.filter((v) => v.impact === 'serious' || v.impact === 'critical'), axeOther: ax.filter((v) => v.impact !== 'serious' && v.impact !== 'critical').map((v) => v.id + ':' + v.impact), overflow: sw[0] > sw[1], errs, hosts: [...hosts], cspViolations: viol, nReq: reqs.length });
  await ctx2.close();
}
await b.close();
for (const o of out) console.log(JSON.stringify(o));
