/*
 * Mirror the videography masters into `public/` and write down where they landed.
 *
 *   node scripts/sync-videos.mjs --dry-run   # report only, touch nothing
 *   node scripts/sync-videos.mjs             # do it
 *
 * Why this exists: the photo galleries discover their own files through
 * `require.context`, but that only reaches things webpack bundles. Video is
 * served as a plain file, so nothing under `src/assets` is addressable by URL —
 * the files have to be copied across, and something has to record the paths for
 * the feeds to read.
 *
 * One folder per sub-category, and the folder's slug is the sub-category id on
 * the portfolio page: drop a clip in `Videography/EventCoverage/` and it appears
 * in the `event-coverage` feed, in filename order. Names are slugged on the way
 * over because the masters carry spaces and ampersands, neither of which
 * survives a URL.
 *
 * `public/videos/portfolio/` belongs to this script — anything in there without
 * a master is deleted, so renaming or removing a source cleans up after itself.
 * The rest of `public/videos/` is left alone.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SOURCE   = path.join(ROOT, 'src/assets/Portfolio/Videography');
const DEST     = path.join(ROOT, 'public/videos/portfolio');
const MANIFEST = path.join(ROOT, 'src/data/videoReels.js');

/* The URL prefix `DEST` is served under. */
const PUBLIC_PREFIX = '/videos/portfolio';

const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v']);

/* Folder names that don't clean up on their own — an all-caps run has no
   lower-to-upper boundary for the camel-case split to find. Same idea as the
   `names` overrides the photo galleries take. */
const NAMES = { BTSFilming: 'BTS Filming' };

/* A clip much larger than this can't be autoplayed in a feed on anything but a
   desk — and can't ship in a deploy either. Worth naming out loud rather than
   discovering at build time. */
const HEAVY_BYTES = 25 * 1024 * 1024;

const dryRun = process.argv.includes('--dry-run');

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const splitCamelCase = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

/* Everything that isn't a letter or digit collapses to a single dash, so
   `Hiruni & Dineth Day 2.mp4` comes out as `hiruni-dineth-day-2.mp4`. */
const slugify = (name) =>
  name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

const folderSlug = (folder) => slugify(NAMES[folder] ?? splitCamelCase(folder));

/* ── Reading a clip's shape ──
 *
 * The grid lays each card out at the video's own aspect ratio, and it has to
 * know that ratio before anything is fetched — asking the browser would mean
 * pulling metadata for every clip on load and reflowing the page as the answers
 * arrive. So the dimensions are read here, out of the MP4 itself, and written
 * into the manifest. No ffprobe: an MP4 is a tree of length-prefixed boxes, and
 * the two numbers wanted sit at the end of a known one.
 */

/* Portrait 9:16 — what a reel is, and the least surprising thing to lay out if
   a file turns out to be unreadable. */
const FALLBACK = { width: 1080, height: 1920 };

/* Walk the boxes in a buffer. Each is [size:4][type:4][body], with size 1
   meaning the real length is the 64 bits that follow the type. */
function* boxes(buffer) {
  let offset = 0;
  while (offset + 8 <= buffer.length) {
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString('latin1', offset + 4, offset + 8);
    let header = 8;
    if (size === 1) {
      if (offset + 16 > buffer.length) return;
      size = Number(buffer.readBigUInt64BE(offset + 8));
      header = 16;
    }
    if (size < header || offset + size > buffer.length) return;
    yield { type, body: buffer.subarray(offset + header, offset + size) };
    offset += size;
  }
}

/* `tkhd` carries a track's display size, preceded by a fixed run of fields
   whose widths depend only on the box version. */
