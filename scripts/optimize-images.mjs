/*
 * Shrink camera masters down to web-sized images, in place.
 *
 *   node scripts/optimize-images.mjs --dry-run   # report only, touch nothing
 *   node scripts/optimize-images.mjs             # do it
 *
 * Why this exists: the shots coming off the camera are 4000–6000px and 13–19 MB
 * each. next/image serves resized copies, so visitors never download the master —
 * but the master still has to live in the repo, ship in the deploy, and be read
 * and re-encoded by the optimizer on every cold transform. At 2400px they are
 * still larger than any screen renders them and roughly a fiftieth of the size.
 *
 * Nothing is lost: the untouched original is copied to `_originals/` (gitignored,
 * mirroring the same folder structure) before anything is overwritten, and every
 * later run re-encodes from that copy rather than from an already-compressed file,
 * so repeated runs can't stack up JPEG generation loss.
 *
 * Filenames are never changed — the gallery discovers images by folder, and the
 * rest of the site imports them by exact path.
 *
 * Uses the sharp that ships with Next; no extra dependency.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Trees to walk. Everything under them is fair game except the formats listed
   below, which either don't resize meaningfully or aren't images. */
const TARGETS = ['src/assets', 'public'];
const BACKUP_DIR = path.join(ROOT, '_originals');

/* Long edge, in pixels. The largest a photo is ever rendered here is the
   full-screen viewer; 2560 covers that on a retina laptop with room to spare. */
const MAX_EDGE = 2560;

/* Anything already this small is left alone — re-encoding it would only cost
   quality. */
const SKIP_UNDER_BYTES = 600 * 1024;

/* Deliberately high. These files aren't what visitors download — next/image
   re-encodes them to WebP/AVIF on the way out — so this is a master feeding a
   second compression pass, and a lean master would compound artefacts. */
const JPEG_QUALITY = 88;
const WEBP_QUALITY = 88;

const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const dryRun = process.argv.includes('--dry-run');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error(
    'sharp is not installed. It normally ships with Next — try `npm install sharp --save-dev`.'
  );
  process.exit(1);
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} MB`;

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (RASTER.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

const exists = (p) => fs.access(p).then(() => true, () => false);

async function optimize(file) {
  const rel = path.relative(ROOT, file);
  const before = (await fs.stat(file)).size;
  const backup = path.join(BACKUP_DIR, rel);
  const hasBackup = await exists(backup);

  /* Read the master, not whatever is currently in place: on a second run the
     file at `file` is already the optimized one. */
  const source = hasBackup ? backup : file;
  const meta = await sharp(source).metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (!hasBackup && before <= SKIP_UNDER_BYTES && longEdge <= MAX_EDGE) {
    return { rel, skipped: true, before, after: before };
  }

  const ext = path.extname(file).toLowerCase();
  /* `.rotate()` bakes in the EXIF orientation flag before it gets stripped —
     without it, portrait frames come out on their side. */
  let pipeline = sharp(source).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (ext === '.png') {
    /* Kept as PNG: these are logos, and the alpha channel has to survive. */
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true });
  }

  const buffer = await pipeline.toBuffer();

  /* Re-encoding can come out larger than a small, well-compressed source. If it
     does, leave the file alone. */
  if (buffer.length >= before && !hasBackup) {
    return { rel, skipped: true, before, after: before };
  }

  if (!dryRun) {
    if (!hasBackup) {
      await fs.mkdir(path.dirname(backup), { recursive: true });
      await fs.copyFile(file, backup);
    }
    /* Write beside the target and rename, so an interrupted run can never leave
       a half-written image in place of a photo. */
    const tmp = `${file}.tmp-optimize`;
    await fs.writeFile(tmp, buffer);
    await fs.rename(tmp, file);
  }

  return { rel, skipped: false, before, after: buffer.length, dims: `${meta.width}x${meta.height}` };
}

const results = [];
for (const target of TARGETS) {
  for await (const file of walk(path.join(ROOT, target))) {
    results.push(await optimize(file));
  }
}

const touched = results.filter(r => !r.skipped);
const before = results.reduce((sum, r) => sum + r.before, 0);
const after = results.reduce((sum, r) => sum + r.after, 0);

for (const r of touched.sort((a, b) => (b.before - b.after) - (a.before - a.after)).slice(0, 12)) {
  console.log(`  ${r.rel}\n    ${mb(r.before)} → ${mb(r.after)}  (${r.dims})`);
}
if (touched.length > 12) console.log(`  … and ${touched.length - 12} more`);

console.log('');
console.log(dryRun ? 'DRY RUN — nothing was written' : `Originals preserved in ${path.relative(ROOT, BACKUP_DIR)}/`);
console.log(`${touched.length} of ${results.length} images ${dryRun ? 'would be' : ''} rewritten`);
console.log(`${mb(before)} → ${mb(after)}  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`);
