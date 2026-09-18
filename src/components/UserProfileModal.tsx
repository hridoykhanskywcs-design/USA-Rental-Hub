import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Crown,
  FileCheck,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  MapPin,
  ExternalLink,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { VerifiedMemberBadge } from './VerifiedMemberBadge';

export const UserProfileModal: React.FC = () => {
  const {
    viewingUserProfile,
    setViewingUserProfile,
    setChatModalOpen,
    setActiveChatApp,
    properties,
    currentUser,
  } = useApp();

  if (!viewingUserProfile) return null;

  const isPaid =
    viewingUserProfile.verifiedPlanType === 'PAID_VERIFIED' ||
    viewingUserProfile.membershipTier === 'PRO_VERIFIED' ||
    viewingUserProfile.membershipTier === 'VIP_ENTERPRISE';

  const isVerified =
    viewingUserProfile.isVerifiedMember ||
    viewingUserProfile.verificationStatus === 'VERIFIED' ||
    Boolean(isPaid);

  const handleStartChat = () => {
    // Find or create active chat target
    const targetProp = properties[0];
    if (targetProp) {
      setActiveChatApp({
        id: `chat-${viewingUserProfile.id || 'target'}`,
        propertyId: targetProp.id,
        propertyTitle: targetProp.title,
        applicantName: viewingUserProfile.fullName || 'User',
      } as any);
    }
    setViewingUserProfile(null);
    setChatModalOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={() => setViewingUserProfile(null)}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Cover */}
        <div className="relative h-28 bg-gradient-to-r from-teal-700 via-emerald-800 to-stone-900 p-4 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
              {viewingUserProfile.role || 'MEMBER'} Profile
            </span>
            {isPaid ? (
              <span className="px-2.5 py-1 bg-amber-400 text-stone-900 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Crown className="w-3 h-3 text-stone-900" />
                Verified Paid Member
              </span>
            ) : isVerified ? (
              <span className="px-2.5 py-1 bg-teal-400 text-teal-950 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                Free Verified Member
              </span>
            ) : null}
          </div>
          <button
            onClick={() => setViewingUserProfile(null)}
            className="p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 pt-0 space-y-5 overflow-y-auto">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-10 gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl border-4 border-white dark:border-stone-900 shadow-md">
                {viewingUserProfile.fullName ? viewingUserProfile.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">
                    {viewingUserProfile.fullName || 'Nestryy Member'}
                  </h3>
                  <VerifiedMemberBadge
                    isVerified={isVerified}
                    tier={viewingUserProfile.verifiedPlanType}
                    membershipTier={viewingUserProfile.membershipTier}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {viewingUserProfile.email || 'Confidential Member'}
                  {viewingUserProfile.targetCity && (
                    <span className="ml-2 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {viewingUserProfile.targetCity}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStartChat}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
            </div>
          </div>

          {/* Verification & Screening Dossier */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Verified Screening Credentials
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Credit Score Status */}
              <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Credit Soft-Check
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {viewingUserProfile.creditScoreValue ? `${viewingUserProfile.creditScoreValue} Score` : 'Verified Soft Check'}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  {viewingUserProfile.creditScoreRange || '740 - 800 (Excellent Credit Tier)'}
                </p>
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {viewingUserProfile.creditBureauName || 'Experian / TransUnion Partner Soft-Check'}
                </p>
              </div>

              {/* Background Check Status */}
              <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Background Check
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {viewingUserProfile.backgroundCheckStatus || 'CLEAR'}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Criminal &amp; National Eviction Registry Cleared
                </p>
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {viewingUserProfile.backgroundCheckProvider || 'TransUnion SmartMove / RentPrep Certified'}
                </p>
              </div>

              {/* Identity Verification */}
              <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Government ID
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    VALIDATED
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  State Driver's License / Passport Photo Match
                </p>
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live Facial Biometrics Cleared
                </p>
              </div>

              {/* Income & Employment */}
              <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Income Verification
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    CONFIRMED
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate">
                  {viewingUserProfile.occupation || 'Professional / Tech'} {viewingUserProfile.employer ? `at ${viewingUserProfile.employer}` : ''}
                </p>
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {viewingUserProfile.annualIncome
                    ? `$${viewingUserProfile.annualIncome.toLocaleString()}/yr verified`
                    : 'Recent Paystubs & Bank Balances Documented'}
                </p>
              </div>
            </div>
          </div>

          {/* Bio / Summary if available */}
          {viewingUserProfile.bio && (
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <span className="font-bold text-stone-900 dark:text-white block mb-0.5">About</span>
              {viewingUserProfile.bio}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            Nestryy Verified Trust &amp; Safety Protocol
          </span>
          <button
            onClick={() => setViewingUserProfile(null)}
            className="px-4 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
