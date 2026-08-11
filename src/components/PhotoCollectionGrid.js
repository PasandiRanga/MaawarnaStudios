'use client';

/*
 * Photo gallery — one tile per collection, two tiles to a row, each tile turning
 * over a handful of frames from the set it stands for.
 *
 * Three depths, each one narrowing what you're looking at: the grid is every
 * collection, tapping a tile opens that collection as an accordion resting on
 * the frame the tile happened to be showing, and tapping the open frame lifts it
 * out on its own to be looked at properly. Escape walks back up a level.
 *
 * The middle depth changes shape on a phone: an accordion fans a set out across
 * width, which a phone hasn't got, so there it becomes a depth carousel you
 * swipe through instead. Same set, same place in it, same way out.
 *
 * Product photography groups by brand, graduation photography by album; the only
 * thing that changes between them is the collections passed in and the eyebrow
 * the tiles are labelled against.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import AccordionGallery from './AccordionGallery';
import DepthCarousel from './DepthCarousel';
import PhotoZoom from './PhotoZoom';
import { getLenis } from './SmoothScrolling';
import './PhotoCollectionGrid.css';

const BLUE = '#3b82f6';

/* The site's easing curve — see the framer variants in the page files. */
const EASE = [0.25, 0.46, 0.45, 0.94];

/* How long a frame holds a tile, and how long the next one takes to cover it.
   The hold is long enough to actually look at a photograph, and the fade slow
   enough that a grid of tiles reads as breathing rather than flicking. */
const HOLD = 5000;
const FADE = 1;

/* How many frames a tile turns over. Enough to say what a set is; few enough
   that a page of tiles isn't a page of loading. */
const PREVIEW = 4;

/* next/image only generates a blur placeholder for extensions it recognises in
   lower case, and cameras write `.JPG` — so a folder dropped in straight off the
   card can yield imports with no `blurDataURL`, which `placeholder="blur"` throws
   on. Renaming to `.jpg` is the real fix; this just keeps one stray file from
   taking the whole gallery down while nobody's looking. */
const blurProps = (image) => (image.blurDataURL ? { placeholder: 'blur' } : {});

/* Which frames a tile shows: spread across the set rather than taken off the
   front, so a tile samples the collection instead of previewing its opening.
   A short set gives up what it has. */
const preview = (count) => {
  const n = Math.min(PREVIEW, count);
  return Array.from({ length: n }, (_, i) => Math.round((i * count) / n));
};

/* Which of the two galleries the overlay opens with. It matches the width the
   accordion gives up at, so the carousel takes over exactly where the fan stops
   fitting. Read before the first paint rather than after one: the overlay is
   only ever mounted by a tap, so there's no server render to disagree with, and
   opening on the wrong gallery for a frame is a visible swap. */
function useNarrow(maxWidth = 640) {
  const query = `(max-width: ${maxWidth}px)`;
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);

  return narrow;
}

/* Which set you're in and how far through it — the same line at both depths, so
   lifting a frame out doesn't lose your place in the collection. */
function Caption({ collection, index }) {
  return (
    <>
      <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: BLUE }}>
        {collection.title}
      </span>
      <span className="ml-3 text-[11px] tracking-[0.22em] text-foreground/40">
        {String(index + 1).padStart(2, '0')} / {String(collection.images.length).padStart(2, '0')}
      </span>
    </>
  );
}

/* Opening a frame opens the set it belongs to. The tapped frame is the one you
   land on and the rest of the collection stays with it — slivers either side on
   a wide screen, ranks behind on a phone — so a set is browsed in place rather
   than one photo at a time behind a pair of arrows. */
