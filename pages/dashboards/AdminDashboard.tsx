
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Users, 
  Map, 
  ClipboardCheck, 
  CreditCard, 
  Settings, 
  TrendingUp, 
  ArrowUpRight, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  ShieldAlert,
  Zap,
  DollarSign,
  PieChart,
  Target,
  Globe,
  Plus,
  Filter,
  Download,
  Activity,
  UserCheck,
  Building,
  ArrowLeft,
  X,
  Save,
  ChevronRight,
  ShieldCheck,
  History,
  TrendingDown,
  Hammer,
  Car,
  Home,
  // Fix: Added missing Mail and MapPin imports
  Mail,
  MapPin
} from 'lucide-react';
import { UserProfile, ClaimStatus, UserRole, Claim, ClaimType } from '../../types';

interface AdminDashboardProps {
  user: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const location = useLocation();
  const path = location.pathname;

  // Global Registry State
  const [globalClaims, setGlobalClaims] = useState<any[]>([]);
  const [globalCustomers, setGlobalCustomers] = useState<any[]>([]);
  const [globalUsers, setGlobalUsers] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // UI State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTerritoryModal, setShowTerritoryModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  // Sync Data on Load
  useEffect(() => {
    const claims = JSON.parse(localStorage.getItem('wa_global_claims') || '[]');
    const customers = JSON.parse(localStorage.getItem('wa_global_customers') || '[]');
    const users = JSON.parse(localStorage.getItem('wa_registered_users') || '[]');
    const logs = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    
    setGlobalClaims(claims);
    setGlobalCustomers(customers);
    setGlobalUsers(users);
    setActivities(logs);
  }, [showStatusModal]); // Refresh on close modal

