
import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { CMSFAQ } from '../types';

interface FAQPageProps {
  faqs: CMSFAQ[];
}

const FAQPage: React.FC<FAQPageProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const activeFaqs = faqs.filter(f => f.isActive).sort((a,b) => a.order - b.order);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Page Header */}
      <section className="bg-white py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-sm">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] mb-6 brand-font tracking-tight">Got Questions?</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Everything you need to know about Warranty Advocates LLC and our professional advocacy process.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {activeFaqs.length > 0 ? activeFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={faq.id} 
                  className={`bg-white rounded-[24px] shadow-sm border transition-all duration-500 overflow-hidden ${
                    isOpen 
                      ? 'border-[#0ea5e9] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] ring-1 ring-[#0ea5e9]/10' 
                      : 'border-slate-100'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-10 py-8 flex items-center justify-between text-left group"
                  >
                    <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                      isOpen ? 'text-[#1e3a8a]' : 'text-[#1e293b]'
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                      isOpen ? 'bg-[#0ea5e9] text-white rotate-180' : 'bg-slate-50 text-[#64748b] group-hover:bg-slate-100'
                    }`}>
                      {isOpen ? <Minus className="w-5 h-5 stroke-[3px]" /> : <Plus className="w-5 h-5 stroke-[3px]" />}
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-10 pb-10 text-slate-500 text-lg leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">No Knowledge Base records found.</p>
              </div>
            )}
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-20 p-12 bg-[#f8fbff] rounded-[48px] text-center border border-blue-100/50 shadow-sm">
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">Still have questions?</h3>
            <p className="text-slate-500 mb-10 text-lg font-medium">Can't find what you are looking for? Our team of professional advocates is ready to assist you directly.</p>
            <a href="mailto:info@warrantyadvocatellc.com" className="inline-flex items-center gap-3 px-10 py-5 bg-[#1e3a8a] text-white rounded-full font-bold hover:bg-[#0ea5e9] transition-all shadow-xl shadow-blue-900/10 active:scale-95">
              Contact Advocacy Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
