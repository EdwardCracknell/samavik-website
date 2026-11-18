// Gives every font, picture and drawing a content hash in its file name (name.1a2b3c4d.ext) and rewrites each reference in the pages and the
// stylesheet, so the year-long "immutable" cache in vercel.json is true: new content is a new address. Idempotent.
// Generators (optimise.mjs, gen-art.mjs) write plain names; run this afterwards:  node tools/hash-assets.mjs
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const root = path.resolve(new URL('..', import.meta.url).pathname); const dirs = ['fonts', 'work', 'art']; const exts = new Set(['.woff2', '.avif', '.webp', '.jpg', '.svg']);
const H = /\.[0-9a-f]{8}(?=\.[^.]+$)/; const map = new Map(); // "/assets/dir/name.ext" -> "/assets/dir/name.hash.ext"
for (const d of dirs) {
  const dir = path.join(root, 'assets', d); const groups = new Map();
  for (const f of fs.readdirSync(dir)) { if (!exts.has(path.extname(f))) continue; const logical = f.replace(H, ''); (groups.get(logical) || groups.set(logical, []).get(logical)).push(f); }
  for (const [logical, files] of groups) {
    const plain = files.find((f) => f === logical); const src = plain || files[0]; const buf = fs.readFileSync(path.join(dir, src));
    const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8); const ext = path.extname(logical); const target = logical.slice(0, -ext.length) + '.' + hash + ext;
    if (src !== target) fs.renameSync(path.join(dir, src), path.join(dir, target));
    for (const f of files) if (f !== src && f !== target && fs.existsSync(path.join(dir, f))) fs.unlinkSync(path.join(dir, f)); // an older hashed copy
    map.set(`/assets/${d}/${logical}`, `/assets/${d}/${target}`);
  }
}
const targets = fs.readdirSync(root).filter((f) => f.endsWith('.html')).concat(['assets/site.css', 'assets/site.js']).map((f) => path.join(root, f));
for (const t of targets) {
  let s = fs.readFileSync(t, 'utf8'); const before = s;
  for (const [logical, hashed] of map) { const ext = path.extname(logical); const stem = logical.slice(0, -ext.length); s = s.split(new RegExp(stem.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '(?:\\.[0-9a-f]{8})?' + ext.replace('.', '\\.') + '(?![\\w.-])')).join(hashed); }
  if (s !== before) fs.writeFileSync(t, s);
}
console.log(`hashed ${map.size} files`);
