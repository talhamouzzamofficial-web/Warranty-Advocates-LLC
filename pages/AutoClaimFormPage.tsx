
import React, { useState, useRef } from 'react';
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
  Send,
  Trash2,
  Camera
} from 'lucide-react';
import { PRICING } from '../constants';

interface AttachedFile {
  name: string;
  data: string;
  type: string;
  size: string;
}

const AutoClaimFormPage: React.FC = () => {
  const [isLeased, setIsLeased] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [documents, setDocuments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    vehicleYear: '',
    makeModel: '',
    vin: '',
    description: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newFile: AttachedFile = {
            name: file.name,
            data: reader.result as string,
            type: file.type.includes('pdf') ? 'PDF' : 'Image',
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
          };
          setDocuments(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activities = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    activities.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: 'GUEST_AUTO',
      userName: formData.fullName || 'Guest User',
      action: 'SINGLE_AUTO_CLAIM',
      detail: `Submitted auto claim for ${formData.makeModel || 'unspecified vehicle'} (${documents.length} docs)`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(activities.slice(0, 50)));

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
          
          {/* Pricing Section */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Vehicle Purchase Type</h3>
                <p className="text-slate-500 text-sm">Please select how the vehicle was acquired.</p>
              </div>
              
              <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsLeased(false)}
                  className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${!isLeased ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Cash / Financed
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

            <div className="p-6 rounded-2xl border bg-blue-50 border-blue-100 flex flex-col sm:flex-row items-start gap-4">
              <div className="p-2 rounded-xl shrink-0 bg-blue-100 text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-blue-900 text-lg mb-1 uppercase tracking-tight">
                  Advocacy Fee: {PRICING.autoClaim.rate} of recovered funds (minimum ${PRICING.autoClaim.minFee})
                </h4>
                <p className="text-sm leading-relaxed text-blue-700/80 mb-4 font-medium">
                  "No Win, No Fee" — The advocacy fee is only charged if a recovery or repair approval is successful. If no recovery is achieved, no fee is charged.
                </p>
                <div className="p-4 bg-white/50 rounded-xl border border-blue-200/50 flex gap-3 items-start">
                   <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-blue-900 font-semibold italic leading-relaxed">
                     {isLeased || !isLeased ? 'For financed or leased vehicles, recovered funds are paid directly to the lender/bank. The advocacy fee is paid separately by the customer.' : ''}
                   </p>
                </div>
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
                    <input 
                      required 
                      type="text" 
                      placeholder="Your Full Name" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required 
                      type="email" 
                      placeholder="name@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" 
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required 
                    type="tel" 
                    placeholder="239-499-3100" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" 
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Year</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="2022" 
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Make & Model</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required 
                      type="text" 
                      placeholder="Ford F-150 Lariat" 
                      value={formData.makeModel}
                      onChange={(e) => setFormData({...formData, makeModel: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" 
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">VIN Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="17-digit VIN" 
                  value={formData.vin}
                  onChange={(e) => setFormData({...formData, vin: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" 
                />
              </div>
            </div>

            {/* Claim Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Case Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Describe the Issue</label>
                  <textarea 
                    rows={5} 
                    required 
                    placeholder="Detail the failure, the warranty company response, and current status..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 resize-none"
                  ></textarea>
                </div>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[32px] p-10 text-center bg-slate-50 hover:bg-white hover:border-sky-400 transition-all cursor-pointer group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    accept=".pdf,image/*" 
                    onChange={handleFileChange}
                  />
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-sky-500" />
                  </div>
                  <p className="font-bold text-slate-900 mb-1">Upload Service Records or Denial Letters</p>
                  <p className="text-sm text-slate-500">Drag & drop or click to browse (Max 10MB per file)</p>
                </div>

                {/* Evidence List */}
                {documents.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attached Evidence ({documents.length})</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-fade-in group">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                              {doc.type === 'PDF' ? <FileText className="w-5 h-5 text-blue-500" /> : <Camera className="w-5 h-5 text-sky-500" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{doc.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeFile(idx)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
