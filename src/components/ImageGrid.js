'use client';

/*
 * Image feed — one card per piece, laid out in columns at each image's own
 * aspect ratio. Portrait, square and landscape all sit in the same set without
 * anything being cropped to fit: a card claims the shape of the file behind it,
 * and wide pieces take two columns so a landscape design isn't reduced to a
 * strip beside its portrait neighbours. Tapping a card opens it full-bleed, with
 * the same zoom the photography sets get — a logo or a label is often the whole
 * point of a piece, and at feed size there's no reading it.
 *
 * This is to the graphics sub-categories what VideoGrid is to the video ones and
 * PhotoCollectionStack is to the photo ones — it takes a set and an eyebrow and
 * owns the rest. It shares VideoGrid's masonry approach because the problem is
 * the same one; the difference is that card shapes here come free with the
 * static import rather than needing a manifest, and next/image does the loading.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { getLenis } from './SmoothScrolling';
import ZoomableImage from './ZoomableImage';
import './ImageGrid.css';

const BLUE = '#3b82f6';

/* Wide enough to earn a second column. Anything squarer than this stays in one,
   where its own aspect ratio already gives it the room it needs. */
const WIDE = 1.2;

/* next/image only generates a blur placeholder for extensions it recognises in
   lower case — see the longer note in PhotoCollectionStack.js. */
const blurProps = (image) => (image.blurDataURL ? { placeholder: 'blur' } : {});

function Viewer({ pieces, index, eyebrow, onClose, onStep }) {
  /* Freeze the page behind the overlay. Lenis owns window scrolling, so asking
     it to stop is the only thing that actually holds. */
  useEffect(() => {
    getLenis()?.stop();
    return () => getLenis()?.start();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  const piece = pieces[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      data-testid="image-viewer"
      /* The picture comes after the controls in the DOM, so without a stacking
         order of their own the arrows sit underneath it and the picture eats
         the click. */
      className="fixed inset-0 z-100"
      style={{ background: 'rgba(2,4,10,0.94)', backdropFilter: 'blur(6px)' }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 md:top-8 md:right-8 z-10 p-2 text-foreground/60 hover:text-foreground transition-colors duration-300"
      >
        <X size={22} />
      </button>

      {/* Halfway down, said out loud: the overlay used to centre its children
          for them, and an arrow with nothing to say about the vertical sits at
          the top of the screen instead. */}
      <button
        onClick={(e) => { e.stopPropagation(); onStep(-1); }}
        aria-label="Previous image"
        className="absolute left-1 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 text-foreground/50 hover:text-foreground transition-colors duration-300"
      >
        <ArrowLeft size={22} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onStep(1); }}
        aria-label="Next image"
        className="absolute right-1 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 text-foreground/50 hover:text-foreground transition-colors duration-300"
      >
        <ArrowRight size={22} />
      </button>

      {/* The room the piece and its zoom controls share, measured off the
          overlay's edges: clear of the arrows either side, and clear of the
          counter along the bottom. Keyed on the source so stepping mounts a
          fresh element rather than cross-fading the new file over the old one's
          frame — which also drops the next piece back to 100%, since the zoom
          you were at on the last one says nothing about this one. */}
      <div className="absolute inset-x-14 top-6 bottom-16 md:inset-x-24 md:top-10">
        <ZoomableImage
          key={piece.image.src}
          image={piece.image}
          alt={piece.alt}
          sizes="(max-width: 1280px) 90vw, 1200px"
          quality={85}
          className="w-full h-full"
        />
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: BLUE }}>
          {eyebrow}
        </span>
        <span className="ml-3 text-[11px] tracking-[0.22em] text-foreground/40">
          {String(index + 1).padStart(2, '0')} / {String(pieces.length).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  );
}

export default function ImageGrid({ pieces, eyebrow, testId }) {
  const gridRef = useRef(null);
  const [index, setIndex] = useState(null);
  const [track, setTrack] = useState(null);

  /* How wide a column currently is, read back from the grid rather than
     duplicated from the stylesheet — the breakpoints stay in one place, and a
     resize re-reads instead of re-deriving. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const styles = getComputedStyle(grid);
      /* Resolved to pixels by the time it's read back, one entry per column. */
      const columns = styles.gridTemplateColumns.split(' ').map(parseFloat);
      if (!columns.length || Number.isNaN(columns[0])) return;
      setTrack({ width: columns[0], count: columns.length, gap: parseFloat(styles.columnGap) || 0 });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  /* A card claims the columns its shape wants, then as many one-pixel rows as
     the resulting height needs — plus the gutter, which is part of the span
     because the grid itself has no row gap. */
  const place = ({ image }) => {
    if (!track) return undefined;
    const columns = Math.min(image.width / image.height >= WIDE ? 2 : 1, track.count);
    const width = columns * track.width + (columns - 1) * track.gap;
    const height = width * (image.height / image.width);
    return {
      gridColumn: `span ${columns}`,
      gridRow: `span ${Math.ceil(height + track.gap)}`,
    };
  };

  const step = useCallback((delta) => {
    setIndex((current) => (current === null ? current : (current + delta + pieces.length) % pieces.length));
  }, [pieces.length]);

  return (
    <div data-testid={testId}>
      {/* Spans can't be worked out until the grid has been laid out once, and a
          card with no span is a one-pixel sliver — so the set is held back for
          the frame that takes. */}
      <div
        ref={gridRef}
        className="ig-grid"
        style={{ opacity: track ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        {pieces.map((piece, i) => (
          <button
            key={piece.image.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open ${eyebrow} image ${i + 1} of ${pieces.length}`}
            className="ig-card group relative block w-full overflow-hidden rounded-2xl border cursor-pointer"
            style={{
              ...place(piece),
              aspectRatio: `${piece.image.width} / ${piece.image.height}`,
              borderColor: 'hsl(220 20% 16%)',
              /* Logo marks come through as PNGs with transparent ground, so what
                 sits behind the image is part of the artwork here. */
              background: 'linear-gradient(150deg, hsl(220 25% 12%), hsl(220 25% 7%))',
            }}
          >
            {/* The card is already the image's own shape, so `object-cover`
                crops nothing — it just guarantees no half-pixel letterbox where
                the span maths and the aspect ratio round apart. A card is at
                most half the 1280px container and usually a quarter of it, which
                is what `sizes` tells the optimizer. */}
            <Image
              src={piece.image}
              alt={piece.alt}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 320px"
              {...blurProps(piece.image)}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <span
              className="absolute bottom-3 right-3 grid place-items-center w-9 h-9 rounded-full backdrop-blur-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(2,4,10,0.55)' }}
            >
              <Maximize2 size={14} />
            </span>

            <span
              className="absolute inset-0 ring-inset transition-shadow duration-300 rounded-2xl pointer-events-none group-hover:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.55)]"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <Viewer
            pieces={pieces}
            index={index}
            eyebrow={eyebrow}
            onClose={() => setIndex(null)}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
