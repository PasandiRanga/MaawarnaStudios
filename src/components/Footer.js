'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/assets/Logo.png';

const BLUE       = '#3b82f6';
const BLUE_LIGHT = '#60a5fa';

export const Footer = () => {
  const year = new Date().getFullYear();

  const links = ['Home', 'About', 'Portfolio', 'Services', 'Clients', 'Contact'];
  const services = [
    'Cinematic Videography',
    'Commercial Photography',
    'Brand Campaigns',
    'Creative Direction',
    'Product Marketing',
    'Post Production',
  ];
  const socials = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Facebook,  label: 'Facebook',  href: '#' },
    { icon: Youtube,   label: 'YouTube',   href: '#' },
    { icon: Linkedin,  label: 'LinkedIn',  href: '#' },
  ];

  return (
    <footer
      className="border-t"
      style={{
        background: 'hsl(220 30% 3%)',
        borderColor: 'rgba(59,130,246,0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-75 transition-opacity duration-300">
              <img
                src={Logo.src || Logo}
                alt="Maawarna Studios"
                className="h-20 w-20"
                style={{ filter: 'brightness(0) invert(1)' }}
                data-testid="footer-logo"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(235,242,255,0.4)' }}>
              Crafting visual stories that build powerful brands through cinematic videography
              and commercial photography.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  data-testid={`footer-social-${label.toLowerCase()}`}
                  className="w-9 h-9 flex items-center justify-center border transition-all duration-300"
                  style={{ borderColor: 'rgba(59,130,246,0.15)', color: 'rgba(235,242,255,0.35)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = BLUE;
                    e.currentTarget.style.color = BLUE;
                    e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.15)';
                    e.currentTarget.style.color = 'rgba(235,242,255,0.35)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: BLUE }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {links.map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    data-testid={`footer-link-${item.toLowerCase()}`}
                    className="text-sm transition-colors duration-300"
                    style={{ color: 'rgba(235,242,255,0.4)' }}
                    onMouseEnter={e => e.currentTarget.style.color = BLUE_LIGHT}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(235,242,255,0.4)'}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: BLUE }}>
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((item) => (
                <li key={item}>
                  <span className="text-sm" style={{ color: 'rgba(235,242,255,0.35)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: BLUE }}>
              Contact
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:manuchandrasekare@gmail.com"
                data-testid="footer-email"
                className="flex items-start gap-3 text-sm group"
                style={{ color: 'rgba(235,242,255,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = BLUE_LIGHT}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(235,242,255,0.4)'}
              >
                <Mail size={14} className="mt-0.5 shrink-0" style={{ color: BLUE, opacity: 0.6 }} />
                manuchandrasekare@gmail.com
              </a>
              <a
                href="tel:+94701722051"
                data-testid="footer-phone"
                className="flex items-center gap-3 text-sm"
                style={{ color: 'rgba(235,242,255,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = BLUE_LIGHT}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(235,242,255,0.4)'}
              >
                <Phone size={14} className="shrink-0" style={{ color: BLUE, opacity: 0.6 }} />
                +94 70 172 2051
              </a>
              <div className="flex items-start gap-3 text-sm" style={{ color: 'rgba(235,242,255,0.35)' }}>
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: BLUE, opacity: 0.6 }} />
                36, Galhena Road, Nugegoda, Sri Lanka
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: 'rgba(59,130,246,0.08)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'rgba(235,242,255,0.25)' }}>
            © {year} Maawarna Studios. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs transition-colors duration-300"
                style={{ color: 'rgba(235,242,255,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.color = BLUE_LIGHT}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(235,242,255,0.25)'}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
