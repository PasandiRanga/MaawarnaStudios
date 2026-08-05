'use client';

/*
 * One frame, front and centre — the level below the accordion.
 *
 * The accordion shows a set; this shows a photograph. It lifts the frame out to
 * the middle of the screen over a blurred wash of whatever it was lifted from,
 * and hands over the two things you actually want once a picture has your full
 * attention: closer, and further back. The zooming itself is ZoomableImage's —
 * what's here is the wash, the caption and the way out.
 *
 * Escape belongs to whoever opened this — closing the zoom should put you back
 * on the set, not out of it altogether, and only the parent knows that.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ZoomableImage from './ZoomableImage';

export default function PhotoZoom({ photo, caption, onClose, testId }) {
  const rootRef = useRef(null);

  /* Take focus off whatever opened this and give it back on the way out. While
     the frame is up it's the only thing on screen, so the arrow keys shouldn't
     still be walking the set behind it. */
  useEffect(() => {
    const opener = document.activeElement;
    rootRef.current?.focus();
    return () => { if (opener instanceof HTMLElement) opener.focus(); };
  }, []);

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

      {caption && (
        <div className="absolute top-6 left-0 right-0 px-16 text-center pointer-events-none">
          {caption}
        </div>
      )}

      {/* The room the photograph and its controls share, sized off the overlay's
          edges rather than by padding around its contents. What's left is the
          gap between the caption and the bottom of the screen. */}
      <div className="absolute inset-x-4 top-16 bottom-6 md:inset-x-16 md:top-20">
        <ZoomableImage
          image={photo.image}
          alt={photo.alt}
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
}
