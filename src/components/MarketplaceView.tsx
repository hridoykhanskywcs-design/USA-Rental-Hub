import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyListing } from '../types';
import { InteractivePropertyMap } from './InteractivePropertyMap';
import { VerifiedMemberBadge } from './VerifiedMemberBadge';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  Heart,
  Calendar,
  Sparkles,
  Layers,
  Map as MapIcon,
  Grid,
  PawPrint,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Users,
  Plus,
  Crown,
  Lock,
  MessageSquare,
  Building,
  Check,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    properties,
    selectedCity,
    setSelectedCity,
    savedPropertyIds,
    toggleSaveProperty,
    setSelectedProperty,
    setApplyingProperty,
    setTouringProperty,
    setAiSearchModalOpen,
    setScreeningPortalModalOpen,
    setVerifyMemberModalOpen,
    setMembershipModalOpen,
    setPostTenantRequestModalOpen,
    setAddListingModalOpen,
    setChatRecipient,
    setChatModalOpen,
    setCurrentView,
    settings,
    openUserProfile,
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<string>('ANY');
  const [propertyType, setPropertyType] = useState<string>('ALL');
  const [badgeFilter, setBadgeFilter] = useState<'ALL' | 'APPLY_SCREENING' | 'CREDIT_CHECK'>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [petFriendly, setPetFriendly] = useState<boolean>(false);
  const [laundry, setLaundry] = useState<boolean>(false);
  const [parking, setParking] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP' | 'SPLIT'>('GRID');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(false);
  const [activeMapPin, setActiveMapPin] = useState<PropertyListing | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // Filter logic
  const filteredListings = useMemo(() => {
    const list = properties.filter((p) => {
      // City filter
      if (selectedCity && selectedCity !== 'ALL' && selectedCity !== 'All US') {
        if (!p.address.city.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.address.neighborhood.toLowerCase().includes(q) ||
          p.address.city.toLowerCase().includes(q) ||
          p.address.street.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Badge Filter (Apply with Screening / Screening with Credit Check)
      if (badgeFilter === 'APPLY_SCREENING') {
        if (p.screeningBadgeType !== 'APPLY_SCREENING') return false;
      } else if (badgeFilter === 'CREDIT_CHECK') {
        if (p.screeningBadgeType !== 'CREDIT_CHECK') return false;
      }

      // Price filter
      if (minPrice !== '' && p.rent < Number(minPrice)) return false;
      if (maxPrice !== '' && p.rent > Number(maxPrice)) return false;

      // Bedrooms
      if (bedrooms !== 'ANY' && p.bedrooms < Number(bedrooms)) return false;

      // Property type
      if (propertyType !== 'ALL' && p.propertyType !== propertyType) return false;

      // Amenities & flags
      if (verifiedOnly && !p.isVerified) return false;
      if (petFriendly && !p.isPetFriendly) return false;
      if (laundry && !p.hasInUnitLaundry) return false;
      if (parking && !p.hasParking) return false;

      return true;
    });

    // Enforce unique ID deduplication to prevent duplicate keys
    const seenIds = new Set<string>();
    return list.filter((p) => {
      if (!p || !p.id || seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return true;
    });
  }, [
    properties,
    selectedCity,
    searchQuery,
    badgeFilter,
    minPrice,
    maxPrice,
    bedrooms,
    propertyType,
    verifiedOnly,
    petFriendly,
    laundry,
    parking,
  ]);

  const handleOpenChat = (p: PropertyListing) => {
    setChatRecipient({
      id: p.landlordId || `host-${p.id}`,
      name: p.landlordName || 'Property Host',
      role: 'LANDLORD',
    });
    setChatModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-teal-900 via-teal-950 to-stone-950 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-5">
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-700/80 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>FCRA-Compliant Tenant Screening &amp; Pre-set Checks</span>
            </div>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setAiSearchModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-teal-400/40 text-teal-200 rounded-xl text-xs font-bold transition shadow-sm backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              <span>Ask AI Search</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Verified US Rentals &amp;{' '}
              <span className="text-teal-400">Tenant Screening</span>
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Explore listings with guaranteed background &amp; credit checks, post your rental requirements to receive landlord offers, or submit instant verified applications.
            </p>
          </div>

          {/* Quick Action Shortcut Buttons (Native App Feel) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => setCurrentView('TENANT_BOARD')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-teal-400/30 text-left transition flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-600/80 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-teal-300 truncate">
                  Tenant Wanted
                </div>
                <div className="text-[10px] text-stone-400 truncate">Browse user requests</div>
              </div>
            </button>

            <button
              onClick={() => setPostTenantRequestModalOpen(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-teal-400/30 text-left transition flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600/80 flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                  Post Rental Need
                </div>
                <div className="text-[10px] text-stone-400 truncate">Receive instant offers</div>
              </div>
            </button>

            <button
              onClick={() => setScreeningPortalModalOpen(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-teal-400/30 text-left transition flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-600/80 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                  Screening Portals
                </div>
                <div className="text-[10px] text-stone-400 truncate">TransUnion &amp; RentPrep</div>
              </div>
            </button>

            <button
              onClick={() => setAddListingModalOpen(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-teal-400/30 text-left transition flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-600/80 flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                  + Add Listing
                </div>
                <div className="text-[10px] text-stone-400 truncate">For Landlords/Hosts</div>
              </div>
            </button>
          </div>

          {/* Master Search Bar */}
          <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-12 gap-2 text-stone-900 dark:text-white">
            {/* Keyword / Neighborhood */}
            <div className="sm:col-span-5 flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search neighborhood, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none placeholder-stone-400"
              />
            </div>

            {/* City Dropdown */}
            <div className="sm:col-span-3 flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none cursor-pointer"
              >
                <option value="ALL" className="text-stone-900">All US Cities</option>
                <option value="San Francisco" className="text-stone-900">San Francisco, CA</option>
                <option value="Austin" className="text-stone-900">Austin, TX</option>
                <option value="New York" className="text-stone-900">New York, NY</option>
                <option value="Miami" className="text-stone-900">Miami, FL</option>
                <option value="Seattle" className="text-stone-900">Seattle, WA</option>
                <option value="Chicago" className="text-stone-900">Chicago, IL</option>
                <option value="Denver" className="text-stone-900">Denver, CO</option>
              </select>
            </div>

            {/* Bedrooms selector */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              <Bed className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none cursor-pointer"
              >
                <option value="ANY" className="text-stone-900">Any Beds</option>
                <option value="1" className="text-stone-900">1+ Beds</option>
                <option value="2" className="text-stone-900">2+ Beds</option>
                <option value="3" className="text-stone-900">3+ Beds</option>
              </select>
            </div>

            {/* Filter Drawer Toggle */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors min-h-[44px] ${
                  showFiltersDrawer
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {badgeFilter !== 'ALL' || verifiedOnly || petFriendly ? '•' : ''}</span>
              </button>
            </div>
          </div>

          {/* Secondary Filters Tray */}
          {showFiltersDrawer && (
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-stone-900 dark:text-white animate-in fade-in">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">Min Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">Max Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">Screening Badge</label>
                <select
                  value={badgeFilter}
                  onChange={(e) => setBadgeFilter(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 outline-none"
                >
                  <option value="ALL">All Badges</option>
                  <option value="APPLY_SCREENING">Apply with Screening</option>
                  <option value="CREDIT_CHECK">Screening with Credit Check</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 outline-none"
                >
                  <option value="ALL">All Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="CONDO">Condo</option>
                  <option value="STUDIO">Studio</option>
                  <option value="ROOM">Room</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="verOnly"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="verOnly" className="text-xs font-semibold cursor-pointer">
                  Verified Only
                </label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="petOnly"
                  checked={petFriendly}
                  onChange={(e) => setPetFriendly(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="petOnly" className="text-xs font-semibold cursor-pointer">
                  Pet Friendly
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SCREENSHOT 1: SPONSOR / CERTIFIED SCREENING PARTNERS BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-850 p-4 sm:p-5 rounded-2xl border border-teal-200 dark:border-teal-900/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Certified Screening &amp; Background Hub
                </span>
                <span className="px-2 py-0.2 bg-teal-200/60 dark:bg-teal-950 text-teal-900 dark:text-teal-300 text-[10px] font-bold rounded-full">
                  FCRA Compliant
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 max-w-xl">
                Landlords accept direct pre-set screening verification. Connect with TransUnion SmartMove, RentPrep, or Experian to verify score with 0 inquiry penalty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setScreeningPortalModalOpen(true)}
              className="flex-1 md:flex-initial px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Screening Portals</span>
            </button>
            <button
              onClick={() => setCurrentView('VERIFIED')}
              className="flex-1 md:flex-initial px-4 py-2 bg-white dark:bg-stone-800 text-stone-800 dark:text-white hover:bg-stone-100 text-xs font-bold rounded-xl border border-stone-200 dark:border-stone-700 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Verified Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Results Bar with Quick Filters & View Switchers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
              {filteredListings.length} Verified {filteredListings.length === 1 ? 'Rental' : 'Rentals'} Available
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing active inventory in {selectedCity === 'ALL' ? 'the United States' : selectedCity}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Badge Filter Chips */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
              <button
                onClick={() => setBadgeFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  badgeFilter === 'ALL'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                All Badges
              </button>
              <button
                onClick={() => setBadgeFilter('APPLY_SCREENING')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  badgeFilter === 'APPLY_SCREENING'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Apply w/ Screening
              </button>
              <button
                onClick={() => setBadgeFilter('CREDIT_CHECK')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  badgeFilter === 'CREDIT_CHECK'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Credit Check
              </button>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-1.5 rounded-lg font-bold transition ${
                  viewMode === 'GRID'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('MAP')}
                className={`p-1.5 rounded-lg font-bold transition ${
                  viewMode === 'MAP'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
                title="Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('SPLIT')}
                className={`hidden md:block p-1.5 rounded-lg font-bold transition ${
                  viewMode === 'SPLIT'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
                title="Split Map + Grid"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: FULL MAP */}
        {viewMode === 'MAP' && (
          <div className="rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg">
            <InteractivePropertyMap
              properties={filteredListings}
              selectedPropertyId={activeMapPin?.id}
              onSelectProperty={(prop) => {
                setActiveMapPin(prop);
                setSelectedProperty(prop);
              }}
              heightClass="h-[600px]"
            />
          </div>
        )}

        {/* View Mode: SPLIT MAP + LIST */}
        {viewMode === 'SPLIT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="sticky top-24 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg">
                <InteractivePropertyMap
                  properties={filteredListings}
                  selectedPropertyId={hoveredPropertyId || activeMapPin?.id}
                  onSelectProperty={(prop) => {
                    setActiveMapPin(prop);
                  }}
                  heightClass="h-[calc(100vh-140px)] min-h-[560px]"
                  isSplitView={true}
                />
              </div>
            </div>

            <div className="lg:col-span-5 h-[calc(100vh-140px)] min-h-[560px] overflow-y-auto space-y-4 pr-1">
              {filteredListings.map((listing, idx) => {
                const isSaved = savedPropertyIds?.includes(listing.id);
                return (
                  <div
                    key={`${listing.id || 'listing'}-${idx}`}
                    onMouseEnter={() => setHoveredPropertyId(listing.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-[16/9] bg-stone-100 dark:bg-stone-800">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {/* CONDITIONAL SCREENING BADGE */}
                      <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1">
                        {listing.screeningBadgeType === 'CREDIT_CHECK' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-700/95 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                            <ShieldCheck className="w-3 h-3" />
                            Screening with credit check
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-teal-600/95 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                            <CheckCircle2 className="w-3 h-3" />
                            Apply with Screening
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-black text-stone-900 dark:text-white">
                          ${listing.rent.toLocaleString()}
                          <span className="text-xs font-normal text-stone-500">/mo</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                          {listing.propertyType}
                        </span>
                      </div>
                      <h4
                        onClick={() => setSelectedProperty(listing)}
                        className="font-bold text-xs text-stone-900 dark:text-white truncate cursor-pointer hover:text-teal-600"
                      >
                        {listing.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {listing.address.neighborhood}, {listing.address.city}
                      </p>
                      {listing.landlordName && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            openUserProfile({
                              id: listing.landlordId || 'landlord-1',
                              fullName: listing.landlordName || 'Verified Property Host',
                              email: listing.landlordContact?.email || 'host@nestryy.com',
                              phone: listing.landlordContact?.phone || '+1 (555) 392-1082',
                              role: 'LANDLORD',
                              membershipTier: listing.landlordMembershipTier || 'PRO_VERIFIED',
                              verifiedPlanType: listing.landlordVerifiedPlanType || 'PAID_VERIFIED',
                              isVerifiedMember: true,
                              verificationStatus: 'VERIFIED',
                              bio: `Verified property host on Nestryy managing verified residences in ${listing.address.city}.`,
                              targetCity: `${listing.address.city}, ${listing.address.state}`,
                              creditScoreValue: 790,
                              creditBureauName: 'Experian Commercial Soft Check',
                              backgroundCheckStatus: 'CLEAR',
                              backgroundCheckProvider: 'TransUnion SmartMove Certified',
                            });
                          }}
                          className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer pt-0.5"
                        >
                          <span className="font-semibold truncate">{listing.landlordName}</span>
                          <VerifiedMemberBadge
                            isVerified={listing.landlordIsVerified ?? true}
                            tier={listing.landlordVerifiedPlanType || 'PAID_VERIFIED'}
                            membershipTier={listing.landlordMembershipTier || 'PRO_VERIFIED'}
                            size="xs"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                        <button
                          onClick={() => setSelectedProperty(listing)}
                          className="flex-1 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-bold"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setApplyingProperty(listing)}
                          className="flex-1 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode: GRID (Default & Native Mobile Optimized) */}
        {viewMode === 'GRID' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredListings.map((listing, idx) => {
              const isSaved = savedPropertyIds?.includes(listing.id);

              return (
                <div
                  key={`${listing.id || 'grid-listing'}-${idx}`}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Card Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20" />

                    {/* Top Badges (SCREENSHOT 1 REQUIREMENT: Condition Badges) */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[85%]">
                      {listing.screeningBadgeType === 'CREDIT_CHECK' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-700/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                          <ShieldCheck className="w-3 h-3 text-emerald-300" />
                          Screening with credit check
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-teal-600/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                          <CheckCircle2 className="w-3 h-3 text-teal-200" />
                          Apply with Screening
                        </span>
                      )}

                      {listing.isVerified && (
                        <span className="inline-flex items-center gap-1 bg-stone-900/80 backdrop-blur-sm text-stone-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProperty(listing.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        isSaved
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-stone-950/40 text-white hover:bg-stone-950/70'
                      }`}
                      title={isSaved ? 'Saved' : 'Save'}
                      aria-label="Save listing"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    </button>

                    {/* Bottom Rent on Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <span className="text-xl sm:text-2xl font-black">${listing.rent.toLocaleString()}</span>
                        <span className="text-xs text-stone-300 font-medium ml-1">/mo</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-stone-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {listing.propertyType}
                      </span>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        onClick={() => setSelectedProperty(listing)}
                        className="font-bold text-sm sm:text-base text-stone-900 dark:text-white line-clamp-1 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
                      >
                        {listing.title}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span className="truncate">
                          {listing.address.neighborhood}, {listing.address.city}, {listing.address.state}
                        </span>
                      </div>

                      {listing.landlordName && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            openUserProfile({
                              id: listing.landlordId || 'landlord-1',
                              fullName: listing.landlordName || 'Verified Property Host',
                              email: listing.landlordContact?.email || 'host@nestryy.com',
                              phone: listing.landlordContact?.phone || '+1 (555) 392-1082',
                              role: 'LANDLORD',
                              membershipTier: listing.landlordMembershipTier || 'PRO_VERIFIED',
                              verifiedPlanType: listing.landlordVerifiedPlanType || 'PAID_VERIFIED',
                              isVerifiedMember: true,
                              verificationStatus: 'VERIFIED',
                              bio: `Verified property host on Nestryy managing verified residences in ${listing.address.city}.`,
                              targetCity: `${listing.address.city}, ${listing.address.state}`,
                              creditScoreValue: 790,
                              creditBureauName: 'Experian Commercial Soft Check',
                              backgroundCheckStatus: 'CLEAR',
                              backgroundCheckProvider: 'TransUnion SmartMove Certified',
                            });
                          }}
                          className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer pt-1"
                        >
                          <span className="font-semibold truncate">{listing.landlordName}</span>
                          <VerifiedMemberBadge
                            isVerified={listing.landlordIsVerified ?? true}
                            tier={listing.landlordVerifiedPlanType || 'PAID_VERIFIED'}
                            membershipTier={listing.landlordMembershipTier || 'PRO_VERIFIED'}
                            size="xs"
                          />
                        </div>
                      )}

                      {/* Specs Row */}
                      <div className="flex items-center gap-3.5 text-xs font-semibold text-stone-700 dark:text-stone-300 pt-2.5 border-t border-stone-100 dark:border-stone-800/80 mt-2.5">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-stone-400" />
                          {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-stone-400" />
                          {listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                          {listing.sqft} sqft
                        </span>
                      </div>
                    </div>

                    {/* Action buttons (Touch targets >= 44px for native mobile) */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProperty(listing)}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold transition-colors min-h-[44px]"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleOpenChat(listing)}
                        className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-teal-600 hover:border-teal-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Chat with Landlord / Host"
                        aria-label="Chat with Landlord"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setTouringProperty(listing)}
                        className="p-2.5 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Book In-person or Video Tour"
                        aria-label="Book Tour"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setApplyingProperty(listing)}
                        className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              No matching rental listings found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your price range, clearing the screening badge filter, or selecting a different city.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('ALL');
                  setMinPrice('');
                  setMaxPrice('');
                  setBadgeFilter('ALL');
                  setVerifiedOnly(false);
                }}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setPostTenantRequestModalOpen(true)}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
              >
                + Post Your Rental Need
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE NATIVE BOTTOM DOCK (Visible on small screens, touch target >= 44px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-2 flex items-center justify-between shadow-2xl">
        <button
          onClick={() => setCurrentView('MARKETPLACE')}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] text-teal-600 dark:text-teal-400"
        >
          <Building className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Rentals</span>
        </button>

        <button
          onClick={() => setCurrentView('TENANT_BOARD')}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] text-stone-600 dark:text-stone-400 hover:text-stone-900"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Requests</span>
        </button>

        <button
          onClick={() => setPostTenantRequestModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-5 min-h-[48px] min-w-[48px] rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/40 p-2.5"
          aria-label="Post Rental Need"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => setScreeningPortalModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] text-stone-600 dark:text-stone-400 hover:text-stone-900"
        >
          <Lock className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Screening</span>
        </button>

        <button
          onClick={() => setCurrentView('TENANT_PORTAL')}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[56px] text-stone-600 dark:text-stone-400 hover:text-stone-900"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
};
