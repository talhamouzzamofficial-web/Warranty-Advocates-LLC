
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  Zap,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  X,
  Home as HomeIcon,
  Car,
  ShoppingBag,
  Gift,
  Copy,
  Share2,
  DollarSign,
  Loader2,
  Lock,
  ChevronRight,
  Users,
  TrendingUp,
  Upload,
  Calendar,
  Building2,
  Trash2,
  Hash,
  Camera,
  Mail,
  User as UserIcon,
  Smartphone,
  Globe,
  Save,
  FileEdit,
  ChevronDown,
  MoveRight,
  CalendarDays,
  Eye,
  Edit2,
  Paperclip,
  Activity,
  MapPin,
  Banknote
} from 'lucide-react';
import { UserProfile, ClaimStatus, ClaimType, Claim, ClaimPriority, Warranty, ClaimDocument } from '../../types';
import { GoogleGenAI } from "@google/genai";

interface UserDashboardProps {
  user: UserProfile;
  onUpdateProfile?: (updatedProfile: Partial<UserProfile>) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isFreeTier = !user.plan || user.plan === 'FREE';

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [claims, setClaims] = useState<Claim[]>(() => {
    const globalClaims = JSON.parse(localStorage.getItem('wa_global_claims') || '[]');
    return globalClaims.filter((c: Claim) => c.userId === user.id);
  });

