import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Building2,
  User,
  ShieldAlert,
  Sun,
  Moon,
  Bookmark,
  Menu,
  X,
  ChevronDown,
  MapPin,
  TrendingUp,
  BookOpen,
  Users,
  Compass,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedCity,
    setSelectedCity,
    currentRole,
    setCurrentRole,
    savedPropertyIds,
    setAiSearchModalOpen,
    isDarkMode,
    setIsDarkMode,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const cities = ['All US', 'San Francisco', 'Austin', 'New York', 'Miami', 'Seattle'];

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top Notification Announcement Banner */}
      {settings.announcementBanner.enabled && (
        <div className="bg-teal-700 dark:bg-teal-900 text-teal-50 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <span>{settings.announcementBanner.text}</span>
          {settings.announcementBanner.link && (
            <a
              href={settings.announcementBanner.link}
              className="underline font-semibold hover:text-white transition-colors"
            >
              Learn more &rarr;
            </a>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('MARKETPLACE')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:bg-teal-700 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white">
                  Nestryy<span className="text-teal-600 dark:text-teal-400">.</span>
                </span>
                <span className="block text-[10px] tracking-wider uppercase font-bold text-teal-600 dark:text-teal-400 -mt-1">
                  Verified US Rentals
                </span>
              </div>
            </button>

            {/* City Quick Picker */}
            <div className="hidden md:flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer pr-1"
              >
                {cities.map((city) => (
                  <option key={city} value={city === 'All US' ? 'ALL' : city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNav('MARKETPLACE')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'MARKETPLACE'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              Find Rentals
            </button>
            <button
              onClick={() => handleNav('ROOMS')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'ROOMS' || currentView === 'ROOMMATES'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              Rooms & Roommates
            </button>
            <button
              onClick={() => handleNav('GUIDES')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'GUIDES'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              Guides
            </button>
            <button
              onClick={() => handleNav('MARKET_TRENDS')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'MARKET_TRENDS'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              Market Trends
            </button>
            <button
              onClick={() => handleNav('COMMUNITY')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'COMMUNITY'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => handleNav('LANDLORD_PORTAL')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'LANDLORD_PORTAL'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50'
              }`}
            >
              For Landlords
            </button>
          </nav>

          {/* Right Controls: AI Search, Portals, Admin Link, Roles */}
          <div className="flex items-center gap-2">
            {/* AI Search Prompt Trigger */}
            <button
              onClick={() => setAiSearchModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-lg text-xs font-semibold hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-sm"
              title="Search with Natural Language AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
              <span className="hidden sm:inline">AI Search</span>
            </button>

            {/* Saved Properties */}
            <button
              onClick={() => handleNav('TENANT_PORTAL')}
              className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Saved Properties & Applications"
            >
              <Bookmark className="w-4 h-4" />
              {(savedPropertyIds || []).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {(savedPropertyIds || []).length}
                </span>
              )}
            </button>

            {/* Tenant / Landlord Dashboard Switcher */}
            <button
              onClick={() => handleNav(currentRole === 'LANDLORD' ? 'LANDLORD_PORTAL' : 'TENANT_PORTAL')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                currentView === 'TENANT_PORTAL' || currentView === 'LANDLORD_PORTAL'
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-transparent shadow'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentRole === 'LANDLORD' ? 'Landlord Suite' : 'Tenant Portal'}</span>
            </button>

            {/* SEPARATE ADMIN PORTAL BUTTON */}
            <button
              onClick={() => handleNav('ADMIN_PORTAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'ADMIN_PORTAL'
                  ? 'bg-rose-700 text-white shadow-md ring-2 ring-rose-500/50'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50'
              }`}
              title="Admin Link: Tenant Screening, Bulk Listing & Campaign Control"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Select City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-semibold text-stone-800 dark:text-stone-200"
            >
              {cities.map((city) => (
                <option key={city} value={city === 'All US' ? 'ALL' : city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleNav('MARKETPLACE')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            Find Rentals
          </button>
          <button
            onClick={() => handleNav('ROOMS')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            Rooms & Roommates
          </button>
          <button
            onClick={() => handleNav('GUIDES')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            Housing Guides
          </button>
          <button
            onClick={() => handleNav('MARKET_TRENDS')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            Market Trends
          </button>
          <button
            onClick={() => handleNav('COMMUNITY')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            Community Hub
          </button>
          <button
            onClick={() => handleNav('TENANT_PORTAL')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            Tenant Portal & Verified Member
          </button>
          <button
            onClick={() => handleNav('LANDLORD_PORTAL')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            For Landlords & Property Managers
          </button>
          <button
            onClick={() => handleNav('ADMIN_PORTAL')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
          >
            Admin Panel (Applications, Bulk Listings & Campaigns)
          </button>
        </div>
      )}
    </header>
  );
};
