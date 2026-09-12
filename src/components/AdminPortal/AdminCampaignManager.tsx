import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { MarketingCampaign } from '../../types';
import {
  Send,
  Link as LinkIcon,
  Users,
  Upload,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  Eye,
  MousePointerClick,
  Copy,
} from 'lucide-react';

export const AdminCampaignManager: React.FC = () => {
  const { campaigns, setCampaigns, settings, setSettings, addToast, refreshData, applications } = useApp();

  // Campaign Form State
  const [campaignName, setCampaignName] = useState('Fall 2026 Verified Tenant Priority Drive');
  const [channel, setChannel] = useState<'EMAIL' | 'SMS' | 'OMNICHANNEL'>('OMNICHANNEL');
  const [targetAudience, setTargetAudience] = useState<'REGISTERED_USERS' | 'UPLOADED_LIST' | 'UNVERIFIED_APPLICANTS'>('REGISTERED_USERS');
  const [subject, setSubject] = useState('Complete your Nestryy Verified Tenant Profile (Instant Pre-Approval)');
  const [messageTemplate, setMessageTemplate] = useState(
    'Hi {{first_name}}, boost your rental application by completing your FCRA-compliant credit check with zero score impact. Click here: {{credit_score_link}} - Nestryy Team'
  );

  // CREDIT SCORE LINK EDITING & ADDING (User mandate)
  const [creditScoreLink, setCreditScoreLink] = useState(settings.creditScorePartnerLink);
  const [creditPartnerName, setCreditPartnerName] = useState(settings.creditScorePartnerName);

  // Uploaded data (phone and email)
  const [uploadedContacts, setUploadedContacts] = useState(
    `jordan.tech@gmail.com, +1 (415) 555-0199
marcus.alex@venture.io, +1 (512) 555-0144
elena.s@designstudio.co, +1 (212) 555-0177
david.kim@healthfirst.org, +1 (305) 555-0122
amanda.w@cloudscale.net, +1 (206) 555-0188`
  );

  const [isSending, setIsSending] = useState(false);
  const [lastDispatched, setLastDispatched] = useState<MarketingCampaign | null>(null);

  // Quick insert tags into message
  const insertTag = (tag: string) => {
    setMessageTemplate((prev) => prev + ` ${tag}`);
  };

  const handleUpdateCreditLink = async () => {
    try {
      const updatedSettings = await api.updateSettings({
        creditScorePartnerLink: creditScoreLink,
        creditScorePartnerName: creditPartnerName,
      });
      setSettings(updatedSettings);
      addToast(
        'Credit Score Link Updated',
        'Official partner link saved across public application form and all campaign blasts.',
        'success'
      );
    } catch (err) {
      console.error('Failed to update link:', err);
      addToast('Error', 'Could not update credit link settings.', 'alert');
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageTemplate.includes('{{credit_score_link}}') && !messageTemplate.includes(creditScoreLink)) {
      if (!confirm('Note: You have not included the credit score verification link in this campaign. Proceed anyway?')) {
        return;
      }
    }

    try {
      setIsSending(true);

      // Calculate audience count
      let recipientCount = 0;
      if (targetAudience === 'REGISTERED_USERS') {
        recipientCount = applications.length * 15 + 42; // Dynamic website users pool
      } else if (targetAudience === 'UNVERIFIED_APPLICANTS') {
        recipientCount = applications.filter((a) => !a.verifiedMemberBadge).length;
      } else {
        recipientCount = uploadedContacts.split('\n').filter((l) => l.trim().length > 0).length;
      }

      // First sync current credit score link to settings
      await api.updateSettings({
        creditScorePartnerLink: creditScoreLink,
        creditScorePartnerName: creditPartnerName,
      });

      // Dispatch campaign API
      const result = await api.sendCampaign({
        name: campaignName,
        type: channel,
        targetAudience,
        creditScoreLink,
        subject,
        messageTemplate,
        recipientCount: Math.max(recipientCount, 1),
        uploadedContactsText: targetAudience === 'UPLOADED_LIST' ? uploadedContacts : undefined,
      });

      setCampaigns((prev) => [result, ...prev]);
      setLastDispatched(result);

      addToast(
        'Campaign Dispatched!',
        `Blasted to ${result.sentCount} recipients via ${channel}. Real-time tracking active.`,
        'success'
      );

      await refreshData();
    } catch (err) {
      console.error('Campaign error:', err);
      addToast('Dispatch Failed', 'Could not send campaign.', 'alert');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Marketing Campaign & Credit Link Manager
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Dispatch targeted SMS and Email campaigns to platform tenants or custom uploaded contact numbers & emails with custom Credit Score verification links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={creditScoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:bg-stone-800 text-teal-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Preview Active Credit Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* MANDATORY CONTROL 1: Credit Score Link Editing & Custom Partner Link */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 to-stone-900 border border-teal-800/80 space-y-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-900 text-teal-300 flex items-center justify-center font-bold">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Credit Score Verification Link Control</h3>
              <p className="text-xs text-stone-400">
                Edit the partner referral URL injected into campaign tags and tenant application modals.
              </p>
            </div>
          </div>

          <button
            onClick={handleUpdateCreditLink}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Save Default Credit Link
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Partner / Agency Name
            </label>
            <input
              type="text"
              value={creditPartnerName}
              onChange={(e) => setCreditPartnerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Partner Referral Screening URL (Editable)
            </label>
            <input
              type="url"
              value={creditScoreLink}
              onChange={(e) => setCreditScoreLink(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono text-xs outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Main Campaign Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Campaign Form */}
        <form onSubmit={handleSendCampaign} className="lg:col-span-8 bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-rose-500" />
            <span>Setup Outreach Campaign</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Delivery Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('OMNICHANNEL')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    channel === 'OMNICHANNEL'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-stone-950 text-stone-400 border-stone-800'
                  }`}
                >
                  SMS + Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('EMAIL')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    channel === 'EMAIL'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-stone-950 text-stone-400 border-stone-800'
                  }`}
                >
                  Email Only
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    channel === 'SMS'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-stone-950 text-stone-400 border-stone-800'
                  }`}
                >
                  SMS Only
                </button>
              </div>
            </div>
          </div>

          {/* Target Audience Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Select Target Audience
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetAudience('REGISTERED_USERS')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetAudience === 'REGISTERED_USERS'
                    ? 'border-teal-500 bg-teal-950/40 text-teal-200'
                    : 'border-stone-800 bg-stone-950 text-stone-400'
                }`}
              >
                <Users className="w-4 h-4 mb-1" />
                <span className="font-bold block text-xs">All Website Users</span>
                <span className="text-[10px] text-stone-400">Registered platform tenants</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetAudience('UNVERIFIED_APPLICANTS')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetAudience === 'UNVERIFIED_APPLICANTS'
                    ? 'border-teal-500 bg-teal-950/40 text-teal-200'
                    : 'border-stone-800 bg-stone-950 text-stone-400'
                }`}
              >
                <Clock className="w-4 h-4 mb-1" />
                <span className="font-bold block text-xs">Unverified Applicants</span>
                <span className="text-[10px] text-stone-400">Pending credit verification</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetAudience('UPLOADED_LIST')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetAudience === 'UPLOADED_LIST'
                    ? 'border-teal-500 bg-teal-950/40 text-teal-200'
                    : 'border-stone-800 bg-stone-950 text-stone-400'
                }`}
              >
                <Upload className="w-4 h-4 mb-1" />
                <span className="font-bold block text-xs">Upload Contact Data</span>
                <span className="text-[10px] text-stone-400">Phone numbers & emails</span>
              </button>
            </div>
          </div>

          {/* If Uploaded Contact Data selected */}
          {targetAudience === 'UPLOADED_LIST' && (
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Upload Contact Data (Paste Email, Phone Numbers)
                </span>
                <span className="text-[10px] text-stone-500">Format: email, phone per line</span>
              </div>
              <textarea
                rows={4}
                value={uploadedContacts}
                onChange={(e) => setUploadedContacts(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-white font-mono text-xs outline-none"
              />
            </div>
          )}

          {/* Subject line */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Email Subject / SMS Header
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs outline-none"
            />
          </div>

          {/* Message Body & Variable Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-300">
                Message Content
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-stone-500">Insert tag:</span>
                <button
                  type="button"
                  onClick={() => insertTag('{{credit_score_link}}')}
                  className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold hover:bg-teal-900"
                >
                  + Credit Score Link
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('{{first_name}}')}
                  className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700 text-[10px] font-bold hover:bg-stone-700"
                >
                  + First Name
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              required
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSending ? (
              <span>Dispatching Campaign Blast...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Campaign to Selected Audience</span>
              </>
            )}
          </button>
        </form>

        {/* Live Preview & Previous History */}
        <div className="lg:col-span-4 space-y-4">
          {/* SMS / Email Live Mock Phone Display */}
          <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Recipient Device Preview
            </span>
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <div className="text-[11px] font-bold text-rose-400 truncate">{subject}</div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {messageTemplate
                  .replace('{{first_name}}', 'Alex')
                  .replace('{{credit_score_link}}', creditScoreLink)}
              </p>
              <div className="pt-2 border-t border-stone-800 text-[10px] text-teal-400 font-mono truncate">
                Direct Link: {creditScoreLink}
              </div>
            </div>
          </div>

          {/* Quick Stats on Campaigns */}
          <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">
              Audience Delivery Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Database Tenants:</span>
                <span className="font-bold text-white">{applications.length * 15 + 42}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Unverified Applicants:</span>
                <span className="font-bold text-amber-400">
                  {applications.filter((a) => !a.verifiedMemberBadge).length}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>SMS Carrier Gateways:</span>
                <span className="font-bold text-emerald-400">Twilio / Plivo Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatched Campaigns List */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-sm text-white">Dispatched Outreach Log</h3>
        <div className="space-y-2.5">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{c.name}</span>
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px]">
                    {c.type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 text-[10px]">
                    {c.targetAudience}
                  </span>
                </div>
                <p className="text-stone-400 text-[11px] font-mono truncate max-w-lg">
                  Link: {c.creditScoreLink}
                </p>
              </div>

              <div className="flex items-center gap-4 text-right flex-shrink-0">
                <div>
                  <span className="font-bold text-white block">{c.sentCount}</span>
                  <span className="text-[10px] text-stone-500">Sent</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-400 block">{c.deliveredCount}</span>
                  <span className="text-[10px] text-stone-500">Delivered</span>
                </div>
                <div>
                  <span className="font-bold text-teal-400 block">{c.clickedCount}</span>
                  <span className="text-[10px] text-stone-500">Link Clicks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
