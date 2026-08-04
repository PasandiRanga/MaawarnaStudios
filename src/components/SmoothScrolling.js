'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/* The one instance driving the whole page. Components that need to pause the
   page (a full-screen viewer) or read its scroll reach it through `getLenis`
   rather than standing up a second instance that would fight this one. */
let instance = null;

export const getLenis = () => instance;

export default function SmoothScrolling({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        instance = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            instance = null;
        };
    }, []);

    return children;
}
