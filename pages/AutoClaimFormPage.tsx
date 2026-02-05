
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  ChevronLeft, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Info, 
  AlertCircle,
  FileText,
  User,
  Mail,
  Smartphone,
  Send
} from 'lucide-react';
import { PRICING } from '../constants';

const AutoClaimFormPage: React.FC = () => {
  const [isLeased, setIsLeased] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    vehicleYear: '',
    makeModel: '',
    vin: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full bg-white rounded-[48px] shadow-2xl p-12 text-center animate-fade-in border border-slate-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 brand-font mb-4">Request Submitted!</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Your auto advocacy request has been received. Our specialists will review your case and contact you within 24 hours to begin the process.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-blue-900/10">
            Return to Home <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-blue-900 text-white pt-16 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/services" className="inline-flex items-center gap-2 text-sky-300 font-bold hover:text-white transition-colors mb-8">
            <ChevronLeft className="w-5 h-5" /> Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold brand-font mb-4">Auto Advocacy Request</h1>
          <p className="text-xl text-blue-100 opacity-80">Professional help for denied or stalled auto warranty claims.</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Pricing Toggle Section */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Vehicle Status</h3>
                <p className="text-slate-500 text-sm">Fees vary depending on if your vehicle is leased or owned.</p>
              </div>
              
              <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsLeased(false)}
                  className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${!isLeased ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Owned / Financed
                </button>
                <button
                  type="button"
                  onClick={() => setIsLeased(true)}
                  className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${isLeased ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Leased
                </button>
              </div>
            </div>

            <div className={`mt-8 p-6 rounded-2xl border flex items-start gap-4 transition-all ${isLeased ? 'bg-emerald-50 border-emerald-100' : 'bg-sky-50 border-sky-100'}`}>
              <div className={`p-2 rounded-xl shrink-0 ${isLeased ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'}`}>
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold mb-1 ${isLeased ? 'text-emerald-900' : 'text-sky-900'}`}>
                  Advocacy Fee: {isLeased ? '20% of Recovered Funds' : '$250.00 Flat Fee'}
                </h4>
                <p className={`text-sm leading-relaxed ${isLeased ? 'text-emerald-700/80' : 'text-sky-700/80'}`}>
                  {isLeased 
                    ? "Our 'No Win, No Fee' guarantee. We only charge if we successfully secure a refund or repair approval for your lease."
                    : "A one-time professional service fee for owned vehicles. We handle all negotiations with the warranty provider."}
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Fields */}
          <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-100 space-y-10">
            
            {/* Personal Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input required type="text" placeholder="Talha" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input required type="email" placeholder="name@example.com" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Year</label>
                  <input required type="text" placeholder="2022" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Make & Model</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input required type="text" placeholder="Ford F-150 Lariat" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">VIN Number (Optional)</label>
                <input type="text" placeholder="17-digit VIN" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" />
              </div>
            </div>

            {/* Claim Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Case Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Describe the Issue</label>
                  <textarea rows={5} required placeholder="Detail the failure, the warranty company response, and current status..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 resize-none"></textarea>
                </div>
                
                <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-10 text-center bg-slate-50 hover:bg-white hover:border-sky-400 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-sky-500" />
                  </div>
                  <p className="font-bold text-slate-900 mb-1">Upload Service Records or Denial Letters</p>
                  <p className="text-sm text-slate-500">Drag & drop or click to browse (Max 10MB)</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full py-5 bg-blue-900 text-white rounded-3xl font-bold text-xl hover:bg-sky-600 transition-all shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 group"
              >
                Submit Advocacy Request <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit Encrypted Submission</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutoClaimFormPage;
