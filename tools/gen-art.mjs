// Draws the site's engine-turned field, contour lines and compass rose as plain SVG (assets/art/*.svg).
// Original line art made from circles, sines and straight lines. The SVGs are used as CSS masks, so the page colours them
// (brass or ink, a few per cent) and each is decoration: no meaning, never the only mark of anything.
// Run: node tools/gen-art.mjs
import fs from 'node:fs';
const f = (n) => Math.round(n * 10) / 10;
const head = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none" stroke="#fff" stroke-width="0.55" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`;
const circle = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

// The field: a ring of equal circles, each centred a little round from the last, so the overlap draws a lace of petals.
// The middle is left open (each circle is drawn only outside a disc), so there is no hub to sit under text.
function field(cx = 300, cy = 300, open = 74) {
  const n = 72, r = 138, d = 112;
  const phi = Math.acos((r * r + d * d - open * open) / (2 * r * d));
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = cx + d * Math.cos(a), y = cy + d * Math.sin(a);
    const from = a + Math.PI + phi, to = a + Math.PI - phi + Math.PI * 2, mid = (from + to) / 2;
    const p = (t) => `${f(x + r * Math.cos(t))} ${f(y + r * Math.sin(t))}`;
    out.push(`M${p(from)}A${r} ${r} 0 0 1 ${p(mid)}A${r} ${r} 0 0 1 ${p(to)}`);
  }
  for (const rr of [open, open + 3.2, 276, 280, 288]) out.push(circle(cx, cy, rr));
  return head('0 0 600 600', `<path d="${out.join('')}"/>`);
}

// Contours: nested closed curves from a few sines, like the relief on a sectional chart.
function contours(levels = 18) {
  const ps = Array.from({ length: levels }, (_, i) => {
    const s = 26 + i * 15; let d = '';
    for (let k = 0; k <= 100; k++) {
      const t = (k / 100) * Math.PI * 2;
      const r = s * (1 + 0.16 * Math.sin(3 * t + 0.8) + 0.1 * Math.sin(5 * t + i * 0.12) + 0.06 * Math.cos(2 * t - 1.1));
      d += `${k ? 'L' : 'M'}${f(300 + r * Math.cos(t))} ${f(220 + r * Math.sin(t) * 0.8)}`;
    }
    return d + 'Z';
  });
  return head('0 0 600 440', `<path d="${ps.join('')}"/>`);
}

// Compass rose: a ring with graduations, four long points, four middle, eight short.
function compass() {
  const cx = 200, cy = 200, t = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2, L = i % 18 === 0 ? 24 : i % 6 === 0 ? 16 : i % 2 === 0 ? 9 : 5;
    t.push(`M${f(cx + 150 * Math.cos(a))} ${f(cy + 150 * Math.sin(a))}L${f(cx + (150 + L) * Math.cos(a))} ${f(cy + (150 + L) * Math.sin(a))}`);
  }
  const pt = (deg, len, w) => { const a = ((deg - 90) * Math.PI) / 180, q = Math.PI / 2;
    return `M${f(cx + w * Math.cos(a - q))} ${f(cy + w * Math.sin(a - q))}L${f(cx + len * Math.cos(a))} ${f(cy + len * Math.sin(a))}L${f(cx + w * Math.cos(a + q))} ${f(cy + w * Math.sin(a + q))}`; };
  const parts = [circle(cx, cy, 150), circle(cx, cy, 120), ...t,
    ...[0, 90, 180, 270].map((d) => pt(d, 150, 14)), ...[45, 135, 225, 315].map((d) => pt(d, 112, 8)),
    ...[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((d) => pt(d, 84, 4))];
  return head('0 0 400 400', `<path d="${parts.join('')}"/>`);
}
const dir = new URL('../assets/art/', import.meta.url);
fs.writeFileSync(new URL('field.svg', dir), field());
fs.writeFileSync(new URL('contours.svg', dir), contours());
fs.writeFileSync(new URL('compass.svg', dir), compass());
