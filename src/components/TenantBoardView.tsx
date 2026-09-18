import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TenantRequest } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  ShieldCheck, 
  Calendar, 
  PlusCircle, 
  MessageSquare, 
  Send, 
  Heart, 
  Sparkles,
  Home,
  CheckCircle2,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { VerifiedMemberBadge } from './VerifiedMemberBadge';

export const TenantBoardView: React.FC = () => {
  const { 
    tenantRequests, 
    setPostTenantRequestModalOpen, 
    setCurrentView,
    setSelectedProperty,
    properties,
    addToast,
    setChatModalOpen,
    currentUser,
    setAuthModalOpen,
    openUserProfile,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(5000);
  const [selectedBeds, setSelectedBeds] = useState('ALL');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [matchModalTenant, setMatchModalTenant] = useState<TenantRequest | null>(null);

  // Extract unique neighborhoods from requests
  const neighborhoods = useMemo(() => {
    const set = new Set<string>();
    tenantRequests.forEach(r => r.neighborhoods.forEach(n => set.add(n)));
    return Array.from(set);
  }, [tenantRequests]);

  const filteredRequests = useMemo(() => {
    return tenantRequests.filter((req) => {
      if (onlyVerified && !req.isVerifiedMember) return false;
      if (req.maxBudget > maxBudget) return false;

      if (selectedNeighborhood !== 'ALL') {
        const matchesNeigh = req.neighborhoods.some(n => 
          n.toLowerCase().includes(selectedNeighborhood.toLowerCase())
        );
        if (!matchesNeigh) return false;
      }

      if (selectedBeds !== 'ALL' && !req.bedrooms.toLowerCase().includes(selectedBeds.toLowerCase())) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = req.tenantName.toLowerCase().includes(q);
        const matchOcc = req.occupation.toLowerCase().includes(q);
        const matchEmp = req.employer?.toLowerCase().includes(q);
        const matchBio = req.bio.toLowerCase().includes(q);
        const matchCity = req.targetCity.toLowerCase().includes(q);
        const matchNeigh = req.neighborhoods.some(n => n.toLowerCase().includes(q));
        if (!matchName && !matchOcc && !matchEmp && !matchBio && !matchCity && !matchNeigh) {
          return false;
        }
      }

      return true;
    });
  }, [tenantRequests, searchTerm, selectedNeighborhood, maxBudget, selectedBeds, onlyVerified]);

  const handleInviteTenant = (tenant: TenantRequest) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setMatchModalTenant(tenant);
  };

  const handleSendListingInvite = (propertyTitle: string) => {
    if (!matchModalTenant) return;
    addToast(
      'Invitation Dispatched! ✉️',
      `Sent rental invitation for "${propertyTitle}" to ${matchModalTenant.tenantName}.`,
      'success'
    );
    setMatchModalTenant(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20">
      {/* Hero Header matching Screenshot 1 */}
      <div className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-bold mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>👥 Tenant Rental Request Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Renters Looking for Homes & Apartments
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            Post what you are searching for and let verified property managers and landlords connect directly with you. 
            Landlords can invite pre-screened tenants with verified income and credit scores.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setPostTenantRequestModalOpen(true)}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-stone-950" />
              <span>+ Post My Rental Needs</span>
            </button>
            <button
              onClick={() => setCurrentView('MARKETPLACE')}
              className="px-5 py-3 bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl border border-stone-700 shadow transition flex items-center gap-2 text-sm"
            >
              <Home className="w-4 h-4 text-teal-400" />
              <span>Explore Available Rentals</span>
            </button>
          </div>
        </div>

        {/* Filter Bar integrated into the Hero Card */}
        <div className="max-w-5xl mx-auto mt-8 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search area, tenant name, jobs..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Neighborhoods */}
            <div>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Neighborhoods ▾</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Max Budget Slider */}
            <div className="bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                <span>Max Budget:</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">${maxBudget.toLocaleString()}/mo</span>
              </div>
              <input
                type="range"
                min="1000"
                max="8000"
                step="100"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <select
                value={selectedBeds}
                onChange={(e) => setSelectedBeds(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">Any Bedrooms ▾</option>
                <option value="Studio">Studio</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Quick Badges Filters */}
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyVerified(!onlyVerified)}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                  onlyVerified
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Members Only</span>
              </button>
              {(searchTerm || selectedNeighborhood !== 'ALL' || selectedBeds !== 'ALL' || maxBudget !== 5000 || onlyVerified) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedNeighborhood('ALL');
                    setSelectedBeds('ALL');
                    setMaxBudget(5000);
                    setOnlyVerified(false);
                  }}
                  className="px-2 py-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Showing <strong className="text-stone-900 dark:text-white">{filteredRequests.length}</strong> active tenant requests
            </span>
          </div>
        </div>
      </div>

      {/* Main Tenant Requests Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">No Tenant Requests Found</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
              Try adjusting your search terms or budget filters. You can also be the first to post a new rental request for your preferred area!
            </p>
            <button
              onClick={() => setPostTenantRequestModalOpen(true)}
              className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-sm shadow hover:bg-teal-700 transition"
            >
              + Post My Rental Needs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Top card bar: Avatar, name, verified badge, budget */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={req.tenantName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shadow-sm"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              openUserProfile({
                                id: req.id,
                                fullName: req.tenantName,
                                email: req.contactEmail,
                                phone: req.contactPhone,
                                role: 'TENANT',
                                membershipTier: req.membershipTier || 'PRO_VERIFIED',
                                verifiedPlanType: req.verifiedPlanType || (req.membershipTier === 'PRO_VERIFIED' ? 'PAID_VERIFIED' : 'FREE_VERIFIED'),
                                isVerifiedMember: req.isVerifiedMember,
                                verificationStatus: 'VERIFIED',
                                bio: req.bio,
                                occupation: req.occupation,
                                employer: req.employer,
                                targetCity: req.targetCity,
                                creditScoreRange: req.creditScoreRange,
                                creditScoreValue: req.creditScoreValue || (req.membershipTier === 'PRO_VERIFIED' ? 760 : 720),
                                creditBureauName: 'TransUnion SmartMove Certified',
                                backgroundCheckStatus: 'CLEAR',
                                backgroundCheckProvider: 'TransUnion Screening Services',
                              });
                            }}
                            className="text-base font-bold text-stone-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition text-left"
                          >
                            {req.tenantName}
                          </button>
                          <VerifiedMemberBadge
                            isVerified={req.isVerifiedMember}
                            tier={req.verifiedPlanType || (req.membershipTier === 'PRO_VERIFIED' ? 'PAID_VERIFIED' : 'FREE_VERIFIED')}
                            membershipTier={req.membershipTier}
                            size="xs"
                          />
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3 text-stone-400" />
                          <span>{req.occupation} {req.employer ? `• ${req.employer}` : ''}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-400 dark:text-stone-500 block font-medium">Budget up to</span>
                      <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
                        ${req.maxBudget.toLocaleString()}
                        <span className="text-xs font-normal text-stone-500">/mo</span>
                      </span>
                    </div>
                  </div>

                  {/* Neighborhoods tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-semibold">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      {req.targetCity}
                    </span>
                    {req.neighborhoods.map((n) => (
                      <span
                        key={n}
                        className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-[11px] font-medium border border-teal-100 dark:border-teal-900/60"
                      >
                        {n}
                      </span>
                    ))}
                  </div>

                  {/* Criteria row: Beds, Move-in, Credit Score, Pets */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl mb-3 text-xs">
                    <div>
                      <span className="text-stone-400 dark:text-stone-500 block text-[10px] uppercase font-bold">Bedrooms</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{req.bedrooms}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 dark:text-stone-500 block text-[10px] uppercase font-bold">Move-in Date</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{req.moveInDate}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-stone-400 dark:text-stone-500 block text-[10px] uppercase font-bold">Credit Report</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">{req.creditScoreRange}</span>
                    </div>
                  </div>

                  {/* Bio statement */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4 line-clamp-3">
                    "{req.bio}"
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <button
                    onClick={() => handleInviteTenant(req)}
                    className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Match</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openUserProfile({
                        id: req.id,
                        fullName: req.tenantName,
                        email: req.contactEmail,
                        phone: req.contactPhone,
                        role: 'TENANT',
                        membershipTier: req.membershipTier || 'PRO_VERIFIED',
                        verifiedPlanType: req.verifiedPlanType || (req.membershipTier === 'PRO_VERIFIED' ? 'PAID_VERIFIED' : 'FREE_VERIFIED'),
                        isVerifiedMember: req.isVerifiedMember,
                        verificationStatus: 'VERIFIED',
                        bio: req.bio,
                        occupation: req.occupation,
                        employer: req.employer,
                        targetCity: req.targetCity,
                        creditScoreRange: req.creditScoreRange,
                        creditScoreValue: req.creditScoreValue || (req.membershipTier === 'PRO_VERIFIED' ? 760 : 720),
                        creditBureauName: 'TransUnion SmartMove Certified',
                        backgroundCheckStatus: 'CLEAR',
                        backgroundCheckProvider: 'TransUnion Screening Services',
                      });
                    }}
                    className="py-2 px-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-xs border border-stone-200 dark:border-stone-700 transition flex items-center justify-center gap-1"
                    title="View Tenant Profile"
                  >
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      addToast('Message Initiated', `Opening direct channel to ${req.tenantName}.`, 'info');
                      setChatModalOpen(true);
                    }}
                    className="py-2 px-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-xs border border-stone-200 dark:border-stone-700 transition flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Match / Invitation Modal */}
      {matchModalTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Invite {matchModalTenant.tenantName} to View Listing
                </h3>
                <p className="text-xs text-stone-500">
                  Select one of your managed properties to send a direct invitation with special move-in offers.
                </p>
              </div>
              <button
                onClick={() => setMatchModalTenant(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {properties.slice(0, 5).map((prop, idx) => (
                <div
                  key={`${prop.id || 'board-prop'}-${idx}`}
                  onClick={() => handleSendListingInvite(prop.title)}
                  className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 cursor-pointer transition flex items-center gap-3"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {prop.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {prop.address.neighborhood}, {prop.address.city} • ${prop.rent.toLocaleString()}/mo
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-semibold">
                    Invite
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setMatchModalTenant(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
