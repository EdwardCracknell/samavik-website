// Request list and first-visit transfer, for a page: node tools/weights.mjs <url> [live]
// For a live address the real transfer size (CDP encodedDataLength) is used; for the local server (which does not compress) text is estimated with Brotli q11 as Vercel serves it.
import { chromium } from 'playwright'; import zlib from 'node:zlib';
const url = process.argv[2]; const live = process.argv[3] === 'live'; const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); await cdp.send('Network.enable');
const reqs = new Map(); cdp.on('Network.responseReceived', (e) => reqs.set(e.requestId, { url: e.response.url, type: e.type, mime: e.response.mimeType, status: e.response.status, enc: 0 }));
cdp.on('Network.loadingFinished', (e) => { const r = reqs.get(e.requestId); if (r) r.enc = e.encodedDataLength; });
const bodies = new Map(); p.on('response', async (r) => { try { bodies.set(r.url(), await r.body()); } catch (e) {} });
await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } }); await p.waitForTimeout(1500);
const rows = [...reqs.values()].map((r) => { let size = r.enc; if (!live) { const bd = bodies.get(r.url); size = bd ? (/text|javascript|json|svg|css/.test(r.mime) ? zlib.brotliCompressSync(bd, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length : bd.length) : 0; } return { host: new URL(r.url).host, path: new URL(r.url).pathname.slice(0, 60), type: r.type, kb: +(size / 1024).toFixed(1) }; });
const total = rows.reduce((a, r) => a + r.kb, 0), pics = rows.filter((r) => /assets\/work\//.test(r.path)).reduce((a, r) => a + r.kb, 0);
console.log(JSON.stringify({ url, requests: rows.length, hosts: [...new Set(rows.map((r) => r.host))], totalKB: +total.toFixed(1), picturesKB: +pics.toFixed(1), withoutPicturesKB: +(total - pics).toFixed(1), rows }, null, 0));
await b.close();
