'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredWorks = [
    {
      id: 1,
      title: 'High Fashion Editorial',
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1768610284869-83f8c777daf0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwZWRpdG9yaWFsJTIwZHJhbWF0aWMlMjBsaWdodGluZ3xlbnwwfHx8fDE3NzE0ODkyNTZ8MA&ixlib=rb-4.1.0&q=85',
      client: 'Vogue Magazine',
    },
    {
      id: 2,
      title: 'Cinematic Brand Film',
      category: 'Videography',
      image: 'https://images.unsplash.com/photo-1705107958696-a7f73c749ab3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbiUyMHN0dWRpbyUyMGJlaGluZCUyMHRoZSUyMHNjZW5lcyUyMGNhbWVyYSUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3MTQ4OTI1NXww&ixlib=rb-4.1.0&q=85',
      client: 'Tech Corp',
    },
    {
      id: 3,
      title: 'Luxury Product Launch',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1760860992203-85ca32536788?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5JTIwbHV4dXJ5JTIwYnJhbmQlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcxNDg5MjU4fDA&ixlib=rb-4.1.0&q=85',
      client: 'Dior',
    },
    {
      id: 4,
      title: 'Corporate Event Coverage',
      category: 'Event',
      image: 'https://images.pexels.com/photos/6950141/pexels-photo-6950141.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      client: 'Global Summit 2024',
    },
  ];

  const packages = [
    {
      name: 'Starter Presence',
      tagline: 'Small businesses starting social media marketing',
      price: 'Rs. 20,000',
      period: '/ month',
      features: [
        '4 Promo Reels (30–45 sec)',
        '1 Shooting Session (3-4 hrs)',
        'Basic editing + colour grading',
        'Trend-based cuts & captions',
        'Background music',
        'Vertical format (IG / TikTok ready)',
      ]
    },
    {
      name: 'Growth',
      tagline: 'Businesses wanting consistent engagement',
      price: 'Rs. 35,000',
      badge: 'Most Popular',
      period: '/ month',
      features: [
        '5 Promo Reels',
        '2 Presenter Videos (talking/head or staff intro)',
        '1 Half-day Shoot (5-6 hrs)',
        'Creative direction guidance',
        'Motion text & branding elements',
        'Thumbnail covers for reels',
      ]
    }
  ];

  const addOns = [
    { name: 'Extra Reel', price: 'Rs. 6,000' },
    { name: 'Presenter Video', price: 'Rs. 8,000' },
    { name: 'Script Writing', price: 'Rs. 5,000' },
    { name: 'Drone Shots', price: 'Rs. 10,000' },
    { name: 'Voice Over', price: 'Rs. 7,000' },
    { name: 'Same-Day Delivery', price: 'Rs. 5,000' },
    { name: 'Product Photoshoot', price: 'Rs. 8,000' },
  ];

  const clients = [
    'Yoo boba',
    'Pnutty',
    'Viora fashion',
    'AliiKai',
    'Samantha motor traders',
    'Eco lux villas',
    'SD fitness'
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1727451139462-cd34008cd50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwzfHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbiUyMHN0dWRpbyUyMGJlaGluZCUyMHRoZSUyMHNjZW5lcyUyMGNhbWVyYSUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3MTQ4OTI1NXww&ixlib=rb-4.1.0&q=85"
            alt="Cinematic studio background"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(5,5,5,0.8) 100%)',
            }}
          />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-4xl"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-6"
              >
                Creative Production Studio
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
                data-testid="hero-title"
              >
                We Craft Stories That Build Brands
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground mb-12 max-w-2xl"
              >
                Elevating brands through cinematic videography, stunning photography, and bold creative direction.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/portfolio"
                  data-testid="hero-cta-portfolio"
                  className="bg-white text-black hover:bg-gray-200 rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300"
                >
                  View Our Work
                </Link>
                <Link
                  href="/contact"
                  data-testid="hero-cta-contact"
                  className="bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300"
                >
                  Start a Project
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="text-white/40" size={32} />
        </motion.div>
      </section>

      {/* Brand Introduction */}
      <section className="py-24 md:py-32" data-testid="intro-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                Who We Are
              </p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Visual Storytellers
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
                Maawarna Studios is a premium creative production and advertising studio specializing in cinematic storytelling. We transform brands through powerful visual narratives that captivate, inspire, and convert.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                From high-end photography to cinematic video production, we deliver excellence in every frame.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <img
                src="https://images.pexels.com/photos/8089657/pexels-photo-8089657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Behind the scenes filming"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-24 md:py-32 bg-card" data-testid="featured-works-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
              Portfolio Highlights
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Featured Works</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredWorks.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 cursor-pointer"
                data-testid={`featured-work-${work.id}`}
              >
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-end p-8">
                  <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/80 mb-2">
                      {work.category}
                    </p>
                    <h3 className="text-2xl font-bold mb-2">{work.title}</h3>
                    <p className="text-sm text-muted-foreground">{work.client}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/portfolio"
              data-testid="view-all-works-button"
              className="inline-block bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300"
            >
              View All Projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 md:py-32" data-testid="services-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
              What We Do
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Our Services</h2>
            <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground max-w-3xl mx-auto">
              Comprehensive creative production services tailored to elevate your brand
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden bg-neutral-900/50 border transition-all duration-500 p-8 md:p-12 flex flex-col ${pkg.badge ? 'border-white/30 hover:border-white/50' : 'border-white/5 hover:border-white/20'
                  }`}
                data-testid={`package-card-${index}`}
              >
                {pkg.badge && (
                  <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold uppercase tracking-wider py-1 px-4">
                    {pkg.badge}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider mb-6">Best for: {pkg.tagline}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground">{pkg.period}</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-4">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add-Ons Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">Available Add-Ons</h3>
            </div>
            <div className="bg-neutral-900/30 border border-white/5 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {addOns.map((addon) => (
                  <div key={addon.name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                    <span className="text-white/80">{addon.name}</span>
                    <span className="font-medium">{addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/services"
              data-testid="explore-services-button"
              className="inline-block bg-white text-black hover:bg-gray-200 rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300"
            >
              Explore All Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-24 md:py-32 bg-card" data-testid="clients-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
              Trusted By
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Leading Brands</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 max-w-5xl mx-auto"
          >
            {clients.map((client, index) => (
              <div
                key={index}
                className="text-xl md:text-2xl font-medium tracking-widest uppercase text-white hover:text-white/100 hover:opacity-100 transition-all duration-300 cursor-default"
                data-testid={`client-name-${index}`}
              >
                {client}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32" data-testid="cta-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Ready to Create Something
              <br />
              Extraordinary?
            </h2>
            <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground mb-12 max-w-2xl mx-auto">
              Let's collaborate to bring your vision to life with cinematic storytelling
            </p>
            <Link
              href="/contact"
              data-testid="final-cta-button"
              className="inline-block bg-white text-black hover:bg-gray-200 rounded-none px-12 py-5 font-bold uppercase tracking-wider transition-all duration-300 text-lg"
            >
              Work With Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
