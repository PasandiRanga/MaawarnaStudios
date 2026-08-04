'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * A featured-work tile that cycles through several stills instead of one.
 *
 * Mirrors FeaturedVideo's viewport rule: the rotation only runs while the tile
 * is on screen, so tiles the visitor scrolled past aren't animating in the
 * background. Slides cross-fade rather than cut — a hard swap reads as a
 * loading glitch on a page where everything else eases.
 *
 * Each slide carries its own `fit`: artwork fills the frame (`cover`), while a
 * transparent logo needs `contain` and breathing room or it gets cropped into
 * an unreadable crest.
 */
export default function FeaturedSlideshow({ slides, title, interval = 3800, className = '' }) {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || slides.length < 2) return;

    /* Respect a reduced-motion preference by holding on the first slide. */
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [active, slides.length, interval]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden"
      /* Backstop behind `contain` slides so the letterboxing reads as intent. */
      style={{ background: 'hsl(220 25% 8%)' }}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt || title}
          aria-hidden={i !== index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            slide.fit === 'contain' ? 'object-contain p-10' : 'object-cover'
          } ${className}`}
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}

      {slides.length > 1 && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {slides.map((slide, i) => (
            <span
              key={slide.src}
              className="block w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i === index ? '#60a5fa' : 'rgba(255,255,255,0.35)',
                transform: i === index ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
