import React from 'react';
import { ShieldCheck, Crown } from 'lucide-react';
import { MembershipTier } from '../types';

export interface VerifiedMemberBadgeProps {
  isVerified?: boolean;
  tier?: 'FREE_VERIFIED' | 'PAID_VERIFIED' | 'NONE' | string;
  membershipTier?: MembershipTier | string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
  showIconOnly?: boolean;
  clickable?: boolean;
}

export const VerifiedMemberBadge: React.FC<VerifiedMemberBadgeProps> = ({
  isVerified = true,
  tier,
  membershipTier,
  className = '',
  size = 'sm',
  onClick,
  showIconOnly = false,
  clickable = false,
}) => {
  // If not verified at all, do not render
  if (!isVerified && tier === 'NONE' && (!membershipTier || membershipTier === 'FREE')) {
    return null;
  }

  // Determine if this user is a Paid Verified Member or Free Verified Member
  const isPaid =
    tier === 'PAID_VERIFIED' ||
    membershipTier === 'PRO_VERIFIED' ||
    membershipTier === 'VIP_ENTERPRISE';

  const label = isPaid ? 'Pro Verified Member' : 'Free Verified Member';
  const designationTitle = isPaid
    ? 'Verified Paid Member (Identity, Soft Credit Check & Background Cleared)'
    : 'Free Verified Member (Government ID & Credentials Cleared)';

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.2 gap-1',
    sm: 'text-[10px] sm:text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-black',
  }[size];

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      onClick={onClick}
      title={designationTitle}
      className={`inline-flex items-center rounded-full font-extrabold uppercase tracking-tight shadow-xs transition select-none ${
        clickable || onClick ? 'cursor-pointer hover:opacity-90 hover:scale-102' : ''
      } ${
        isPaid
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/40 shadow-emerald-500/10'
          : 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
      } ${sizeClasses} ${className}`}
    >
      {isPaid ? (
        <Crown className={`${iconSizes} text-amber-300 flex-shrink-0`} />
      ) : (
        <ShieldCheck className={`${iconSizes} text-teal-600 dark:text-teal-400 flex-shrink-0`} />
      )}
      {!showIconOnly && <span>{label}</span>}
    </span>
  );
};
