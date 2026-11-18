// Writes vercel.json: clean addresses, caching, and a Content-Security-Policy that allows only the site itself.
// The one inline script (the mode, set before first paint) is allowed by its hash; every page carries the identical text.
// Run: node tools/csp.mjs   (after any change to that inline script)
import fs from 'node:fs'; import crypto from 'node:crypto';
const root = new URL('../', import.meta.url).pathname;
const hashes = new Set();
for (const f of ['index.html', 'privacy.html', 'wordpress-migration.html']) {
  const h = fs.readFileSync(root + f, 'utf8'); const re = /<script>([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(h))) hashes.add("'sha256-" + crypto.createHash('sha256').update(m[1]).digest('base64') + "'");
}
const csp = ["default-src 'self'", `script-src 'self' ${[...hashes].join(' ')}`, "style-src 'self'", "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"].join('; ');
const perms = ['accelerometer', 'ambient-light-sensor', 'autoplay', 'battery', 'camera', 'display-capture', 'geolocation', 'gyroscope', 'magnetometer', 'microphone', 'midi', 'payment', 'usb', 'xr-spatial-tracking', 'interest-cohort'].map((p) => `${p}=()`).join(', ');
const cfg = {
  cleanUrls: true, trailingSlash: false,
  headers: [
    { source: '/assets/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/assets/(work|art)/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }] },
    { source: '/(.*)', headers: [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: perms },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ] },
  ],
};
fs.writeFileSync(root + 'vercel.json', JSON.stringify(cfg, null, 2) + '\n'); console.log(csp);
