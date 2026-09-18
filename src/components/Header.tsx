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
  Users,
  Compass,
  Crown,
  Lock,
  Plus,
  LogIn,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '../types';
import { VerifiedMemberBadge } from './VerifiedMemberBadge';

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
    currentUser,
    setAuthModalOpen,
    setAuthModalMode,
    setMembershipModalOpen,
    setVerifyMemberModalOpen,
    setScreeningPortalModalOpen,
    setPostTenantRequestModalOpen,
    setAddListingModalOpen,
    logoutUser,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cities = ['All US', 'San Francisco', 'Austin', 'New York', 'Miami', 'Seattle', 'Chicago', 'Denver'];

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleOpenAuth = (mode: 'SIGN_IN' | 'CREATE_ACCOUNT') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top Announcement Bar */}
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('MARKETPLACE')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:bg-teal-700 transition-colors flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-white">
                    Nestryy<span className="text-teal-600 dark:text-teal-400">.</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                    nestryy.com
                  </span>
                </div>
                <span className="hidden sm:block text-[9px] tracking-wider uppercase font-bold text-teal-600 dark:text-teal-400 -mt-0.5">
                  Verified US Rentals & Screening
                </span>
              </div>
            </button>

            {/* City Quick Picker */}
            <div className="hidden md:flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer pr-1 text-xs"
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
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => handleNav('MARKETPLACE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'MARKETPLACE'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Explore Rentals
            </button>

            {/* SCREENSHOT 1 TENANT REQUEST MARKETPLACE LINK */}
            <button
              onClick={() => handleNav('TENANT_BOARD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentView === 'TENANT_BOARD'
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Tenant Requests</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            </button>

            {/* PRE-SET SCREENING PORTALS LINK */}
            <button
              onClick={() => setScreeningPortalModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Screening Checks</span>
            </button>

            {/* VERIFIED MEMBER LINK */}
            <button
              onClick={() => handleNav('VERIFIED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                currentView === 'VERIFIED'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Verified Member</span>
            </button>

            {/* MEMBERSHIP PLANS LINK */}
            <button
              onClick={() => setMembershipModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 flex items-center gap-1"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Memberships</span>
            </button>

            <button
              onClick={() => handleNav('ROOMS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'ROOMS' || currentView === 'ROOMMATES'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Rooms
            </button>

            <button
              onClick={() => handleNav('GUIDES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'GUIDES'
                  ? 'bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Guides
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* AI Search Prompt Trigger */}
            <button
              onClick={() => setAiSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-lg text-xs font-semibold hover:border-teal-300 dark:hover:border-teal-700 transition shadow-sm"
              title="Search with Natural Language AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
              <span>AI Search</span>
            </button>

            {/* Saved Properties */}
            <button
              onClick={() => handleNav('TENANT_PORTAL')}
              className="relative p-1.5 text-stone-600 dark:text-stone-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Saved Properties & Applications"
            >
              <Bookmark className="w-4 h-4" />
              {(savedPropertyIds || []).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {(savedPropertyIds || []).length}
                </span>
              )}
            </button>

            {/* Current Role Switcher Quick Pill - Only visible after login as requested */}
            {currentUser && (
              <div className="hidden lg:flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-[11px] font-bold">
                <button
                  onClick={() => {
                    setCurrentRole('TENANT');
                    handleNav('TENANT_PORTAL');
                  }}
                  className={`px-2 py-1 rounded-md transition ${
                    currentRole === 'TENANT' || currentRole === 'RENTER'
                      ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Tenant
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('LANDLORD');
                    handleNav('LANDLORD_PORTAL');
                  }}
                  className={`px-2 py-1 rounded-md transition ${
                    currentRole === 'LANDLORD'
                      ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Landlord
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('PROPERTY_MANAGER');
                    handleNav('LANDLORD_PORTAL');
                  }}
                  className={`px-2 py-1 rounded-md transition ${
                    currentRole === 'PROPERTY_MANAGER'
                      ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Manager
                </button>
              </div>
            )}

            {/* SEPARATE PRIVATE ADMIN PORTAL BUTTON (Hidden from normal/public users, accessible to ADMIN or via /#admin) */}
            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN' || currentView === 'ADMIN_PORTAL') && (
              <button
                onClick={() => {
                  window.location.hash = 'admin';
                  handleNav('ADMIN_PORTAL');
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'ADMIN_PORTAL'
                    ? 'bg-rose-700 text-white shadow-md ring-2 ring-rose-500/50'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                }`}
                title="Private Admin Portal"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* User Account / Auth Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left pr-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-white leading-tight">
                        {currentUser.fullName.split(' ')[0]}
                      </span>
                      {currentUser.isVerifiedMember && (
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      )}
                    </div>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block">
                      🪙 {currentUser.welcomeCredits} credits
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                      <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">
                        {currentUser.email}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {currentUser.role}
                        </span>
                        <VerifiedMemberBadge
                          tier={currentUser.verifiedPlanType}
                          membershipTier={currentUser.membershipTier}
                          isVerified={currentUser.isVerifiedMember}
                          size="xs"
                        />
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs font-semibold">
                      <button
                        onClick={() => {
                          handleNav(currentUser.role === 'LANDLORD' ? 'LANDLORD_PORTAL' : 'TENANT_PORTAL');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-teal-600" />
                        <span>My Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNav('VERIFIED');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between text-emerald-700 dark:text-emerald-400"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verified Member</span>
                        </span>
                        {currentUser.isVerifiedMember && (
                          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            {currentUser.verifiedPlanType === 'PAID_VERIFIED' ? 'Pro' : 'Free'}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setMembershipModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 text-amber-700 dark:text-amber-400"
                      >
                        <Crown className="w-4 h-4" />
                        <span>Upgrade Membership</span>
                      </button>

                      <button
                        onClick={() => {
                          if (currentUser.role === 'LANDLORD') {
                            setAddListingModalOpen(true);
                          } else {
                            setPostTenantRequestModalOpen(true);
                          }
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 text-teal-700 dark:text-teal-400"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{currentUser.role === 'LANDLORD' ? '+ Add Property' : '+ Post Rental Need'}</span>
                      </button>

                      <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                        <button
                          onClick={() => {
                            logoutUser();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenAuth('SIGN_IN')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleOpenAuth('CREATE_ACCOUNT')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1"
                >
                  <span>Join Free</span>
                  <span className="text-[10px] bg-teal-800 text-teal-100 px-1 py-0.2 rounded font-extrabold">
                    +250🪙
                  </span>
                </button>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Full Native App experience) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top">
          {/* Quick Role & City Selector in mobile */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 gap-2">
            {currentUser ? (
              <div className="flex-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase block mb-0.5">Role Mode:</span>
                <div className="grid grid-cols-3 gap-1 text-[11px] font-bold bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                  <button
                    onClick={() => setCurrentRole('TENANT')}
                    className={`py-1 rounded text-center ${currentRole === 'TENANT' ? 'bg-white dark:bg-stone-900 text-teal-600 shadow-xs' : 'text-stone-500'}`}
                  >
                    Tenant
                  </button>
                  <button
                    onClick={() => setCurrentRole('LANDLORD')}
                    className={`py-1 rounded text-center ${currentRole === 'LANDLORD' ? 'bg-white dark:bg-stone-900 text-teal-600 shadow-xs' : 'text-stone-500'}`}
                  >
                    Landlord
                  </button>
                  <button
                    onClick={() => setCurrentRole('PROPERTY_MANAGER')}
                    className={`py-1 rounded text-center ${currentRole === 'PROPERTY_MANAGER' ? 'bg-white dark:bg-stone-900 text-teal-600 shadow-xs' : 'text-stone-500'}`}
                  >
                    Manager
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Welcome to Nestryy</span>
                <span className="text-[10px] text-stone-400 block">Verified US Rentals &amp; Screening</span>
              </div>
            )}
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-0.5">City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-semibold text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
              >
                {cities.map((city) => (
                  <option key={city} value={city === 'All US' ? 'ALL' : city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleNav('MARKETPLACE')}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-left font-bold text-xs bg-stone-50 dark:bg-stone-800/40 text-stone-800 dark:text-stone-200"
            >
              🏡 Explore Rentals
            </button>
            <button
              onClick={() => handleNav('TENANT_BOARD')}
              className="p-2.5 rounded-xl border border-teal-300 dark:border-teal-800 text-left font-bold text-xs bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200"
            >
              👥 Tenant Requests
            </button>
          </div>

          <button
            onClick={() => {
              setScreeningPortalModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Certified Screening Portals (TransUnion, RentPrep)</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            onClick={() => {
              handleNav('VERIFIED');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 text-emerald-700 dark:text-emerald-400 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Member</span>
          </button>

          <button
            onClick={() => {
              setMembershipModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 text-amber-700 dark:text-amber-400 flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            <span>Membership Plans (Free, Pro Verified, VIP Suite)</span>
          </button>

          {currentUser && (
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-1.5">
              <button
                onClick={() => handleNav('TENANT_PORTAL')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Tenant Portal &amp; Saved Applications
              </button>
              <button
                onClick={() => handleNav('LANDLORD_PORTAL')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Landlord &amp; Property Manager Suite
              </button>
            </div>
          )}

          {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN' || currentView === 'ADMIN_PORTAL') && (
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  window.location.hash = 'admin';
                  handleNav('ADMIN_PORTAL');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Admin Portal (Full CRUD, Fees &amp; Screening Control)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
