'use client';

/*
 * Video gallery — one card per clip, laid out in columns at each video's own
 * aspect ratio, previewing silently as it scrolls into view. Tapping a card
 * opens it full-bleed with sound.
 *
 * The photo sub-categories open into a ScrollStack; the video ones open into
 * this. Both take a set and an eyebrow and own the rest.
 *
 * Card shapes come from the manifest rather than from the videos themselves:
 * asking the browser would mean fetching metadata for every clip up front and
 * reflowing the grid as the answers landed. `scripts/sync-videos.mjs` reads the
 * dimensions out of the files and writes them down.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react';
import { getLenis } from './SmoothScrolling';
import './VideoGrid.css';

const BLUE = '#3b82f6';

/* Enough of a card on screen to be worth playing. Low, because a tall portrait
   card can be taller than the viewport and would otherwise never qualify. */
const IN_VIEW = 0.25;

/* Wide enough to earn a second column. A clip cut for landscape is wasted at
   the width a reel wants — it ends up a letterbox strip beside cards three
   times its height. Anything squarer than this stays in one column, where its
   own aspect ratio already gives it the room. */
const WIDE = 1.2;

function Viewer({ reels, index, eyebrow, onClose, onStep }) {
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

  const reel = reels[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      data-testid="video-viewer"
      className="fixed inset-0 z-100 grid place-items-center px-14 py-4 md:px-24 md:py-10"
      style={{ background: 'rgba(2,4,10,0.94)', backdropFilter: 'blur(6px)' }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 md:top-8 md:right-8 z-10 p-2 text-foreground/60 hover:text-foreground transition-colors duration-300"
      >
        <X size={22} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onStep(-1); }}
        aria-label="Previous video"
        className="absolute left-1 md:left-8 z-10 p-3 text-foreground/50 hover:text-foreground transition-colors duration-300"
      >
        <ArrowLeft size={22} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onStep(1); }}
        aria-label="Next video"
        className="absolute right-1 md:right-8 z-10 p-3 text-foreground/50 hover:text-foreground transition-colors duration-300"
      >
        <ArrowRight size={22} />
      </button>

      {/* Keyed on the source so stepping tears the old element down rather than
          reusing it — a swapped `src` on a playing video keeps the previous
          frame on screen until the new one has buffered. */}
      <video
        key={reel.src}
        src={reel.src}
        controls
        autoPlay
        loop
        playsInline
        onClick={(e) => e.stopPropagation()}
        /* Shaped from the manifest so the box is right before the first frame
           arrives — without it the element is 300x150 until then and everything
           jumps. */
        style={{ aspectRatio: `${reel.width} / ${reel.height}` }}
        className="max-h-[80vh] max-w-full w-auto rounded-lg bg-black"
        aria-label={`${eyebrow} — ${index + 1} of ${reels.length}`}
      />

      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: BLUE }}>
          {eyebrow}
        </span>
        <span className="ml-3 text-[11px] tracking-[0.22em] text-foreground/40">
          {String(index + 1).padStart(2, '0')} / {String(reels.length).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  );
}

export default function VideoGrid({ reels, eyebrow, testId }) {
  const gridRef   = useRef(null);
  const videosRef = useRef([]);
  const [visible, setVisible] = useState(() => new Set());
  const [index, setIndex]     = useState(null);
  const [track, setTrack]     = useState(null);

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
  const place = (reel) => {
    if (!track) return undefined;
    const columns = Math.min(reel.width / reel.height >= WIDE ? 2 : 1, track.count);
    const width = columns * track.width + (columns - 1) * track.gap;
    const height = width * (reel.height / reel.width);
    return {
      gridColumn: `span ${columns}`,
      gridRow: `span ${Math.ceil(height + track.gap)}`,
    };
  };

  /* Which cards are on screen. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const i = Number(entry.target.dataset.index);
            if (entry.isIntersecting) next.add(i); else next.delete(i);
          }
          return next;
        });
      },
      { threshold: IN_VIEW },
    );

    for (const card of grid.querySelectorAll('[data-index]')) observer.observe(card);
    return () => observer.disconnect();
  }, [reels]);

  /* Preview what's on screen, hold everything else. A card off screen has never
     been fetched — `preload="none"` means the first `play()` is what starts the
     download — so scrolling past a set costs only what was actually looked at.
     The previews also stop while the viewer is open, rather than grinding away
     behind it. */
  useEffect(() => {
    videosRef.current.forEach((video, i) => {
      if (!video) return;
      if (visible.has(i) && index === null) video.play().catch(() => {});
      else video.pause();
    });
  }, [visible, index]);

  const step = useCallback((delta) => {
    setIndex((current) => (current === null ? current : (current + delta + reels.length) % reels.length));
  }, [reels.length]);

  return (
    <div data-testid={testId}>
      {/* Spans can't be worked out until the grid has been laid out once, and a
          card with no span is a one-pixel sliver — so the set is held back for
          the frame that takes. */}
      <div
        ref={gridRef}
        className="vg-grid"
        style={{ opacity: track ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        {reels.map((reel, i) => (
          <button
            key={reel.src}
            type="button"
            data-index={i}
            onClick={() => setIndex(i)}
            aria-label={`Play ${eyebrow} video ${i + 1} of ${reels.length}`}
            className="vg-card group relative block w-full overflow-hidden rounded-2xl border cursor-pointer"
            style={{
              ...place(reel),
              aspectRatio: `${reel.width} / ${reel.height}`,
              borderColor: 'hsl(220 20% 16%)',
              background: 'linear-gradient(150deg, hsl(220 25% 12%), hsl(220 25% 7%))',
            }}
          >
            <video
              ref={(el) => { videosRef.current[i] = el; }}
              src={reel.src}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* The card is a button, and nothing else about a silently looping
                video says so. */}
            <span
              className="absolute bottom-3 right-3 grid place-items-center w-9 h-9 rounded-full backdrop-blur-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(2,4,10,0.55)' }}
            >
              <Play size={15} fill="currentColor" className="translate-x-px" />
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
            reels={reels}
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
