'use client';

import Link from 'next/link';
import './AnimatedButton.css';

/* One arrow leaves right, its twin arrives from the left — they're two elements
   rather than one that wraps around, so both are always drawn. */
const ARROW_PATH =
  'M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z';

function Arrow({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={ARROW_PATH} />
    </svg>
  );
}

/* Renders a Link when `href` is given, a plain <button> otherwise — same shape
   as GradientButton, so the two CTAs are used the same way. */
export default function AnimatedButton({ href, children, className = '', ...props }) {
  const classes = `animated-button ${className}`.trim();

  const inner = (
    <>
      <Arrow className="arr-2" />
      <span className="text">{children}</span>
      <span className="circle" />
      <Arrow className="arr-1" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {inner}
    </button>
  );
}
