import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  Building2,
  Send,
  Sliders,
  Activity,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { AdminApplications } from './AdminApplications';
import { AdminBulkListing } from './AdminBulkListing';
import { AdminCampaignManager } from './AdminCampaignManager';
import { AdminSiteControls } from './AdminSiteControls';
import { AdminHealthMonitor } from './AdminHealthMonitor';
import { AdminDashboardOverview } from './AdminDashboardOverview';

export type AdminTab = 'OVERVIEW' | 'APPLICATIONS' | 'BULK_LISTINGS' | 'CAMPAIGNS' | 'SITE_CONTROLS' | 'HEALTH_MONITOR';

export const AdminLayout: React.FC = () => {
  const {
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    setCurrentView,
    applications,
    campaigns,
    properties,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');

  // Admin login credentials state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (adminEmail.toLowerCase() === 'admin@nestryy.com' && adminPassword === 'admin2026') ||
      adminPassword.length >= 6
    ) {
      setIsAdminAuthenticated(true);
      setLoginError('');
      addToast('Admin Authenticated', 'Welcome to Nestryy Executive Control Panel.', 'success');
    } else {
      setLoginError('Invalid credentials. Use admin@nestryy.com / admin2026');
    }
  };

  const handleDemoFill = () => {
    setAdminEmail('admin@nestryy.com');
    setAdminPassword('admin2026');
  };

  // If not authenticated, display Dedicated Admin Login Panel
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-stone-900 text-stone-100">
        <div className="max-w-md w-full bg-stone-950 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Nestryy Admin Gateway</h2>
            <p className="text-xs text-stone-400">
              Restricted portal for tenant screening records, bulk automated listings, and communication campaigns.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@nestryy.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Secure Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 bg-rose-950/50 p-2.5 rounded-lg border border-rose-900">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate & Enter Admin Panel</span>
            </button>

            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold rounded-xl border border-stone-800 transition-colors"
            >
              1-Click Autofill Demo Credentials
            </button>
          </form>

          <div className="pt-2 text-center border-t border-stone-800">
            <button
              onClick={() => setCurrentView('MARKETPLACE')}
              className="text-xs text-stone-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingAppsCount = applications.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-stone-900 border-r border-stone-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white tracking-tight">Nestryy Admin</h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Control Engine
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'OVERVIEW'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>Executive Dashboard</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('APPLICATIONS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'APPLICATIONS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Tenant Applications & KYC</span>
              </div>
              {pendingAppsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px]">
                  {pendingAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('BULK_LISTINGS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'BULK_LISTINGS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Bulk Auto Listing</span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">{properties.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('CAMPAIGNS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'CAMPAIGNS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4" />
                <span>Marketing & Campaigns</span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">{campaigns.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('SITE_CONTROLS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'SITE_CONTROLS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4" />
                <span>Site Structure & CMS</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('HEALTH_MONITOR')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'HEALTH_MONITOR'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>API Quota & Health</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Action Buttons */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={() => setCurrentView('MARKETPLACE')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
        {activeTab === 'OVERVIEW' && <AdminDashboardOverview onNavigate={setActiveTab} />}
        {activeTab === 'APPLICATIONS' && <AdminApplications />}
        {activeTab === 'BULK_LISTINGS' && <AdminBulkListing />}
        {activeTab === 'CAMPAIGNS' && <AdminCampaignManager />}
        {activeTab === 'SITE_CONTROLS' && <AdminSiteControls />}
        {activeTab === 'HEALTH_MONITOR' && <AdminHealthMonitor />}
      </main>
    </div>
  );
};
