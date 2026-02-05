
import React, { useState } from 'react';
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
  ShieldCheck as ShieldIcon,
  Save,
  ChevronRight
} from 'lucide-react';
import { UserProfile, ClaimStatus, UserRole } from '../../types';

interface AdminDashboardProps {
  user: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const location = useLocation();
  const path = location.pathname;

  // UI State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTerritoryModal, setShowTerritoryModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  // Mock Global Data
  const stats = [
    { label: 'Total MRR', value: '$45,820', change: '+12.5%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Subscriptions', value: '1,284', change: '+8.2%', icon: UserCheck, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Claim Resolution', value: '94.2%', change: '+1.4%', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Global Partners', value: '12', change: 'Stable', icon: Building, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  const handleOpenStatus = (claim: any) => {
    setSelectedClaim(claim);
    setShowStatusModal(true);
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
                {stat.change} {stat.change !== 'Stable' && <ArrowUpRight className="w-3 h-3" />}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 rounded-[48px] border border-white/5 overflow-hidden">
            <div className="p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Priority Advocacy Queue</h3>
              <button onClick={() => window.location.hash = '#/admin-portal/claims'} className="text-xs font-bold text-sky-400 hover:underline">View All Claims</button>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { id: 'CLM-HQ-881', user: 'Robert California', type: 'Home', amount: '$4,250', date: 'Just now', status: 'Priority' },
                { id: 'CLM-HQ-882', user: 'Creed Bratton', type: 'Auto', amount: '$2,100', date: '5h ago', status: 'Normal' },
                { id: 'CLM-HQ-883', user: 'Stanley Hudson', type: 'Home', amount: '$120', date: '1d ago', status: 'Flagged' },
              ].map((claim) => (
                <div key={claim.id} onClick={() => handleOpenStatus(claim)} className="p-8 hover:bg-white/[0.04] transition-colors flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${claim.status === 'Priority' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-sky-400 transition-colors">{claim.user}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{claim.id} • {claim.type}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="text-white font-bold">{claim.amount}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{claim.date}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-slate-900/30 p-10 rounded-[48px] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-8">System Pulse</h3>
          <div className="space-y-6">
            {[
              { label: 'Advocate AI Sync', status: 'Optimal', active: true },
              { label: 'Database Replication', status: 'Synchronized', active: true },
              { label: 'Partner API Keys', status: 'Valid', active: true },
              { label: 'Revenue Engine', status: 'Processing', active: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <span className="text-sm font-medium text-slate-400">{s.label}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white brand-font">Claim Management</h3>
          <p className="text-slate-500 text-sm">Reviewing 42 active disputes across all territories.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 rounded-[32px] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 text-sm font-bold text-sky-400 tracking-tighter">#CLM-44{i}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">U</div>
                    <span className="text-sm font-bold text-white">Platform User {i}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-400">{i % 2 === 0 ? 'Home Warranty' : 'Auto Advocacy'}</td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/20">Pending Staff Review</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <button 
                    onClick={() => handleOpenStatus({ id: `CLM-44${i}`, user: `User ${i}` })}
                    className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                   >
                     Update Status
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTerritories = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white brand-font">Territory Management</h3>
          <p className="text-slate-500 text-sm">Managing partner jurisdictions and geographic performance.</p>
        </div>
        <button onClick={() => setShowTerritoryModal(true)} className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs flex items-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all">
          <Map className="w-5 h-5" /> Launch New Territory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { name: 'SW Florida', code: 'US-FL-SW', partner: 'Florida Realty Group', revenue: '$18.4K', status: 'Growth' },
          { name: 'NE Texas', code: 'US-TX-NE', partner: 'Lone Star Advocacy', revenue: '$9.2K', status: 'Stable' },
          { name: 'Southern California', code: 'US-CA-SO', partner: 'Pacific Partners', revenue: '$12.1K', status: 'Growth' },
        ].map((t) => (
          <div key={t.code} className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 hover:border-sky-500/40 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-1">{t.name}</h4>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t.code}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.status === 'Growth' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{t.status}</span>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs"><span className="text-slate-500 font-medium">Primary Partner:</span> <span className="text-white font-bold">{t.partner}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500 font-medium">Monthly Rev:</span> <span className="text-white font-bold">{t.revenue}</span></div>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Adjust Coverage</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white brand-font">Revenue & Billing</h3>
          <p className="text-slate-500 text-sm">Financial health monitoring and global transaction logs.</p>
        </div>
        <button className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs flex items-center gap-3 shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all">
          <DollarSign className="w-5 h-5" /> Financial Report (PDF)
        </button>
      </div>

      <div className="bg-slate-900/40 p-10 rounded-[48px] border border-white/5">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-10">
          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Global MRR Forecast</h4>
            <p className="text-5xl font-black text-white">$45,820.00</p>
            <p className="text-xs font-medium text-emerald-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> 12.5% vs Last Month
            </p>
          </div>
          <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { label: 'Basic Sub', val: '$12.4K' },
               { label: 'Premium Sub', val: '$28.2K' },
               { label: 'Auto Fees', val: '$3.1K' },
               { label: 'Partner Rev', val: '$2.1K' }
             ].map((r, i) => (
               <div key={i} className="p-5 bg-white/5 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">{r.label}</p>
                  <p className="text-xl font-bold text-white">{r.val}</p>
               </div>
             ))}
          </div>
        </div>
        <div className="h-64 w-full bg-slate-950 rounded-3xl border border-dashed border-white/10 flex items-center justify-center text-slate-600 font-bold italic relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
           <div className="relative z-10 flex flex-col items-center gap-4">
              <Activity className="w-10 h-10 animate-pulse text-sky-400" />
              <span>Real-time Revenue Graph Initializing...</span>
           </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (path) {
      case '/admin-portal/claims': return renderClaims();
      case '/admin-portal/users': return (
        <div className="animate-fade-in text-center py-20">
          <Users className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white brand-font">User Directory</h3>
          <p className="text-slate-500">Accessing global records for 1,284 users...</p>
        </div>
      );
      case '/admin-portal/territories': return renderTerritories();
      case '/admin-portal/revenue': return renderRevenue();
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
                <h3 className="text-3xl font-bold text-white brand-font mb-2">Update Claim Status</h3>
                <p className="text-slate-500 text-sm">Managing Case: <span className="text-sky-400 font-bold">{selectedClaim?.id}</span></p>
             </div>
             <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowStatusModal(false); }}>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Workflow Status</label>
                   <select className="w-full px-6 py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/10">
                      <option>Under Staff Review</option>
                      <option>Contacting Warranty Provider</option>
                      <option>Awaiting User Documents</option>
                      <option>Dispute Active</option>
                      <option>Resolution Pending</option>
                      <option>Case Resolved - Success</option>
                      <option>Case Closed - Ineligible</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Staff Notes (Internal)</label>
                   <textarea rows={4} placeholder="Log conversation with warranty provider or internal decisions..." className="w-full px-6 py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/10 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20">
                   <Save className="w-5 h-5" /> Commit Status Update
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Launch Territory Modal */}
      {showTerritoryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[48px] shadow-2xl p-12 relative">
             <button onClick={() => setShowTerritoryModal(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
             <div className="mb-10">
                <div className="w-16 h-16 bg-emerald-600/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6"><Map className="w-8 h-8" /></div>
                <h3 className="text-3xl font-bold text-white brand-font mb-2">Launch New Territory</h3>
                <p className="text-slate-500 text-sm">Expand Warranty Advocates reach into a new region.</p>
             </div>
             <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowTerritoryModal(false); }}>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Region Name</label>
                      <input type="text" placeholder="e.g. Austin, TX" className="w-full px-6 py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/10" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Territory Code</label>
                      <input type="text" placeholder="TX-AUS-01" className="w-full px-6 py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/10" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Primary Partner</label>
                   <select className="w-full px-6 py-4 bg-slate-950 border border-white/10 rounded-2xl text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/10">
                      <option>Select Registered Partner...</option>
                      <option>Florida Realty Group</option>
                      <option>Lone Star Advocacy</option>
                      <option>Pacific Partners</option>
                   </select>
                </div>
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20">
                   <Zap className="w-5 h-5" /> Initialize Territory Coverage
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
