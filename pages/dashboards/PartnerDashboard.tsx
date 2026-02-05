
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  ClipboardCheck, 
  Plus, 
  Car,
  ChevronRight, 
  UserPlus, 
  TrendingUp,
  Search,
  Filter,
  BarChart3,
  Database,
  X,
  Mail,
  Smartphone,
  ShieldCheck,
  Upload,
  FileText,
  Loader2,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Copy,
  Share2,
  Gift,
  Clock,
  Activity,
  CreditCard,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { UserProfile, UserRole, ClaimStatus } from '../../types';

interface PartnerDashboardProps {
  user: UserProfile;
}

interface CustomerDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

interface TerritoryCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM';
  claimType: 'HOME' | 'AUTO';
  status: 'Active' | 'Pending';
  registrationDate: string;
  documents: CustomerDocument[];
}

interface CommissionRecord {
  id: string;
  customerName: string;
  plan: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING';
}

interface TerritoryClaim {
  id: string;
  customerName: string;
  type: 'HOME' | 'AUTO';
  status: ClaimStatus;
  date: string;
  description: string;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'CUSTOMERS' | 'REWARDS' | 'CLAIMS'>(() => {
    if (location.pathname === '/dashboard/claims') return 'CLAIMS';
    if (location.pathname === '/dashboard/customers') return 'CUSTOMERS';
    return 'CUSTOMERS';
  });

  useEffect(() => {
    if (location.pathname === '/dashboard/claims') setActiveTab('CLAIMS');
    else if (location.pathname === '/dashboard/customers') setActiveTab('CUSTOMERS');
  }, [location.pathname]);
  
