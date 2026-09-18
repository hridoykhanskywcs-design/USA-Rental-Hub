import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { firestoreSync } from '../services/firestoreSync';
import {
  X,
  ShieldCheck,
  Building2,
  DollarSign,
  UserCheck,
  FileText,
  ExternalLink,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  CreditCard,
  Camera,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Link2,
  Calendar,
  Home,
  FileCheck,
} from 'lucide-react';
import { CardType, IdentityType } from '../types';

export const ApplicationModal: React.FC = () => {
  const {
    applyingProperty,
    setApplyingProperty,
    settings,
    affiliates,
    triggerAffiliateClick,
    addToast,
    refreshData,
    setCurrentView,
    currentUser,
    setAuthModalOpen,
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [creditConsent, setCreditConsent] = useState<boolean>(true);
  const [showSSN, setShowSSN] = useState<boolean>(false);
  const [showCardCvv, setShowCardCvv] = useState<boolean>(false);
  const [hasGuarantor, setHasGuarantor] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Personal & Contact
    applicantName: 'Jordan Taylor',
    applicantEmail: 'jordan.taylor@example.com',
    applicantPhone: '+1 (415) 890-4122',
    dateOfBirth: '1995-06-18',
    ssn: '124-88-9941',
    linkedin: 'https://linkedin.com/in/jordantaylor-dev',
    facebook: 'https://facebook.com/jordantaylor',
    instagram: '@jordantaylor.sf',
    twitter: '@jordant_tech',

    // Step 2: Residence & Billing
    currentAddress: '420 Mission Street, Apt 18B',
    currentCity: 'San Francisco',
    currentState: 'CA',
    currentZip: '94105',
    addressProofDocName: 'utility_bill_pge_sanfrancisco.pdf',
    addressProofDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    sameBillingAddress: true,
    billingStreet: '420 Mission Street, Apt 18B',
    billingCity: 'San Francisco',
    billingState: 'CA',
    billingZip: '94105',

    // Step 3: Income, Job & Bank Statements
    employer: 'Anthropic AI / Cloudflare',
    jobTitle: 'Senior Systems Engineer',
    employmentType: 'FULL_TIME',
    monthlyIncome: 14500,
    annualIncome: 174000,
    paystubDocName: 'adp_paystub_august2026.pdf',
    paystubDocUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    bankName: 'JPMorgan Chase & Co.',
    accountLast4: '8831',
    averageMonthlyBalance: 42500,
    bankStatementDocName: 'chase_statement_q3_2026.pdf',
    bankStatementDocUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',

    // Step 4: ID, Selfie & Card
    idType: 'DRIVERS_LICENSE' as IdentityType,
    idNumber: 'D9012481',
    idState: 'CA',
    idExpiration: '2029-06-18',
    idFrontDocName: 'ca_driver_license_front.jpg',
    idFrontDocUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    idBackDocName: 'ca_driver_license_back.jpg',
    idBackDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    livenessScore: 99.4,
    selfieCaptured: true,

    // Payment Card
    cardType: 'VISA' as CardType,
    cardNumber: '4532 8891 2345 9012',
    cardExpiry: '08/29',
    cardCvv: '842',
    cardHolderName: 'Jordan Taylor',
    cardZip: '94105',

    // Tenancy preferences
    creditScoreRange: '760 - 850 (Excellent)',
    creditScoreVerified: true,
    moveInDate: '2026-10-01',
    occupantsCount: 1,
    petsCount: 0,
    guarantorName: '',
    guarantorIncome: 18000,

    // Credit & Background Reports Submission
    creditScoreValue: 760,
    creditBureauName: 'TransUnion / Experian',
    creditReportDocName: 'experian_credit_report_aug2026.pdf',
    creditReportDocUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    backgroundCheckStatus: 'CLEAR' as 'CLEAR' | 'PENDING' | 'CONSENT_GRANTED',
    backgroundCheckProvider: 'TransUnion SmartMove Certified',
    backgroundReportDocName: 'transunion_criminal_eviction_report.pdf',
    backgroundReportDocUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  });

  if (!applyingProperty) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 bg-teal-50 dark:bg-teal-950 text-teal-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Account Login Required</h3>
            <p className="text-xs text-stone-500 mt-1">
              To apply for <span className="font-bold text-stone-700 dark:text-stone-300">{applyingProperty.title}</span>, you must be signed in to verify your identity and track your rental application status.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In or Create Account</span>
            </button>
            <button
              onClick={() => setApplyingProperty(null)}
              className="w-full py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-xl text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeAffiliates = affiliates.filter((a) => a.isActive);
  const creditAffiliate = activeAffiliates.find((a) => a.category === 'CREDIT_SCORE') || {
    id: 'aff-default',
    name: settings.creditScorePartnerName || 'Experian SmartScreen',
    url: settings.creditScorePartnerLink || 'https://www.experian.com/connect',
    description: 'Instant credit score check with 0 hard-inquiry rating impact.',
    category: 'CREDIT_SCORE',
    callToActionText: 'Check Credit Score',
  };

  const depositAffiliate = activeAffiliates.find((a) => a.category === 'SECURITY_DEPOSIT');
  const insuranceAffiliate = activeAffiliates.find((a) => a.category === 'RENTERS_INSURANCE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditConsent) {
      addToast('Authorization Required', 'Please accept the screening and background verification consent.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const submitted = await api.submitApplication({
        propertyId: applyingProperty.id,
        propertyTitle: applyingProperty.title,
        propertyRent: applyingProperty.rent,
        applicantId: currentUser?.id || `usr-${Date.now()}`,
        applicantName: formData.applicantName || currentUser?.fullName || 'Jordan Taylor',
        applicantEmail: formData.applicantEmail || currentUser?.email || 'jordan.taylor@example.com',
        applicantPhone: formData.applicantPhone || '+1 (415) 890-4122',
        dateOfBirth: formData.dateOfBirth,
        ssn: formData.ssn,
        currentAddress: `${formData.currentAddress}, ${formData.currentCity}, ${formData.currentState} ${formData.currentZip}`,
        billingAddress: {
          street: formData.sameBillingAddress ? formData.currentAddress : formData.billingStreet,
          city: formData.sameBillingAddress ? formData.currentCity : formData.billingCity,
          state: formData.sameBillingAddress ? formData.currentState : formData.billingState,
          zip: formData.sameBillingAddress ? formData.currentZip : formData.billingZip,
          country: 'United States',
        },
        cardDetails: {
          cardType: formData.cardType,
          cardNumber: formData.cardNumber,
          cardExpiry: formData.cardExpiry,
          cardCvv: formData.cardCvv,
          cardHolderName: formData.cardHolderName,
          billingZip: formData.cardZip,
          lastFour: formData.cardNumber.replace(/\s+/g, '').slice(-4) || '9012',
        },
        identityVerification: {
          idType: formData.idType,
          idNumber: formData.idNumber,
          idState: formData.idState,
          idExpiration: formData.idExpiration,
          idFrontUrl: formData.idFrontDocUrl,
          idBackUrl: formData.idBackDocUrl,
        },
        selfieVerification: {
          selfieUrl: formData.selfieUrl,
          livenessConfidenceScore: formData.livenessScore,
          biometricMatchPassed: true,
          capturedAt: new Date().toISOString(),
        },
        monthlyIncome: Number(formData.monthlyIncome),
        employer: formData.employer,
        jobTitle: formData.jobTitle,
        incomeProof: {
          employer: formData.employer,
          jobTitle: formData.jobTitle,
          employmentType: formData.employmentType,
          annualIncome: Number(formData.annualIncome) || Number(formData.monthlyIncome) * 12,
          paystubDocUrl: formData.paystubDocUrl,
        },
        bankStatement: {
          institutionName: formData.bankName,
          accountHolder: formData.applicantName,
          accountLast4: formData.accountLast4,
          averageMonthlyBalance: Number(formData.averageMonthlyBalance),
          statementPdfUrl: formData.bankStatementDocUrl,
          verifiedBalance: true,
        },
        addressProofDocumentUrl: formData.addressProofDocUrl,
        socialLinks: {
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
        },
        creditScoreRange: formData.creditScoreRange,
        creditScoreVerified: formData.creditScoreVerified,
        creditScoreReportUrl: creditAffiliate.url,
        creditScoreValue: Number(formData.creditScoreValue) || 760,
        creditBureauName: formData.creditBureauName,
        creditReportDocUrl: formData.creditReportDocUrl,
        backgroundCheckStatus: formData.backgroundCheckStatus,
        backgroundCheckProvider: formData.backgroundCheckProvider,
        backgroundReportDocUrl: formData.backgroundReportDocUrl,
        hasGuarantor,
        guarantorName: hasGuarantor ? formData.guarantorName : undefined,
        guarantorIncome: hasGuarantor ? Number(formData.guarantorIncome) : undefined,
        petsCount: Number(formData.petsCount),
        occupantsCount: Number(formData.occupantsCount),
        moveInDate: formData.moveInDate,
        verifiedMemberBadge: !!currentUser?.isVerifiedMember,
        verifiedMemberTier: (currentUser?.verifiedPlanType === 'PAID_VERIFIED' || currentUser?.membershipTier === 'PRO_VERIFIED' || currentUser?.membershipTier === 'VIP_ENTERPRISE') ? 'PRO_VERIFIED' : 'FREE_VERIFIED',
        adminNotes: 'High-trust Verified Tenant Dossier with Card on file, DL front/back, Bank Statement, Credit Score & Background report, and Biometric Selfie match.',
      });
      if (submitted) {
        firestoreSync.submitApplication(submitted).catch(() => {});
      }

      addToast(
        'Verified Application Submitted!',
        'Your comprehensive rental profile and verification data were secured and transmitted to the property host.',
        'success'
      );
      setApplyingProperty(null);
      await refreshData();
      setCurrentView('TENANT_PORTAL');
    } catch (err) {
      console.error('Submission error:', err);
      addToast('Error', 'Failed to submit application. Please try again.', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-850">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Tenant Application & KYC Screening
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white truncate max-w-md mt-1">
              Apply for {applyingProperty.title}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Rent: ${applyingProperty.rent.toLocaleString()}/mo &bull; {applyingProperty.address.street}, {applyingProperty.address.city}, {applyingProperty.address.state}
            </p>
          </div>

          <button
            onClick={() => setApplyingProperty(null)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900 text-xs font-semibold">
          {[
            { num: 1, label: 'Personal & Social' },
            { num: 2, label: 'Address Proof' },
            { num: 3, label: 'Income & Bank' },
            { num: 4, label: 'ID, Credit & Background' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`py-3 px-2 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                step === s.num
                  ? 'border-teal-600 text-teal-700 dark:text-teal-400 bg-teal-50/40 dark:bg-teal-950/20'
                  : step > s.num
                  ? 'border-transparent text-stone-700 dark:text-stone-300'
                  : 'border-transparent text-stone-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === s.num
                    ? 'bg-teal-600 text-white font-bold'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-700 font-bold'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline truncate">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Affiliate Offers Quick Bar */}
        <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-indigo-500/10 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="font-semibold text-[11px] truncate">
              Partner Perks: Get pre-screened &amp; waive deposits with partner links!
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {creditAffiliate && (
              <button
                type="button"
                onClick={() => triggerAffiliateClick(creditAffiliate.id, creditAffiliate.url)}
                className="px-2.5 py-1 bg-white dark:bg-stone-800 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-lg font-bold text-[11px] hover:bg-teal-50 transition-colors flex items-center gap-1"
              >
                <span>{creditAffiliate.name}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            {depositAffiliate && (
              <button
                type="button"
                onClick={() => triggerAffiliateClick(depositAffiliate.id, depositAffiliate.url)}
                className="hidden md:flex px-2.5 py-1 bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg font-bold text-[11px] hover:bg-amber-50 transition-colors items-center gap-1"
              >
                <span>{depositAffiliate.name}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* STEP 1: Personal, SSN, DOB & Social Links */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  Primary Applicant Identity & Contact Information
                </h4>
                <span className="text-[11px] text-stone-400">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Full Legal Name (as on ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.applicantEmail}
                    onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.applicantPhone}
                    onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Date of Birth (DOB) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      Social Security No. (SSN) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSSN(!showSSN)}
                      className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      {showSSN ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showSSN ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showSSN ? 'text' : 'password'}
                      required
                      placeholder="XXX-XX-XXXX"
                      value={formData.ssn}
                      onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                <h5 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-teal-600" />
                  Applicant Social Profiles &amp; Web Presence (Higher Trust Score)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Instagram Handle or URL
                    </label>
                    <input
                      type="text"
                      placeholder="@username or profile link"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Facebook Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/username"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Twitter / X Handle
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Continue to Address &amp; Proof of Residence</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Residence, Billing Address & Address Proof Document */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Home className="w-4 h-4 text-teal-600" />
                  Current Residence, Billing Address &amp; Address Verification
                </h4>
                <span className="text-[11px] text-stone-400">Step 2 of 4</span>
              </div>

              {/* Current Residence */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Current Residential Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentState}
                    onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentZip}
                    onChange={(e) => setFormData({ ...formData, currentZip: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Address Proof Document Upload */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-white">
                        Address Proof Document (Utility Bill, Cable, or Lease) *
                      </h5>
                      <p className="text-[11px] text-stone-500">
                        Must be dated within last 60 days matching your current address.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded text-[10px] font-bold">
                    Uploaded &amp; Verified
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  <img
                    src={formData.addressProofDocUrl}
                    alt="Address Proof Document"
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                      {formData.addressProofDocName}
                    </p>
                    <p className="text-[11px] text-stone-500">PG&amp;E Utility Statement &bull; 1.4 MB PDF</p>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormData({ ...formData, addressProofDocName: e.target.files[0].name });
                          addToast('Document Attached', `${e.target.files[0].name} attached successfully.`, 'success');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Billing Address Section */}
              <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-2xl border border-teal-200/70 dark:border-teal-900/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white">
                      Payment &amp; Screening Billing Address
                    </h5>
                    <p className="text-[11px] text-stone-500">Used for credit checks and card billing verification.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-teal-700 dark:text-teal-400">
                    <input
                      type="checkbox"
                      checked={formData.sameBillingAddress}
                      onChange={(e) => setFormData({ ...formData, sameBillingAddress: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Same as Current Residence</span>
                  </label>
                </div>

                {!formData.sameBillingAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Billing Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.billingStreet}
                        onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Billing City
                      </label>
                      <input
                        type="text"
                        value={formData.billingCity}
                        onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Billing State
                      </label>
                      <input
                        type="text"
                        value={formData.billingState}
                        onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Billing ZIP
                      </label>
                      <input
                        type="text"
                        value={formData.billingZip}
                        onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Continue to Income &amp; Bank Statements</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Income Proof & Bank Statements */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  Employment, Income Proof &amp; Bank Statements
                </h4>
                <span className="text-[11px] text-stone-400">Step 3 of 4</span>
              </div>

              {/* Employment inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Current Employer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employer}
                    onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Monthly Gross Income ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyIncome}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlyIncome: Number(e.target.value),
                        annualIncome: Number(e.target.value) * 12,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Paystub / Income Proof Upload Card */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-white">
                        Official Income Proof (Paystub / W-2 / Offer Letter) *
                      </h5>
                      <p className="text-[11px] text-stone-500">
                        Shows year-to-date earnings and employer letterhead.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded text-[10px] font-bold">
                    W-2 &amp; Paystub Attached
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  <img
                    src={formData.paystubDocUrl}
                    alt="Paystub Document"
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                      {formData.paystubDocName}
                    </p>
                    <p className="text-[11px] text-stone-500">ADP Corporate Payroll &bull; 850 KB PDF</p>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormData({ ...formData, paystubDocName: e.target.files[0].name });
                          addToast('Paystub Uploaded', `${e.target.files[0].name} attached.`, 'success');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Bank Statement Section */}
              <div className="p-4 bg-teal-50/40 dark:bg-teal-950/20 rounded-2xl border border-teal-200/70 dark:border-teal-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      Verified Bank Statement Details
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      Demonstrates financial liquidity and reserve balance to the landlord.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 rounded text-[10px] font-bold">
                    Statement Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Banking Institution *
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Account Last 4 Digits *
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.accountLast4}
                      onChange={(e) => setFormData({ ...formData, accountLast4: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Average Balance ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.averageMonthlyBalance}
                      onChange={(e) => setFormData({ ...formData, averageMonthlyBalance: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  <img
                    src={formData.bankStatementDocUrl}
                    alt="Bank Statement Document"
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                      {formData.bankStatementDocName}
                    </p>
                    <p className="text-[11px] text-stone-500">Official Monthly Statement PDF &bull; 2.1 MB</p>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Statement</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormData({ ...formData, bankStatementDocName: e.target.files[0].name });
                          addToast('Statement Attached', `${e.target.files[0].name} attached.`, 'success');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Guarantor Option */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      Add Guarantor or Co-Signer (Optional)
                    </span>
                    <p className="text-[11px] text-stone-500">Strengthen application qualification if needed.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasGuarantor}
                    onChange={(e) => setHasGuarantor(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                  />
                </div>

                {hasGuarantor && (
                  <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                    <input
                      type="text"
                      placeholder="Guarantor Full Legal Name"
                      value={formData.guarantorName}
                      onChange={(e) => setFormData({ ...formData, guarantorName: e.target.value })}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                    <input
                      type="number"
                      placeholder="Guarantor Monthly Income ($)"
                      value={formData.guarantorIncome}
                      onChange={(e) => setFormData({ ...formData, guarantorIncome: Number(e.target.value) })}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Continue to DL, Selfie &amp; Payment Card</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Driver's License / State ID, Live Selfie Biometrics & Credit/Debit Card on File */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Government ID, Live Selfie &amp; Verified Card on File
                </h4>
                <span className="text-[11px] text-stone-400">Step 4 of 4</span>
              </div>

              {/* DL / State ID Details */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    Government Issued Identification (DL or State ID) *
                  </h5>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Front &amp; Back Document Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      ID Document Type
                    </label>
                    <select
                      value={formData.idType}
                      onChange={(e) => setFormData({ ...formData, idType: e.target.value as IdentityType })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    >
                      <option value="DRIVERS_LICENSE">Driver's License (DL)</option>
                      <option value="STATE_ID">State Identification (State ID)</option>
                      <option value="PASSPORT">US / Foreign Passport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      ID Document Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Issuing State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.idState}
                      onChange={(e) => setFormData({ ...formData, idState: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Expiration Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.idExpiration}
                      onChange={(e) => setFormData({ ...formData, idExpiration: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* ID Front and Back Preview Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-3">
                    <img
                      src={formData.idFrontDocUrl}
                      alt="ID Front"
                      className="w-16 h-11 object-cover rounded-lg border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        ID Card Front Photo
                      </p>
                      <p className="text-[11px] text-stone-400">{formData.idFrontDocName}</p>
                    </div>
                    <label className="cursor-pointer px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 rounded text-[10px] font-bold">
                      Upload
                      <input type="file" className="hidden" />
                    </label>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-3">
                    <img
                      src={formData.idBackDocUrl}
                      alt="ID Back"
                      className="w-16 h-11 object-cover rounded-lg border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        ID Card Back (Barcode)
                      </p>
                      <p className="text-[11px] text-stone-400">{formData.idBackDocName}</p>
                    </div>
                    <label className="cursor-pointer px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 rounded text-[10px] font-bold">
                      Upload
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Selfie Biometric Verification */}
              <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-2xl border border-teal-200/70 dark:border-teal-900/50 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <img
                    src={formData.selfieUrl}
                    alt="Applicant Live Selfie"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-teal-600 text-white rounded-full">
                    <Camera className="w-3 h-3" />
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white">
                      Live Selfie &amp; Biometric Liveness Verification
                    </h5>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                      Match Score: {formData.livenessScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
                    Automated facial biometric comparison confirmed identity against submitted California DL photograph.
                  </p>
                  <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => addToast('Biometric Scan Ready', 'Live camera checked: Biometric match verified at 99.4%.', 'success')}
                      className="px-3 py-1 bg-teal-600 text-white rounded-lg text-[11px] font-bold hover:bg-teal-700 transition-colors flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Retake Live Selfie</span>
                    </button>
                    <span className="text-[10px] text-stone-500">Anti-spoofing passed</span>
                  </div>
                </div>
              </div>

              {/* Full Credit / Debit / Master Card Details */}
              <div className="p-4 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl border border-stone-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-teal-400" />
                    <h5 className="text-xs font-bold">
                      Credit, Debit, or MasterCard on File (Security &amp; Rent Hold) *
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 bg-stone-800 text-teal-400 text-[10px] font-mono font-bold rounded">
                    256-BIT ENCRYPTED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4532 8891 2345 9012"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-stone-800 border border-stone-700 text-white outline-none focus:ring-1 focus:ring-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Card Type
                    </label>
                    <select
                      value={formData.cardType}
                      onChange={(e) => setFormData({ ...formData, cardType: e.target.value as CardType })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white"
                    >
                      <option value="VISA">Visa</option>
                      <option value="MASTERCARD">MasterCard</option>
                      <option value="AMEX">American Express</option>
                      <option value="DISCOVER">Discover</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Expiration (MM/YY) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-stone-800 border border-stone-700 text-white outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Cardholder Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cardHolderName}
                      onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] text-stone-400">CVV *</label>
                      <button
                        type="button"
                        onClick={() => setShowCardCvv(!showCardCvv)}
                        className="text-[10px] text-teal-400 hover:underline"
                      >
                        {showCardCvv ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showCardCvv ? 'text' : 'password'}
                      maxLength={4}
                      required
                      value={formData.cardCvv}
                      onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-stone-800 border border-stone-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Card ZIP *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cardZip}
                      onChange={(e) => setFormData({ ...formData, cardZip: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-stone-800 border border-stone-700 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DEDICATED SECTION: Submitting Credits and Background Reports */}
              <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200/50 dark:border-emerald-900/40">
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Credit Score &amp; Comprehensive Background Reports Submission</span>
                    </h5>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Submit your certified credit score and background check dossier to expedite landlord approval.
                    </p>
                  </div>
                  <span className="self-start sm:self-auto px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 rounded text-[10px] font-bold">
                    FCRA Compliant Submission
                  </span>
                </div>

                {/* Sub-card 1: Credit Score Report Submission */}
                <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-emerald-100 dark:border-emerald-950 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      Credit Score &amp; Credit Bureau Dossier
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                      Pre-Screened
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Exact Credit Score (300 - 850) *
                      </label>
                      <input
                        type="number"
                        min={300}
                        max={850}
                        value={formData.creditScoreValue}
                        onChange={(e) => setFormData({ ...formData, creditScoreValue: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs font-bold font-mono rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Reporting Credit Bureau / System *
                      </label>
                      <select
                        value={formData.creditBureauName}
                        onChange={(e) => setFormData({ ...formData, creditBureauName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                      >
                        <option value="TransUnion / Experian">TransUnion / Experian (Recommended)</option>
                        <option value="TransUnion SmartMove Certified">TransUnion SmartMove Certified</option>
                        <option value="Experian Connect Soft Check">Experian Connect Soft Check</option>
                        <option value="Equifax ResidentScore">Equifax ResidentScore</option>
                        <option value="Credit Karma Consumer Disclosure">Credit Karma Consumer Disclosure</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700">
                    <FileCheck className="w-8 h-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                        {formData.creditReportDocName}
                      </p>
                      <p className="text-[10px] text-stone-500">Official Credit Report PDF &bull; TransUnion Verified</p>
                    </div>
                    <label className="cursor-pointer px-2.5 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-lg border border-stone-300 dark:border-stone-600 transition flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Report</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFormData({ ...formData, creditReportDocName: e.target.files[0].name });
                            addToast('Credit Report Uploaded', `${e.target.files[0].name} submitted to application.`, 'success');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Sub-card 2: Background Report Submission */}
                <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-emerald-100 dark:border-emerald-950 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Criminal History &amp; Eviction Screening Report
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Clearance Attached
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Background Check Status *
                      </label>
                      <select
                        value={formData.backgroundCheckStatus}
                        onChange={(e) => setFormData({ ...formData, backgroundCheckStatus: e.target.value as 'CLEAR' | 'PENDING' | 'CONSENT_GRANTED' })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                      >
                        <option value="CLEAR">CLEAR - Zero Evictions or Criminal Records</option>
                        <option value="CONSENT_GRANTED">CONSENT GRANTED - Run automated background check</option>
                        <option value="PENDING">PENDING - External Report Uploaded Below</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Screening Agency / Provider *
                      </label>
                      <input
                        type="text"
                        value={formData.backgroundCheckProvider}
                        onChange={(e) => setFormData({ ...formData, backgroundCheckProvider: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700">
                    <FileCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                        {formData.backgroundReportDocName}
                      </p>
                      <p className="text-[10px] text-stone-500">Certified Background &amp; Eviction Report PDF &bull; Passed</p>
                    </div>
                    <label className="cursor-pointer px-2.5 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-lg border border-stone-300 dark:border-stone-600 transition flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Background PDF</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFormData({ ...formData, backgroundReportDocName: e.target.files[0].name });
                            addToast('Background Report Uploaded', `${e.target.files[0].name} submitted to application.`, 'success');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Move-in & Legal Authorization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Target Move-In Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Credit Score Tier
                  </label>
                  <select
                    value={formData.creditScoreRange}
                    onChange={(e) => setFormData({ ...formData, creditScoreRange: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="760 - 850 (Excellent)">760 - 850 (Excellent)</option>
                    <option value="720 - 759 (Good)">720 - 759 (Good)</option>
                    <option value="680 - 719 (Fair / Good)">680 - 719 (Fair / Good)</option>
                    <option value="620 - 679 (Conditional)">620 - 679 (Conditional)</option>
                  </select>
                </div>
              </div>

              {/* Legal Screening Consent Checkbox */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={creditConsent}
                  onChange={(e) => setCreditConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed cursor-pointer">
                  I certify that all personal, financial, and identification data provided is truthful and complete. I authorize Nestryy and its verified landlords to verify my DL, bank statements, SSN, and conduct screening under the FCRA.
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300"
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Verified Application...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Complete Verified Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
