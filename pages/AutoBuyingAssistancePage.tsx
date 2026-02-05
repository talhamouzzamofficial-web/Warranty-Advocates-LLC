
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Users, 
  FileSearch, 
  Handshake, 
  Wallet,
  X,
  CreditCard,
  Loader2
} from 'lucide-react';
import { PRICING } from '../constants';

const AutoBuyingAssistancePage: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPurchased(true);
    setTimeout(() => {
      setShowCheckout(false);
    }, 2000);
  };

  const features = [
    {
      title: 'Expert Negotiation',
      desc: 'We handle the stressful back-and-forth with dealerships to secure the best possible out-the-door price.',
      icon: Handshake
    },
    {
      title: 'Warranty Audit',
      desc: 'Our experts review every fine-print detail of offered warranties to ensure you aren\'t buying "junk" coverage.',
      icon: FileSearch
    },
    {
      title: 'Dealer Fee Validation',
      desc: 'We scrutinize every line item on your sales contract to eliminate unnecessary "add-on" fees and hidden costs.',
      icon: Wallet
    },
    {
      title: 'Trade-In Advocacy',
      desc: 'Not getting a fair value for your current car? We fight for top-dollar trade-in valuations.',
      icon: TrendingUp
    }
  ];

  const steps = [
    { title: 'Initial Consultation', desc: 'We discuss your budget, vehicle needs, and target dealerships.' },
    { title: 'Inventory Hunt', desc: 'We help identify the best units in the market with clean history reports.' },
    { title: 'The Fight', desc: 'We take over communication with the sales manager to lock in your deal.' },
    { title: 'Document Review', desc: 'Before you sign, we review the final contract for total accuracy.' }
  ];

  return (
    <div className="bg-white pb-24">
      {/* Hero */}
      <section className="bg-blue-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-sky-300 font-bold hover:text-white transition-colors mb-8">
            <ChevronLeft className="w-5 h-5" /> Back to Services
          </Link>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/20 mb-6">
              <Star className="w-4 h-4 text-sky-400 fill-current" />
              <span className="text-sky-300 text-xs font-bold tracking-widest uppercase">Expert Buying Counsel</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 brand-font leading-tight">
              Don't Walk Into the Dealership <span className="text-sky-400">Alone</span>.
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              For a flat one-time fee, our professional advocates handle the entire car buying process for you. From negotiation to warranty auditing—we ensure you never overpay.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setShowCheckout(true)}
                className="px-10 py-5 bg-sky-500 text-white rounded-2xl font-bold text-lg hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20 flex items-center gap-3 active:scale-95"
              >
                Book Advocacy Now <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <span className="text-2xl font-bold">${PRICING.autoBuying}</span>
                <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">One-Time Fee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 brand-font">What We Handle For You</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">We are your professional shield against dealership sales tactics.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-900 text-white rounded-[60px] mx-4 sm:mx-8 lg:mx-16 px-4">
        <div className="max-w-5xl mx-auto py-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 brand-font leading-tight">Our Precision Buying Process</h2>
                <div className="space-y-8">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 shrink-0">0{i+1}</div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                        <p className="text-slate-400 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
                 <div className="relative bg-white/5 border border-white/10 p-10 rounded-[48px] backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg"><ShoppingBag className="w-6 h-6 text-white" /></div>
                      <h3 className="text-xl font-bold">The Buyer's Edge</h3>
                    </div>
                    <ul className="space-y-6">
                       {['Average of $2,400 saved per client', 'Over 500 successful dealership negotiations', '100% independent - we never take dealer kickbacks', 'Available for New & Pre-Owned vehicles'].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-slate-300">
                           <CheckCircle2 className="w-5 h-5 text-sky-400" /> {item}
                         </li>
                       ))}
                    </ul>
                    <button 
                      onClick={() => setShowCheckout(true)}
                      className="w-full mt-10 py-5 bg-white text-blue-900 rounded-3xl font-bold text-lg hover:bg-sky-400 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      Lock In My Advocate
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {purchased ? (
              <div className="p-12 text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 brand-font mb-4">Payment Success!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">Your Auto Buying Specialist has been reserved. Check your email for next steps.</p>
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-900 font-bold hover:underline">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="p-12">
                <div className="mb-10">
                  <div className="flex items-center gap-3 text-sky-600 font-bold uppercase tracking-widest text-xs mb-4">
                    <ShieldCheck className="w-4 h-4" /> Secure Checkout
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 brand-font">Confirm Purchase</h3>
                  <p className="text-slate-500">Auto Buying Professional Advocacy</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Service Fee</span>
                    <span className="text-slate-900 font-bold">${PRICING.autoBuying}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-900 font-bold">Total Due</span>
                    <span className="text-blue-900 font-black tracking-tight">${PRICING.autoBuying}.00</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      required
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all font-medium text-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <input 
                      type="text" 
                      placeholder="MM/YY" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all font-medium text-sm" 
                    />
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all font-medium text-sm" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full py-5 bg-blue-900 text-white rounded-[24px] font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 mt-6 disabled:bg-slate-300 disabled:shadow-none active:scale-95"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        Complete Payment
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                    256-Bit SSL Encryption • Secure Payment Processing
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TrendingUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default AutoBuyingAssistancePage;
