// Renders the share image (1200 x 630, evening) from tools/share.html with the site's own faces. Run with tools/serve.mjs running. node tools/share.mjs
import { chromium } from 'playwright'; import sharp from 'sharp';
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1200, height: 630 }, bypassCSP: true })).newPage();
await p.goto('http://localhost:4210/tools/share.html', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
const png = await p.screenshot(); await b.close();
await sharp(png).png({ palette: true, quality: 82, colors: 96, effort: 10 }).toFile(new URL('../assets/share.png', import.meta.url).pathname); console.log('ok');
