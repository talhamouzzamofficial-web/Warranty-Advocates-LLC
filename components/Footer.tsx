
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Terminal } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-sky-400" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl leading-none brand-font">WARRANTY</span>
                <span className="text-sky-400 font-semibold text-xs tracking-widest">ADVOCATES LLC</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              We empower homeowners and vehicle owners with professional warranty advocacy. Our mission is to ensure you get the protection you paid for.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/how-it-works" className="hover:text-sky-400 transition-colors">How It Works</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Services & Pricing</Link></li>
              <li><Link to="/faqs" className="hover:text-sky-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/login" className="hover:text-sky-400 transition-colors">Member Login</Link></li>
              <li><Link to="/staff-login" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
                <Terminal className="w-3 h-3 group-hover:text-sky-400" /> Staff Portal
              </Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Our Solutions</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Home Warranty Advocacy</Link></li>
              <li><Link to="/auto-claim" className="hover:text-sky-400 transition-colors">Auto Warranty Claims</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Auto Buying Consultation</Link></li>
              <li><Link to="/dashboard" className="hover:text-sky-400 transition-colors">Document Vault</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Territory Partnerships</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{COMPANY_INFO.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved. Registered in Florida.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
