'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
// Path to assets moved to src/assets
import Logo from '@/assets/Logo.png';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Clients', path: '/clients' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'backdrop-blur-xl bg-black/40 border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            data-testid="nav-logo"
            className="flex items-center hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src={Logo.src || Logo}
              alt="Maawarna Studios"
              className="h-[110px] w-[110px] brightness-0 invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
                className={cn(
                  'text-sm font-medium tracking-wider uppercase transition-colors duration-300',
                  pathname === link.path
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            data-testid="nav-cta-button"
            className="hidden md:block bg-white text-black hover:bg-gray-200 rounded-none px-6 py-3 font-bold uppercase tracking-wider transition-all duration-300 text-sm"
          >
            Work With Us
          </Link>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl bg-black/95 border-t border-white/10"
            data-testid="mobile-menu"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'text-lg font-medium tracking-wider uppercase transition-colors duration-300 py-2',
                    pathname === link.path
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/contact"
                data-testid="mobile-cta-button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-white text-black text-center hover:bg-gray-200 rounded-none px-6 py-3 font-bold uppercase tracking-wider transition-all duration-300 text-sm mt-4"
              >
                Work With Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};