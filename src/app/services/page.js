'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const ServicesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            {/* Hero Section */}
            <section className="py-24 md:py-32" data-testid="services-hero-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            What We Offer
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8" data-testid="services-title">
                            Comprehensive Creative Services
                        </h1>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground">
                            From concept to delivery, we provide end-to-end creative production services that elevate your brand and captivate your audience.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Packages */}
            <section className="py-24 md:py-32 bg-card" data-testid="services-grid">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={pkg.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative overflow-hidden bg-neutral-900/50 border transition-all duration-500 p-8 md:p-12 flex flex-col ${pkg.badge ? 'border-white/30 hover:border-white/50' : 'border-white/5 hover:border-white/20'
                                    }`}
                                data-testid={`service-${index}`}
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
                            <h3 className="text-3xl font-bold">Available Add-Ons</h3>
                            <p className="text-muted-foreground mt-2">Enhance your package with these optional additions</p>
                        </div>
                        <div className="bg-neutral-900/30 border border-white/5 p-6 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                                {addOns.map((addon) => (
                                    <div key={addon.name} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                                        <span className="text-white/80 text-lg">{addon.name}</span>
                                        <span className="font-medium text-lg">{addon.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 md:py-32" data-testid="process-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            How We Work
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Our Process</h2>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground max-w-3xl mx-auto">
                            A streamlined approach that delivers exceptional results
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Discovery', desc: 'Understanding your brand, goals, and vision' },
                            { step: '02', title: 'Concept', desc: 'Creative development and strategic planning' },
                            { step: '03', title: 'Production', desc: 'Execution with precision and artistry' },
                            { step: '04', title: 'Delivery', desc: 'Final assets optimized for your needs' },
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                                data-testid={`process-step-${index}`}
                            >
                                <div className="text-6xl font-bold text-white/10 mb-4">{item.step}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 md:py-32 bg-card" data-testid="why-choose-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4 text-center">
                            Why Choose Maawarna
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 text-center">The Maawarna Advantage</h2>

                        <div className="space-y-8">
                            {[
                                {
                                    title: 'Cinema-Grade Equipment',
                                    desc: 'We use the same professional equipment used in feature films and high-budget commercials.',
                                },
                                {
                                    title: 'Award-Winning Team',
                                    desc: 'Our creative professionals have won numerous industry awards and recognition.',
                                },
                                {
                                    title: 'Fast Turnaround',
                                    desc: 'Efficient workflows and dedicated teams ensure timely delivery without compromising quality.',
                                },
                                {
                                    title: 'Full Rights & Ownership',
                                    desc: 'You own all the content we create. No hidden fees or licensing restrictions.',
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="border-l-2 border-white/20 pl-6"
                                    data-testid={`advantage-${index}`}
                                >
                                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32" data-testid="services-cta-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Ready to Elevate Your Brand?
                        </h2>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Let's discuss how our services can help you achieve your creative goals
                        </p>
                        <Link
                            href="/contact"
                            data-testid="services-cta-button"
                            className="inline-block bg-white text-black hover:bg-gray-200 rounded-none px-12 py-5 font-bold uppercase tracking-wider transition-all duration-300 text-lg"
                        >
                            Get in Touch
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
