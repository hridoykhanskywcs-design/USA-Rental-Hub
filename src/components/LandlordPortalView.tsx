import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { PropertyListing } from '../types';
import {
  Building2,
  Plus,
  Sparkles,
  Users,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  X,
} from 'lucide-react';

export const LandlordPortalView: React.FC = () => {
  const { properties, applications, setProperties, addToast, refreshData, setSelectedProperty } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // New property form
  const [formData, setFormData] = useState({
    title: '',
    rent: 2800,
    deposit: 2800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 950,
    propertyType: 'APARTMENT' as const,
    street: '250 King St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    neighborhood: 'Mission Bay',
    description: '',
    amenities: 'In-Unit Washer/Dryer, Balcony, Assigned Parking, Dishwasher',
  });

  const handleAiGenerateDescription = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await api.aiGenerateListing({
        title: formData.title || `${formData.bedrooms} Bed Luxury Apartment in ${formData.city}`,
        city: formData.city,
        neighborhood: formData.neighborhood,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        rent: formData.rent,
        amenities: formData.amenities.split(',').map((a) => a.trim()),
      });

      setFormData((prev) => ({
        ...prev,
        title: res.title || prev.title,
        description: res.description || prev.description,
      }));

      addToast('AI Generation Complete', 'Gemini created an optimized property listing description.', 'success');
    } catch (err) {
      console.error('AI generation failed:', err);
      addToast('Generation Failed', 'Could not generate listing copy via AI.', 'alert');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProperty = await api.createProperty({
        title: formData.title || `${formData.bedrooms} Bed Apartment in ${formData.city}`,
        description: formData.description || 'Spacious modern unit with premium finishes and prime neighborhood access.',
        rent: Number(formData.rent),
        deposit: Number(formData.deposit),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.sqft),
        propertyType: formData.propertyType,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          neighborhood: formData.neighborhood,
          latitude: 37.7749,
          longitude: -122.4194,
        },
        amenities: formData.amenities.split(',').map((a) => a.trim()),
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        ],
        isVerified: true,
        isPetFriendly: true,
        hasInUnitLaundry: true,
        hasParking: true,
        hasAirConditioning: true,
        status: 'AVAILABLE',
      });

      setProperties((prev) => [newProperty, ...prev]);
      addToast('Listing Published', 'Your rental property is now live on the verified marketplace.', 'success');
      setIsCreating(false);
      await refreshData();
    } catch (err) {
      console.error('Creation failed:', err);
      addToast('Error', 'Failed to publish property listing.', 'alert');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Landlord Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white">Property Host Portal</h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Publish verified vacancies, triage tenant applications with FCRA credit screening, and book walkthroughs.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-bold">Active Listed Units</span>
          <div className="text-3xl font-black text-stone-900 dark:text-white">{(properties || []).length}</div>
          <span className="text-[11px] text-teal-600 font-semibold">100% Verified Inventory</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-bold">Total Inbound Tenant Leads</span>
          <div className="text-3xl font-black text-stone-900 dark:text-white">{(applications || []).length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">FCRA Compliant Verification</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-bold">Verified Member Applicants</span>
          <div className="text-3xl font-black text-teal-600">
            {(applications || []).filter((a) => a.verifiedMemberBadge).length}
          </div>
          <span className="text-[11px] text-stone-500">Passed ID & Credit Pre-Check</span>
        </div>
      </div>

      {/* Property Inventory List */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4">
        <h3 className="font-bold text-base text-stone-900 dark:text-white">Active Portfolio Listings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(properties || []).map((prop) => (
            <div
              key={prop.id}
              onClick={() => setSelectedProperty(prop)}
              className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                <img
                  src={(prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                  alt={prop.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
                <span className="absolute bottom-2 left-2 bg-stone-950/80 text-white text-xs font-bold px-2 py-0.5 rounded">
                  ${prop.rent.toLocaleString()}/mo
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">{prop.title}</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    {prop.address.neighborhood}, {prop.address.city}, {prop.address.state}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span>{prop.bedrooms} Beds</span>
                  <span>&bull;</span>
                  <span>{prop.bathrooms} Baths</span>
                  <span>&bull;</span>
                  <span>{prop.sqft} sqft</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Listing Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">Create New Rental Listing</h3>
                <p className="text-xs text-stone-500">Publish your property directly to the verified Nestryy marketplace.</p>
              </div>
              <button onClick={() => setIsCreating(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Listing Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern High-Rise Loft with Skyline Terrace"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">Single-Family House</option>
                    <option value="CONDO">Condominium</option>
                    <option value="STUDIO">Studio</option>
                    <option value="ROOM">Private Room</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Rent ($/mo)</label>
                  <input
                    type="number"
                    required
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    min={1}
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Sq Ft</label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData({ ...formData, sqft: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Street</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Neighborhood</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* AI Description Assistant */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-stone-700 dark:text-stone-300">Description</label>
                  <button
                    type="button"
                    onClick={handleAiGenerateDescription}
                    disabled={isGeneratingAi}
                    className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 hover:underline text-[11px]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingAi ? 'Writing with Gemini...' : 'Generate with Gemini AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe unit finishes, transit access, and move-in terms..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Publish Verified Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
