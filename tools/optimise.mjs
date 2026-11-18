// Turns the captures of the owner's live public products into the work plates' pictures (AVIF, WebP, JPEG; two widths).
// Run: node tools/optimise.mjs <captures-folder>   (captures made by tools/capture.mjs)
import sharp from 'sharp'; import fs from 'node:fs';
const src = process.argv[2]; const out = new URL('../assets/work/', import.meta.url).pathname; fs.mkdirSync(out, { recursive: true });
for (const k of ['ltbj', 'cutaway']) for (const w of [640, 1200]) {
  const base = () => sharp(`${src}/${k}.png`).resize(w, Math.round(w * 0.625), { fit: 'cover' });
  await base().avif({ quality: 46, effort: 6 }).toFile(`${out}/${k}-${w}.avif`);
  await base().webp({ quality: 68, effort: 6 }).toFile(`${out}/${k}-${w}.webp`);
  await base().jpeg({ quality: 70, mozjpeg: true }).toFile(`${out}/${k}-${w}.jpg`);
}
