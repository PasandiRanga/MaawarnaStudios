'use client';

/*
 * One frame, front and centre — the level below the accordion.
 *
 * The accordion shows a set; this shows a photograph. It lifts the frame out to
 * the middle of the screen over a blurred wash of whatever it was lifted from,
 * and hands over the two things you actually want once a picture has your full
 * attention: closer, and further back.
 *
 * Zooming happens *inside* the photograph rather than to it. The picture keeps
 * the size and place it opened at whatever the level, and what changes is how
 * much of it that rectangle holds — so going closer never grows the thing on
 * screen or shifts the page around it. Past 100% the picture can be dragged
 * behind that rectangle, as far as its own edges and no further.
 *
 * Escape belongs to whoever opened this — closing the zoom should put you back
 * on the set, not out of it altogether, and only the parent knows that.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, motion, useMotionValue } from 'framer-motion';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';

const BLUE = '#3b82f6';
const EASE = [0.25, 0.46, 0.45, 0.94];

const MIN = 1;
const MAX = 4;
/* One press is a noticeable step without skipping the useful middle. */
const STEP = 1.5;

/* Past this a press is a drag that happened to end where it started, not a
   click — the browser fires one either way. */
const DRAG_SLOP = 6;

/* next/image only generates a blur placeholder for extensions it recognises in
   lower case — see the longer note in PhotoCollectionStack.js. */
const blurProps = (image) => (image.blurDataURL ? { placeholder: 'blur' } : {});

const clamp = (value) => Math.min(Math.max(value, MIN), MAX);

function Control({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid place-items-center w-9 h-9 rounded-full text-foreground/70 enabled:hover:text-foreground enabled:hover:bg-white/5 disabled:opacity-25 transition-colors duration-200"
    >
      {children}
    </button>
  );
}

