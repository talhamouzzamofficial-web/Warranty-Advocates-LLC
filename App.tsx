
import React, { useState, useEffect } from 'react';
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
  Bell, 
  Map, 
  Settings,
  Plus,
  Home as HomeIcon,
  Car,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  HelpCircle,
  CreditCard,
  MessageSquare,
  Search,
  Users,
  Gift,
  Activity,
  Database,
  Globe
} from 'lucide-react';
import { UserRole, UserProfile } from './types';
import { COMPANY_INFO } from './constants';

// Pages
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AutoClaimFormPage from './pages/AutoClaimFormPage';
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

  // Mock Authentication Check
  useEffect(() => {
    const savedUser = localStorage.getItem('wa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedProfile };
    setUser(newUser);
    localStorage.setItem('wa_user', JSON.stringify(newUser));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <ShieldCheck className="w-16 h-16 animate-pulse text-sky-400" />
          <h1 className="text-2xl font-bold tracking-tight">Warranty Advocates LLC</h1>
          <div className="w-12 h-1 bg-sky-500/20 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-sky-400 animate-[loading_1.5s_infinite_linear]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {!user && <Navbar />}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
            <Route path="/auto-claim" element={<AutoClaimFormPage />} />
            <Route path="/auto-buying" element={<AutoBuyingAssistancePage />} />
            
            {/* Admin Dedicated Entry */}
            <Route path="/staff-login" element={<AdminLoginPage onLogin={handleLogin} />} />

            {/* User & Partner Dashboard Routing */}
            <Route 
              path="/dashboard/*" 
              element={
                user && user.role !== UserRole.ADMIN ? (
                  <DashboardLayout user={user} onLogout={handleLogout}>
                    <Routes>
                      <Route path="/" element={user.role === UserRole.USER ? <UserDashboard user={user} onUpdateProfile={handleUpdateProfile} /> : <PartnerDashboard user={user} />} />
                      <Route path="/warranties" element={<UserDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/claims" element={<UserDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/rewards" element={<UserDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/profile" element={<UserDashboard user={user} onUpdateProfile={handleUpdateProfile} />} />
                      <Route path="/customers" element={<PartnerDashboard user={user} />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </DashboardLayout>
                ) : user?.role === UserRole.ADMIN ? (
                  <Navigate to="/admin-portal" />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            {/* Admin Isolated Portal */}
            <Route 
              path="/admin-portal/*" 
              element={
                user?.role === UserRole.ADMIN ? (
                  <AdminLayout user={user} onLogout={handleLogout}>
                    <AdminDashboard user={user} />
                  </AdminLayout>
                ) : (
                  <Navigate to="/staff-login" />
                )
              }
            />
          </Routes>
        </main>
        {!user && <Footer />}
      </div>
    </Router>
  );
};

// Standard Dashboard Layout
interface LayoutProps {
  user: UserProfile;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', roles: [UserRole.USER, UserRole.PARTNER] },
    { label: 'Warranties', icon: FileText, path: '/dashboard/warranties', roles: [UserRole.USER] },
    { label: 'Claims', icon: ClipboardCheck, path: '/dashboard/claims', roles: [UserRole.USER, UserRole.PARTNER] },
    { label: 'Customers', icon: Users, path: '/dashboard/customers', roles: [UserRole.PARTNER] },
    { label: 'Rewards', icon: Gift, path: '/dashboard/rewards', roles: [UserRole.USER] },
    { label: 'Profile', icon: User, path: '/dashboard/profile', roles: [UserRole.USER, UserRole.PARTNER] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-blue-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-blue-800">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            <span className="font-bold text-lg leading-tight brand-font">Warranty<br/>Advocates</span>
          </div>
          <nav className="flex-grow p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-sky-500 text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-blue-800">
            <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-100 transition-colors"><LogOut className="w-5 h-5" /><span className="font-medium">Sign Out</span></button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-md" onClick={() => setIsSidebarOpen(true)}><Menu className="w-6 h-6 text-slate-600" /></button>
          <div className="flex-1 lg:flex items-center hidden px-4">
             <div className="relative max-w-md w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none" /></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block"><p className="text-sm font-semibold text-slate-900">{user.fullName}</p><p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p></div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white overflow-hidden">{user.fullName.charAt(0)}</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

// Admin Isolated Layout
const AdminLayout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Global Overview', icon: LayoutDashboard, path: '/admin-portal' },
    { label: 'Manage Claims', icon: ClipboardCheck, path: '/admin-portal/claims' },
    { label: 'User Directory', icon: Users, path: '/admin-portal/users' },
    { label: 'Territories', icon: Map, path: '/admin-portal/territories' },
    { label: 'Revenue & Billing', icon: CreditCard, path: '/admin-portal/revenue' },
    { label: 'Global Settings', icon: Settings, path: '/admin-portal/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-300">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/5 text-slate-300 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3 border-b border-white/5 bg-slate-950">
            <div className="p-2 bg-blue-600 rounded-xl"><ShieldCheck className="w-6 h-6 text-white" /></div>
            <div className="text-left">
              <span className="block font-black text-lg text-white brand-font leading-none tracking-tight">HQ ADMIN</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Ops</span>
            </div>
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
           <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
              <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                 <Globe className="w-4 h-4" /> Global Cluster <span className="text-emerald-500 ml-1">• LIVE</span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="relative group hidden lg:block">
                 <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                    <Database className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-slate-300">DB Sync: 0.12ms</span>
                 </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-bold">{user.fullName.charAt(0)}</div>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default App;
