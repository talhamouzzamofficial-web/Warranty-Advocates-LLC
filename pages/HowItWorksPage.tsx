
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UploadCloud, Send, Shield, PartyPopper, ArrowRight, ChevronRight } from 'lucide-react';
import { CMSPage } from '../types';

interface HowItWorksPageProps {
  pages: CMSPage[];
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ pages }) => {
  const pageData = pages.find(p => p.slug === 'how-it-works');
  const sections = pageData?.sections.filter(s => s.isVisible).sort((a,b) => a.order - b.order) || [];

  const steps = [
    { title: 'Create Account', desc: 'Sign up in seconds. Choose your role and start your journey with a clean dashboard.', icon: UserPlus, color: 'bg-blue-500' },
    { title: 'Upload Warranty', desc: 'Digitize your paperwork. Store contracts and receipts in our secure Vault.', icon: UploadCloud, color: 'bg-sky-500' },
    { title: 'Submit a Claim', desc: 'Need help? Click "New Claim", attach details, and let us handle the tedious work.', icon: Send, color: 'bg-indigo-500' },
    { title: 'We Advocate', desc: 'Our team contacts the provider. We handle follow-ups, negotiations, and aggressive tactics.', icon: Shield, color: 'bg-blue-800' },
    { title: 'Get Results', desc: 'Track progress in real-time. Whether it is approval, repair, or refund—we get results.', icon: PartyPopper, color: 'bg-emerald-500' }
  ];

  return (
    <div className="bg-white">
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 brand-font uppercase tracking-tight">How It Works</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Our 5-step process is designed to eliminate the stress of dealing with warranty companies. From login to resolution, we're on your side.
          </p>
        </div>
      </section>

      {sections.length > 0 && (
         <section className="py-20 bg-white">
            {sections.map(s => (
               <div key={s.id} className="max-w-4xl mx-auto px-4 text-center mb-20">
                  <h2 className="text-3xl font-bold mb-4">{s.title}</h2>
                  <p className="text-slate-500">{s.subtitle}</p>
               </div>
            ))}
         </section>
      )}

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 relative">
            <div className="absolute left-8 top-12 bottom-12 w-1 bg-slate-100 hidden md:block"></div>
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row gap-8 items-start group">
                <div className={`relative z-10 w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{idx + 1}. {step.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 bg-blue-900 rounded-[48px] text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6 brand-font uppercase">Ready to start?</h2>
              <p className="text-blue-100 mb-10 text-lg font-medium">It takes less than 2 minutes to create your account and protect your first asset.</p>
              <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-sky-500 text-white rounded-full text-xl font-bold hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/30 active:scale-95">
                Join Now <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
