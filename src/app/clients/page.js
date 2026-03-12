'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const ClientsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const testimonials = [
        {
            id: 1,
            name: 'Sarah Mitchell',
            role: 'Marketing Director',
            company: 'Tech Innovators Inc.',
            image: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            text: 'Maawarna Studios transformed our brand presence with their cinematic approach. The brand film they created exceeded all expectations and has become a cornerstone of our marketing strategy.',
        },
        {
            id: 2,
            name: 'James Rodriguez',
            role: 'Creative Lead',
            company: 'Vogue Magazine',
            image: 'https://i.pravatar.cc/150?img=13',
            rating: 5,
            text: 'Working with Maawarna was an absolute pleasure. Their attention to detail and artistic vision brought our editorial concepts to life in ways we never imagined possible.',
        },
        {
            id: 3,
            name: 'Emma Chen',
            role: 'Brand Manager',
            company: 'Luxury Cosmetics',
            image: 'https://i.pravatar.cc/150?img=5',
            rating: 5,
            text: 'The product photography delivered by Maawarna elevated our entire brand aesthetic. Their understanding of luxury branding is unmatched, and the results speak for themselves.',
        },
        {
            id: 4,
            name: 'Michael Thompson',
            role: 'CEO',
            company: 'StartUp Ventures',
            image: 'https://i.pravatar.cc/150?img=12',
            rating: 5,
            text: 'As a startup, we needed to make a strong first impression. Maawarna created a brand video that perfectly captured our vision and helped us secure Series A funding.',
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            role: 'Events Director',
            company: 'Global Summit',
            image: 'https://i.pravatar.cc/150?img=9',
            rating: 5,
            text: 'Their event coverage was exceptional. They captured every important moment while staying completely unobtrusive. The final deliverables were delivered ahead of schedule.',
        },
        {
            id: 6,
            name: 'David Park',
            role: 'Creative Director',
            company: 'Fashion House',
            image: 'https://i.pravatar.cc/150?img=14',
            rating: 5,
            text: 'Maawarna Studios brings a level of professionalism and creativity that\'s rare in the industry. Every project is treated with care and executed flawlessly.',
        },
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
        <div className="min-h-screen bg-background text-foreground pt-20">
            {/* Client Logos / Brands */}
            <section className="py-24 md:py-32" data-testid="client-logos-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            Brand Collaborations
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">We've Worked With</h2>
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

            {/* Hero Section */}
            <section className="py-12 md:py-24 bg-card" data-testid="clients-hero-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            Testimonials
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8" data-testid="clients-title">
                            What Our Clients Say
                        </h1>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground">
                            Don't just take our word for it. Hear from the brands and businesses we've helped elevate through cinematic storytelling.
                        </p>
                    </motion.div>
                </div>
            </section>





            {/* Testimonials Grid */}
            <section className="py-24 md:py-32 bg-card" data-testid="testimonials-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden bg-neutral-900/50 border border-white/5 hover:border-white/20 transition-all duration-500 p-8 flex flex-col"
                                data-testid={`testimonial-${testimonial.id}`}
                            >
                                <Quote className="text-white/20 mb-4" size={32} />

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="white" className="text-white" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-base leading-relaxed text-muted-foreground mb-6 flex-grow">
                                    "{testimonial.text}"
                                </p>

                                {/* Client Info */}
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-bold text-sm">{testimonial.name}</h4>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        <p className="text-xs text-muted-foreground/60">{testimonial.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Metrics
            <section className="py-24 md:py-32" data-testid="trust-metrics-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            By The Numbers
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Trusted By Industry Leaders</h2>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: '200+', label: 'Happy Clients' },
                            { value: '98%', label: 'Client Retention' },
                            { value: '500+', label: 'Projects Delivered' },
                            { value: '25+', label: 'Industry Awards' },
                        ].map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                                data-testid={`metric-${index}`}
                            >
                                <h3 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">{metric.value}</h3>
                                <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60">
                                    {metric.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            */}



            {/* CTA Section */}
            <section className="py-24 md:py-32" data-testid="clients-cta-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Join Our Growing
                            <br />
                            List of Success Stories
                        </h2>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Let's create something extraordinary together
                        </p>
                        <a
                            href="/contact"
                            data-testid="clients-cta-button"
                            className="inline-block bg-white text-black hover:bg-gray-200 rounded-none px-12 py-5 font-bold uppercase tracking-wider transition-all duration-300 text-lg"
                        >
                            Start Your Project
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ClientsPage;
