'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, PenTool, Share2, Scissors, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ServicesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const services = [
        {
            icon: Camera,
            title: 'Commercial Photography',
            description: 'High-end photography for products, fashion, corporate, and editorial needs. We create images that capture attention and tell your brand story.',
            features: [
                'Product Photography',
                'Fashion & Editorial',
                'Corporate Headshots',
                'Lifestyle & Branding',
                'Food & Beverage',
                'Architecture & Interior',
            ],
        },
        {
            icon: Film,
            title: 'Cinematic Videography',
            description: 'Film-grade video production that brings your story to life. From brand films to commercials, we create videos that engage and inspire.',
            features: [
                'Brand Films',
                'TV Commercials',
                'Corporate Videos',
                'Documentary Style',
                'Music Videos',
                'Event Coverage',
            ],
        },
        {
            icon: Sparkles,
            title: 'Brand Advertising Campaigns',
            description: 'Integrated campaigns that combine strategy, creativity, and execution. We develop concepts that resonate with your audience and drive results.',
            features: [
                'Campaign Strategy',
                'Creative Concept Development',
                'Multi-Platform Content',
                'Social Media Campaigns',
                'Print Advertising',
                'Digital Marketing Content',
            ],
        },
        {
            icon: Share2,
            title: 'Social Media Content Production',
            description: 'Engaging content tailored for social platforms. We create thumb-stopping visuals that increase engagement and grow your following.',
            features: [
                'Instagram Content',
                'TikTok Videos',
                'YouTube Production',
                'Reels & Stories',
                'Content Calendar Planning',
                'Influencer Collaborations',
            ],
        },
        {
            icon: PenTool,
            title: 'Creative Direction',
            description: 'Strategic creative leadership for your projects. We guide the visual narrative from concept to completion, ensuring cohesive and impactful results.',
            features: [
                'Art Direction',
                'Brand Visual Identity',
                'Mood Board & Style Guides',
                'Concept Development',
                'Creative Consultation',
                'Project Management',
            ],
        },
        {
            icon: Scissors,
            title: 'Post Production & Editing',
            description: 'Professional editing and color grading that elevates your footage. We polish every frame to achieve cinematic quality and emotional impact.',
            features: [
                'Video Editing',
                'Color Grading',
                'Motion Graphics',
                'Sound Design',
                'Visual Effects',
                'Photo Retouching',
            ],
        },
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

            {/* Services Grid */}
            <section className="py-24 md:py-32 bg-card" data-testid="services-grid">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative overflow-hidden bg-neutral-900/50 border border-white/5 hover:border-white/20 transition-all duration-500 p-8 flex flex-col"
                                    data-testid={`service-${index}`}
                                >
                                    <Icon className="mb-6 text-white/80 group-hover:text-white transition-colors duration-500" size={48} />

                                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>

                                    <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
                                        {service.description}
                                    </p>

                                    <div className="mt-auto">
                                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-3">
                                            Includes:
                                        </p>
                                        <ul className="grid grid-cols-2 gap-2">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                                    <span className="mr-2 text-white/40">•</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
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
