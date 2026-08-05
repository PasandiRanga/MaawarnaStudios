'use client';

/*
 * A picture you can get closer to, and the controls that do it.
 *
 * Zooming happens *inside* the picture rather than to it. The frame keeps the
 * size and place it opened at, and what changes is how much of the file that
 * rectangle holds — so going closer never grows the thing on screen or shifts
 * the page around it. Past 100% the picture can be dragged behind that
 * rectangle, as far as its own edges and no further.
 *
 * It fills whatever box it's handed: the picture takes the room above the
 * controls, at the file's own proportions, and the controls sit under it. Both
 * the photo zoom and the graphics viewer hand it a box and own everything
 * around it — captions, arrows, and the way out — because closing belongs to
 * whoever opened it and only they know what's underneath.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, motion, useMotionValue } from 'framer-motion';
import { Minus, Plus, RotateCcw } from 'lucide-react';

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

export default function ZoomableImage({
  image,
  alt,
  /* Capped rather than `100vw` because unbounded, the optimizer would be asked
     for a copy wider than the master on a retina display; zooming past that
     scales it up, which is what zoom does. */
  sizes = '(max-width: 1280px) 95vw, 1400px',
  quality = 90,
  priority = true,
  className = '',
}) {
  const frameRef = useRef(null);
  const pressedAt = useRef(null);
  const [frame, setFrame] = useState(null);
  const [scale, setScale] = useState(MIN);

  /* Panning is a drag rather than state, so a frame follows the pointer without
     a render per frame; the reset is what puts it back. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* The room the picture has, measured rather than written in percentages: a
     percentage height resolves against the parent's height, and every parent
     between here and the picture is sized by its contents — which is the
     picture. The frame's own size comes off the box handed in, so that circle is
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

  /* The rectangle the picture gets: as large as the frame allows at the file's
     own proportions. It's fixed for as long as the picture is open — the zoom
     happens behind it. */
  const aspect = image.width && image.height ? image.width / image.height : 3 / 2;

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
    <div className={`flex flex-col min-h-0 ${className}`}>
      {/* The room the picture has to fill, sized off the box handed in rather
          than by padding around its contents — so how big the picture is allowed
          to be never depends on how big the picture is. */}
      <div ref={frameRef} className="flex-1 min-h-0 grid place-items-center">
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
              {/* The box is already the picture's own shape, so filling it crops
                  nothing. */}
              <Image
                src={image}
                alt={alt}
                fill
                sizes={sizes}
                quality={quality}
                priority={priority}
                {...blurProps(image)}
                draggable={false}
                className="object-contain select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-4 shrink-0 self-center flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-sm"
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
    </div>
  );
}
