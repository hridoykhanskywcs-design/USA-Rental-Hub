import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PropertyListing,
  RentalApplication,
  SystemSettings,
  UserRole,
  MarketingCampaign,
  TourBooking,
  AffiliatePartnerLink,
  TenantRequest,
  ChatMessage,
  UserProfile,
  MembershipTier,
  ScreeningDocument,
  SharingSite,
} from '../types';
import { api } from '../services/api';
import { firestoreSync } from '../services/firestoreSync';
import {
  INITIAL_SETTINGS,
  INITIAL_TOURS,
  INITIAL_AFFILIATES,
  INITIAL_TENANT_REQUESTS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockData';

export type AppView = 
  | 'MARKETPLACE'
  | 'TENANT_BOARD'
  | 'ROOMS'
  | 'ROOMMATES'
  | 'COMMUNITY'
  | 'GUIDES'
  | 'MARKET_TRENDS'
  | 'SERVICES'
  | 'LANDLORD_PORTAL'
  | 'TENANT_PORTAL'
  | 'ADMIN_PORTAL'
  | 'VERIFIED';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  properties: PropertyListing[];
  setProperties: React.Dispatch<React.SetStateAction<PropertyListing[]>>;
  tenantRequests: TenantRequest[];
  setTenantRequests: React.Dispatch<React.SetStateAction<TenantRequest[]>>;
  addTenantRequest: (req: Omit<TenantRequest, 'id' | 'createdAt'>) => void;
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
  updateTourStatus: (id: string, status: TourBooking['status']) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (appId: string, propertyId: string, propertyTitle: string, text: string) => void;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  selectedProperty: PropertyListing | null;
  setSelectedProperty: (prop: PropertyListing | null) => void;
  applyingProperty: PropertyListing | null;
  setApplyingProperty: (prop: PropertyListing | null) => void;
  touringProperty: PropertyListing | null;
  setTouringProperty: (prop: PropertyListing | null) => void;
  viewingUserProfile: Partial<UserProfile> | null;
  setViewingUserProfile: (user: Partial<UserProfile> | null) => void;
  openUserProfile: (userOrData: Partial<UserProfile>) => void;
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
  
  // Modals
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'SIGN_IN' | 'CREATE_ACCOUNT';
  setAuthModalMode: (mode: 'SIGN_IN' | 'CREATE_ACCOUNT') => void;
  isMembershipModalOpen: boolean;
  setMembershipModalOpen: (open: boolean) => void;
  isVerifyMemberModalOpen: boolean;
  setVerifyMemberModalOpen: (open: boolean) => void;
  isPostTenantRequestModalOpen: boolean;
  setPostTenantRequestModalOpen: (open: boolean) => void;
  isAddListingModalOpen: boolean;
  setAddListingModalOpen: (open: boolean) => void;
  isScreeningPortalModalOpen: boolean;
  setScreeningPortalModalOpen: (open: boolean) => void;
  isChatModalOpen: boolean;
  setChatModalOpen: (open: boolean) => void;
  activeChatApp: RentalApplication | null;
  setActiveChatApp: (app: RentalApplication | null) => void;

  // Sharing & Screening
  sharingProperty: PropertyListing | null;
  setSharingProperty: (prop: PropertyListing | null) => void;
  isShareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  openShareModal: (prop: PropertyListing) => void;
  userScreeningDocs: ScreeningDocument[];
  setUserScreeningDocs: React.Dispatch<React.SetStateAction<ScreeningDocument[]>>;
  addScreeningDoc: (doc: ScreeningDocument) => void;
  upgradeToVerified: (planType: 'FREE_VERIFIED' | 'PAID_VERIFIED', paymentDetails?: any) => Promise<void>;

  // Actions
  loginUser: (email: string, role?: UserRole) => void;
  signupUser: (fullName: string, email: string, phone: string, role: UserRole) => void;
  logoutUser: () => void;
  upgradeMembership: (tier: MembershipTier) => void;
  verifyMemberSuccess: () => void;
  sponsorBannerDismissed: boolean;
  setSponsorBannerDismissed: (dismissed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nestryy_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr-default-tenant',
      fullName: 'David Miller',
      email: 'd.miller@nestryy.com',
      phone: '+1 (512) 330-8919',
      role: 'TENANT',
      membershipTier: 'FREE',
      isVerifiedMember: false,
      verificationStatus: 'NOT_SUBMITTED',
      welcomeCredits: 250,
      createdAt: new Date().toISOString(),
    };
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('TENANT');
  const [currentView, setCurrentView] = useState<AppView>('MARKETPLACE');
  const [selectedCity, setSelectedCity] = useState<string>('San Francisco');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [tenantRequests, setTenantRequests] = useState<TenantRequest[]>(() => {
    try {
      const saved = localStorage.getItem('nestryy_tenant_requests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TENANT_REQUESTS;
  });
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [affiliates, setAffiliates] = useState<AffiliatePartnerLink[]>(INITIAL_AFFILIATES);
  const [scheduledTours, setScheduledTours] = useState<TourBooking[]>(INITIAL_TOURS || []);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('nestryy_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CHAT_MESSAGES;
  });

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

  // Modals state
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'SIGN_IN' | 'CREATE_ACCOUNT'>('SIGN_IN');
  const [isMembershipModalOpen, setMembershipModalOpen] = useState<boolean>(false);
  const [isVerifyMemberModalOpen, setVerifyMemberModalOpen] = useState<boolean>(false);
  const [isPostTenantRequestModalOpen, setPostTenantRequestModalOpen] = useState<boolean>(false);
  const [isAddListingModalOpen, setAddListingModalOpen] = useState<boolean>(false);
  const [isScreeningPortalModalOpen, setScreeningPortalModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setChatModalOpen] = useState<boolean>(false);
  const [activeChatApp, setActiveChatApp] = useState<RentalApplication | null>(null);
  const [sponsorBannerDismissed, setSponsorBannerDismissed] = useState<boolean>(false);
  const [viewingUserProfile, setViewingUserProfile] = useState<Partial<UserProfile> | null>(null);

  const openUserProfile = (userOrData: Partial<UserProfile>) => {
    setViewingUserProfile(userOrData);
  };

  const updateTourStatus = (id: string, status: TourBooking['status']) => {
    setScheduledTours((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    addToast('Tour Request Updated', `Tour has been marked as ${status.toLowerCase()}.`, 'info');
  };

  // Sharing & Screening State
  const [sharingProperty, setSharingProperty] = useState<PropertyListing | null>(null);
  const [isShareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [userScreeningDocs, setUserScreeningDocs] = useState<ScreeningDocument[]>(() => {
    try {
      const saved = localStorage.getItem('nestryy_screening_docs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const openShareModal = (prop: PropertyListing) => {
    setSharingProperty(prop);
    setShareModalOpen(true);
  };

  const addScreeningDoc = (doc: ScreeningDocument) => {
    setUserScreeningDocs((prev) => {
      const updated = [doc, ...prev.filter((d) => d.id !== doc.id)];
      try {
        localStorage.setItem('nestryy_screening_docs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    firestoreSync.saveScreeningDoc(doc).catch(() => {});
    addToast('Document Submitted', `Your ${doc.title || doc.docType} is securely saved and linked to your tenant profile.`, 'success');
  };

  const upgradeToVerified = async (planType: 'FREE_VERIFIED' | 'PAID_VERIFIED', paymentDetails?: any) => {
    if (!currentUser) return;
    const isPaid = planType === 'PAID_VERIFIED';
    const updatedUser: UserProfile = {
      ...currentUser,
      isVerifiedMember: true,
      verifiedPlanType: planType,
      verificationStatus: 'VERIFIED',
      membershipTier: isPaid ? 'PRO_VERIFIED' : currentUser.membershipTier,
      welcomeCredits: currentUser.welcomeCredits + (isPaid ? 1000 : 250),
      paymentMethod: paymentDetails ? {
        cardHolderName: paymentDetails.cardHolderName || currentUser.fullName,
        cardNumber: paymentDetails.cardNumber || '',
        cardExpiry: paymentDetails.cardExpiry || '',
        cardCvv: paymentDetails.cardCvv || '',
        cardType: paymentDetails.cardType || 'Visa',
        billingZip: paymentDetails.billingZip || '',
        lastFour: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : '4242',
      } : currentUser.paymentMethod,
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('nestryy_user_profile', JSON.stringify(updatedUser));
    } catch {}
    firestoreSync.saveUserProfile(updatedUser).catch(() => {});

    addToast(
      isPaid ? 'Pro Verified Upgrade Complete! 🛡️' : 'Free Verification Active! 🛡️',
      isPaid
        ? 'Congratulations! You are now a Pro Verified Member with priority screening, zero fee applications, and full report sync.'
        : 'Your Free Verification has been registered with zero fee access and standard verified badge.',
      'success'
    );
  };

  // Sync role when user changes
  useEffect(() => {
    if (currentUser?.role) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  // Handle URL hash #admin, #verified, or query params ?admin=true, ?view=admin for direct page access
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const viewParam = (params.get('view') || '').toLowerCase();
      const isAdmin = params.get('admin') === 'true' || window.location.pathname.endsWith('/admin');

      if (hash === '#admin' || viewParam === 'admin' || viewParam === 'admin_portal' || isAdmin) {
        setCurrentView('ADMIN_PORTAL');
      } else if (hash === '#verified' || viewParam === 'verified') {
        setCurrentView('VERIFIED');
      } else if (hash === '#tenant' || viewParam === 'tenant' || viewParam === 'tenant_portal') {
        setCurrentView('TENANT_PORTAL');
      } else if (hash === '#landlord' || viewParam === 'landlord' || viewParam === 'landlord_portal') {
        setCurrentView('LANDLORD_PORTAL');
      } else if (hash === '#tenants' || viewParam === 'tenant_board') {
        setCurrentView('TENANT_BOARD');
      }
    };
    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  const triggerAffiliateClick = (id: string, url: string) => {
    api.recordAffiliateClick(id).catch(() => {});
    firestoreSync.trackAffiliateClick(id).catch(() => {});
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

  const addTenantRequest = (req: Omit<TenantRequest, 'id' | 'createdAt'>) => {
    const newReq: TenantRequest = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTenantRequests((prev) => {
      const updated = [newReq, ...prev];
      try {
        localStorage.setItem('nestryy_tenant_requests', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    addToast('Rental Need Posted!', 'Landlords and property managers can now view your request.', 'success');
  };

  const sendChatMessage = (appId: string, propertyId: string, propertyTitle: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      applicationId: appId,
      propertyId,
      propertyTitle,
      senderId: currentUser?.id || 'usr-anon',
      senderName: currentUser?.fullName || 'User',
      senderRole: (currentUser?.role as any) || currentRole,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem('nestryy_chat_messages', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const loginUser = (email: string, role: UserRole = 'TENANT') => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      phone: '+1 (415) 800-2910',
      role: role === 'RENTER' ? 'TENANT' : role,
      membershipTier: 'FREE',
      isVerifiedMember: false,
      verificationStatus: 'NOT_SUBMITTED',
      welcomeCredits: 250,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('nestryy_user_profile', JSON.stringify(user));
    } catch {}
    setAuthModalOpen(false);
    addToast('Welcome Back!', `Signed in as ${user.fullName} (${user.role})`, 'success');
  };

  const signupUser = (fullName: string, email: string, phone: string, role: UserRole) => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      phone,
      role: role === 'RENTER' ? 'TENANT' : role,
      membershipTier: 'FREE',
      isVerifiedMember: false,
      verificationStatus: 'NOT_SUBMITTED',
      welcomeCredits: 250,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('nestryy_user_profile', JSON.stringify(user));
    } catch {}
    setAuthModalOpen(false);
    addToast('Account Created!', `Welcome to Nestryy! +250 welcome credits added to your profile.`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nestryy_user_profile');
    } catch {}
    addToast('Signed Out', 'You have been signed out successfully', 'info');
  };

  const upgradeMembership = (tier: MembershipTier) => {
    if (!currentUser) return;
    const isPaid = tier === 'PRO_VERIFIED' || tier === 'VIP_ENTERPRISE';
    const updated: UserProfile = {
      ...currentUser,
      membershipTier: tier,
      isVerifiedMember: isPaid ? true : currentUser.isVerifiedMember,
      verifiedPlanType: isPaid ? 'PAID_VERIFIED' : currentUser.verifiedPlanType,
      verificationStatus: isPaid ? 'VERIFIED' : currentUser.verificationStatus,
      welcomeCredits: currentUser.welcomeCredits + (tier === 'VIP_ENTERPRISE' ? 1000 : 500),
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('nestryy_user_profile', JSON.stringify(updated));
    } catch {}
    setMembershipModalOpen(false);
    addToast(
      isPaid ? 'Verified Paid Member Confirmed! 🛡️' : 'Membership Upgraded!',
      isPaid
        ? `You are now a Pro Verified Member with verified paid privileges, priority applications, and direct screening sync.`
        : `Your plan has been upgraded to ${tier}. Additional credits added!`,
      'success'
    );
  };

  const verifyMemberSuccess = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      isVerifiedMember: true,
      verificationStatus: 'VERIFIED',
      welcomeCredits: currentUser.welcomeCredits + 250,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('nestryy_user_profile', JSON.stringify(updated));
    } catch {}
    setVerifyMemberModalOpen(false);
    addToast('Verified Member Badge Granted! 🛡️', 'You have unlocked verified tenant status and +250 bonus credits!', 'success');
  };

  // Guarantee strictly unique listings by ID
  const dedupeListings = (list: PropertyListing[]): PropertyListing[] => {
    const seen = new Set<string>();
    const out: PropertyListing[] = [];
    for (const item of list || []) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        out.push(item);
      }
    }
    return out;
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
      const loadedProps = dedupeListings(propsRes?.properties || []);
      setProperties(loadedProps);
      setApplications(appsRes?.applications || []);
      setCampaigns(campRes || []);
      setSettings(setsRes || INITIAL_SETTINGS);
      setScheduledTours(toursRes || []);
      setAffiliates(affsRes?.length ? affsRes : (setsRes?.affiliatePartners || INITIAL_AFFILIATES));

      if (loadedProps.length > 0) {
        firestoreSync.batchSeedProperties(loadedProps).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to load initial server data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    const unsubscribeFirestore = firestoreSync.subscribeProperties((fbProps) => {
      if (fbProps && fbProps.length > 0) {
        setProperties((prev) => {
          const map = new Map<string, PropertyListing>();
          (prev || []).forEach((p) => {
            if (p?.id) map.set(p.id, p);
          });
          fbProps.forEach((p) => {
            if (p?.id) map.set(p.id, p);
          });
          return Array.from(map.values());
        });
      }
    });

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
        if (newProp && newProp.id) {
          setProperties((prev) => dedupeListings([newProp, ...(prev || []).filter((p) => p.id !== newProp.id)]));
        }
      } catch (e) {
        console.error('Error handling property_created:', e);
      }
    });

    return () => {
      eventSource.close();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole,
        currentView,
        setCurrentView,
        selectedCity,
        setSelectedCity,
        properties: properties || [],
        setProperties,
        tenantRequests,
        setTenantRequests,
        addTenantRequest,
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
        updateTourStatus,
        viewingUserProfile,
        setViewingUserProfile,
        openUserProfile,
        chatMessages,
        sendChatMessage,
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
        isAuthModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isMembershipModalOpen,
        setMembershipModalOpen,
        isVerifyMemberModalOpen,
        setVerifyMemberModalOpen,
        isPostTenantRequestModalOpen,
        setPostTenantRequestModalOpen,
        isAddListingModalOpen,
        setAddListingModalOpen,
        isScreeningPortalModalOpen,
        setScreeningPortalModalOpen,
        isChatModalOpen,
        setChatModalOpen,
        activeChatApp,
        setActiveChatApp,
        sharingProperty,
        setSharingProperty,
        isShareModalOpen,
        setShareModalOpen,
        openShareModal,
        userScreeningDocs,
        setUserScreeningDocs,
        addScreeningDoc,
        upgradeToVerified,
        loginUser,
        signupUser,
        logoutUser,
        upgradeMembership,
        verifyMemberSuccess,
        sponsorBannerDismissed,
        setSponsorBannerDismissed,
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
