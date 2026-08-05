'use client';

/*
 * React Bits — Accordion Gallery, adapted for this site.
 *
 * A row of frames where one panel is open and the rest are slivers: the open
 * one is full colour and square to the viewer, its neighbours are greyed, dimmed
 * and tilted away, and the artwork inside each sliver drifts against the panel
 * so a set reads as one continuous thing rather than a strip of thumbnails.
 *
 * Five changes against the upstream component, most of them forced by how the
 * app is already built:
 *
 * 1. Panels are sized from the photograph rather than from a share of the row.
 *    Upstream gives the open panel a fixed fraction of the width and crops the
 *    artwork to fill it, which turns a portrait frame into a letterbox of its
 *    own middle. Here the open panel *is* the picture's shape — the row's height
 *    and the file's aspect ratio give its width — so nothing is cropped. The
 *    closed panels take what's left over. Every artwork box, open or closed,
 *    keeps the file's proportions; a sliver is a window onto a whole frame, not
 *    a squeezed copy of one.
 *
 * 2. It animates with framer-motion instead of GSAP. Nothing else here uses
 *    GSAP — ScrollStack was adapted off it too — and every state this component
 *    has is derivable from the active index, which is exactly what a declarative
 *    `animate` prop wants.
 *
 * 3. Artwork goes through next/image when an item carries a static import
 *    rather than a URL. The photography originals run to 20 MB a frame, so the
 *    optimizer is not optional; a plain `src` string still renders as an `img`,
 *    and reports its own proportions once it has loaded.
 *
 * 4. It flips to a vertical stack itself below `breakpoint` instead of leaving
 *    that to a media query. Panel sizing, the parallax axis and the artwork's
 *    long edge are all measured in JS, so CSS alone turning the row on its side
 *    left the measurements pointing the wrong way.
 *
 * 5. `--ag-dim` moved from the artwork onto its own element. Upstream sets it on
 *    `.ag-panel__media` but reads it from `.ag-panel__overlay`, a sibling — so
 *    the dim never actually moved off its fallback.
 *
 * Arrow-key navigation also steps from the open panel rather than from the one
 * holding focus, and moves focus with it, so holding an arrow walks the set
 * instead of bouncing between two frames.
 */

