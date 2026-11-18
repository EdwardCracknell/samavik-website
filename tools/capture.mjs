// Captures the owner's own live public products at a fixed size, for the work plates.
// Run locally:  node tools/capture.mjs   (writes to a scratch folder; optimise.mjs makes the site images)
import { chromium } from 'playwright';
import fs from 'node:fs';
const out = process.argv[2] || './captures';
fs.mkdirSync(out, { recursive: true });
const targets = {
  ltbj: 'https://learntobasejump.com',
  cutaway: 'https://teamcutaway.com',
  edcracknell: 'https://www.edcracknell.com',
  gosayhi: 'https://apps.apple.com/gb/app/gosayhi/id6755782169',
};
const browser = await chromium.launch();
for (const [k, url] of Object.entries(targets)) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${out}/${k}.png` });
    console.log('ok', k);
  } catch (e) { console.log('fail', k, e.message); }
  await ctx.close();
}
await browser.close();
