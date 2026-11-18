// The aviation plate's picture: a pilot's logbook page in the product's demonstration (fictional data only).
// Run: DEMO_URL=… DEMO_EMAIL=… DEMO_PASSWORD=… node tools/capture-aviation.mjs <out-folder>   then node tools/optimise.mjs
import { chromium } from 'playwright';
const out = process.argv[2]; const { DEMO_URL: base, DEMO_EMAIL: email, DEMO_PASSWORD: password } = process.env;
if (!out || !base || !email || !password) { console.error('capture-aviation: out folder, DEMO_URL, DEMO_EMAIL and DEMO_PASSWORD are needed'); process.exit(1); }
const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const p = await c.newPage(); await p.goto(base + '/login', { waitUntil: 'networkidle' });
await p.getByLabel('Email').fill(email); await p.getByLabel('Password', { exact: true }).fill(password);
await p.getByRole('button', { name: /sign in/i }).click(); await p.waitForURL('**/me**', { timeout: 30000 });
await p.goto(base + '/me/logbook', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
// The demonstration account's address is not part of the picture.
await p.getByText(email, { exact: true }).first().evaluate((el) => { el.style.visibility = 'hidden'; }).catch(() => {});
await p.screenshot({ path: `${out}/aviation.png` }); console.log('captured aviation', p.url().replace(base, ''));
await b.close();
