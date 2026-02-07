
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  X,
  Clock,
  Zap,
  DollarSign,
  Globe,
  Plus,
  Filter,
  Activity,
  UserCheck,
  Building,
  ChevronRight,
  ShieldCheck,
  History,
  Home,
  Mail,
  MapPin,
  Type,
  FileEdit,
  Trash2,
  Eye,
  Layout,
  Database,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Lock,
  Smartphone,
  ExternalLink,
  Layers,
  HelpCircle,
  Move,
  FileText,
  Tag,
  PenTool,
  Globe2,
  AlertCircle,
  Hash,
  Paperclip,
  Briefcase,
  User as UserIcon,
  Building2,
  Calendar,
  Car,
  PieChart,
  BarChart3,
  TrendingDown,
  Wallet,
  Maximize2,
  Upload,
  PanelTop,
  PanelBottom
} from 'lucide-react';
import { UserProfile, UserRole, ClaimStatus, Claim, BlogPost, CMSPage, CMSPricingPlan, CMSFAQ, CMSSEO, CMSSettings, CMSMedia, CMSSection, ClaimType } from '../../types';
import { INITIAL_SETTINGS } from '../../constants';

interface AdminDashboardProps {
  user: UserProfile;
  appSettings: CMSSettings;
  onUpdateSettings: (s: CMSSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, appSettings, onUpdateSettings }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Global Data State
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [pricing, setPricing] = useState<CMSPricingPlan[]>([]);
  const [faqs, setFaqs] = useState<CMSFAQ[]>([]);
  const [seo, setSeo] = useState<CMSSEO[]>([]);
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [globalUsers, setGlobalUsers] = useState<UserProfile[]>([]);
  const [globalClaims, setGlobalClaims] = useState<Claim[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // If EMPLOYEE lands on root portal (Overview), redirect them to Knowledge Base (located at pricing path)
    if (user.role === UserRole.EMPLOYEE && (path === '/admin-portal' || path === '/admin-portal/')) {
      navigate('/admin-portal/pricing');
    }
  }, [user.role, path, navigate]);

  useEffect(() => {
    loadCMSData();
  }, [path]);

  const loadCMSData = () => {
    setPages(JSON.parse(localStorage.getItem('wa_cms_pages') || '[]'));
    setPricing(JSON.parse(localStorage.getItem('wa_cms_pricing') || '[]'));
    setFaqs(JSON.parse(localStorage.getItem('wa_cms_faqs') || '[]'));
    setSeo(JSON.parse(localStorage.getItem('wa_cms_seo') || '[]'));
    setMedia(JSON.parse(localStorage.getItem('wa_cms_media') || '[]'));
    setBlogs(JSON.parse(localStorage.getItem('wa_global_blogs') || '[]'));
    setGlobalUsers(JSON.parse(localStorage.getItem('wa_registered_users') || '[]'));
    setGlobalClaims(JSON.parse(localStorage.getItem('wa_global_claims') || '[]'));
    setActivities(JSON.parse(localStorage.getItem('wa_global_activities') || '[]'));
  };

  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [editingPlan, setEditingPlan] = useState<CMSPricingPlan | null>(null);
  const [editingFaq, setEditingFaq] = useState<CMSFAQ | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [viewingClaim, setViewingClaim] = useState<Claim | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogSearch, setBlogSearch] = useState('');
  const [claimSearch, setClaimSearch] = useState('');

  const totalUsersCount = globalUsers.length;
  const activeSubsCount = globalUsers.filter(u => u.plan === 'BASIC' || u.plan === 'PREMIUM').length;
  const totalClaimsCount = globalClaims.length;
  const pendingClaimsCount = globalClaims.filter(c => c.status === ClaimStatus.PENDING || c.status === ClaimStatus.PROCESSING).length;
  const approvedClaimsCount = globalClaims.filter(c => c.status === ClaimStatus.APPROVED).length;
  const rejectedClaimsCount = globalClaims.filter(c => c.status === ClaimStatus.REJECTED).length;

  const monthlyRevenue = globalUsers.reduce((acc, curr) => {
    if (curr.plan === 'BASIC') return acc + 49.99;
    if (curr.plan === 'PREMIUM') return acc + (499 / 12);
    return acc;
  }, 0);

  const logActivity = (detail: string) => {
    const acts = JSON.parse(localStorage.getItem('wa_global_activities') || '[]');
    acts.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.fullName,
      action: 'CMS_UPDATE',
      detail,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('wa_global_activities', JSON.stringify(acts.slice(0, 50)));
    setActivities(acts.slice(0, 50));
  };

  const handlePageUpdate = (page: CMSPage) => {
    const updated = pages.map(p => p.slug === page.slug ? page : p);
    localStorage.setItem('wa_cms_pages', JSON.stringify(updated));
    setPages(updated);
    logActivity(`Published changes to page: ${page.title}`);
    setEditingPage(null);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: CMSMedia = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          name: file.name,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };
        const updated = [newItem, ...media];
        localStorage.setItem('wa_cms_media', JSON.stringify(updated));
        setMedia(updated);
        logActivity(`Uploaded media asset: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteMedia = (id: string) => {
    const updated = media.filter(m => m.id !== id);
    localStorage.setItem('wa_cms_media', JSON.stringify(updated));
    setMedia(updated);
  };

  const handleSavePricing = (plan: CMSPricingPlan) => {
    let updated;
    if (pricing.find(p => p.id === plan.id)) {
      updated = pricing.map(p => p.id === plan.id ? plan : p);
    } else {
      updated = [...pricing, plan];
    }
    localStorage.setItem('wa_cms_pricing', JSON.stringify(updated));
    setPricing(updated);
    logActivity(`Updated pricing plan: ${plan.name}`);
    setEditingPlan(null);
    setIsAddingPlan(false);
  };

  const handleSaveFaq = (faq: CMSFAQ) => {
    let updated;
    if (faqs.find(f => f.id === faq.id)) {
      updated = faqs.map(f => f.id === faq.id ? faq : f);
    } else {
      updated = [...faqs, faq];
    }
    localStorage.setItem('wa_cms_faqs', JSON.stringify(updated));
    setFaqs(updated);
    logActivity(`Updated FAQ item: ${faq.question.substring(0, 30)}...`);
    setEditingFaq(null);
    setIsAddingFaq(false);
  };

  const handleSaveBlog = (post: BlogPost) => {
    let updated;
    if (blogs.find(b => b.id === post.id)) {
      updated = blogs.map(b => b.id === post.id ? post : b);
    } else {
      updated = [post, ...blogs];
    }
    localStorage.setItem('wa_global_blogs', JSON.stringify(updated));
    setBlogs(updated);
    logActivity(`${post.status === 'PUBLISHED' ? 'Published' : 'Saved Draft of'} blog: ${post.title}`);
    setEditingBlog(null);
    setIsAddingBlog(false);
  };

  const deleteBlog = (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) return;
    const updated = blogs.filter(b => b.id !== id);
    localStorage.setItem('wa_global_blogs', JSON.stringify(updated));
    setBlogs(updated);
    logActivity('Deleted blog post');
  };

  const updateClaimStatus = (id: string, status: ClaimStatus) => {
    const updated = globalClaims.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c);
    localStorage.setItem('wa_global_claims', JSON.stringify(updated));
    setGlobalClaims(updated);
    logActivity(`Updated claim ${id} status to ${status}`);
    setViewingClaim(null);
  };

  const renderOverview = () => (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Global Enterprise Metrics</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time business intelligence and advocacy tracking.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Platform Users', value: totalUsersCount, icon: Users, color: 'text-sky-400', bg: 'bg-sky-400/10' },
          { label: 'Active Subscriptions', value: activeSubsCount, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Global Claims Volume', value: totalClaimsCount, icon: ClipboardCheck, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Projected MRR', value: `$${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Wallet, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon className="w-24 h-24 rotate-12" />
            </div>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/40 rounded-[48px] border border-white/5 overflow-hidden flex flex-col">
           <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <PieChart className="w-5 h-5 text-amber-500" /> Claims Lifecycle
              </h3>
           </div>
           <div className="p-8 space-y-6 flex-grow">
              {[
                { label: 'Pending / Processing', count: pendingClaimsCount, color: 'bg-amber-500', text: 'text-amber-500' },
                { label: 'Approved Cases', count: approvedClaimsCount, color: 'bg-emerald-500', text: 'text-emerald-500' },
                { label: 'Rejected / Stalled', count: rejectedClaimsCount, color: 'bg-red-500', text: 'text-red-500' },
              ].map((status, i) => {
                const percentage = totalClaimsCount > 0 ? (status.count / totalClaimsCount) * 100 : 0;
                return (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status.label}</p>
                        <p className={`text-sm font-bold ${status.text}`}>{status.count} ({Math.round(percentage)}%)</p>
                     </div>
                     <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${status.color} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="bg-slate-900/40 rounded-[48px] border border-white/5 overflow-hidden flex flex-col lg:col-span-2">
           <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <BarChart3 className="w-5 h-5 text-indigo-500" /> Revenue Stream
              </h3>
           </div>
           <div className="p-10 flex flex-col justify-center items-center text-center">
              <DollarSign className="w-12 h-12 text-emerald-500 mb-4" />
              <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-tight">Consolidated Monthly Revenue</p>
              <p className="text-5xl font-black text-white tracking-tighter">${monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (path) {
      case '/admin-portal/claims':
        return renderClaimsManager();
      case '/admin-portal/pages': 
        return renderPagesManager();
      case '/admin-portal/blogs': 
        return renderBlogsManager();
      case '/admin-portal/pricing': 
        return renderPricingManager();
      case '/admin-portal/media': 
        return renderMediaLibrary();
      case '/admin-portal/header':
        return <HeaderSystemManager current={appSettings} media={media} onSave={(s) => { onUpdateSettings(s); logActivity('Updated Header System Logic'); }} />;
      case '/admin-portal/footer':
        return <FooterSystemManager current={appSettings} media={media} onSave={(s) => { onUpdateSettings(s); logActivity('Updated Footer System Logic'); }} />;
      default: 
        return renderOverview();
    }
  };

  const renderClaimsManager = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Claims & User Audit</h2>
          <div className="relative w-full md:w-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input type="text" placeholder="Search case files..." value={claimSearch} onChange={(e) => setClaimSearch(e.target.value)} className="w-full md:w-80 pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium" />
          </div>
       </div>

       <div className="bg-slate-900/50 rounded-[40px] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
             <table className="w-full text-left min-w-[1100px]">
                <thead className="bg-white/5 border-b border-white/5">
                   <tr>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Profile</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Case Description</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan & Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Urgency</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {globalClaims.filter(c => c.title.toLowerCase().includes(claimSearch.toLowerCase())).map((claim) => {
                     const associatedUser = globalUsers.find(u => u.id === claim.userId);
                     return (
                       <tr key={claim.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                   {associatedUser?.photoUrl ? <img src={associatedUser.photoUrl} className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-slate-600" />}
                                </div>
                                <div className="min-w-0">
                                   <p className="text-sm font-bold text-white leading-none truncate">{associatedUser?.fullName || 'Guest Submitter'}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{associatedUser?.email || 'N/A'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-sm font-bold text-slate-300 truncate max-w-[250px]">{claim.title}</p>
                             <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">REF: {claim.id}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="space-y-2">
                                <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${associatedUser?.plan === 'PREMIUM' ? 'bg-sky-500/10 text-sky-400 border-sky-400/20' : 'bg-slate-800 text-slate-400 border-white/5'}`}>
                                   Tier: {associatedUser?.plan || 'GUEST'}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                                   <div className={`w-1.5 h-1.5 rounded-full ${claim.status === ClaimStatus.APPROVED ? 'bg-emerald-500' : claim.status === ClaimStatus.REJECTED ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                   {claim.status}
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${claim.priority === 'HIGH' ? 'text-red-400' : claim.priority === 'MEDIUM' ? 'text-amber-400' : 'text-slate-500'}`}>
                                {claim.priority}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button onClick={() => setViewingClaim(claim)} className="px-4 py-2.5 bg-blue-600/10 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Audit File</button>
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
       </div>

       {viewingClaim && (
         <ClaimDetailModal claim={viewingClaim} user={globalUsers.find(u => u.id === viewingClaim.userId) || null} onClose={() => setViewingClaim(null)} onUpdateStatus={(s) => updateClaimStatus(viewingClaim.id, s)} />
       )}
    </div>
  );

  const renderPagesManager = () => (
    <div className="space-y-8 animate-fade-in">
       <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Site Page Manager</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.slug} className="bg-slate-900/50 p-10 rounded-[48px] border border-white/5 hover:border-blue-500/40 transition-all group relative overflow-hidden">
               <h3 className="text-2xl font-bold text-white mb-2">{page.title}</h3>
               <p className="text-xs text-slate-500 mb-12 font-bold tracking-widest">ENDPOINT: /{page.slug === 'home' ? '' : page.slug}</p>
               <div className="flex items-center gap-3">
                  <button onClick={() => setEditingPage(page)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all">Configure Block Content</button>
               </div>
            </div>
          ))}
       </div>
       {editingPage && <PageEditorModal page={editingPage} onClose={() => setEditingPage(null)} onSave={handlePageUpdate} media={media} />}
    </div>
  );

  const renderBlogsManager = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Editorial Archive</h2>
          <button onClick={() => setIsAddingBlog(true)} className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> Compose Post
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div key={post.id} className="bg-slate-900/50 rounded-[48px] border border-white/5 overflow-hidden flex flex-col group relative">
               <div className="p-10 flex-grow">
                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-slate-500 mb-8 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-2">
                     <button onClick={() => setEditingBlog(post)} className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5"><FileEdit className="w-4 h-4" /></button>
                     <button onClick={() => deleteBlog(post.id)} className="p-3 bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-red-500/5"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>
          ))}
       </div>
       {(editingBlog || isAddingBlog) && <BlogEditorModal post={editingBlog} user={user} media={media} onClose={() => { setEditingBlog(null); setIsAddingBlog(false); }} onSave={handleSaveBlog} />}
    </div>
  );

  const renderPricingManager = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Revenue & FAQ</h2>
          <div className="flex gap-4">
             <button onClick={() => setIsAddingFaq(true)} className="px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Add Node</button>
             {user.role === UserRole.ADMIN && (
               <button onClick={() => setIsAddingPlan(true)} className="px-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50">+ New Plan</button>
             )}
          </div>
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
             {pricing.sort((a,b) => a.order - b.order).map((plan) => (
               <div key={plan.id} className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 flex items-center justify-between">
                  <div className="min-w-0">
                     <p className="text-lg font-bold text-white tracking-tight truncate">{plan.name}</p>
                     <p className="text-[10px] text-slate-500 font-black uppercase mt-1.5">${plan.priceMonthly}/MO • ${plan.priceYearly}/YR</p>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setEditingPlan(plan)} className="p-3 bg-white/5 text-slate-500 hover:text-white rounded-xl"><FileEdit className="w-4 h-4" /></button>
                  </div>
               </div>
             ))}
          </div>
          <div className="space-y-6">
             {faqs.sort((a,b) => a.order - b.order).map((faq) => (
               <div key={faq.id} className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 flex items-center justify-between">
                  <p className="text-sm font-bold text-white truncate">{faq.question}</p>
                  <div className="flex gap-2">
                     <button onClick={() => setEditingFaq(faq)} className="p-3 bg-white/5 text-slate-500 hover:text-white rounded-xl"><FileEdit className="w-4 h-4" /></button>
                  </div>
               </div>
             ))}
          </div>
       </div>
       {(editingPlan || isAddingPlan) && <PricingEditorModal plan={editingPlan} onClose={() => { setEditingPlan(null); setIsAddingPlan(false); }} onSave={handleSavePricing} />}
       {(editingFaq || isAddingFaq) && <FAQEditorModal faq={editingFaq} onClose={() => { setEditingFaq(null); setIsAddingFaq(false); }} onSave={handleSaveFaq} />}
    </div>
  );

  const renderMediaLibrary = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Enterprise Media Vault</h2>
          <label className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 cursor-pointer">
             <Plus className="w-4 h-4 inline mr-2" /> Register New Asset
             <input type="file" className="hidden" onChange={handleMediaUpload} />
          </label>
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {media.map((item) => (
            <div key={item.id} className="aspect-square bg-slate-900 border border-white/5 rounded-[40px] overflow-hidden group relative">
               <img src={item.url} alt={item.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" />
               <button onClick={() => deleteMedia(item.id)} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

const HeaderSystemManager: React.FC<{ current: CMSSettings; media: CMSMedia[]; onSave: (s: CMSSettings) => void }> = ({ current, media, onSave }) => {
   const [form, setForm] = useState(current);

   const handleDirectLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         setForm({ ...form, logoUrl: reader.result as string });
       };
       reader.readAsDataURL(file);
     }
   };

   return (
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-40">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Header Management System</h2>
               <p className="text-slate-500 text-sm mt-1">Control the global top navigation, main brand assets, and contact hotlines.</p>
            </div>
            <button onClick={() => onSave(form)} className="px-10 py-4 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-500 shadow-2xl flex items-center gap-3">
               <Save className="w-5 h-5" /> Deploy Header Logic
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-slate-900/50 p-10 rounded-[48px] border border-white/5 space-y-10">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Main Logo Asset</label>
                  <div className="relative group">
                     <div className="absolute inset-0 bg-blue-600/5 border-2 border-dashed border-white/10 rounded-3xl group-hover:border-blue-500/40 transition-all"></div>
                     <div className="relative p-10 flex flex-col items-center justify-center text-center">
                        <Upload className="w-8 h-8 text-slate-600 mb-4" />
                        <p className="text-[10px] font-bold text-slate-500 mb-6 uppercase">Upload Primary Logo</p>
                        <input type="file" accept="image/*" onChange={handleDirectLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <button type="button" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest">Select Node Asset</button>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo Display Width</label>
                    <span className="text-[10px] font-black text-sky-400 uppercase">{form.logoWidth}px</span>
                  </div>
                  <input type="range" min="80" max="500" step="5" value={form.logoWidth} onChange={e => setForm({...form, logoWidth: Number(e.target.value)})} className="w-full accent-sky-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
               </div>

               <div className="space-y-8 pt-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hotline Display</label>
                     <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-white font-bold" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Support Endpoint</label>
                     <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-white font-bold" />
                  </div>
               </div>
            </div>

            <div className="bg-white/5 rounded-[48px] p-10 border border-white/10 flex flex-col items-center justify-center text-center sticky top-10">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-12">Header Preview Simulation</p>
               <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-200/20 w-full flex items-center justify-center min-h-[200px]">
                  {form.logoUrl ? <img src={form.logoUrl} style={{ width: `${form.logoWidth}px` }} className="max-w-full h-auto object-contain" alt="Logo" /> : <ImageIcon className="w-12 h-12 text-slate-200" />}
               </div>
               <p className="text-[10px] text-slate-600 font-bold uppercase mt-8 tracking-widest leading-loose">Asset rendering across<br/>Global Navigation Nodes.</p>
            </div>
         </div>
      </div>
   );
};

const FooterSystemManager: React.FC<{ current: CMSSettings; media: CMSMedia[]; onSave: (s: CMSSettings) => void }> = ({ current, media, onSave }) => {
   const [form, setForm] = useState(current);

   const handleFooterLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         setForm({ ...form, footerLogoUrl: reader.result as string });
       };
       reader.readAsDataURL(file);
     }
   };

   return (
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-40">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white brand-font uppercase tracking-tight">Footer Management System</h2>
               <p className="text-slate-500 text-sm mt-1">Control secondary brand assets, social hubs, and legal disclaimers.</p>
            </div>
            <button onClick={() => onSave(form)} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-2xl flex items-center gap-3">
               <Save className="w-5 h-5" /> Deploy Footer Logic
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-slate-900/50 p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl md:col-span-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Footer-Specific Logo</label>
                        <div className="relative group">
                           <div className="absolute inset-0 bg-indigo-600/5 border-2 border-dashed border-white/10 rounded-3xl group-hover:border-indigo-500/40 transition-all"></div>
                           <div className="relative p-10 flex flex-col items-center justify-center text-center">
                              <PanelBottom className="w-8 h-8 text-slate-600 mb-4" />
                              <p className="text-[10px] font-bold text-slate-500 mb-6 uppercase">Upload Secondary Logo</p>
                              <input type="file" accept="image/*" onChange={handleFooterLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                              <button type="button" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest">Select Footer Asset</button>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Footer Logo Width</label>
                          <span className="text-[10px] font-black text-indigo-400 uppercase">{form.footerLogoWidth || 140}px</span>
                        </div>
                        <input type="range" min="50" max="400" step="5" value={form.footerLogoWidth || 140} onChange={e => setForm({...form, footerLogoWidth: Number(e.target.value)})} className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
                     </div>
                  </div>
                  <div className="bg-slate-800 rounded-[40px] p-10 border border-white/10 flex flex-col items-center justify-center text-center">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10">Secondary Asset Preview</p>
                     <div className="flex items-center justify-center min-h-[150px]">
                        {/* Ensure preview is in full color without grayscale or low opacity */}
                        {form.footerLogoUrl ? <img src={form.footerLogoUrl} style={{ width: `${form.footerLogoWidth || 140}px` }} className="max-w-full h-auto opacity-100" alt="Footer Logo" /> : <ImageIcon className="w-12 h-12 text-slate-700" />}
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900/50 p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-indigo-400 rounded-full"></div> Social Logic connectors
               </h4>
               <div className="space-y-6">
                  {Object.keys(form.socials).map((key) => (
                    <div key={key} className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 capitalize">{key} Target</label>
                       <input value={(form.socials as any)[key]} onChange={e => setForm({...form, socials: { ...form.socials, [key]: e.target.value }})} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-slate-200 font-medium text-sm" placeholder="https://..." />
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900/50 p-10 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
               <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-emerald-400 rounded-full"></div> Narrative & Compliance
               </h4>
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Footer Identity Narrative</label>
                     <textarea rows={5} value={form.footerText} onChange={e => setForm({...form, footerText: e.target.value})} className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[32px] text-slate-300 resize-none leading-relaxed text-sm" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Disclaimer Logic</label>
                     <textarea rows={4} value={form.copyrightText} onChange={e => setForm({...form, copyrightText: e.target.value})} className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-[32px] text-slate-300 resize-none leading-relaxed text-sm" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

const ClaimDetailModal: React.FC<{ claim: Claim; user: UserProfile | null; onClose: () => void; onUpdateStatus: (s: ClaimStatus) => void }> = ({ claim, user, onClose, onUpdateStatus }) => {
   return (
      <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/90 backdrop-blur-md animate-fade-in">
         <div className="bg-slate-900 w-full max-w-6xl h-full shadow-2xl border-l border-white/10 flex flex-col no-scrollbar overflow-y-auto">
            <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900 z-50">
               <div>
                  <h2 className="text-2xl font-bold text-white brand-font uppercase tracking-tight">Case Intelligence: {claim.id}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1.5">Modified {new Date(claim.updatedAt).toLocaleString()}</p>
               </div>
               <button onClick={onClose} className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-2xl border border-white/5"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 pb-32">
               <div className="space-y-8">
                  <div className="bg-white/5 rounded-[48px] p-10 border border-white/5 text-center">
                     <div className="w-32 h-32 rounded-full bg-slate-800 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                        {user?.photoUrl ? <img src={user.photoUrl} className="w-full h-full object-cover" /> : <UserIcon className="w-14 h-14 text-slate-700" />}
                     </div>
                     <h4 className="text-2xl font-bold text-white">{user?.fullName}</h4>
                     <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">{user?.email}</p>
                  </div>
                  <div className="bg-indigo-600/10 rounded-[48px] p-10 border border-indigo-500/20">
                     <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">Lifecycle Action</h5>
                     <div className="space-y-3">
                        {Object.values(ClaimStatus).map((status) => (
                           <button key={status} onClick={() => onUpdateStatus(status)} className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase border ${claim.status === status ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>{status}</button>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white/5 rounded-[60px] p-10 lg:p-14 border border-white/5">
                     <h3 className="text-3xl font-bold text-white mb-8">{claim.title}</h3>
                     <p className="text-slate-300 text-base leading-loose font-medium mb-12">{claim.description}</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {claim.documents?.map((doc, i) => (
                           <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[24px] flex items-center justify-between">
                              <p className="text-sm font-bold text-white truncate">{doc.name}</p>
                              <button onClick={() => window.open(doc.url)} className="p-2 text-sky-400"><ExternalLink className="w-5 h-5" /></button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

const BlogEditorModal: React.FC<{ post: BlogPost | null; user: UserProfile; media: CMSMedia[]; onClose: () => void; onSave: (p: BlogPost) => void }> = ({ post, user, media, onClose, onSave }) => {
  const [form, setForm] = useState<BlogPost>(post || {
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    imageAlt: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    status: 'DRAFT',
    authorId: user.id,
    authorName: user.fullName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/90 backdrop-blur-md animate-fade-in">
       <div className="bg-slate-900 w-full max-w-5xl h-full shadow-2xl border-l border-white/10 p-10 flex flex-col overflow-y-auto no-scrollbar">
          <div className="flex justify-between mb-10">
             <h2 className="text-2xl font-bold text-white brand-font">{post ? 'Edit Article' : 'New Article'}</h2>
             <button onClick={onClose} className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl"><X className="w-6 h-6" /></button>
          </div>
          <div className="space-y-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slug</label>
                <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-sky-400 font-bold" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Excerpt</label>
                <textarea rows={3} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 resize-none text-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Content</label>
                <textarea rows={12} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-slate-200 resize-none text-sm leading-loose" />
             </div>
             <button onClick={() => onSave({...form, updatedAt: new Date().toISOString()})} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest">Commit Data</button>
          </div>
       </div>
    </div>
  );
};

const PageEditorModal: React.FC<{ page: CMSPage; onClose: () => void; onSave: (p: CMSPage) => void; media: CMSMedia[] }> = ({ page, onClose, onSave, media }) => {
  const [sections, setSections] = useState<CMSSection[]>(page.sections);
  const [activeSection, setActiveSection] = useState<CMSSection | null>(null);

  const moveSection = (id: string, dir: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    if ((idx === 0 && dir === 'up') || (idx === sections.length - 1 && dir === 'down')) return;
    const newSections = [...sections];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    [newSections[idx], newSections[swapIdx]] = [newSections[swapIdx], newSections[idx]];
    setSections(newSections.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const addSection = (type: CMSSection['type']) => {
    const newSection: CMSSection = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: 'New Section',
      isVisible: true,
      order: sections.length + 1
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 w-full max-w-5xl h-full shadow-2xl border-l border-white/10 p-10 flex flex-col overflow-y-auto no-scrollbar">
         <div className="flex justify-between mb-10">
            <h2 className="text-2xl font-bold text-white brand-font">Block Config: {page.title}</h2>
            <button onClick={onClose} className="p-3 bg-white/5 text-slate-400 rounded-xl"><X className="w-6 h-6" /></button>
         </div>
         <div className="space-y-4 mb-10">
            <select onChange={(e) => addSection(e.target.value as any)} value="" className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-sky-400 font-bold uppercase tracking-widest">
               <option value="">+ Append New Block</option>
               <option value="hero">Hero Header</option>
               <option value="features">Features Hub</option>
               <option value="steps">Step Process</option>
               <option value="cta">Conversion CTA</option>
               <option value="text">Typography Node</option>
            </select>
            {sections.map((section, i) => (
              <div key={section.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 flex items-center justify-between group">
                 <div className="flex items-center gap-6">
                    <span className="text-slate-600 font-black">{i+1}</span>
                    <p className="text-white font-bold">{section.title}</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => moveSection(section.id, 'up')} className="p-2 text-slate-500 hover:text-white"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveSection(section.id, 'down')} className="p-2 text-slate-500 hover:text-white"><ArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => setActiveSection(section)} className="px-4 py-2 bg-white/5 text-slate-400 rounded-xl text-xs uppercase font-bold">Modify</button>
                    <button onClick={() => setSections(sections.filter(s => s.id !== section.id))} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>
            ))}
         </div>
         <button onClick={() => onSave({ ...page, sections, lastUpdated: new Date().toISOString() })} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest">Deploy Updates</button>
         {activeSection && <SectionEditorModal section={activeSection} onClose={() => setActiveSection(null)} onSave={(s) => setSections(sections.map(sec => sec.id === s.id ? s : sec))} media={media} />}
      </div>
    </div>
  );
};

const SectionEditorModal: React.FC<{ section: CMSSection; onClose: () => void; onSave: (s: CMSSection) => void; media: CMSMedia[] }> = ({ section, onClose, onSave, media }) => {
  const [form, setForm] = useState<CMSSection>(section);
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/95">
       <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[40px] p-10 relative overflow-y-auto max-h-[80vh]">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500"><X className="w-6 h-6" /></button>
          <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-widest">Module Config: {section.type}</h3>
          <form onSubmit={(e) => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtitle</label>
                <textarea rows={3} value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 resize-none" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Button Label</label>
                   <input value={form.buttonLabel} onChange={e => setForm({...form, buttonLabel: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Button URL</label>
                   <input value={form.buttonUrl} onChange={e => setForm({...form, buttonUrl: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
                </div>
             </div>
             <button type="submit" className="w-full py-5 bg-sky-600 text-white rounded-2xl font-bold uppercase tracking-widest">Apply Section Logic</button>
          </form>
       </div>
    </div>
  );
};

const PricingEditorModal: React.FC<{ plan: CMSPricingPlan | null; onClose: () => void; onSave: (p: CMSPricingPlan) => void }> = ({ plan, onClose, onSave }) => {
  const [form, setForm] = useState<CMSPricingPlan>(plan || {
    id: 'plan-' + Math.random().toString(36).substr(2, 5),
    name: '',
    priceMonthly: 0,
    priceYearly: 0,
    features: [],
    label: '',
    isActive: true,
    order: 0
  });
  const [featureInput, setFeatureInput] = useState('');
  const addFeature = () => { if (featureInput.trim()) { setForm({ ...form, features: [...form.features, featureInput.trim()] }); setFeatureInput(''); } };
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/95">
       <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[40px] p-10 relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500"><X className="w-6 h-6" /></button>
          <h3 className="text-xl font-bold text-white mb-10 uppercase tracking-tight">Tier Initialization</h3>
          <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="Tier Name" />
                <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="Badge" />
             </div>
             <div className="grid grid-cols-2 gap-6">
                <input type="number" required value={form.priceMonthly} onChange={e => setForm({...form, priceMonthly: Number(e.target.value)})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="Monthly $" />
                <input type="number" required value={form.priceYearly} onChange={e => setForm({...form, priceYearly: Number(e.target.value)})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="Annual $" />
             </div>
             <div className="space-y-4">
                <div className="flex gap-2">
                   <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="Add Entitlement..." />
                   <button type="button" onClick={addFeature} className="px-4 bg-sky-500 text-white rounded-xl font-black">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                   {form.features.map((f, i) => (
                     <span key={i} className="px-3 py-1.5 bg-white/5 text-white text-[10px] font-bold uppercase rounded-lg flex items-center gap-2">
                        {f} <X onClick={() => setForm({...form, features: form.features.filter((_, idx) => idx !== i)})} className="w-3 h-3 cursor-pointer text-red-500" />
                     </span>
                   ))}
                </div>
             </div>
             <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest">Mirror to Live Site</button>
          </form>
       </div>
    </div>
  );
};

const FAQEditorModal: React.FC<{ faq: CMSFAQ | null; onClose: () => void; onSave: (f: CMSFAQ) => void }> = ({ faq, onClose, onSave }) => {
  const [form, setForm] = useState<CMSFAQ>(faq || {
    id: 'faq-' + Math.random().toString(36).substr(2, 5),
    question: '',
    answer: '',
    isActive: true,
    order: 0
  });
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/95">
       <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[40px] p-10 relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500"><X className="w-6 h-6" /></button>
          <h3 className="text-xl font-bold text-white mb-10 uppercase tracking-tight">Support Node</h3>
          <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
             <input required value={form.question} onChange={e => setForm({...form, question: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="Query..." />
             <textarea rows={5} required value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 resize-none text-sm" placeholder="Answer..." />
             <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest">Communicate Node</button>
          </form>
       </div>
    </div>
  );
};

export default AdminDashboard;
