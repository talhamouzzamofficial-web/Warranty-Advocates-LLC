
import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  Menu,
  MoreVertical,
  User as UserIcon,
  Camera,
  Globe,
  Hash,
  Smartphone as PhoneIcon,
  Save,
  Check,
  Briefcase,
  ExternalLink,
  Edit2,
  PhoneCall,
  Home as HomeIcon,
  ShieldAlert,
  History,
  Banknote
} from 'lucide-react';
import { UserProfile, UserRole, ClaimStatus } from '../../types';

interface PartnerDashboardProps {
  user: UserProfile;
  onUpdateProfile?: (updatedProfile: Partial<UserProfile>) => void;
}

interface CustomerDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

interface RegionalCustomer {
  id: string;
  partnerId: string;
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

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ user, onUpdateProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [activeTab, setActiveTab] = useState<'Directory' | 'Claims' | 'Earnings' | 'Profile'>(() => {
    if (path.includes('/rewards')) return 'Earnings';
    if (path.includes('/claims')) return 'Claims';
    if (path.includes('/profile')) return 'Profile';
    return 'Directory';
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<RegionalCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Profile Management State
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    postcode: user.postcode || '',
    state: user.state || ''
  });
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  const [customers, setCustomers] = useState<RegionalCustomer[]>(() => {
    const saved = localStorage.getItem(`wa_partner_customers_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`wa_partner_customers_${user.id}`, JSON.stringify(customers));
  }, [customers, user.id]);

  useEffect(() => {
    if (path.includes('/rewards')) setActiveTab('Earnings');
    else if (path.includes('/claims')) setActiveTab('Claims');
    else if (path.includes('/profile')) setActiveTab('Profile');
    else setActiveTab('Directory');
  }, [path]);

  useEffect(() => {
    setProfileForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      postcode: user.postcode || '',
      state: user.state || ''
    });
  }, [user]);

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newCustomer: RegionalCustomer = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      partnerId: user.id,
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
    await new Promise(resolve => setTimeout(resolve, 800));
    setCustomers([newCustomer, ...customers]);
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  const handleUpdateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCustomer) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const updatedCustomer: RegionalCustomer = {
      ...editingCustomer,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      plan: formData.get('plan') as any,
      claimType: formData.get('claimType') as any,
    };

    await new Promise(resolve => setTimeout(resolve, 800));
    setCustomers(customers.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
    setIsSubmitting(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this customer from your regional management? This action cannot be undone.')) return;
    
    setCustomers(customers.filter(c => c.id !== id));
    setEditingCustomer(null);
  };

  const handleCopyPartnerLink = () => {
    const link = `${window.location.origin}/#/signup?partner=${user.referralCode || user.id.substring(0, 6)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayoutRequest = async () => {
    setIsRequestingPayout(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRequestingPayout(false);
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 5000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveSuccess(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onUpdateProfile?.(profileForm);
    setIsSavingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile?.({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const directoryStats = [
    { label: 'TOTAL CUSTOMERS', value: customers.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'PREMIUM USERS', value: customers.filter(c => c.plan === 'PREMIUM').length, icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-50' },
    { label: 'REGIONAL REVENUE', value: `$${(customers.reduce((acc, curr) => acc + (curr.plan === 'PREMIUM' ? 499 : curr.plan === 'BASIC' ? 49.99 : 0), 0)).toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'CUSTOMER DOCS', value: customers.reduce((acc, curr) => acc + curr.documents.length, 0), icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const claimsStats = [
    { label: 'REGIONAL CLAIMS', value: customers.length, icon: ClipboardCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'PENDING AUDIT', value: customers.filter(c => c.status === 'Pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'ACTIVE ADVOCACY', value: customers.filter(c => c.status === 'Active').length, icon: ShieldAlert, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'SUCCESS RATE', value: customers.length > 0 ? '94%' : '0%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const renderProfile = () => (
    <div className="space-y-8 animate-fade-in pb-20 max-w-6xl mx-auto px-4 md:px-0">
      <div className="text-left mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] brand-font mb-2">Regional Partner Profile</h2>
        <p className="text-slate-500 text-base md:text-lg font-medium">Manage your professional credentials and headquarters information.</p>
      </div>

      <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="bg-[#1e3a8a] h-24 md:h-48 w-full relative">
          <div className="absolute top-4 right-8 text-white/10 font-black text-3xl md:text-7xl select-none tracking-tighter">HQ PARTNER</div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>
        </div>

        <div className="relative px-6 lg:px-16 -mt-12 md:-mt-20 pb-16">
          <form onSubmit={handleProfileSubmit}>
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 md:gap-8 mb-16">
              <div className="relative group">
                <div className="w-28 h-28 md:w-48 md:h-48 rounded-[24px] md:rounded-[32px] border-[6px] md:border-[8px] border-white bg-[#f8fafc] overflow-hidden shadow-2xl flex items-center justify-center text-slate-200 transition-transform group-hover:scale-[1.02]">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 md:w-24 md:h-24" />
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => profileImageInputRef.current?.click()}
                  className="absolute bottom-[-10px] right-[-10px] w-10 h-10 md:w-12 md:h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-sky-400 transition-all border-4 border-white active:scale-90"
                  title="Upload New Photo"
                >
                  <Camera className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <input type="file" ref={profileImageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <div className="flex-grow pb-4 text-center lg:text-left">
                 <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-none">{user.fullName}</h3>
                 <p className="text-sky-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-2">Certified Regional Partner • Member since {new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 md:gap-y-12">
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-1 h-5 md:w-1.5 md:h-6 bg-blue-600 rounded-full"></div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Information</h4>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      value={profileForm.fullName} 
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white transition-all text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Partner Email (Read Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      readOnly 
                      value={profileForm.email} 
                      className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 focus:outline-none cursor-not-allowed italic text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Direct Phone</label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      value={profileForm.phone} 
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      placeholder="239-499-3100"
                      className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white transition-all text-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-1 h-5 md:w-1.5 md:h-6 bg-emerald-500 rounded-full"></div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Territory Address</h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Office Street Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      value={profileForm.address} 
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      placeholder="e.g. 500 Legacy Way"
                      className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white transition-all text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State / Region</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="text" 
                        value={profileForm.state} 
                        onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                        placeholder="Florida"
                        className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-900/5 focus:bg-white transition-all text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Zip Code</label>
                    <div className="relative group">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="text" 
                        value={profileForm.postcode} 
                        onChange={(e) => setProfileForm({...profileForm, postcode: e.target.value})}
                        placeholder="33901"
                        className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-900/5 focus:bg-white transition-all text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Data is 256-Bit Encrypted</p>
              </div>
              <div className="flex gap-4 items-center w-full sm:w-auto">
                {saveSuccess && (
                  <span className="text-emerald-600 font-bold text-sm flex items-center gap-2 animate-fade-in">
                    <Check className="w-4 h-4" /> Profile Updated
                  </span>
                )}
                <button type="submit" disabled={isSavingProfile} className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#1e3a8a] text-white rounded-2xl font-bold text-sm shadow-2xl hover:bg-blue-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                  {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSavingProfile ? 'Deploying Changes...' : 'Save HQ Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderRewardsDashboard = () => {
    const payoutProgress = Math.min((user.totalEarned || 0) / 50 * 100, 100);
    const isPayoutReady = (user.totalEarned || 0) >= 50;

    return (
      <div className="space-y-6 animate-fade-in no-scrollbar pb-10 px-4 md:px-0">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] brand-font tracking-tight">Rewards & Affiliate Dashboard</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Earn 20% commission for every successful referral.</p>
        </div>

        <button onClick={handleCopyPartnerLink} className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-[#1e3a8a] text-white hover:bg-blue-800'}`}>
          {copied ? <CheckCircle2 className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {copied ? 'Copied' : 'Copy Referral Link'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'TOTAL EARNED', value: `$${(user.totalEarned || 0).toFixed(2)}`, sub: '+0% this week', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'PENDING PAYOUT', value: `$${(user.pendingRewards || 0).toFixed(2)}`, sub: 'Payout at $50.00', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'REFERRAL SIGNUPS', value: customers.length.toString(), sub: '0 clicks today', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'COMMISSION RATE', value: '20%', sub: 'Elite Partner level', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-[300px] md:h-[360px]">
            <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Recent Referrals</h3>
              <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">View History</button>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-10 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                <Activity className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <p className="text-slate-400 font-medium text-sm">No referral activity yet. Start sharing your link!</p>
            </div>
          </div>
          <div className="bg-[#244191] rounded-[24px] p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between h-[300px] md:h-[360px] shadow-2xl">
            <div className="absolute top-1/2 right-[-15%] -translate-y-1/2 opacity-[0.08] pointer-events-none">
              <Gift className="w-56 h-56 lg:w-72 lg:h-72" />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4 brand-font">Payout Progress</h3>
              <p className="text-blue-100 text-xs leading-relaxed mb-10 max-w-xs opacity-90">
                {isPayoutReady 
                  ? "Milestone complete! You are eligible for a regional commission payout." 
                  : "Reach $50.00 in earnings to unlock your first withdrawal via PayPal or Bank Transfer."}
              </p>
              
              <div className="mt-auto">
                {payoutSuccess ? (
                  <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex flex-col items-center text-center animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                    <p className="text-xs font-bold text-white">Payout Requested!</p>
                    <p className="text-[9px] text-emerald-100 mt-0.5">Verification pending (1-2 days).</p>
                  </div>
                ) : isPayoutReady ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest mb-2">
                      <span className="text-emerald-400">Available to Withdraw</span>
                      <span className="text-white">${(user.totalEarned || 0).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={handlePayoutRequest}
                      disabled={isRequestingPayout}
                      className="w-full py-4 bg-[#0ea5e9] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-sky-400 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {isRequestingPayout ? <Loader2 className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
                      {isRequestingPayout ? 'Sending...' : 'Request Pay-Out'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                      <span className="opacity-80">Progress</span>
                      <span>${(user.totalEarned || 0).toFixed(2)} / $50.00</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-[#38bdf8] transition-all duration-1000" style={{ width: `${payoutProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative z-10 pt-8 mt-auto">
              <p className="text-[10px] text-blue-300 font-medium italic opacity-70">Earnings are verified 30 days after signup.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClaimsView = () => (
    <div className="space-y-6 animate-fade-in no-scrollbar pb-10">
      {/* Claims Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {claimsStats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-3 md:gap-4">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{stat.label}</p>
              <p className="text-base md:text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Claims Queue Content */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Regional Advocacy Queue</h2>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search case ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          {customers.length > 0 ? (
            <>
              {/* Desktop Claims Table */}
              <div className="hidden md:block overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/30">
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID & Customer</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Type</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Advocacy Status</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">#{customer.id.substring(0,3)}</div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Case Reference: {customer.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            {customer.claimType === 'HOME' ? <HomeIcon className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                            {customer.claimType} ADVOCACY
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                             customer.plan === 'PREMIUM' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                           }`}>
                             {customer.plan === 'PREMIUM' ? 'HIGH' : 'MEDIUM'}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`flex items-center gap-1.5 text-[10px] font-bold ${customer.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${customer.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                            {customer.status === 'Active' ? 'Processing' : 'Under Review'}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => setEditingCustomer(customer)} className="text-[#1e3a8a] font-bold text-xs hover:underline flex items-center gap-1.5 justify-end w-full">
                            <FileSearch className="w-3.5 h-3.5" /> Full Audit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Claims List */}
              <div className="md:hidden divide-y divide-slate-50">
                {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((customer) => (
                  <div key={customer.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            {customer.claimType === 'HOME' ? <HomeIcon className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-900 text-sm">{customer.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Case: {customer.id}</p>
                         </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {customer.status === 'Active' ? 'Processing' : 'Awaiting Audit'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 p-3 rounded-xl">
                       <span>Priority: <span className={customer.plan === 'PREMIUM' ? 'text-red-500' : 'text-amber-500'}>{customer.plan === 'PREMIUM' ? 'HIGH' : 'MEDIUM'}</span></span>
                       <button onClick={() => setEditingCustomer(customer)} className="text-blue-600 flex items-center gap-1">Audit Log <ChevronRight className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                <ClipboardCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">No Regional Claims</h3>
              <p className="text-sm text-slate-400 max-w-sm font-medium">There are no active advocacy cases for your directory customers yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDirectoryView = () => (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {directoryStats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-3 md:gap-4">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{stat.label}</p>
              <p className="text-base md:text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-sm font-bold text-slate-900">Territory Customers</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none" 
              />
            </div>
            <button className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-all"><Filter className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          {customers.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/30">
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                            <p className="text-[11px] text-slate-400">{customer.email}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${customer.plan === 'PREMIUM' ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-600'}`}>
                            {customer.plan}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-xs font-bold text-slate-500">{customer.phone}</td>
                        <td className="px-10 py-6">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => setEditingCustomer(customer)} className="text-[#1e3a8a] font-bold text-xs hover:underline flex items-center gap-1.5 justify-end w-full">
                            <Edit2 className="w-3.5 h-3.5" /> View/Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-slate-50">
                {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((customer) => (
                  <div key={customer.id} className="p-6 space-y-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{customer.name}</h3>
                        <p className="text-xs text-slate-400">{customer.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${customer.plan === 'PREMIUM' ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-600'}`}>{customer.plan}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone & Territory</p>
                        <div className="flex items-center gap-4">
                          <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a]"><PhoneCall className="w-3 h-3" /> {customer.phone}</a>
                          <span className="text-[10px] text-slate-300">•</span>
                          <p className="text-xs text-slate-500 font-medium">{customer.address.split(',')[0]}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        {customer.status}
                      </span>
                    </div>
                    <button onClick={() => setEditingCustomer(customer)} className="w-full py-3 bg-[#f8fafc] border border-slate-100 rounded-xl text-[#1e3a8a] font-bold text-xs flex items-center justify-center gap-2 active:bg-blue-50 transition-all">
                      <Edit2 className="w-3.5 h-3.5" /> Manage Customer
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200"><Database className="w-10 h-10" /></div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">No Customers Registered</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-8 font-medium">You haven't registered any customers in your territory yet.</p>
              <button onClick={() => setShowAddModal(true)} className="text-[#1e3a8a] font-bold text-xs flex items-center gap-2 hover:underline transition-all"><UserPlus className="w-4 h-4" /> Add your first customer</button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 max-w-[1600px] mx-auto animate-fade-in no-scrollbar overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        {activeTab !== 'Earnings' && activeTab !== 'Profile' && (
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] brand-font tracking-tight">Regional Management</h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium tracking-tight">Managing {user.fullName}'s customers and territory insights.</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-white border border-slate-100 p-1 rounded-2xl shadow-sm w-full sm:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'Directory', label: 'Directory', path: '/dashboard/customers' },
              { id: 'Claims', label: 'Claims', path: '/dashboard/claims' },
              { id: 'Earnings', label: 'Earnings', path: '/dashboard/rewards' },
              { id: 'Profile', label: 'Profile', path: '/dashboard/profile' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  navigate(tab.path);
                }}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#f1f5f9] text-[#1e3a8a] shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {activeTab === 'Directory' && (
            <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-white w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-xs shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-95">
              <UserPlus className="w-4 h-4" /> Register Customer
            </button>
          )}
        </div>
      </div>

      {activeTab === 'Earnings' ? (
        renderRewardsDashboard()
      ) : activeTab === 'Profile' ? (
        renderProfile()
      ) : activeTab === 'Claims' ? (
        renderClaimsView()
      ) : (
        renderDirectoryView()
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8 lg:p-10 relative overflow-y-auto max-h-[95vh] no-scrollbar">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"><X className="w-6 h-6" /></button>
            <div className="text-center mb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-900/5"><UserPlus className="w-7 h-7 md:w-8 md:h-8" /></div>
              <h3 className="text-xl font-bold text-slate-900 brand-font">Register Customer</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Initialize a new regional client account.</p>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
                <input name="name" type="text" required placeholder="John Smith" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
                  <input name="email" type="email" required placeholder="john@example.com" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold text-slate-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone</label>
                  <input name="phone" type="tel" required placeholder="239-000-0000" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Advocacy Tier</label>
                  <select name="plan" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-700">
                    <option value="FREE">Free Tier</option>
                    <option value="BASIC">Basic ($20 Share)</option>
                    <option value="PREMIUM">Premium ($100 Share)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Asset Focus</label>
                  <select name="claimType" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-700">
                    <option value="HOME">Home Warranty</option>
                    <option value="AUTO">Auto Warranty</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5 pb-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Territory Address</label>
                <input name="address" type="text" required placeholder="Fort Myers, FL" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-900" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#1e3a8a] text-white rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl p-6 md:p-12 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setEditingCustomer(null)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"><X className="w-6 h-6" /></button>
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-[#1e3a8a] rounded-3xl flex items-center justify-center shadow-lg shrink-0"><UserIcon className="w-8 h-8 md:w-10 md:h-10" /></div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 brand-font">Manage Regional Customer</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Customer ID: <span className="text-[#1e3a8a] font-bold tracking-tight">{editingCustomer.id}</span> • Registered on {editingCustomer.registrationDate}</p>
              </div>
            </div>
            <form onSubmit={handleUpdateCustomer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" />
                    <input name="name" type="text" defaultValue={editingCustomer.name} required className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-sm font-bold text-slate-900" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" />
                    <input name="email" type="email" defaultValue={editingCustomer.email} required className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-sm font-bold text-slate-900" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" />
                    <input name="phone" type="tel" defaultValue={editingCustomer.phone} required className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-sm font-bold text-slate-900" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Customer Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" />
                    <input name="address" type="text" defaultValue={editingCustomer.address} required className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-sm font-bold text-slate-900" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Advocacy Plan</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" />
                    <select name="plan" defaultValue={editingCustomer.plan} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-sm font-bold text-slate-700 appearance-none">
                      <option value="FREE">Free Tier</option>
                      <option value="BASIC">Basic Advocacy</option>
                      <option value="PREMIUM">Premium Advocacy</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Primary Asset</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1e3a8a] transition-colors" />
                    <select name="claimType" defaultValue={editingCustomer.claimType} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-sm font-bold text-slate-700 appearance-none">
                      <option value="HOME">Home Warranty</option>
                      <option value="AUTO">Auto Warranty</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <button type="button" onClick={() => handleDeleteCustomer(editingCustomer.id)} className="w-full md:w-auto px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-2 order-2 md:order-1"><Trash2 className="w-4 h-4" /> Remove Customer</button>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto order-1 md:order-2">
                  <button type="button" onClick={() => setEditingCustomer(null)} className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-12 py-4 bg-[#1e3a8a] text-white rounded-2xl font-bold text-xs hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSubmitting ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed non-existent lucide icon import: replaced with FileSearch which is commonly available or added manually
const FileSearch = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="m16 17-2.45-2.45"/></svg>
);

export default PartnerDashboard;
