
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UploadCloud, Send, Shield, PartyPopper, ArrowRight } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      title: 'Step 1 – Create Account',
      desc: 'Sign up in seconds. Choose your role and start your journey with a clean, easy-to-use dashboard.',
      icon: UserPlus,
      color: 'bg-blue-500'
    },
    {
      title: 'Step 2 – Upload Warranty',
      desc: 'Digitize your paperwork. Store contracts and receipts in our secure Document Vault for lifetime access.',
      icon: UploadCloud,
      color: 'bg-sky-500'
    },
    {
      title: 'Step 3 – Submit a Claim',
      desc: 'Need help? Click "New Claim", attach relevant details, and let us handle the tedious paperwork.',
      icon: Send,
      color: 'bg-indigo-500'
    },
    {
      title: 'Step 4 – We Advocate',
      desc: 'Our team contacts the warranty provider. We handle follow-ups, negotiations, and aggressive tactics.',
      icon: Shield,
      color: 'bg-blue-800'
    },
    {
      title: 'Step 5 – Get Results',
      desc: 'Track progress in real-time. Whether it is an approval, a repair, or a refund—we get results.',
      icon: PartyPopper,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="bg-white">
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 brand-font">How It Works</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our 5-step process is designed to eliminate the stress of dealing with warranty companies. 
            From the first login to the final resolution, we're with you.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 relative">
            {/* Connection Line */}
            <div className="absolute left-8 top-12 bottom-12 w-1 bg-slate-100 hidden md:block"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row gap-8 items-start group">
                <div className={`
                  relative z-10 w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shrink-0 
                  shadow-lg shadow-${step.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform
                `}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 bg-blue-900 rounded-3xl text-center text-white">
            <h2 className="text-3xl font-bold mb-6 brand-font">Ready to start?</h2>
            <p className="text-blue-100 mb-10 text-lg">It takes less than 2 minutes to create your account and protect your first warranty.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-sky-500 text-white rounded-full text-xl font-bold hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/30">
              Get Started Now <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
