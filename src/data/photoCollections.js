/*
 * Turns a folder of folders into gallery collections.
 *
 * Every gallery on the site works the same way: one folder per collection, the
 * images inside it are the set, and nothing is hand-listed — dropping a folder in
 * (or adding frames to one) is the whole job. Empty folders simply don't appear,
 * and loose files sitting beside the folders (sub-category tiles, covers) are
 * ignored.
 *
 * The caller owns the `require.context` because webpack needs the directory as a
 * literal at the call site; everything after that is shared from here.
 *
 * `require.context` is a webpack feature — it is what `next dev` and `next build`
 * use here. If this project ever moves to Turbopack (`next dev --turbo`), swap it
 * for `import.meta.webpackContext`, which Turbopack understands.
 *
 * The module objects are kept whole rather than reduced to `.src`, because
 * next/image needs the intrinsic dimensions to serve a resized copy — the
 * originals run to 20 MB a frame.
 */

const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

/* Folder names are working names, so `SunCrush` reads as `Sun Crush` without
   anyone having to write that down. Names already spaced pass through unchanged. */
const splitCamelCase = (folder) => folder.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

const slugify = (title) => title.replace(/\s+/g, '-').toLowerCase();

/**
 * @param files   a `require.context` over the gallery's root folder
 * @param names   overrides for folder names that don't clean up on their own
 * @param order   the order collections read on the page; anything else lands after
 * @param subject what the set is, for the alt text ("product photography")
 */
export function buildCollections(files, { names = {}, order = [], subject }) {
  const grouped = new Map();

  for (const key of files.keys().sort(byName)) {
    /* './Alikai/DSC02915.jpg.jpeg' — anything not one level deep isn't a set. */
    const parts = key.split('/');
    if (parts.length !== 3) continue;

    const folder = parts[1];
    const module = files(key);

    if (!grouped.has(folder)) grouped.set(folder, []);
    grouped.get(folder).push(module.default ?? module);
  }

  const rank = (folder) => {
    const i = order.indexOf(folder);
    return i === -1 ? order.length : i;
  };

  return [...grouped.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || byName(a, b))
    .map(([folder, images]) => {
      const title = names[folder] ?? splitCamelCase(folder);
      return {
        id: slugify(title),
        title,
        images: images.map((image, i) => ({
          image,
          /* No captions exist for these frames, so the collection and the frame's
             place in the set is the most useful thing a screen reader can be
             told. */
          alt: `${title} ${subject} — frame ${i + 1}`,
        })),
      };
    });
}
