/* Product photography, grouped by the brand it was shot for.
   Folder discovery and shaping live in `photoCollections` — see the notes there. */

import { buildCollections } from './photoCollections';

const files = require.context(
  '../assets/Portfolio/Photography/ProductPhotography',
  true,
  /\.(jpe?g|png|webp|avif)$/i
);

export const productPhotography = buildCollections(files, {
  names: {
    Alikai: 'AliiKai',
    Jwellery: 'Jewellery',
    Penutty: 'Pnutty',
  },
  order: ['Alikai', 'SunCrush', 'CeylonVivid', 'Jwellery', 'Penutty', 'YooBoba'],
  subject: 'product photography',
});
