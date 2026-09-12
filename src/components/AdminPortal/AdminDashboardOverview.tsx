import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from './AdminLayout';
import {
  Users,
  Building2,
  Send,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminDashboardOverview: React.FC<Props> = ({ onNavigate }) => {
  const { applications, properties, campaigns, settings } = useApp();

  const verifiedTenantsCount = applications.filter((a) => a.verifiedMemberBadge).length;
  const pendingAppsCount = applications.filter((a) => a.status === 'PENDING').length;
  const totalCampaignReach = campaigns.reduce((acc, c) => acc + c.sentCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Admin Dashboard</h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time control over tenant verification, automated property bulk syndication, and campaign communications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('BULK_LISTINGS')}
            className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 hover:bg-stone-800 text-stone-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>Bulk Auto List</span>
          </button>
          <button
            onClick={() => onNavigate('CAMPAIGNS')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch Campaign</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">Total Live Properties</span>
            <Building2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{properties.length}</span>
            <span className="text-xs font-semibold text-emerald-400">+12% this week</span>
          </div>
          <button
            onClick={() => onNavigate('BULK_LISTINGS')}
            className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
          >
            <span>Bulk Import Listings</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">Rental Applications</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{applications.length}</span>
            <span className="text-xs font-semibold text-amber-400">{pendingAppsCount} pending</span>
          </div>
          <button
            onClick={() => onNavigate('APPLICATIONS')}
            className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
          >
            <span>Review Form Records</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">Verified Tenant Members</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{verifiedTenantsCount}</span>
            <span className="text-xs font-semibold text-emerald-400">ID & Credit verified</span>
          </div>
          <button
            onClick={() => onNavigate('APPLICATIONS')}
            className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
          >
            <span>Manage Member Badges</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">Campaign Outreach</span>
            <Send className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalCampaignReach.toLocaleString()}</span>
            <span className="text-xs font-semibold text-stone-400">SMS & Emails</span>
          </div>
          <button
            onClick={() => onNavigate('CAMPAIGNS')}
            className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
          >
            <span>Edit Credit Link & Blast</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Credit Score Link Quick Inspection Banner */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              Active Credit Score Partner URL
            </span>
            <span className="text-xs text-stone-300 font-semibold">{settings.creditScorePartnerName}</span>
          </div>
          <p className="text-xs text-stone-400 font-mono truncate max-w-xl">
            {settings.creditScorePartnerLink}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={settings.creditScorePartnerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span>Test Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => onNavigate('CAMPAIGNS')}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Edit Link & Deploy
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Applications & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Card */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Recent Tenant Applications</h3>
            <button
              onClick={() => onNavigate('APPLICATIONS')}
              className="text-xs text-teal-400 hover:text-teal-300 font-bold"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{app.applicantName}</span>
                    {app.verifiedMemberBadge && (
                      <span className="text-[10px] bg-teal-950 text-teal-400 border border-teal-800 px-1.5 py-0.2 rounded font-bold">
                        Verified Member
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 truncate max-w-xs">{app.propertyTitle}</p>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-xs text-emerald-400">
                    ${app.monthlyIncome.toLocaleString()}/mo
                  </span>
                  <span className="text-[10px] text-stone-500">{app.creditScoreRange.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Campaigns Summary Card */}
        <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Marketing Outreach Campaigns</h3>
            <button
              onClick={() => onNavigate('CAMPAIGNS')}
              className="text-xs text-teal-400 hover:text-teal-300 font-bold"
            >
              Manage &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {campaigns.slice(0, 4).map((camp) => (
              <div
                key={camp.id}
                className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white truncate">{camp.name}</span>
                    <span className="text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.2 rounded uppercase font-bold">
                      {camp.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    Link: {camp.creditScoreLink}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="block font-bold text-xs text-white">{camp.sentCount} sent</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {camp.clickedCount} clicks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
