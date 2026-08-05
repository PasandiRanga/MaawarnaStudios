'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight, ArrowLeft, Package, GraduationCap, CalendarDays,
  Cake, Clapperboard, Film, Mic, PenTool, Layers, Sparkles,
} from 'lucide-react';
import BorderGlow from '@/components/BorderGlow';
import AnimatedButton from '@/components/AnimatedButton';
import PhotoCollectionStack from '@/components/PhotoCollectionStack';
import VideoGrid from '@/components/VideoGrid';
import ImageGrid from '@/components/ImageGrid';
import { videoReels } from '@/data/videoReels';
import { graphicDesigns } from '@/data/graphicDesigns';
import { productPhotography } from '@/data/productPhotography';
import { graduationPhotography } from '@/data/graduationPhotography';
import { eventPhotography } from '@/data/eventPhotography';
import { birthdayShoots } from '@/data/birthdayShoots';
import ProductCover from '@/assets/Featured/SunCrush.jpeg';
import EventCover from '@/assets/Featured/SusaraSoba.jpeg';
import DesignCover from '@/assets/Portfolio/Graphic/GraphicMainTile.jpg';
import LogoCover from '@/assets/Portfolio/Graphic/LogoDesigns/eco lux nw.png';
import PackagingCover from '@/assets/Portfolio/Graphic/PackagingDesign/YoobobaChristmas.jpeg';
import PromoCover from '@/assets/Portfolio/Graphic/PromotionalMaterials/Pnutty.jpeg';
import SocialCover from '@/assets/Portfolio/Graphic/SocialMediaCreatives/WhatsApp Image 2026-08-04 at 3.22.49 AM.jpeg';
import GraduationCover from '@/assets/Portfolio/Photography/GraduationPhotography/GradSubTile.jpg';
import BirthdayCover from '@/assets/Portfolio/Photography/BirthDayShoots/BirthdaySubTile.jpg';

const BLUE       = '#3b82f6';
const BLUE_LIGHT = '#60a5fa';

