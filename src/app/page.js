'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Video, Camera, Palette, ArrowRight } from 'lucide-react';
// import StudioHero from '@/components/StudioHero';  // 3D camera + studio lighting hero — disabled
import VideoHero from '@/components/VideoHero';
import FeaturedVideo from '@/components/FeaturedVideo';
import FeaturedSlideshow from '@/components/FeaturedSlideshow';
import BorderGlow from '@/components/BorderGlow';
import AnimatedButton from '@/components/AnimatedButton';
import FoldHeading from '@/components/FoldHeading';
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

/* Same glow the pricing cards use, so every card on the site reads as one set.
   `backgroundColor` is deliberately NOT in here: the mesh border paints against
   the card's own background, so each caller passes the colour of the section it
   sits in — the featured band is raised, the services section is not. */
const GLOW = {
  glowColor: '217 91 60',
  colors: ['#93c5fd', '#3b82f6', '#60a5fa'],
  edgeSensitivity: 15,
  borderRadius: 22,
  glowRadius: 40,
  glowIntensity: 1.3,
  coneSpread: 25,
};

/* Section backgrounds the glow cards paint against. */
const BAND_BG = 'hsl(220 25% 6%)'; /* featured work + its section */
const PAGE_BG = 'hsl(220 30% 4%)'; /* bare page, behind services */

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
              <FoldHeading className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-none mb-6">
                Visual Storytellers<br />
                <span style={{
                  background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Brand Builders.
                </span>
              </FoldHeading>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Works ── */}
      <section className={SECTION_PAD} style={{ background: BAND_BG }}>
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
              <FoldHeading className="text-4xl md:text-5xl font-bold tracking-tight">Featured Work</FoldHeading>
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
              >
                <BorderGlow
                  {...GLOW}
                  backgroundColor={BAND_BG}
                  className="group cursor-pointer"
                >
                  {/* Rounded a hair inside the ring so the artwork stops at the
                      curve and leaves the border itself visible. */}
                  <div className="relative aspect-3/4 rounded-[21px] overflow-hidden">
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
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-lg font-bold leading-tight">{work.title}</h3>
                    </div>
                    <Link
                      href={`/portfolio?category=${work.portfolioCategory}${work.portfolioType ? `&type=${work.portfolioType}` : ''}`}
                      aria-label={`View ${work.title} on the portfolio page`}
                      className="absolute inset-0 z-10"
                    />
                  </div>
                </BorderGlow>
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
            <FoldHeading className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Services</FoldHeading>
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
                  className="h-full"
                >
                  {/* Settings match the packages cards exactly — same ring, same
                      lift — so a visitor moving between the pages sees one card. */}
                  <BorderGlow
                    {...GLOW}
                    backgroundColor={PAGE_BG}
                    className="h-full cursor-default transition-transform duration-500 ease-out hover:-translate-y-2"
                  >
                    {/* Clipped to just inside the ring so the corner tag follows
                        the radius instead of poking past it. */}
                    <div className="relative flex flex-col h-full p-8 rounded-[21px] overflow-hidden">
                      {svc.tag && (
                        <div
                          className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg"
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
                    </div>
                  </BorderGlow>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Clients Marquee ── */}
      {/* Deliberately taller than SECTION_PAD — the rail is the one section that
          reads as a full band, so it gets its own breathing room. */}
      <section className="py-16 md:py-24 overflow-hidden border-y" style={{ borderColor: 'hsl(220 25% 10%)' }}>
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24 mb-12">
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
            <FoldHeading className="text-4xl md:text-5xl font-bold tracking-tight">Our Clients</FoldHeading>
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
          <div className="marquee-track flex gap-14 md:gap-20 items-center" style={{ width: 'max-content' }}>
            {[...clients, ...clients].map((client, i) => (
              /* Fixed box, no tile behind it — the box only keeps the rhythm
                 even between a wide lockup and a square mark. The logo is sized
                 by `scale` rather than filling the box, so all read equally. */
              <div
                key={i}
                className="shrink-0 h-24 w-48 md:h-32 md:w-64 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
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
                Let&apos;s Work Together
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <FoldHeading className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
              Ready to Create Something{' '}
              <span style={{
                background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Extraordinary?
              </span>
            </FoldHeading>
            <p className="text-lg text-foreground/45 font-light mb-10 max-w-lg mx-auto">
              Let&apos;s collaborate to bring your brand vision to life through cinematic storytelling.
            </p>
            <AnimatedButton href="/contact">Work With Us</AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
