
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, User, Lock, ArrowRight, MapPin, Phone, Hash, Check, Loader2, Map } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface SignupPageProps {
  onLogin: (profile: UserProfile) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    postcode: '',
    phone: '',
    state: '',
    role: UserRole.USER as UserRole
  });
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!formData.fullName || !formData.email) return;

    setIsSubmitting(true);
    
    // Simulate API delay for professional feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a robust user profile from the form data
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email.toLowerCase().trim(),
      fullName: formData.fullName.trim(),
      address: formData.address,
      postcode: formData.postcode,
      phone: formData.phone,
      state: formData.state,
      role: formData.role,
      plan: 'FREE', // Default new accounts to Free Tier
      referralCode: formData.fullName.split(' ')[0].toUpperCase() + Math.floor(1000 + Math.random() * 9000),
      totalEarned: 0,
      pendingRewards: 0
    };

    // Store in the "registered users" database for retrieval at Login
    const registeredUsers = JSON.parse(localStorage.getItem('wa_registered_users') || '[]');
    registeredUsers.push(newUser);
    localStorage.setItem('wa_registered_users', JSON.stringify(registeredUsers));

    setIsSubmitting(false);

    // Redirect to login with the registered email so it's pre-filled
    navigate('/login', { 
      state: { 
        message: 'Account created successfully! Please log in to your dashboard.',
        registeredEmail: formData.email
      } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="p-2 bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-sky-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-blue-900 font-bold text-xl leading-none brand-font">WARRANTY</span>
              <span className="text-sky-500 font-semibold text-xs tracking-widest">ADVOCATES LLC</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 brand-font">Create Account</h2>
          <p className="text-slate-500 mt-2">Join Warranty Advocates LLC today</p>
        </div>

        {/* Multi-step indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= 1 ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-200 text-slate-500'}`}>1</div>
          <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-blue-900' : 'bg-slate-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= 2 ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-200 text-slate-500'}`}>2</div>
        </div>

        <div className="bg-white p-10 lg:p-16 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <ShieldCheck className="w-48 h-48" />
          </div>
          
          {step === 1 ? (
            <div className="space-y-8 animate-fade-in relative z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">What is your role?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { role: UserRole.USER, title: 'I need warranty help', desc: 'Homeowners and car owners looking for advocacy.' },
                  { role: UserRole.PARTNER, title: 'Territory Partner', desc: 'Real estate agents and businesses managing customers.' }
                ].map((option) => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: option.role })}
                    className={`p-6 text-left rounded-3xl border-2 transition-all group ${
                      formData.role === option.role 
                        ? 'border-blue-900 bg-blue-50/50 ring-4 ring-blue-900/5' 
                        : 'border-slate-100 hover:border-sky-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.role === option.role ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      {formData.role === option.role && <Check className="w-6 h-6 text-blue-900 animate-in zoom-in duration-300" />}
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{option.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">{option.desc}</p>
                  </button>
                ))}
              </div>
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-5 bg-blue-900 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 group active:scale-[0.98]"
              >
                Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in relative z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Complete Your Profile</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Physical Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main St" 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                      {formData.role === UserRole.PARTNER ? 'State of Application' : 'State'}
                    </label>
                    <div className="relative">
                      {formData.role === UserRole.PARTNER ? (
                        <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      ) : (
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      )}
                      <input 
                        type="text" 
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder={formData.role === UserRole.PARTNER ? "e.g. Florida" : "FL"} 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Postcode</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        placeholder="33901" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="239-000-0000" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-10 lg:-mx-16 px-10 lg:px-16 pb-6 mt-4 border-t border-slate-100 sm:border-none sm:relative sm:bg-transparent sm:m-0 sm:p-0">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-8 py-5 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSignup}
                  className="flex-1 py-5 bg-blue-900 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:bg-slate-400 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-400 pt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}
        </div>

        <p className="text-center mt-10 text-slate-600">
          Already have an account? <Link to="/login" className="text-blue-900 font-bold hover:text-sky-600 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
