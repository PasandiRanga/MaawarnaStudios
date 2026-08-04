'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Aperture, Clapperboard, Layers, Zap } from 'lucide-react';

const BLUE       = '#3b82f6';
const BLUE_LIGHT = '#60a5fa';

const SECTION_PAD = 'py-10 md:py-14';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const values = [
  {
    icon: Clapperboard,
    title: 'Cinematic Excellence',
    desc: "We approach every project with a film-maker's eye, creating visuals that captivate and leave a lasting impression.",
  },
  {
    icon: Layers,
    title: 'Brand-Driven Creativity',
    desc: 'Our creative process starts with understanding your brand DNA and translating it into compelling visual stories.',
  },
  {
    icon: Aperture,
    title: 'Premium Quality',
    desc: 'From concept to delivery, we maintain the highest standards ensuring world-class, frame-perfect results.',
  },
  {
    icon: Zap,
    title: 'Client Partnership',
    desc: 'We believe in collaborative relationships, working closely with you to exceed expectations at every step.',
  },
];

const differentiators = [
  {
    title: 'Film-Grade Production',
    desc: 'Cinema-grade equipment and techniques from the world of feature films — not standard commercial setups.',
  },
  {
    title: 'Strategic Creative',
    desc: 'Every visual decision is backed by brand strategy and audience insights, not aesthetics alone.',
  },
  {
    title: 'End-to-End Service',
    desc: 'From concept development to final delivery — every aspect of production handled in-house.',
  },
  {
    title: 'Customized brand support',
    desc: 'We will assist each brand to step up with their own crafted creatives to compete with generic content in the market',
  },
];

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">

      {/* ── Hero + Intro Video ── */}
      <section className={SECTION_PAD} data-testid="about-hero-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.4 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px" style={{ background: BLUE }} />
                <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                  About Us
                </span>
              </div>
              <h1
                className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.9] mb-8"
                data-testid="about-title"
              >
                We Are{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Visual
                </span>
                <br />Storytellers.
              </h1>
              <p className="text-lg md:text-xl text-foreground/50 font-light leading-relaxed max-w-2xl">
                Maawarna Studios was founded on a simple belief, great stories have the power to
                transform brands. We combine cinematic artistry with strategic thinking to create
                content that doesn't just look beautiful, it drives results.
              </p>
            </motion.div>

            <div className="relative w-full" data-testid="about-video-section">
              <video
                className="w-full h-auto block"
                style={{ mixBlendMode: 'screen' }}
                src="/videos/logovid_2.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              {/* edge fades blending video into page background */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className={SECTION_PAD} style={{ background: 'hsl(220 25% 6%)' }} data-testid="story-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Our Story
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Passion Meets<br />Precision.
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/50 mb-5">
              Founded by Mr.Janidu Chandrasekara, a creative director and enthusiast in cinematography with a background in cinematography and business entrepreneurship to help brands to emerge. 
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/50 mb-5">
              Our work spans product marketing videos, brand reels, presenter videos, event
              coverage, and commercial campaigns, always with the same obsession, frames that
              matter.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground/50 mb-8">
              From small startups to established brands, we approach every project with the
              same level of dedication and artistic excellence.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] group"
              style={{ color: BLUE_LIGHT }}
            >
              Start a Project
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className={SECTION_PAD} data-testid="mission-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Our Mission
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
              Crafting Visual Excellence
            </h2>
            <p className="text-xl text-foreground/45 font-light leading-relaxed">
              To empower brands with cinematic storytelling that transcends traditional advertising,
              creating emotional connections that drive meaningful engagement and lasting impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={SECTION_PAD} style={{ background: 'hsl(220 25% 6%)' }} data-testid="values-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                What Drives Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="group p-8 border transition-all duration-500 cursor-default"
                  style={{ borderColor: 'hsl(220 25% 14%)' }}
                  data-testid={`value-card-${i}`}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(220 25% 14%)'}
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-5"
                    style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                    <Icon size={18} style={{ color: BLUE }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/50">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className={SECTION_PAD} data-testid="differentiators-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px" style={{ background: BLUE }} />
                <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
                What Makes<br />Maawarna Studios Perfect.
              </h2>
              <div className="space-y-7">
                {differentiators.map((d, i) => (
                  <motion.div
                    key={d.title}
                    variants={fadeUp}
                    custom={i * 0.5}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-0.5 shrink-0 mt-1" style={{ background: BLUE, opacity: 0.5 }} />
                    <div>
                      <h3 className="font-bold mb-1.5">{d.title}</h3>
                      <p className="text-sm leading-relaxed text-foreground/45">{d.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative aspect-4/5 overflow-hidden"
            >
              <img
                src="https://images.pexels.com/photos/8089657/pexels-photo-8089657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Behind the scenes production"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 w-14 h-14 pointer-events-none"
                style={{ border: `1px solid rgba(59,130,246,0.45)` }} />
              <div className="absolute bottom-4 right-4 w-14 h-14 pointer-events-none"
                style={{ border: `1px solid rgba(59,130,246,0.45)` }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={SECTION_PAD} style={{ background: 'hsl(220 25% 6%)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to{' '}
              <span style={{
                background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Collaborate?
              </span>
            </h2>
            <p className="text-lg text-foreground/45 font-light mb-10 max-w-lg mx-auto">
              Let's bring your brand vision to life with cinematic storytelling.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 font-bold text-sm uppercase tracking-[0.16em] transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                color: '#fff',
              }}
            >
              Get in Touch
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
