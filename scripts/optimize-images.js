/**
 * Converts images in client/src/assets/ to WebP and produces responsive sizes.
 * Run: node scripts/optimize-images.js
 * Output lands in client/src/assets/optimized/
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here    = fileURLToPath(new URL('.', import.meta.url));
const SRC     = join(here, '../client/src/assets');
const OUT     = join(here, '../client/src/assets/optimized');
const WIDTHS  = [400, 800, 1200];
const EXTS    = new Set(['.jpg', '.jpeg', '.png', '.webp']);

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter(f => EXTS.has(extname(f).toLowerCase()));

if (!files.length) {
  console.log('No images found in', SRC);
  process.exit(0);
}

for (const file of files) {
  const src  = join(SRC, file);
  const stem = basename(file, extname(file));

  for (const w of WIDTHS) {
    const dest = join(OUT, `${stem}-${w}w.webp`);
    await sharp(src)
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(dest);
    console.log(`✓ ${dest}`);
  }
}

console.log(`\nDone — ${files.length} image(s) converted.`);
console.log(`Update <img> tags to use <picture> with srcSet for best results.`);
