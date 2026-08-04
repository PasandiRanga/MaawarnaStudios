/* Event photography, grouped by event — one folder per shoot.
   Folder discovery and shaping live in `photoCollections` — see the notes there. */

import { buildCollections } from './photoCollections';

const files = require.context(
  '../assets/Portfolio/Photography/EventPhotography',
  true,
  /\.(jpe?g|png|webp|avif)$/i
);

/* Folder names are the event names, so nothing needs renaming — but they aren't
   numbered either, so the reading order is set here rather than left to the
   natural sort (which would open on "21st Birthday Party" purely on the digit). */
export const eventPhotography = buildCollections(files, {
  order: ['Birthday Party', '21st Birthday Party', 'Beach Night'],
  subject: 'event photography',
});