export default function PhotoZoom({ photo, caption, onClose, testId }) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const pressedAt = useRef(null);
  const [frame, setFrame] = useState(null);
  const [scale, setScale] = useState(MIN);

  /* Panning is a drag rather than state, so a frame follows the pointer without
     a render per frame; the reset is what puts it back. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* The room the photograph has, measured rather than written in percentages: a
     percentage height resolves against the parent's height, and every parent
     between here and the photo is sized by its contents — which is the photo.
     The frame's own size comes off the overlay's edges, so that circle is
     broken and this is a straight answer. */
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      setFrame((prev) => (
        prev && prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height }
      ));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* The rectangle the photograph gets: as large as the frame allows at the
     file's own proportions. It's fixed for as long as the photo is open — the
     zoom happens behind it. */
  const aspect = photo.image.width && photo.image.height
    ? photo.image.width / photo.image.height
    : 3 / 2;

  const view = useMemo(() => {
    if (!frame) return null;
    const width = Math.min(frame.width, frame.height * aspect);
    return { width, height: width / aspect };
  }, [frame, aspect]);

  /* How far the picture can be pushed at a given level before an edge of it
     comes into the rectangle: half of what the zoom pushed outside, per side. */
  const roomAt = useCallback((level) => ({
    x: view ? (view.width * (level - MIN)) / 2 : 0,
    y: view ? (view.height * (level - MIN)) / 2 : 0,
  }), [view]);

  const zoomTo = useCallback((next) => {
    const level = clamp(next);
    setScale(level);
    /* Pulling back leaves the picture further off-centre than the new level has
       room for — and at 100% there's no room at all, so it lands square again
       rather than opening crooked next time. */
    const room = roomAt(level);
    animate(x, Math.min(Math.max(x.get(), -room.x), room.x), { duration: 0.3, ease: EASE });
    animate(y, Math.min(Math.max(y.get(), -room.y), room.y), { duration: 0.3, ease: EASE });
  }, [x, y, roomAt]);

  /* Take focus off whatever opened this and give it back on the way out. While
     the frame is up it's the only thing on screen, so the arrow keys shouldn't
     still be walking the set behind it. */
  useEffect(() => {
    const opener = document.activeElement;
    rootRef.current?.focus();
    return () => { if (opener instanceof HTMLElement) opener.focus(); };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '+' || e.key === '=') zoomTo(scale * STEP);
      if (e.key === '-' || e.key === '_') zoomTo(scale / STEP);
      if (e.key === '0') zoomTo(MIN);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scale, zoomTo]);

  const room = roomAt(scale);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      ref={rootRef}
      /* Stopped, not just handled: this sits inside the accordion's overlay,
         which closes the whole set on a background click. Clicking the wash
         around a lifted frame should put it back, not shut everything. */
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      data-testid={testId}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      tabIndex={-1}
      className="absolute inset-0 z-20 outline-none"
      /* Thin enough to leave the set showing through, soft enough that it reads
         as somewhere the photograph was lifted out of without erasing it. */
      style={{ background: 'rgba(2,4,10,0.62)', backdropFilter: 'blur(10px)' }}
    >
      <button
        onClick={onClose}
        aria-label="Close photo"
        className="absolute top-5 right-5 md:top-8 md:right-8 z-10 p-2 text-foreground/60 hover:text-foreground transition-colors duration-300"
      >
        <X size={22} />
      </button>

      {/* The room the photograph has to fill, sized off the overlay's edges
          rather than by padding around its contents — so how big the picture is
          allowed to be never depends on how big the picture is. What's left is
          the gap between the caption and the controls. */}
      <div
        ref={frameRef}
        className="absolute inset-x-4 top-16 bottom-24 grid place-items-center md:inset-x-16 md:top-20"
      >
        {view && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ width: view.width, height: view.height }}
            className="relative overflow-hidden rounded-lg shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
          >
            <motion.div
              drag={scale > MIN}
              /* Worked out rather than measured from the rectangle: the drag
                 offset is applied before the zoom, so what a measured box would
                 report depends on which of the two framer looked at. Half the
                 overhang per side is the answer either way. */
              dragConstraints={{ left: -room.x, right: room.x, top: -room.y, bottom: room.y }}
              dragElastic={0.05}
              dragMomentum={false}
              whileDrag={{ cursor: 'grabbing' }}
              style={{ x, y, cursor: scale > MIN ? 'grab' : 'zoom-in' }}
              animate={{ scale }}
              transition={{ duration: 0.35, ease: EASE }}
              /* The picture is the third way in and out of a zoom, after the
                 buttons and the wheel: each press goes a step closer until
                 there's nowhere left, then back to the whole frame. A drag ends
                 in a click of its own, so what counts is whether the pointer
                 stayed put. */
              onPointerDown={(e) => { pressedAt.current = { x: e.clientX, y: e.clientY }; }}
              onClick={(e) => {
                e.stopPropagation();
                const from = pressedAt.current;
                if (from && Math.hypot(e.clientX - from.x, e.clientY - from.y) > DRAG_SLOP) return;
                zoomTo(scale >= MAX ? MIN : scale * STEP);
              }}
              onWheel={(e) => zoomTo(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12))}
              className="relative w-full h-full"
            >
              {/* The box is already the photo's own shape, so filling it crops
                  nothing. `sizes` is capped rather than `100vw` because
                  unbounded, the optimizer would be asked for a copy wider than
                  the master on a retina display; zooming past that scales it up,
                  which is what zoom does. */}
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                sizes="(max-width: 1280px) 95vw, 1400px"
                quality={90}
                priority
                {...blurProps(photo.image)}
                draggable={false}
                className="object-contain select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {caption && (
        <div className="absolute top-6 left-0 right-0 px-16 text-center pointer-events-none">
          {caption}
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-sm"
        style={{ background: 'rgba(2,4,10,0.72)', borderColor: 'rgba(59,130,246,0.22)' }}
      >
        <Control label="Zoom out" onClick={() => zoomTo(scale / STEP)} disabled={scale <= MIN}>
          <Minus size={16} />
        </Control>

        <span
          className="w-14 text-center text-[11px] font-bold tracking-[0.14em] tabular-nums"
          style={{ color: scale > MIN ? BLUE : 'rgba(235,242,255,0.45)' }}
        >
          {Math.round(scale * 100)}%
        </span>

        <Control label="Zoom in" onClick={() => zoomTo(scale * STEP)} disabled={scale >= MAX}>
          <Plus size={16} />
        </Control>

        <span className="mx-1 h-4 w-px" style={{ background: 'rgba(59,130,246,0.2)' }} />

        <Control label="Reset zoom" onClick={() => zoomTo(MIN)} disabled={scale === MIN}>
          <RotateCcw size={15} />
        </Control>
      </div>
    </motion.div>
  );
}
