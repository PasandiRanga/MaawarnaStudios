/*
 * Graphic design work, keyed by the portfolio sub-category it belongs to.
 *
 * Same deal as the photo collections: nothing is hand-listed, the folder under
 * `src/assets/Portfolio/Graphic` *is* the set, and dropping a file in is the
 * whole job. The one thing that has to be written down is which folder answers
 * to which sub-category id, because the ids are slugs the page and its share
 * links already use and the folders are working names.
 *
 * Unlike the photo galleries there's no second level here — a graphics
 * sub-category is one flat feed, not a shelf of collections — so this builds the
 * arrays itself rather than going through `buildCollections`.
 *
 * The module objects are kept whole rather than reduced to `.src`: next/image
 * needs the intrinsic dimensions to serve a resized copy, and the grid needs
 * them to shape a card before the file has loaded.
 *
 * `require.context` is a webpack feature — see the note in photoCollections.js
 * about what to swap it for under Turbopack.
 */

const files = require.context(
  '../assets/Portfolio/Graphic',
  true,
  /\.(jpe?g|png|webp|avif)$/i
);

/* Folder → sub-category id, in the order the sub-tiles read on the page. */
const FOLDERS = {
  LogoDesigns: 'logo-designs',
  SocialMediaCreatives: 'social-creatives',
  PromotionalMaterials: 'promotional-materials',
  PackagingDesign: 'packaging',
};

/* What the set is, for the alt text. */
const SUBJECTS = {
  'logo-designs': 'logo design',
  'social-creatives': 'social media creative',
  'promotional-materials': 'promotional material',
  packaging: 'packaging design',
};

const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

function build() {
  const grouped = Object.fromEntries(Object.values(FOLDERS).map(id => [id, []]));

  for (const key of files.keys().sort(byName)) {
    /* './LogoDesigns/eco lux nw.png' — anything not one level deep is a loose
       file beside the folders (GraphicMainTile.jpg) rather than part of a set. */
    const parts = key.split('/');
    if (parts.length !== 3) continue;

    const id = FOLDERS[parts[1]];
    if (!id) continue;

    const module = files(key);
    grouped[id].push(module.default ?? module);
  }

  for (const [id, images] of Object.entries(grouped)) {
    grouped[id] = images.map((image, i) => ({
      image,
      /* These pieces have no titles of their own, so the set and the piece's
         place in it is the most useful thing a screen reader can be told. */
      alt: `${SUBJECTS[id]} — piece ${i + 1}`,
    }));
  }

  return grouped;
}

export const graphicDesigns = build();
