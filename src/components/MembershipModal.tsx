import React from 'react';
import { useApp } from '../context/AppContext';
import { MembershipTier } from '../types';
import { X, Check, Zap, Crown, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const MembershipModal: React.FC = () => {
  const { isMembershipModalOpen, setMembershipModalOpen, currentUser, upgradeMembership, setAuthModalOpen } = useApp();

  if (!isMembershipModalOpen) return null;

  const handleSelectTier = (tier: MembershipTier) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    upgradeMembership(tier);
  };

  const currentTier = currentUser?.membershipTier || 'FREE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-teal-900 via-stone-900 to-stone-900 text-white relative">
          <button
            onClick={() => setMembershipModalOpen(false)}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Nestryy Membership Plans</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Elevate Your Rental & Property Experience
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto">
            Choose the plan tailored for your needs. Unlock Verified Member badges, priority landlord inboxes, and automated screening workflows.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Plan 1: Free */}
          <div className={`rounded-2xl p-6 border transition flex flex-col justify-between ${
            currentTier === 'FREE'
              ? 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40'
              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Starter</span>
                {currentTier === 'FREE' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                    Current Plan
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">Free Standard</h3>
              <div className="mt-3 mb-5">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-white">$0</span>
                <span className="text-xs text-stone-500"> / forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Browse full rental marketplace</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Post Tenant Wanted requests</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Basic in-app scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>250 Welcome Credits</span>
                </li>
              </ul>
            </div>

            <button
              disabled={currentTier === 'FREE'}
              onClick={() => handleSelectTier('FREE')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs disabled:opacity-50"
            >
              {currentTier === 'FREE' ? 'Active Plan' : 'Select Free'}
            </button>
          </div>

          {/* Plan 2: Pro Verified (Featured) */}
          <div className={`rounded-2xl p-6 border-2 transition flex flex-col justify-between relative shadow-lg ${
            currentTier === 'PRO_VERIFIED'
              ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20'
              : 'border-teal-500/80 dark:border-teal-500 bg-gradient-to-b from-teal-50/30 to-white dark:from-teal-950/20 dark:to-stone-900'
          }`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow">
              Most Popular • Verified
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Verified Member
                </span>
                {currentTier === 'PRO_VERIFIED' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">Pro Verified</h3>
              <div className="mt-3 mb-5">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-white">$19</span>
                <span className="text-xs text-stone-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-200 font-medium">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span><strong>Official Verified Member</strong> badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Unlimited applications (No repeat fees)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Priority landlord inbox placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Free Experian soft-credit score check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Direct landlord chat & viewing pass</span>
                </li>
                <li className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span><strong>+500 bonus credits</strong> every month</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectTier('PRO_VERIFIED')}
              className="mt-6 w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>{currentTier === 'PRO_VERIFIED' ? 'Current Plan' : 'Upgrade to Pro ($19/mo)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 3: VIP Enterprise / Landlord Suite */}
          <div className={`rounded-2xl p-6 border transition flex flex-col justify-between ${
            currentTier === 'VIP_ENTERPRISE'
              ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/20'
              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Enterprise
                </span>
                {currentTier === 'VIP_ENTERPRISE' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">VIP Landlord Suite</h3>
              <div className="mt-3 mb-5">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-white">$49</span>
                <span className="text-xs text-stone-500"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Unlimited property listings & syndication</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Integrated TransUnion & RentPrep screening</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Custom application fee setting (keep 100%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Real-time SMS & email tour dispatching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Dedicated portfolio concierge</span>
                </li>
                <li className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span><strong>+1,500 bonus credits</strong> monthly</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectTier('VIP_ENTERPRISE')}
              className="mt-6 w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>{currentTier === 'VIP_ENTERPRISE' ? 'Current Plan' : 'Select VIP Suite ($49/mo)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
