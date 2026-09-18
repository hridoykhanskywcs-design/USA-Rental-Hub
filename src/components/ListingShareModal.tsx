import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyListing, SharingSite } from '../types';
import { DEFAULT_SHARING_SITES } from '../data/mockData';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Building2,
  MapPin,
  DollarSign,
  Globe,
  Sparkles,
  MessageCircle,
  Mail,
  Send,
} from 'lucide-react';

interface ListingShareModalProps {
  property?: PropertyListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ListingShareModal: React.FC<ListingShareModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const { settings, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [copiedCraigslist, setCopiedCraigslist] = useState(false);

  if (!isOpen || !property) return null;

  // Construct absolute URL
  const shareBaseUrl = window.location.origin;
  const listingUrl = `${shareBaseUrl}/#property-${property.id}`;
  const encodedUrl = encodeURIComponent(listingUrl);
  const encodedTitle = encodeURIComponent(
    `Check out ${property.title} on Nestryy ($${property.rent.toLocaleString()}/mo in ${property.address.city}, ${property.address.state})`
  );

  const configuredSites = (settings.sharingSites && settings.sharingSites.length > 0)
    ? settings.sharingSites
    : DEFAULT_SHARING_SITES;
  const activeSharingSites: SharingSite[] = configuredSites.filter(
    (s) => s.enabled !== false
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(listingUrl);
    setCopied(true);
    addToast('Link Copied!', 'Direct listing link copied to your clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCraigslistFormat = () => {
    const craigslistTemplate = `
========================================
${property.title}
Rent: $${property.rent.toLocaleString()}/month | Deposit: $${property.deposit.toLocaleString()}
Location: ${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}
Bedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms} | Sqft: ${property.sqft} sq ft
Available Date: ${property.availableDate}

AMENITIES & FEATURES:
${property.amenities.map((a) => `• ${a}`).join('\n')}

DESCRIPTION:
${property.description}

APPLY ONLINE & SCHEDULE TOURS:
${listingUrl}
========================================
Verified listing powered by Nestryy (nestryy.com)
    `.trim();

    navigator.clipboard.writeText(craigslistTemplate);
    setCopiedCraigslist(true);
    addToast('Craigslist Ad Copied!', 'Formatted listing text ready to paste on Craigslist.', 'success');
    setTimeout(() => setCopiedCraigslist(false), 2500);
  };

  const handleOpenShareSite = (site: SharingSite) => {
    let url = site.shareUrlTemplate
      .replace('{url}', encodedUrl)
      .replace('{title}', encodedTitle);

    // If mailto
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer,width=650,height=550');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-stone-900 to-stone-900 text-white flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Share Listing</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full">
                  Multi-Platform Syndication
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Share this verified rental listing across configured external portals and social platforms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Brief Card */}
        <div className="p-6 space-y-6">
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center gap-4">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
              alt={property.title}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                {property.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-teal-600" />
                <span>
                  {property.address.street}, {property.address.city}, {property.address.state}
                </span>
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="font-black text-teal-600 dark:text-teal-400">
                  ${property.rent.toLocaleString()}/mo
                </span>
                <span className="text-stone-400">&bull;</span>
                <span className="text-stone-600 dark:text-stone-300">
                  {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bed`} | {property.bathrooms} Bath
                </span>
              </div>
            </div>
          </div>

          {/* Direct Link Section */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              Direct Listing URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={listingUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-200 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-1.5 flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Configured Sharing Sites Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Share to Configured Platforms ({activeSharingSites.length} Active)
              </label>
              <span className="text-[10px] text-stone-400">
                Managed by Site Administrator
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {activeSharingSites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => handleOpenShareSite(site)}
                  className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: site.color || '#0d9488' }}
                    >
                      {site.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      {site.name}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-teal-600 transition" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Copy Craigslist Listing Template */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h5 className="text-xs font-bold text-stone-900 dark:text-white">
                Syndicate to Classifieds &amp; Craigslist
              </h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Generate pre-formatted text ad with full property details and verified online link.
              </p>
            </div>
            <button
              onClick={handleCopyCraigslistFormat}
              className="px-3.5 py-2 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 flex-shrink-0"
            >
              {copiedCraigslist ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCraigslist ? 'Ad Copied!' : 'Copy Classified Ad'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>Protected sharing link &bull; Nestryy Verified ID #{property.id}</span>
          <button
            onClick={onClose}
            className="font-bold text-stone-700 dark:text-stone-300 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
