'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const PortfolioPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [activeFilter, setActiveFilter] = useState('all');

    const categories = [
        { id: 'all', label: 'All Projects' },
        { id: 'photography', label: 'Photography' },
        { id: 'videography', label: 'Videography' },
        { id: 'commercial', label: 'Commercial' },
        { id: 'events', label: 'Events' },
    ];

    const projects = [
        {
            id: 1,
            title: 'Haute Couture Editorial',
            category: 'photography',
            client: 'Vogue Magazine',
            description: 'High fashion editorial showcasing luxury brand collections with dramatic lighting and cinematic composition.',
            image: 'https://images.unsplash.com/photo-1768610284869-83f8c777daf0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwZWRpdG9yaWFsJTIwZHJhbWF0aWMlMjBsaWdodGluZ3xlbnwwfHx8fDE3NzE0ODkyNTZ8MA&ixlib=rb-4.1.0&q=85',
            role: 'Photography & Creative Direction',
        },
        {
            id: 2,
            title: 'Corporate Brand Film',
            category: 'videography',
            client: 'Tech Innovators Inc.',
            description: 'Cinematic brand film highlighting company culture, innovation, and vision for the future.',
            image: 'https://images.unsplash.com/photo-1705107958696-a7f73c749ab3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxjaW5lbWF0aWMlMjBmaWxtJTIwcHJvZHVjdGlvbiUyMHN0dWRpbyUyMGJlaGluZCUyMHRoZSUyMHNjZW5lcyUyMGNhbWVyYSUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3MTQ4OTI1NXww&ixlib=rb-4.1.0&q=85',
            role: 'Videography & Post-Production',
        },
        {
            id: 3,
            title: 'Luxury Perfume Campaign',
            category: 'commercial',
            client: 'Dior',
            description: 'Premium product photography for luxury fragrance line with minimalist aesthetic.',
            image: 'https://images.unsplash.com/photo-1760860992203-85ca32536788?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5JTIwbHV4dXJ5JTIwYnJhbmQlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcxNDg5MjU4fDA&ixlib=rb-4.1.0&q=85',
            role: 'Product Photography',
        },
        {
            id: 4,
            title: 'Global Summit 2024',
            category: 'events',
            client: 'International Business Forum',
            description: 'Complete event coverage including keynote sessions, networking, and behind-the-scenes moments.',
            image: 'https://images.pexels.com/photos/6950141/pexels-photo-6950141.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            role: 'Event Photography & Videography',
        },
        {
            id: 5,
            title: 'Minimalist Beauty Campaign',
            category: 'commercial',
            client: 'Luxury Cosmetics Brand',
            description: 'Clean, minimalist product photography highlighting premium beauty products.',
            image: 'https://images.pexels.com/photos/29899576/pexels-photo-29899576.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            role: 'Product Photography & Art Direction',
        },
        {
            id: 6,
            title: 'Gothic Fashion Series',
            category: 'photography',
            client: 'Alternative Fashion Magazine',
            description: 'Dark, moody editorial photography exploring gothic fashion aesthetics.',
            image: 'https://images.pexels.com/photos/32111884/pexels-photo-32111884.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            role: 'Editorial Photography',
        },
    ];

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            {/* Hero Section */}
            <section className="py-24 md:py-32" data-testid="portfolio-hero-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            Our Work
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8" data-testid="portfolio-title">
                            Portfolio
                        </h1>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground">
                            Explore our collection of cinematic productions, stunning photography, and creative campaigns that have helped brands tell their stories.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 border-y border-white/10 sticky top-20 bg-background/95 backdrop-blur-xl z-40" data-testid="category-filter">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveFilter(category.id)}
                                data-testid={`filter-${category.id}`}
                                className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all duration-300 ${activeFilter === category.id
                                        ? 'bg-white text-black'
                                        : 'bg-transparent border border-white/20 text-white hover:bg-white/10'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-24 md:py-32" data-testid="projects-grid">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                layout
                                className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 cursor-pointer"
                                data-testid={`project-${project.id}`}
                            >
                                {/* Project Image */}
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-8">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/80 mb-2">
                                            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                                        </p>
                                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-sm text-muted-foreground/90 mb-2">{project.client}</p>

                                        {/* Description - Only visible on hover */}
                                        <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-500">
                                            <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3 mt-3">
                                                {project.description}
                                            </p>
                                            <p className="text-xs font-medium tracking-widest uppercase text-white/60">
                                                {project.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Play Icon for Videos */}
                                {project.category === 'videography' && (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-6">
                                            <Play size={32} className="text-white" fill="white" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-xl text-muted-foreground">No projects found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-card" data-testid="portfolio-cta-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Like What You See?
                        </h2>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Let's create something extraordinary together
                        </p>
                        <a
                            href="/contact"
                            data-testid="portfolio-cta-button"
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

export default PortfolioPage;
