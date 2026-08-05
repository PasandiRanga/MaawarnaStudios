'use client';

import FoldText from './FoldText';

/* The site's headings all share one entrance: words hinge down from their top
   edge, one after the next, as the section scrolls into view — and again every
   later time it comes back into view, not just on first sight.

   Word-level rather than character-level on purpose — the longer headings here
   run past forty characters, and a per-character stagger would still be landing
   letters well after the reader has moved on. `as` carries the real heading
   level, so the markup stays h1/h2 and the className stays whatever Tailwind
   the page already had. */
const FoldHeading = ({ as = 'h2', splitBy = 'word', ...rest }) => (
  <FoldText
    as={as}
    splitBy={splitBy}
    hinge="top"
    trigger="scroll"
    duration={0.7}
    stagger={0.06}
    ease="power3.out"
    perspective={900}
    creaseShading={0.5}
    {...rest}
  />
);

export default FoldHeading;
