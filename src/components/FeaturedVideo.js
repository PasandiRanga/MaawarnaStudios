'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/*
 * A featured-work tile backed by a video instead of a still.
 *
 * Autoplay only survives if the clip starts muted, so sound is opt-in behind a
 * small toggle. Two rules keep that from being obnoxious:
 *
 *   - Leaving the viewport pauses AND re-mutes, so a card the visitor scrolled
 *     past can never keep talking off-screen. Re-entering resumes silently.
 *   - The toggle is the only thing on the tile that swallows clicks, so the
 *     surrounding card stays free to become a link later.
 */
export default function FeaturedVideo({ src, poster, title, className = '' }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = useCallback(e => {
    /* The tile itself is clickable; unmuting shouldn't also trigger it. */
    e.stopPropagation();
    e.preventDefault();

    const v = videoRef.current;
    if (!v) return;

    const next = !v.muted;
    v.muted = next;
    setMuted(next);

    /* Unmuting is a user gesture — a good moment to recover a refused autoplay. */
    if (!next) v.play().catch(() => {});
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
          /* Silence it on the way out so scrolling back doesn't blast audio. */
          v.muted = true;
          setMuted(true);
        }
      },
      { threshold: 0.25 },
    );

    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${className}`}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-label={title}
      />

      {/* Sound toggle — above the card's gradient overlay and hover transforms */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? `Unmute ${title}` : `Mute ${title}`}
        aria-pressed={!muted}
        className="absolute top-3 right-3 z-20 grid place-items-center w-9 h-9 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
        style={{
          /* Glass, not a chip: the footage reads through it. A hint of white
             rather than a dark fill keeps it legible over bright frames too,
             where a near-black disc would sit on the shot like a sticker. */
          background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${muted ? 'rgba(255,255,255,0.28)' : 'rgba(96,165,250,0.7)'}`,
          color: muted ? 'rgba(255,255,255,0.85)' : '#93c5fd',
          /* Carries the icon over light backgrounds without adding a fill. */
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </>
  );
}
