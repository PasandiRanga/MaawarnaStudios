'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Logo from '@/assets/Logo.png';

const BLUE = '#3b82f6';

const navLinks = [
  { name: 'Home',      path: '/' },
  { name: 'About Us',     path: '/about' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Packages',  path: '/packages' },
  /* Clients page is still being built out — restore this when it ships. */
  // { name: 'Clients',   path: '/clients' },
  { name: 'Contact',   path: '/contact' },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'backdrop-blur-2xl border-b' : 'bg-transparent'
      )}
      style={isScrolled ? {
        background: 'rgba(5, 8, 20, 0.88)',
        borderColor: 'rgba(59,130,246,0.12)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-18">

          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link
              href="/"
              data-testid="nav-logo"
              className="flex items-center hover:opacity-75 transition-opacity duration-300"
            >
              <img
                src={Logo.src || Logo}
                alt="Maawarna Studios"
                className="h-22.5 w-22.5 brightness-0 invert"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center justify-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className="relative text-[11px] font-semibold tracking-[0.22em] uppercase transition-colors duration-300 py-1 nav-underline"
                  style={{ color: active ? BLUE : 'rgba(235,242,255,0.5)' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(235,242,255,0.9)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(235,242,255,0.5)'; }}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ background: BLUE }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          {/* <Link
            href="/contact"
            data-testid="nav-cta-button"
            className="hidden md:inline-block px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300"
            style={{ border: `1px solid rgba(59,130,246,0.4)`, color: BLUE }}
            onMouseEnter={e => {
              e.currentTarget.style.background = BLUE;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = BLUE;
            }}
          >
            Work With Us
          </Link> */}

          {/* Mobile toggle */}
          <div className="flex-1 flex items-center justify-end">
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 transition-colors duration-300"
              style={{ color: 'rgba(235,242,255,0.7)' }}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t"
            data-testid="mobile-menu"
            style={{
              background: 'rgba(5,8,20,0.97)',
              backdropFilter: 'blur(24px)',
              borderColor: 'rgba(59,130,246,0.12)',
            }}
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const active = pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.path}
                      data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-between py-3 border-b text-sm font-semibold tracking-[0.18em] uppercase"
                      style={{
                        color: active ? BLUE : 'rgba(235,242,255,0.55)',
                        borderColor: 'rgba(59,130,246,0.08)',
                      }}
                    >
                      {link.name}
                      {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />}
                    </Link>
                  </motion.div>
                );
              })}
              {/* <Link
                href="/contact"
                data-testid="mobile-cta-button"
                onClick={() => setIsMobileOpen(false)}
                className="mt-5 text-center py-3.5 text-sm font-bold uppercase tracking-[0.18em]"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  color: '#fff',
                }}
              >
                Work With Us
              </Link> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
