'use client';

/*
 * React Bits — Depth Carousel, adapted for this site.
 *
 * A set as a receding stack: one frame square to the viewer, the rest ranked
 * behind it and to one side, greying and softening as they go. Swiping left
 * pulls the next frame forward; the one you were on comes toward you and fades
 * out of the way.
 *
 * It's here because the accordion has nowhere to go on a phone. A fan of frames
 * wants width, and turned on its side it becomes a column of letterbox slivers
 * with the open frame squeezed between them — a set you can't actually look at.
 * Depth is the axis a phone does have.
 *
 * Six changes against the upstream component:
 *
 * 1. It animates with framer-motion instead of GSAP. Everything else this
 *    gallery is made of — the overlay, the accordion it stands in for, the
 *    lifted frame above it — animates with framer, and position here is a single
 *    number, which is exactly what a motion value is.
 *
 * 2. Cards are the photograph's shape, not a fixed rectangle. Upstream gives
 *    every card the same `cardWidth × cardHeight` and crops the artwork to fill
 *    it, which turns a portrait frame into a letterbox of its own middle. Here
 *    those two numbers are a bound the picture is fitted inside, so a set shot
 *    both ways keeps both shapes and nothing is trimmed.
 *
 * 3. Artwork goes through next/image when an item carries a static import
 *    rather than a URL — the originals run to 20 MB a frame. A plain `src`
 *    string still renders as an `img` and reports its proportions once loaded.
 *
 * 4. Closed cards grey off with depth, matching the accordion's language for
 *    "not the one you're looking at". It rides the same continuous distance the
 *    blur does, so a half-finished swipe is half-way through the change too.
 *
 * 5. A drag no longer counts as a tap. Upstream clears its drag state on
 *    pointerup and then asks whether the pointer moved from the click handler
 *    that fires straight after — by which time the answer is always no, so
 *    letting go of a swipe re-triggered whichever card was under your thumb.
 *
 * 6. Autoplay and the wheel handler are gone. This opens on a frame the reader
 *    chose and is only ever mounted over a page that has stopped scrolling;
 *    moving off that frame should be their doing.
 */

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import './DepthCarousel.css';

/* The site's easing curve — see the framer variants in the page files. */
const EASE = [0.25, 0.46, 0.45, 0.94];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/* Positions are continuous and can run either side of the set while a swipe is
   in flight, so every comparison against an index goes through here. */
const wrap = (value, n) => ((value % n) + n) % n;

/* A static import brings its own dimensions along; a URL is just a string. */
const isImport = (image) => typeof image === 'object' && image !== null && 'src' in image;

const srcOf = (item) => (isImport(item.image) ? item.image.src : item.image);

/* next/image only generates a blur placeholder for extensions it recognises in
   lower case — see the longer note in PhotoCollectionStack.js. */
const blurProps = (image) => (image.blurDataURL ? { placeholder: 'blur' } : {});

