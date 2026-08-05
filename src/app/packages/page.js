'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import BorderGlow from '@/components/BorderGlow';
import AnimatedButton from '@/components/AnimatedButton';
import FoldHeading from '@/components/FoldHeading';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const BLUE       = '#3b82f6';
const BLUE_LIGHT = '#60a5fa';

/* Same palette the portfolio tiles glow with, so the pricing cards read as part
   of the same set. The background has to match the section behind them — the
   mesh border paints against it. */
const GLOW = {
  glowColor: '217 91 60',
  colors: ['#93c5fd', '#3b82f6', '#60a5fa'],
  backgroundColor: 'hsl(220 25% 6%)',
};

const packages = [
  {
    name: 'Starter Presence',
    tagline: 'Perfect for small businesses starting social media marketing',
    price: 'Rs. 20,000',
    period: '/ month',
    features: [
      '4 Promo Reels (30–45 sec)',
      '1 Shooting Session (3-4 hrs)',
      'Basic editing + colour grading',
      'Trend-based cuts & captions',
      'Background music',
      'Vertical format (IG / TikTok ready)',
    ],
    highlight: false,
  },
  {
    name: 'Growth',
    tagline: 'For businesses wanting consistent engagement',
    price: 'Rs. 35,000',
    period: '/ month',
    badge: 'Most Popular',
    features: [
      '5 Promo Reels',
      '2 Presenter Videos (talking head or staff intro)',
      '1 Half-day Shoot (5-6 hrs)',
      'Creative direction guidance',
      'Motion text & branding elements',
      'Thumbnail covers for reels',
    ],
    highlight: true,
  },
];

const addOns = [
  { name: 'Extra Reel',         price: 'Rs. 6,000'  },
  { name: 'Presenter Video',    price: 'Rs. 8,000'  },
  { name: 'Script Writing',     price: 'Rs. 5,000'  },
  { name: 'Drone Shots',        price: 'Rs. 10,000' },
  { name: 'Voice Over',         price: 'Rs. 7,000'  },
  { name: 'Same-Day Delivery',  price: 'Rs. 5,000'  },
  { name: 'Product Photoshoot', price: 'Rs. 8,000'  },
];

export default function PackagesPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      {/* ── Hero ── */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Pricing
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <FoldHeading as="h1" className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              Packages &{' '}
              <span style={{
                background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Pricing
              </span>
            </FoldHeading>
            <p className="text-lg md:text-xl font-light text-foreground/50 max-w-2xl mx-auto">
              Transparent, flexible pricing to fit every stage of your brand journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="py-24 md:py-32" style={{ background: 'hsl(220 25% 6%)' }}>
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-12">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="h-full"
              >
                <BorderGlow
                  {...GLOW}
                  className={`h-full transition-transform duration-500 ease-out hover:-translate-y-2 ${
                    pkg.highlight ? 'border-[rgba(59,130,246,0.45)]!' : ''
                  }`}
                  edgeSensitivity={15}
                  borderRadius={22}
                  glowRadius={40}
                  glowIntensity={1.3}
                  coneSpread={25}
                >
                  {/* Rounded and clipped so the corner badge follows the card's
                      radius instead of poking past the glow ring. */}
                  <div
                    className="relative flex flex-col h-full p-8 md:p-10 rounded-[21px] overflow-hidden"
                    style={{ background: pkg.highlight ? 'rgba(59,130,246,0.04)' : 'transparent' }}
                  >
                    {pkg.badge && (
                      <div
                        className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg"
                        style={{ background: BLUE, color: '#fff' }}
                      >
                        {pkg.badge}
                      </div>
                    )}
                    <div className="mb-7">
                      <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                      <p className="text-xs text-foreground/40 uppercase tracking-wider mb-5">{pkg.tagline}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{pkg.price}</span>
                        <span className="text-foreground/40 text-sm">{pkg.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 grow">
                      {pkg.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          <CheckCircle2 size={16} style={{ color: BLUE, opacity: 0.8 }} className="shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground/60">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <AnimatedButton href="/contact" className="mt-8 w-full">
                      Get Started
                    </AnimatedButton>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>

          {/* ── Add-Ons ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-center text-xl font-bold mb-6 text-foreground/70">Available Add-Ons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map((addon) => (
                <BorderGlow
                  key={addon.name}
                  {...GLOW}
                  className="h-full transition-transform duration-500 ease-out hover:-translate-y-1"
                  edgeSensitivity={15}
                  borderRadius={14}
                  glowRadius={30}
                  glowIntensity={1.3}
                  coneSpread={25}
                >
                  <div className="flex justify-between items-center gap-4 h-full px-5 py-4">
                    <span className="text-sm text-foreground/65">{addon.name}</span>
                    <span className="text-sm font-semibold" style={{ color: BLUE_LIGHT }}>{addon.price}</span>
                  </div>
                </BorderGlow>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 md:py-40">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Let&apos;s Work Together
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <FoldHeading className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] mb-6">
              Not Sure Which Package{' '}
              <span style={{
                background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Fits?
              </span>
            </FoldHeading>
            <p className="text-lg text-foreground/45 font-light mb-10 max-w-lg mx-auto">
              Reach out and we&apos;ll help you find the right solution for your brand and budget.
            </p>
            <AnimatedButton href="/contact">Get in Touch</AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
