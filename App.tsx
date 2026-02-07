
import React, { useState, useEffect } from 'react';
/* Switched from BrowserRouter back to HashRouter for stable static hosting compatibility */
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  Plus,
  Home as HomeIcon,
  Car,
  Search,
  Users,
  Gift,
  Globe,
  Settings,
  Map,
  CreditCard,
  Database,
  Type,
  Layout,
  Share2,
  FolderLock,
  HelpCircle,
  PanelTop,
  PanelBottom
} from 'lucide-react';
import { UserRole, UserProfile, CMSPage, CMSPricingPlan, CMSFAQ, CMSSEO, CMSSettings } from './types';
import { INITIAL_PAGES, INITIAL_SETTINGS, INITIAL_PRICING, INITIAL_FAQS } from './constants';

// Pages
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AutoClaimFormPage from './pages/AutoClaimFormPage';
import HomeClaimFormPage from './pages/HomeClaimFormPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AutoBuyingAssistancePage from './pages/AutoBuyingAssistancePage';

// Dashboards
import UserDashboard from './pages/dashboards/UserDashboard';
import PartnerDashboard from './pages/dashboards/PartnerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // CMS State
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [settings, setSettings] = useState<CMSSettings>(INITIAL_SETTINGS);
  const [pricing, setPricing] = useState<CMSPricingPlan[]>([]);
  const [faqs, setFaqs] = useState<CMSFAQ[]>([]);
  const [seo, setSeo] = useState<CMSSEO[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('wa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const loadCMS = () => {
      const storedPages = localStorage.getItem('wa_cms_pages');
      const storedSettings = localStorage.getItem('wa_cms_settings');
      const storedPricing = localStorage.getItem('wa_cms_pricing');
      const storedFaqs = localStorage.getItem('wa_cms_faqs');
      const storedSeo = localStorage.getItem('wa_cms_seo');

      if (storedPages) setPages(JSON.parse(storedPages));
      else setPages(INITIAL_PAGES);

      if (storedSettings) setSettings(JSON.parse(storedSettings));
      else setSettings(INITIAL_SETTINGS);

      if (storedPricing) setPricing(JSON.parse(storedPricing));
      else {
        setPricing(INITIAL_PRICING);
        localStorage.setItem('wa_cms_pricing', JSON.stringify(INITIAL_PRICING));
      }

      if (storedFaqs) setFaqs(JSON.parse(storedFaqs));
      else {
        setFaqs(INITIAL_FAQS);
        localStorage.setItem('wa_cms_faqs', JSON.stringify(INITIAL_FAQS));
      }

      setSeo(storedSeo ? JSON.parse(storedSeo) : []);
    };

    loadCMS();
    setLoading(false);
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('wa_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wa_user');
  };

  const handleUpdateSettings = (updatedSettings: CMSSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem('wa_cms_settings', JSON.stringify(updatedSettings));
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedProfile };
    setUser(newUser);
    localStorage.setItem('wa_user', JSON.stringify(newUser));
    
    const registeredUsers: UserProfile[] = JSON.parse(localStorage.getItem('wa_registered_users') || '[]');
    const updatedUsers = registeredUsers.map(u => u.id === user.id ? newUser : u);
    if (!registeredUsers.find(u => u.id === user.id)) updatedUsers.push(newUser);
    localStorage.setItem('wa_registered_users', JSON.stringify(updatedUsers));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e3a8a] text-white">
        <ShieldCheck className="w-16 h-16 animate-pulse text-sky-400" />
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {!user && <Navbar settings={settings} />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage pages={pages} pricing={pricing} settings={settings} faqs={faqs} />} />
            <Route path="/how-it-works" element={<HowItWorksPage pages={pages} />} />
            <Route path="/services" element={<ServicesPage pages={pages} pricing={pricing} />} />
            <Route path="/faq" element={<FAQPage faqs={faqs} />} />
            <Route path="/contact" element={<ContactPage settings={settings} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
            <Route path="/auto-warranty-claims" element={<AutoClaimFormPage />} />
            <Route path="/home-warranty-claims" element={<HomeClaimFormPage />} />
            <Route path="/auto-buying-assistance" element={<AutoBuyingAssistancePage />} />
            <Route path="/staff-login" element={<AdminLoginPage onLogin={handleLogin} />} />

            <Route 
              path="/dashboard/*" 
              element={
                user && user.role !== UserRole.ADMIN && user.role !== UserRole.EMPLOYEE ? (
                  <DashboardLayout user={user} settings={settings} onLogout={handleLogout}>
                    <Routes>
                      <Route path="/" element={user.role === UserRole.USER ? <UserDashboard user={user} onUpdateProfile={handleUpdateProfile} /> : <PartnerDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/warranties" element={<UserDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/claims" element={user.role === UserRole.USER ? <UserDashboard user={user} onUpdateProfile={handleUpdateProfile} /> : <PartnerDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/customers" element={<PartnerDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/rewards" element={user.role === UserRole.USER ? <UserDashboard user={user} onUpdateProfile={handleUpdateProfile} /> : <PartnerDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/profile" element={user.role === UserRole.USER ? <UserDashboard user={user} onUpdateProfile={handleUpdateProfile} /> : <PartnerDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </DashboardLayout>
                ) : (user?.role === UserRole.ADMIN || user?.role === UserRole.EMPLOYEE) ? (
                  <Navigate to="/admin-portal" />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            <Route 
              path="/admin-portal/*" 
              element={
                (user?.role === UserRole.ADMIN || user?.role === UserRole.EMPLOYEE) ? (
                  <AdminLayout user={user} onLogout={handleLogout}>
                    <AdminDashboard user={user} appSettings={settings} onUpdateSettings={handleUpdateSettings} />
                  </AdminLayout>
                ) : (
                  <Navigate to="/staff-login" />
                )
              }
            />
          </Routes>
        </main>
        {!user && <Footer settings={settings} />}
      </div>
    </Router>
  );
};

interface LayoutProps {
  user: UserProfile;
  settings?: CMSSettings;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ user, settings, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', roles: [UserRole.USER, UserRole.PARTNER] },
    { label: 'Warranties', icon: FileText, path: '/dashboard/warranties', roles: [UserRole.USER] },
    { label: 'Claims', icon: ClipboardCheck, path: '/dashboard/claims', roles: [UserRole.USER, UserRole.PARTNER] },
    { label: 'Rewards', icon: Gift, path: '/dashboard/rewards', roles: [UserRole.USER, UserRole.PARTNER] },
    { label: 'Profile', icon: User, path: '/dashboard/profile', roles: [UserRole.USER, UserRole.PARTNER] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#1e3a8a] text-white z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-white/10 min-h-[80px]">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" style={{ width: settings.logoWidth ? `${settings.logoWidth}px` : 'auto' }} className="h-auto max-w-full" />
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-white shrink-0" />
                <div className="flex flex-col">
                  <span className="font-black text-sm tracking-tighter leading-none uppercase text-white brand-font">Warranty</span>
                  <span className="font-bold text-[10px] tracking-[0.2em] leading-none uppercase text-sky-400 mt-1">Advocates</span>
                </div>
              </div>
            )}
          </div>
          <nav className="flex-grow px-3 py-6 space-y-1">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${location.pathname === item.path ? 'bg-[#38bdf8] text-white shadow-lg' : 'text-blue-100 hover:bg-white/10'}`}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-blue-100 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(true)}><Menu className="w-6 h-6 text-slate-600" /></button>
            <div className="relative max-w-sm w-full hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-12 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block"><p className="text-sm font-bold text-slate-900 leading-none">{user.fullName}</p><p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{user.role}</p></div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 overflow-hidden shadow-sm flex items-center justify-center">
              {user.photoUrl ? <img src={user.photoUrl} alt="P" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-blue-600" />}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 no-scrollbar">{children}</main>
      </div>
    </div>
  );
};

const AdminLayout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Global Overview', icon: LayoutDashboard, path: '/admin-portal', roles: [UserRole.ADMIN] },
    { label: 'Claims & Users', icon: FolderLock, path: '/admin-portal/claims', roles: [UserRole.ADMIN] },
    { label: 'Page Manager', icon: Layout, path: '/admin-portal/pages', roles: [UserRole.ADMIN] },
    { label: 'Media Library', icon: Database, path: '/admin-portal/media', roles: [UserRole.ADMIN] },
    { label: 'Content (Blog)', icon: Type, path: '/admin-portal/blogs', roles: [UserRole.ADMIN] },
    { 
      label: user.role === UserRole.EMPLOYEE ? 'Knowledge Base (FAQs)' : 'Pricing & FAQs', 
      icon: user.role === UserRole.EMPLOYEE ? HelpCircle : CreditCard, 
      path: '/admin-portal/pricing', 
      roles: [UserRole.ADMIN, UserRole.EMPLOYEE] 
    },
    { label: 'User Directory', icon: Users, path: '/admin-portal/users', roles: [UserRole.ADMIN] },
    { label: 'Header Logic', icon: PanelTop, path: '/admin-portal/header', roles: [UserRole.ADMIN] },
    { label: 'Footer Logic', icon: PanelBottom, path: '/admin-portal/footer', roles: [UserRole.ADMIN] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-300">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/5 text-slate-300 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3 border-b border-white/5 bg-slate-950">
            <div className="p-2 bg-blue-600 rounded-xl"><ShieldCheck className="w-6 h-6 text-white" /></div>
            <div className="text-left"><span className="block font-black text-lg text-white brand-font leading-none tracking-tight uppercase">HQ CMS</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.role} ACCESS</span></div>
          </div>
          <nav className="flex-grow p-6 space-y-2">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-white/5 bg-slate-950/50">
            <div className="mb-6 px-4"><p className="text-xs font-bold text-slate-600 uppercase mb-1">Authenticated as</p><p className="text-sm font-bold text-white truncate">{user.fullName}</p></div>
            <button onClick={onLogout} className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"><LogOut className="w-5 h-5" /> Sign Out</button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        <header className="h-20 bg-slate-950 border-b border-white/5 flex items-center justify-between px-8">
           <div className="flex items-center gap-4"><button className="lg:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(true)}><Menu className="w-6 h-6" /></button><div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500"><Globe className="w-4 h-4" /> Global Cluster <span className="text-emerald-500 ml-1">• LIVE CMS</span></div></div>
           <div className="flex items-center gap-6">
              <div className="relative group hidden lg:block"><div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div><div className="relative px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3"><Database className="w-4 h-4 text-sky-400" /><span className="text-xs font-bold text-slate-300">Sync: 0.12ms</span></div></div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-bold overflow-hidden">{user.photoUrl ? <img src={user.photoUrl} alt="P" className="w-full h-full object-cover" /> : user.fullName.charAt(0)}</div>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">{children}</main>
      </div>
    </div>
  );
};

export default App;
