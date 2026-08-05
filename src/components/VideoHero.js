'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import GradientButton from './GradientButton';
import AnimatedButton from './AnimatedButton';
import FoldHeading from './FoldHeading';

/*
 * Apple-style pinned handoff.
 *
 * Two siblings, overlapped rather than nested:
 *
 *   1. A 170vh runway holding a sticky video stage. The pin eats the first ~70vh
 *      of scrolling, during which the clip zooms in and climbs out of the top.
 *   2. The copy, an ORDINARY section pulled up by -35vh so it starts scrolling
 *      into the viewport while the video is still pinned above it. For that
 *      stretch both are on screen at once — the video leaving, the copy arriving
 *      underneath it.
 *
 * The copy deliberately is not a layer inside the stage. Anything inside the
 * stage is bound to the pin and leaves when the pin does, which is what made it
 * feel like it vanished. As normal flow content it simply keeps scrolling with
 * the page, stays put as long as you're looking at it, and hands over to the
 * next section the way every other section does.
 */

/*
 * Feathers all four edges of the clip so it dissolves into the page instead of
 * ending on a hard rectangle. Two gradient mask layers — one horizontal, one
 * vertical — intersected, so a pixel is only opaque where BOTH say so, which
 * softens the corners as well as the sides. The sides get a wider ramp (16%)
 * than the top/bottom (11%) because that's where the hard edge reads worst
 * against the background.
 */
const EDGE_FEATHER = {
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%),' +
    'linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)',
  maskImage:
    'linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%),' +
    'linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)',
  WebkitMaskComposite: 'source-in', /* Safari / older Blink spelling */
  maskComposite: 'intersect',       /* standard */
};

/* Beat of stillness on the last frame before the logo animation runs again. */
const REPLAY_DELAY_MS = 1000;

/* Must stay in sync with the stage's `pt-2` — it's what the width calc subtracts. */
const STAGE_TOP_PAD = '0.5rem';

const PAGE_BG = '#060b14';

