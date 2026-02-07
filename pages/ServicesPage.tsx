
import React from 'react';
import { Link } from 'react-router-dom';
import { CMSPage, CMSPricingPlan } from '../types';
import { CheckCircle2, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

interface ServicesPageProps {
  pages: CMSPage[];
  pricing: CMSPricingPlan[];
}

const ServicesPage: React.FC<ServicesPageProps> = ({ pages, pricing }) => {
  const activePlans = pricing.filter(p => p.isActive).sort((a,b) => a.order - b.order);

  return (
    <div className="bg-white pb-32">
      <section className="bg-[#1e3a8a] text-white pt-24 pb-48 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 brand-font tracking-tight uppercase">Our Services</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium">
          Professional advocacy for every warranty scenario. Transparent pricing, elite support.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {activePlans.map((plan) => (
            <div key={plan.id} className={`rounded-[40px] shadow-2xl p-10 lg:p-12 flex flex-col border transition-transform hover:-translate-y-1 relative overflow-hidden ${plan.name.toLowerCase().includes('premium') ? 'bg-blue-900 text-white border-sky-400/30' : 'bg-white text-slate-900 border-slate-50'}`}>
              {plan.label && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#38bdf8] text-white px-8 py-2 rounded-bl-[20px] font-black text-[10px] tracking-widest uppercase">{plan.label}</div>
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${plan.name.toLowerCase().includes('premium') ? 'bg-white/10 text-sky-400' : 'bg-blue-50 text-blue-500'}`}>
                {plan.name.toLowerCase().includes('premium') ? <Zap className="w-8 h-8 fill-current" /> : <ShieldCheck className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-bold mb-4 brand-font">{plan.name}</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold">${plan.priceMonthly}</span>
                <span className="opacity-60 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.name.toLowerCase().includes('premium') ? 'text-sky-400' : 'text-emerald-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`w-full py-4 text-center rounded-2xl font-bold transition-all ${plan.name.toLowerCase().includes('premium') ? 'bg-sky-500 text-white hover:bg-white hover:text-blue-900' : 'border-2 border-slate-200 text-[#1e3a8a] hover:bg-slate-50'}`}>
                Start Now
              </Link>
            </div>
          ))}

          {/* If pricing is empty in CMS, show placeholders */}
          {activePlans.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[40px]">
               No pricing plans configured in CMS yet.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Auto Claim Only</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Single claim assistance for non-members.</p>
            <div className="mb-10"><span className="text-blue-900 font-bold text-sm">20% Recovery Fee</span></div>
            <Link to="/auto-warranty-claims" className="mt-auto text-blue-900 font-bold text-xs hover:underline flex items-center gap-2 uppercase tracking-widest">Start Claim <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Auto Buying Help</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">One-time expert consultation.</p>
            <div className="mb-10"><span className="text-2xl font-bold text-slate-900">$499.00</span></div>
            <Link to="/auto-buying-assistance" className="mt-auto text-blue-900 font-bold text-xs hover:underline uppercase tracking-widest">Book Consultation</Link>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Warranty Vault</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Securely store documents and track reminders.</p>
            <div className="mb-10"><span className="text-2xl font-bold text-slate-900 uppercase">FREE</span></div>
            <Link to="/signup" className="mt-auto text-blue-900 font-bold text-xs hover:underline uppercase tracking-widest">Join Vault</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
