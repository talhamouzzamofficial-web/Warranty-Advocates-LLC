
import React from 'react';
import { Link } from 'react-router-dom';
import { PRICING } from '../constants';
import { CheckCircle2, FileText, Car, Home as HomeIcon, ShieldCheck, HeartHandshake } from 'lucide-react';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-white pb-24">
      {/* Header */}
      <section className="bg-blue-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 brand-font">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Professional advocacy for every warranty scenario. Transparent pricing, no hidden fees.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          
          {/* Basic Plan */}
          <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-12 flex flex-col">
            <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Basic Advocacy Plan</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-extrabold text-blue-900">${PRICING.basic}</span>
              <span className="text-slate-500">/month</span>
            </div>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Standard ongoing protection for homeowners and vehicle owners. We manage your claims and track your documents monthly.
            </p>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                'Unlimited claim filings & advocacy',
                'Home and auto warranty support',
                'Document Vault storage',
                'Maintenance reminders'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="w-full py-5 border-2 border-blue-900 text-blue-900 text-center rounded-2xl font-bold hover:bg-blue-900 hover:text-white transition-colors">
              Get Basic Monthly
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-[40px] shadow-2xl border-2 border-sky-500 p-12 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-sky-500 text-white px-6 py-2 rounded-bl-3xl font-bold text-sm">SAVINGS</div>
            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Premium Advocacy Plan</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-extrabold text-blue-900">${PRICING.premium}</span>
              <span className="text-slate-500">/year</span>
            </div>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Our best-value plan. Get full elite advocacy with 2 months free when you commit to a year of protection.
            </p>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                'Everything in Basic Plan',
                '2 Months FREE (Best Value)',
                'Priority Advocacy support',
                'Annual contract review',
                'VIP response times'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="w-full py-5 bg-blue-900 text-white text-center rounded-2xl font-bold hover:bg-sky-600 transition-colors shadow-lg">
              Get Premium Annual
            </Link>
          </div>
        </div>

        {/* Other Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Auto Warranty Single Claim */}
           <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Auto Claim Only</h3>
            <p className="text-sm text-slate-500 mb-6">Single claim assistance for non-members.</p>
            <div className="space-y-2 mb-8 flex-grow">
               <div className="flex justify-between text-sm"><span className="text-slate-600">Lease Recovery:</span> <span className="font-bold">{PRICING.autoClaim.lease}</span></div>
               <div className="flex justify-between text-sm"><span className="text-slate-600">Non-Lease:</span> <span className="font-bold">${PRICING.autoClaim.nonLease}</span></div>
            </div>
            <Link to="/auto-claim" className="text-blue-900 font-bold text-sm hover:underline">Start Single Claim</Link>
          </div>

          {/* Buying Assistance */}
          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Auto Buying Assistance</h3>
            <p className="text-sm text-slate-500 mb-6">One-time expert consultation for car buyers.</p>
            <p className="text-2xl font-bold text-slate-900 mb-8">${PRICING.autoBuying}</p>
            <Link to="/contact" className="text-blue-900 font-bold text-sm hover:underline">Book Now</Link>
          </div>

          {/* Tracking */}
          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Warranty Vault</h3>
            <p className="text-sm text-slate-500 mb-6">Securely store documents and track reminders.</p>
            <p className="text-2xl font-bold text-slate-900 mb-8">FREE</p>
            <Link to="/signup" className="text-blue-900 font-bold text-sm hover:underline">Register Free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
