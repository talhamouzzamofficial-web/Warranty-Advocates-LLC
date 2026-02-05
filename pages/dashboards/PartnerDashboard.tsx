
import React from 'react';
import { 
  Users, 
  MapPin, 
  ClipboardCheck, 
  Plus, 
  ChevronRight, 
  UserPlus, 
  TrendingUp,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { UserProfile, ClaimStatus } from '../../types';

interface PartnerDashboardProps {
  user: UserProfile;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ user }) => {
  // Mock Data
  const customers = [
    { id: '1', name: 'Michael Scott', email: 'michael@dundermifflin.com', plan: 'Premium Advocacy Plan', status: 'Active', claims: 2 },
    { id: '2', name: 'Pam Beesly', email: 'pam@gmail.com', plan: 'Basic Advocacy Plan', status: 'Active', claims: 0 },
    { id: '3', name: 'Jim Halpert', email: 'jim@halpert.com', plan: 'Premium Advocacy Plan', status: 'Active', claims: 1 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 brand-font">Territory Management</h2>
          <p className="text-slate-500">Managing {user.fullName}'s customers and territory insights.</p>
        </div>
        <button className="px-6 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all flex items-center gap-3 shadow-xl shadow-blue-900/10">
          <UserPlus className="w-5 h-5" /> Register New Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: '42', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Claims', value: '8', icon: ClipboardCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Revenue Share', value: '$1,240', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Territory Rank', value: '#4', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-slate-900">Your Customers</h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Open Claims</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-sm font-medium ${customer.plan.includes('Premium') ? 'text-blue-600' : 'text-slate-600'}`}>
                      {customer.plan}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-bold text-slate-900">{customer.claims}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
