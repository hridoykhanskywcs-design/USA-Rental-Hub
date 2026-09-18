import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { firebaseStorageService } from '../services/firebaseStorage';
import { ScreeningDocument } from '../types';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Upload,
  FileText,
  FileCheck,
  Loader2,
  Check,
} from 'lucide-react';
import { PRESET_SCREENING_LINKS } from '../data/mockData';

export const ScreeningPortalModal: React.FC = () => {
  const {
    isScreeningPortalModalOpen,
    setScreeningPortalModalOpen,
    settings,
    triggerAffiliateClick,
    addToast,
    currentUser,
    setAuthModalOpen,
    userScreeningDocs,
    addScreeningDoc,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'PROVIDERS'>('UPLOAD');
  const [uploadDocType, setUploadDocType] = useState<ScreeningDocument['docType']>('CREDIT_REPORT');
  const [docTitle, setDocTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isScreeningPortalModalOpen) return null;

  const links = settings.presetScreeningLinks || PRESET_SCREENING_LINKS;

  const handleOpenProvider = (providerName: string, url: string) => {
    triggerAffiliateClick(`screening-${providerName.toLowerCase()}`, url);
    addToast('Screening Portal Opened', `Opening official ${providerName} FCRA portal in a new tab.`, 'info');
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const file = files[0];
    setIsUploading(true);

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
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white border-b border-stone-800 relative">
          <button
            onClick={() => setScreeningPortalModalOpen(false)}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>FCRA Compliant Tenant Background &amp; Credit Screening</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Screening &amp; Verification Portal
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
            Upload your Credit Report, Background Report, ID, and Income documents, or order fresh checks from certified partner portals.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-800">
            <button
              onClick={() => setActiveTab('UPLOAD')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'UPLOAD'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Reports &amp; Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('PROVIDERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'PROVIDERS'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Certified Screening Partners</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Upload Documents */}
        {activeTab === 'UPLOAD' && (
          <div className="p-6 sm:p-8 space-y-6">
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
                    <option value="CREDIT_REPORT">Credit Report (PDF / Image / Screenshot)</option>
                    <option value="BACKGROUND_REPORT">Background Report / Police Clearance</option>
                    <option value="GOV_ID">Government Photo ID (Driver License / Passport)</option>
                    <option value="PAYSTUB">Proof of Income / Recent Paystubs</option>
                    <option value="W2">W-2 Form / Tax Return</option>
                    <option value="BANK_STATEMENT">Bank Statement</option>
                    <option value="OTHER">Additional Verification Document</option>
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
                    placeholder="e.g. Experian Credit Score 760 Screenshot"
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
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-teal-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-bold">Uploading Document to Secure Storage...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
                      Upload Credit Report / Background Report
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Accepts PDF files, screenshots, PNG, or JPG images up to 25MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Uploaded Docs */}
            {(userScreeningDocs || []).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Attached Screening Records ({(userScreeningDocs || []).length})
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
        )}

        {/* Tab 2: Preset Portals Grid */}
        {activeTab === 'PROVIDERS' && (
          <div className="p-6 sm:p-8 space-y-3.5">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 hover:border-teal-500/60 dark:hover:border-teal-500/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-sm text-teal-600 dark:text-teal-400 font-bold text-lg flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                        {link.name}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Pre-set Partner
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {link.description}
                    </p>
                    <span className="inline-block text-[11px] font-semibold text-teal-700 dark:text-teal-300 mt-1">
                      Turnaround: {link.turnaroundTime || 'Instant'} • Soft Pull (No credit hit)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenProvider(link.name, link.url)}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl text-xs shadow transition flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <span>Launch Screening Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>Protected under federal FCRA standards &amp; 256-bit SSL encryption.</span>
          <button
            onClick={() => setScreeningPortalModalOpen(false)}
            className="font-bold text-stone-700 dark:text-stone-300 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
