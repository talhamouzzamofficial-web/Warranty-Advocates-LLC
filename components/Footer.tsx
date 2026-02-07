
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Terminal } from 'lucide-react';
import { CMSSettings } from '../types';

interface FooterProps {
  settings: CMSSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const socialIcons: any = { facebook: Facebook, twitter: Twitter, linkedin: Linkedin, instagram: Instagram };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              {/* Ensure footer-specific logo is in full color */}
              {settings.footerLogoUrl ? (
                <img src={settings.footerLogoUrl} alt="Footer Logo" style={{ width: settings.footerLogoWidth ? `${settings.footerLogoWidth}px` : '140px' }} className="h-auto opacity-100" />
              ) : settings.logoUrl ? (
                /* Ensure fallback logo is in full color without grayscale */
                <img src={settings.logoUrl} alt="Logo" style={{ width: settings.logoWidth ? `${settings.logoWidth}px` : 'auto' }} className="h-auto opacity-100" />
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-sky-400" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xl leading-none brand-font">WARRANTY</span>
                    <span className="text-sky-400 font-semibold text-[10px] tracking-widest uppercase">ADVOCATES</span>
                  </div>
                </div>
              )}
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {settings.footerText}
            </p>
            <div className="flex items-center gap-4">
               {Object.entries(settings.socials).map(([key, url]) => {
                 const Icon = socialIcons[key];
                 return url ? (
                   <a key={key} href={url} className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                     <Icon className="w-4 h-4" />
                   </a>
                 ) : null;
               })}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/how-it-works" className="hover:text-sky-400 transition-colors">How It Works</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Services & Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-sky-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/login" className="hover:text-sky-400 transition-colors">Member Login</Link></li>
              <li><Link to="/staff-login" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
                <Terminal className="w-3 h-3 group-hover:text-sky-400" /> Staff Portal
              </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Our Solutions</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Home Warranty Advocacy</Link></li>
              <li><Link to="/auto-warranty-claims" className="hover:text-sky-400 transition-colors">Auto Warranty Claims</Link></li>
              <li><Link to="/auto-buying-assistance" className="hover:text-sky-400 transition-colors">Auto Buying Consultation</Link></li>
              <li><Link to="/dashboard/warranties" className="hover:text-sky-400 transition-colors">Document Vault</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>{settings.copyrightText}</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