function parseTrackHeader(body) {
  const version = body.readUInt8(0);
  const time = version === 1 ? 8 : 4;

  /* version+flags, created, modified, track id, reserved, duration, reserved,
     layer, alternate group, volume, reserved. */
  let offset = 4 + time + time + 4 + 4 + time + 8 + 2 + 2 + 2 + 2;

  /* The transformation matrix comes first, and it matters: a clip shot on a
     phone is stored in the sensor's landscape orientation with a quarter turn
     recorded here, so the stated width and height are the wrong way round. A
     rotation zeroes the leading diagonal. */
  const a = body.readInt32BE(offset);
  const b = body.readInt32BE(offset + 4);
  const c = body.readInt32BE(offset + 12);
  const d = body.readInt32BE(offset + 16);
  offset += 36;

  const width  = body.readUInt32BE(offset) / 65536;
  const height = body.readUInt32BE(offset + 4) / 65536;
  if (!width || !height) return null;

  const quarterTurn = a === 0 && d === 0 && (b !== 0 || c !== 0);
  return quarterTurn ? { width: height, height: width } : { width, height };
}

/* `moov` can sit at either end of the file, so the top level is walked by
   seeking header to header — never reading the hundreds of megabytes of `mdat`
   in between. */
async function probe(file) {
  const handle = await fs.open(file, 'r');
  try {
    const { size: fileSize } = await handle.stat();
    const header = Buffer.alloc(16);

    for (let offset = 0; offset + 8 <= fileSize;) {
      const { bytesRead } = await handle.read(header, 0, 16, offset);
      if (bytesRead < 8) break;

      let size = header.readUInt32BE(0);
      const type = header.toString('latin1', 4, 8);
      let headerSize = 8;
      if (size === 1) {
        size = Number(header.readBigUInt64BE(8));
        headerSize = 16;
      } else if (size === 0) {
        size = fileSize - offset;
      }
      if (size < headerSize) break;

      if (type === 'moov') {
        const moov = Buffer.alloc(size - headerSize);
        await handle.read(moov, 0, moov.length, offset + headerSize);
        for (const trak of boxes(moov)) {
          if (trak.type !== 'trak') continue;
          for (const box of boxes(trak.body)) {
            /* An audio track's header reports zero by zero, so the first one
               that gives real numbers is the picture. */
            if (box.type !== 'tkhd') continue;
            const shape = parseTrackHeader(box.body);
            if (shape) return shape;
          }
        }
        break;
      }

      offset += size;
    }
  } catch {
    /* Fall through to the fallback — one unreadable file shouldn't stop a sync. */
  } finally {
    await handle.close();
  }

  return null;
}

const exists = (p) => fs.access(p).then(() => true, () => false);

/* Read the source tree: one level of folders, video files inside them. Loose
   files sitting beside the folders are ignored, the way cover images are in the
   photo galleries. */
async function readSource() {
  const groups = [];

  let folders;
  try {
    folders = await fs.readdir(SOURCE, { withFileTypes: true });
  } catch {
    console.error(`No videography assets at ${path.relative(ROOT, SOURCE)}`);
    process.exit(1);
  }

  for (const folder of folders.filter(f => f.isDirectory()).sort((a, b) => byName(a.name, b.name))) {
    const dir = path.join(SOURCE, folder.name);
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const files = entries
      .filter(e => e.isFile() && VIDEO_EXT.has(path.extname(e.name).toLowerCase()))
      .map(e => e.name)
      .sort(byName);

    if (files.length === 0) continue;

    groups.push({
      slug: folderSlug(folder.name),
      folder: folder.name,
      files: files.map(name => ({
        name,
        source: path.join(dir, name),
        target: slugify(path.basename(name, path.extname(name))) + path.extname(name).toLowerCase(),
      })),
    });
  }

  return groups;
}

/* Size is the check rather than mtime: copying rewrites the timestamp, so a
   fresh copy would look stale on the next run. */
