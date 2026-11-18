// Side-by-side sheets: today's site on the left, the redesign on the right, same width. node tools/compare.mjs <mine-dir> <today-dir> <out-dir> <section> <width> <mode>
import sharp from 'sharp'; import fs from 'node:fs';
const [mine, today, out, sec, w, mode] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const a = await sharp(`${today}/today-${w}-${sec}.png`).toBuffer(), b = await sharp(`${mine}/home-${w}-${mode}-${sec === 'work' ? 'work' : 'head'}.png`).toBuffer();
const ma = await sharp(a).metadata(), mb = await sharp(b).metadata(); const gap = 40, top = 60, H = Math.max(ma.height, mb.height) + top + 20;
const label = (t) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="50"><text x="0" y="34" font-family="Helvetica" font-size="26" font-weight="700" letter-spacing="4" fill="#ddd">${t}</text></svg>`);
await sharp({ create: { width: ma.width + mb.width + gap * 3, height: H, channels: 3, background: '#33353a' } })
  .composite([{ input: label('TODAY'), left: gap, top: 5 }, { input: label('REDESIGN, ' + mode.toUpperCase()), left: ma.width + gap * 2, top: 5 }, { input: a, left: gap, top }, { input: b, left: ma.width + gap * 2, top }])
  .png().toFile(`${out}/${sec}-${w}-${mode}-vs-today.png`);
