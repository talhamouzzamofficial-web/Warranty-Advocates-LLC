
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface LoginPageProps {
  onLogin: (profile: UserProfile) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if we arrived here with a success message from signup
    if (location.state && (location.state as any).message) {
      setSuccessMessage((location.state as any).message);
      if ((location.state as any).registeredEmail) {
        setEmail((location.state as any).registeredEmail);
      }
      // Clean up the history state so the message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLoginProcess = (role: UserRole, forceUnregistered: boolean = false) => {
    // Admins are not allowed to log in through this gate anymore
    if (role === UserRole.ADMIN && forceUnregistered === false) {
      setError('Administrators must use the Staff Portal.');
      return;
    }

    const registeredUsers: UserProfile[] = JSON.parse(localStorage.getItem('wa_registered_users') || '[]');
    const matchedUser = registeredUsers.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());

    if (matchedUser && !forceUnregistered) {
      onLogin(matchedUser);
    } else {
      const mockUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        email: email || `${role.toLowerCase()}@example.com`,
        fullName: role === UserRole.PARTNER ? 'Florida Partner' : role === UserRole.ADMIN ? 'Head Office Administrator' : 'Jane Doe',
        role: role,
        referralCode: (email ? email.split('@')[0].toUpperCase() : 'USER') + 'REF',
        totalEarned: 0,
        pendingRewards: 0
      };
      onLogin(mockUser);
    }
    
    if (role === UserRole.ADMIN) {
      navigate('/admin-portal');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    handleLoginProcess(UserRole.USER);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
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
          <h2 className="text-3xl font-bold text-slate-900 brand-font">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Log in to manage your warranties and claims</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 text-sm animate-fade-in border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-shake border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-sky-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-blue-900 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 group"
            >
              Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Access Mock Buttons for Testing roles */}
          <div className="mt-10 pt-10 border-t border-slate-100">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Demo Gateways</p>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleLoginProcess(UserRole.USER, true)} className="py-3 text-[9px] font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-900 hover:text-white transition-all uppercase tracking-widest">User</button>
              <button onClick={() => handleLoginProcess(UserRole.PARTNER, true)} className="py-3 text-[9px] font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-900 hover:text-white transition-all uppercase tracking-widest">Partner</button>
              <button onClick={() => handleLoginProcess(UserRole.ADMIN, true)} className="py-3 text-[9px] font-bold bg-slate-900 text-white rounded-xl hover:bg-sky-500 transition-all uppercase tracking-widest flex items-center justify-center gap-1">
                <Terminal className="w-3 h-3" /> Admin
              </button>
            </div>
            <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Staff Portal is isolated for security.</p>
          </div>
        </div>

        <p className="text-center mt-10 text-slate-600">
          Don't have an account? <Link to="/signup" className="text-blue-900 font-bold hover:text-sky-600 transition-colors">Join Now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
