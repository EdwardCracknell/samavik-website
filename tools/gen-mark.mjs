// Builds favicon.svg and the touch icons from the product's mark (serif S over a brass rule in a fine ring), with the S as a path.
import fs from 'node:fs'; import * as fontkit from 'fontkit'; import sharp from 'sharp';
const font = fontkit.openSync(new URL('../assets/fonts/cormorant-garamond-latin-500-normal.woff2', import.meta.url).pathname);
const run = font.layout('S'); const g = run.glyphs[0];
const size = 34, scale = size / font.unitsPerEm; const bb = g.bbox; const w = (bb.maxX - bb.minX) * scale;
const tx = 32 - ((bb.minX + bb.maxX) / 2) * scale, ty = 42.5;
const S = `<path transform="translate(${tx.toFixed(2)} ${ty}) scale(${scale.toFixed(5)} ${-scale.toFixed(5)})" d="${g.path.toSVG()}" fill="INK"/>`;
const mark = (ink, brass, bg, round) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">${bg ? `<rect width="64" height="64" rx="${round}" fill="${bg}"/>` : ''}<circle cx="32" cy="32" r="25" fill="none" stroke="${brass}" stroke-width="1.6"/>${S.replace('INK', ink)}<path d="M17 47.5h30" stroke="${brass}" stroke-width="1.3"/></svg>\n`;
const root = new URL('../', import.meta.url);
fs.writeFileSync(new URL('favicon.svg', root), mark('#17181a', '#9a7b45', '#f6f5f2', 14));
fs.writeFileSync(new URL('assets/mark.svg', root), mark('currentColor', 'currentColor', null, 0).replace('stroke="currentColor" stroke-width="1.6"', 'stroke="currentColor" stroke-width="1.6" opacity=".75"'));
// touch icon: the paper tile, square corners (the system rounds them)
const touch = mark('#17181a', '#9a7b45', '#f6f5f2', 0);
await sharp(Buffer.from(touch), { density: 450 }).resize(180, 180).png().toFile(new URL('apple-touch-icon.png', root).pathname);
await sharp(Buffer.from(touch), { density: 900 }).resize(512, 512).png().toFile(new URL('assets/icon-512.png', root).pathname);
console.log('ok');
