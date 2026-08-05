'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import FoldHeading from '@/components/FoldHeading';

const BLUE = '#3b82f6';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const inputClass = `
  w-full bg-transparent text-foreground text-sm px-4 py-3.5
  border transition-colors duration-300 outline-none
  placeholder:text-foreground/25
`;

const contactInfo = [
  { icon: Mail,   label: 'Email',  value: 'maawarnastudios@gmail.com', link: 'mailto:maawarnastudios@gmail.com' },
  { icon: Phone,  label: 'Phone',  value: '+94 70 172 2051',             link: 'tel:+94701722051' },
  { icon: MapPin, label: 'Studio', value: '36, Galhena Road, Nugegoda, Sri Lanka',
    link: 'https://www.google.com/maps/search/?api=1&query=36,+Galhena+Road,+Nugegoda,+Sri+Lanka' },
];

const services = [
  { value: '',               label: 'Select a service' },
  { value: 'photography',   label: 'Commercial Photography' },
  { value: 'videography',   label: 'Cinematic Videography' },
  { value: 'campaigns',     label: 'Brand Advertising Campaigns' },
  { value: 'social',        label: 'Social Media Content' },
  { value: 'direction',     label: 'Creative Direction' },
  { value: 'postproduction',label: 'Post Production & Editing' },
  { value: 'other',         label: 'Other' },
];

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', service: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused]           = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent! We'll be in touch soon.");
        setFormData({ name: '', email: '', company: '', phone: '', service: '', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const borderStyle = (field) => ({
    borderColor: focused === field ? 'rgba(59,130,246,0.6)' : 'rgba(59,130,246,0.15)',
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">

      {/* ── Hero ── */}
      <section className="py-24 md:py-28" data-testid="contact-hero-section">
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
                Get In Touch
              </span>
            </div>
            <FoldHeading
              as="h1"
              className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
              data-testid="contact-title"
            >
              Let&apos;s Create<br />
              <span style={{
                background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Something
              </span>
              <br />Extraordinary.
            </FoldHeading>
            <p className="text-lg md:text-xl text-foreground/45 font-light leading-relaxed max-w-2xl">
              Ready to elevate your brand with cinematic storytelling? We&apos;d love to hear
              about your project and discuss how we can bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section
        className="py-20 md:py-28 border-t"
        style={{ borderColor: 'rgba(59,130,246,0.08)' }}
        data-testid="contact-form-section"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* ── Contact Form ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h2 className="text-2xl font-bold mb-8">Send a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">

                <div>
                  <label htmlFor="name" className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5"
                    style={{ color: 'rgba(235,242,255,0.45)' }}>
                    Full Name *
                  </label>
                  <input
                    type="text" id="name" name="name" required
                    value={formData.name} onChange={handleChange}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                    data-testid="input-name" placeholder="John Doe"
                    className={inputClass} style={borderStyle('name')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5"
                    style={{ color: 'rgba(235,242,255,0.45)' }}>
                    Email Address *
                  </label>
                  <input
                    type="email" id="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    data-testid="input-email" placeholder="john@company.com"
                    className={inputClass} style={borderStyle('email')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company" className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5"
                      style={{ color: 'rgba(235,242,255,0.45)' }}>
                      Company
                    </label>
                    <input
                      type="text" id="company" name="company"
                      value={formData.company} onChange={handleChange}
                      onFocus={() => setFocused('company')} onBlur={() => setFocused('')}
                      data-testid="input-company" placeholder="Your Company"
                      className={inputClass} style={borderStyle('company')}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5"
                      style={{ color: 'rgba(235,242,255,0.45)' }}>
                      Phone
                    </label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                      data-testid="input-phone" placeholder="070 123 4567"
                      className={inputClass} style={borderStyle('phone')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5"
                    style={{ color: 'rgba(235,242,255,0.45)' }}>
                    Service
                  </label>
                  <select
                    id="service" name="service"
                    value={formData.service} onChange={handleChange}
                    onFocus={() => setFocused('service')} onBlur={() => setFocused('')}
                    data-testid="input-service"
                    className={inputClass}
                    style={{ ...borderStyle('service'), background: 'hsl(220 25% 6%)' }}
                  >
                    {services.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-2.5"
                    style={{ color: 'rgba(235,242,255,0.45)' }}>
                    Project Details *
                  </label>
                  <textarea
                    id="message" name="message" required rows={6}
                    value={formData.message} onChange={handleChange}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                    data-testid="input-message"
                    placeholder="Tell us about your project, timeline, and goals..."
                    className={`${inputClass} resize-none`}
                    style={borderStyle('message')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="submit-button"
                  className="w-full py-4 font-bold text-sm uppercase tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                    color: '#fff',
                  }}
                >
                  {isSubmitting ? 'Sending…' : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* ── Contact Info ── */}
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-10"
            >
              <div>
                <h2 className="text-2xl font-bold mb-3">Contact Info</h2>
                <p className="text-sm text-foreground/40 leading-relaxed">
                  Reach out through any channel. We typically respond within 24 hours.
                </p>
              </div>

              <div className="space-y-5">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={info.label}
                      href={info.link}
                      target={info.label === 'Studio' ? '_blank' : undefined}
                      rel={info.label === 'Studio' ? 'noopener noreferrer' : undefined}
                      data-testid={`contact-info-${i}`}
                      className="flex items-start gap-4 group"
                    >
                      <div
                        className="w-11 h-11 flex items-center justify-center shrink-0 border transition-all duration-300"
                        style={{ borderColor: 'rgba(59,130,246,0.2)' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = BLUE;
                          e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Icon size={16} style={{ color: BLUE }} />
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.22em] uppercase font-semibold mb-1"
                          style={{ color: 'rgba(235,242,255,0.35)' }}>
                          {info.label}
                        </p>
                        <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/+94701722051"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="whatsapp-button"
                className="flex items-center justify-center gap-3 py-4 font-bold text-sm uppercase tracking-[0.14em] transition-all duration-300"
                style={{ background: '#25D366', color: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1fb85a'}
                onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
              >
                <MessageSquare size={16} />
                Chat on WhatsApp
              </a>

              {/* Studio note */}
              <div
                className="p-6 border text-sm leading-relaxed"
                style={{ borderColor: 'rgba(59,130,246,0.12)', color: 'rgba(235,242,255,0.35)' }}
              >
                <p className="text-[10px] tracking-[0.22em] uppercase font-bold mb-3" style={{ color: BLUE }}>
                  Response Time
                </p>
                We typically respond within 24 hours on business days. For urgent inquiries,
                WhatsApp is the fastest way to reach us.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="pb-24 md:pb-32" data-testid="map-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px" style={{ background: BLUE }} />
              <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: BLUE }}>
                Find Us
              </span>
            </div>
            <FoldHeading className="text-3xl font-bold">Our Studio</FoldHeading>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="aspect-video overflow-hidden border"
            style={{ borderColor: 'rgba(59,130,246,0.12)' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0820849103!2d79.89765107475654!3d6.880774693118042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a50798e983b%3A0x6331a982997e068!2s36%20Galhena%20Rd%2C%20Nugegoda!5e0!3m2!1sen!2slk!4v1740209503108!5m2!1sen!2slk"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maawarna Studios Location"
              className="grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
