/*
 * Shrink videography masters down to web-sized clips, in place.
 *
 *   node scripts/compress-videos.mjs --dry-run   # report only, touch nothing
 *   node scripts/compress-videos.mjs             # do it
 *
 * Why this exists: the clips coming out of the edit are delivery masters —
 * 10 to 67 Mbps, one of them 4K — and a portfolio grid autoplays them. A visitor
 * on a phone would pull hundreds of megabytes to see a page of thumbnails, and
 * files that size can't ship in a deploy or even survive a push. Re-encoded for
 * the web they look the same in a feed at a fraction of the weight.
 *
 * Nothing is lost: the untouched original is copied to `_originals/` (gitignored,
 * mirroring the same folder structure) before anything is overwritten, and every
 * later run re-encodes from that copy rather than from an already-compressed
 * file, so repeated runs can't stack up generation loss. Same arrangement as
 * scripts/optimize-images.mjs.
 *
 * Filenames are never changed — scripts/sync-videos.mjs slugs them on the way
 * into `public/`, and the manifest it writes is keyed on the result.
 *
 * Run `npm run videos` afterwards: the sync copies on size, so it needs to see
 * the new ones.
 *
 * Needs ffmpeg on PATH (or $FFMPEG pointing at the binary).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SOURCE     = path.join(ROOT, 'src/assets/Portfolio/Videography');
const BACKUP_DIR = path.join(ROOT, '_originals');

const FFMPEG  = process.env.FFMPEG  ?? 'ffmpeg';
const FFPROBE = process.env.FFPROBE ?? 'ffprobe';

/* Long edge, in pixels. A reel is displayed at most a phone-screen wide and the
   grid never renders one larger than 1080 across, so 1920 on the long edge is
   already generous — it exists to bring the 4K master down, not to upscale. */
const MAX_EDGE = 1920;

/* Constant Rate Factor. 28 is a notch leaner than the 23 default: these play
   muted in a feed, in motion, at thumbnail size, where the difference doesn't
   read. The ceiling on top stops a busy, high-motion clip from spiking. */
const CRF = 28;
const MAXRATE = '3500k';
const BUFSIZE = '7000k';

/* Shooting above this buys nothing on the web and costs proportionally. The
   50fps wedding master is the one this catches. */
const MAX_FPS = 30;

/* Already-web-grade clips are left alone — re-encoding would only cost quality.
   The BTS pair land here: 480x848 at 1.1 Mbps is what this script aims for. */
const SKIP_UNDER_BITRATE = 3_000_000;

const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v']);

const dryRun = process.argv.includes('--dry-run');

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

const exists = (p) => fs.access(p).then(() => true, () => false);

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { windowsHide: true });
    let stderr = '';
    child.stderr.on('data', (d) => { stderr += d; });
    child.stdout.on('data', (d) => { stderr += d; });
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve(stderr) : reject(new Error(stderr.slice(-2000))));
  });
}

