import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone } from 'lucide-react';
import Logo from '@/assets/Maawarna_studios-removebg-preview.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity duration-300">
              <img
                src={Logo}
                alt="Maawarna Studios"
                className="h-12 w-auto brightness-0 invert"
                data-testid="footer-logo"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting visual stories that build powerful brands through cinematic production and creative advertising.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Portfolio', 'Services'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    data-testid={`footer-link-${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                'Commercial Photography',
                'Cinematic Videography',
                'Brand Campaigns',
                'Creative Direction',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Connect</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@maawarna.com"
                data-testid="footer-email"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors duration-300"
              >
                <Mail size={16} />
                hello@maawarna.com
              </a>
              <a
                href="tel:+1234567890"
                data-testid="footer-phone"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors duration-300"
              >
                <Phone size={16} />
                +1 (234) 567-890
              </a>
            </div>
            <div className="flex gap-4 mt-6">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  data-testid={`footer-social-${label.toLowerCase()}`}
                  aria-label={label}
                  className="text-muted-foreground hover:text-white transition-colors duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Maawarna Studios. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};