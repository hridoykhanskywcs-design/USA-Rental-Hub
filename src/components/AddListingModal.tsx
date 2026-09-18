import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyListing, PropertyType } from '../types';
import { X, Building2, MapPin, DollarSign, Image as ImageIcon, ShieldCheck, CheckCircle2, Sparkles, Plus } from 'lucide-react';
import { PropertyPhotoUploader } from './PropertyPhotoUploader';

export const AddListingModal: React.FC = () => {
  const { 
    isAddListingModalOpen, 
    setAddListingModalOpen, 
    setProperties, 
    currentUser, 
    addToast,
    selectedCity,
    setAuthModalOpen,
  } = useApp();

  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [rent, setRent] = useState<number>(2800);
  const [deposit, setDeposit] = useState<number>(2800);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1.5);
  const [sqft, setSqft] = useState<number>(850);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState(selectedCity || 'San Francisco');
  const [stateCode, setStateCode] = useState('CA');
  const [zip, setZip] = useState('94107');
  const [neighborhood, setNeighborhood] = useState('Downtown');
  const [screeningBadgeType, setScreeningBadgeType] = useState<'CREDIT_CHECK' | 'APPLY_SCREENING'>('CREDIT_CHECK');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [description, setDescription] = useState('');

  if (!isAddListingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newListing: PropertyListing = {
      id: `prop-usr-${uniqueSuffix}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + uniqueSuffix.slice(-6),
      title,
      description: description || 'Modern and beautifully maintained rental with premium finishes, excellent natural light, and convenient access to local transit and shopping.',
      propertyType,
      address: {
        street: street || '100 Market St',
        city,
        state: stateCode,
        zip,
        neighborhood,
        latitude: 37.7885,
        longitude: -122.4075,
      },
      rent: Number(rent),
      deposit: Number(deposit),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      availableDate: new Date().toISOString().split('T')[0],
      leaseTerms: '12 Months',
      isPetFriendly: true,
      isFurnished: false,
      isVerified: true,
      hasInUnitLaundry: true,
      hasParking: true,
      hasAirConditioning: true,
      amenities: ['In-Unit Laundry', 'Air Conditioning', 'Dishwasher', 'High-Speed Internet Ready', 'Secure Entry'],
      utilitiesIncluded: ['Water', 'Trash'],
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      ],
      landlordId: currentUser.id,
      landlordName: currentUser.fullName,
      landlordContact: {
        email: currentUser.email,
        phone: currentUser.phone,
      },
      status: 'PUBLISHED',
      viewsCount: 1,
      screeningBadgeType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProperties((prev) => [newListing, ...(prev || []).filter((p) => p.id !== newListing.id)]);
    addToast('Property Listing Published! 🏡', `"${title}" is now active with ${screeningBadgeType === 'CREDIT_CHECK' ? 'Screening with Credit Check' : 'Apply with Screening'} badge.`, 'success');
    setAddListingModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Add Rental Property Listing
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Publish a new home, condo, or apartment with pre-set tenant screening requirements.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddListingModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Listing Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Sunset Blvd Flat with Private Balcony"
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              >
                <option value="APARTMENT">Apartment</option>
                <option value="CONDO">Condo</option>
                <option value="HOUSE">Single Family House</option>
                <option value="TOWNHOME">Townhome</option>
                <option value="STUDIO">Studio</option>
                <option value="ROOM">Private Room</option>
              </select>
            </div>

            {/* SCREENING BADGE SELECTION AS REQUESTED */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Listing Screening Badge / ফিল্টার ব্যাজ
              </label>
              <select
                value={screeningBadgeType}
                onChange={(e) => setScreeningBadgeType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-teal-400 bg-teal-50/50 dark:bg-teal-950/30 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500 font-bold"
              >
                <option value="CREDIT_CHECK">🛡️ Screening with Credit Check</option>
                <option value="APPLY_SCREENING">✓ Apply with Screening</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Monthly Rent ($)
              </label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-teal-600 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Deposit ($)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="10"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 450 Sutter St, Apt 4"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Neighborhood
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. South Beach"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                State
              </label>
              <input
                type="text"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Multiple Photo Upload with Firebase Storage & Previews */}
          <PropertyPhotoUploader images={images} onChange={setImages} propertyId="new-listing" />

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Property Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe unit features, views, smart home equipment, building amenities..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setAddListingModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Property</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
