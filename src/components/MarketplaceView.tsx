import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyListing } from '../types';
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
    settings,
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<string>('ANY');
  const [propertyType, setPropertyType] = useState<string>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [petFriendly, setPetFriendly] = useState<boolean>(false);
  const [laundry, setLaundry] = useState<boolean>(false);
  const [parking, setParking] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP' | 'SPLIT'>('GRID');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(false);
  const [activeMapPin, setActiveMapPin] = useState<PropertyListing | null>(null);

  // Filter logic
  const filteredListings = useMemo(() => {
    return properties.filter((p) => {
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
  }, [
    properties,
    selectedCity,
    searchQuery,
    minPrice,
    maxPrice,
    bedrooms,
    propertyType,
    verifiedOnly,
    petFriendly,
    laundry,
    parking,
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-teal-900 via-teal-950 to-stone-950 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-700/80 text-teal-300 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FCRA-Compliant Tenant Screening & Verified Hosts</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Find Your Next Home in{' '}
                <span className="text-teal-400">
                  {selectedCity && selectedCity !== 'ALL' ? selectedCity : 'the United States'}
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
                Browse hand-verified apartments, luxury lofts, single-family houses, and rooms with transparent pricing, direct tour scheduling, and official credit pre-screening.
              </p>
            </div>

            {/* AI Search CTA Box */}
            <button
              onClick={() => setAiSearchModalOpen(true)}
              className="flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 bg-white text-teal-900 rounded-xl font-bold text-xs hover:bg-teal-50 transition-all shadow-lg hover:shadow-teal-900/30"
            >
              <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
              <span>Ask AI Search Assistant</span>
            </button>
          </div>

          {/* Master Search Bar */}
          <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-12 gap-2 text-stone-900 dark:text-white">
            {/* Keyword / Neighborhood Input */}
            <div className="sm:col-span-4 flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search neighborhood, street, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none placeholder-stone-400"
              />
            </div>

            {/* City Dropdown */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              <MapPin className="w-4 h-4 text-teal-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none cursor-pointer"
              >
                <option value="ALL" className="text-stone-900">All Cities</option>
                <option value="San Francisco" className="text-stone-900">San Francisco, CA</option>
                <option value="Austin" className="text-stone-900">Austin, TX</option>
                <option value="New York" className="text-stone-900">New York, NY</option>
                <option value="Miami" className="text-stone-900">Miami, FL</option>
                <option value="Seattle" className="text-stone-900">Seattle, WA</option>
              </select>
            </div>

            {/* Bedrooms selector */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              <Bed className="w-4 h-4 text-teal-600" />
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

            {/* Property Type */}
            <div className="sm:col-span-2 flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
              <Layers className="w-4 h-4 text-teal-600" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none cursor-pointer"
              >
                <option value="ALL" className="text-stone-900">All Types</option>
                <option value="APARTMENT" className="text-stone-900">Apartment</option>
                <option value="HOUSE" className="text-stone-900">House</option>
                <option value="CONDO" className="text-stone-900">Condo</option>
                <option value="STUDIO" className="text-stone-900">Studio</option>
                <option value="ROOM" className="text-stone-900">Room</option>
              </select>
            </div>

            {/* Filter Drawer Toggle & Search Action */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                  showFiltersDrawer
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Secondary Filters Tray */}
          {showFiltersDrawer && (
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-stone-900 dark:text-white animate-in fade-in">
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

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="laundryOnly"
                  checked={laundry}
                  onChange={(e) => setLaundry(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="laundryOnly" className="text-xs font-semibold cursor-pointer">
                  In-Unit Laundry
                </label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="parkingOnly"
                  checked={parking}
                  onChange={(e) => setParking(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="parkingOnly" className="text-xs font-semibold cursor-pointer">
                  Parking Spot
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Results Bar with View Switchers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
              {filteredListings.length} Verified {filteredListings.length === 1 ? 'Listing' : 'Listings'} Available
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing active rental inventory updated in real-time across {selectedCity === 'ALL' ? 'the USA' : selectedCity}.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Mode Buttons */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
              <button
                onClick={() => setViewMode('GRID')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'GRID'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                onClick={() => setViewMode('MAP')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'MAP'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>

              <button
                onClick={() => setViewMode('SPLIT')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'SPLIT'
                    ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAP VIEW / SPLIT VIEW COMPONENT */}
        {(viewMode === 'MAP' || viewMode === 'SPLIT') && (
          <div className="w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 relative h-96 shadow-lg mb-6">
            {/* Interactive Vector/Canvas Map Simulation */}
            <div className="w-full h-full bg-[#1e293b] relative overflow-hidden flex items-center justify-center">
              {/* Map grid lines simulation */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Neighborhood boundary labels */}
              <div className="absolute top-6 left-8 text-stone-400 font-bold text-xs uppercase tracking-widest pointer-events-none">
                {selectedCity} Metro Area &bull; Verified Inventory
              </div>

              {/* Pins for each property */}
              {filteredListings.map((prop, idx) => {
                // Calculate pseudo-geographic layout on canvas
                const posX = 20 + ((idx * 17) % 65);
                const posY = 25 + ((idx * 23) % 55);

                return (
                  <button
                    key={prop.id}
                    onClick={() => setActiveMapPin(prop)}
                    style={{ top: `${posY}%`, left: `${posX}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg transition-all hover:scale-110 flex items-center gap-1 z-20 ${
                      activeMapPin?.id === prop.id
                        ? 'bg-teal-400 text-stone-950 ring-4 ring-teal-500/40'
                        : 'bg-white text-stone-900 hover:bg-teal-50'
                    }`}
                  >
                    <span>${prop.rent.toLocaleString()}</span>
                  </button>
                );
              })}

              {/* Active Pin Popup Card */}
              {activeMapPin && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white dark:bg-stone-900 p-3 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 z-30 flex gap-3 animate-in slide-in-from-bottom">
                  <img
                    src={activeMapPin.images[0]}
                    alt="Pin Preview"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                      {activeMapPin.title}
                    </h4>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">
                      ${activeMapPin.rent.toLocaleString()}/mo &bull; {activeMapPin.bedrooms} Bed, {activeMapPin.bathrooms} Bath
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">
                      {activeMapPin.address.neighborhood}, {activeMapPin.address.city}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={() => setSelectedProperty(activeMapPin)}
                        className="px-2.5 py-1 bg-teal-600 text-white rounded text-[10px] font-bold"
                      >
                        View Home
                      </button>
                      <button
                        onClick={() => setActiveMapPin(null)}
                        className="px-2 py-1 text-stone-400 hover:text-stone-600 text-[10px]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LISTINGS GRID */}
        {viewMode !== 'MAP' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isSaved = savedPropertyIds.includes(listing.id);

              return (
                <div
                  key={listing.id}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Card Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {listing.isVerified && (
                        <span className="inline-flex items-center gap-1 bg-teal-600/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                      {listing.featured && (
                        <span className="bg-amber-500/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProperty(listing.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                        isSaved
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-stone-950/40 text-white hover:bg-stone-950/70'
                      }`}
                      title={isSaved ? 'Saved' : 'Save'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    </button>

                    {/* Bottom Rent on Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <span className="text-2xl font-black">${listing.rent.toLocaleString()}</span>
                        <span className="text-xs text-stone-300 font-medium ml-1">/mo</span>
                      </div>
                      <span className="text-[11px] font-semibold bg-stone-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {listing.propertyType}
                      </span>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3
                        onClick={() => setSelectedProperty(listing)}
                        className="font-bold text-base text-stone-900 dark:text-white line-clamp-1 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
                      >
                        {listing.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span className="truncate">
                          {listing.address.neighborhood}, {listing.address.city}, {listing.address.state}
                        </span>
                      </div>

                      {/* Specs Row */}
                      <div className="flex items-center gap-4 text-xs font-semibold text-stone-700 dark:text-stone-300 pt-3 border-t border-stone-100 dark:border-stone-800/80 mt-3">
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

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProperty(listing)}
                        className="flex-1 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setTouringProperty(listing)}
                        className="py-2 px-3 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold transition-colors"
                        title="Book In-person or Video Tour"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setApplyingProperty(listing)}
                        className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
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
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8">
            <ShieldCheck className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">No properties matched your criteria</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Try expanding your price range, choosing "All Cities", or resetting your search filters.
            </p>
            <button
              onClick={() => {
                setSelectedCity('ALL');
                setMinPrice('');
                setMaxPrice('');
                setBedrooms('ANY');
                setPropertyType('ALL');
                setVerifiedOnly(false);
                setPetFriendly(false);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
