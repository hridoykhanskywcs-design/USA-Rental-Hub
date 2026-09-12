import React from 'react';
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
} from 'lucide-react';

export const TenantPortalView: React.FC = () => {
  const {
    applications,
    properties,
    savedPropertyIds,
    scheduledTours,
    settings,
    setSelectedProperty,
    setCurrentView,
  } = useApp();

  const appsList = applications || [];
  const toursList = scheduledTours || [];
  const savedIds = savedPropertyIds || [];
  const savedListings = (properties || []).filter((p) => savedIds.includes(p.id));

  // Determine user verification from latest application or default
  const isVerifiedMember = appsList.some((a) => a.verifiedMemberBadge);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Tenant Header & Verification Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-stone-900 dark:text-white">Tenant Member Portal</h1>
                {isVerifiedMember ? (
                  <span className="inline-flex items-center gap-1 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                    Verification In Progress
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Manage your rental applications, identity screenings, scheduled home walkthroughs, and saved units.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('MARKETPLACE')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Explore Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
              Unlock the official <strong className="font-extrabold">Verified Member Badge</strong> on your profile by submitting a soft credit inquiry. Zero impact on credit score, recognized across 10,000+ US rental properties.
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

      {/* Section 1: My Rental Applications */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Submitted Rental Applications ({appsList.length})
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {appsList.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
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
                  {app.verifiedMemberBadge && (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                  <span>Rent: ${(app.propertyRent || 0).toLocaleString()}/mo</span>
                  <span>&bull;</span>
                  <span>Submitted: {app.submittedAt}</span>
                  <span>&bull;</span>
                  <span>Income: ${(app.monthlyIncome || 0).toLocaleString()}/mo</span>
                  <span>&bull;</span>
                  <span>Credit: {(app.creditScoreRange || 'Good').split(' ')[0]}</span>
                </div>

                {app.adminNotes && (
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 italic pt-1">
                    Host Note: &ldquo;{app.adminNotes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                  Target: {app.moveInDate}
                </span>
              </div>
            </div>
          ))}

          {appsList.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-xs">
              You have not submitted any rental applications yet.
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Scheduled Tours */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Upcoming Scheduled Walkthroughs ({toursList.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {toursList.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  {(t.tourType || 'IN_PERSON').replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Confirmed</span>
              </div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                {t.propertyTitle}
              </h4>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{t.date} &bull; {t.timeSlot}</span>
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

      {/* Section 3: Saved Homes */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              Saved Properties ({savedListings.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {savedListings.map((prop) => (
            <div
              key={prop.id}
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
              No saved properties. Click the heart icon on any listing to bookmark it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
