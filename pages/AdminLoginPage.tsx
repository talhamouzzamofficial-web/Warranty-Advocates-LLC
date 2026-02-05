
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Terminal } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface AdminLoginPageProps {
  onLogin: (profile: UserProfile) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real production app, this would be a secure backend check.
    // For this prototype, we use the requested credentials.
    if (email === 'admin@warrantyadvocates.com' && password === 'admin_secure_2025') {
      const adminProfile: UserProfile = {
        id: 'ADMIN_001',
        email: email,
        fullName: 'Head Office Administrator',
        role: UserRole.ADMIN,
        totalEarned: 0,
        pendingRewards: 0
      };
      onLogin(adminProfile);
      navigate('/admin-portal');
    } else {
      setError('Invalid administrative credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
            <ShieldCheck className="w-10 h-10 text-sky-400" />
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-none brand-font tracking-tight">ADMIN PORTAL</p>
              <p className="text-sky-400 text-[10px] font-bold tracking-[0.3em] uppercase">Warranty Advocates LLC</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Staff Authentication</h1>
          <p className="text-slate-400 text-sm">Secure access for the global advocacy team.</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl p-10 lg:p-12 border border-slate-100">
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Staff Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@warrantyadvocates.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all font-medium text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all font-medium text-slate-900"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold text-lg hover:bg-blue-900 transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 group mt-4"
            >
              Initialize Session <Terminal className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Internal Use Only • Encrypted Port 443</span>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Return to Public Site</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
