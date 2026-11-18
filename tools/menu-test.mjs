import { chromium } from 'playwright'; import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
await p.goto('http://localhost:4210/', { waitUntil: 'networkidle' });
await p.click('.menu-btn'); await p.waitForTimeout(300); await p.screenshot({ path: out + '/menu-open-390.png' });
const log = [];
log.push(['focus after open', await p.evaluate(() => document.activeElement.textContent.trim())]);
for (let i = 0; i < 9; i++) { await p.keyboard.press('Tab'); log.push(['tab', await p.evaluate(() => (document.activeElement.textContent || document.activeElement.className).trim().slice(0, 24))]); }
await p.keyboard.press('Escape'); await p.waitForTimeout(100);
log.push(['after Escape: open?', await p.evaluate(() => document.getElementById('site-nav').hasAttribute('data-open')), 'focus', await p.evaluate(() => document.activeElement.textContent.trim())]);
console.log(JSON.stringify(log));
await p.setViewportSize({ width: 320, height: 640 }); await p.waitForTimeout(200);
await p.screenshot({ path: out + '/head-320.png', clip: { x: 0, y: 0, width: 320, height: 640 } });
await b.close();
