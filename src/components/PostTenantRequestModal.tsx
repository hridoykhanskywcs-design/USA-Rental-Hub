import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, DollarSign, Calendar, Briefcase, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react';

export const PostTenantRequestModal: React.FC = () => {
  const { 
    isPostTenantRequestModalOpen, 
    setPostTenantRequestModalOpen, 
    addTenantRequest, 
    currentUser,
    selectedCity,
    setAuthModalOpen,
  } = useApp();

  const [tenantName, setTenantName] = useState(currentUser?.fullName || '');
  const [tenantEmail, setTenantEmail] = useState(currentUser?.email || '');
  const [tenantPhone, setTenantPhone] = useState(currentUser?.phone || '');
  const [targetCity, setTargetCity] = useState(selectedCity || 'San Francisco');
  const [neighborhoodsInput, setNeighborhoodsInput] = useState('South Beach, Mission Bay, Marina');
  const [maxBudget, setMaxBudget] = useState<number>(3200);
  const [bedrooms, setBedrooms] = useState('1 or 2 Beds');
  const [moveInDate, setMoveInDate] = useState('2026-10-15');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [employer, setEmployer] = useState('');
  const [creditScoreRange, setCreditScoreRange] = useState('740 - 780 (Very Good)');
  const [hasPets, setHasPets] = useState(false);
  const [petsDescription, setPetsDescription] = useState('');
  const [bio, setBio] = useState('');

  if (!isPostTenantRequestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const nList = neighborhoodsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addTenantRequest({
      tenantName: tenantName || currentUser.fullName,
      tenantEmail: tenantEmail || currentUser.email,
      tenantPhone: tenantPhone || currentUser.phone,
      targetCity,
      neighborhoods: nList.length > 0 ? nList : ['Downtown', 'Metro'],
      maxBudget: Number(maxBudget),
      bedrooms,
      moveInDate,
      occupation,
      employer: employer || undefined,
      creditScoreRange,
      hasPets,
      petsDescription: hasPets ? petsDescription : undefined,
      isVerifiedMember: currentUser.isVerifiedMember || false,
      bio: bio || 'Professional seeking quiet, modern apartment with great natural light and reliable amenities.',
      status: 'ACTIVE',
    });

    setPostTenantRequestModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/50 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tenant Request / Rental Needed</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              Post Your Rental Needs & Search Parameters
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Verified property managers and landlords browse these requests to extend direct leasing offers.
            </p>
          </div>
          <button
            onClick={() => setPostTenantRequestModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                required
                placeholder="David Miller"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                required
                placeholder="david@example.com"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Target Metro / City
              </label>
              <select
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Austin">Austin, TX</option>
                <option value="New York">New York, NY</option>
                <option value="Miami">Miami, FL</option>
                <option value="Seattle">Seattle, WA</option>
                <option value="Chicago">Chicago, IL</option>
                <option value="Denver">Denver, CO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Preferred Neighborhoods (comma-separated)
              </label>
              <input
                type="text"
                value={neighborhoodsInput}
                onChange={(e) => setNeighborhoodsInput(e.target.value)}
                placeholder="e.g. South Beach, Mission, SOMA"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Max Monthly Budget ($)
              </label>
              <input
                type="number"
                min="500"
                max="15000"
                step="50"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500 font-bold text-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Bedrooms Desired
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="Studio">Studio</option>
                <option value="1 Bed">1 Bed</option>
                <option value="1 or 2 Beds">1 or 2 Beds</option>
                <option value="2 Beds">2 Beds</option>
                <option value="3+ Beds">3+ Beds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Move-in Date Target
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Job Title / Profession
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Product Designer"
                required
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Employer / Company (Optional)
              </label>
              <input
                type="text"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                placeholder="e.g. Stripe, Google, Freelance"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Self-Reported Credit Score
              </label>
              <select
                value={creditScoreRange}
                onChange={(e) => setCreditScoreRange(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="780+ (Excellent)">780+ (Excellent / Tier 1)</option>
                <option value="740 - 780 (Very Good)">740 - 780 (Very Good)</option>
                <option value="700 - 739 (Good)">700 - 739 (Good)</option>
                <option value="650 - 699 (Fair)">650 - 699 (Fair)</option>
                <option value="Working on Credit Repair">Working on Credit Repair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Do you have pets?
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    checked={!hasPets}
                    onChange={() => setHasPets(false)}
                    name="pets-opt"
                    className="accent-teal-600"
                  />
                  <span>No Pets</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    checked={hasPets}
                    onChange={() => setHasPets(true)}
                    name="pets-opt"
                    className="accent-teal-600"
                  />
                  <span>Yes (Dog / Cat)</span>
                </label>
              </div>
            </div>
          </div>

          {hasPets && (
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Pets Description (Breed, weight, vaccination)
              </label>
              <input
                type="text"
                value={petsDescription}
                onChange={(e) => setPetsDescription(e.target.value)}
                placeholder="1 trained 15lb French Bulldog with full health records"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Short Bio / What are you looking for in a home?
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell landlords about your lifestyle, quiet habits, workspace needs, lease duration preference..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setPostTenantRequestModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Publish Tenant Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