async function probe(file) {
  const out = await run(FFPROBE, [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,bit_rate',
    '-show_entries', 'format=duration,bit_rate',
    '-of', 'default=noprint_wrappers=1',
    file,
  ]);

  const field = (key) => {
    const match = out.match(new RegExp(`^${key}=(.+)$`, 'm'));
    const value = match && match[1] !== 'N/A' ? Number(match[1]) : null;
    return Number.isFinite(value) ? value : null;
  };

  return {
    width: field('width'),
    height: field('height'),
    duration: field('duration'),
    bitrate: field('bit_rate'),
  };
}

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
    else if (VIDEO_EXT.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function compress(file) {
  const rel = path.relative(ROOT, file);
  const before = (await fs.stat(file)).size;
  const backup = path.join(BACKUP_DIR, rel);
  const hasBackup = await exists(backup);

  /* Read the master, not whatever is currently in place: on a second run the
     file at `file` is already the compressed one. */
  const source = hasBackup ? backup : file;
  const meta = await probe(source);

  /* Bitrate is the test rather than file size — a long clip can be big and
     already lean, and it's the per-second weight that a viewer pays. */
  const bitrate = meta.bitrate ?? (meta.duration ? (before * 8) / meta.duration : null);
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (!hasBackup && bitrate !== null && bitrate <= SKIP_UNDER_BITRATE && longEdge <= MAX_EDGE) {
    return { rel, skipped: true, before, after: before };
  }

  const dims = meta.width && meta.height ? `${meta.width}x${meta.height}` : '?';

  if (dryRun) {
    return { rel, skipped: false, before, after: null, dims, bitrate };
  }

  /* Encode beside the target and rename, so an interrupted run can never leave
     a half-written file in place of a video. */
  const tmp = `${file}.tmp-compress`;

  try {
    await run(FFMPEG, [
      '-y',
      '-i', source,

      /* `force_original_aspect_ratio=decrease` fits inside the box either way
         round, so portrait reels and the one landscape film share a rule. The
         `-2` pair keeps both edges even, which yuv420p requires. */
      '-vf', `scale=w=${MAX_EDGE}:h=${MAX_EDGE}:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=${MAX_FPS}`,

      '-c:v', 'libx264',
      '-profile:v', 'high',
      '-preset', 'slow',
      '-crf', String(CRF),
      '-maxrate', MAXRATE,
      '-bufsize', BUFSIZE,

      /* Safari refuses anything else, and it's what every browser decodes in
         hardware. */
      '-pix_fmt', 'yuv420p',

      /* Two seconds between keyframes: the lightbox seeks, and a sparse GOP
         makes scrubbing land late. */
      '-g', String(MAX_FPS * 2),

      '-c:a', 'aac',
      '-b:a', '128k',
      '-ac', '2',

      /* Without this the index sits at the end of the file and playback can't
         start until the whole clip has downloaded — the single most important
         flag here. */
      '-movflags', '+faststart',

      /* The temp name ends in `.tmp-compress`, which tells ffmpeg nothing about
         the container it's meant to write, so the muxer has to be named. */
      '-f', 'mp4',

      tmp,
    ]);

    const after = (await fs.stat(tmp)).size;

    /* A clip that came out heavier than it went in is one this script has
       nothing to offer. Drop the attempt rather than bank a regression. */
    if (after >= before && !hasBackup) {
      await fs.rm(tmp, { force: true });
      return { rel, skipped: true, before, after: before };
    }

    if (!hasBackup) {
      await fs.mkdir(path.dirname(backup), { recursive: true });
      await fs.copyFile(file, backup);
    }
    await fs.rename(tmp, file);

    return { rel, skipped: false, before, after, dims, bitrate };
  } catch (error) {
    await fs.rm(tmp, { force: true });
    throw error;
  }
}

/* ── Run ── */

try {
  await run(FFPROBE, ['-version']);
} catch {
  console.error(
    `ffmpeg not found (looked for "${FFMPEG}"/"${FFPROBE}").\n` +
    'Install it — `winget install Gyan.FFmpeg` — or point $FFMPEG and $FFPROBE at the binaries.'
  );
  process.exit(1);
}

const files = [];
for await (const file of walk(SOURCE)) files.push(file);
files.sort();

if (files.length === 0) {
  console.error(`No videos under ${path.relative(ROOT, SOURCE)}`);
  process.exit(1);
}

const results = [];
let failed = 0;

for (const [index, file] of files.entries()) {
  const label = path.relative(SOURCE, file);
  process.stdout.write(`[${index + 1}/${files.length}] ${label} … `);
  try {
    const result = await compress(file);
    results.push(result);
    if (result.skipped) {
      console.log('already web-grade, left alone');
    } else if (dryRun) {
      console.log(`${mb(result.before)} → would re-encode (${result.dims})`);
    } else {
      const saved = ((1 - result.after / result.before) * 100).toFixed(0);
      console.log(`${mb(result.before)} → ${mb(result.after)}  (−${saved}%)`);
    }
  } catch (error) {
    failed += 1;
    console.log('FAILED');
    console.error(`    ${error.message.split('\n').filter(Boolean).pop() ?? error.message}`);
  }
}

const before = results.reduce((sum, r) => sum + r.before, 0);
const after = results.reduce((sum, r) => sum + (r.after ?? r.before), 0);
const touched = results.filter(r => !r.skipped).length;

console.log('');
console.log(dryRun ? 'DRY RUN — nothing was written' : `Originals preserved in ${path.relative(ROOT, BACKUP_DIR)}/`);
console.log(`${touched} re-encoded, ${results.length - touched} left alone${failed ? `, ${failed} failed` : ''}`);
if (!dryRun) {
  console.log(`${mb(before)} → ${mb(after)}  (−${((1 - after / before) * 100).toFixed(0)}%)`);
  console.log('');
  console.log('Now run `npm run videos` to re-sync public/ and rewrite the manifest.');
}

if (failed) process.exit(1);
