
import React, { useState } from 'react';
import { FAQS } from '../constants';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <section className="bg-white py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 brand-font">Got Questions?</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about Warranty Advocates LLC and our process.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
                  openIndex === idx ? 'border-sky-500 shadow-md ring-1 ring-sky-500/10' : 'border-slate-100'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className={`text-lg font-bold ${openIndex === idx ? 'text-blue-900' : 'text-slate-900'}`}>
                    {faq.q}
                  </span>
                  <div className={`p-1 rounded-full transition-colors ${openIndex === idx ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                {openIndex === idx && (
                  <div className="px-8 pb-8 text-slate-600 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 p-10 bg-blue-50 rounded-[40px] text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Still have questions?</h3>
            <p className="text-slate-600 mb-8">Can't find what you are looking for? Our team is ready to help.</p>
            <a href="mailto:info@warrantyadvocatellc.com" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-full font-bold hover:bg-sky-600 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
