'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Video, Camera, Palette, ArrowRight } from 'lucide-react';
// import StudioHero from '@/components/StudioHero';  // 3D camera + studio lighting hero — disabled
import VideoHero from '@/components/VideoHero';
import FeaturedVideo from '@/components/FeaturedVideo';
import FeaturedSlideshow from '@/components/FeaturedSlideshow';
import { clients } from '@/data/clients';
import Logo from '@/assets/Logo.png';
import ProductShot from '@/assets/Featured/SunCrush.jpeg';
import EventShot from '@/assets/Featured/SusaraSoba.jpeg';
import VioraCollection from '@/assets/Featured/viora collection 3.png';
import YooBobaLogo from '@/assets/Featured/Yoo Boba Logo W.png';

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

/* One vertical rhythm for the whole page — every section breathes the same.
   Kept as a literal so Tailwind still sees the class names when it scans. */
const SECTION_PAD = 'py-10 md:py-14';

/* `portfolioCategory` must match a filter id on the portfolio page, and
   `portfolioType` a photography sub-filter id — each tile deep-links into that
   page with its section already selected. */
const featuredWorks = [
  {
    id: 1,
    title: 'Promotional Reels',
    category: 'Promotional Reels',
    portfolioCategory: 'videography',
    portfolioType: 'promotional-reels',
    client: 'AliiKai',
    /* Videos must be served from /public — `src/assets` is only reachable
       through a bundler import, and mp4 has no import loader. */
    video: '/videos/AliKai.mp4',
    image: 'https://images.unsplash.com/photo-1705107958696-a7f73c749ab3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbiUyMHN0dWRpbyUyMGJlaGluZCUyMHRoZSUyMHNjZW5lcyUyMGNhbWVyYSUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3MTQ4OTI1NXww&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 2,
    title: 'Event Coverage',
    category: 'Event Coverage',
    portfolioCategory: 'photography',
    portfolioType: 'event',
    client: 'Susara Soba',
    image: EventShot.src,
  },
  {
    id: 3,
    title: 'Product Photography',
    category: 'Product Photography',
    portfolioCategory: 'photography',
    portfolioType: 'product',
    client: 'Dior',
    image: ProductShot.src,
  },
  {
    id: 4,
    title: 'Graphic Designs',
    category: 'Graphic Designs',
    portfolioCategory: 'graphic-designs',
    client: 'Viora Fashion',
    /* Two client pieces share this tile — the artwork fills the frame, the
       logo is a transparent lockup that has to sit inside it. */
    slides: [
      { src: VioraCollection.src, alt: 'Viora Fashion collection artwork', fit: 'cover' },
      { src: YooBobaLogo.src, alt: 'Yoo Boba logo', fit: 'contain' },
    ],
  },
];

const services = [
  {
    icon: Video,
    title: 'Cinematic Videography',
    desc: "Brand films, product reels, and commercial campaigns crafted with a film-maker's eye and cutting-edge equipment.",
    tag: 'Most Popular',
  },
  {
    icon: Camera,
    title: 'Commercial Photography',
    desc: 'Studio and on-location photography for products, editorial, fashion, and corporate needs.',
    tag: null,
  },
  {
    icon: Palette,
    title: 'Creative Direction',
    desc: 'End-to-end creative strategy, concept, art direction, post-production, and delivery.',
    tag: null,
  },
];

/* Client roster lives in one place — the clients page renders the same logos. */


