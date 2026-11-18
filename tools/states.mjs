// The contact form's states, with /api/contact intercepted in the browser (no real message is ever sent), under the site's own CSP.
// node tools/states.mjs <outdir> [base]    -> a screenshot per state and a JSON line per state (what is announced, where focus goes)
import { chromium } from 'playwright'; import fs from 'node:fs'; import sharp from 'sharp';
const out = process.argv[2]; const base = process.argv[3] || 'http://localhost:4210'; fs.mkdirSync(out, { recursive: true });
const cases = [
  ['1-empty', null], ['2-bad-email', null], ['3-sending', 'hold'], ['4-sent', { status: 200, body: { success: true } }],
  ['5-refused-required', { status: 400, body: { error: 'All fields are required' } }], ['6-refused-email', { status: 400, body: { error: 'Invalid email address' } }],
  ['7-refused-too-long', { status: 400, body: { error: 'Input too long' } }], ['8-refused-405', { status: 405, body: { error: 'Method not allowed' } }],
  ['9-refused-500', { status: 500, body: { error: 'Failed to send message' } }], ['10-network-down', 'abort'], ['11-too-long-typed', null],
];
const b = await chromium.launch(); const shots = [];
for (const mode of ['evening', 'day']) for (const [name, rule] of cases) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((m) => { try { localStorage.setItem('samavik-mode', m); } catch (e) {} window.__v = []; document.addEventListener('securitypolicyviolation', (e) => window.__v.push(e.violatedDirective + ' ' + e.blockedURI)); }, mode);
  const p = await ctx.newPage(); let hits = 0, held = null, body = null;
  await p.route('**/api/contact', async (r) => { hits++; body = r.request().postData(); if (rule === 'hold') { held = r; return; } if (rule === 'abort') return r.abort('failed'); await r.fulfill({ status: rule.status, contentType: 'application/json', body: JSON.stringify(rule.body) }); });
  await p.goto(base + '/#contact', { waitUntil: 'networkidle' });
  const f = { n: '#cf-name', e: '#cf-email', m: '#cf-message' };
  if (name !== '1-empty') { await p.fill(f.n, 'Test Person'); await p.fill(f.e, name === '2-bad-email' ? 'not-an-email' : 'test@example.com'); await p.fill(f.m, name === '11-too-long-typed' ? 'x'.repeat(5100) : 'A test message, never sent.'); }
  await p.click('#cf-submit'); await p.waitForTimeout(350);
  const st = await p.evaluate(() => ({ live: document.getElementById('cf-live').textContent, notice: document.getElementById('cf-notice').textContent, sentVisible: !document.getElementById('cf-sent').hidden, focus: document.activeElement.id || document.activeElement.tagName, kept: [document.getElementById('cf-name').value, document.getElementById('cf-email').value, document.getElementById('cf-message').value.length], errs: [...document.querySelectorAll('.err:not([hidden])')].map((e) => e.textContent), busy: document.getElementById('contact-form').getAttribute('aria-busy') }));
  const card = await p.$('.card.form-only'); await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  const f2 = `${out}/${mode}-${name}.png`; await card.screenshot({ path: f2 }); shots.push([mode, name, f2]);
  if (held) { await held.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }); await p.waitForTimeout(300); st.afterHold = await p.evaluate(() => ({ sent: !document.getElementById('cf-sent').hidden, focus: document.activeElement.tagName })); }
  const viol = await p.evaluate(() => window.__v);
  console.log(JSON.stringify({ mode, name, requestLeftThePage: hits, bodyKeys: body ? Object.keys(JSON.parse(body)) : null, cspViolations: viol, ...st }));
  await ctx.close();
}
await b.close();
// a contact sheet per mode
for (const mode of ['evening', 'day']) {
  const list = shots.filter((s) => s[0] === mode); const imgs = await Promise.all(list.map(async (s) => sharp(s[2]).resize(560).toBuffer())); const metas = await Promise.all(imgs.map((i) => sharp(i).metadata()));
  const cols = 4, cw = 580, rows = Math.ceil(list.length / cols); const rowH = []; for (let r = 0; r < rows; r++) rowH.push(Math.max(...metas.slice(r * cols, r * cols + cols).map((m) => m.height)) + 50);
  const label = (t) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="40"><text x="0" y="26" font-family="Helvetica" font-size="20" font-weight="700" fill="#ddd">${t}</text></svg>`);
  let y = 0; const comps = []; list.forEach((s, i) => { const r = Math.floor(i / cols); if (i % cols === 0 && r > 0) y += rowH[r - 1]; comps.push({ input: label(s[1]), left: (i % cols) * cw + 10, top: y + 5 }, { input: imgs[i], left: (i % cols) * cw + 10, top: y + 45 }); });
  await sharp({ create: { width: cols * cw + 10, height: rowH.reduce((a, c) => a + c, 0) + 10, channels: 3, background: '#33353a' } }).composite(comps).png().toFile(`${out}/sheet-states-${mode}.png`);
}
