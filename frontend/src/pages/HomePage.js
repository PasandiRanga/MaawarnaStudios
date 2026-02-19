import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const services = [
    { name: 'Commercial Photography', count: '150+ Projects' },
    { name: 'Cinematic Videography', count: '200+ Films' },
    { name: 'Brand Campaigns', count: '80+ Brands' },
    { name: 'Creative Direction', count: '100+ Campaigns' },
  ];

  const clientLogos = [
    'https://images.unsplash.com/photo-1640346876447-ec22e2030d3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHNoYXBlJTIwbWluaW1hbCUyMGJsYWNrJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzE0ODkyNzl8MA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1651575560910-b497ea4ec36f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHNoYXBlJTIwbWluaW1hbCUyMGJsYWNrJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzE0ODkyNzl8MA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1652353292901-c9b06631b231?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHNoYXBlJTIwbWluaW1hbCUyMGJsYWNrJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzE0ODkyNzl8MA&ixlib=rb-4.1.0&q=85',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden" data-testid="hero-section">
        {/* Background Image with Overlay */}
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

        {/* Hero Content */}
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
                  to="/portfolio"
                  data-testid="hero-cta-portfolio"
                  className="bg-white text-black hover:bg-gray-200 rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300"
                >
                  View Our Work
                </Link>
                <Link
                  to="/contact"
                  data-testid="hero-cta-contact"
                  className="bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300"
                >
                  Start a Project
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
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
              to="/portfolio"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden bg-neutral-900/50 border border-white/5 hover:border-white/20 transition-all duration-500 p-8 flex flex-col justify-between h-64"
                data-testid={`service-card-${index}`}
              >
                <div>
                  <h3 className="text-xl font-bold mb-3">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.count}</p>
                </div>
                <div className="text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500">
                  0{index + 1}
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
              to="/services"
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
            className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60"
          >
            {clientLogos.map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt={`Client logo ${index + 1}`}
                className="w-24 h-24 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                data-testid={`client-logo-${index}`}
              />
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
              to="/contact"
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