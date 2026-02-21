'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Message sent successfully! We\'ll get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    company: '',
                    phone: '',
                    service: '',
                    message: '',
                });
            } else {
                toast.error(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'manuchandrasekare@gmail.com',
            link: 'mailto:manuchandrasekare@gmail.com',
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+1 (234) 567-890',
            link: 'tel:+94701722051',
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'Los Angeles, CA',
            link: '#',
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            {/* Hero Section */}
            <section className="py-24 md:py-32" data-testid="contact-hero-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            Get In Touch
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8" data-testid="contact-title">
                            Let's Create Something Extraordinary
                        </h1>
                        <p className="text-xl md:text-2xl font-light tracking-wide text-muted-foreground">
                            Ready to elevate your brand with cinematic storytelling? We'd love to hear about your project and discuss how we can bring your vision to life.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-24 md:py-32 bg-card" data-testid="contact-form-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium tracking-wider uppercase mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        data-testid="input-name"
                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors duration-300"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium tracking-wider uppercase mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        data-testid="input-email"
                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors duration-300"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium tracking-wider uppercase mb-2">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            data-testid="input-company"
                                            className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors duration-300"
                                            placeholder="Your Company"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium tracking-wider uppercase mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            data-testid="input-phone"
                                            className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors duration-300"
                                            placeholder="+1 (234) 567-890"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="service" className="block text-sm font-medium tracking-wider uppercase mb-2">
                                        Service Interested In
                                    </label>
                                    <select
                                        id="service"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        data-testid="input-service"
                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors duration-300"
                                    >
                                        <option value="">Select a service</option>
                                        <option value="photography">Commercial Photography</option>
                                        <option value="videography">Cinematic Videography</option>
                                        <option value="campaigns">Brand Advertising Campaigns</option>
                                        <option value="social">Social Media Content</option>
                                        <option value="direction">Creative Direction</option>
                                        <option value="postproduction">Post Production & Editing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium tracking-wider uppercase mb-2">
                                        Project Details *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        data-testid="input-message"
                                        className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors duration-300 resize-none"
                                        placeholder="Tell us about your project, timeline, and goals..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    data-testid="submit-button"
                                    className="w-full bg-white text-black hover:bg-gray-200 rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Reach out through any of these channels. We typically respond within 24 hours during business days.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <a
                                            key={info.label}
                                            href={info.link}
                                            data-testid={`contact-info-${index}`}
                                            className="flex items-start gap-4 group"
                                        >
                                            <div className="bg-neutral-900 border border-white/10 p-4 group-hover:border-white/30 transition-colors duration-300">
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium tracking-wider uppercase text-muted-foreground/60 mb-1">
                                                    {info.label}
                                                </p>
                                                <p className="text-lg font-medium group-hover:text-white transition-colors duration-300">
                                                    {info.value}
                                                </p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* WhatsApp Button */}
                            <div className="pt-8">
                                <a
                                    href="https://wa.me/+94701722051"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-testid="whatsapp-button"
                                    className="flex items-center justify-center gap-3 bg-[#25D366] text-white hover:bg-[#20BA5A] rounded-none px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300"
                                >
                                    <MessageSquare size={20} />
                                    Chat on WhatsApp
                                </a>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-neutral-900/50 border border-white/5 p-8">
                                <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                                <div className="space-y-2 text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="font-medium">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-24 md:py-32" data-testid="map-section">
                <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/60 mb-4">
                            Visit Us
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Our Studio</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="aspect-video bg-neutral-900 border border-white/10 overflow-hidden"
                    >
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <MapPin size={48} className="mx-auto mb-4 text-white/20" />
                                <p className="text-lg font-medium">Maawarna Studios</p>
                                <p className="text-sm">Los Angeles, California</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
