import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Upload, FileText, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const VerifyMemberModal: React.FC = () => {
  const { isVerifyMemberModalOpen, setVerifyMemberModalOpen, verifyMemberSuccess, currentUser, setAuthModalOpen } = useApp();

  const [idType, setIdType] = useState('DRIVERS_LICENSE');
  const [idNumber, setIdNumber] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('7500');
  const [creditConsent, setCreditConsent] = useState(true);
  const [uploadedDocName, setUploadedDocName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVerifyMemberModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      verifyMemberSuccess();
    }, 1200);
  };

  const handleFakeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedDocName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-emerald-50/80 dark:bg-emerald-950/40 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                  Verified Member Certification
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 rounded-full">
                  Official Badge
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Submit external verification data to earn your badge & unlock 3x faster landlord approvals.
              </p>
            </div>
          </div>
          <button
            onClick={() => setVerifyMemberModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-3 text-xs">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="text-stone-600 dark:text-stone-300">
              <strong>Verified Member Perks:</strong> Pre-screened identity badge on all applications, zero recurring application fees, and <strong>+250 bonus credits</strong> added directly to your profile.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Government ID Type
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="DRIVERS_LICENSE">State Driver's License</option>
                <option value="PASSPORT">US / International Passport</option>
                <option value="STATE_ID">Government Photo ID Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                ID / Document Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. DL-99238410"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Current Employer / Income Source
              </label>
              <input
                type="text"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                placeholder="e.g. Databricks, Google, Self-Employed"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Gross Monthly Income ($)
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500 font-bold"
              />
            </div>
          </div>

          {/* Document Upload Area (PDF, Images, Folders) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Upload Verification Documents (PDF, Images, Paystubs)
            </label>
            <label className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-stone-50/50 dark:bg-stone-800/30 transition">
              <Upload className="w-6 h-6 text-stone-400" />
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                {uploadedDocName || 'Click to select or drag & drop files (PDF, PNG, JPG)'}
              </span>
              <span className="text-[10px] text-stone-400">
                Upload recent paystub, W-2, bank statement or Gov ID front
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFakeUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Consent */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="consent"
              checked={creditConsent}
              onChange={(e) => setCreditConsent(e.target.checked)}
              required
              className="mt-0.5 accent-emerald-600"
            />
            <label htmlFor="consent" className="text-xs text-stone-600 dark:text-stone-400 leading-snug">
              I authorize Nestryy to run a soft identity & credit validation check via our FCRA-compliant screening partners (TransUnion / Experian). This will NOT affect my credit score.
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setVerifyMemberModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Submit & Activate Verified Badge'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
