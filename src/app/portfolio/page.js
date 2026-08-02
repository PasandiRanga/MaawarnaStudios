'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';

const BLUE       = '#3b82f6';
const BLUE_LIGHT = '#60a5fa';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const categories = [
  { id: 'all',         label: 'All Projects' },
  { id: 'photography', label: 'Photography' },
  { id: 'videography', label: 'Videography' },
  { id: 'commercial',  label: 'Commercial' },
  { id: 'events',      label: 'Events' },
];

const projects = [
  {
    id: 1, category: 'photography', client: 'Vogue Magazine',
    title: 'Haute Couture Editorial',
    desc: 'High-fashion editorial showcasing luxury brand collections with dramatic lighting and cinematic composition.',
    role: 'Photography & Creative Direction',
    image: 'https://images.unsplash.com/photo-1768610284869-83f8c777daf0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwZWRpdG9yaWFsJTIwZHJhbWF0aWMlMjBsaWdodGluZ3xlbnwwfHx8fDE3NzE0ODkyNTZ8MA&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 2, category: 'videography', client: 'Tech Innovators Inc.',
    title: 'Corporate Brand Film',
    desc: 'Cinematic brand film highlighting company culture, innovation, and vision for the future.',
    role: 'Videography & Post-Production',
    image: 'https://images.unsplash.com/photo-1705107958696-a7f73c749ab3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbiUyMHN0dWRpbyUyMGJlaGluZCUyMHRoZSUyMHNjZW5lcyUyMGNhbWVyYSUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3MTQ4OTI1NXww&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 3, category: 'commercial', client: 'Dior',
    title: 'Luxury Perfume Campaign',
    desc: 'Premium product photography for a luxury fragrance line with a minimalist aesthetic.',
    role: 'Product Photography',
    image: 'https://images.unsplash.com/photo-1760860992203-85ca32536788?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5JTIwbHV4dXJ5JTIwYnJhbmQlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcxNDg5MjU4fDA&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 4, category: 'events', client: 'International Business Forum',
    title: 'Global Summit 2024',
    desc: 'Complete event coverage including keynote sessions, networking, and behind-the-scenes moments.',
    role: 'Event Photography & Videography',
    image: 'https://images.pexels.com/photos/6950141/pexels-photo-6950141.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: 5, category: 'commercial', client: 'Luxury Cosmetics Brand',
    title: 'Minimalist Beauty Campaign',
    desc: 'Clean, minimalist product photography highlighting premium beauty products.',
    role: 'Product Photography & Art Direction',
    image: 'https://images.pexels.com/photos/29899576/pexels-photo-29899576.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: 6, category: 'photography', client: 'Alternative Fashion Magazine',
    title: 'Gothic Fashion Series',
    desc: 'Dark, moody editorial photography exploring gothic fashion aesthetics.',
    role: 'Editorial Photography',
    image: 'https://images.pexels.com/photos/32111884/pexels-photo-32111884.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
];

export default function PortfolioPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">

      {/* ── Hero ── */}
      <section className="py-24 md:py-28" data-testid="portfolio-hero-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Our Work
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
              data-testid="portfolio-title"
            >
              Portfolio
            </h1>
            <p className="text-lg md:text-xl text-foreground/45 font-light leading-relaxed max-w-2xl">
              Explore our collection of cinematic productions, stunning photography, and creative
              campaigns that help brands tell their most compelling stories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section
        className="py-5 border-y sticky top-18 z-40 backdrop-blur-2xl"
        style={{ borderColor: 'rgba(59,130,246,0.1)', background: 'rgba(5,8,20,0.92)' }}
        data-testid="category-filter"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  data-testid={`filter-${cat.id}`}
                  className="px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300"
                  style={active ? {
                    background: BLUE,
                    color: '#fff',
                  } : {
                    border: '1px solid rgba(59,130,246,0.2)',
                    color: 'rgba(235,242,255,0.45)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                      e.currentTarget.style.color = BLUE_LIGHT;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)';
                      e.currentTarget.style.color = 'rgba(235,242,255,0.45)';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section className="py-20 md:py-28" data-testid="projects-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="group relative aspect-4/5 overflow-hidden cursor-pointer"
                  data-testid={`project-${project.id}`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'rgba(59,130,246,0.05)' }}
                  />

                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: BLUE }}
                  />

                  <div className="absolute inset-0 flex flex-col justify-end p-7">
                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span
                        className="text-[10px] tracking-[0.22em] uppercase font-semibold mb-2 block"
                        style={{ color: BLUE_LIGHT }}
                      >
                        {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold mb-1.5">{project.title}</h3>
                      <p className="text-sm text-foreground/50 mb-3">{project.client}</p>

                      <div className="max-h-0 group-hover:max-h-28 overflow-hidden transition-all duration-500">
                        <p className="text-sm text-foreground/50 leading-relaxed mb-2">{project.desc}</p>
                        <p className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: BLUE, opacity: 0.7 }}>
                          {project.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {project.category === 'videography' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div
                        className="w-16 h-16 flex items-center justify-center rounded-full backdrop-blur-sm"
                        style={{ border: `1px solid rgba(59,130,246,0.4)`, background: 'rgba(59,130,246,0.1)' }}
                      >
                        <Play size={22} style={{ color: BLUE_LIGHT }} fill={BLUE_LIGHT} />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-lg text-foreground/35">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 md:py-32 border-t"
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
              Let's create something extraordinary together.
            </p>
            <Link
              href="/contact"
              data-testid="portfolio-cta-button"
              className="inline-flex items-center gap-2 px-10 py-4 font-bold text-sm uppercase tracking-[0.16em] group"
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                color: '#fff',
              }}
            >
              Start Your Project
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
