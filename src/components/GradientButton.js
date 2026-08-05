'use client';

import Link from 'next/link';
import './GradientButton.css';

/*
 * Gradient CTA. Renders a Link when `href` is given, a plain <button>
 * otherwise, so it can be used for navigation and for form actions without
 * two near-identical components. All styling lives in GradientButton.css.
 */
export default function GradientButton({ href, children, className = '', ...props }) {
  const classes = `btn-gradient ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