import { useCallback, useLayoutEffect, useEffect, useReducer, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import './AccordionGallery.css';

/* The site's easing curve — see the framer variants in the page files. */
const EASE = [0.25, 0.46, 0.45, 0.94];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/* A static import brings its own dimensions along; a URL is just a string. */
const isImport = (image) => typeof image === 'object' && image !== null && 'src' in image;

const srcOf = (item) => (isImport(item.image) ? item.image.src : item.image);

/* next/image only generates a blur placeholder for extensions it recognises in
   lower case — see the longer note in PhotoCollectionStack.js. */
const blurProps = (image) => (image.blurDataURL ? { placeholder: 'blur' } : {});

export default function AccordionGallery({
  items,
  defaultIndex = 0,
  onChange,
  /* Clicking a closed panel opens it; clicking the one already open is a second
     ask, and this is what the caller does with it. Without one, the open panel
     is inert (or follows its link, if it has one). */
  onOpen,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  /* How narrow a closed panel is allowed to get. It's a ceiling as much as a
     floor: a long set thins its slivers down from here rather than crowding the
     open frame out. */
  sliver = 72,
  orientation = 'horizontal',
  breakpoint = 640,
  duration = 0.6,
  ease = EASE,
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  dim = 0.4,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  sizes = '(max-width: 640px) 100vw, 60vw',
  priority = false,
  className = '',
  testId,
}) {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const [box, setBox] = useState(null);
  const [narrow, setNarrow] = useState(false);

  const count = items.length;
  const [active, setActive] = useState(() => clamp(defaultIndex, 0, count - 1));
  /* Which frame the row opened on. Every frame is in the DOM from the first
     render, so `priority` is only ever about which one paints first — pinning it
     here keeps hovering along the row from re-preloading as it goes. */
  const openedOn = useRef(active);

  const prefersReduced = useReducedMotion();
  const vertical = orientation === 'vertical' || narrow;
  const dur = prefersReduced ? 0 : duration;

  /* Proportions come free with a static import. A plain URL has to be asked, so
     it reports back on load and the row re-lays itself out around the answer. */
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

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [breakpoint]);

  /* Everything below is worked out against the row's real size, so a resize (or
     a rotation) re-lays the set out rather than re-deriving it from the props. */
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      setBox((prev) => (
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

  const select = useCallback((i) => {
    setActive(i);
    onChange?.(i);
  }, [onChange]);

  /* Arrows walk the set from whichever panel is open, and take focus with them
     so the next press carries on from where the last one landed. A panel is a
     div rather than a button, so Enter and Space are ours to honour too. */
  const handleKeyDown = (i, e) => {
    const forward = vertical ? 'ArrowDown' : 'ArrowRight';
    const back = vertical ? 'ArrowUp' : 'ArrowLeft';

    if (e.key === forward || e.key === back) {
      e.preventDefault();
      const next = (active + (e.key === forward ? 1 : -1) + count) % count;
      select(next);
      panelRefs.current[next]?.focus();
      return;
    }

    if (onOpen && i === active && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onOpen(i);
    }
  };

  /* ── Geometry ──
     The row runs along one axis and every panel spans the other, so the whole
     layout is two numbers: how far along a panel reaches, and how far across.
     `main` is the axis the row runs on; `cross` is the one it doesn't. */
  const layout = (() => {
    if (!box) return null;

    const main = vertical ? box.height : box.width;
    const cross = vertical ? box.width : box.height;
    const usable = Math.max(main - gap * Math.max(count - 1, 0), 1);

    /* How long a frame is when it spans the full cross axis — the size the
       picture wants to be, before the row has a say. */
    const natural = (aspect) => (vertical ? cross / aspect : cross * aspect);

    /* A long set thins its slivers rather than leaving the open frame nothing to
       stand in; the floor is what's still recognisably a piece of a photograph. */
    const closedMin = count > 1
      ? Math.max(18, Math.min(sliver, usable / (count * 2.2)))
      : 0;

    const openAspect = aspectOf(items[active]);
    /* The open frame takes the size it wants, or everything the slivers can
       spare — whichever is smaller. When the row is what's limiting, the frame
       gives up cross axis to match, so it shrinks whole instead of cropping. */
    const openMain = Math.max(1, Math.min(natural(openAspect), usable - closedMin * (count - 1)));
    const openCross = Math.min(cross, vertical ? openMain * openAspect : openMain / openAspect);

    /* What's left is split between the closed panels — capped at their own
       natural length, so a two-frame set doesn't stretch a sliver past the
       picture inside it and leave bare card showing at the edges. */
    const share = count > 1 ? (usable - openMain) / (count - 1) : 0;

    return { cross, natural, openMain, openCross, share };
  })();

  /* Panel and artwork sizes as CSS, main and cross mapped back onto width and
     height. The artwork box always carries the picture's own proportions: open,
     it *is* the panel; closed, it's a full-length frame the sliver looks in on. */
  const sizeOf = (main, cross) => (vertical
    ? { width: cross, height: main }
    : { width: main, height: cross });

  return (
    <div
      ref={rootRef}
      data-testid={testId}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        /* A number is px, anything else is handed to CSS as written — the
           overlay sizes itself off the viewport. */
        height: typeof height === 'number' ? `${Math.round(height)}px` : height,
        /* Panels can't be sized until the row has been laid out once, and a
           panel with no size is a sliver of nothing — so the set is held back
           for the frame that takes. */
        opacity: layout ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      role="list"
      aria-label="Image gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? motion.a : motion.div;
        const key = item.key ?? srcOf(item);

        const aspect = aspectOf(item);
        const naturalMain = layout ? layout.natural(aspect) : 0;
        const panelMain = layout
          ? (isActive ? layout.openMain : Math.max(1, Math.min(layout.share, naturalMain)))
          : 0;
        const panel = layout
          ? sizeOf(panelMain, isActive ? layout.openCross : layout.cross)
          : null;
        const media = layout
          ? sizeOf(isActive ? layout.openMain : naturalMain, isActive ? layout.openCross : layout.cross)
          : null;

        /* Panels either side lean away from the open one, so the row reads as a
           fan rather than a set of flat cards. */
        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        /* A closed panel is a window onto a longer frame, and the drift moves
           the frame behind it. Half the overhang is as far as it can go before
           an edge of the picture comes into the window, and only the immediate
           neighbours travel that far — further out is a sliver where the
           difference wouldn't show. */
        const drift = clamp(active - i, -1.5, 1.5) / 1.5;
        const shift = isActive ? 0 : drift * parallax * Math.max(naturalMain - panelMain, 0) * 0.5;

        return (
          <Tag
            key={key}
            ref={(el) => { panelRefs.current[i] = el; }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            href={item.link || undefined}
            /* Set on the first frame rather than animated into place, so the
               row opens on the frame it was asked to open on. */
            initial={false}
            animate={{
              ...(panel ?? {}),
              rotateX: vertical ? -rot : 0,
              rotateY: vertical ? 0 : rot,
            }}
            transition={{ duration: dur, ease }}
            style={onOpen && isActive ? { cursor: 'zoom-in' } : undefined}
            onClick={(e) => {
              /* A panel is only a link once it's the one you're looking at —
                 the first click on a closed one just opens it. */
              if (i !== active) {
                e.preventDefault();
                select(i);
              } else if (onOpen) {
                e.preventDefault();
                onOpen(i);
              }
            }}
            onMouseEnter={() => { if (trigger === 'hover') select(i); }}
            onFocus={() => select(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label || item.alt}
          >
            <span className="ag-panel__frame">
              <motion.span
                className="ag-panel__media"
                initial={false}
                animate={{
                  ...(media ?? {}),
                  x: vertical ? 0 : shift,
                  y: vertical ? shift : 0,
                  filter: `grayscale(${grayscale && !isActive ? 1 : 0})`,
                }}
                transition={{ duration: dur, ease }}
              >
                {isImport(item.image) ? (
                  <Image
                    src={item.image}
                    alt={item.alt || item.label || ''}
                    fill
                    sizes={sizes}
                    quality={85}
                    priority={priority && i === openedOn.current}
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
              </motion.span>

              <motion.span
                className="ag-panel__dim"
                aria-hidden="true"
                initial={false}
                animate={{ opacity: isActive ? 0 : dim }}
                transition={{ duration: dur, ease }}
              />
              <span className="ag-panel__scrim" aria-hidden="true" />
            </span>

            {/* Nothing about an open panel says it does anything more, so when
                it does, it says so. */}
            {onOpen && (
              <motion.span
                className="ag-panel__open"
                aria-hidden="true"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: dur, ease }}
              >
                <Maximize2 size={14} />
              </motion.span>
            )}

            {showLabels && item.label && (
              <span className="ag-panel__label" aria-hidden="true">
                {/* The rule and the wording arrive together but not quite — the
                    beat between them is what makes the label feel written on
                    rather than switched on. */}
                <motion.span
                  className="ag-panel__bar"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -14 }}
                  transition={{ duration: isActive ? dur : dur * 0.6, ease }}
                />
                <motion.span
                  className="ag-panel__text"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -14 }}
                  transition={{
                    duration: isActive ? dur : dur * 0.6,
                    ease,
                    delay: isActive && !prefersReduced ? stagger : 0,
                  }}
                >
                  {item.label}
                </motion.span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}
