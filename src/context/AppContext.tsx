import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PropertyListing, RentalApplication, SystemSettings, UserRole, MarketingCampaign, TourBooking, AffiliatePartnerLink } from '../types';
import { api } from '../services/api';
import { INITIAL_SETTINGS, INITIAL_TOURS, INITIAL_AFFILIATES } from '../data/mockData';

export type AppView = 
  | 'MARKETPLACE'
  | 'ROOMS'
  | 'ROOMMATES'
  | 'COMMUNITY'
  | 'GUIDES'
  | 'MARKET_TRENDS'
  | 'SERVICES'
  | 'LANDLORD_PORTAL'
  | 'TENANT_PORTAL'
  | 'ADMIN_PORTAL';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  properties: PropertyListing[];
  setProperties: React.Dispatch<React.SetStateAction<PropertyListing[]>>;
  applications: RentalApplication[];
  setApplications: React.Dispatch<React.SetStateAction<RentalApplication[]>>;
  campaigns: MarketingCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  affiliates: AffiliatePartnerLink[];
  setAffiliates: React.Dispatch<React.SetStateAction<AffiliatePartnerLink[]>>;
  triggerAffiliateClick: (id: string, url: string) => void;
  scheduledTours: TourBooking[];
  setScheduledTours: React.Dispatch<React.SetStateAction<TourBooking[]>>;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  selectedProperty: PropertyListing | null;
  setSelectedProperty: (prop: PropertyListing | null) => void;
  applyingProperty: PropertyListing | null;
  setApplyingProperty: (prop: PropertyListing | null) => void;
  touringProperty: PropertyListing | null;
  setTouringProperty: (prop: PropertyListing | null) => void;
  toasts: Toast[];
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'alert') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  aiSearchModalOpen: boolean;
  setAiSearchModalOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('RENTER');
  const [currentView, setCurrentView] = useState<AppView>('MARKETPLACE');
  const [selectedCity, setSelectedCity] = useState<string>('San Francisco');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [affiliates, setAffiliates] = useState<AffiliatePartnerLink[]>(INITIAL_AFFILIATES);
  const [scheduledTours, setScheduledTours] = useState<TourBooking[]>(INITIAL_TOURS || []);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nestryy_saved_properties');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [applyingProperty, setApplyingProperty] = useState<PropertyListing | null>(null);
  const [touringProperty, setTouringProperty] = useState<PropertyListing | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [aiSearchModalOpen, setAiSearchModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const triggerAffiliateClick = (id: string, url: string) => {
    // Record click asynchronously
    api.recordAffiliateClick(id).catch(() => {});
    // Open affiliate link in new tab safely
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const addToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      try {
        localStorage.setItem('nestryy_saved_properties', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return next;
    });
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [propsRes, appsRes, campRes, setsRes, toursRes, affsRes] = await Promise.all([
        api.getProperties().catch(() => ({ properties: [] })),
        api.getApplications().catch(() => ({ applications: [] })),
        api.getCampaigns().catch(() => []),
        api.getSettings().catch(() => INITIAL_SETTINGS),
        api.getTours().catch(() => []),
        api.getAffiliates().catch(() => INITIAL_AFFILIATES),
      ]);
      setProperties(propsRes?.properties || []);
      setApplications(appsRes?.applications || []);
      setCampaigns(campRes || []);
      setSettings(setsRes || INITIAL_SETTINGS);
      setScheduledTours(toursRes || []);
      setAffiliates(affsRes?.length ? affsRes : (setsRes?.affiliatePartners || INITIAL_AFFILIATES));
    } catch (err) {
      console.error('Failed to load initial server data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Setup SSE Realtime Stream
    const eventSource = new EventSource('/api/realtime/events');

    eventSource.addEventListener('affiliates_updated', (event: MessageEvent) => {
      try {
        const updatedList: AffiliatePartnerLink[] = JSON.parse(event.data);
        setAffiliates(updatedList);
      } catch (e) {
        console.error('Error handling affiliates_updated:', e);
      }
    });

    eventSource.addEventListener('application_submitted', (event: MessageEvent) => {
      try {
        const newApp: RentalApplication = JSON.parse(event.data);
        setApplications((prev) => [newApp, ...(prev || []).filter((a) => a.id !== newApp.id)]);
        addToast('New Rental Application', `${newApp.applicantName} applied for ${newApp.propertyTitle}`, 'info');
      } catch (e) {
        console.error('Error handling application_submitted:', e);
      }
    });

    eventSource.addEventListener('application_updated', (event: MessageEvent) => {
      try {
        const updated: RentalApplication = JSON.parse(event.data);
        setApplications((prev) => (prev || []).map((a) => (a.id === updated.id ? updated : a)));
        if (updated.verifiedMemberBadge) {
          addToast('Verified Member Status Granted', `${updated.applicantName} is now a Verified Tenant Member`, 'success');
        }
      } catch (e) {
        console.error('Error handling application_updated:', e);
      }
    });

    eventSource.addEventListener('campaign_sent', (event: MessageEvent) => {
      try {
        const campaign: MarketingCampaign = JSON.parse(event.data);
        setCampaigns((prev) => (prev || []).map((c) => (c.id === campaign.id ? campaign : c)));
        addToast('Campaign Dispatched', `"${campaign.name}" sent with credit score link!`, 'success');
      } catch (e) {
        console.error('Error handling campaign_sent:', e);
      }
    });

    eventSource.addEventListener('settings_updated', (event: MessageEvent) => {
      try {
        const updatedSettings: SystemSettings = JSON.parse(event.data);
        setSettings(updatedSettings);
      } catch (e) {
        console.error('Error handling settings_updated:', e);
      }
    });

    eventSource.addEventListener('tour_booked', (event: MessageEvent) => {
      try {
        const tour: TourBooking = JSON.parse(event.data);
        setScheduledTours((prev) => [tour, ...(prev || []).filter((t) => t.id !== tour.id)]);
        addToast('Tour Confirmed', `Tour booked for ${tour.propertyTitle} on ${tour.date}`, 'success');
      } catch (e) {
        console.error('Error handling tour_booked:', e);
      }
    });

    eventSource.addEventListener('property_created', (event: MessageEvent) => {
      try {
        const newProp: PropertyListing = JSON.parse(event.data);
        setProperties((prev) => [newProp, ...(prev || []).filter((p) => p.id !== newProp.id)]);
      } catch (e) {
        console.error('Error handling property_created:', e);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentView,
        setCurrentView,
        selectedCity,
        setSelectedCity,
        properties: properties || [],
        setProperties,
        applications: applications || [],
        setApplications,
        campaigns: campaigns || [],
        setCampaigns,
        settings,
        setSettings,
        affiliates: affiliates || [],
        setAffiliates,
        triggerAffiliateClick,
        scheduledTours: scheduledTours || [],
        setScheduledTours,
        savedPropertyIds: savedPropertyIds || [],
        toggleSaveProperty,
        selectedProperty,
        setSelectedProperty,
        applyingProperty,
        setApplyingProperty,
        touringProperty,
        setTouringProperty,
        toasts,
        addToast,
        removeToast,
        refreshData,
        isLoading,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        aiSearchModalOpen,
        setAiSearchModalOpen,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      <div className={isDarkMode ? 'dark bg-stone-950 text-stone-100 min-h-screen' : 'bg-stone-50 text-stone-900 min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
