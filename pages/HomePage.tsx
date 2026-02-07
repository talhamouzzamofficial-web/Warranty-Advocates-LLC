
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, CheckCircle2, ArrowRight, Car, Zap, Home as HomeIcon, TrendingUp, Bell, Image as ImageIcon, MoveRight } from 'lucide-react';
import { CMSPage, CMSPricingPlan, CMSSettings, CMSFAQ } from '../types';

interface HomePageProps {
  pages: CMSPage[];
  pricing: CMSPricingPlan[];
  settings: CMSSettings;
  faqs: CMSFAQ[];
}

const HomePage: React.FC<HomePageProps> = ({ pages, pricing, settings, faqs }) => {
  const pageData = pages.find(p => p.slug === 'home');
  const sections = pageData?.sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order) || [];

  return (
    <div className="bg-white">
      {sections.map((section) => {
        if (section.type === 'hero') {
          return (
            <section key={section.id} className="relative pt-24 pb-40 overflow-hidden bg-[#1e3a8a] text-white flex items-center">
              {/* Background gradient effects matching the screenshot */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-0 left-[-10%] w-[50%] h-full bg-blue-600/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 right-[-10%] w-[50%] h-full bg-sky-400/5 blur-[150px] rounded-full"></div>
              </div>
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Top Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10 animate-fade-in shadow-xl backdrop-blur-md">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#0ea5e9] animate-pulse"></span>
                  <span className="text-white text-[11px] font-black tracking-[0.2em] uppercase opacity-90">Direct Advocacy For You</span>
                </div>

                {/* Main Headline styled exactly as image */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter brand-font leading-[1] max-w-5xl mx-auto">
                  <span className="block text-white">Real People.</span>
                  <span className="block mt-2">
                    <span className="text-[#0ea5e9] italic font-bold mr-3 inline-block transform -skew-x-6">Real</span>
                    <span className="text-white">Warranty Help.</span>
                  </span>
                </h1>

                {/* Sub-headline */}
                <p className="text-lg md:text-2xl text-blue-100/80 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
                  {section.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
                  <Link 
                    to="/signup" 
                    className="w-full sm:w-auto px-10 py-5 bg-[#0ea5e9] hover:bg-sky-400 text-white rounded-full text-lg font-black transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)] flex items-center justify-center gap-2 group active:scale-95"
                  >
                    Get Started Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/services" 
                    className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full text-lg font-black transition-all backdrop-blur-md active:scale-95"
                  >
                    View Plans
                  </Link>
                </div>

                {/* Bottom Trust Bar */}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-60">
                   {['TRUSTED', 'EXPERT-LED', 'RELIABLE', 'SECURE'].map((tag) => (
                     <span key={tag} className="text-sm md:text-base font-black tracking-[0.3em] text-white/70">{tag}</span>
                   ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'features') {
          const fallbackFeatures = [
            { icon: ShieldCheck, title: 'Claim Assistance', desc: 'We manage your claim from filing to payout, ensuring you get maximum coverage.' },
            { icon: Car, title: 'Auto Buying Help', desc: 'Expert guidance before you sign, protecting you from bad warranties and scams.' },
            { icon: Bell, title: 'Tracking & Reminders', desc: 'Never miss a maintenance milestone or an expiration date with our smart vault.' },
            { icon: TrendingUp, title: 'Refund Recovery', desc: 'If a warranty was mis-sold or a claim wrongly denied, we fight for your refund.' }
          ];

          return (
            <section key={section.id} className="py-24 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 brand-font">{section.title}</h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {fallbackFeatures.map((item, idx) => (
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
          );
        }

        if (section.type === 'text') {
           return (
             <section key={section.id} className="py-24 bg-white border-b border-slate-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                   <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 brand-font">{section.title}</h2>
                   <p className="text-xl text-slate-600 leading-relaxed font-medium">{section.subtitle}</p>
                   {section.buttonLabel && (
                     <Link to={section.buttonUrl || '#'} className="inline-flex items-center gap-2 mt-8 text-blue-900 font-bold hover:underline">
                        {section.buttonLabel} <ArrowRight className="w-4 h-4" />
                     </Link>
                   )}
                </div>
             </section>
           );
        }

        if (section.type === 'cta') {
           return (
             <section key={section.id} className="py-24 bg-blue-900 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                   <h2 className="text-3xl md:text-5xl font-bold mb-8 brand-font">{section.title}</h2>
                   <p className="text-xl text-blue-100 mb-12">{section.subtitle}</p>
                   <Link to={section.buttonUrl || '/signup'} className="inline-flex items-center gap-2 px-10 py-5 bg-sky-500 text-white rounded-full text-xl font-bold hover:bg-sky-400 transition-all shadow-2xl">
                    {section.buttonLabel || 'Get Started'} <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
             </section>
           );
        }

        return null;
      })}

      {/* Pricing - Specifically matching "Simplified Protection Plans" Image */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0f172a] mb-24 brand-font tracking-tight">Simplified Protection Plans</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch relative">
            {pricing.filter(p => p.isActive).sort((a,b) => a.order - b.order).map((plan) => {
              const isPremium = plan.name.toLowerCase().includes('premium');
              const isFree = plan.name.toLowerCase().includes('free');
              const isBasic = plan.name.toLowerCase().includes('basic');

              return (
                <div key={plan.id} className={`p-12 lg:p-14 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border flex flex-col text-left relative transition-all duration-500 hover:scale-[1.02] ${
                  isPremium ? 'bg-[#1e3a8a] text-white scale-105 z-20 border-white/10' : 'bg-white text-slate-900 border-slate-100'
                }`}>
                  
                  {plan.label && (
                    <div className={`absolute top-0 right-10 -translate-y-1/2`}>
                      <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl ${
                        isPremium ? 'bg-[#0ea5e9] text-white' : 'bg-[#e2e8f0] text-[#64748b]'
                      }`}>
                        {plan.label}
                      </span>
                    </div>
                  )}

                  <div className="mb-10">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      isPremium ? 'bg-white/10 text-sky-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {isFree ? 'INITIAL' : isBasic ? 'MONTHLY' : 'ANNUAL'}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold mb-6 brand-font tracking-tight">{plan.name}</h3>
                  
                  <div className="mb-12 flex items-baseline">
                    <span className="text-7xl font-black tracking-tighter">${isFree ? '0' : isPremium ? plan.priceYearly : plan.priceMonthly}</span>
                    <span className={`text-xl font-bold ml-2 opacity-40 ${isPremium ? 'text-blue-200' : 'text-slate-400'}`}>
                      /{isFree ? 'forever' : isPremium ? 'yr' : 'mo'}
                    </span>
                  </div>

                  <ul className="space-y-6 mb-16 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-4 text-base font-bold">
                        {isPremium ? (
                          <Zap className="w-5 h-5 text-sky-400 fill-current shrink-0" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
                             <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        <span className={isPremium ? 'text-blue-50' : 'text-slate-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    to="/signup" 
                    className={`w-full py-6 rounded-3xl text-center font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${
                      isPremium 
                        ? 'bg-[#0ea5e9] text-white hover:bg-sky-400 shadow-sky-500/20' 
                        : isFree 
                          ? 'bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-blue-900/10'
                          : 'bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white'
                    }`}
                  >
                    {isFree ? 'Join Free' : isBasic ? 'Choose Basic' : 'Start Premium'}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-24">
            <Link to="/services" className="inline-flex items-center gap-3 text-[#64748b] font-black text-xs uppercase tracking-[0.2em] hover:text-[#1e3a8a] transition-colors group">
              View all specialized services <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global FAQ Snippet */}
      {faqs.length > 0 && (
        <section className="py-24 bg-slate-50">
           <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-12 brand-font">Frequently Asked Questions</h2>
              <div className="space-y-4 text-left">
                 {faqs.filter(f => f.isActive).slice(0, 3).map((faq) => (
                   <div key={faq.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-slate-500">{faq.answer}</p>
                   </div>
                 ))}
              </div>
              <Link to="/faq" className="inline-flex items-center gap-2 mt-10 font-bold text-blue-900 hover:underline">View All FAQs <ChevronRight className="w-4 h-4" /></Link>
           </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