export default function DepthCarousel({
  items,
  defaultIndex = 0,
  onChange,
  /* Tapping a card behind the front one brings it forward; tapping the front one
     is a second ask, and this is what the caller does with it. Without one, the
     front card is inert. */
  onOpen,
  /* The box each photograph is fitted inside, before the row scales itself down
     to whatever space it was actually given. */
  cardWidth = 320,
  cardHeight = 440,
  /* The room the stack is given. A number is px, anything else is handed to CSS
     as written — the overlay sizes itself off the viewport. */
  height = 460,
  radius = 16,
  overlayColor = '#05060a',
  accentColor = '#ffffff',
  /* How far back each rank sits, how far to the side it steps, and how far it
     leans — the three numbers that make the stack read as depth. */
  depth = 200,
  spread = 76,
  tilt = 20,
  tiltDirection = 'right',
  perspective = 1400,
  /* Ranks drawn at all. Everything past this is transparent and untouchable, so
     a long set costs the same to animate as a short one. */
  visibleCards = 3,
  falloff = 0.22,
  blur = 5,
  grayscale = true,
  duration = 0.55,
  ease = EASE,
  loop = true,
  showIndicators = true,
  sizes = '(max-width: 640px) 90vw, 400px',
  priority = false,
  className = '',
  testId,
}) {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const tintRefs = useRef([]);

  const count = items.length;
  const start = clamp(defaultIndex, 0, Math.max(count - 1, 0));

  /* Where the stack is, in cards. Whole numbers are a frame square to the
     viewer; everything between is a swipe in progress. */
  const pos = useMotionValue(start);
  const focusRef = useRef(start);
  const runRef = useRef(null);
  const scaleRef = useRef(1);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(start);

  const prefersReduced = useReducedMotion();

  /* A pointer that went down, and how far it has travelled since. */
  const dragRef = useRef(null);
  /* Whether the click about to arrive is the tail of a swipe rather than a tap
     of its own. Only ever true between one gesture ending and the next starting
     — see the two places it's cleared. */
  const swipedRef = useRef(false);

  /* Layout runs on every animation frame of a swipe and writes straight to the
     DOM, so it reads its inputs from a ref rather than closing over props and
     being rebuilt — and the effect that subscribes it stays mounted for the life
     of the component. */
  const cfgRef = useRef({});
  cfgRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    visibleCards,
    falloff,
    blur,
    grayscale,
    duration: prefersReduced ? 0 : duration,
    ease,
    loop,
    cardWidth,
    cardHeight,
  };

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  /* Proportions come free with a static import. A plain URL has to be asked, so
     it reports back on load and the stack re-fits itself around the answer. */
  const measured = useRef(new Map());
  const [, onMeasured] = useReducer((n) => n + 1, 0);

  const aspectOf = (item) => {
    if (item.aspect) return item.aspect;
    if (isImport(item.image)) return item.image.width / item.image.height;
    return measured.current.get(srcOf(item)) ?? 1;
  };

  const noteAspect = (key, value) => {
    if (!value || measured.current.get(key) === value) return;
    measured.current.set(key, value);
    onMeasured();
  };

  /* The photograph fitted inside the bound — whichever edge runs out first sets
     the size, so the card comes out the picture's own shape. */
  const sizeOf = (aspect) => (aspect > cardWidth / cardHeight
    ? { width: Math.round(cardWidth), height: Math.round(cardWidth / aspect) }
    : { width: Math.round(cardHeight * aspect), height: Math.round(cardHeight) });

  /* ── The stack ──
     Every card's whole appearance is a function of its distance from the front,
     so one pass over that distance is the entire layout. Distance is signed:
     positive is still to come and sits back, negative is behind you and is on
     its way out. */
  const layout = useCallback((p) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === 'left' ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      /* The shorter way round, so the last card is one step from the first
         rather than a set-length journey back through the middle. */
      let d = i - p;
      if (cfg.loop && n > 1) {
        d = wrap(d, n);
        if (d > n / 2) d -= n;
      }

      const back = Math.max(0, d);
      const shown = Math.abs(d) <= cfg.visibleCards + 0.5;

      /* A card that's been passed doesn't go anywhere — it fades where it is,
         in front of the stack, which is what makes the next one read as having
         come forward rather than the whole set having slid sideways. */
      const opacity = shown ? (d < 0 ? Math.max(0, 1 + d) : 1) : 0;

      const grey = cfg.grayscale ? clamp(back, 0, 1) : 0;
      const blurPx = cfg.blur > 0
        ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur)
        : 0;

      el.style.transform = `translate(-50%, -50%) scale(${sc.toFixed(4)}) translateX(${(dir * cfg.spread * d).toFixed(2)}px) translateZ(${(-cfg.depth * d).toFixed(2)}px) rotateY(${(dir * cfg.tilt * clamp(d, 0, 1)).toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      /* `none` rather than a filter that happens to be neutral: any filter at
         all rasterises the card off the compositor, and the front one is the
         photograph the reader is actually looking at. */
      el.style.filter = back > 0.001
        ? `grayscale(${grey.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`
        : 'none';
      el.style.zIndex = String(Math.round(2000 - d * 20));
      el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      /* The darkening is the tint's rather than a `brightness()` in the filter
         above: it's the same look for an opacity change the compositor can make
         on its own, and it lets a set recede into the colour it's standing on
         instead of into black. Driven from here, continuously, so a swipe held
         half-way is a card half-way out of the dark. */
      const tint = tintRefs.current[i];
      if (tint) tint.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
    }
  }, []);

  useEffect(() => pos.on('change', layout), [pos, layout]);

  /* Everything is worked out against the space the stack was actually given, so
     a rotation re-fits the set rather than re-deriving it from the props. The
     cards fan out past these edges by design — what's measured here is whether
     the front frame itself still fits. */
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const cfg = cfgRef.current;
      /* The margins are what the front frame needs around it rather than what
         the whole fan does — a little air either side, and enough under it to
         clear the indicators when the space is short enough for that to matter. */
      scaleRef.current = clamp(
        Math.min(rect.width / (cfg.cardWidth + 48), rect.height / (cfg.cardHeight + 72)),
        0.4,
        1,
      );
      layout(pos.get());
      setReady(true);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [layout, pos]);

  /* Card sizes are React's to write, but the stack they sit in is not — so when
     one changes shape the layout has to be told. */
  useEffect(() => {
    layout(pos.get());
  }, [layout, pos, count, cardWidth, cardHeight, depth, spread, tilt, visibleCards]);

  const settle = useCallback((target, animated) => {
    const cfg = cfgRef.current;
    runRef.current?.stop();
    runRef.current = animate(pos, target, {
      duration: animated ? cfg.duration : 0,
      ease: cfg.ease,
      /* Back inside the set once it lands, so a long walk in one direction
         doesn't drift the number away from the indices it's compared against.
         `jump` rather than `set`, so the wrap isn't read as a swipe's worth of
         velocity by whatever animates next. */
      onComplete: () => {
        if (cfg.count > 0) pos.jump(wrap(pos.get(), cfg.count));
      },
    });
  }, [pos]);

  const focus = useCallback((raw, animated = true) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const idx = cfg.loop ? wrap(raw, n) : clamp(raw, 0, n - 1);

    let delta = idx - pos.get();
    if (cfg.loop && n > 1) {
      delta = wrap(delta, n);
      if (delta > n / 2) delta -= n;
    }
    settle(pos.get() + delta, animated);

    if (idx !== focusRef.current) {
      focusRef.current = idx;
      setActive(idx);
      onChangeRef.current?.(idx);
    }
  }, [pos, settle]);

  const step = useCallback((by) => focus(focusRef.current + by), [focus]);

  /* ── The swipe ──
     The stack follows the thumb rather than waiting for it to be lifted, so a
     half-swipe is a half-turned card and letting go early puts it back. */
  const onPointerDown = (e) => {
    if (count < 2) return;
    runRef.current?.stop();
    /* Cleared at the start of every gesture as well as by the click it's meant
       for: a swipe that captured the pointer can end without a click reaching a
       card at all, and a flag left standing would eat the next real tap. */
    swipedRef.current = false;
    dragRef.current = {
      x: e.clientX,
      from: pos.get(),
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: e.pointerId,
    };
  };

  /* How far the thumb travels for one card. Scaled with the stack, so the
     gesture stays the same size as what it's moving. */
  const stepDistance = () => Math.max(cfgRef.current.cardWidth * 0.5 * scaleRef.current, 40);

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.x;
    /* A few pixels of slop, so a tap that isn't perfectly still is still a tap.
       Past it the pointer is ours until it lifts, wherever it wanders. */
    if (!drag.moved) {
      if (Math.abs(dx) <= 4) return;
      drag.moved = true;
      rootRef.current?.setPointerCapture(drag.id);
    }

    const now = performance.now();
    drag.v = (e.clientX - drag.lastX) / Math.max(now - drag.lastT, 1);
    drag.lastX = e.clientX;
    drag.lastT = now;
    /* Left is forward: the thumb pushes the front frame off toward the way it's
       going and draws the next one up out of the stack behind it. */
    pos.set(drag.from - dx / stepDistance());
  };

  const onPointerEnd = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    swipedRef.current = true;
    /* Where the swipe was heading, not where it stopped — a short flick still
       carries to the next frame, and a slow drag settles back on the nearest. */
    focus(Math.round(pos.get() - (drag.v * 180) / stepDistance()));
  };

  const onCardClick = (i) => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    if (i !== focusRef.current) focus(i);
    else onOpen?.(i);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      step(e.key === 'ArrowRight' ? 1 : -1);
    } else if (onOpen && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onOpen(focusRef.current);
    }
  };

  useEffect(() => () => runRef.current?.stop(), []);

  return (
    <div
      ref={rootRef}
      data-testid={testId}
      className={`depth-carousel${className ? ` ${className}` : ''}`}
      style={{
        '--dc-perspective': `${perspective}px`,
        '--dc-accent': accentColor,
        height: typeof height === 'number' ? `${Math.round(height)}px` : height,
        /* Cards can't be placed until the stack has been measured once, and an
           unplaced card is the whole set piled in the middle — so it's held back
           for the frame that takes. */
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Image gallery"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage">
        {items.map((item, i) => {
          const key = item.key ?? srcOf(item);
          const isActive = i === active;

          return (
            <div
              key={key}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`dc-card${isActive ? ' dc-card--active' : ''}`}
              style={{ ...sizeOf(aspectOf(item)), borderRadius: radius, cursor: onOpen && isActive ? 'zoom-in' : 'pointer' }}
              onClick={() => onCardClick(i)}
              aria-roledescription="slide"
              aria-label={item.label || item.alt}
              aria-current={isActive ? 'true' : undefined}
            >
              {isImport(item.image) ? (
                <Image
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  fill
                  sizes={sizes}
                  quality={85}
                  /* Every frame is in the DOM from the first render, so this is
                     only ever about which one paints first — the one the set was
                     opened on. */
                  priority={priority && i === start}
                  {...blurProps(item.image)}
                  draggable="false"
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  draggable="false"
                  onLoad={(e) => noteAspect(key, e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
                />
              )}

              {/* What darkens a card that isn't the front one. Its opacity is
                  set in `layout`, alongside everything else that follows how far
                  back the card is. */}
              <span
                className="dc-card__tint"
                aria-hidden="true"
                ref={(el) => { tintRefs.current[i] = el; }}
                style={{ background: overlayColor }}
              />

              {/* Nothing about the front card says it does anything more, so
                  when it does, it says so. */}
              {onOpen && isActive && (
                <span className="dc-card__open" aria-hidden="true">
                  <Maximize2 size={14} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" role="tablist" aria-label="Slides">
          {items.map((item, i) => (
            <button
              key={item.key ?? srcOf(item)}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to frame ${i + 1}`}
              className={`dc-dot${active === i ? ' dc-dot--active' : ''}`}
              onClick={() => focus(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
