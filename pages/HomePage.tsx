
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, FileText, TrendingUp, Bell, HeartHandshake, CheckCircle2, ArrowRight, Car } from 'lucide-react';
import { COMPANY_INFO, PRICING } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-blue-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-800/50 border border-blue-700/50 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-sky-400"></span>
            <span className="text-sky-300 text-xs font-bold tracking-widest uppercase">Direct Advocacy For You</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight brand-font leading-[1.1]">
            Real People. <br/><span className="text-sky-400 italic">Real</span> Warranty Help.
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            {COMPANY_INFO.subline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-full text-lg font-bold transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 group">
              Get Started Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-lg font-bold transition-all backdrop-blur-sm">
              File a Claim
            </Link>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center justify-center font-bold text-2xl tracking-tighter">TRUSTED</div>
            <div className="flex items-center justify-center font-bold text-2xl tracking-tighter">EXPERT-LED</div>
            <div className="flex items-center justify-center font-bold text-2xl tracking-tighter">RELIABLE</div>
            <div className="flex items-center justify-center font-bold text-2xl tracking-tighter">SECURE</div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 brand-font">How We Advocate For You</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We handle the stress, phone calls, and paperwork so you don't have to.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Claim Assistance', 
                desc: 'We manage your claim from filing to payout, ensuring you get maximum coverage.' 
              },
              { 
                icon: Car, 
                title: 'Auto Buying Help', 
                desc: 'Expert guidance before you sign, protecting you from bad warranties and scams.' 
              },
              { 
                icon: Bell, 
                title: 'Tracking & Reminders', 
                desc: 'Never miss a maintenance milestone or an expiration date with our smart vault.' 
              },
              { 
                icon: TrendingUp, 
                title: 'Refund Recovery', 
                desc: 'If a warranty was mis-sold or a claim wrongly denied, we fight for your refund.' 
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 brand-font leading-tight">No Confusion. <br/>No Runaround.</h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Warranty companies count on you giving up. We ensure that doesn't happen.
              </p>
              <ul className="space-y-6">
                {[
                  'Direct access to warranty law and policy experts',
                  'One-click document vault for all your records',
                  'Transparent pricing with no hidden surprises',
                  'Dedicated territory partners across the US'
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-slate-700 font-medium">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12">
                <Link to="/services" className="inline-flex items-center gap-2 text-blue-900 font-bold hover:text-sky-600 transition-colors">
                  Learn about our pricing models <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-sky-400/10 rounded-3xl -rotate-2"></div>
              <img 
                src="https://picsum.photos/seed/warranty/800/600" 
                alt="Professional team" 
                className="relative rounded-3xl shadow-2xl object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100 max-w-xs animate-bounce-slow">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">$12,400+</p>
                  <p className="text-xs text-slate-500">Recovered for clients this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16 brand-font">Simplified Protection Plans</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-sky-500 transition-all flex flex-col text-left">
              <div className="mb-6">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-widest uppercase">Monthly</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Basic Advocacy Plan</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold">${PRICING.basic}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited Claims
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Home & Auto Coverage
                </li>
              </ul>
              <Link to="/signup" className="w-full py-4 border-2 border-blue-900 text-blue-900 text-center rounded-xl font-bold hover:bg-blue-900 hover:text-white transition-colors">
                Choose Basic
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-sky-500 scale-105 z-10 flex flex-col text-left relative">
              <div className="absolute top-0 right-10 -translate-y-1/2">
                <span className="px-4 py-2 bg-sky-500 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">Best Value</span>
              </div>
              <div className="mb-6">
                <span className="px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-xs font-bold tracking-widest uppercase">Annual</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Advocacy Plan</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold">${PRICING.premium}</span>
                <span className="text-slate-400">/year</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> All Basic Features
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> 2 Months Free
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Priority Advocacy
                </li>
              </ul>
              <Link to="/signup" className="w-full py-4 bg-blue-900 text-white text-center rounded-xl font-bold hover:bg-sky-600 transition-colors">
                Choose Premium
              </Link>
            </div>

            {/* Auto Buying Assistance */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-sky-500 transition-all flex flex-col text-left">
              <div className="mb-6">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-widest uppercase">One-Time</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Auto Buying Help</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold">${PRICING.autoBuying}</span>
                <span className="text-slate-400"> flat fee</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Negotiation Strategy
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Warranty Audit
                </li>
              </ul>
              <Link to="/auto-buying" className="w-full py-4 border-2 border-slate-200 text-slate-600 text-center rounded-xl font-bold hover:border-blue-900 hover:text-blue-900 transition-colors">
                Get Expert Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 brand-font">Start Protecting Your Warranty Today</h2>
          <p className="text-xl text-blue-100 mb-12">Join thousands of homeowners who sleep better knowing we're on their side.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-900 rounded-full text-xl font-bold hover:bg-sky-400 hover:text-white transition-all shadow-2xl">
            Create Free Account <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
