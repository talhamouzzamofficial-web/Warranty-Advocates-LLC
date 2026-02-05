
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Services', path: '/services' },
    { label: 'FAQ', path: '/faqs' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-sky-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-blue-900 font-bold text-xl leading-none brand-font">WARRANTY</span>
                <span className="text-sky-500 font-semibold text-xs tracking-widest">ADVOCATES LLC</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-blue-900 bg-blue-50' 
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pl-4 ml-4 border-l border-slate-200 flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-blue-900 hover:text-sky-600 transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-5 py-2.5 bg-blue-900 text-white rounded-full text-sm font-semibold hover:bg-sky-600 transition-colors shadow-lg shadow-blue-900/10">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium ${
                isActive(link.path) 
                  ? 'text-blue-900 bg-blue-50 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 grid grid-cols-2 gap-3">
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center px-4 py-3 rounded-xl text-blue-900 bg-blue-50 font-semibold text-sm"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center px-4 py-3 rounded-xl text-white bg-blue-900 font-semibold text-sm shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