export default function VideoHero() {
  const stageRef = useRef(null);
  const reduceMotion = useReducedMotion();

  /*
   * Replay on a delay rather than with the `loop` attribute: without `loop` the
   * element holds its final frame, so the finished logo sits still for a beat
   * instead of snapping straight back to the start.
   */
  const videoRef = useRef(null);
  const replayTimer = useRef(null);

  const handleEnded = useCallback(() => {
    clearTimeout(replayTimer.current);
    replayTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = 0;
      /* Autoplay can be refused (e.g. tab backgrounded); nothing to recover. */
      v.play().catch(() => {});
    }, REPLAY_DELAY_MS);
  }, []);

  useEffect(() => () => clearTimeout(replayTimer.current), []);

  /* `end end` so progress hits 1 exactly as the sticky stage unpins. */
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  /* ── Video: zoom in, climb out of the top ── */
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const videoY     = useTransform(scrollYProgress, [0, 1], ['0%', '-72%']);
  /* Fades late, and only once the copy is well into frame beneath it, so the
     two genuinely share the screen instead of swapping over instantly. */
  const videoOpacity = useTransform(scrollYProgress, [0.6, 0.95], [1, 0]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  /* Reduced motion: no pin, no overlap — the two just stack in normal flow. */
  const vStyle = reduceMotion
    ? undefined
    : { scale: videoScale, y: videoY, opacity: videoOpacity };

  const revealProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        /* once:true — the reveal never plays backwards, so scrolling further
           can't undo it. */
        viewport: { once: true, amount: 0.3 },
      };

  return (
    <div className="relative" style={{ background: PAGE_BG }}>

      {/* ══ 1. VIDEO RUNWAY — pinned stage, owns the first screen ══ */}
      <section
        ref={stageRef}
        className={reduceMotion ? 'relative' : 'relative h-[170vh]'}
      >
        <div
          className={
            reduceMotion
              ? 'w-full pt-2 h-screen flex items-center justify-center'
              : 'sticky top-0 pt-2 h-screen w-full overflow-hidden flex items-center justify-center'
          }
        >
          <motion.div
            style={vStyle}
            className="relative w-full flex items-center justify-center origin-center will-change-transform px-6"
          >
            {/*
              aspect-video is exactly the clip's native 1280×720, so the box and the
              footage share a ratio and neither object-fit mode has anything to cut.

              The width is the largest 16:9 box that fits BOTH axes of the stage:
              min(what the row can give us, what the remaining height allows). Sizing
              off one axis alone would either overflow the viewport on wide screens
              or get clamped off-ratio on narrow ones — and an off-ratio box is what
              reintroduces letterboxing.
            */}
            <div
              className="relative aspect-video"
              style={{
                ...EDGE_FEATHER,
                width: `min(100%, calc((100vh - ${STAGE_TOP_PAD}) * 16 / 9))`,
              }}
            >
              <video
                ref={videoRef}
                onEnded={handleEnded}
                className="w-full h-full object-contain"
                src="/videos/logovid_2.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-hidden="true"
              />

              {/* Vignette — light; the mask does most of the blending */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 42%, rgba(6,11,20,0.5) 100%)' }}
              />
              {/* Film grain */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                }}
              />
            </div>
          </motion.div>

        </div>

        {/*
          Scroll hint — fades the moment the zoom starts.

          Anchored to the RUNWAY at the first screen's bottom, not to the sticky
          box. Inside the sticky box its `bottom-6` tracks the box: once the pin
          releases the box parks at the section's bottom (~170vh) and drags the
          hint down into the copy, which sits at 115–163vh — straight through the
          CTA row. Pinned here at ~100vh it simply scrolls up out of frame and
          stays above the copy's top edge at every scroll position. No z-index
          either: it must never paint over the copy.
        */}
        {!reduceMotion && (
          <motion.div
            style={{ opacity: hintOpacity, top: 'calc(100vh - 3.5rem)' }}
            className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(235,242,255,0.2)' }}>
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={14} style={{ color: 'rgba(235,242,255,0.2)' }} />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/*
        ══ 2. HERO COPY — real page content ══
        The negative top margin overlaps the tail of the runway, so this starts
        rising into view while the video is still pinned above it. Transparent
        background on purpose: the video has to show through during the overlap.
        Past the pin it is just a section, scrolling like any other.

        -55vh is close to the practical limit: the copy's top sits at 170−55 =
        115vh, i.e. only 15vh below the fold, so pulling much harder would leave
        it already peeking onto the first screen at load.
      */}
      <section
        className={`relative z-10 flex items-center justify-center px-6 pb-12 md:pb-16 ${
          reduceMotion ? 'pt-16' : '-mt-[55vh] min-h-[48vh]'
        }`}
      >
        <motion.div
          {...revealProps}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px" style={{ background: 'rgba(96,165,250,0.55)' }} />
            <span
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ color: 'rgba(96,165,250,0.85)' }}
            >
              Creative Production Studio
            </span>
            <div className="w-8 h-px" style={{ background: 'rgba(96,165,250,0.55)' }} />
          </div>

          <FoldHeading
            as="h1"
            className="text-[clamp(2rem,8vw,3.25rem)] md:text-[clamp(2.5rem,5vw,4.2rem)] font-bold tracking-tighter leading-[0.95] mb-5"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            <span className="text-foreground">We Frame Moments </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 42%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              That Build
            </span>
            <span className="text-foreground"> Brands.</span>
          </FoldHeading>

          <p className="text-sm md:text-base text-foreground/45 font-light leading-relaxed mb-8 max-w-lg mx-auto">
            Cinematic videography &amp; photography for product marketing,
            brand stories, and commercial campaigns.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-4">
            <GradientButton href="/portfolio" className="w-full sm:w-auto">
              View Our Work
            </GradientButton>
            <AnimatedButton href="/contact" className="w-full sm:w-auto">
              Start a Project
            </AnimatedButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