  // Persistence for demo purposes
  const [customers, setCustomers] = useState<TerritoryCustomer[]>(() => {
    const saved = localStorage.getItem(`wa_partner_customers_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<TerritoryCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock Claims for territory
  const territoryClaims: TerritoryClaim[] = customers.length > 0 ? ([
    { id: 'CLM-001', customerName: customers[0].name, type: customers[0].claimType, status: ClaimStatus.PROCESSING, date: '2025-05-15', description: 'Initial advocacy request.' },
    { id: 'CLM-002', customerName: customers[0].name, type: customers[0].claimType === 'HOME' ? 'AUTO' : 'HOME', status: ClaimStatus.PENDING, date: '2025-05-18', description: 'Secondary inquiry.' }
  ] as TerritoryClaim[]).filter((_, i) => i < customers.length) : [];

  // Mock Commission Data
  const commissions: CommissionRecord[] = customers
    .filter(c => c.plan !== 'FREE')
    .map((c, i) => ({
      id: `COM-${c.id.substring(0, 4)}-${i}`,
      customerName: c.name,
      plan: c.plan,
      amount: c.plan === 'PREMIUM' ? 100 : 20,
      date: c.registrationDate,
      status: i % 3 === 0 ? 'PENDING' : 'PAID'
    }));

  useEffect(() => {
    localStorage.setItem(`wa_partner_customers_${user.id}`, JSON.stringify(customers));
  }, [customers, user.id]);

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newCustomer: TerritoryCustomer = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      plan: formData.get('plan') as any,
      claimType: formData.get('claimType') as any,
      status: 'Active',
      registrationDate: new Date().toISOString().split('T')[0],
      documents: []
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCustomers(prev => [newCustomer, ...prev]);
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  const handleUploadDoc = (customerId: string, file: File) => {
    const newDoc: CustomerDocument = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    };
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, documents: [...c.documents, newDoc] } : c));
    if (selectedCustomer?.id === customerId) setSelectedCustomer(prev => prev ? { ...prev, documents: [...prev.documents, newDoc] } : null);
  };

  const handleCopyPartnerLink = () => {
    const link = `${window.location.origin}/#/signup?partner=${user.referralCode || user.id.substring(0, 6)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEarnings = commissions.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingEarnings = commissions.filter(c => c.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

  const renderClaimsView = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Territory Advocacy Requests</h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Global Sync Active</span>
          </div>
        </div>
        {territoryClaims.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {territoryClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-blue-900">{claim.id}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{claim.customerName}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                        {claim.type === 'HOME' ? <HomeIcon className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                        {claim.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        claim.status === ClaimStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 
                        claim.status === ClaimStatus.PROCESSING ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase">{claim.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <ClipboardCheck className="w-10 h-10" />
            </div>
            <p className="text-slate-500 font-bold">No active claims in your territory.</p>
            <p className="text-xs text-slate-400 mt-2">When your customers submit claims for advocacy, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRewardsView = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 lg:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Gift className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
              <TrendingUp className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold brand-font">Partner Earning Portal</h3>
          </div>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            As a territory partner, you earn a <span className="font-bold text-white underline underline-offset-4 decoration-sky-400">20% lifetime commission</span> on all subscriptions registered under your territory link.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative group">
              <input 
                type="text" 
                readOnly 
                value={`${window.location.origin}/#/signup?partner=${user.referralCode || user.id.substring(0, 6)}`}
                className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 pl-6 pr-24 text-sm font-medium focus:outline-none"
              />
              <button 
                onClick={handleCopyPartnerLink}
                className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20'
                }`}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Lifetime Commissions', value: `$${totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Pending Payout', value: `$${pendingEarnings.toFixed(2)}`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Current Conversion', value: customers.length > 0 ? `${((commissions.length / customers.length) * 100).toFixed(1)}%` : '0%', icon: PieChart, color: 'text-sky-400', bg: 'bg-sky-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Commission History</h3>
          <button className="text-sm font-bold text-blue-900 flex items-center gap-2 hover:underline">
            <CreditCard className="w-4 h-4" /> Request Payout
          </button>
        </div>
        {commissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Plan</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{comm.id}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{comm.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{comm.date}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        comm.plan === 'PREMIUM' ? 'bg-sky-100 text-sky-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {comm.plan}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-900">${comm.amount.toFixed(2)}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        comm.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {comm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Activity className="w-10 h-10" />
            </div>
            <p className="text-slate-500 font-bold">No commission records found yet.</p>
            <p className="text-xs text-slate-400 mt-2">Earnings will appear here as your customers upgrade to advocacy plans.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 brand-font">Territory Management</h2>
          <p className="text-slate-500">Managing {user.fullName}'s customers and territory insights.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => { setActiveTab('CUSTOMERS'); navigate('/dashboard/customers'); }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'CUSTOMERS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Directory
            </button>
            <button 
              onClick={() => { setActiveTab('CLAIMS'); navigate('/dashboard/claims'); }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'CLAIMS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Claims
            </button>
            <button 
              onClick={() => { setActiveTab('REWARDS'); navigate('/dashboard/rewards'); }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'REWARDS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Earnings
            </button>
          </div>
          {activeTab === 'CUSTOMERS' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 active:scale-95"
            >
              <UserPlus className="w-5 h-5" /> Register Customer
            </button>
          )}
        </div>
      </div>

      {activeTab === 'REWARDS' && renderRewardsView()}
      {activeTab === 'CLAIMS' && renderClaimsView()}
      {activeTab === 'CUSTOMERS' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Premium Users', value: customers.filter(c => c.plan === 'PREMIUM').length, icon: ShieldCheck, color: 'text-sky-600', bg: 'bg-sky-50' },
              { label: 'Territory Revenue', value: `$${(customers.reduce((acc, curr) => acc + (curr.plan === 'PREMIUM' ? 49.99 : curr.plan === 'BASIC' ? 19.99 : 0), 0)).toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Customer Docs', value: customers.reduce((acc, curr) => acc + curr.documents.length, 0), icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-bold text-slate-900">Your Customers</h3>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all" />
                </div>
                <button className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"><Filter className="w-5 h-5 text-slate-600" /></button>
              </div>
            </div>
            {filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Type</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Docs</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">{customer.name}</p>
                            <p className="text-xs text-slate-500">{customer.email}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${customer.plan === 'PREMIUM' ? 'bg-sky-100 text-sky-700' : customer.plan === 'BASIC' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {customer.plan}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5">
                            {customer.claimType === 'HOME' ? <HomeIcon className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                            {customer.claimType}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600"><FileText className="w-3.5 h-3.5" /> {customer.documents.length}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => setSelectedCustomer(customer)} className="p-2 hover:bg-white rounded-lg transition-colors text-blue-900 font-bold text-xs flex items-center gap-1 ml-auto">Details <ChevronRight className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><Database className="w-10 h-10" /></div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{searchTerm ? 'No results found' : 'No Customers Registered'}</h4>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">{searchTerm ? 'Try adjusting your search filters.' : "You haven't registered any customers in your territory yet."}</p>
                {!searchTerm && <button onClick={() => setShowAddModal(true)} className="text-blue-900 font-bold hover:underline flex items-center gap-2 mx-auto"><UserPlus className="w-4 h-4" /> Add your first customer</button>}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 brand-font">Register Customer</h3>
              <p className="text-slate-500">Initialize a new client in your territory.</p>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input name="name" type="text" required placeholder="John Smith" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input name="email" type="email" required placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                  <input name="phone" type="tel" required placeholder="239-000-0000" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Plan Level</label>
                  <select name="plan" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-700">
                    <option value="FREE">Free Tier</option>
                    <option value="BASIC">Basic ($20 Share)</option>
                    <option value="PREMIUM">Premium ($100 Share)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Claim Type</label>
                  <select name="claimType" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-700">
                    <option value="HOME">Home Warranty</option>
                    <option value="AUTO">Auto Warranty</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Home Address</label>
                <input name="address" type="text" required placeholder="Fort Myers, FL" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm" />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Initialize Account</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden my-8 relative">
            <div className="bg-blue-900 p-8 lg:p-12 text-white flex justify-between items-start">
              <div>
                <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-white transition-colors mb-6 group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Directory</button>
                <h3 className="text-3xl font-bold brand-font mb-2">{selectedCustomer.name}</h3>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-blue-100 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-sky-400" /> {selectedCustomer.email}</span>
                  <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-sky-400" /> {selectedCustomer.phone}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase border border-white/20 ${selectedCustomer.plan === 'PREMIUM' ? 'bg-sky-500 text-white' : 'bg-white/10 text-white'}`}>
                  {selectedCustomer.plan} Plan
                </span>
                <span className="text-[10px] font-bold text-sky-300 uppercase tracking-[0.2em]">{selectedCustomer.claimType} FOCUS</span>
              </div>
            </div>
            <div className="p-8 lg:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Customer Document Vault</h4>
                  <div className="space-y-4">
                    {selectedCustomer.documents.length > 0 ? selectedCustomer.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-900 group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{doc.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <button className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    )) : (
                      <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center"><FileText className="w-10 h-10 text-slate-200 mx-auto mb-4" /><p className="text-sm font-bold text-slate-400">No documents uploaded yet.</p></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="p-8 bg-slate-950 rounded-[32px] text-white">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Upload Files</h4>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-sky-500 hover:bg-white/5 transition-all cursor-pointer group" onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleUploadDoc(selectedCustomer.id, file); }; input.click(); }}>
                    <Upload className="w-8 h-8 text-slate-600 group-hover:text-sky-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Contract</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

export default PartnerDashboard;
