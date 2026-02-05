
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Upload,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileSearch,
  Zap,
  ClipboardCheck,
  Search,
  FilePlus,
  ArrowLeft,
  User as UserIcon,
  Camera,
  MapPin,
  Mail,
  Smartphone,
  Save,
  Check,
  Hash,
  Globe,
  Lock,
  X,
  Home as HomeIcon,
  Car,
  ShoppingBag,
  Gift,
  Copy,
  Share2,
  Twitter,
  ExternalLink,
  DollarSign,
  PieChart,
  Users,
  Activity,
  ArrowUpRight,
  Loader2,
  CreditCard,
  Hammer,
  AlertCircle,
  Building2,
  Trash2
} from 'lucide-react';
import { UserProfile, ClaimStatus, ClaimType, Warranty, Claim, ClaimPriority } from '../../types';
import { PRICING, COMPANY_INFO } from '../../constants';

interface UserDashboardProps {
  user: UserProfile;
  onUpdateProfile?: (updatedProfile: Partial<UserProfile>) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Derive isFreeTier from user profile plan
  const isFreeTier = user.plan !== 'PREMIUM';
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'CARD' | 'SUCCESS'>('CARD');
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');

  // State for content - Persist globally for Admin visibility
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [claims, setClaims] = useState<Claim[]>(() => {
    const globalClaims = JSON.parse(localStorage.getItem('wa_global_claims') || '[]');
    return globalClaims.filter((c: Claim) => c.userId === user.id);
  });
  
  const [isAddingWarranty, setIsAddingWarranty] = useState(false);
  const [isAddingClaim, setIsAddingClaim] = useState(false);
  
  // Referral State
  const [copied, setCopied] = useState(false);
  
  const referralCode = user.referralCode || (user.fullName.split(' ')[0].toUpperCase() + user.id.substring(0, 4));
  const referralLink = `${window.location.origin}/#/signup?ref=${referralCode}`;
  
  const referralStats = {
    totalEarned: user.totalEarned || 0,
    pendingRewards: user.pendingRewards || 0,
    activeSignups: 0,
    conversionRate: '0%',
    recentActivity: []
  };