export default function HomePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ── */}
      {/* <StudioHero />  ← 3D camera rig + studio lights, kept for reference */}
      <VideoHero />

      {/* ── About Snapshot ── */}
      <section className={SECTION_PAD}>
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px" style={{ background: BLUE }} />
                <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                  Who We Are
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-none mb-6">
                Visual Storytellers<br />
                <span style={{
                  background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Brand Builders.
                </span>
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-foreground/55 mb-5">
                Maawarna Studios is a premium creative production studio specializing in cinematic videography
                and commercial photography. We transform brands through powerful visual narratives that
                captivate, inspire, and convert.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-foreground/55 mb-8">
                From product marketing reels to full-scale brand films, every frame is crafted
                with intention and technical excellence.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] transition-colors duration-300 group"
                style={{ color: BLUE_LIGHT }}
              >
                Our Story
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative aspect-4/5 overflow-hidden flex items-center justify-center"
            >
              <img
                src={Logo.src || Logo}
                alt="Maawarna Studios"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 w-16 h-16 pointer-events-none"
                style={{ border: `1.5px solid ${BLUE}`, opacity: 0.4 }} />
              <div className="absolute bottom-4 right-4 w-16 h-16 pointer-events-none"
                style={{ border: `1.5px solid ${BLUE}`, opacity: 0.4 }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Works ── */}
      <section className={SECTION_PAD} style={{ background: 'hsl(220 25% 6%)' }}>
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: BLUE }} />
                <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                  Portfolio
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Featured Work</h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] transition-colors duration-300 shrink-0 group"
              style={{ color: 'rgba(235,242,255,0.5)' }}
              onMouseEnter={e => e.currentTarget.style.color = BLUE_LIGHT}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(235,242,255,0.5)'}
            >
              View All Projects
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredWorks.map((work, i) => (
              <motion.div
                key={work.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="group relative aspect-3/4 overflow-hidden cursor-pointer"
              >
                {work.video ? (
                  <FeaturedVideo
                    src={work.video}
                    title={work.title}
                    className="transition-transform duration-700 group-hover:scale-106"
                  />
                ) : work.slides ? (
                  <FeaturedSlideshow
                    slides={work.slides}
                    title={work.title}
                    className="transition-transform duration-700 group-hover:scale-106"
                  />
                ) : (
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: BLUE }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-lg font-bold leading-tight">{work.title}</h3>
                </div>
                <Link
                  href={`/portfolio?category=${work.portfolioCategory}${work.portfolioType ? `&type=${work.portfolioType}` : ''}`}
                  aria-label={`View ${work.title} on the portfolio page`}
                  className="absolute inset-0 z-10"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className={SECTION_PAD}>
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                What We Do
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Services</h2>
            <p className="text-lg text-foreground/50 max-w-xl mx-auto font-light">
              Comprehensive creative production tailored to elevate your brand presence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="relative group p-8 border transition-all duration-500 cursor-default"
                  style={{ borderColor: 'hsl(220 25% 14%)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(220 25% 14%)'}
                >
                  {svc.tag && (
                    <div
                      className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1"
                      style={{ background: BLUE, color: '#fff' }}
                    >
                      {svc.tag}
                    </div>
                  )}
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-6"
                    style={{ border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    <Icon size={22} style={{ color: BLUE }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{svc.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/50">{svc.desc}</p>
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: BLUE }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Clients Marquee ── */}
      <section className={`${SECTION_PAD} overflow-hidden border-y`} style={{ borderColor: 'hsl(220 25% 10%)' }}>
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24 mb-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Trusted By
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Clients</h2>
          </motion.div>
        </div>

        {/* The rail is masked at both ends so logos arrive and leave on a fade
            rather than clipping against the section edge. */}
        <div
          className="overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          {/* The list is rendered twice — the keyframe scrolls exactly one copy
              width, so the seam lands back on an identical frame. */}
          <div className="marquee-track flex gap-10 md:gap-16 items-center" style={{ width: 'max-content' }}>
            {[...clients, ...clients].map((client, i) => (
              /* Fixed box, no tile behind it — the box only keeps the rhythm
                 even between a wide lockup and a square mark. The logo is sized
                 by `scale` rather than filling the box, so all read equally. */
              <div
                key={i}
                className="shrink-0 h-16 w-32 md:h-20 md:w-40 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className={`w-auto max-w-full object-contain ${client.block ? 'rounded-[16%]' : ''}`}
                  style={{ height: `${client.scale * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={SECTION_PAD}>
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
                Let's Work Together
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
              Ready to Create Something{' '}
              <span style={{
                background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Extraordinary?
              </span>
            </h2>
            <p className="text-lg text-foreground/45 font-light mb-10 max-w-lg mx-auto">
              Let's collaborate to bring your brand vision to life through cinematic storytelling.
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-5 font-bold uppercase tracking-[0.16em] text-sm transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                color: '#fff',
              }}
            >
              <span className="flex items-center gap-2">
                Work With Us
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
