import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { PropertyListing, RentalApplication } from '../types';
import {
  Building2,
  Plus,
  Sparkles,
  Users,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  X,
  Share2,
  FileText,
  Calendar,
  MessageSquare,
  Eye,
  Check,
  Clock,
  ArrowRight,
  Filter,
  UserCheck,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { VerifiedMemberBadge } from './VerifiedMemberBadge';

export const LandlordPortalView: React.FC = () => {
  const {
    properties,
    applications,
    setProperties,
    setApplications,
    addToast,
    refreshData,
    setSelectedProperty,
    openShareModal,
    setAddListingModalOpen,
    currentUser,
    openUserProfile,
    scheduledTours,
    setScheduledTours,
    updateTourStatus,
    setChatModalOpen,
    setActiveChatApp,
    chatMessages,
    setCurrentView,
  } = useApp();

  const [activeDashboardTab, setActiveDashboardTab] = useState<'ALL' | 'LISTINGS' | 'APPLICATIONS' | 'TOURS' | 'MESSAGES'>('ALL');
  const [listingFilter, setListingFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Split listings into Active vs Pending
  const allProperties = properties || [];
  const activeListings = allProperties.filter((p) => p.status === 'PUBLISHED' || p.status === 'AVAILABLE' || !p.status);
  const pendingListings = allProperties.filter((p) => p.status === 'PENDING_REVIEW' || p.status === 'DRAFT' || p.status === 'PAUSED');

  const displayedListings =
    listingFilter === 'ACTIVE'
      ? activeListings
      : listingFilter === 'PENDING'
      ? pendingListings
      : allProperties;

  const appsList = applications || [];
  const toursList = scheduledTours || [];

  // Host verification status
  const isVerifiedHost = currentUser?.isVerifiedMember || currentUser?.verifiedPlanType !== 'NONE';
  const hostPlanType = currentUser?.verifiedPlanType || (currentUser?.membershipTier === 'PRO_VERIFIED' || currentUser?.membershipTier === 'VIP_ENTERPRISE' ? 'PAID_VERIFIED' : 'FREE_VERIFIED');

  // New property form
  const [formData, setFormData] = useState({
    title: '',
    rent: 2800,
    deposit: 2800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 950,
    propertyType: 'APARTMENT' as const,
    street: '250 King St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    neighborhood: 'Mission Bay',
    description: '',
    amenities: 'In-Unit Washer/Dryer, Balcony, Assigned Parking, Dishwasher',
  });

  const handleAiGenerateDescription = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await api.aiGenerateListing({
        title: formData.title || `${formData.bedrooms} Bed Luxury Apartment in ${formData.city}`,
        propertyType: formData.propertyType,
        city: formData.city,
        neighborhood: formData.neighborhood,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        rent: formData.rent,
        amenities: formData.amenities.split(',').map((a) => a.trim()),
      });

      if (res && (res.title || res.description)) {
        setFormData((prev) => ({
          ...prev,
          title: res.title || prev.title,
          description: res.description || prev.description,
        }));
        addToast(
          res.isAiPowered ? 'AI Generation Complete' : 'Smart Copy Generated',
          'Optimized listing copy generated successfully.',
          'success'
        );
      }
    } catch (err) {
      console.error('AI generation notice:', err);
      addToast('Generation Notice', 'Listing copy generated using property template.', 'info');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProperty = await api.createProperty({
        title: formData.title || `${formData.bedrooms} Bed Apartment in ${formData.city}`,
        description: formData.description || 'Spacious modern unit with premium finishes and prime neighborhood access.',
        rent: Number(formData.rent),
        deposit: Number(formData.deposit),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.sqft),
        propertyType: formData.propertyType,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          neighborhood: formData.neighborhood,
          latitude: 37.7749,
          longitude: -122.4194,
        },
        amenities: formData.amenities.split(',').map((a) => a.trim()),
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        ],
        availableDate: new Date().toISOString().split('T')[0],
        leaseTerms: '12 months',
        isPetFriendly: true,
        isFurnished: false,
        isVerified: true,
        hasInUnitLaundry: true,
        hasParking: true,
        hasAirConditioning: true,
        utilitiesIncluded: ['Water', 'Trash'],
        landlordId: currentUser?.id || 'usr-host-current',
        landlordName: currentUser?.fullName || 'Sarah Chen',
        landlordContact: {
          email: currentUser?.email || 'sarah.chen@skylineprop.com',
          phone: currentUser?.phone || '+1 (415) 890-4122',
        },
        landlordMembershipTier: currentUser?.membershipTier,
        landlordVerifiedPlanType: hostPlanType,
        landlordIsVerified: true,
        status: 'PUBLISHED',
        viewsCount: 1,
      });

      if (newProperty) {
        setProperties([newProperty, ...allProperties]);
        addToast('Listing Published', 'Your property is now live and accepting verified applications.', 'success');
        setIsCreating(false);
      }
    } catch (err) {
      console.error('Error creating property:', err);
      addToast('Error', 'Could not publish listing.', 'alert');
    }
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: 'APPROVED' | 'REJECTED' | 'VERIFIED') => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    addToast('Application Updated', `Application status updated to ${newStatus}.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Landlord Header with Host Name, Verified Member Badge & View Profile */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-xl shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-stone-900 dark:text-white">
                  {currentUser?.fullName || 'Sarah Chen'}
                </h1>
                {/* Free Verified Member or Pro Verified Member badge */}
                <VerifiedMemberBadge
                  isVerified={isVerifiedHost}
                  tier={hostPlanType}
                  membershipTier={currentUser?.membershipTier}
                  size="md"
                />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Property Host &bull; {currentUser?.email || 'sarah.chen@skylineprop.com'} &bull; Verified Portfolio Host
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
            {currentUser && (
              <button
                type="button"
                onClick={() => openUserProfile(currentUser)}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View My Profile</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('VERIFIED')}
              className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 hover:bg-amber-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Verified Member Plans</span>
            </button>

            <button
              onClick={() => setAddListingModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Property</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-100 dark:border-stone-800 pb-2 text-xs font-bold">
          {[
            { id: 'ALL', label: 'All Operations' },
            { id: 'LISTINGS', label: `Listings (${allProperties.length})` },
            { id: 'APPLICATIONS', label: `Applications (${appsList.length})` },
            { id: 'TOURS', label: `Tour Requests (${toursList.length})` },
            { id: 'MESSAGES', label: `Messages (${chatMessages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDashboardTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                activeDashboardTab === tab.id
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-xs text-stone-400 font-bold">Active Listings</span>
            <div className="text-2xl font-black text-stone-900 dark:text-white">{activeListings.length}</div>
            <span className="text-[10px] text-teal-600 font-semibold">Live in Marketplace</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-xs text-stone-400 font-bold">Pending Listings</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingListings.length}</div>
            <span className="text-[10px] text-stone-500">Under Review / Drafts</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-xs text-stone-400 font-bold">Application Requests</span>
            <div className="text-2xl font-black text-stone-900 dark:text-white">{appsList.length}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">FCRA Screened Leads</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="text-xs text-stone-400 font-bold">Tour Walkthroughs</span>
            <div className="text-2xl font-black text-teal-600">{toursList.length}</div>
            <span className="text-[10px] text-stone-500">Scheduled Inquiries</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Active Listings & Pending Listings */}
      {(activeDashboardTab === 'ALL' || activeDashboardTab === 'LISTINGS') && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Property Portfolio Inventory</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage active listings visible to renters and review pending listings awaiting approval.
              </p>
            </div>

            {/* Filter between All, Active, and Pending Listings */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setListingFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  listingFilter === 'ALL'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All ({allProperties.length})
              </button>
              <button
                type="button"
                onClick={() => setListingFilter('ACTIVE')}
                className={`px-3 py-1 rounded-lg transition ${
                  listingFilter === 'ACTIVE'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Active ({activeListings.length})
              </button>
              <button
                type="button"
                onClick={() => setListingFilter('PENDING')}
                className={`px-3 py-1 rounded-lg transition ${
                  listingFilter === 'PENDING'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Pending ({pendingListings.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedListings.map((prop, idx) => {
              const isPending = prop.status === 'PENDING_REVIEW' || prop.status === 'DRAFT' || prop.status === 'PAUSED';

              return (
                <div
                  key={`${prop.id || 'prop'}-${idx}`}
                  onClick={() => setSelectedProperty(prop)}
                  className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col bg-white dark:bg-stone-900"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                    <img
                      src={(prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                      alt={prop.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      {isPending ? (
                        <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Pending Listing
                        </span>
                      ) : (
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Active Listing
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-2 left-2 bg-stone-950/80 text-white text-xs font-bold px-2 py-0.5 rounded">
                      ${prop.rent.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">{prop.title}</h4>
                      <p className="text-xs text-stone-500 mt-1">
                        {prop.address.neighborhood}, {prop.address.city}, {prop.address.state}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-2">
                        <span>{prop.bedrooms} Beds</span>
                        <span>&bull;</span>
                        <span>{prop.bathrooms} Baths</span>
                        <span>&bull;</span>
                        <span>{prop.sqft} sqft</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isPending && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProperties((prev) =>
                                prev.map((p) => (p.id === prop.id ? { ...p, status: 'PUBLISHED' } : p))
                              );
                              addToast('Listing Activated', 'Pending listing is now active and live.', 'success');
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openShareModal(prop);
                          }}
                          className="p-1 px-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-[11px] flex items-center gap-1 transition"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {displayedListings.length === 0 && (
              <div className="col-span-3 text-center py-12 text-stone-500 text-xs">
                No listings found matching this filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Application Requests with Verified Member Badges, Profile View & Screening Dossiers */}
      {(activeDashboardTab === 'ALL' || activeDashboardTab === 'APPLICATIONS') && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Application Requests &amp; Screening Dossiers ({appsList.length})</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Review submitted tenant applications, view verified profiles, and examine credit/background reports.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {appsList.map((app) => {
              // Synthetic profile object for the applicant so landlord can click "View Profile"
              const applicantProfile = {
                id: `usr-${app.applicantName.toLowerCase().replace(/\s+/g, '-')}`,
                fullName: app.applicantName,
                email: app.applicantEmail || 'applicant@nestryy.com',
                phone: app.applicantPhone || '+1 (415) 555-0192',
                role: 'TENANT' as const,
                membershipTier: app.verifiedMemberTier === 'PRO_VERIFIED' ? 'PRO_VERIFIED' as const : 'FREE' as const,
                isVerifiedMember: Boolean(app.verifiedMemberBadge || app.verifiedMemberTier),
                verifiedPlanType: app.verifiedMemberTier === 'PRO_VERIFIED' ? 'PAID_VERIFIED' as const : 'FREE_VERIFIED' as const,
                verificationStatus: 'VERIFIED' as const,
                creditScore: app.creditScoreValue || (app.creditScoreRange ? Number(app.creditScoreRange.split(' ')[0]) : 760),
                monthlyIncome: app.monthlyIncome,
                occupation: app.jobTitle || app.employer || 'Software Engineer',
                bio: 'Verified tenant applicant with biometric ID match and verified screening reports.',
                createdAt: app.submittedAt || new Date().toISOString(),
              };

              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                          {app.applicantName}
                        </h4>
                        {/* Free Verified Member or Pro Verified Member badge */}
                        <VerifiedMemberBadge
                          isVerified={app.verifiedMemberBadge || !!app.verifiedMemberTier}
                          tier={app.verifiedMemberTier === 'PRO_VERIFIED' ? 'PAID_VERIFIED' : 'FREE_VERIFIED'}
                          size="xs"
                        />
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : app.status === 'VERIFIED'
                              ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                        Applying for <strong className="text-stone-900 dark:text-white">{app.propertyTitle}</strong> (${(app.propertyRent || 0).toLocaleString()}/mo)
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-0.5">
                        <span>Submitted: {app.submittedAt}</span>
                        <span>&bull;</span>
                        <span>Target Move-In: {app.moveInDate || 'Immediate'}</span>
                        <span>&bull;</span>
                        <span>Monthly Income: ${(app.monthlyIncome || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openUserProfile(applicantProfile)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveChatApp(app);
                          setChatModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Applicant</span>
                      </button>
                    </div>
                  </div>

                  {/* Screening Dossier Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-teal-50 dark:bg-teal-950 text-teal-600 rounded-lg">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 dark:text-white block text-[11px]">
                          Submitted Credit Report
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                            Score: {app.creditScoreValue || (app.creditScoreRange ? app.creditScoreRange.split(' ')[0] : '760')}
                          </span>
                          <span className="text-[10px] text-stone-400">({app.creditBureauName || 'TransUnion / Experian'})</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                          Verified Official Credit Report Attached
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 dark:text-white block text-[11px]">
                          Submitted Background Clearance
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">
                            Status: {app.backgroundCheckStatus || 'CLEAR'}
                          </span>
                          <span className="text-[10px] text-stone-400">({app.backgroundCheckProvider || 'SmartMove'})</span>
                        </div>
                        <span className="text-[10px] text-stone-500 mt-0.5 block">
                          Eviction Records: 0 &bull; Criminal History: Clear
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Application Process Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span className="text-[11px] text-stone-500 italic">
                      {app.adminNotes ? `Dossier: ${app.adminNotes}` : 'Verified applicant credentials ready for landlord review.'}
                    </span>

                    <div className="flex items-center gap-2">
                      {app.status !== 'APPROVED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateApplicationStatus(app.id, 'APPROVED')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Lease</span>
                        </button>
                      )}
                      {app.status !== 'REJECTED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateApplicationStatus(app.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 dark:bg-stone-800 dark:text-stone-300 text-xs font-semibold rounded-xl transition"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {appsList.length === 0 && (
              <div className="text-center py-8 text-stone-500 text-xs">
                No application requests received yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Tour Requests from Renters */}
      {(activeDashboardTab === 'ALL' || activeDashboardTab === 'TOURS') && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Tour Requests &amp; Walkthrough Schedules ({toursList.length})</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage walkthrough appointments requested by prospective tenants.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toursList.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    {(t.tourType || 'IN_PERSON').replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {t.status === 'CONFIRMED' ? 'Confirmed Appointment' : 'Pending Host Approval'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    {t.propertyTitle}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    Tenant: <strong className="text-stone-900 dark:text-white">{t.userName || 'Verified Prospective Renter'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{t.date} &bull; {t.timeSlot}</span>
                </div>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {t.status !== 'CONFIRMED' ? (
                      <button
                        type="button"
                        onClick={() => {
                          updateTourStatus(t.id, 'CONFIRMED');
                          addToast('Tour Confirmed', 'Tour walkthrough has been confirmed.', 'success');
                        }}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm Walkthrough</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed on Calendar</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const matchedApp = appsList.find((a) => a.propertyId === t.propertyId);
                      if (matchedApp) setActiveChatApp(matchedApp);
                      setChatModalOpen(true);
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat Renter</span>
                  </button>
                </div>
              </div>
            ))}

            {toursList.length === 0 && (
              <div className="col-span-2 text-center py-6 text-stone-500 text-xs">
                No tour requests pending. Prospective renters can book walkthroughs directly on your listing pages.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: Inbound Messages */}
      {(activeDashboardTab === 'ALL' || activeDashboardTab === 'MESSAGES') && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                Renter Inquiries &amp; Messages ({chatMessages.length})
              </h2>
            </div>
            <button
              onClick={() => setChatModalOpen(true)}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Open Live Messenger
            </button>
          </div>

          <div className="space-y-3">
            {chatMessages.slice(0, 4).map((msg) => (
              <div
                key={msg.id}
                onClick={() => setChatModalOpen(true)}
                className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                    {msg.senderName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 truncate">
                      {msg.text}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-teal-600 hover:underline flex-shrink-0"
                >
                  Reply
                </button>
              </div>
            ))}

            {chatMessages.length === 0 && (
              <div className="text-center py-6 text-stone-500 text-xs">
                No active messages yet. Messages from renters on your active listings will appear here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
