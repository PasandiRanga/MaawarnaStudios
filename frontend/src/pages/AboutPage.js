import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, Sparkles } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { icon: Users, label: 'Happy Clients', value: '200+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Target, label: 'Projects Completed', value: '500+' },
    { icon: Sparkles, label: 'Years Experience', value: '10+' },
  ];

  const values = [
    {
      title: 'Cinematic Excellence',
      description: 'We approach every project with a film-maker\'s eye, creating visuals that captivate and inspire.',
    },
    {
      title: 'Brand-Driven Creativity',
      description: 'Our creative process starts with understanding your brand DNA and translating it into compelling visual stories.',
    },
    {
      title: 'Premium Quality',
      description: 'From concept to delivery, we maintain the highest standards in production, ensuring world-class results.',
    },
    {
      title: 'Client Partnership',
      description: 'We believe in collaborative relationships, working closely with clients to exceed expectations.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      {/* Hero Section */}
      <section className="py-24 md:py-32" data-testid="about-hero-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
              About Us
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8" data-testid="about-title">
              We Are Visual Storytellers, Brand Builders, Creative Visionaries
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground">
              Maawarna Studios was founded on a simple belief: that great stories have the power to transform brands. We combine cinematic artistry with strategic thinking to create content that doesn\'t just look beautiful—it drives results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image + Story Section */}
      <section className="py-24 md:py-32 bg-card" data-testid="story-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1622676614630-a9109126264a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMHRlYW0lMjB3b3JraW5nJTIwdG9nZXRoZXIlMjBtZWV0aW5nfGVufDB8fHx8MTc3MTQ4OTI2Mnww&ixlib=rb-4.1.0&q=85"
                alt="Creative team collaboration"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                Our Story
              </p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Passion Meets Precision</h2>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
                Founded by creative professionals with backgrounds in film, advertising, and brand strategy, Maawarna Studios has grown into a full-service creative production house trusted by leading brands worldwide.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
                Our multidisciplinary team brings together cinematographers, photographers, creative directors, and post-production specialists who share a common obsession: creating work that matters.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                From small startups to Fortune 500 companies, we approach every project with the same level of dedication and artistic excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32" data-testid="stats-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                  data-testid={`stat-${index}`}
                >
                  <Icon className="mx-auto mb-4 text-white/40" size={48} />
                  <h3 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">{stat.value}</h3>
                  <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Philosophy */}
      <section className="py-24 md:py-32 bg-card" data-testid="mission-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
              Our Mission
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Crafting Visual Excellence</h2>
            <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground">
              To empower brands with cinematic storytelling that transcends traditional advertising, creating emotional connections that drive meaningful engagement and lasting impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32" data-testid="values-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
              What Drives Us
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden bg-neutral-900/50 border border-white/5 hover:border-white/20 transition-all duration-500 p-8"
                data-testid={`value-card-${index}`}
              >
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 md:py-32 bg-card" data-testid="differentiators-section">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                Why Choose Us
              </p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                What Makes Maawarna Different
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Film-Grade Production</h3>
                  <p className="text-muted-foreground">
                    We use cinema-grade equipment and techniques used in feature films, not standard commercial production.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Strategic Creative</h3>
                  <p className="text-muted-foreground">
                    Every visual decision is backed by brand strategy and audience insights, not just aesthetics.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">End-to-End Service</h3>
                  <p className="text-muted-foreground">
                    From concept development to final delivery, we handle every aspect of production in-house.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Proven Results</h3>
                  <p className="text-muted-foreground">
                    Our work consistently drives measurable brand growth, engagement, and ROI for our clients.
                  </p>
                </div>
              </div>
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
                alt="Behind the scenes production"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;