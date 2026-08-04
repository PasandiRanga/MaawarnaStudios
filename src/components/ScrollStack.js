'use client';

/*
 * React Bits — ScrollStack, adapted for this site.
 *
 * Two changes against the upstream component, both forced by how the app
 * already scrolls:
 *
 * 1. It does not create a Lenis instance. `SmoothScrolling` already runs one on
 *    the window for the whole app; a second one would fight it for the wheel.
 *    Card transforms are recomputed on a rAF tick instead, which reads whatever
 *    scroll position the global Lenis has settled on.
 *
 * 2. Card positions are measured once (`offsetTop` against the untransformed
 *    inner wrapper) instead of read from `getBoundingClientRect` every frame.
 *    The cards *are* the things being translated, so measuring their live rect
 *    feeds each frame's transform back into the next frame's trigger points.
 */

import { useLayoutEffect, useRef, useCallback } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

/* Breathing room under the stack when nothing is pinned over it — matches the
   `padding-bottom` the stylesheet gives `.scroll-stack-inner`. */
const BASE_END_PADDING = 64;

const parsePercentage = (value, containerHeight) => {
  if (typeof value === 'string' && value.includes('%')) {
    return (parseFloat(value) / 100) * containerHeight;
  }
  return parseFloat(value);
};

const calculateProgress = (scrollTop, start, end) => {
  if (scrollTop < start) return 0;
  if (scrollTop > end) return 1;
  return (scrollTop - start) / (end - start);
};

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  dimAmount = 0,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null);
  const innerRef = useRef(null);
  const cardsRef = useRef([]);
  /* Document-space tops, transform-free — see the note at the top of the file. */
  const cardOffsetsRef = useRef([]);
  const endOffsetRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastTransformsRef = useRef(new Map());
  const lastScrollRef = useRef(null);
  const stackCompletedRef = useRef(false);

  const measure = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const innerTop = inner.getBoundingClientRect().top + window.scrollY;
    cardOffsetsRef.current = cardsRef.current.map(card => innerTop + card.offsetTop);

    const end = inner.querySelector('.scroll-stack-end');
    endOffsetRef.current = end ? innerTop + end.offsetTop : 0;

    /* A pinned card is translated a long way past where it sits in flow, so the
       scroller has to reserve that overhang as padding — otherwise the stack
       comes to rest on top of whatever follows it on the page. Padding is safe to
       set from here: it sits after the last child, so it moves neither the cards'
       `offsetTop` nor the spacer's, and the value settles on the first pass.

       The reservation is the resting card's own footprint measured down from the
       end spacer: where its top pins, how far the stack has stepped it down, and
       how tall it renders — cards deep in a long stack settle slightly above
       full size, so the scale is read rather than assumed. */
    const last = cardsRef.current[cardsRef.current.length - 1];
    if (last) {
      const i = cardsRef.current.length - 1;
      const containerHeight = window.innerHeight;
      const restingScale = Math.max(1, baseScale + i * itemScale);
      const overhang =
        parsePercentage(stackPosition, containerHeight)
        + itemStackDistance * i
        + last.offsetHeight * restingScale
        - containerHeight / 2;
      inner.style.paddingBottom = `${Math.max(BASE_END_PADDING, Math.ceil(overhang))}px`;
    }

    /* Positions moved, so the frame-to-frame diffing below has nothing valid to
       compare against. */
    lastScrollRef.current = null;
  }, [stackPosition, itemStackDistance, baseScale, itemScale]);

  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    const offsets = cardOffsetsRef.current;
    if (!cards.length || offsets.length !== cards.length) return;

    const scrollTop = window.scrollY;
    if (scrollTop === lastScrollRef.current) return;
    lastScrollRef.current = scrollTop;

    const containerHeight = window.innerHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const pinEnd = endOffsetRef.current - containerHeight / 2;

    /* Which card is currently on top of the stack — everything under it recedes
       by how deep it is buried. */
    let topCardIndex = 0;
    if (blurAmount || dimAmount) {
      for (let j = 0; j < cards.length; j++) {
        if (scrollTop >= offsets[j] - stackPositionPx - itemStackDistance * j) topCardIndex = j;
      }
    }

    cards.forEach((card, i) => {
      if (!card) return;

      const cardTop = offsets[i];
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;
      const depth = Math.max(0, topCardIndex - i);
      const blur = blurAmount ? depth * blurAmount : 0;
      /* Capped, or the bottom of a long stack goes flat black. */
      const dim = dimAmount ? Math.min(depth * dimAmount, 0.7) : 0;

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
        dim: Math.round(dim * 100) / 100,
      };

      const last = lastTransformsRef.current.get(i);
      const hasChanged =
        !last ||
        Math.abs(last.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(last.scale - newTransform.scale) > 0.001 ||
        Math.abs(last.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(last.blur - newTransform.blur) > 0.1 ||
        Math.abs(last.dim - newTransform.dim) > 0.01;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';
        /* The veil itself is a solid fill in CSS; only its opacity moves here. */
        card.style.setProperty('--stack-dim', newTransform.dim);
        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cards.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    dimAmount,
    onStackComplete,
  ]);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    /* Nothing to pin for anyone who has asked the OS for less motion: the cards
       stay in normal flow and simply scroll past. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(inner.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      /* Promising `filter` when nothing blurs it costs layer memory for nothing. */
      card.style.willChange = blurAmount ? 'transform, filter' : 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
    });

    measure();
    updateCardTransforms();

    /* Images finishing late, a font swap or a viewport change all move the cards
       under us; the observer covers the first two, resize the third. */
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(inner);
    window.addEventListener('resize', measure);

    const raf = () => {
      updateCardTransforms();
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      /* Nothing is pinned any more, so hand the end padding back to the sheet. */
      inner.style.paddingBottom = '';
      cards.forEach(card => {
        card.style.transform = '';
        card.style.filter = '';
        card.style.removeProperty('--stack-dim');
        card.style.willChange = '';
        card.style.marginBottom = '';
      });
      cardsRef.current = [];
      cardOffsetsRef.current = [];
      transformsCache.clear();
      lastScrollRef.current = null;
      stackCompletedRef.current = false;
    };
  }, [itemDistance, blurAmount, measure, updateCardTransforms]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner" ref={innerRef}>
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