function CollectionViewer({ collection, index, onClose }) {
  const [current, setCurrent] = useState(index);
  /* The frame lifted out on its own, if any. Null is the gallery below. */
  const [zoomed, setZoomed] = useState(null);
  const narrow = useNarrow();

  /* Both galleries take the same set — which one is on screen is only a question
     of how much room there is to lay it out in. */
  const items = collection.images.map((photo) => ({
    image: photo.image,
    alt: photo.alt,
    label: collection.title,
  }));

  /* Freeze the page behind the overlay. Lenis owns window scrolling, so asking
     it to stop is the only thing that actually holds. */
  useEffect(() => {
    getLenis()?.stop();
    return () => getLenis()?.start();
  }, []);

  /* Stepping between frames belongs to whichever gallery is on screen — what
     the overlay owns is the way back, one depth at a time. Both levels are held
     here, so the key is handled here rather than racing two listeners for it. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (zoomed !== null) setZoomed(null);
      else onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomed, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      data-testid="photo-lightbox"
      className="fixed inset-0 z-100 grid place-items-center px-4 py-16 md:px-14 md:py-20"
      style={{ background: 'rgba(2,4,10,0.94)', backdropFilter: 'blur(6px)' }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 md:top-8 md:right-8 z-10 p-2 text-foreground/60 hover:text-foreground transition-colors duration-300"
      >
        <X size={22} />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl"
      >
        {narrow ? (
          /* One frame at a time, with the rest of the set ranked behind it so
             you can see there is one. Swiping left brings the next forward. The
             front card is about as wide as the screen, and `sizes` says so. */
          <DepthCarousel
            items={items}
            defaultIndex={index}
            onChange={setCurrent}
            onOpen={setZoomed}
            accentColor={BLUE}
            overlayColor="#02040a"
            height="min(72vh, 640px)"
            radius={14}
            sizes="(max-width: 640px) 92vw, 420px"
            priority
            testId={`photo-carousel-${collection.id}`}
          />
        ) : (
          /* Every frame in the set is on screen at once, so the ones waiting
             their turn are only ever a sliver wide — `sizes` is what stops the
             optimizer sending a full-width copy of each. The open panel is the
             one worth loading first. */
          <AccordionGallery
            items={items}
            defaultIndex={index}
            onChange={setCurrent}
            onOpen={setZoomed}
            accentColor={BLUE}
            overlayColor="#02040a"
            height="min(72vh, 640px)"
            gap={12}
            radius={14}
            showLabels={false}
            sizes="(max-width: 1280px) 70vw, 900px"
            priority
            testId={`photo-accordion-${collection.id}`}
          />
        )}
      </motion.div>

      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <Caption collection={collection} index={current} />
      </div>

      {/* Sits over the accordion rather than replacing it — the set stays where
          it was, blurred, and closing the frame drops you straight back onto it. */}
      <AnimatePresence>
        {zoomed !== null && (
          <PhotoZoom
            photo={collection.images[zoomed]}
            caption={<Caption collection={collection} index={zoomed} />}
            onClose={() => setZoomed(null)}
            testId={`photo-zoom-${collection.id}`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* One collection, standing for itself. The frames it shows are stacked rather
   than swapped: the incoming one fades up over the top of whatever is under it
   and the one beneath only cuts out once it's fully covered, so a tile never
   flashes its own background halfway through a change. */
function CollectionTile({ collection, eyebrow, offset, onOpen }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();

  const picks = useMemo(() => preview(collection.images.length), [collection.images.length]);
  const [shown, setShown] = useState(0);

  const count = collection.images.length;

  /* The turn runs only while the tile is on screen. A page of tiles cycling out
     of sight is work nobody can see, and on a phone it's work with a battery
     cost. Reduced motion stops it before it starts — the lead frame is a fine
     thing for a tile to be. */
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced || picks.length < 2) return;

    let opening = null;
    let turning = null;

    const stop = () => {
      clearTimeout(opening);
      clearInterval(turning);
      opening = turning = null;
    };

    const start = () => {
      if (opening || turning) return;
      /* Tiles are offset against each other so a grid of them doesn't turn over
         in lockstep, which reads as one thing blinking rather than several
         playing. */
      opening = setTimeout(() => {
        opening = null;
        turning = setInterval(() => setShown((i) => (i + 1) % picks.length), HOLD);
      }, offset);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [picks.length, offset, prefersReduced]);

  return (
    <button
      ref={ref}
      type="button"
      /* Straight to the frame you were looking at, so the tile hands the set
         over at the place it left off rather than starting it again. */
      onClick={() => onOpen(picks[shown])}
      data-testid={`collection-tile-${collection.id}`}
      aria-label={`Open ${collection.title} — ${eyebrow}, ${count} ${count === 1 ? 'frame' : 'frames'}`}
      className="pc-card"
    >
      {/* A span rather than a div: everything in here lives inside a button,
          which only takes phrasing content. */}
      <span className="pc-card__frame">
        {picks.map((index, i) => {
          const photo = collection.images[index];
          return (
            <motion.span
              key={photo.image.src}
              className="pc-card__shot"
              initial={false}
              animate={{ opacity: i === shown ? 1 : 0 }}
              /* The frame coming up fades; the one going out holds until that
                 fade has finished and then cuts, invisibly, from behind it. */
              transition={i === shown
                ? { duration: FADE, ease: EASE }
                : { duration: 0, delay: FADE }}
              style={{ zIndex: i === shown ? 2 : 1 }}
            >
              {/* Two tiles to a row all the way down, so a tile is about half
                  the viewport on a phone and half the 1152px container on a
                  desktop — which is what `sizes` tells the optimizer. */}
              <Image
                src={photo.image}
                alt=""
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 45vw, 560px"
                {...blurProps(photo.image)}
                className="object-cover"
              />
            </motion.span>
          );
        })}
      </span>

      {/* The wash the title is read against, and the ring that answers a hover
          — both of them above the frames, neither of them in the way. */}
      <span className="pc-card__scrim" aria-hidden="true" />
      <span className="pc-card__ring" aria-hidden="true" />

      <span className="pc-card__label">
        <span className="flex items-center gap-2 mb-1.5">
          <span className="w-4 h-px" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: BLUE }}>
            {String(count).padStart(2, '0')} {count === 1 ? 'Frame' : 'Frames'}
          </span>
        </span>
        <span className="block text-lg md:text-2xl font-bold tracking-tight">
          {collection.title}
        </span>
        <span className="pc-card__rule" />
      </span>
    </button>
  );
}

export default function PhotoCollectionGrid({ collections, eyebrow, testId }) {
  const [viewer, setViewer] = useState(null);

  const active = viewer ? collections.find(c => c.id === viewer.id) : null;

  return (
    <div data-testid={testId}>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {collections.map((collection, i) => (
          <CollectionTile
            key={collection.id}
            collection={collection}
            eyebrow={eyebrow}
            /* A quarter-beat between neighbours, wrapping every fourth tile: at
               two to a row that puts a whole beat between the rows and repeats
               only two rows down, which is far enough apart not to read as a
               pattern. */
            offset={(i % 4) * (HOLD / 4)}
            onOpen={(index) => setViewer({ id: collection.id, index })}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <CollectionViewer
            collection={active}
            index={viewer.index}
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