async function copyIfChanged(from, to) {
  const src = await fs.stat(from);
  const dst = await fs.stat(to).catch(() => null);

  if (dst && dst.size === src.size) return { copied: false, bytes: src.size };

  if (!dryRun) {
    await fs.mkdir(path.dirname(to), { recursive: true });
    /* Write beside the target and rename, so an interrupted run can't leave a
       half-copied file where a video should be. */
    const tmp = `${to}.tmp-sync`;
    await fs.copyFile(from, tmp);
    await fs.rename(tmp, to);
  }

  return { copied: true, bytes: src.size };
}

/* Anything under DEST that no longer has a master. */
async function prune(expected) {
  const stale = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (!expected.has(full)) stale.push(full);
    }
  }

  await walk(DEST);

  if (!dryRun) {
    for (const file of stale) await fs.rm(file);
    /* Second pass for folders left empty by the removals. */
    for (const entry of await fs.readdir(DEST, { withFileTypes: true }).catch(() => [])) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(DEST, entry.name);
      if ((await fs.readdir(dir)).length === 0) await fs.rmdir(dir);
    }
  }

  return stale;
}

async function writeManifest(groups) {
  const body = groups
    .map(group => {
      const lines = group.files
        .map(file =>
          `    { src: '${PUBLIC_PREFIX}/${group.slug}/${file.target}', ` +
          `width: ${file.shape.width}, height: ${file.shape.height} },`)
        .join('\n');
      return `  '${group.slug}': [\n${lines}\n  ],`;
    })
    .join('\n');

  const contents = `/*
 * Generated by scripts/sync-videos.mjs — do not edit by hand.
 *
 * Keyed by portfolio sub-category id, in the order the videos appear. The
 * dimensions are read out of each file's header so the grid can lay a card out
 * at its true shape without fetching anything. To change what's here, add or
 * remove files under src/assets/Portfolio/Videography and run the script again.
 */

export const videoReels = {
${body}
};
`;

  if (!dryRun) await fs.writeFile(MANIFEST, contents);
}

const groups = await readSource();
const expected = new Set();
let copied = 0;
let bytes = 0;
const heavy = [];
const unreadable = [];

for (const group of groups) {
  for (const file of group.files) {
    const to = path.join(DEST, group.slug, file.target);
    expected.add(to);

    const result = await copyIfChanged(file.source, to);
    bytes += result.bytes;
    if (result.copied) {
      copied += 1;
      console.log(`  + ${group.slug}/${file.target}  (${mb(result.bytes)})`);
    }
    if (result.bytes > HEAVY_BYTES) heavy.push({ rel: `${group.slug}/${file.target}`, bytes: result.bytes });

    const shape = await probe(file.source);
    if (!shape) unreadable.push(`${group.slug}/${file.target}`);
    file.shape = shape ?? FALLBACK;
  }
}

const stale = await prune(expected);
for (const file of stale) console.log(`  - ${path.relative(DEST, file)}`);

await writeManifest(groups);

const total = groups.reduce((sum, g) => sum + g.files.length, 0);

console.log('');
console.log(dryRun ? 'DRY RUN — nothing was written' : `Manifest written to ${path.relative(ROOT, MANIFEST)}`);
console.log(`${total} videos across ${groups.length} sub-categories — ${copied} copied, ${stale.length} pruned`);
console.log(`${mb(bytes)} in ${path.relative(ROOT, DEST)}/`);

if (unreadable.length) {
  console.log('');
  console.log(`No dimensions in the header of ${unreadable.length} file${unreadable.length === 1 ? '' : 's'} — laid out as portrait ${FALLBACK.width}x${FALLBACK.height}:`);
  for (const rel of unreadable) console.log(`  ${rel}`);
}

if (heavy.length) {
  console.log('');
  console.log(`${heavy.length} clip${heavy.length === 1 ? '' : 's'} over ${mb(HEAVY_BYTES)} — too heavy to autoplay in a feed, and too heavy to deploy:`);
  for (const file of heavy.sort((a, b) => b.bytes - a.bytes)) {
    console.log(`  ${file.rel}  ${mb(file.bytes)}`);
  }
}
