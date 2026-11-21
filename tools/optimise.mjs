// Turns the captures of the owner's live public products into the work plates' pictures (AVIF, WebP, JPEG; two widths).
// Run: node tools/optimise.mjs <captures-folder>   (captures made by tools/capture.mjs)
import sharp from 'sharp'; import fs from 'node:fs';
const src = process.argv[2]; const out = new URL('../assets/work/', import.meta.url).pathname; fs.mkdirSync(out, { recursive: true });
for (const k of ['ltbj', 'cutaway', 'edcracknell', 'aviation'].filter((k) => fs.existsSync(`${src}/${k}.png`))) for (const w of [640, 1200]) {
  const base = () => sharp(`${src}/${k}.png`).resize(w, Math.round(w * 0.625), { fit: 'cover' });
  await base().avif({ quality: 46, effort: 6 }).toFile(`${out}/${k}-${w}.avif`);
  await base().webp({ quality: 68, effort: 6 }).toFile(`${out}/${k}-${w}.webp`);
  await base().jpeg({ quality: 70, mozjpeg: true }).toFile(`${out}/${k}-${w}.jpg`);
}

// GoSayHi: two of its public App Store screenshots (tools/fetch-gosayhi.mjs), set side by side in one frame at 8:5.
const gs = process.argv[3];
if (gs) for (const k of ['gosayhi-2', 'gosayhi-7']) {
  const base = () => sharp(`${gs}/${k}.jpg`).resize(380, 823, { fit: 'cover' });
  await base().avif({ quality: 50, effort: 6 }).toFile(`${out}/${k}.avif`);
  await base().webp({ quality: 70, effort: 6 }).toFile(`${out}/${k}.webp`);
  await base().jpeg({ quality: 72, mozjpeg: true }).toFile(`${out}/${k}.jpg`);
}

// TheDogSpot: two of its public App Store screenshots (tools/fetch-thedogspot.mjs), in the same frame as GoSayHi's.
const td = process.argv[4];
if (td) for (const k of ['thedogspot-1', 'thedogspot-3']) {
  const base = () => sharp(`${td}/${k}.jpg`).resize(380, 823, { fit: 'cover' });
  await base().avif({ quality: 50, effort: 6 }).toFile(`${out}/${k}.avif`);
  await base().webp({ quality: 70, effort: 6 }).toFile(`${out}/${k}.webp`);
  await base().jpeg({ quality: 72, mozjpeg: true }).toFile(`${out}/${k}.jpg`);
}
