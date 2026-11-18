// Local static server for previews: serves the repository root on :4210 with Vercel's cleanUrls behaviour (/privacy -> privacy.html).
// The contact function does not run here; test the form with the request intercepted.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(new URL('..', import.meta.url).pathname);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon' };
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const rules = cfg.headers.map((h) => ({ re: new RegExp('^' + h.source + '$'), headers: Object.fromEntries(h.headers.map((x) => [x.key, x.value])) })); // the same headers as on Vercel
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); const raw = p; if (p === '/') p = '/index.html';
  if (raw.endsWith('.html') && raw !== '/404.html') { res.writeHead(308, { Location: p.slice(0, -5).replace(/^\/index$/, '/') }); return res.end(); } // cleanUrls
  let f = path.join(root, p); if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  const headers = Object.assign({}, ...rules.filter((r) => r.re.test(p)).map((r) => r.headers));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory() || (f.includes('/tools/') && !f.endsWith('/tools/share.html')) || f.includes('/node_modules/')) { const nf = path.join(root, '404.html'); res.writeHead(404, { ...headers, 'Content-Type': 'text/html; charset=utf-8' }); return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found'); }
  res.writeHead(200, { ...headers, 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(4210, () => console.log('http://localhost:4210'));
