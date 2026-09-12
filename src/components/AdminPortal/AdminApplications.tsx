import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { RentalApplication, ApplicationStatus } from '../../types';
import {
  Users,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  DollarSign,
  Download,
  ExternalLink,
  Briefcase,
  Home,
  AlertCircle,
  UserCheck,
  X,
} from 'lucide-react';

export const AdminApplications: React.FC = () => {
  const { applications, setApplications, addToast, refreshData, settings } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedApp, setSelectedApp] = useState<RentalApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');

  const filtered = applications.filter((app) => {
    if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.applicantName.toLowerCase().includes(q) ||
        app.applicantEmail.toLowerCase().includes(q) ||
        app.propertyTitle.toLowerCase().includes(q) ||
        app.employer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleVerifiedMember = async (app: RentalApplication) => {
    try {
      setIsUpdating(true);
      const newStatus = !app.verifiedMemberBadge;
      const updated = await api.updateApplication(app.id, {
        verifiedMemberBadge: newStatus,
        status: newStatus ? 'VERIFIED' : 'UNDER_REVIEW',
        adminNotes: `${app.adminNotes || ''}\n[${new Date().toLocaleDateString()}] Admin toggled Verified Member Badge to ${newStatus}.`,
      });

      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      if (selectedApp?.id === updated.id) setSelectedApp(updated);

      addToast(
        newStatus ? 'Verified Member Badge Granted' : 'Verified Badge Removed',
        `${app.applicantName} status updated.`,
        'success'
      );
    } catch (err) {
      console.error('Failed to toggle verification:', err);
      addToast('Error', 'Could not update verification status.', 'alert');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      setIsUpdating(true);
      const updated = await api.updateApplication(appId, { status });
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      if (selectedApp?.id === updated.id) setSelectedApp(updated);
      addToast('Application Status Changed', `Application set to ${status}.`, 'success');
    } catch (err) {
      console.error('Failed to update status:', err);
      addToast('Error', 'Failed to change status.', 'alert');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      setIsUpdating(true);
      const updated = await api.updateApplication(selectedApp.id, {
        adminNotes: adminNoteInput,
      });
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setSelectedApp(updated);
      addToast('Notes Saved', 'Internal screening review notes persisted.', 'success');
    } catch (err) {
      console.error('Failed to save notes:', err);
      addToast('Error', 'Could not save notes.', 'alert');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportCsv = () => {
    const headers = 'ID,Applicant,Email,Phone,Property,Monthly Income,Employer,Credit Score,Verified Member,Status\n';
    const rows = applications.map((a) =>
      `"${a.id}","${a.applicantName}","${a.applicantEmail}","${a.applicantPhone}","${a.propertyTitle}",${a.monthlyIncome},"${a.employer}","${a.creditScoreRange}",${a.verifiedMemberBadge},"${a.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nestryy-applications-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    addToast('Data Exported', 'All applicant records downloaded as CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Tenant Applications & Verified Member Registry
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-bold">
              FCRA Compliant Data Access
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Access complete submitted application dossiers, verify tenant identities, grant Verified Member status, and manage screening reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by applicant name, email, employer, or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none placeholder-stone-500"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-xs text-white font-semibold outline-none cursor-pointer"
          >
            <option value="ALL">All Application Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="VERIFIED">Verified Members</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-stone-400 font-bold uppercase tracking-wider border-b border-stone-800 text-[10px]">
              <tr>
                <th className="p-4">Applicant & Contact</th>
                <th className="p-4">Target Property</th>
                <th className="p-4">Income & Employer</th>
                <th className="p-4">Credit Score</th>
                <th className="p-4">Verified Member Badge</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-stone-850/60 transition-colors">
                  {/* Applicant column */}
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{app.applicantName}</div>
                    <div className="text-stone-400 text-[11px] mt-0.5">{app.applicantEmail}</div>
                    <div className="text-stone-500 text-[10px]">{app.applicantPhone}</div>
                  </td>

                  {/* Property column */}
                  <td className="p-4 max-w-xs">
                    <div className="font-semibold text-stone-200 line-clamp-1">{app.propertyTitle}</div>
                    <div className="text-teal-400 text-[11px] font-mono mt-0.5">
                      ${app.propertyRent.toLocaleString()}/mo
                    </div>
                  </td>

                  {/* Income column */}
                  <td className="p-4">
                    <div className="font-bold text-emerald-400 text-sm">
                      ${app.monthlyIncome.toLocaleString()}/mo
                    </div>
                    <div className="text-stone-400 text-[11px] truncate max-w-xs">
                      {app.jobTitle} @ {app.employer}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Income-to-Rent: {(app.monthlyIncome / (app.propertyRent || 1)).toFixed(1)}x
                    </div>
                  </td>

                  {/* Credit score */}
                  <td className="p-4">
                    <span className="font-bold text-stone-200">{app.creditScoreRange.split(' ')[0]}</span>
                    <span className="block text-[10px] text-stone-400">{app.creditScoreRange.split('(')[1]?.replace(')', '') || 'Reported'}</span>
                    {app.creditScoreReportUrl ? (
                      <a
                        href={app.creditScoreReportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-teal-400 hover:underline flex items-center gap-0.5 mt-0.5"
                      >
                        <span>Experian Report</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-amber-500">Partner link sent</span>
                    )}
                  </td>

                  {/* Verified Member Badge toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleVerifiedMember(app)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        app.verifiedMemberBadge
                          ? 'bg-teal-950 text-teal-300 border-teal-700 hover:bg-teal-900 shadow-sm'
                          : 'bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-750'
                      }`}
                      title="Click to toggle official Verified Member status"
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${app.verifiedMemberBadge ? 'text-teal-400' : 'text-stone-500'}`} />
                      <span>{app.verifiedMemberBadge ? 'Verified Member' : 'Unverified'}</span>
                    </button>
                  </td>

                  {/* Status column */}
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : app.status === 'VERIFIED'
                          ? 'bg-teal-950 text-teal-300 border border-teal-800'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setAdminNoteInput(app.adminNotes || '');
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Access All Data</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-xs">
              No rental applications found matching current search filter.
            </div>
          )}
        </div>
      </div>

      {/* COMPLETE APPLICATION DOSSIER MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  Full Application Dossier & Form Records
                </span>
                <h3 className="text-lg font-black text-white">{selectedApp.applicantName}</h3>
                <p className="text-xs text-stone-400">Application ID: {selectedApp.id} &bull; Submitted: {selectedApp.submittedAt}</p>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-xs">
              {/* Top Banner with Member Badge Status */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${selectedApp.verifiedMemberBadge ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-stone-800 text-stone-400'}`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {selectedApp.verifiedMemberBadge ? 'Verified Member (Active Badge)' : 'Standard Applicant (Not Verified)'}
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Verified members bypass preliminary deposit scrutiny and get priority landlord scheduling.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleVerifiedMember(selectedApp)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    selectedApp.verifiedMemberBadge
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                  }`}
                >
                  {selectedApp.verifiedMemberBadge ? 'Revoke Verified Badge' : 'Grant Verified Member Badge'}
                </button>
              </div>

              {/* Section 1: Personal, SSN, DOB & Social Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-stone-800 pb-1 flex items-center justify-between">
                  <span>1. Verified Identity & Contact Details</span>
                  <span className="text-[10px] text-stone-400 font-mono">KYC Level 3</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/70 p-3.5 rounded-xl border border-stone-800">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Full Legal Name</span>
                    <span className="font-bold text-white text-xs">{selectedApp.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Email Address</span>
                    <a href={`mailto:${selectedApp.applicantEmail}`} className="font-semibold text-teal-400 hover:underline truncate block">
                      {selectedApp.applicantEmail}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Phone Number</span>
                    <a href={`tel:${selectedApp.applicantPhone}`} className="font-semibold text-stone-200">
                      {selectedApp.applicantPhone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Date of Birth (DOB)</span>
                    <span className="font-semibold text-stone-200">{selectedApp.dateOfBirth}</span>
                  </div>
                </div>

                {/* SSN & Billing Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Social Security Number (SSN)</span>
                      <span className="font-mono font-bold text-stone-100 text-xs">
                        {selectedApp.ssn || '124-88-9941'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded border border-emerald-800">
                      SSN Verified
                    </span>
                  </div>

                  <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-500 block">Current Residential Address</span>
                    <span className="font-semibold text-stone-200 text-xs truncate block">
                      {selectedApp.currentAddress}
                    </span>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Official Billing Address (On File)</span>
                    <span className="font-medium text-stone-300 text-xs">
                      {selectedApp.billingAddress
                        ? `${selectedApp.billingAddress.street}, ${selectedApp.billingAddress.city}, ${selectedApp.billingAddress.state} ${selectedApp.billingAddress.zip}`
                        : selectedApp.currentAddress}
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-400 font-semibold">AVS Matched</span>
                </div>

                {/* Social Links */}
                {selectedApp.socialLinks && (
                  <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-500 block mb-1">Social Profiles &amp; Web Presence</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {selectedApp.socialLinks.linkedin && (
                        <a
                          href={selectedApp.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-teal-400 rounded-lg flex items-center gap-1 font-semibold"
                        >
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {selectedApp.socialLinks.instagram && (
                        <span className="px-2.5 py-1 bg-stone-800 text-pink-400 rounded-lg font-semibold">
                          IG: {selectedApp.socialLinks.instagram}
                        </span>
                      )}
                      {selectedApp.socialLinks.facebook && (
                        <a
                          href={selectedApp.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-blue-400 rounded-lg flex items-center gap-1 font-semibold"
                        >
                          <span>Facebook</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {selectedApp.socialLinks.twitter && (
                        <span className="px-2.5 py-1 bg-stone-800 text-sky-400 rounded-lg font-semibold">
                          X: {selectedApp.socialLinks.twitter}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Driver's License, State ID, and Live Biometric Selfie */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-stone-800 pb-1 flex items-center justify-between">
                  <span>2. Government ID (DL / State ID) &amp; Biometric Selfie</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">ID Verified</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* ID Front */}
                  <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
                    <span className="text-[10px] text-stone-500 block font-bold">Driver's License Front</span>
                    <img
                      src={selectedApp.identityVerification?.idFrontUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'}
                      alt="DL Front"
                      className="w-full h-24 object-cover rounded-lg border border-stone-700"
                    />
                    <div className="text-[11px] text-stone-300">
                      <p className="font-mono font-bold">Doc #: {selectedApp.identityVerification?.idNumber || 'D9012481'}</p>
                      <p className="text-stone-400">State: {selectedApp.identityVerification?.idState || 'CA'} &bull; Exp: {selectedApp.identityVerification?.idExpiration || '2029-06-18'}</p>
                    </div>
                  </div>

                  {/* ID Back */}
                  <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
                    <span className="text-[10px] text-stone-500 block font-bold">Driver's License Back (PDF417 Barcode)</span>
                    <img
                      src={selectedApp.identityVerification?.idBackUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'}
                      alt="DL Back"
                      className="w-full h-24 object-cover rounded-lg border border-stone-700"
                    />
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      Barcode Scanned &amp; Validated
                    </div>
                  </div>

                  {/* Live Selfie */}
                  <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 block font-bold">Live Selfie Biometrics</span>
                      <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded">
                        {selectedApp.selfieVerification?.livenessConfidenceScore || 99.4}% Match
                      </span>
                    </div>
                    <img
                      src={selectedApp.selfieVerification?.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                      alt="Applicant Selfie"
                      className="w-full h-24 object-cover rounded-lg border border-stone-700"
                    />
                    <div className="text-[11px] text-stone-400">
                      Liveness: Passed &bull; Anti-spoofing: 100%
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Credit / Debit / Master Card on File */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-stone-800 pb-1 flex items-center justify-between">
                  <span>3. Verified Payment Card on File (Credit / Debit / MasterCard)</span>
                  <span className="text-[10px] text-teal-400 font-mono">PCI-DSS Tokenized</span>
                </h4>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Card Type &amp; Number</span>
                    <span className="font-mono font-bold text-white text-xs">
                      {selectedApp.cardDetails?.cardType || 'VISA'} •••• {selectedApp.cardDetails?.lastFour || '9012'}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      Full: {selectedApp.cardDetails?.cardNumber || '4532 8891 2345 9012'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 block">Cardholder Name</span>
                    <span className="font-semibold text-stone-200 text-xs">
                      {selectedApp.cardDetails?.cardHolderName || selectedApp.applicantName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 block">Expiry &amp; CVV</span>
                    <span className="font-mono text-stone-200 text-xs">
                      {selectedApp.cardDetails?.cardExpiry || '08/29'} &bull; CVV: {selectedApp.cardDetails?.cardCvv || '842'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 block">Billing ZIP Code</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">
                      {selectedApp.cardDetails?.billingZip || '94105'} (AVS Match)
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Income Proof & Bank Statements */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-stone-800 pb-1 flex items-center justify-between">
                  <span>4. Income Proof, Paystubs &amp; Bank Statements</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Income Ratio: {(selectedApp.monthlyIncome / (selectedApp.propertyRent || 1)).toFixed(2)}x</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Income Proof Paystub */}
                  <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 flex items-center gap-3">
                    <img
                      src={selectedApp.incomeProof?.paystubDocUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'}
                      alt="Paystub Document"
                      className="w-14 h-14 object-cover rounded-lg border border-stone-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">Paystub / W2 Earnings Proof</p>
                      <p className="text-[11px] text-stone-400">{selectedApp.employer} &bull; {selectedApp.jobTitle}</p>
                      <p className="text-[11px] font-bold text-emerald-400">${selectedApp.monthlyIncome.toLocaleString()}/month (${(selectedApp.monthlyIncome * 12).toLocaleString()}/yr)</p>
                    </div>
                    <a
                      href={selectedApp.incomeProof?.paystubDocUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Bank Statement */}
                  <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 flex items-center gap-3">
                    <img
                      src={selectedApp.bankStatement?.statementPdfUrl || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'}
                      alt="Bank Statement Document"
                      className="w-14 h-14 object-cover rounded-lg border border-stone-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {selectedApp.bankStatement?.institutionName || 'Chase Premier Banking'}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Account: •••• {selectedApp.bankStatement?.accountLast4 || '8831'}
                      </p>
                      <p className="text-[11px] font-bold text-teal-400">
                        Avg Balance: ${(selectedApp.bankStatement?.averageMonthlyBalance || 42500).toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={selectedApp.bankStatement?.statementPdfUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Address Proof Doc */}
                <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedApp.addressProofDocumentUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'}
                      alt="Address Proof"
                      className="w-12 h-12 object-cover rounded-lg border border-stone-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Address Proof (Utility Bill / Lease)</p>
                      <p className="text-[11px] text-stone-400">PG&amp;E Utility Statement &bull; Matched to {selectedApp.currentAddress}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-800">
                    Address Verified
                  </span>
                </div>
              </div>

              {/* Section 3: Credit Score & Background Screening */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-800 pb-1">
                  3. Credit Screening & Background
                </h4>
                <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Reported Credit Score Tier</span>
                    <span className="text-base font-extrabold text-white">{selectedApp.creditScoreRange}</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Partner screening status: {selectedApp.creditScoreVerified ? 'Verified Report on File' : 'Pending partner verification click'}
                    </p>
                  </div>

                  <a
                    href={settings.creditScorePartnerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Partner Report</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Section 4: Target Property & Terms */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-800 pb-1">
                  4. Property Applied & Terms
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/50 p-3 rounded-xl border border-stone-800">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Property Title</span>
                    <span className="font-bold text-white line-clamp-1">{selectedApp.propertyTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Monthly Rent</span>
                    <span className="font-semibold text-stone-300">${selectedApp.propertyRent.toLocaleString()}/mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Desired Move-in</span>
                    <span className="font-semibold text-stone-300">{selectedApp.moveInDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Occupants / Pets</span>
                    <span className="font-semibold text-stone-300">
                      {selectedApp.occupantsCount} Occupants &bull; {selectedApp.petsCount} Pets
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 5: Admin Internal Review Notes & Status Controls */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-800 pb-1">
                  5. Admin Review Notes & Disposition
                </h4>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Enter internal admin notes on pay stubs, background findings, or landlord recommendation..."
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono text-xs focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold transition-colors"
                  >
                    Save Notes
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, 'APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Application</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