/* One palette for every glow on the page, so the cards read as a set. */
const GLOW = {
  glowColor: '217 91 60',
  colors: ['#93c5fd', '#3b82f6', '#60a5fa'],
  backgroundColor: 'hsl(220 25% 6%)',
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* Sub-tiles build themselves in one after another when a category opens. */
const subGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const subTile = {
  hidden: { opacity: 0, y: 28, scale: 0.9 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: -14, scale: 0.94, transition: { duration: 0.25 } },
};

const categories = [
  {
    id: 'photography',
    label: 'Photography',
    cover: ProductCover.src,
    subs: [
      /* `collections` is what turns a sub-category from a placeholder into a
         gallery — the folders under its assets directory, already grouped. */
      { id: 'product',    label: 'Product Photography',    icon: Package,       cover: ProductCover.src,    collections: productPhotography },
      { id: 'graduation', label: 'Graduation Photography', icon: GraduationCap, cover: GraduationCover.src, collections: graduationPhotography },
      { id: 'event',      label: 'Event Photography',      icon: CalendarDays,  cover: EventCover.src,      collections: eventPhotography },
      { id: 'birthday',   label: 'Birthday Shoots',        icon: Cake,          cover: BirthdayCover.src,   collections: birthdayShoots },
    ],
  },
  {
    id: 'videography',
    label: 'Videography',
    video: '/videos/AliKai.mp4',
    subs: [
      /* `reels` is to a video sub-category what `collections` is to a photo one.
         Both come from the assets tree; the difference is that video is served
         as a plain file, so the paths are written down by
         `scripts/sync-videos.mjs` rather than discovered at build time. The tile
         plays one of the set as its artwork. */
      { id: 'promotional-reels', label: 'Promotional Reels', icon: Clapperboard, video: '/videos/portfolio/promotional-reels/aliikai-cafe-2.mp4',   reels: videoReels['promotional-reels'] },
      { id: 'event-coverage',    label: 'Event Coverage',    icon: Film,         video: '/videos/portfolio/event-coverage/food-factory-sl-01.mp4',   reels: videoReels['event-coverage'] },
      { id: 'wedding-coverage',  label: 'Wedding Coverage',  icon: Mic,          video: '/videos/portfolio/wedding-coverage/hiruni-dineth-day-2.mp4', reels: videoReels['wedding-coverage'] },
      { id: 'bts-filming',       label: 'BTS Filming',       icon: CalendarDays, video: '/videos/portfolio/bts-filming/vid1.mp4',                     reels: videoReels['bts-filming'] },
    ],
  },
  {
    id: 'graphic-designs',
    label: 'Graphic Designs',
    cover: DesignCover.src,
    subs: [
      /* `pieces` is to a graphics sub-category what `collections` and `reels`
         are to the photo and video ones — the folder under its assets directory,
         one flat feed rather than a shelf of sets. */
      { id: 'logo-designs',     label: 'Logo Designs',           icon: PenTool,  cover: LogoCover.src, fit: 'contain', pieces: graphicDesigns['logo-designs'] },
      { id: 'social-creatives', label: 'Social Media Creatives', icon: Layers,   cover: SocialCover.src, pieces: graphicDesigns['social-creatives'] },
      { id: 'promotional-materials',   label: 'Promotional Materials',   icon: Sparkles, cover: PromoCover.src, pieces: graphicDesigns['promotional-materials'] },
      { id: 'packaging',        label: 'Packaging Design',       icon: Package,  cover: PackagingCover.src, pieces: graphicDesigns['packaging'] },
    ],
  },
];

const findCategory = (id) => categories.find(c => c.id === id) ?? null;

/* Categories and sub-categories share one card, so a level down looks like a
   level up — only the label, artwork, and action text differ. */
function Tile({ label, cover, video, fit, icon: Icon, action, testId, aspect = 'aspect-4/5', onClick }) {
  return (
    <BorderGlow
      {...GLOW}
      className="h-full"
      edgeSensitivity={15}
      borderRadius={22}
      glowRadius={40}
      glowIntensity={1.3}
      coneSpread={25}
    >
      <button
        onClick={onClick}
        data-testid={testId}
        /* The 8px inset is deliberate: the mesh border ring paints at the card's
           padding box, so a truly edge-to-edge image would bury it and only the
           outer bloom would survive. */
        className="group relative h-full w-full text-left cursor-pointer p-2"
      >
        <div className={`relative w-full ${aspect} overflow-hidden rounded-2xl`}>
          {video ? (
            <video
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={label}
            />
          ) : cover ? (
            <img
              src={cover}
              alt={label}
              className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${fit === 'contain' ? 'object-contain p-8' : 'object-cover'}`}
            />
          ) : (
            <div
              className="w-full h-full grid place-items-center"
              style={{ background: 'linear-gradient(150deg, hsl(220 25% 12%), hsl(220 25% 7%))' }}
            >
              {Icon && <Icon size={34} style={{ color: BLUE, opacity: 0.4 }} />}
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3">{label}</h2>
            <span
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(235,242,255,0.55)' }}
            >
              {action}
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-500" />
            </span>
            <div
              className="h-px mt-3 w-8 group-hover:w-full transition-all duration-500"
              style={{ background: BLUE, opacity: 0.55 }}
            />
          </div>
        </div>
      </button>
    </BorderGlow>
  );
}

/* Breadcrumbs for the drill-down: All Categories › Photography › Product.
   The last crumb is where you are; every earlier one walks back a level, and the
   arrow is a shortcut to the crumb immediately behind. */
function Crumbs({ trail }) {
  const back = trail[trail.length - 2];

  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb"
      data-testid="portfolio-breadcrumb"
      className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10 text-[11px] font-bold uppercase tracking-[0.2em]"
    >
      <button
        onClick={back.onClick}
        aria-label={`Back to ${back.label}`}
        data-testid="breadcrumb-back"
        className="group p-0.5 transition-colors duration-300"
        style={{ color: 'rgba(235,242,255,0.5)' }}
        onMouseEnter={e => { e.currentTarget.style.color = BLUE_LIGHT; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(235,242,255,0.5)'; }}
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      {trail.map((crumb, i) => {
        const current = i === trail.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-3">
            {i > 0 && (
              <span className="h-3 w-px" style={{ background: 'rgba(59,130,246,0.25)' }} />
            )}
            {current ? (
              <span style={{ color: BLUE }} aria-current="page">{crumb.label}</span>
            ) : (
              <button
                onClick={crumb.onClick}
                className="transition-colors duration-300"
                style={{ color: 'rgba(235,242,255,0.5)' }}
                onMouseEnter={e => { e.currentTarget.style.color = BLUE_LIGHT; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(235,242,255,0.5)'; }}
              >
                {crumb.label}
              </button>
            )}
          </span>
        );
      })}
    </motion.nav>
  );
}

/* Sub-categories whose sets aren't online yet still open — an empty stage reads
   as broken, so say what's coming instead. */
function ComingSoon({ label }) {
  return (
    <div
      className="rounded-3xl border px-8 py-24 text-center"
      /* Same surface as a stack card, so both ways a sub-category can open look
         like the same shelf. */
      style={{
        borderColor: 'hsl(220 20% 16%)',
        background: 'linear-gradient(150deg, hsl(220 25% 12%), hsl(220 25% 7%))',
      }}
      data-testid="sub-category-empty"
    >
      <Sparkles size={26} style={{ color: BLUE, opacity: 0.5 }} className="mx-auto mb-5" />
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{label}</h3>
      <p className="text-foreground/40 font-light max-w-md mx-auto">
        This collection is being curated, get in touch and we&apos;ll walk you through the
        full set in the meantime.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 mt-8 text-[11px] font-bold uppercase tracking-[0.2em] group"
        style={{ color: BLUE }}
      >
        Talk To Us
        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  );
}

function PortfolioContent() {
  const searchParams   = useSearchParams();
  const categoryParam  = searchParams.get('category');
  const typeParam      = searchParams.get('type');
  const [openCategory, setOpenCategory] = useState(null);
  const [activeSub, setActiveSub]       = useState(null);

  /* Featured tiles on the home page link in as /portfolio?category=…&type=… —
     open that category on arrival and scroll the tiles into view. */
  useEffect(() => {
    const cat = findCategory(categoryParam);
    if (cat) {
      setOpenCategory(cat.id);
      setActiveSub(cat.subs.some(s => s.id === typeParam) ? typeParam : null);
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setOpenCategory(null);
      setActiveSub(null);
      window.scrollTo(0, 0);
    }
  }, [categoryParam, typeParam]);

  const toggleCategory = (id) => {
    setActiveSub(null);
    setOpenCategory(prev => (prev === id ? null : id));
  };

  const closeCategory = () => {
    setActiveSub(null);
    setOpenCategory(null);
  };

  const open = findCategory(openCategory);
  const sub  = open?.subs.find(s => s.id === activeSub) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">

      {/* ── Hero ── */}
      {/* Same vertical rhythm as the about page — see SECTION_PAD there. */}
      <section className="py-10 md:py-14" data-testid="portfolio-hero-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Our Work
              </span>
              <div className="w-6 h-px" style={{ background: BLUE }} />
            </div>
            <h1
              className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
              data-testid="portfolio-title"
            >
              Portfolio
            </h1>
            <p className="text-lg md:text-xl text-foreground/45 font-light leading-relaxed max-w-2xl mx-auto">
              Explore our collection of cinematic productions, stunning photography, and creative
              campaigns that help brands tell their most compelling stories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Tiles ──
          The category grid and the sub-category grid occupy the same slot: pick
          a category and the three swap out for its four, same card design. */}
      <section id="work" className="pb-4" data-testid="category-tiles">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <AnimatePresence mode="wait">
            {!open ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
              >
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    animate="show"
                    className="h-full"
                  >
                    <Tile
                      label={cat.label}
                      cover={cat.cover}
                      video={cat.video}
                      action="Explore"
                      testId={`category-tile-${cat.id}`}
                      onClick={() => toggleCategory(cat.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key={open.id} data-testid="sub-category-tiles">
                <Crumbs
                  trail={[
                    { label: 'All Categories', onClick: closeCategory },
                    { label: open.label, onClick: () => setActiveSub(null) },
                    ...(sub ? [{ label: sub.label }] : []),
                  ]}
                />

                {/* Picking a sub-category replaces the row with its work — the
                    same swap the categories make one level up. */}
                <AnimatePresence mode="wait">
                  {!sub ? (
                    <motion.div
                      key="subs"
                      variants={subGrid}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      /* All four in one line on desktop, dropping to two then one
                         as the portrait cards run out of room. */
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
                    >
                      {open.subs.map((s) => (
                        <motion.div key={s.id} variants={subTile} className="h-full">
                          <Tile
                            label={s.label}
                            cover={s.cover}
                            video={s.video}
                            fit={s.fit}
                            icon={s.icon}
                            /* Four across rather than three, so these cards are
                               narrower than the category ones and the shared 4:5
                               leaves them squat — a taller frame gives the
                               artwork back the room the extra column took. */
                            aspect="aspect-2/3"
                            action="View Work"
                            testId={`sub-tile-${s.id}`}
                            onClick={() => setActiveSub(s.id)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    /* Only opacity animates — the stack measures its own card
                       positions on mount, and a wrapper sliding in would move
                       them out from under it. */
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      data-testid={`sub-work-${sub.id}`}
                    >
                      {sub.collections?.length ? (
                        <PhotoCollectionStack
                          collections={sub.collections}
                          eyebrow={sub.label}
                          testId={`photo-stack-${sub.id}`}
                        />
                      ) : sub.reels?.length ? (
                        <VideoGrid
                          reels={sub.reels}
                          eyebrow={sub.label}
                          testId={`video-grid-${sub.id}`}
                        />
                      ) : sub.pieces?.length ? (
                        <ImageGrid
                          pieces={sub.pieces}
                          eyebrow={sub.label}
                          testId={`image-grid-${sub.id}`}
                        />
                      ) : (
                        <ComingSoon label={sub.label} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 md:py-32 border-t mt-16"
        style={{ borderColor: 'rgba(59,130,246,0.08)' }}
        data-testid="portfolio-cta-section"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Like What You{' '}
              <span style={{
                background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                See?
              </span>
            </h2>
            <p className="text-lg text-foreground/45 font-light mb-10 max-w-md mx-auto">
              Let&apos;s create something extraordinary together.
            </p>
            <AnimatedButton href="/contact" data-testid="portfolio-cta-button">
              Start Your Project
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* useSearchParams needs a Suspense boundary or the route can't be prerendered. */
export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PortfolioContent />
    </Suspense>
  );
}
