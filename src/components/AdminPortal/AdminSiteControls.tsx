import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { AffiliatePartnerLink } from '../../types';
import {
  Sliders,
  Bell,
  Link as LinkIcon,
  ShieldCheck,
  MapPin,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  MousePointerClick,
  Layers,
  X,
} from 'lucide-react';

export const AdminSiteControls: React.FC = () => {
  const { settings, setSettings, affiliates, setAffiliates, addToast, refreshData } = useApp();

  const [announcementText, setAnnouncementText] = useState(settings.announcementBannerText);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementBannerActive);
  const [partnerName, setPartnerName] = useState(settings.creditScorePartnerName);
  const [partnerLink, setPartnerLink] = useState(settings.creditScorePartnerLink);
  const [autoApproveVerified, setAutoApproveVerified] = useState(settings.autoApproveVerifiedTenants);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(settings.aiAssistantEnabled);
  const [featuredCities, setFeaturedCities] = useState<string[]>(settings.featuredCities);
  const [isSaving, setIsSaving] = useState(false);

  // Affiliate modal / editing states
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliatePartnerLink | null>(null);
  const [affiliateForm, setAffiliateForm] = useState<Partial<AffiliatePartnerLink>>({
    name: '',
    category: 'CREDIT_SCORE',
    url: '',
    commissionInfo: '$25 per verified screening',
    badgeText: 'Official Partner',
    description: '',
    bannerText: '',
    ctaLabel: 'Verify Now',
    active: true,
    placements: ['APPLICATION_FORM', 'PROPERTY_DETAIL'],
  });

  const availableCities = [
    'San Francisco',
    'Austin',
    'New York',
    'Miami',
    'Seattle',
    'Chicago',
    'Denver',
    'Boston',
    'Los Angeles',
  ];

  const toggleCity = (city: string) => {
    if (featuredCities.includes(city)) {
      setFeaturedCities(featuredCities.filter((c) => c !== city));
    } else {
      setFeaturedCities([...featuredCities, city]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await api.updateSettings({
        announcementBannerText: announcementText,
        announcementBannerActive: announcementActive,
        creditScorePartnerName: partnerName,
        creditScorePartnerLink: partnerLink,
        autoApproveVerifiedTenants: autoApproveVerified,
        aiAssistantEnabled,
        featuredCities,
      });

      setSettings(updated);
      addToast(
        'Site Controls Saved',
        'Website configuration, announcement bar, and credit score partner link saved successfully.',
        'success'
      );
      await refreshData();
    } catch (err) {
      console.error('Failed to save settings:', err);
      addToast('Error', 'Could not save website configurations.', 'alert');
    } finally {
      setIsSaving(false);
    }
  };

  // Affiliate Handlers
  const handleOpenNewAffiliate = () => {
    setEditingAffiliate(null);
    setAffiliateForm({
      name: '',
      category: 'CREDIT_SCORE',
      url: 'https://',
      commissionInfo: '$25 flat fee / converted sign-up',
      badgeText: 'Featured Partner',
      description: 'Instant credit score check with no hard pull inquiry.',
      bannerText: 'Get your official credit score report instantly',
      ctaLabel: 'Check My Score',
      active: true,
      placements: ['APPLICATION_FORM', 'PROPERTY_DETAIL'],
    });
    setIsAffiliateModalOpen(true);
  };

  const handleEditAffiliate = (item: AffiliatePartnerLink) => {
    setEditingAffiliate(item);
    setAffiliateForm({ ...item });
    setIsAffiliateModalOpen(true);
  };

  const handleToggleAffiliateActive = async (affiliate: AffiliatePartnerLink) => {
    try {
      const updated = await api.updateAffiliate(affiliate.id, { active: !affiliate.active });
      setAffiliates((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      addToast(
        updated.active ? 'Affiliate Activated' : 'Affiliate Paused',
        `${updated.name} status changed to ${updated.active ? 'Active' : 'Inactive'}.`,
        'info'
      );
    } catch (err) {
      console.error('Failed to toggle affiliate active:', err);
      addToast('Error', 'Failed to update affiliate link status.', 'alert');
    }
  };

  const handleDeleteAffiliate = async (id: string, name: string) => {
    try {
      await api.deleteAffiliate(id);
      setAffiliates((prev) => prev.filter((a) => a.id !== id));
      addToast('Affiliate Removed', `${name} referral partner deleted.`, 'info');
    } catch (err) {
      console.error('Failed to delete affiliate:', err);
      addToast('Error', 'Could not delete affiliate link.', 'alert');
    }
  };

  const handleSaveAffiliateModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateForm.name || !affiliateForm.url) {
      addToast('Missing Required Fields', 'Name and Referral URL are required.', 'warning');
      return;
    }

    try {
      if (editingAffiliate) {
        const updated = await api.updateAffiliate(editingAffiliate.id, affiliateForm);
        setAffiliates((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        addToast('Affiliate Updated', `${updated.name} partner details saved.`, 'success');
      } else {
        const created = await api.createAffiliate(affiliateForm);
        setAffiliates((prev) => [...prev, created]);
        addToast('Affiliate Created', `${created.name} link integrated and active.`, 'success');
      }
      setIsAffiliateModalOpen(false);
    } catch (err) {
      console.error('Failed to save affiliate:', err);
      addToast('Error', 'Could not save affiliate partner link.', 'alert');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Website Structure & Global CMS Controls
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure system-wide parameters, credit score partner integrations, announcement ribbons, and AI matching rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Persisting...' : 'Save Site Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Credit Score Screening URL (Direct link editing & adding) */}
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-white">Credit Score Partner & Screening URL</h3>
          </div>
          <p className="text-xs text-stone-400">
            This URL is distributed across all tenant application forms, marketing email/SMS campaigns, and tenant onboarding flows.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Partner Agency Title
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Credit Score Partner Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={partnerLink}
                  onChange={(e) => setPartnerLink(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
                <a
                  href={partnerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl flex items-center justify-center"
                  title="Test Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Announcement Ribbon */}
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Public Site Announcement Ribbon</h3>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ribbonToggle"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded cursor-pointer"
              />
              <label htmlFor="ribbonToggle" className="text-xs text-stone-300 font-semibold cursor-pointer">
                Enabled
              </label>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Displayed at the top of every page for urgent promo codes, feature updates, or notices.
          </p>

          <textarea
            rows={3}
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs outline-none resize-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Module 3: Automation & Verification Policies */}
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Verification & Screening Policies</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
              <div>
                <span className="text-xs font-bold text-white block">Auto-Assign Verified Member Badge</span>
                <span className="text-[11px] text-stone-400">
                  Grant verified badge when applicant self-reports &gt;720 credit score and passes ID check.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoApproveVerified}
                onChange={(e) => setAutoApproveVerified(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
              <div>
                <span className="text-xs font-bold text-white block">AI Assistant & Matching (Gemini 3.8 Flash)</span>
                <span className="text-[11px] text-stone-400">
                  Enables conversational search matcher and smart listing auto-generator.
                </span>
              </div>
              <input
                type="checkbox"
                checked={aiAssistantEnabled}
                onChange={(e) => setAiAssistantEnabled(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Module 4: Featured Marketplace Metro Areas */}
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-sm text-white">Featured Metropolitan Markets</h3>
          </div>
          <p className="text-xs text-stone-400">
            Select cities featured on the primary homepage hero bar and quick-search filters.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {availableCities.map((city) => {
              const isSelected = featuredCities.includes(city);
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isSelected
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                  }`}
                >
                  {isSelected ? `✓ ${city}` : `+ ${city}`}
                </button>
              );
            })}
          </div>
        </div>
      </form>

      {/* SECTION: ADVANCED AFFILIATE & REVENUE PARTNER NETWORK */}
      <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-base text-white">
                Affiliate Partner Links &amp; Revenue Network (Add &amp; Change)
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Manage custom affiliate links for credit checks, renters insurance, security deposit replacements, moving services, and internet setups.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNewAffiliate}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Affiliate Link</span>
          </button>
        </div>

        {/* Affiliate Links Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-400 bg-stone-950/40">
                <th className="p-3">Partner Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Destination Link</th>
                <th className="p-3">Commission / Payout</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Engagement</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {affiliates.map((aff) => (
                <tr key={aff.id} className="hover:bg-stone-850/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-800/60 text-teal-400 flex items-center justify-center font-bold text-xs">
                        {aff.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{aff.name}</span>
                        {aff.badgeText && (
                          <span className="text-[10px] text-teal-400 font-mono">{aff.badgeText}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px]">
                      {aff.category}
                    </span>
                  </td>

                  <td className="p-3">
                    <a
                      href={aff.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-teal-400 hover:underline max-w-[200px] truncate block flex items-center gap-1"
                    >
                      <span className="truncate">{aff.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>

                  <td className="p-3">
                    <span className="text-emerald-400 font-bold">
                      {aff.commissionInfo || '$20.00 / Lead'}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleAffiliateActive(aff)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                        aff.active
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 hover:bg-stone-750'
                      }`}
                    >
                      {aff.active ? '● Active' : '○ Paused'}
                    </button>
                  </td>

                  <td className="p-3 text-center font-mono">
                    <span className="text-stone-200 font-bold">{aff.clickCount || 0}</span>
                    <span className="text-[10px] text-stone-500 block">clicks</span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditAffiliate(aff)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                        title="Edit Affiliate Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAffiliate(aff.id, aff.name)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors"
                        title="Delete Affiliate Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {affiliates.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-xs">
              No affiliate links currently configured. Click &ldquo;Add New Affiliate Link&rdquo; to create your first revenue partner.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT AFFILIATE PARTNER */}
      {isAffiliateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-stone-100 relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base text-white">
                  {editingAffiliate ? 'Edit Affiliate Partner Link' : 'Add New Affiliate Partner Link'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAffiliateModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAffiliateModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-300 mb-1">Partner or Platform Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SmartScreen Credit Check, Lemonade Insurance, Rhino"
                  value={affiliateForm.name || ''}
                  onChange={(e) => setAffiliateForm({ ...affiliateForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Category</label>
                  <select
                    value={affiliateForm.category || 'CREDIT_SCORE'}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="CREDIT_SCORE">Credit Score Check</option>
                    <option value="RENTERS_INSURANCE">Renters Insurance</option>
                    <option value="IDENTITY_VERIFICATION">ID Verification</option>
                    <option value="SECURITY_DEPOSIT">Security Deposit Waiver</option>
                    <option value="MOVING_STORAGE">Moving &amp; Storage</option>
                    <option value="BROADBAND_INTERNET">High-Speed Internet</option>
                    <option value="FURNITURE_RENTAL">Furniture Rental</option>
                    <option value="OTHER">Other Service</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Recommended, Instant Approval"
                    value={affiliateForm.badgeText || ''}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, badgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Affiliate / Referral URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://partner.com/?aff_id=nestryy123"
                  value={affiliateForm.url || ''}
                  onChange={(e) => setAffiliateForm({ ...affiliateForm, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-teal-300 font-mono outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Commission / Payout</label>
                  <input
                    type="text"
                    placeholder="e.g. $25 per converted lead"
                    value={affiliateForm.commissionInfo || ''}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, commissionInfo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-emerald-400 font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Call-To-Action (CTA) Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Check Score Now, Get Insured"
                    value={affiliateForm.ctaLabel || ''}
                    onChange={(e) => setAffiliateForm({ ...affiliateForm, ctaLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Marketing Promo Banner Text</label>
                <input
                  type="text"
                  placeholder="e.g. Free soft-pull report with zero credit impact"
                  value={affiliateForm.bannerText || ''}
                  onChange={(e) => setAffiliateForm({ ...affiliateForm, bannerText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Partner Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description shown to applicants and renters..."
                  value={affiliateForm.description || ''}
                  onChange={(e) => setAffiliateForm({ ...affiliateForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none resize-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
                <div>
                  <span className="font-bold text-white block">Active Status</span>
                  <span className="text-[11px] text-stone-400">
                    When active, links appear on application forms and property pages.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={affiliateForm.active ?? true}
                  onChange={(e) => setAffiliateForm({ ...affiliateForm, active: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAffiliateModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  {editingAffiliate ? 'Save Changes' : 'Create Affiliate Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