  const [warranties, setWarranties] = useState<Warranty[]>(() => {
    const saved = localStorage.getItem(`wa_user_warranties_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isAddingClaim, setIsAddingClaim] = useState(false);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [isAddingWarranty, setIsAddingWarranty] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Profile Management State
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    postcode: user.postcode || '',
    state: user.state || ''
  });
  const profileImageInputRef = useRef<HTMLInputElement>(null);

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

  const referralCode = user.referralCode || (user.fullName.split(' ')[0].toUpperCase() + user.id.substring(0, 4));
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayoutRequest = async () => {
    setIsRequestingPayout(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRequestingPayout(false);
    setPayoutSuccess(true);
    // In a real app, we would update user.totalEarned here or trigger a backend ledger entry
    setTimeout(() => setPayoutSuccess(false), 5000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    onUpdateProfile?.(profileForm);
    setIsSavingProfile(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile?.({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenNewClaim = () => {
    if (isFreeTier && claims.length >= 1) {
      setShowUpgradeModal(true);
    } else {
      setIsAddingClaim(true);
    }
  };

  const saveClaim = (claim: Claim) => {
    const globalClaims = JSON.parse(localStorage.getItem('wa_global_claims') || '[]');
    let updatedGlobal;

    if (globalClaims.find((c: Claim) => c.id === claim.id)) {
      updatedGlobal = globalClaims.map((c: Claim) => c.id === claim.id ? { ...claim, userName: user.fullName } : c);
    } else {
      updatedGlobal = [{ ...claim, userName: user.fullName }, ...globalClaims];
    }

    localStorage.setItem('wa_global_claims', JSON.stringify(updatedGlobal));
    setClaims(updatedGlobal.filter((c: Claim) => c.userId === user.id));

    const activities = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    activities.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.fullName,
      action: 'CLAIM_UPDATE',
      detail: `Updated advocacy claim ${claim.id} - ${claim.title}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(activities.slice(0, 50)));

    setIsAddingClaim(false);
    setEditingClaim(null);
  };

  const deleteWarranty = (id: string) => {
    if (!window.confirm('Remove this document from your vault?')) return;
    const updated = warranties.filter(w => w.id !== id);
    setWarranties(updated);
    localStorage.setItem(`wa_user_warranties_${user.id}`, JSON.stringify(updated));
  };

  const handleSaveWarranty = (w: Warranty) => {
    let updated;
    if (warranties.find(item => item.id === w.id)) {
      updated = warranties.map(item => item.id === w.id ? w : item);
    } else {
      updated = [w, ...warranties];
    }
    setWarranties(updated);
    localStorage.setItem(`wa_user_warranties_${user.id}`, JSON.stringify(updated));
    setIsAddingWarranty(false);
    setEditingWarranty(null);
  };

  const renderOverview = () => (
    <div className="animate-fade-in no-scrollbar p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="bg-[#1e3a8a] rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden flex flex-col justify-center min-h-[280px] shadow-2xl">
        <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 lg:w-64 lg:h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl lg:text-5xl font-bold brand-font mb-4">Welcome back, {user.fullName.toLowerCase()}!</h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed font-medium">
            {isFreeTier ? "You are currently exploring our Free Tier. Upgrade to access our full suite of advocacy tools." : `You are currently on the ${user.plan} plan.`}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#0ea5e9] hover:bg-sky-400 text-white rounded-full font-bold text-sm transition-all shadow-xl shadow-sky-500/20 active:scale-95"
            >
              {isFreeTier ? 'View Plans' : 'Manage Subscription'} <Zap className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Warranties</p>
            <p className="text-2xl font-bold text-slate-900">{warranties.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Open Claims</p>
            <p className="text-2xl font-bold text-slate-900">{claims.filter(c => c.status !== ClaimStatus.APPROVED).length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Referral Earnings</p>
            <p className="text-2xl font-bold text-slate-900">${(user.totalEarned || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-[#10B981] rounded-[40px] p-8 lg:p-12 pb-4 lg:pb-4 text-white relative overflow-hidden group flex flex-col justify-between h-full">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Gift className="w-64 h-64 lg:w-80 lg:h-80" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold brand-font">Invite & Earn 20%</h3>
            </div>
            <p className="text-emerald-50 mb-8 lg:mb-10 text-lg leading-relaxed max-w-xl">
              Help your neighbors protect their warranties and earn <span className="font-bold underline">20% commission</span> ($100 per annual signup).
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#10B981] rounded-full font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all text-sm"
              >
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Link Copied' : 'Get My Referral Link'}
              </button>
              <button
                onClick={() => navigate('/dashboard/rewards')}
                className="w-full sm:w-auto px-8 py-4 bg-black/10 hover:bg-black/20 text-white rounded-full font-bold transition-all border border-white/10 text-sm"
              >
                View Rewards
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 lg:p-12 pb-8 lg:pb-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Zap className="w-20 h-20" />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Your Subscription</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{user.plan || 'Free Tier'}</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Active Account</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
              {isFreeTier ? 'Upgrade to an Advocacy plan for unlimited claim filings and full home/auto protection.' : `Your ${user.plan} plan includes unlimited advocacy for your home and auto claims.`}
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-4 bg-[#1e3a8a] text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all mt-auto flex items-center justify-center gap-2"
            >
              {isFreeTier ? 'Upgrade Plan' : 'Manage Subscription'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (path === '/dashboard/rewards') {
      const payoutProgress = Math.min((user.totalEarned || 0) / 50 * 100, 100);
      const isPayoutReady = (user.totalEarned || 0) >= 50;

      return (
        <div className="p-6 lg:p-10 space-y-8 animate-fade-in no-scrollbar max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1e293b] brand-font">Rewards & Affiliate Dashboard</h2>
              <p className="text-slate-500 text-sm mt-1">Earn 20% commission for every successful referral.</p>
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-[#1e3a8a] text-white hover:bg-blue-800'
                }`}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {copied ? 'Link Copied' : 'Copy Referral Link'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'TOTAL EARNED', value: `$${(user.totalEarned || 0).toFixed(2)}`, sub: '+0% this week', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'PENDING PAYOUT', value: `$${(user.pendingRewards || 0).toFixed(2)}`, sub: 'Payout at $50.00', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'REFERRAL SIGNUPS', value: '0', sub: '0 clicks today', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { label: 'COMMISSION RATE', value: '20%', sub: 'Elite Partner level', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1e293b]">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-[400px]">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#1e293b]">Recent Referrals</h3>
                <button className="text-[11px] font-bold text-blue-600 hover:underline uppercase tracking-widest">View History</button>
              </div>
              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                  <Activity className="w-8 h-8" />
                </div>
                <p className="text-slate-400 font-medium text-sm">No referral activity yet. Start sharing your link!</p>
              </div>
            </div>

            <div className="bg-[#244191] rounded-[24px] p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between h-[400px] shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Gift className="w-32 h-32" />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4 brand-font">Payout Progress</h3>
                <p className="text-blue-100 text-xs leading-relaxed opacity-80 mb-10">
                  {isPayoutReady
                    ? "Congratulations! You've reached the $50 milestone and can now request a professional payout."
                    : "Reach $50.00 in earnings to unlock your first withdrawal via PayPal or Bank Transfer."}
                </p>

                <div className="mt-auto">
                  {payoutSuccess ? (
                    <div className="p-6 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex flex-col items-center text-center animate-in zoom-in duration-300">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
                      <p className="text-sm font-bold text-white">Payout Requested!</p>
                      <p className="text-[10px] text-emerald-100 mt-1">Our finance team will process this within 48 hours.</p>
                    </div>
                  ) : isPayoutReady ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest mb-2">
                        <span className="text-emerald-400">Status: Milestone Reached</span>
                        <span className="text-white">${(user.totalEarned || 0).toFixed(2)} / $50.00</span>
                      </div>
                      <button
                        onClick={handlePayoutRequest}
                        disabled={isRequestingPayout}
                        className="w-full py-5 bg-[#0ea5e9] text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-sky-400 shadow-xl shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        {isRequestingPayout ? <Loader2 className="w-5 h-5 animate-spin" /> : <Banknote className="w-5 h-5" />}
                        {isRequestingPayout ? 'Processing Request...' : 'Request Pay-Out Now'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                        <span>Progress</span>
                        <span>${(user.totalEarned || 0).toFixed(2)} / $50.00</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-400 transition-all duration-1000" style={{ width: `${payoutProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 pt-8 mt-6">
                <p className="text-[10px] text-blue-300 font-medium italic opacity-60">
                  Earnings are verified 30 days after signup.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (path === '/dashboard/warranties') {
      if (isFreeTier) {
        return (
          <div className="p-6 lg:p-12 space-y-8 animate-fade-in no-scrollbar max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-900 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
              <Lock className="w-12 h-12" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 brand-font mb-4">Warranty Vault</h2>
            <p className="text-slate-500 text-lg max-w-lg mb-10 leading-relaxed">
              The secure Document Vault is a premium feature. Digitally store your protection plans, track expiration dates, and get automated maintenance reminders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-10 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all shadow-xl active:scale-95"
              >
                Upgrade Plan to Unlock
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="p-6 lg:p-12 space-y-8 animate-fade-in no-scrollbar max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 brand-font">Warranty Vault</h2>
              <p className="text-slate-500 text-lg">Securely digitize and manage all your protection contracts.</p>
            </div>
            <button
              onClick={() => setIsAddingWarranty(true)}
              className="px-8 py-4 bg-[#1e3a8a] text-white rounded-[20px] font-bold shadow-xl flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <Plus className="w-5 h-5" /> Upload Document
            </button>
          </div>

          {warranties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warranties.map((warranty) => (
                <div key={warranty.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full">
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button
                      onClick={() => setEditingWarranty(warranty)}
                      className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                      title="Edit Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteWarranty(warranty.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 shrink-0 ${warranty.type === 'HOME' ? 'bg-blue-50 text-blue-600' : 'bg-sky-50 text-sky-600'
                    }`}>
                    {warranty.type === 'HOME' ? <HomeIcon className="w-8 h-8" /> : <Car className="w-8 h-8" />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 truncate pr-16">{warranty.title}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 fill-current" /> {warranty.planName || 'Standard Plan'}
                  </p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {warranty.provider}
                  </p>

                  <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Start Date</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5">{new Date(warranty.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End Date</span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5">{new Date(warranty.expirationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
                      <span className={`text-[10px] font-black flex items-center gap-1.5 ${warranty.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {warranty.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {warranty.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex gap-3">
                    {warranty.documentUrl ? (
                      <button
                        onClick={() => setViewingDocument(warranty.documentUrl || null)}
                        className="flex-1 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-sky-600 transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Document
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 italic"
                      >
                        No Document Attached
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-24 lg:p-32 rounded-[48px] border border-dashed border-slate-200 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-100">
                <FileText className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your vault is empty</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-10 text-lg leading-relaxed">Keep all your contracts and receipts in one secure place.</p>
              <button
                onClick={() => setIsAddingWarranty(true)}
                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-[20px] font-bold hover:bg-slate-200 transition-all"
              >
                Add First Warranty
              </button>
            </div>
          )}
        </div>
      );
    }

    if (path === '/dashboard/claims') {
      return (
        <div className="p-6 lg:p-12 space-y-8 animate-fade-in no-scrollbar max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1e293b] brand-font">Claim Advocacy</h2>
              <p className="text-slate-500 text-sm mt-1">Track your ongoing claims and professional advocacy requests.</p>
            </div>
            <button
              onClick={handleOpenNewClaim}
              className="px-6 py-3 bg-[#1e3a8a] text-white rounded-[12px] font-bold shadow-xl flex items-center gap-2 w-full md:w-auto justify-center group relative transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> New Claim Request
            </button>
          </div>
          {claims.length > 0 ? (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => setEditingClaim(claim)}
                  className="p-8 flex items-center justify-between hover:bg-slate-50 group cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 ${claim.type === ClaimType.HOME ? 'bg-blue-50 text-blue-600' : 'bg-sky-50 text-sky-600'
                      }`}>
                      {claim.type === ClaimType.HOME ? <HomeIcon className="w-8 h-8" /> : <Car className="w-8 h-8" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xl group-hover:text-[#1e3a8a] transition-colors">{claim.title}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> ID: {claim.id}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border-2 ${claim.status === ClaimStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        claim.status === ClaimStatus.PROCESSING ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                      {claim.status}
                    </span>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-24 lg:p-32 rounded-[48px] border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                <ClipboardCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 brand-font">No Open Claims</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 text-base leading-relaxed">When we file a claim on your behalf, it will appear here.</p>
              <button
                onClick={handleOpenNewClaim}
                className="text-blue-600 font-bold text-sm hover:underline transition-all"
              >
                Start Advocacy Case
              </button>
            </div>
          )}
        </div>
      );
    }

    if (path === '/dashboard/profile') {
      return (
        <div className="p-6 lg:p-12 max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 no-scrollbar">
          <div className="text-left mb-10">
            <h2 className="text-4xl font-bold text-slate-900 brand-font mb-2">User Profile</h2>
            <p className="text-slate-500 text-lg font-medium">Manage your personal information and account settings.</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden relative pb-12">
            <div className="bg-[#1e3a8a] h-32 lg:h-48 w-full relative"></div>

            <div className="relative px-6 lg:px-16 -mt-16 lg:-mt-20">
              <div className="flex flex-col items-start mb-12">
                <div className="relative group">
                  <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-full border-[6px] border-white bg-[#f1f5f9] overflow-hidden shadow-xl flex items-center justify-center text-slate-300">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-16 h-16 lg:w-20 lg:h-20" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => profileImageInputRef.current?.click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-[#0EA5E9] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sky-600 transition-all border-4 border-white active:scale-90"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={profileImageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-4">Identity Details</h4>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Display Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Email (Locked)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        readOnly
                        value={profileForm.email}
                        className="w-full pl-12 pr-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Phone</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-4">Location Settings</h4>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={profileForm.state}
                          onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                          className="w-full pl-12 pr-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Zip Code</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={profileForm.postcode}
                          onChange={(e) => setProfileForm({ ...profileForm, postcode: e.target.value })}
                          className="w-full pl-12 pr-6 py-4 bg-[#f8fafc] border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 flex justify-end gap-4 items-center">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-10 py-3 bg-[#f1f5f9] text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-10 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
                  {isSavingProfile ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    }

    return renderOverview();
  };

  return (
    <>
      {renderContent()}
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onUpdateProfile={onUpdateProfile} />}
      {(isAddingClaim || editingClaim) && (
        <StartNewClaimModal
          user={user}
          initialData={editingClaim}
          onClose={() => { setIsAddingClaim(false); setEditingClaim(null); }}
          onSaveClaim={saveClaim}
          onViewDoc={setViewingDocument}
        />
      )}
      {!isFreeTier && (isAddingWarranty || editingWarranty) && (
        <AddEditWarrantyModal
          user={user}
          initialData={editingWarranty}
          onClose={() => { setIsAddingWarranty(false); setEditingWarranty(null); }}
          onSave={handleSaveWarranty}
        />
      )}
      {viewingDocument && (
        <DocumentViewerModal
          url={viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}

      <button
        onClick={handleOpenNewClaim}
        className="fixed bottom-8 right-8 lg:hidden w-16 h-16 bg-[#1e3a8a] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus className="w-8 h-8" />
      </button>
    </>
  );
};

// Internal Modal Components

const UpgradeModal: React.FC<{ onClose: () => void; onUpdateProfile?: (p: Partial<UserProfile>) => void }> = ({ onClose, onUpdateProfile }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col">
        {/* Header with lightning bolt and close button */}
        <div className="p-10 flex flex-col items-center">
          <button onClick={onClose} className="absolute top-8 right-8 p-1 text-slate-400 hover:text-slate-900 transition-all z-20">
            <X className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-[24px] flex items-center justify-center mb-6 shadow-sm border border-blue-100/50">
            <Zap className="w-8 h-8 fill-current" />
          </div>

          <h3 className="text-4xl font-bold text-[#0f172a] brand-font mb-2">Upgrade Your Plan</h3>
          <p className="text-slate-500 font-medium text-lg">Get unlimited advocacy and full vault access.</p>
        </div>

        <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Basic Advocacy Card */}
          <div className="p-8 lg:p-10 bg-[#f8fafc] rounded-[40px] border border-slate-100 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow group">
            <h4 className="font-bold text-2xl text-[#0f172a] mb-4">Basic Advocacy</h4>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-[#0f172a]">$49.99</span>
              <span className="text-slate-400 font-bold text-base">/mo</span>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {[
                "Unlimited Claims",
                "Full Vault Access",
                "Maintenance Reminders"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => { onUpdateProfile?.({ plan: 'BASIC' }); onClose(); }}
              className="w-full py-5 bg-[#f1f5f9] text-[#1e3a8a] rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
            >
              Choose Basic
            </button>
          </div>

          {/* Premium Advocacy Card */}
          <div className="p-8 lg:p-10 bg-[#1e3a8a] text-white rounded-[40px] relative flex flex-col h-full shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-1/2 translate-x-1/2">
              <span className="px-6 py-2 bg-[#0ea5e9] text-white rounded-b-[16px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Best Value</span>
            </div>

            <h4 className="font-bold text-2xl mb-4 mt-4">Premium Advocacy</h4>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black">$499</span>
              <span className="text-blue-300 font-bold text-base">/yr</span>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-[13px] font-bold text-blue-50">
                <Zap className="w-4 h-4 text-[#0ea5e9] fill-current shrink-0" />
                Everything in Basic
              </li>
              <li className="flex items-center gap-3 text-[13px] font-bold text-blue-50">
                <Zap className="w-4 h-4 text-[#0ea5e9] fill-current shrink-0" />
                2 Months FREE Included
              </li>
              <li className="flex items-center gap-3 text-[13px] font-bold text-blue-50">
                <Zap className="w-4 h-4 text-[#0ea5e9] fill-current shrink-0" />
                Priority Advocacy
              </li>
            </ul>

            <button
              onClick={() => { onUpdateProfile?.({ plan: 'PREMIUM' }); onClose(); }}
              className="w-full py-5 bg-[#0ea5e9] text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-sky-400 transition-all active:scale-95 shadow-xl shadow-sky-500/20"
            >
              Get Premium Annual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StartNewClaimModal: React.FC<{
  user: UserProfile;
  initialData?: Claim | null;
  onClose: () => void;
  onSaveClaim: (c: Claim) => void;
  onViewDoc: (url: string) => void;
}> = ({ user, initialData, onClose, onSaveClaim, onViewDoc }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'SELECTION' | 'DETAILS'>(initialData ? 'DETAILS' : 'SELECTION');
  const [selectedType, setSelectedType] = useState<ClaimType>(initialData?.type || ClaimType.HOME);

  const [address, setAddress] = useState(initialData?.propertyAddress || '');
  const [propertyType, setPropertyType] = useState(initialData?.propertyType || 'Single Family');
  const [isPrimary, setIsPrimary] = useState(initialData?.isPrimaryResidence ?? true);
  const [subject, setSubject] = useState(initialData?.title || '');
  const [problemDate, setProblemDate] = useState('');
  const [priority, setPriority] = useState<ClaimPriority>(initialData?.priority || ClaimPriority.MEDIUM);
  const [description, setDescription] = useState(initialData?.description || '');

  const [newDocuments, setNewDocuments] = useState<ClaimDocument[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<ClaimDocument[]>(initialData?.documents || []);
  const [isInitializing, setIsInitializing] = useState(false);

  const contractInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const options = [
    {
      type: ClaimType.HOME,
      title: 'Home Warranty Claim',
      desc: 'Broken AC, plumbing issues, or appliance repairs.',
      icon: HomeIcon,
      color: 'bg-blue-50 text-blue-900',
      iconColor: 'text-[#1e3a8a]',
    },
    {
      type: ClaimType.AUTO,
      title: 'Auto Warranty Claim',
      desc: 'Engine trouble, transmission, or electronic failures.',
      icon: Car,
      color: 'bg-[#f0f9ff] text-[#0c4a6e]',
      iconColor: 'text-[#0284c7]',
    },
    {
      type: ClaimType.BUYING_ASSISTANCE,
      title: 'Auto Buying Assistance',
      desc: 'Expert help negotiating your next vehicle purchase.',
      icon: ShoppingBag,
      color: 'bg-[#fff7ed] text-[#7c2d12]',
      iconColor: 'text-[#ea580c]',
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewDocuments(prev => [...prev, { name: file.name, url: reader.result as string, type }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInitializing(true);

    const finalClaim: Claim = {
      id: initialData?.id || 'CLM-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: user.id,
      type: selectedType,
      status: initialData?.status || ClaimStatus.PENDING,
      priority,
      title: subject,
      description: initialData ? description : `${description} | Problem Started: ${problemDate}`,
      propertyAddress: address,
      propertyType,
      isPrimaryResidence: isPrimary,
      documents: [...existingDocuments, ...newDocuments],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    onSaveClaim(finalClaim);
    setIsInitializing(false);
    onClose();
  };

  if (step === 'DETAILS') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
        <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-10 pt-8 pb-4 flex justify-between items-center bg-white z-10 sticky top-0">
            {!initialData && (
              <button
                onClick={() => setStep('SELECTION')}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-900 transition-colors text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to selection
              </button>
            )}
            <div className="flex-1"></div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-10 pb-8 overflow-y-auto no-scrollbar">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-slate-900 brand-font">{initialData ? 'Manage Advocacy Case' : 'Claim Details'}</h3>
              <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Advocacy Type: <span className="text-blue-900">{selectedType}</span></p>
            </div>

            <form onSubmit={handleInitialize} className="space-y-8 pb-6">
              <div className="bg-[#f8fbff] rounded-[32px] p-8 border border-blue-50 space-y-6">
                <div className="flex items-center gap-2 text-blue-900/40 font-black text-[10px] uppercase tracking-widest mb-4">
                  <Building2 className="w-4 h-4" /> Property Verification
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full street address, city, state"
                      className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
                    <div className="relative">
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 appearance-none text-sm font-medium"
                      >
                        <option>Single Family</option>
                        <option>Condo / Townhouse</option>
                        <option>Multi-Family</option>
                        <option>Commercial</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Residence?</label>
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-100">
                      <button type="button" onClick={() => setIsPrimary(true)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${isPrimary ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-slate-400'}`}>Yes</button>
                      <button type="button" onClick={() => setIsPrimary(false)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!isPrimary ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-slate-400'}`}>No</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-700 uppercase ml-1">Issue Subject</label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Denied HVAC replacement claim"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 text-sm font-medium"
                  />
                </div>
                {!initialData && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date problem began</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        required
                        type="date"
                        value={problemDate}
                        onChange={(e) => setProblemDate(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 text-sm font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                <div className="flex gap-4">
                  {[
                    { label: 'Low', value: ClaimPriority.LOW, color: 'bg-emerald-50 text-emerald-500 border-emerald-100', active: 'bg-emerald-500 text-white border-emerald-500' },
                    { label: 'Medium', value: ClaimPriority.MEDIUM, color: 'bg-amber-50 text-amber-500 border-emerald-100', active: 'bg-amber-500 text-white border-amber-500' },
                    { label: 'High', value: ClaimPriority.HIGH, color: 'bg-red-50 text-red-500 border-red-100', active: 'bg-red-500 text-white border-red-500' }
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`flex-1 py-4 rounded-2xl border text-sm font-bold transition-all ${priority === p.value ? p.active : p.color}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Narrative</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide specific details about the issue..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 text-sm font-medium resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidence & Assets</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="file" className="hidden" ref={contractInputRef} multiple onChange={(e) => handleFileUpload(e, 'Contract')} />
                  <input type="file" className="hidden" ref={photoInputRef} multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'Evidence')} />

                  <button
                    type="button"
                    onClick={() => contractInputRef.current?.click()}
                    className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-100 rounded-2xl text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all"
                  >
                    <FileText className="w-4 h-4 text-blue-500" /> Upload More Docs
                  </button>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-100 rounded-2xl text-slate-500 font-bold text-xs hover:bg-slate-50 transition-all"
                  >
                    <Camera className="w-4 h-4 text-sky-500" /> evidence photos
                  </button>
                </div>

                {(existingDocuments.length > 0 || newDocuments.length > 0) && (
                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Claim Document History</p>
                    {existingDocuments.map((doc, i) => (
                      <div key={`existing-${i}`} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="truncate max-w-[200px] font-bold text-slate-700">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => onViewDoc(doc.url)} className="text-blue-600 font-bold hover:underline uppercase text-[9px] tracking-widest">View Data</button>
                          <button type="button" onClick={() => setExistingDocuments(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    {newDocuments.map((doc, i) => (
                      <div key={`new-${i}`} className="flex items-center justify-between text-xs bg-blue-50 p-3 rounded-xl border border-blue-100 animate-pulse">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                          <span className="truncate max-w-[200px] font-bold text-blue-700">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => onViewDoc(doc.url)} className="text-blue-600 font-bold hover:underline uppercase text-[9px] tracking-widest">Preview</button>
                          <button type="button" onClick={() => setNewDocuments(prev => prev.filter((_, idx) => idx !== i))} className="text-blue-900/30 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isInitializing}
                className="w-full py-5 bg-[#1e3a8a] text-white rounded-3xl font-bold text-base hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 group"
              >
                {isInitializing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{initialData ? 'Update Advocacy Records' : 'Initialize Professional Advocacy'} <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl p-10 lg:p-14 relative">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/10">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-bold text-[#1e293b] brand-font mb-2 tracking-tight">Start a New Claim</h3>
          <p className="text-slate-500 font-medium text-lg">What do you need advocacy for today?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                if (opt.type === ClaimType.HOME) {
                  setSelectedType(ClaimType.HOME);
                  setStep('DETAILS');
                } else {
                  navigate(opt.type === ClaimType.AUTO ? '/auto-warranty-claims' : '/auto-buying-assistance');
                  onClose();
                }
              }}
              className={`${opt.color} p-10 rounded-[40px] text-left border border-white transition-all hover:scale-[1.03] active:scale-95 flex flex-col items-start gap-5 h-full group`}
            >
              <div className={`p-4 bg-white rounded-[24px] shadow-sm ${opt.iconColor} group-hover:scale-110 transition-transform`}>
                <opt.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-lg tracking-tight mb-2">{opt.title}</h4>
                <p className="text-xs leading-relaxed opacity-70 font-medium">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Warranty Modal for Uploading/Editing
const AddEditWarrantyModal: React.FC<{
  user: UserProfile;
  initialData: Warranty | null;
  onClose: () => void;
  onSave: (w: Warranty) => void;
}> = ({ user, initialData, onClose, onSave }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [provider, setProvider] = useState(initialData?.provider || '');
  const [planName, setPlanName] = useState(initialData?.planName || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [type, setType] = useState<'HOME' | 'AUTO'>(initialData?.type || 'HOME');
  const [expirationDate, setExpirationDate] = useState(initialData?.expirationDate || '');
  const [documentUrl, setDocumentUrl] = useState(initialData?.documentUrl || '');
  const [fileName, setFileName] = useState(initialData?.documentUrl ? 'Attached Document' : '');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Artificial delay for feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedWarranty: Warranty = {
      id: initialData?.id || 'WNT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: user.id,
      title,
      provider,
      planName,
      startDate,
      expirationDate,
      isActive,
      type,
      documentUrl,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSave(updatedWarranty);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative overflow-y-auto max-h-[95vh] no-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
            {initialData ? <FileEdit className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 brand-font">{initialData ? 'Edit Warranty' : 'Upload to Vault'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Document Title</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold"
              placeholder="e.g. My Home Protection Plan"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Warranty Provider Name</label>
              <input
                required
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold"
                placeholder="e.g. American Home Shield"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Warranty Plan Name</label>
              <input
                required
                value={planName}
                onChange={e => setPlanName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold"
                placeholder="e.g. ShieldGold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Category</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'HOME' | 'AUTO')}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-700 appearance-none"
              >
                <option value="HOME">Home Warranty</option>
                <option value="AUTO">Auto Warranty</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Is warranty active?</label>
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                <button type="button" onClick={() => setIsActive(true)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-slate-400'}`}>Yes</button>
                <button type="button" onClick={() => setIsActive(false)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!isActive ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400'}`}>No</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Warranty Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-700"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Warranty End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  required
                  type="date"
                  value={expirationDate}
                  onChange={e => setExpirationDate(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Document File</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-6 border-2 border-dashed rounded-3xl transition-all cursor-pointer text-center group ${documentUrl ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-400'
                }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-2">
                {documentUrl ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <p className="text-sm font-bold text-emerald-700 truncate max-w-full px-4">{fileName}</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setDocumentUrl(''); setFileName(''); }} className="text-[10px] font-black text-emerald-600/50 hover:text-emerald-600 uppercase tracking-widest">Remove and Replace</button>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <p className="text-sm font-bold text-slate-400">Click to upload contract PDF or Image</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-5 bg-[#1e3a8a] text-white rounded-2xl font-black text-lg hover:bg-sky-600 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'Save Changes' : 'Save to Secure Vault')}
            {!isProcessing && <Lock className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

// Document Viewer Modal
const DocumentViewerModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Paperclip className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 brand-font">Vault Document Viewer</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all bg-slate-50 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-8">
          {url.startsWith('data:application/pdf') ? (
            <embed src={url} type="application/pdf" className="w-full h-full rounded-2xl shadow-xl" />
          ) : (
            <img src={url} alt="Warranty Document" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
          )}
        </div>
        <div className="p-6 bg-white border-t border-slate-100 flex justify-center gap-4">
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = url;
              link.download = 'warranty-advocates-document';
              link.click();
            }}
            className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-sky-600 transition-all"
          >
            Download Document
          </button>
          <button onClick={onClose} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
