// One command before every push: the policy matches the pages, and every local reference resolves to a file whose hash in its name is its content's.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { execSync } from 'node:child_process';
const root = path.resolve(new URL('..', import.meta.url).pathname); let bad = 0;
try { execSync('node tools/csp.mjs --check', { cwd: root, stdio: 'pipe' }); } catch (e) { console.error(String(e.stderr || e.stdout)); bad++; }
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).concat(['assets/site.css', 'assets/site.js', 'sitemap.xml', 'robots.txt']);
for (const p of pages) { const s = fs.readFileSync(path.join(root, p), 'utf8'); for (const m of s.matchAll(/["'(](\/(?:assets|favicon|apple|Edward)[^"')\s?#]*)/g)) { const f = path.join(root, m[1]); if (!fs.existsSync(f)) { console.error(`FAIL ${p}: ${m[1]} does not exist`); bad++; } } }
for (const d of ['fonts', 'work', 'art']) for (const f of fs.readdirSync(path.join(root, 'assets', d))) { const m = f.match(/\.([0-9a-f]{8})\.[^.]+$/); if (!m) { if (!f.endsWith('.txt')) { console.error(`FAIL assets/${d}/${f} has no content hash (run node tools/hash-assets.mjs)`); bad++; } continue; } const h = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'assets', d, f))).digest('hex').slice(0, 8); if (h !== m[1]) { console.error(`FAIL assets/${d}/${f}: hash does not match content`); bad++; } }
if (bad) process.exit(1); console.log('verify: policy, references and hashes all agree');
