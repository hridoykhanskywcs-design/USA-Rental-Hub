import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCity, setCurrentView, settings } = useApp();

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setCurrentView('MARKETPLACE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      {/* Top Value Banner */}
      <div className="border-b border-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-950/80 border border-teal-800 text-teal-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Verified Listings & Members</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                100% of properties and tenant profiles undergo automated ID screening and lease verification checks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-950/80 border border-teal-800 text-teal-400 rounded-xl">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Official Credit Score Partner</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Seamless credit verification through {settings.creditScorePartnerName} with zero impact to credit scores.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-950/80 border border-teal-800 text-teal-400 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Bank-Grade Data Security</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Tenant applications, employment docs, and payments are encrypted at rest with full role-based access control.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-black">
              N
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">Nestryy</span>
          </div>
          <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
            The next-generation rental marketplace and property management operating system for renters, landlords, and property managers across the United States.
          </p>
          <div className="pt-2 text-xs text-stone-500">
            Equal Housing Opportunity. All rental properties advertised are subject to the Federal Fair Housing Act.
          </div>
        </div>

        {/* Top Cities SEO Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Top US Cities</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleCityClick('San Francisco')} className="hover:text-teal-400 transition-colors">
                San Francisco Rentals
              </button>
            </li>
            <li>
              <button onClick={() => handleCityClick('Austin')} className="hover:text-teal-400 transition-colors">
                Austin Apartments
              </button>
            </li>
            <li>
              <button onClick={() => handleCityClick('New York')} className="hover:text-teal-400 transition-colors">
                New York City Lofts
              </button>
            </li>
            <li>
              <button onClick={() => handleCityClick('Miami')} className="hover:text-teal-400 transition-colors">
                Miami Condos & Beachfront
              </button>
            </li>
            <li>
              <button onClick={() => handleCityClick('Seattle')} className="hover:text-teal-400 transition-colors">
                Seattle Tech Hub Homes
              </button>
            </li>
          </ul>
        </div>

        {/* Renters & Guides */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Renter Tools</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentView('MARKETPLACE')} className="hover:text-teal-400 transition-colors">
                Search Properties
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('TENANT_PORTAL')} className="hover:text-teal-400 transition-colors">
                Tenant Portal & Applications
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('GUIDES')} className="hover:text-teal-400 transition-colors">
                Renter Rights & Guides
              </button>
            </li>
            <li>
              <a
                href={settings.creditScorePartnerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors flex items-center gap-1 text-teal-300"
              >
                <span>Credit Score Check</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Landlords & Admin */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Management</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentView('LANDLORD_PORTAL')} className="hover:text-teal-400 transition-colors">
                Landlord Overview
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('LANDLORD_PORTAL')} className="hover:text-teal-400 transition-colors">
                List a Property
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('ADMIN_PORTAL')} className="text-rose-400 hover:text-rose-300 transition-colors font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Admin Control Panel</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-stone-800 py-6 text-center text-xs text-stone-500">
        &copy; {new Date().getFullYear()} Nestryy Technologies Inc. All rights reserved. Registered USA Rental Platform.
      </div>
    </footer>
  );
};