  // Calculate Real-time MRR
  const calculateMRR = () => {
    let mrr = 0;
    // Users direct
    globalUsers.forEach(u => {
      if (u.plan === 'PREMIUM') mrr += 41.58; // 499 / 12 approx
      else if (u.plan === 'FREE') mrr += 0;
      else mrr += 49.99; // Basic
    });
    // Customers via partners
    globalCustomers.forEach(c => {
      if (c.plan === 'PREMIUM') mrr += 41.58;
      else if (c.plan === 'BASIC') mrr += 49.99;
    });
    return mrr.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  const stats = [
    { label: 'Real-time MRR', value: `$${calculateMRR()}`, change: '+5.4%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Users', value: globalUsers.length + globalCustomers.length, change: `+${globalUsers.length}`, icon: UserCheck, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Active Claims', value: globalClaims.filter(c => c.status !== ClaimStatus.APPROVED).length, change: globalClaims.length > 0 ? 'Active' : 'Empty', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Territory Leads', value: globalCustomers.length, change: 'Partner Led', icon: Building, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  const handleOpenStatus = (claim: any) => {
    setSelectedClaim(claim);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    const allGlobal = JSON.parse(localStorage.getItem('wa_global_claims') || '[]');
    const updated = allGlobal.map((c: any) => c.id === selectedClaim.id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c);
    localStorage.setItem('wa_global_claims', JSON.stringify(updated));
    
    // Log Activity
    const logs = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    logs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: 'ADMIN',
      userName: 'Head Office',
      action: 'CLAIM_STATUS_CHANGE',
      detail: `Updated Claim ${selectedClaim.id} status to ${newStatus}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(logs.slice(0, 50)));
    
    setShowStatusModal(false);
  };

  const renderOverview = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
              <stat.icon className="w-32 h-32" />
            </div>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <span className={`text-[10px] font-bold flex items-center mb-1.5 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                {stat.change} {stat.change.includes('%') && <ArrowUpRight className="w-3 h-3" />}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 rounded-[48px] border border-white/5 overflow-hidden">
            <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Platform Advocacy Queue</h3>
              <button onClick={() => window.location.hash = '#/admin-portal/claims'} className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1">Manage All <ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="divide-y divide-white/5">
              {globalClaims.length > 0 ? globalClaims.slice(0, 5).map((claim) => (
                <div key={claim.id} onClick={() => handleOpenStatus(claim)} className="p-8 hover:bg-white/[0.04] transition-colors flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      claim.priority === 'HIGH' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {claim.type === 'HOME' ? <Home className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-sky-400 transition-colors">{claim.userName || 'Anonymous User'}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{claim.id} • {claim.title}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        claim.status === ClaimStatus.PENDING ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {claim.status}
                      </span>
                      <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{new Date(claim.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center text-slate-500 font-bold italic">No active claims found.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/30 p-10 rounded-[48px] border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Live Activity Pulse</h3>
            <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
          <div className="space-y-6 flex-grow overflow-y-auto no-scrollbar max-h-[500px]">
            {activities.length > 0 ? activities.map((s, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                <div className="shrink-0 mt-1">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">{s.userName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{s.detail}</p>
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter mt-1.5">{new Date(s.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-600 italic text-sm">Waiting for platform events...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white brand-font">Global Claim Registry</h3>
          <p className="text-slate-500 text-sm">Managing {globalClaims.length} active advocacy requests across all territories.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Export Audit Log
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 rounded-[32px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Case ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Member</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {globalClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 text-sm font-bold text-sky-400 tracking-tighter">#{claim.id}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">{claim.userName?.charAt(0) || 'U'}</div>
                    <span className="text-sm font-bold text-white">{claim.userName || 'Anonymous'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    {claim.type === 'HOME' ? <Home className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                    {claim.type}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    claim.priority === 'HIGH' ? 'text-red-500' : claim.priority === 'MEDIUM' ? 'text-amber-500' : 'text-slate-500'
                  }`}>
                    {claim.priority}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    claim.status === ClaimStatus.PENDING ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                   <button 
                    onClick={() => handleOpenStatus(claim)}
                    className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                   >
                     Update Status
                   </button>
                </td>
              </tr>
            ))}
            {globalClaims.length === 0 && (
              <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-600 italic">Queue is clear. No active claims registered.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (path) {
      case '/admin-portal/claims': return renderClaims();
      case '/admin-portal/users': return (
        <div className="space-y-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-white brand-font">User Directory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalUsers.map((u, i) => (
              <div key={i} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 hover:border-sky-500/40 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">{u.fullName.charAt(0)}</div>
                   <div>
                     <p className="font-bold text-white">{u.fullName}</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{u.role}</p>
                   </div>
                </div>
                <div className="space-y-2 mb-6">
                   <p className="text-xs text-slate-400 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-600" /> {u.email}</p>
                   <p className="text-xs text-slate-400 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-600" /> {u.state || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.plan === 'PREMIUM' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                     {u.plan || 'FREE'}
                   </span>
                   <button className="text-[10px] font-bold text-sky-400 uppercase tracking-widest hover:underline">View Logs</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case '/admin-portal/revenue': return (
        <div className="space-y-10 animate-fade-in">
          <div className="bg-slate-900/40 p-10 rounded-[48px] border border-white/5">
            <div className="flex flex-col md:flex-row gap-12 items-center mb-10">
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aggregated MRR</h4>
                <p className="text-6xl font-black text-white">${calculateMRR()}</p>
                <p className="text-xs font-medium text-emerald-500 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> 100% Platform Visibility
                </p>
              </div>
              <div className="flex-grow grid grid-cols-2 gap-6">
                 <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Member Subscriptions</p>
                    <p className="text-2xl font-bold text-white">{globalUsers.filter(u => u.plan !== 'FREE').length}</p>
                 </div>
                 <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Partner Enrollments</p>
                    <p className="text-2xl font-bold text-white">{globalCustomers.length}</p>
                 </div>
              </div>
            </div>
            <div className="h-64 w-full bg-slate-950 rounded-3xl border border-dashed border-white/10 flex items-center justify-center text-slate-600 font-bold italic relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
               <div className="relative z-10 flex flex-col items-center gap-4">
                  <TrendingUp className="w-12 h-12 text-emerald-500/50" />
                  <span>Financial Projection Engine Active</span>
               </div>
            </div>
          </div>
        </div>
      );
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}

      {/* Claim Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[48px] shadow-2xl p-12 relative">
             <button onClick={() => setShowStatusModal(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
             <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6"><ClipboardCheck className="w-8 h-8" /></div>
                <h3 className="text-3xl font-bold text-white brand-font mb-2">Update Workflow</h3>
                <p className="text-slate-500 text-sm">Managing Case: <span className="text-sky-400 font-bold">{selectedClaim?.id}</span></p>
             </div>
             <div className="space-y-4">
                {[ClaimStatus.PENDING, ClaimStatus.PROCESSING, ClaimStatus.APPROVED, ClaimStatus.REJECTED].map((status) => (
                  <button 
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className="w-full p-6 text-left rounded-3xl border-2 border-white/5 bg-white/5 hover:border-blue-500 transition-all flex justify-between items-center group"
                  >
                    <span className="font-bold text-white">{status}</span>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
             </div>
             <p className="text-center text-[10px] text-slate-600 uppercase font-black mt-10 tracking-widest">Audit logged via Head Office</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
