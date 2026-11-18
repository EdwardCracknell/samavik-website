// Writes vercel.json: clean addresses, caching, and a Content-Security-Policy that allows only the site itself.
// The one inline script (the mode, set before first paint) is allowed by its hash; every page carries the identical text.
// Run: node tools/csp.mjs   (after any change to that inline script)
import fs from 'node:fs'; import crypto from 'node:crypto';
const root = new URL('../', import.meta.url).pathname;
const hashes = new Set();
for (const f of ['index.html', 'privacy.html', 'wordpress-migration.html', '404.html']) {
  const h = fs.readFileSync(root + f, 'utf8'); const re = /<script>([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(h))) hashes.add("'sha256-" + crypto.createHash('sha256').update(m[1]).digest('base64') + "'");
}
const csp = ["default-src 'self'", `script-src 'self' ${[...hashes].join(' ')}`, "style-src 'self'", "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"].join('; ');
// only names every current engine recognises: an unknown name is a console error in Chrome
const perms = ['accelerometer', 'autoplay', 'camera', 'display-capture', 'geolocation', 'gyroscope', 'magnetometer', 'microphone', 'midi', 'payment', 'usb'].map((p) => `${p}=()`).join(', ');
const cfg = {
  cleanUrls: true, trailingSlash: false,
  headers: [
    { source: '/assets/(fonts|work|art)/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }, // true because tools/hash-assets.mjs puts a content hash in each name
    { source: '/(.*)', headers: [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: perms },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ] },
  ],
};
if (!process.argv.includes('--check')) fs.writeFileSync(root + 'vercel.json', JSON.stringify(cfg, null, 2) + '\n');
// Fail loudly when a page and the policy disagree: every inline script's hash must be in the policy now on disk, and nothing the policy forbids may be on a page.
const onDisk = JSON.parse(fs.readFileSync(root + 'vercel.json', 'utf8')).headers.find((h) => h.source === '/(.*)').headers.find((h) => h.key === 'Content-Security-Policy').value;
let bad = 0;
for (const f of ['index.html', 'privacy.html', 'wordpress-migration.html', '404.html']) {
  const h = fs.readFileSync(root + f, 'utf8'); const re = /<script>([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(h))) { const x = "'sha256-" + crypto.createHash('sha256').update(m[1]).digest('base64') + "'"; if (!onDisk.includes(x)) { console.error(`FAIL ${f}: inline script hash ${x} is not in the policy in vercel.json (run node tools/csp.mjs)`); bad++; } }
  if (/<style[\s>]/i.test(h) || /\sstyle="/i.test(h)) { console.error(`FAIL ${f}: inline style (the policy allows style from the site only)`); bad++; }
  if (/\son(click|load|error|submit|change)="/i.test(h)) { console.error(`FAIL ${f}: inline event handler`); bad++; }
  if (/(src|href)="https?:\/\/(?!samavik\.com|www\.edcracknell|learntobasejump|teamcutaway|apps\.apple|www\.linkedin)/i.test(h.replace(/<a [^>]*>/g, ''))) { console.error(`FAIL ${f}: a non-site resource reference`); bad++; }
}
if (bad) process.exit(1); console.log('CSP matches every page.\n' + onDisk);
