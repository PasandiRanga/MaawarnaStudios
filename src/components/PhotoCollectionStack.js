'use client';

/*
 * Photo gallery — one ScrollStack card per collection, each card holding that
 * collection's full set.
 *
 * Three depths, each one narrowing what you're looking at: the stack is every
 * collection, tapping a frame opens that collection as an accordion resting on
 * the frame you tapped, and tapping the open frame lifts it out on its own to be
 * looked at properly. Escape walks back up a level at a time.
 *
 * Product photography groups by brand, graduation photography by album; the only
 * thing that changes between them is the collections passed in and the eyebrow
 * over each card.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AccordionGallery from './AccordionGallery';
import PhotoZoom from './PhotoZoom';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { getLenis } from './SmoothScrolling';
import './PhotoCollectionStack.css';

const BLUE = '#3b82f6';

const isPortrait = (image) => image.height > image.width;

/* next/image only generates a blur placeholder for extensions it recognises in
   lower case, and cameras write `.JPG` — so a folder dropped in straight off the
   card can yield imports with no `blurDataURL`, which `placeholder="blur"` throws
   on. Renaming to `.jpg` is the real fix; this just keeps one stray file from
   taking the whole gallery down while nobody's looking. */
const blurProps = (image) => (image.blurDataURL ? { placeholder: 'blur' } : {});

/* Fill the card exactly, whatever the set size. Up to four shots run in a single
   row; beyond that they go two-deep, and an odd count is absorbed by letting the
   opening frame take a double cell.
 *
 * Which way that double runs follows the frame itself: a portrait lead spans the
 * two rows and comes out tall, a landscape one spans two columns and comes out
 * wide. Either way the remaining shots fill the rest exactly — an odd count has
 * an even number of frames after the lead, which is what the second dimension
 * needs. */
function mosaic(count, heroPortrait) {
  if (count <= 4) return { cols: count, rows: 1, colSpan: 1, rowSpan: 1 };
  const odd = count % 2 === 1;
  const cols = odd ? (count + 1) / 2 : count / 2;
  if (!odd) return { cols, rows: 2, colSpan: 1, rowSpan: 1 };
  return heroPortrait
    ? { cols, rows: 2, colSpan: 1, rowSpan: 2 }
    : { cols, rows: 2, colSpan: 2, rowSpan: 1 };
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

/* Opening a frame opens the set it belongs to. The tapped frame is the one
   standing open, and its neighbours stay on screen as slivers you can walk
   through — so a collection is browsed in place rather than one photo at a
   time behind a pair of arrows. */
function CollectionViewer({ collection, index, onClose }) {
  const [current, setCurrent] = useState(index);
  /* The frame lifted out on its own, if any. Null is the accordion. */
  const [zoomed, setZoomed] = useState(null);

  /* Freeze the page behind the overlay. Lenis owns window scrolling, so asking
     it to stop is the only thing that actually holds. */
  useEffect(() => {
    getLenis()?.stop();
    return () => getLenis()?.start();
  }, []);

  /* Stepping between frames belongs to the accordion, which moves focus along
     with the open panel — what the overlay owns is the way back, one depth at a
     time. Both levels are held here, so the key is handled here rather than
     racing two listeners for it. */
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
        {/* Every frame in the set is on screen at once, so the ones waiting
            their turn are only ever a sliver wide — `sizes` is what stops the
            optimizer sending a full-width copy of each. The open panel is the
            one worth loading first. */}
        <AccordionGallery
          items={collection.images.map((photo) => ({
            image: photo.image,
            alt: photo.alt,
            label: collection.title,
          }))}
          defaultIndex={index}
          onChange={setCurrent}
          onOpen={setZoomed}
          accentColor={BLUE}
          overlayColor="#02040a"
          height="min(72vh, 640px)"
          gap={12}
          radius={14}
          showLabels={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 70vw, 900px"
          priority
          testId={`photo-accordion-${collection.id}`}
        />
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

export default function PhotoCollectionStack({ collections, eyebrow, testId }) {
  const [viewer, setViewer] = useState(null);

  const active = viewer ? collections.find(c => c.id === viewer.id) : null;

  return (
    <div data-testid={testId}>
      {/* One card advances per (card height + itemDistance) of scroll, so the
          gap is the main lever on how long the whole stack takes. Depth reads as
          a grey veil (`dimAmount`) instead of a blur, which would re-rasterise a
          card full of photographs on every frame it changed. */}
      <ScrollStack
        itemDistance={40}
        itemScale={0.028}
        itemStackDistance={22}
        stackPosition="16%"
        scaleEndPosition="6%"
        baseScale={0.88}
        dimAmount={0.18}
      >
        {collections.map((collection) => {
          const heroPortrait = isPortrait(collection.images[0].image);
          const { cols, rows, colSpan, rowSpan } = mosaic(collection.images.length, heroPortrait);
          return (
            <ScrollStackItem key={collection.id} itemClassName="p-4 md:p-6 flex flex-col">
              <header className="shrink-0 px-1 pb-4 md:pb-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-5 h-px" style={{ background: BLUE }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: BLUE }}
                  >
                    {eyebrow}
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight">{collection.title}</h3>
              </header>

              {/* On phones the card grows with its content and the lead frame
                  gets a band of its own — one a portrait shot can't survive, so
                  a portrait lead stays the same shape as the rest of the set. */}
              <div
                className={`pc-grid flex-1${heroPortrait ? ' pc-grid--portrait-hero' : ''}`}
                style={{
                  '--cols': cols,
                  '--rows': rows,
                  '--hero-col-span': colSpan,
                  '--hero-row-span': rowSpan,
                }}
              >
                {collection.images.map((photo, i) => (
                  <button
                    key={photo.image.src}
                    type="button"
                    className={`pc-tile${isPortrait(photo.image) ? ' pc-tile--portrait' : ''}`}
                    aria-label={`Open ${photo.alt}`}
                    onClick={() => setViewer({ id: collection.id, index: i })}
                  >
                    {/* No tile is ever wider than half the 1280px container, and
                        most are a quarter of it — `sizes` is what stops the
                        optimizer handing back a needlessly large copy. A lead
                        frame spanning two rows is no wider than the rest but
                        twice as tall, so it needs the taller source to stay sharp
                        on a retina screen. The blur placeholder is generated at
                        build time from the static import, so a tile fades up from
                        its own colours. */}
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes={
                        i === 0 && rowSpan > 1
                          ? '(max-width: 767px) 50vw, 900px'
                          : '(max-width: 767px) 50vw, 640px'
                      }
                      {...blurProps(photo.image)}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>

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
