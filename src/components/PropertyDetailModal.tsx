import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Car,
  Wind,
  PawPrint,
  Layers,
  Compass,
  Bus,
  Footprints,
  Bike,
  Calculator,
  ExternalLink,
  Users,
  Eye,
  Check,
  Video,
  Navigation,
  Sliders,
  ChevronRight,
} from 'lucide-react';

export const PropertyDetailModal: React.FC = () => {
  const {
    selectedProperty,
    setSelectedProperty,
    savedPropertyIds,
    toggleSaveProperty,
    setApplyingProperty,
    setTouringProperty,
    addToast,
    settings,
    affiliates,
    triggerAffiliateClick,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FLOORPLANS' | 'VIRTUAL_TOUR' | 'ROOMMATES' | 'TRANSIT' | 'AFFORDABILITY'>('OVERVIEW');

  // Virtual Tour active room
  const [activeTourRoom, setActiveTourRoom] = useState<'LIVING' | 'KITCHEN' | 'BEDROOM' | 'BALCONY'>('LIVING');

  // Interactive Floor Plan Unit selected
  const [selectedFloorPlanId, setSelectedFloorPlanId] = useState<string>('fp-1');

  // Affordability Calculator State
  const [monthlyIncomeInput, setMonthlyIncomeInput] = useState<number>(
    selectedProperty ? selectedProperty.rent * 3.2 : 7500
  );

  if (!selectedProperty) return null;

  const isSaved = (savedPropertyIds || []).includes(selectedProperty.id);

  const images = (selectedProperty.images && selectedProperty.images.length > 0)
    ? selectedProperty.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];
  const amenities = selectedProperty.amenities || [];
  const utilities = selectedProperty.utilitiesIncluded || [];

  // Default / Derived Transit Scores (Apartments.com / WalkScore standard)
  const transitScores = selectedProperty.transitScores || {
    walkScore: 94,
    walkDescription: "Walker's Paradise — Daily errands do not require a car.",
    transitScore: 88,
    transitDescription: 'Rider’s Paradise — World-class public transit lines within 2 blocks.',
    bikeScore: 85,
    bikeDescription: 'Very Bikeable — Biking is convenient for most trips.',
  };

  // Default / Derived Floor Plans (Apartments.com standard)
  const floorPlans = selectedProperty.floorPlans && selectedProperty.floorPlans.length > 0
    ? selectedProperty.floorPlans
    : [
        {
          id: 'fp-1',
          name: 'Model A • Modern Suite',
          beds: selectedProperty.bedrooms || 1,
          baths: selectedProperty.bathrooms || 1,
          sqft: selectedProperty.sqft || 750,
          rent: selectedProperty.rent,
          availableDate: selectedProperty.availableDate || 'Immediate Move-In',
          deposit: selectedProperty.deposit || selectedProperty.rent,
        },
        {
          id: 'fp-2',
          name: 'Model B • Deluxe View Corner',
          beds: (selectedProperty.bedrooms || 1) + 1,
          baths: selectedProperty.bathrooms ? selectedProperty.bathrooms + 0.5 : 2,
          sqft: (selectedProperty.sqft || 750) + 240,
          rent: Math.round(selectedProperty.rent * 1.3),
          availableDate: 'Next Month',
          deposit: Math.round(selectedProperty.rent * 1.3),
        },
      ];

  const activeFloorPlan = floorPlans.find((fp) => fp.id === selectedFloorPlanId) || floorPlans[0];

  // Roomster Co-living Specs
  const roomDetails = selectedProperty.roomDetails || {
    roomType: 'PRIVATE',
    bathType: 'PRIVATE',
    genderPreference: 'ANY',
    roommatesCount: 2,
    utilityIncludedCost: 0,
  };

  // Virtual 3D Tour Room Panoramas
  const tourRoomImages: Record<string, { label: string; url: string; description: string }> = {
    LIVING: {
      label: 'Open-Concept Living & Dining',
      url: images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      description: 'Hardwood-style flooring, 10-ft ceilings, and floor-to-ceiling double-glazed soundproof glass.',
    },
    KITCHEN: {
      label: "Chef's Gourmet Kitchen",
      url: images[1] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
      description: 'Quartz waterfall countertops, custom soft-close cabinetry, and stainless steel induction appliances.',
    },
    BEDROOM: {
      label: 'Primary Bedroom Suite',
      url: images[2] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
      description: 'Spacious retreat with walk-in custom closet organizer and room for King bed + workspace.',
    },
    BALCONY: {
      label: 'Private Skyline Balcony',
      url: images[3] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      description: 'Panoramic skyline city outlook with outdoor electric outlet and lounge clearance.',
    },
  };

  // Affordability Calculation
  const rentRatio = (monthlyIncomeInput / selectedProperty.rent).toFixed(1);
  const isAffordable = monthlyIncomeInput >= selectedProperty.rent * 3;

  // SEO JSON-LD Microdata Object
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: selectedProperty.title,
    description: selectedProperty.description,
    url: window.location.origin + `/rentals/${selectedProperty.slug}`,
    image: images,
    offers: {
      '@type': 'Offer',
      price: selectedProperty.rent,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: selectedProperty.availableDate,
    },
    containedInPlace: {
      '@type': 'ApartmentComplex',
      name: selectedProperty.title,
      address: {
        '@type': 'PostalAddress',
        streetAddress: selectedProperty.address.street,
        addressLocality: selectedProperty.address.city,
        addressRegion: selectedProperty.address.state,
        postalCode: selectedProperty.address.zip,
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: selectedProperty.address.latitude,
        longitude: selectedProperty.address.longitude,
      },
      amenityFeature: amenities.map((a) => ({
        '@type': 'LocationFeatureSpecification',
        name: a,
        value: true,
      })),
    },
  };

  const handleApplyClick = () => {
    setApplyingProperty(selectedProperty);
  };

  const handleTourClick = () => {
    setTouringProperty(selectedProperty);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/rentals/${selectedProperty.slug}`);
      addToast('Link Copied', 'SEO Canonical Property URL copied to clipboard!', 'success');
    }
  };

  // Relevant active affiliates for banners
  const creditAffiliate = affiliates.find((a) => a.category === 'CREDIT_SCORE' && a.active);
  const insuranceAffiliate = affiliates.find((a) => a.category === 'RENTERS_INSURANCE' && a.active);
  const depositAffiliate = affiliates.find((a) => a.category === 'SECURITY_DEPOSIT' && a.active);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-200">
      {/* Dynamic SEO JSON-LD Injection for Google, Bing, and Social Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden relative text-stone-900 dark:text-stone-100">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-900/90 sticky top-0 z-20 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              {selectedProperty.rentalCategory === 'COLIVING' || selectedProperty.propertyType === 'ROOM'
                ? 'Co-Living / Room'
                : selectedProperty.propertyType}
            </span>
            {selectedProperty.isVerified && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Nestryy Home
              </span>
            )}
            {selectedProperty.featured && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveProperty(selectedProperty.id)}
              className="p-2 rounded-xl text-stone-500 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={isSaved ? 'Remove from saved' : 'Save property'}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedProperty(null)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Apartments.com / Zillow / Roomster Feature Bar) */}
        <div className="flex items-center gap-1 px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 overflow-x-auto text-xs font-bold py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('FLOORPLANS')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'FLOORPLANS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Floor Plans ({floorPlans.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('VIRTUAL_TOUR')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'VIRTUAL_TOUR'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>3D Virtual Tour</span>
          </button>
          <button
            onClick={() => setActiveTab('ROOMMATES')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ROOMMATES'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Roomster Co-Living</span>
          </button>
          <button
            onClick={() => setActiveTab('TRANSIT')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'TRANSIT'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Transit &amp; Walk Scores</span>
          </button>
          <button
            onClick={() => setActiveTab('AFFORDABILITY')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'AFFORDABILITY'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rent Calculator</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <>
              {/* Photo Showcase Gallery */}
              <div className="space-y-3">
                <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-stone-950 group shadow-inner">
                  <img
                    src={images[activeImageIndex]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono">
                      <span>{activeImageIndex + 1} of {images.length} High-Res Photos</span>
                    </div>

                    <button
                      onClick={() => setActiveTab('VIRTUAL_TOUR')}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Launch 3D Walkthrough</span>
                    </button>
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          activeImageIndex === idx
                            ? 'border-teal-500 scale-105 shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title, Address & Pricing Hero */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                    {selectedProperty.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>
                      {selectedProperty.address.street}, {selectedProperty.address.neighborhood},{' '}
                      {selectedProperty.address.city}, {selectedProperty.address.state}{' '}
                      {selectedProperty.address.zip}
                    </span>
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                      ${selectedProperty.rent.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-bold">/ month</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    Security Deposit: ${selectedProperty.deposit?.toLocaleString() || selectedProperty.rent.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Affiliate Partner Ribbon (Credit Check or Renters Insurance) */}
              {creditAffiliate && (
                <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-white block">
                        {creditAffiliate.name}: {creditAffiliate.bannerText}
                      </span>
                      <span className="text-[11px] text-teal-300">
                        {creditAffiliate.description || 'Pre-qualify and boost landlord approval odds with a free credit soft check.'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerAffiliateClick(creditAffiliate.id, creditAffiliate.url)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold whitespace-nowrap flex items-center gap-1"
                  >
                    <span>{creditAffiliate.ctaLabel || 'Check Score'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Core Unit Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                  <Bed className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <span className="block text-base font-black text-stone-900 dark:text-white">
                    {selectedProperty.bedrooms === 0 ? 'Studio' : `${selectedProperty.bedrooms} Bed`}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">Bedrooms</span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                  <Bath className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <span className="block text-base font-black text-stone-900 dark:text-white">
                    {selectedProperty.bathrooms} Bath
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">Bathrooms</span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                  <Maximize2 className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <span className="block text-base font-black text-stone-900 dark:text-white">
                    {selectedProperty.sqft} sqft
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">Living Area</span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
                  <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <span className="block text-base font-black text-stone-900 dark:text-white">
                    {selectedProperty.availableDate}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">Available Date</span>
                </div>
              </div>

              {/* Highlights & Features Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
                <div className={`p-2.5 rounded-lg flex items-center gap-2 ${selectedProperty.isPetFriendly ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-stone-100 dark:bg-stone-800'}`}>
                  <PawPrint className="w-4 h-4" />
                  <span>{selectedProperty.isPetFriendly ? 'Pets Allowed' : 'No Pets'}</span>
                </div>
                <div className={`p-2.5 rounded-lg flex items-center gap-2 ${selectedProperty.hasInUnitLaundry ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-stone-100 dark:bg-stone-800'}`}>
                  <Layers className="w-4 h-4" />
                  <span>{selectedProperty.hasInUnitLaundry ? 'In-Unit W/D' : 'Shared Laundry'}</span>
                </div>
                <div className={`p-2.5 rounded-lg flex items-center gap-2 ${selectedProperty.hasParking ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-stone-100 dark:bg-stone-800'}`}>
                  <Car className="w-4 h-4" />
                  <span>{selectedProperty.hasParking ? 'Parking Included' : 'Street Parking'}</span>
                </div>
                <div className={`p-2.5 rounded-lg flex items-center gap-2 ${selectedProperty.hasAirConditioning ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-stone-100 dark:bg-stone-800'}`}>
                  <Wind className="w-4 h-4" />
                  <span>{selectedProperty.hasAirConditioning ? 'Central A/C' : 'Natural Breeze'}</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-white">About this Home</h3>
                <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Amenities Breakdown */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-stone-900 dark:text-white">Amenities &amp; Building Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utilities included */}
              <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300 mb-1">
                  Utilities Included in Monthly Rent
                </h4>
                <p className="text-xs text-teal-800 dark:text-teal-200">
                  {utilities.length > 0 ? utilities.join(', ') : 'Tenant responsible for all utilities'}
                </p>
              </div>

              {/* Landlord Contact */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg">
                    {(selectedProperty.landlordName || 'N').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
                      <span>{selectedProperty.landlordName || 'Property Host'}</span>
                      <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </h4>
                    <p className="text-xs text-stone-500">Verified Nestryy Partner Host &bull; Identity Cleared</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedProperty.landlordContact?.phone && (
                    <a
                      href={`tel:${selectedProperty.landlordContact.phone}`}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 text-stone-700 dark:text-stone-300"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Host</span>
                    </a>
                  )}
                  {selectedProperty.landlordContact?.email && (
                    <a
                      href={`mailto:${selectedProperty.landlordContact.email}`}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 text-stone-700 dark:text-stone-300"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Host</span>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: FLOOR PLANS & PRICING MATRIX (Apartments.com Style) */}
          {activeTab === 'FLOORPLANS' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">
                    Floor Plans &amp; Availability
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Compare unit configurations, square footage, and current lease terms.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {floorPlans.map((fp) => (
                    <button
                      key={fp.id}
                      onClick={() => setSelectedFloorPlanId(fp.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedFloorPlanId === fp.id
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-white'
                      }`}
                    >
                      {fp.beds} Bed &bull; {fp.baths} Bath
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Floor Plan Layout Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                {/* SVG Schematic Floor Plan Vector Preview */}
                <div className="md:col-span-6 bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider mb-2">
                    Architectural CAD Layout
                  </span>

                  {/* Clean SVG blueprint floorplan representation */}
                  <svg className="w-64 h-48 text-stone-400 dark:text-stone-500 my-2" viewBox="0 0 200 150" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="10" y="10" width="180" height="130" strokeDasharray="4 2" />
                    <rect x="20" y="20" width="70" height="60" />
                    <text x="55" y="55" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">LIVING ROOM</text>
                    <rect x="100" y="20" width="80" height="60" />
                    <text x="140" y="55" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">BEDROOM</text>
                    <rect x="20" y="90" width="70" height="40" />
                    <text x="55" y="115" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">KITCHEN</text>
                    <rect x="100" y="90" width="40" height="40" />
                    <text x="120" y="115" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">BATH</text>
                    <rect x="150" y="90" width="30" height="40" />
                    <text x="165" y="115" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none">BALCONY</text>
                  </svg>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono mt-1">
                    {activeFloorPlan.name} &bull; {activeFloorPlan.sqft} Net Rentable Sq Ft
                  </p>
                </div>

                {/* Pricing & Unit Info */}
                <div className="md:col-span-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Selected Layout
                    </span>
                    <h4 className="text-xl font-black text-stone-900 dark:text-white">
                      {activeFloorPlan.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      High ceilings with oversized double-pane acoustic glass windows.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 block text-[10px]">Monthly Rent</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                        ${activeFloorPlan.rent.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 block text-[10px]">Move-In Availability</span>
                      <span className="font-bold text-stone-900 dark:text-white text-xs">
                        {activeFloorPlan.availableDate}
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 block text-[10px]">Security Deposit</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                        ${activeFloorPlan.deposit?.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 block text-[10px]">Beds &amp; Baths</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                        {activeFloorPlan.beds} Beds / {activeFloorPlan.baths} Baths
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleApplyClick}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <span>Apply for {activeFloorPlan.name}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleTourClick}
                      className="px-4 py-2.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition-colors"
                    >
                      Schedule In-Person Walkthrough
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3D VIRTUAL TOUR (Zillow 3D Home Style) */}
          {activeTab === 'VIRTUAL_TOUR' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-500" />
                    <h3 className="text-lg font-black text-stone-900 dark:text-white">
                      Zillow 3D Home &bull; Interactive Virtual Walkthrough
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Switch between panoramic room captures or pan 360-degrees.
                  </p>
                </div>

                {/* Room Selector Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(tourRoomImages).map(([key, room]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTourRoom(key as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        activeTourRoom === key
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-white'
                      }`}
                    >
                      {room.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Virtual Tour Viewport */}
              <div className="relative h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl group">
                <img
                  src={tourRoomImages[activeTourRoom].url}
                  alt={tourRoomImages[activeTourRoom].label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />

                {/* Floating 360 HUD Compass */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-white text-xs font-mono">
                  <Navigation className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>360&deg; Panorama Mode Active</span>
                </div>

                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs font-mono">
                  <span>HD 4K Spatial Audio Ready</span>
                </div>

                {/* Room Information Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-4 rounded-xl border border-stone-700/60 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
                      Currently Viewing
                    </span>
                    <h4 className="font-black text-sm text-white">
                      {tourRoomImages[activeTourRoom].label}
                    </h4>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {tourRoomImages[activeTourRoom].description}
                    </p>
                  </div>

                  <button
                    onClick={handleTourClick}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto justify-center"
                  >
                    <span>Request Live Guided Tour</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROOMSTER CO-LIVING & ROOMMATES (Roomster Style) */}
          {activeTab === 'ROOMMATES' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-500" />
                    <h3 className="text-lg font-black text-stone-900 dark:text-white">
                      Roomster Co-Living &amp; Roommate Preferences
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Transparent living arrangements, roommate compatibility criteria, and all-inclusive bills.
                  </p>
                </div>
                <span className="px-3 py-1 bg-sky-950 text-sky-300 text-xs font-bold rounded-xl border border-sky-800">
                  Roomster Verified
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 block text-[10px]">Room Type</span>
                  <span className="font-extrabold text-stone-900 dark:text-white text-sm">
                    {roomDetails.roomType === 'MASTER' ? 'Master Suite' : 'Private Bedroom'}
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 block text-[10px]">Bathroom Setup</span>
                  <span className="font-extrabold text-stone-900 dark:text-white text-sm">
                    {roomDetails.bathType === 'PRIVATE' ? 'Private En-Suite' : 'Shared Bath (1 person)'}
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 block text-[10px]">Gender Preference</span>
                  <span className="font-extrabold text-teal-600 dark:text-teal-400 text-sm">
                    {roomDetails.genderPreference === 'FEMALE' ? 'Female Preferred' : 'Any Gender Welcome'}
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 block text-[10px]">Housemates</span>
                  <span className="font-extrabold text-stone-900 dark:text-white text-sm">
                    {roomDetails.roommatesCount} Working Professionals
                  </span>
                </div>
              </div>

              {/* House Rules & Amenities */}
              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 space-y-2 text-xs">
                <h4 className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>Co-Living Community Standards</span>
                </h4>
                <ul className="text-sky-800 dark:text-sky-200 space-y-1 pl-5 list-disc">
                  <li>Quiet hours observed between 10:00 PM and 7:00 AM weekdays.</li>
                  <li>High-speed gigabit fiber Wi-Fi included in monthly rent.</li>
                  <li>Bi-weekly professional cleaning of common areas and kitchen included.</li>
                  <li>Fully furnished kitchen with dishwasher, pots, pans, and appliances.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: TRANSIT & WALK SCORES (Apartments.com Standard) */}
          {activeTab === 'TRANSIT' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">
                    Walk, Transit &amp; Bike Scores
                  </h3>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Official WalkScore ratings for {selectedProperty.address.neighborhood}, {selectedProperty.address.city}.
                </p>
              </div>

              {/* Transit Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Walk Score */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Footprints className="w-5 h-5 text-emerald-500" />
                      <span className="font-bold text-sm text-stone-900 dark:text-white">Walk Score</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-black text-base rounded-xl border border-emerald-300 dark:border-emerald-800">
                      {transitScores.walkScore}/100
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                    Walker's Paradise
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {transitScores.walkDescription}
                  </p>
                </div>

                {/* Transit Score */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bus className="w-5 h-5 text-sky-500" />
                      <span className="font-bold text-sm text-stone-900 dark:text-white">Transit Score</span>
                    </div>
                    <span className="px-2.5 py-1 bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono font-black text-base rounded-xl border border-sky-300 dark:border-sky-800">
                      {transitScores.transitScore}/100
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-sky-600 dark:text-sky-400">
                    Rider's Paradise
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {transitScores.transitDescription}
                  </p>
                </div>

                {/* Bike Score */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bike className="w-5 h-5 text-amber-500" />
                      <span className="font-bold text-sm text-stone-900 dark:text-white">Bike Score</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-black text-base rounded-xl border border-amber-300 dark:border-amber-800">
                      {transitScores.bikeScore}/100
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-amber-600 dark:text-amber-400">
                    Very Bikeable
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {transitScores.bikeDescription}
                  </p>
                </div>
              </div>

              {/* Commute Times Breakdown */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                <h4 className="font-bold text-xs text-stone-900 dark:text-white mb-2">
                  Estimated Travel Times from this Location:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Downtown Metro</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">8 mins by Train</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">International Airport</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">22 mins by Car</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Tech Corridor / Campus</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">14 mins by Bus</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Whole Foods / Grocery</span>
                    <span className="font-bold text-emerald-500 font-semibold">4 mins Walk</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RENT AFFORDABILITY CALCULATOR */}
          {activeTab === 'AFFORDABILITY' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">
                    Rent Affordability &amp; Income Verification
                  </h3>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Standard industry rule requires household gross monthly income to be at least 3x the monthly rent.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Your Gross Monthly Income:
                    </label>
                    <span className="font-mono text-base font-black text-teal-600 dark:text-teal-400">
                      ${monthlyIncomeInput.toLocaleString()} / mo (${(monthlyIncomeInput * 12).toLocaleString()} / yr)
                    </span>
                  </div>

                  <input
                    type="range"
                    min={selectedProperty.rent}
                    max={selectedProperty.rent * 6}
                    step={100}
                    value={monthlyIncomeInput}
                    onChange={(e) => setMonthlyIncomeInput(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] text-stone-500 block">Monthly Rent</span>
                    <span className="font-bold text-stone-900 dark:text-white text-base">
                      ${selectedProperty.rent.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] text-stone-500 block">Recommended Min. Income (3x)</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400 text-base">
                      ${(selectedProperty.rent * 3).toLocaleString()}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isAffordable
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  }`}>
                    <span className="text-[10px] block font-bold uppercase">Affordability Status</span>
                    <span className="font-black text-sm block">
                      {isAffordable ? `✓ Pre-Qualified (${rentRatio}x Rent)` : `Caution: Under 3x (${rentRatio}x)`}
                    </span>
                  </div>
                </div>

                {!isAffordable && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
                    <strong>Tip:</strong> If your monthly income is below 3x the rent, you can easily attach a co-signer or guarantor in the Nestryy application form.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Applications verified in 24h &bull; Full tenant KYC security</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleTourClick}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-xs text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              Book Walkthrough
            </button>
            <button
              onClick={handleApplyClick}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Submit Rental Application</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
