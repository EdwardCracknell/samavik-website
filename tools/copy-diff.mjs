// Compares the visible words of each page with the same page on origin/main, by script, so COPY_CHANGES.md can be checked and regenerated.
// node tools/copy-diff.mjs [base]    -> for each page: fragments only in the new page ("NEW") and only in the old ("GONE"), as sentences/phrases.
// Method: both pages are rendered, body.innerText split into lines and then into clauses at . : ; ? ! and dashes; text is normalised (case, quotes, dashes, spaces)
// and a clause is reported only when it does not occur, normalised, in the other page's text.
import { chromium } from 'playwright'; import { execSync } from 'node:child_process';
const base = process.argv[2] || 'http://localhost:4210'; const pages = [['index.html', '/'], ['privacy.html', '/privacy'], ['wordpress-migration.html', '/wordpress-migration']];
const norm = (s) => s.toLowerCase().replace(/[“”"]/g, '').replace(/[’‘']/g, '').replace(/[—–-]/g, ' ').replace(/ /g, ' ').replace(/[^a-z0-9£%&<>@~+→↓\/ ]+/g, ' ').replace(/\s+/g, ' ').trim();
const clauses = (t) => t.split(/\n+/).flatMap((l) => l.split(/(?<=[.:;?!])\s+|\s+[—–]\s+|\s+·\s+/)).map((c) => c.trim()).filter((c) => c.length > 1);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true }); let out = '';
const text = async (page) => page.evaluate(() => { document.querySelectorAll('script,style,noscript').forEach((e) => e.remove()); document.querySelectorAll('.sr, [hidden]').forEach((e) => { e.hidden = false; e.classList.remove('sr'); }); /* screen-reader-only and hidden-until-needed texts count as words of the page */ const rows = []; document.querySelectorAll('.comp td[data-l]').forEach((e) => e.removeAttribute('data-l')); return document.body.innerText; });
for (const [file, url] of pages) {
  const oldHtml = execSync(`git show origin/main:${file}`, { encoding: 'utf8', maxBuffer: 1e7 }); const po = await ctx.newPage(); await po.setContent(oldHtml.replace(/<link[^>]*fonts[^>]*>/g, ''), { waitUntil: 'domcontentloaded' }); const to = await text(po);
  const pn = await ctx.newPage(); await pn.goto(base + url, { waitUntil: 'networkidle' }); let tn = await text(pn); const pm = await (await b.newContext({ viewport: { width: 390, height: 900 }, bypassCSP: true })).newPage(); await pm.goto(base + url, { waitUntil: 'networkidle' }); await pm.click('.menu-btn'); tn += '\n' + await pm.evaluate(() => document.getElementById('site-nav').innerText) + '\nMenu Close'; await pm.context().close(); if (file === 'index.html') { const pe = await ctx.newPage(); await pe.goto(base + '/nope', { waitUntil: 'networkidle' }); }
  const O = clauses(to), N = clauses(tn); const oN = norm(to), nN = norm(tn);
  const oSet = new Set(O.map(norm)), nSet = new Set(N.map(norm)); const has = (hay, c) => (hay === oN ? oSet : nSet).has(norm(c)) || (norm(c).length > 30 && hay.includes(norm(c)));
  const newOnly = [...new Set(N.filter((c) => norm(c).length > 1 && !has(oN, c)))], gone = [...new Set(O.filter((c) => norm(c).length > 1 && !has(nN, c)))];
  out += `\n## ${file}\n\nNEW (in the redesign, not in main):\n${newOnly.map((x) => '- ' + x).join('\n') || '- none'}\n\nGONE (in main, not in the redesign):\n${gone.map((x) => '- ' + x).join('\n') || '- none'}\n`;
}
await b.close(); console.log(out);
