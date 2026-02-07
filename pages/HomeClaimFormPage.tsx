
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  ChevronLeft, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Info, 
  FileText,
  User,
  Mail,
  Smartphone,
  Send,
  Trash2,
  Camera,
  MapPin,
  Sparkles,
  Loader2,
  Building2,
  CalendarDays,
  Hammer
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AttachedFile {
  name: string;
  data: string;
  type: string;
  size: string;
}

const HomeClaimFormPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [documents, setDocuments] = useState<AttachedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    propertyType: 'Single Family Home',
    applianceType: 'Air Conditioning (HVAC)',
    problemStartDate: '',
    providerName: '',
    claimNumber: '',
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

  const generateProfessionalDescription = async () => {
    if (!formData.description || formData.description.length < 10) {
      alert("Please provide a few brief details about the issue first so the AI can help.");
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional warranty advocate. The user has a home warranty issue. 
        Appliance/System: ${formData.applianceType}
        Provider: ${formData.providerName}
        Problem Started: ${formData.problemStartDate}
        User's Brief Notes: "${formData.description}"
        
        Generate a professional, detailed, and persuasive advocacy description for a claim submission. 
        Focus on technical correctness, clear timelines, and why the provider is failing to satisfy their contractual obligation. 
        Keep it under 250 words. Do not use placeholders like [Name].`,
      });

      if (response.text) {
        setFormData({ ...formData, description: response.text.trim() });
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("AI Assistant is currently unavailable. Please continue manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activities = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    activities.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: 'GUEST_HOME',
      userName: formData.fullName || 'Guest User',
      action: 'SINGLE_HOME_CLAIM',
      detail: `Submitted home claim for ${formData.applianceType} at ${formData.propertyAddress}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(activities.slice(0, 50)));

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const propertyTypes = ['Single Family Home', 'Condo/Townhouse', 'Multi-Family', 'Commercial', 'Mobile Home'];
  const applianceTypes = [
    'Air Conditioning (HVAC)', 'Heating System', 'Plumbing / Sewer', 'Electrical System',
    'Refrigerator', 'Dishwasher', 'Oven / Range', 'Washer / Dryer', 'Roof Leak',
    'Pool / Spa Equipment', 'Septic System', 'Other'
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full bg-white rounded-[48px] shadow-2xl p-12 text-center animate-fade-in border border-slate-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 brand-font mb-4">Case Initialized!</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Your home warranty advocacy request has been received. Our team will perform an initial audit of your policy and contact you to begin the dispute process.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-blue-900/10">
            Back to Home <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-[#123E84] text-white pt-16 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/services" className="inline-flex items-center gap-2 text-sky-300 font-bold hover:text-white transition-colors mb-8">
            <ChevronLeft className="w-5 h-5" /> Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold brand-font mb-4">Home Warranty Claim</h1>
          <p className="text-xl text-blue-100 opacity-80">Stop the runaround. Get your repairs approved or your money back.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
               <HomeIcon className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">Standard Advocacy Fee: $250.00</h3>
               <p className="text-slate-500 text-sm leading-relaxed">This covers policy review, direct negotiation with providers, and escalation services. 100% refundable if we determine your policy doesn't legally cover the incident.</p>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-100 space-y-12">
            
            {/* 1. Member Information */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">1. Member Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="text" placeholder="John Smith" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all" />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Primary Phone</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="tel" placeholder="239-499-3100" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all" />
                  </div>
                </div>
            </div>

            {/* 2. Property Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">2. Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Property Type</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select value={formData.propertyType} onChange={(e) => setFormData({...formData, propertyType: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all appearance-none cursor-pointer font-bold text-slate-700">
                      {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Property Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="text" placeholder="123 Harmony St, Fort Myers, FL" value={formData.propertyAddress} onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Problem Nature & Timeline */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">3. Problem Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Nature of Problem (Appliance/System)</label>
                  <div className="relative">
                    <Hammer className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select value={formData.applianceType} onChange={(e) => setFormData({...formData, applianceType: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all appearance-none cursor-pointer font-bold text-slate-700">
                      {applianceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">When did the problem start?</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="date" value={formData.problemStartDate} onChange={(e) => setFormData({...formData, problemStartDate: e.target.value})} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all font-bold text-slate-700" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Warranty Provider</label>
                  <input required type="text" placeholder="e.g. American Home Shield" value={formData.providerName} onChange={(e) => setFormData({...formData, providerName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Existing Claim # (if any)</label>
                  <input type="text" placeholder="HWC-998811" value={formData.claimNumber} onChange={(e) => setFormData({...formData, claimNumber: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Detailed Description of Problem</label>
                   <button 
                    type="button" 
                    onClick={generateProfessionalDescription}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-[10px] font-black text-blue-900 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all disabled:opacity-50"
                   >
                     {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
                     {isGenerating ? 'AI Generating...' : 'AI Enhance'}
                   </button>
                </div>
                <textarea 
                  rows={6} 
                  required 
                  placeholder="Describe what happened. What did the technician say? Why was it denied?" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all resize-none font-medium"
                ></textarea>
              </div>
            </div>

            {/* 4. Document & Evidence Upload */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">4. Document & Evidence Upload</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-100 rounded-[40px] p-12 text-center bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all cursor-pointer group"
              >
                <input type="file" ref={fileInputRef} className="hidden" multiple accept=".pdf,image/*" onChange={handleFileChange} />
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-slate-300 group-hover:text-sky-500" />
                </div>
                <p className="font-bold text-slate-900 text-lg mb-1">Upload Policy, Denial Letters, or evidence photos</p>
                <p className="text-slate-500">Drag files here or click to browse (Max 15MB)</p>
              </div>

              {documents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm animate-fade-in group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                          {doc.type === 'PDF' ? <FileText className="w-6 h-6 text-blue-500" /> : <Camera className="w-6 h-6 text-sky-500" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.size}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8">
              <button type="submit" className="w-full py-6 bg-blue-900 text-white rounded-[32px] font-black text-xl hover:bg-sky-600 transition-all shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-4 group">
                Submit Case for Review <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-3 mt-8 text-slate-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure 256-bit Encrypted Submission</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeClaimFormPage;
