import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  Heart,
  FileText,
  Building2,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  MessageSquare,
  Eye,
  FileCheck,
  Check,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { VerifiedMemberBadge } from './VerifiedMemberBadge';

export const TenantPortalView: React.FC = () => {
  const {
    applications,
    properties,
    savedPropertyIds,
    scheduledTours,
    settings,
    setSelectedProperty,
    setCurrentView,
    currentUser,
    openUserProfile,
    setChatModalOpen,
    setActiveChatApp,
    chatMessages,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'APPLICATIONS' | 'TOURS' | 'MESSAGES' | 'SAVED'>('ALL');

  const appsList = applications || [];
  const toursList = scheduledTours || [];
  const savedIds = savedPropertyIds || [];
  const savedListings = (properties || []).filter((p) => savedIds.includes(p.id));
  const activeMarketListings = (properties || []).filter((p) => p.status === 'PUBLISHED' || p.status === 'AVAILABLE');

  // Determine user verification from user profile or applications
  const isVerifiedUser = currentUser?.isVerifiedMember || appsList.some((a) => a.verifiedMemberBadge);
  const userPlanType = currentUser?.verifiedPlanType || (currentUser?.membershipTier === 'PRO_VERIFIED' || currentUser?.membershipTier === 'VIP_ENTERPRISE' ? 'PAID_VERIFIED' : 'FREE_VERIFIED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Tenant Header with Name, Verified Member Badge & View Profile */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-xl shadow-xs">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-stone-900 dark:text-white">
                  {currentUser?.fullName || 'David Miller'}
                </h1>
                {/* Free Verified Member or Pro Verified Member badge */}
                <VerifiedMemberBadge
                  isVerified={isVerifiedUser}
                  tier={userPlanType}
                  membershipTier={currentUser?.membershipTier}
                  size="md"
                />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Tenant Member &bull; {currentUser?.email || 'd.miller@nestryy.com'} &bull; ID &amp; Background Screened
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
              onClick={() => setCurrentView('MARKETPLACE')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-100 dark:border-stone-800 pb-2 text-xs font-bold">
          {[
            { id: 'ALL', label: 'Overview Dashboard' },
            { id: 'APPLICATIONS', label: `Applications (${appsList.length})` },
            { id: 'TOURS', label: `Tour Requests (${toursList.length})` },
            { id: 'MESSAGES', label: `Messages (${chatMessages.length})` },
            { id: 'SAVED', label: `Saved & Active Listings (${savedListings.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Official Credit Score Partner Verification CTA Banner */}
        <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <h3 className="font-bold text-sm text-teal-950 dark:text-teal-200">
                {settings.creditScorePartnerName} &bull; FCRA Soft-Check Pre-Screening
              </h3>
            </div>
            <p className="text-xs text-teal-800 dark:text-teal-300 max-w-2xl leading-relaxed">
              Unlock the official <strong className="font-extrabold">Verified Member Badge</strong> on your profile by submitting your soft credit score &amp; background report. Zero impact on credit score, recognized across 10,000+ rental properties.
            </p>
          </div>

          <a
            href={settings.creditScorePartnerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Run Free Soft Check</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SECTION 1: Application Requests & The Complete Application Process */}
      {(activeTab === 'ALL' || activeTab === 'APPLICATIONS') && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                Application Requests &amp; The Application Process ({appsList.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-stone-500">Live Stage Tracking</span>
          </div>

          <div className="space-y-4">
            {appsList.map((app) => {
              // Application Process Pipeline Stages
              const stages = [
                { id: 1, name: 'Application Submitted', done: true },
                { id: 2, name: 'Identity & Selfie Check', done: true },
                { id: 3, name: 'Credit & Background Screening', done: true },
                { id: 4, name: 'Walkthrough / Tour', done: toursList.some((t) => t.propertyId === app.propertyId) },
                { id: 5, name: 'Lease Offer & Approval', done: app.status === 'APPROVED' },
              ];

              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                          {app.propertyTitle}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
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
                        {/* Member badge next to application */}
                        <VerifiedMemberBadge
                          isVerified={app.verifiedMemberBadge || !!app.verifiedMemberTier}
                          tier={app.verifiedMemberTier === 'PRO_VERIFIED' ? 'PAID_VERIFIED' : 'FREE_VERIFIED'}
                          size="xs"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                        <span>Rent: ${(app.propertyRent || 0).toLocaleString()}/mo</span>
                        <span>&bull;</span>
                        <span>Target Move-In: {app.moveInDate || 'Flexible'}</span>
                        <span>&bull;</span>
                        <span>Submitted: {app.submittedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveChatApp(app);
                          setChatModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Host</span>
                      </button>
                    </div>
                  </div>

                  {/* Complete Application Process Visual Progress */}
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-2">
                      Application Process Lifecycle
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {stages.map((st, i) => (
                        <div
                          key={st.id}
                          className={`p-2 rounded-lg text-center flex flex-col items-center gap-1 ${
                            st.done
                              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-900'
                              : 'bg-stone-50 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              st.done ? 'bg-teal-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                            }`}
                          >
                            {st.done ? <Check className="w-3 h-3" /> : i + 1}
                          </div>
                          <span className="text-[10px] font-semibold leading-tight line-clamp-2">
                            {st.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submitted Reports Summary Pill */}
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-stone-200 dark:border-stone-700">
                    <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">
                      Submitted Screening Dossier:
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px] font-semibold flex items-center gap-1">
                      <FileCheck className="w-3 h-3" />
                      Score: {app.creditScoreValue || (app.creditScoreRange ? app.creditScoreRange.split(' ')[0] : '760')} ({app.creditBureauName || 'TransUnion'})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Background Check: {app.backgroundCheckStatus || 'CLEAR'} ({app.backgroundCheckProvider || 'SmartMove'})
                    </span>
                    {app.adminNotes && (
                      <span className="text-[11px] text-stone-500 italic">
                        &bull; Note: &ldquo;{app.adminNotes}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {appsList.length === 0 && (
              <div className="text-center py-8 text-stone-500 text-xs">
                You have not submitted any rental applications yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Tour Requests */}
      {(activeTab === 'ALL' || activeTab === 'TOURS') && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                Tour Requests &amp; Scheduled Walkthroughs ({toursList.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toursList.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    {(t.tourType || 'IN_PERSON').replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {t.status === 'CONFIRMED' ? 'Confirmed Walkthrough' : 'Pending Host Confirmation'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                  {t.propertyTitle}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{t.date} &bull; {t.timeSlot}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">Host: In-App Tour</span>
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
                    <span>Chat Host</span>
                  </button>
                </div>
              </div>
            ))}

            {toursList.length === 0 && (
              <div className="col-span-2 text-center py-6 text-stone-500 text-xs">
                No upcoming tours scheduled. Click &ldquo;Schedule Tour&rdquo; on any property card.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Messages */}
      {(activeTab === 'ALL' || activeTab === 'MESSAGES') && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                Messages &amp; Inquiries ({chatMessages.length})
              </h2>
            </div>
            <button
              onClick={() => setChatModalOpen(true)}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Open Messenger
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
                <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
              </div>
            ))}

            {chatMessages.length === 0 && (
              <div className="text-center py-6 text-stone-500 text-xs">
                No active message threads. Message property hosts directly from any listing or application.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: Active Listings & Saved Properties */}
      {(activeTab === 'ALL' || activeTab === 'SAVED') && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                Saved Properties &amp; Active Listings ({savedListings.length})
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('MARKETPLACE')}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Browse All Active Listings &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {savedListings.map((prop, idx) => (
              <div
                key={`${prop.id || 'saved'}-${idx}`}
                onClick={() => setSelectedProperty(prop)}
                className="group cursor-pointer rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                  <img
                    src={(prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                    alt={prop.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2 left-2 bg-stone-950/80 text-white font-bold text-xs px-2 py-0.5 rounded">
                    ${(prop.rent || 0).toLocaleString()}/mo
                  </span>
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active Listing
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    {prop.address?.city}, {prop.address?.state} &bull; {prop.bedrooms} Bed, {prop.bathrooms} Bath
                  </p>
                </div>
              </div>
            ))}

            {savedListings.length === 0 && (
              <div className="col-span-3 text-center py-6 text-stone-500 text-xs">
                No saved properties. Click the heart icon on any listing in the marketplace to bookmark it.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
