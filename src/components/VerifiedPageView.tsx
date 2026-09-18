import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { firebaseStorageService } from '../services/firebaseStorage';
import { ScreeningDocument } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  CreditCard,
  Crown,
  FileText,
  Upload,
  UserCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Eye,
  Building2,
  Zap,
} from 'lucide-react';

export const VerifiedPageView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    settings,
    upgradeToVerified,
    userScreeningDocs,
    addScreeningDoc,
    setAuthModalOpen,
    setCurrentView,
    addToast,
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'FREE_VERIFIED' | 'PAID_VERIFIED'>('PAID_VERIFIED');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Payment form state
  const [cardHolder, setCardHolder] = useState(currentUser?.fullName || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [billingZip, setBillingZip] = useState('');

  // Document upload state
  const [uploadDocType, setUploadDocType] = useState<ScreeningDocument['docType']>('CREDIT_REPORT');
  const [docTitle, setDocTitle] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVerified = currentUser?.isVerifiedMember;
  const currentPlan = currentUser?.verifiedPlanType || (isVerified ? 'PAID_VERIFIED' : 'NONE');

  const monthlyPrice = settings.membershipOptions?.paidVerifiedPrice || 19;
  const annualPrice = Math.round(monthlyPrice * 10); // 2 months free

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format: 16 digits spaced in 4s
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleProcessUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (selectedPlan === 'FREE_VERIFIED') {
      await upgradeToVerified('FREE_VERIFIED');
      setPaymentSuccess(true);
      return;
    }

    // Process paid verification
    if (!cardNumber || !cardExpiry || !cardCvv || !billingZip) {
      addToast('Missing Details', 'Please complete all required payment fields.', 'warning');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Simulate gateway authorization with real payment details recorded
      await new Promise((res) => setTimeout(res, 1200));

      const paymentDetails = {
        cardHolderName: cardHolder || currentUser.fullName,
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardExpiry,
        cardCvv,
        cardType: cardNumber.startsWith('4') ? 'Visa' : cardNumber.startsWith('5') ? 'Mastercard' : 'Credit Card',
        billingZip,
      };

      await upgradeToVerified('PAID_VERIFIED', paymentDetails);
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
    } catch (err) {
      setIsProcessingPayment(false);
      addToast('Payment Failed', 'Please verify your card details and retry.', 'alert');
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const file = files[0];
    setIsUploadingDoc(true);

    try {
      const fileUrl = await firebaseStorageService.uploadScreeningDoc(file, currentUser.id);

      const newDoc: ScreeningDocument = {
        id: `doc-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        userEmail: currentUser.email,
        docType: uploadDocType,
        title: docTitle || file.name,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'VERIFIED',
      };

      addScreeningDoc(newDoc);
      setDocTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Document upload error:', err);
      addToast('Upload Error', 'Could not upload document. Please retry with PDF or JPG/PNG.', 'alert');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-stone-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Nestryy Tenant Verification</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Stand Out to Landlords with the <span className="text-teal-400">Verified Badge</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Fast-track your next home approval. Landlords prioritize Verified Members who have pre-validated identity, verified income, and FCRA soft credit screening.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>3x Higher Application Acceptance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Zero Repeat Application Fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Zero Impact on Credit Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Status Notification */}
      {isVerified ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  You are a Verified Member ({currentPlan === 'PAID_VERIFIED' ? 'Pro Verified Plan' : 'Free Verified Plan'})
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                Your verified credentials and badge are automatically displayed on all your inquiries and applications. You can upgrade or adjust your membership anytime below.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('membership-plans');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 flex-shrink-0"
          >
            <span>Change / Manage Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center flex-shrink-0 shadow-sm font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-950 dark:text-amber-200">
                Public Profile Verified Details are Currently Locked
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Complete your Free or Pro Verified membership below to unlock the official Verified Badge on your tenant profile and applications.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('membership-plans');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5 flex-shrink-0 shadow-sm"
          >
            <span>Unlock Verified Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Public Profile Comparison: Basic vs Verified */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              <span>Public Tenant Profile Preview</span>
            </h2>
            <p className="text-xs text-stone-500">
              This is how your application appears to property managers and landlords across the US.
            </p>
          </div>
          <span className="text-xs font-bold text-stone-400">Live Preview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unverified / Basic Public Profile */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-5 bg-stone-50/50 dark:bg-stone-800/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Basic Public View (Default)
              </span>
              <span className="text-[10px] font-bold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full">
                Standard
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300">
                {currentUser?.fullName ? currentUser.fullName[0] : 'T'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  {currentUser?.fullName || 'Prospective Tenant'}
                </h4>
                <p className="text-xs text-stone-500">{currentUser?.email || 'tenant@email.com'}</p>
              </div>
            </div>

            {/* Locked Details Section */}
            <div className="space-y-2 border-t border-stone-200 dark:border-stone-700 pt-3">
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl relative overflow-hidden">
                <div className="filter blur-[3px] select-none text-xs space-y-1 text-stone-600 dark:text-stone-400">
                  <p>Credit Score: 745 (Excellent Tier - Soft Check Confirmed)</p>
                  <p>Annual Income: $115,000 Verified via Paystubs</p>
                  <p>Background: Clear Criminal & Eviction History</p>
                </div>
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center gap-2 text-white text-xs font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verified Credentials Locked</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 text-center">
                Landlords see standard application queue without priority.
              </p>
            </div>
          </div>

          {/* Verified Member Public Profile */}
          <div className="border-2 border-teal-500 dark:border-teal-500/80 rounded-2xl p-5 bg-teal-50/30 dark:bg-teal-950/20 space-y-4 relative shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Member Profile (Upgraded)</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-teal-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-base shadow-sm ring-2 ring-teal-400">
                {currentUser?.fullName ? currentUser.fullName[0] : 'V'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                    {currentUser?.fullName || 'Verified Member Tenant'}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-xs text-teal-800 dark:text-teal-300 font-semibold">
                  Pre-Screened &bull; Priority Application Packet
                </p>
              </div>
            </div>

            {/* Unlocked Credentials Section */}
            <div className="space-y-2 border-t border-teal-200 dark:border-teal-900/60 pt-3 text-xs">
              <div className="p-3 bg-white dark:bg-stone-800/80 rounded-xl border border-teal-200 dark:border-teal-900/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Credit Score Status</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Experian Soft-Check Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Identity &amp; ID</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Gov Photo ID Validated
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">Income Verification</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    W-2 &amp; Paystubs Attached
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-teal-800 dark:text-teal-300 font-bold text-center">
                Dispatched directly to landlord with FCRA compliance guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Plans Section */}
      <div id="membership-plans" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Choose Your Verification Plan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Select the plan that matches your move timeline. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-bold mt-2">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingCycle === 'MONTHLY' ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-stone-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                billingCycle === 'ANNUAL' ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-stone-500'
              }`}
            >
              <span>Annual (Save 17%)</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] px-1 rounded font-bold">PRO</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Plan 1: Free Verification */}
          <div
            onClick={() => setSelectedPlan('FREE_VERIFIED')}
            className={`cursor-pointer rounded-3xl p-6 sm:p-8 border-2 transition flex flex-col justify-between bg-white dark:bg-stone-900 ${
              selectedPlan === 'FREE_VERIFIED'
                ? 'border-teal-600 shadow-xl ring-2 ring-teal-600/20'
                : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">Free Plan</h3>
                  <p className="text-xs text-stone-500">Default standard verification for renters.</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-black bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full">
                  DEFAULT
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-stone-900 dark:text-white">$0</span>
                <span className="text-xs text-stone-500">/ forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Basic tenant verification profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Upload paystubs &amp; standard documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Apply to standard verified rentals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>250 Welcome Credits for AI search &amp; tools</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlan('FREE_VERIFIED')}
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedPlan === 'FREE_VERIFIED'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {selectedPlan === 'FREE_VERIFIED' ? 'Selected Plan' : 'Choose Free Plan'}
            </button>
          </div>

          {/* Plan 2: Pro Verified Plan */}
          <div
            onClick={() => setSelectedPlan('PAID_VERIFIED')}
            className={`cursor-pointer rounded-3xl p-6 sm:p-8 border-2 transition flex flex-col justify-between bg-white dark:bg-stone-900 relative ${
              selectedPlan === 'PAID_VERIFIED'
                ? 'border-teal-600 shadow-xl ring-2 ring-teal-600/20'
                : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
            }`}
          >
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Recommended</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <span>Pro Verified Plan</span>
                    <Crown className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-xs text-stone-500">Fast-track approval with complete pre-screening.</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-teal-600 dark:text-teal-400">
                  ${billingCycle === 'MONTHLY' ? monthlyPrice : annualPrice}
                </span>
                <span className="text-xs text-stone-500">
                  {billingCycle === 'MONTHLY' ? '/ month' : '/ year'}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                <li className="flex items-center gap-2 font-semibold text-teal-900 dark:text-teal-200">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Official Verified Member Badge on all applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Full Soft Credit Report &amp; Background sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Zero repeat application fees on all properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Priority Landlord Dispatching &amp; Direct Chat Pass</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>+1,000 Monthly Bonus Credits</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlan('PAID_VERIFIED')}
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedPlan === 'PAID_VERIFIED'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {selectedPlan === 'PAID_VERIFIED' ? 'Selected Plan' : 'Choose Pro Verified'}
            </button>
          </div>
        </div>
      </div>

      {/* Payment & Activation Card */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base text-stone-900 dark:text-white">
              {selectedPlan === 'PAID_VERIFIED' ? 'Payment & Membership Upgrade' : 'Confirm Free Verification'}
            </h3>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {selectedPlan === 'PAID_VERIFIED' ? `$${billingCycle === 'MONTHLY' ? monthlyPrice : annualPrice} Total` : '$0 Free'}
          </span>
        </div>

        {paymentSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-950/60 text-teal-600 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-stone-900 dark:text-white">
              {selectedPlan === 'PAID_VERIFIED' ? 'Pro Verification Activated!' : 'Free Verification Enabled!'}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Your tenant profile has been upgraded with the Verified Member accreditation. Landlords will see your verified status immediately.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setCurrentView('TENANT_PORTAL')}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Go to Tenant Portal
              </button>
              <button
                onClick={() => setCurrentView('MARKETPLACE')}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold"
              >
                Explore Rentals
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProcessUpgrade} className="space-y-4 text-xs">
            {selectedPlan === 'PAID_VERIFIED' ? (
              <>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Full name as printed on card"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono focus:outline-teal-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Expires (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Billing ZIP
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="94107"
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value.slice(0, 5))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono focus:outline-teal-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span>256-bit encrypted checkout. Admin review &amp; card verification enabled.</span>
                </div>
              </>
            ) : (
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                <p className="text-stone-700 dark:text-stone-300 font-medium">
                  Free Verification requires zero payment. Your basic profile will be tagged with Standard Verification, and you can upgrade anytime.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessingPayment}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing &amp; Upgrading Account...</span>
                </>
              ) : selectedPlan === 'PAID_VERIFIED' ? (
                <>
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>
                    Upgrade to Pro Verified &bull; ${billingCycle === 'MONTHLY' ? monthlyPrice : annualPrice}
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Free Verification</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Direct Screening Document Upload Section */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600" />
              <span>Screening Documents &amp; Reports</span>
            </h2>
            <p className="text-xs text-stone-500">
              Upload credit reports, background check screenshots, government photo IDs, and income paystubs. Securely stored in Firebase Storage.
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-600">
            {(userScreeningDocs || []).length} Document(s) On File
          </span>
        </div>

        {/* Upload Form */}
        <div className="p-5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Document Category
              </label>
              <select
                value={uploadDocType}
                onChange={(e) => setUploadDocType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="CREDIT_REPORT">Credit Report (Experian, TransUnion, Equifax)</option>
                <option value="BACKGROUND_REPORT">Background Report / Clearance</option>
                <option value="GOV_ID">Government Photo ID (Driver's License / Passport)</option>
                <option value="PAYSTUB">Paystub / Proof of Income</option>
                <option value="W2">W-2 Form / Tax Return</option>
                <option value="BANK_STATEMENT">Bank Statement</option>
                <option value="OTHER">Other Verification Document</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                Document Title / Note (Optional)
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. 2026 Experian Score 745 Screenshot"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer transition bg-white dark:bg-stone-900/60"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            {isUploadingDoc ? (
              <div className="flex flex-col items-center gap-2 text-teal-600">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold">Uploading &amp; Encrypting Document...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
                  Click to select or drag &amp; drop Credit/Background Report
                </p>
                <p className="text-[11px] text-stone-400">
                  Supports PDF, PNG, JPG, and mobile screenshots up to 25MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Documents List */}
        {(userScreeningDocs || []).length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Your Attached Screening Records
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(userScreeningDocs || []).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-stone-900 dark:text-white truncate">
                        {doc.title || doc.fileName}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {doc.docType.replace('_', ' ')} &bull; {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-[10px] font-bold rounded-lg flex-shrink-0"
                  >
                    View File
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
