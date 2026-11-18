// Layout shift when the faces arrive, in each engine: the page is loaded with the font files delayed 2.5 s; positions are read with the fallback faces and again once the real faces have loaded.
// node tools/font-shift.mjs [base]
import { chromium, firefox, webkit } from 'playwright';
const base = process.argv[2] || 'http://localhost:4210'; const out = {};
const ALL = { chromium, webkit, firefox };
for (const name of (process.env.ENGINES || 'chromium,webkit,firefox').split(',')) { const type = ALL[name];
  const b = await type.launch();
  for (const pg of ['/', '/privacy', '/wordpress-migration']) for (const w of [1440, 768, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } }); const p = await ctx.newPage();
    await p.route('**/*.woff2', async (r) => { await new Promise((x) => setTimeout(x, +(process.env.DELAY || 2500))); r.continue(); });
    await p.goto(base + pg, { waitUntil: 'commit' }); await p.waitForSelector('.head h1, .legal-head h1', { timeout: 10000 }); await p.waitForTimeout(Math.min(+(process.env.DELAY || 2500) - 150, 700));
    const probe = () => p.evaluate(() => { const y = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; }; return { lede: y('.lede'), h1b: Math.round(document.querySelector('h1').getBoundingClientRect().bottom + scrollY), acts: y('.head-acts') || y('.legal'), next: y('.sec') || y('.legal'), page: document.documentElement.scrollHeight, fonts: [...document.fonts].filter((f) => f.status === 'loaded').length }; });
    const a = await probe(); await p.waitForFunction(() => [...document.fonts].filter((f) => f.status === 'loaded').length >= 3, null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(600); const z = await probe();
    out[`${name} ${pg} ${w}`] = { before: a, after: z, shift: { lede: z.lede - a.lede, h1bottom: z.h1b - a.h1b, belowHero: z.next - a.next, page: z.page - a.page } }; await ctx.close();
  }
  await b.close();
}
let worst = 0; for (const [k, v] of Object.entries(out)) { const m = Math.max(...Object.values(v.shift).map(Math.abs)); worst = Math.max(worst, m); console.log(k.padEnd(36), JSON.stringify(v.shift), v.after.fonts + ' faces'); }
console.log('WORST shift px:', worst);
