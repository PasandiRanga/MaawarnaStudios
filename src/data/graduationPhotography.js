/* Graduation photography, grouped by album — one folder per shoot.
   Folder discovery and shaping live in `photoCollections` — see the notes there.
   `GradSubTile.jpg` sits loose in the root and is skipped for that reason. */

import { buildCollections } from './photoCollections';

const files = require.context(
  '../assets/Portfolio/Photography/GraduationPhotography',
  true,
  /\.(jpe?g|png|webp|avif)$/i
);

/* No explicit order: album folders are numbered, and the natural sort already
   reads Album 1 before Album 2 (and before Album 10). */
export const graduationPhotography = buildCollections(files, {
  subject: 'graduation photography',
});