  // Profile fields
  const [profilePic, setProfilePic] = useState<string | undefined>(user.photoUrl);
  const [fullName, setFullName] = useState(user.fullName);
  const [address, setAddress] = useState(user.address || '');
  const [postcode, setPostcode] = useState(user.postcode || '');
  const [stateName, setStateName] = useState(user.state || '');
  const [phone, setPhone] = useState(user.phone || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfilePic(user.photoUrl);
    setFullName(user.fullName);
    setAddress(user.address || '');
    setPostcode(user.postcode || '');
    setStateName(user.state || '');
    setPhone(user.phone || '');
  }, [user]);

  const stats = [
    { label: 'Active Warranties', value: warranties.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Open Claims', value: claims.filter(c => c.status !== ClaimStatus.APPROVED).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Referral Earnings', value: `$${referralStats.totalEarned.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  // Logic to handle restricted claim filing for Free users
  const handleOpenNewClaim = () => {
    if (isFreeTier && claims.length >= 1) {
      setShowUpgradeModal(true);
    } else {
      setIsAddingClaim(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveSuccess(false);
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (onUpdateProfile) {
      onUpdateProfile({
        fullName,
        photoUrl: profilePic,
        address,
        postcode,
        state: stateName,
        phone
      });
    }
    
    // Log activity for Admin
    const activities = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    activities.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: fullName,
      action: 'PROFILE_UPDATE',
      detail: 'Updated personal profile details',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(activities.slice(0, 50)));

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpgradePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    // Simulate payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    setPaymentStep('SUCCESS');
    
    // Update user profile to Premium
    if (onUpdateProfile) {
      onUpdateProfile({ plan: 'PREMIUM' });
    }

    // Log activity for Admin
    const activities = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    activities.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.fullName,
      action: 'SUBSCRIPTION_UPGRADE',
      detail: `Upgraded to PREMIUM Advocacy plan (${selectedUpgradePlan})`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(activities.slice(0, 50)));
  };

  const addClaim = (newClaim: Claim) => {
    const updatedClaims = [newClaim, ...claims];
    setClaims(updatedClaims);
    
    // Persist to global claims for Admin
    const globalClaims = JSON.parse(localStorage.getItem('wa_global_claims') || '[]');
    globalClaims.unshift({ ...newClaim, userName: user.fullName }); // Add userName for admin ease
    localStorage.setItem('wa_global_claims', JSON.stringify(globalClaims));

    // Log activity for Admin
    const activities = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    activities.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.fullName,
      action: 'NEW_CLAIM',
      detail: `Filed a ${newClaim.type} claim: ${newClaim.title}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(activities.slice(0, 50)));
  };

  const LockedPage = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
      <div className="w-24 h-24 bg-blue-50 text-blue-900 rounded-[32px] flex items-center justify-center mb-8">
        <Lock className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4 brand-font">{title} is Locked</h2>
      <p className="text-slate-500 max-w-md mx-auto text-lg mb-10">
        You are currently on the Free Tier. To manage warranties and file unlimited claims, please upgrade to our Premium Advocacy plan.
      </p>
      <button 
        onClick={() => setShowUpgradeModal(true)}
        className="px-10 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center gap-2 active:scale-95"
      >
        Upgrade to Premium <Zap className="w-5 h-5 fill-current" />
      </button>
    </div>
  );

  const renderContent = () => {
    if (path === '/dashboard/rewards') {
      return (
        <div className="space-y-8 animate-fade-in no-scrollbar">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 brand-font">Rewards & Affiliate Dashboard</h2>
              <p className="text-slate-500">Earn 20% commission for every successful referral.</p>
            </div>
            <button 
              onClick={handleCopyLink}
              className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl w-full md:w-auto justify-center active:scale-95 ${
                copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-900 text-white shadow-blue-900/10'
              }`}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {copied ? 'Link Copied!' : 'Copy Referral Link'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: 'Total Earned', value: `$${referralStats.totalEarned.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+0% this week' },
               { label: 'Pending Payout', value: `$${referralStats.pendingRewards.toFixed(2)}`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', change: 'Payout at $50.00' },
               { label: 'Referral Signups', value: '0', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', change: '0 clicks today' },
               { label: 'Commission Rate', value: '20%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', change: 'Elite Partner level' },
             ].map((stat, i) => (
               <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group overflow-hidden transition-all hover:shadow-md">
                 <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                   <stat.icon className="w-6 h-6" />
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</p>
                 <p className="text-[10px] font-bold text-slate-400">{stat.change}</p>
                 <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowUpRight className="w-4 h-4 text-slate-300" />
                 </div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Recent Referrals</h3>
                  <button className="text-sm font-bold text-blue-900 hover:text-sky-600">View History</button>
                </div>
                <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Activity className="w-10 h-10" />
                    </div>
                    <p className="text-slate-500 font-medium">No referral activity yet. Start sharing your link!</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                 <div className="absolute -top-12 -right-12 p-8 opacity-10 pointer-events-none">
                   <Gift className="w-48 h-48" />
                 </div>
                 <h3 className="text-xl font-bold brand-font mb-4">Payout Goal</h3>
                 <p className="text-blue-100 text-sm mb-8 leading-relaxed">Reach $50.00 in earnings to unlock your first withdrawal via PayPal or Bank Transfer.</p>
                 <div className="space-y-4">
                   <div className="flex justify-between text-xs font-bold">
                     <span className="text-blue-300">Progress</span>
                     <span>$0.00 / $50.00</span>
                   </div>
                   <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-sky-400 w-0 transition-all duration-1000"></div>
                   </div>
                   <p className="text-[10px] text-blue-400 italic">Earnings are verified 30 days after signup.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (path === '/dashboard/warranties') {
      return isFreeTier ? <LockedPage title="Warranty Vault" /> : (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 brand-font">Warranty Vault</h2>
              <p className="text-slate-500">Securely store and manage all your warranty documents.</p>
            </div>
            <button 
              onClick={() => setIsAddingWarranty(true)}
              className="px-6 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all flex items-center gap-3 shadow-xl shadow-blue-900/10 w-full md:w-auto justify-center active:scale-95"
            >
              <Plus className="w-5 h-5" /> Upload New
            </button>
          </div>
          <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center">
             <FileSearch className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h3 className="text-xl font-bold text-slate-900">Vault is Empty</h3>
             <p className="text-slate-500 mb-8">Start by uploading your first contract for protection.</p>
             <button onClick={() => setIsAddingWarranty(true)} className="text-blue-900 font-bold hover:underline">Add Warranty Document</button>
          </div>
        </div>
      );
    }

    if (path === '/dashboard/claims') {
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 brand-font">Claim Advocacy</h2>
              <p className="text-slate-500">Track your ongoing claims and professional advocacy requests.</p>
            </div>
            <button 
              onClick={handleOpenNewClaim}
              className="px-6 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all flex items-center gap-3 shadow-xl shadow-blue-900/10 w-full md:w-auto justify-center active:scale-95"
            >
              <Plus className="w-5 h-5" /> New Claim Request
            </button>
          </div>
          {claims.length > 0 ? (
            <div className="space-y-6">
               {isFreeTier && claims.length >= 1 && (
                 <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                         <AlertCircle className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="font-bold text-amber-900">Free Tier Limit Reached</p>
                         <p className="text-sm text-amber-700">You can only place one claim on the Free Tier. Upgrade to Premium for unlimited advocacy.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="px-6 py-3 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 shrink-0"
                    >
                      Upgrade Now
                    </button>
                 </div>
               )}
               <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">Active Claim Queue</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {claims.map((claim) => (
                        <div key={claim.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              claim.type === ClaimType.HOME ? 'bg-blue-100 text-blue-600' :
                              claim.type === ClaimType.RENOVATION ? 'bg-indigo-100 text-indigo-600' :
                              claim.type === ClaimType.AUTO ? 'bg-sky-100 text-sky-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {claim.type === ClaimType.HOME ? <HomeIcon className="w-7 h-7" /> :
                                claim.type === ClaimType.AUTO ? <Car className="w-7 h-7" /> : <ClipboardCheck className="w-7 h-7" />}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-lg">{claim.title}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                                  <span>ID: {claim.id}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                              claim.status === ClaimStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              claim.status === ClaimStatus.PROCESSING ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {claim.status}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Priority: {claim.priority}</p>
                          </div>
                        </div>
                    ))}
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center">
               <ClipboardCheck className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <h3 className="text-xl font-bold text-slate-900">No Open Claims</h3>
               <p className="text-slate-500 mb-8">When we file a claim on your behalf, it will appear here.</p>
               <button onClick={handleOpenNewClaim} className="text-blue-900 font-bold hover:underline">Start Advocacy Case</button>
            </div>
          )}
        </div>
      );
    }

    if (path === '/dashboard/profile') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
          <div className="px-4 sm:px-0">
            <h2 className="text-3xl font-bold text-slate-900 brand-font">User Profile</h2>
            <p className="text-slate-500">Manage your personal information and account settings.</p>
          </div>
          
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="bg-blue-900 h-32 w-full relative">
               <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 sm:left-12 sm:translate-x-0">
                 <div className="relative group">
                   <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-xl flex items-center justify-center text-slate-400 transition-transform group-hover:scale-105 duration-300">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-12 h-12" />
                      )}
                   </div>
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-3 bg-sky-500 text-white rounded-full border-2 border-white hover:bg-sky-400 transition-all shadow-md group-hover:scale-110 active:scale-90"
                    title="Change Profile Photo"
                   >
                     <Camera className="w-5 h-5" />
                   </button>
                   <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} className="hidden" accept="image/*" />
                 </div>
               </div>
            </div>
            
            <div className="pt-24 px-6 sm:px-12 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pb-2 border-b border-slate-50">Identity Details</h3>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                       <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider ml-1">Full Display Name</label>
                       <div className="relative group">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                          <input 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all text-sm" 
                            placeholder="Full Name"
                          />
                       </div>
                    </div>
                    <div className="space-y-1.5 group opacity-75">
                       <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider ml-1">Account Email (Locked)</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="email" value={user.email} disabled className="w-full pl-12 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-medium cursor-not-allowed text-sm" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider ml-1">Primary Phone</label>
                       <div className="relative group">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                          <input 
                            type="tel" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="239-000-0000" 
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all text-sm" 
                          />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pb-2 border-b border-slate-50">Location Settings</h3>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                       <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider ml-1">Street Address</label>
                       <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                          <input 
                            type="text" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            placeholder="123 Main St" 
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all text-sm" 
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider ml-1">State</label>
                         <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                            <input 
                              type="text" 
                              value={stateName} 
                              onChange={(e) => setStateName(e.target.value)} 
                              placeholder="Florida" 
                              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all text-sm" 
                            />
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider ml-1">Postcode</label>
                         <div className="relative group">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              value={postcode} 
                              onChange={(e) => setPostcode(e.target.value)} 
                              placeholder="33901" 
                              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all text-sm" 
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-5 items-center">
                 {saveSuccess && (
                   <span className="text-emerald-600 font-bold flex items-center gap-2 animate-fade-in text-xs uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 mb-2 sm:mb-0">
                     <CheckCircle2 className="w-4 h-4" /> Profile Updated
                   </span>
                 )}
                 <div className="flex gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => navigate('/dashboard')} 
                      className="flex-1 sm:flex-none px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveChanges} 
                      disabled={isSaving} 
                      className="flex-1 sm:flex-none px-10 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 min-w-[200px] text-sm active:scale-95 disabled:bg-slate-400 disabled:shadow-none"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved Successfully
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Complete Profile
                        </>
                      )}
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-fade-in no-scrollbar pb-20">
        <div className="bg-gradient-to-r from-blue-900 to-sky-800 rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <ShieldCheck className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 brand-font">Welcome back, {user.fullName.split(' ')[0]}!</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl">
              {isFreeTier 
                ? "You are currently exploring our Free Tier. Upgrade to access our full suite of advocacy tools." 
                : "Your account protection is active. Manage your warranties or file claims below."}
            </p>
            <div className="flex flex-wrap gap-4">
              {isFreeTier ? (
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-8 py-4 bg-sky-500 text-white rounded-full font-bold hover:bg-sky-400 transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95"
                >
                  Upgrade to Premium <Zap className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <>
                  <button onClick={handleOpenNewClaim} className="px-6 py-3 bg-white text-blue-900 rounded-full font-bold hover:bg-sky-400 hover:text-white transition-all flex items-center gap-2 active:scale-95">
                    <Plus className="w-5 h-5" /> File New Claim
                  </button>
                  <button onClick={() => setIsAddingWarranty(true)} className="px-6 py-3 bg-blue-800/50 border border-blue-700 text-white rounded-full font-bold hover:bg-blue-800 transition-all flex items-center gap-2 active:scale-95">
                    <Upload className="w-5 h-5" /> Upload Warranty
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[40px] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                 <Gift className="w-64 h-64" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                     <Share2 className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold brand-font">Invite & Earn 20%</h3>
                 </div>
                 <p className="text-emerald-50 mb-10 max-w-lg leading-relaxed text-lg">
                   Help your neighbors protect their warranties and earn <span className="font-bold underline">20% commission</span> ($100 per annual signup).
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                   <button 
                    onClick={handleCopyLink}
                    className="flex-grow py-5 bg-white text-emerald-700 rounded-3xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 active:scale-95"
                   >
                     {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                     {copied ? 'Link Copied' : 'Get My Referral Link'}
                   </button>
                   <button 
                    onClick={() => navigate('/dashboard/rewards')}
                    className="px-8 py-5 bg-emerald-800/40 border border-emerald-400/30 text-white rounded-3xl font-bold hover:bg-emerald-800 transition-all backdrop-blur-sm active:scale-95"
                   >
                     View Rewards
                   </button>
                 </div>
               </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-24 h-24 text-blue-900" /></div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Current Plan</h4>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{isFreeTier ? "Free Tier" : "Premium Member"}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                {isFreeTier 
                  ? "Upgrade to Premium Advocacy for unlimited claim filings and full home/auto protection."
                  : "You have full access to our advocacy team. We're fighting for you!"}
              </p>
              <button onClick={() => isFreeTier ? setShowUpgradeModal(true) : navigate('/services')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-900 transition-colors shadow-lg active:scale-95">
                {isFreeTier ? "View Upgrade Options" : "Manage Subscription"}
              </button>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 group">
              <h4 className="text-sm font-bold text-blue-900 mb-4">Need Help?</h4>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">Our experts are available to guide you through any warranty dispute or question.</p>
              <button onClick={() => navigate('/contact')} className="w-full py-3 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-900 hover:text-white transition-all shadow-sm active:scale-95">Contact Advocate</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      
      {/* Upgrade Choice Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Zap className="w-48 h-48 text-blue-900" /></div>
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce-slow"><ShieldCheck className="w-10 h-10" /></div>
              <h3 className="text-3xl font-bold text-slate-900 brand-font mb-4">Upgrade to Premium</h3>
              <p className="text-slate-500 text-lg mb-10 leading-relaxed">Unlock unlimited claim filings, full document storage, and priority professional advocacy for only <b>$49.99/mo</b>.</p>
              <div className="space-y-4 mb-10 text-left px-4">
                 {['Unlimited Home & Auto Claims', 'Professional Advocacy Team', 'Lifetime Document Vault', 'Real-time Claim Tracking'].map((feat, i) => (
                   <div key={i} className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="w-5 h-5 text-green-500" /> {feat}</div>
                 ))}
              </div>
              <button 
                onClick={() => { setShowUpgradeModal(false); setShowPaymentModal(true); setPaymentStep('CARD'); }} 
                className="w-full py-5 bg-blue-900 text-white rounded-3xl font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 mb-4 active:scale-95"
              >
                Upgrade Now
              </button>
              <button onClick={() => setShowUpgradeModal(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors active:scale-95">Maybe Later</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden relative my-8">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {paymentStep === 'SUCCESS' ? (
              <div className="p-12 text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 brand-font mb-4">Welcome to Premium!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">Your account has been successfully upgraded to the {selectedUpgradePlan.toLowerCase()} plan. You now have full access to all advocacy features.</p>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-5 bg-blue-900 text-white rounded-3xl font-bold hover:bg-sky-600 transition-all shadow-xl active:scale-95"
                >
                  Enter Premium Dashboard
                </button>
              </div>
            ) : (
              <div className="p-8 lg:p-12">
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center gap-3 text-sky-600 font-bold uppercase tracking-widest text-xs mb-4">
                    <ShieldCheck className="w-4 h-4" /> Secure Advocacy Checkout
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 brand-font">Select Your Plan</h3>
                </div>

                <div className="space-y-4 mb-10">
                  {/* Monthly Selection */}
                  <button 
                    onClick={() => setSelectedUpgradePlan('MONTHLY')}
                    className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex justify-between items-center group ${
                      selectedUpgradePlan === 'MONTHLY' 
                        ? 'border-blue-900 bg-blue-50/50 ring-4 ring-blue-900/5 shadow-lg' 
                        : 'border-slate-100 hover:border-sky-200'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">Monthly Advocacy</h4>
                      <p className="text-xs text-slate-500">Flexible monthly protection</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-blue-900">${PRICING.basic}</p>
                      <p className="text-[10px] text-slate-400 font-bold">per month</p>
                    </div>
                  </button>

                  {/* Annual Selection */}
                  <button 
                    onClick={() => setSelectedUpgradePlan('ANNUAL')}
                    className={`w-full p-6 text-left rounded-3xl border-2 transition-all relative group overflow-hidden ${
                      selectedUpgradePlan === 'ANNUAL' 
                        ? 'border-sky-500 bg-sky-50/50 ring-4 ring-sky-500/5 shadow-lg' 
                        : 'border-slate-100 hover:border-sky-200'
                    }`}
                  >
                    <div className="absolute top-0 right-0 px-3 py-1 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-md">
                      BEST VALUE
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900">Annual Premium</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-full">Save $100</p>
                          <p className="text-[10px] text-sky-600 font-bold">2 Months Free</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-blue-900">${PRICING.premium}</p>
                        <p className="text-[10px] text-slate-400 font-bold">per year</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Due Today</p>
                    <p className="text-2xl font-black text-slate-900">${selectedUpgradePlan === 'MONTHLY' ? PRICING.basic : PRICING.premium}</p>
                  </div>
                  {selectedUpgradePlan === 'ANNUAL' && (
                    <div className="text-right text-[10px] font-bold text-emerald-600">
                      Savings Included
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpgradePayment} className="space-y-4">
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      required
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all font-medium text-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <input 
                      type="text" 
                      placeholder="MM/YY" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all font-medium text-sm" 
                    />
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:bg-white focus:border-blue-900 transition-all font-medium text-sm" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isProcessingPayment}
                    className="w-full py-5 bg-blue-900 text-white rounded-[24px] font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 mt-4 disabled:bg-slate-300 disabled:shadow-none active:scale-95"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Upgrade
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                    256-Bit SSL Encryption • Cancel Anytime
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {isAddingWarranty && <AddWarrantyModal onClose={() => setIsAddingWarranty(false)} />}
      {isAddingClaim && <AddClaimModal user={user} onClose={() => setIsAddingClaim(false)} onAddClaim={addClaim} />}
    </>
  );
};

const AddWarrantyModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6"><Upload className="w-8 h-8" /></div>
        <h3 className="text-2xl font-bold text-slate-900 brand-font">Upload Warranty</h3>
        <p className="text-slate-500">Digitize your contract for lifetime protection.</p>
      </div>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
          <input type="text" placeholder="e.g. 2021 Ford F-150 Warranty" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
            <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10"><option>Auto</option><option>Home</option></select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expiration</label>
            <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" />
          </div>
        </div>
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
          <Upload className="w-8 h-8 mx-auto mb-4 text-slate-300 group-hover:text-blue-900 group-hover:scale-110 transition-all" />
          <p className="text-sm font-bold text-slate-500">Click to upload PDF or Photo</p>
          <p className="text-xs text-slate-400">Max file size 10MB</p>
        </div>
        <button type="submit" className="w-full py-5 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 active:scale-95">Save to Vault</button>
      </form>
    </div>
  </div>
);

interface AddClaimModalProps {
  user: UserProfile;
  onClose: () => void;
  onAddClaim: (claim: Claim) => void;
}

const AddClaimModal = ({ user, onClose, onAddClaim }: AddClaimModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ClaimType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ClaimPriority>(ClaimPriority.MEDIUM);
  
  // Property Details State
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Single Family');
  const [isPrimaryResidence, setIsPrimaryResidence] = useState(true);

  // Document Management State
  const [documents, setDocuments] = useState<{name: string, data: string, type: string}[]>([]);
  const contractInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const claimTypes = [
    { type: ClaimType.HOME, title: 'Home Warranty Claim', icon: HomeIcon, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Broken AC, plumbing issues, or appliance repairs.' },
    { type: ClaimType.RENOVATION, title: 'Home Renovation Claim', icon: Hammer, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Incomplete projects, contractor disputes, or material defects.' },
    { type: ClaimType.AUTO, title: 'Auto Warranty Claim', icon: Car, color: 'text-sky-600', bg: 'bg-sky-50', desc: 'Engine trouble, transmission, or electronic failures.' },
    { type: ClaimType.BUYING_ASSISTANCE, title: 'Auto Buying Assistance', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Expert help negotiating your next vehicle purchase.' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileTypeLabel: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => [...prev, { name: file.name, data: reader.result as string, type: fileTypeLabel }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    
    const isHomeRelated = selectedType === ClaimType.HOME || selectedType === ClaimType.RENOVATION;
    
    const newClaim: Claim = { 
      id: Math.random().toString(36).substr(2, 9).toUpperCase(), 
      userId: user.id, 
      type: selectedType, 
      status: ClaimStatus.PENDING, 
      priority: priority,
      title: title || `${selectedType.replace('_', ' ')} Advocacy Request`, 
      description: description, 
      documents: documents.map(d => d.data), 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
      ...(isHomeRelated && {
        propertyAddress,
        propertyType,
        isPrimaryResidence
      })
    };
    onAddClaim(newClaim);
    onClose();
  };

  const getPriorityHint = () => {
    if (selectedType === ClaimType.HOME || selectedType === ClaimType.RENOVATION) {
      switch (priority) {
        case ClaimPriority.LOW: return "General cosmetic issues or non-essential feature repairs.";
        case ClaimPriority.MEDIUM: return "Functional appliance issues or ongoing contractor delays.";
        case ClaimPriority.HIGH: return "Emergency: No HVAC/Water, active leaks, or safety hazards.";
        default: return "";
      }
    }
    return "";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
        {step === 1 ? (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6"><ClipboardCheck className="w-8 h-8" /></div>
              <h3 className="text-3xl font-bold text-slate-900 brand-font mb-2">Start a New Claim</h3>
              <p className="text-slate-500">What do you need advocacy for today?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claimTypes.map((item) => (
                <button key={item.type} onClick={() => { setSelectedType(item.type); setStep(2); }} className="p-6 text-left rounded-3xl border-2 border-slate-50 bg-slate-50 hover:border-blue-900 hover:bg-white transition-all group active:scale-95">
                  <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><item.icon className="w-6 h-6" /></div>
                  <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
             <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-900 mb-6 transition-colors group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to selection</button>
             <div className="mb-8">
               <h3 className="text-2xl font-bold text-slate-900 brand-font">Claim Details</h3>
               <p className="text-slate-500">Advocacy Type: <span className="text-blue-900 font-bold uppercase tracking-tight">{selectedType?.replace('_', ' ')}</span></p>
             </div>
             <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Conditional Property Details for Home/Renovation */}
              {(selectedType === ClaimType.HOME || selectedType === ClaimType.RENOVATION) && (
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[32px] space-y-6">
                  <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> Property Verification
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Property Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-900" />
                      <input 
                        type="text" 
                        value={propertyAddress} 
                        onChange={(e) => setPropertyAddress(e.target.value)} 
                        placeholder="Full street address, city, state" 
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
                      <select 
                        value={propertyType} 
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-medium"
                      >
                        <option>Single Family</option>
                        <option>Condo</option>
                        <option>Townhome</option>
                        <option>Multi-Family (2-4 Units)</option>
                        <option>Mobile Home</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Residence?</label>
                      <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={() => setIsPrimaryResidence(true)}
                          className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${isPrimaryResidence ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          Yes
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setIsPrimaryResidence(false)}
                          className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${!isPrimaryResidence ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Issue Subject</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Denied HVAC replacement claim" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10" required />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                  {priority === ClaimPriority.HIGH && (
                    <span className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Emergency Focus
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Low', value: ClaimPriority.LOW, color: 'border-emerald-100 text-emerald-600 bg-emerald-50 hover:bg-emerald-100', active: 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 border-emerald-500' },
                    { label: 'Medium', value: ClaimPriority.MEDIUM, color: 'border-amber-100 text-amber-600 bg-amber-100 hover:bg-amber-100', active: 'bg-amber-500 text-white ring-4 ring-amber-500/20 border-amber-500' },
                    { label: 'High', value: ClaimPriority.HIGH, color: 'border-red-100 text-red-600 bg-red-50 hover:bg-red-100', active: 'bg-red-500 text-white ring-4 ring-red-500/20 border-red-500' }
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${priority === p.value ? p.active : p.color}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic mt-2 px-1">
                  {getPriorityHint()}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please provide specific details about the issue and any communications you've had with the warranty provider..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 resize-none" required></textarea>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    type="button" 
                    onClick={() => contractInputRef.current?.click()}
                    className="py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2 active:scale-95 transition-colors"
                   >
                     <FileText className="w-5 h-5 text-blue-500" /> Attach Contracts
                   </button>
                   <button 
                    type="button" 
                    onClick={() => photoInputRef.current?.click()}
                    className="py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2 active:scale-95 transition-colors"
                   >
                     <Camera className="w-5 h-5 text-sky-500" /> Evidence Photos
                   </button>
                   <input type="file" ref={contractInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'Contract')} accept=".pdf,.doc,.docx" />
                   <input type="file" ref={photoInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'Photo')} accept="image/*" />
                </div>

                {/* File Attachment List */}
                {documents.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidence Uplink ({documents.length})</label>
                    <div className="grid grid-cols-1 gap-2">
                      {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl animate-fade-in group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              {doc.type === 'Contract' ? <FileText className="w-4 h-4 text-blue-600" /> : <Camera className="w-4 h-4 text-sky-600" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate max-w-[240px]">{doc.name}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{doc.type}</p>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeFile(idx)} 
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove attachment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-5 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-95 group">
                Initialize Professional Advocacy <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
