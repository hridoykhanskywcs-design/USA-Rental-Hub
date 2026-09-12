import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { MarketplaceView } from './components/MarketplaceView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ApplicationModal } from './components/ApplicationModal';
import { ScheduleTourModal } from './components/ScheduleTourModal';
import { AiSearchAssistantModal } from './components/AiSearchAssistantModal';
import { AdminLayout } from './components/AdminPortal/AdminLayout';
import { TenantPortalView } from './components/TenantPortalView';
import { LandlordPortalView } from './components/LandlordPortalView';

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Header Navigation (hidden in full-screen Admin mode if desired, or kept for seamless switching) */}
      <Header />

      {/* Primary Route Rendering */}
      <main className="flex-1">
        {currentView === 'MARKETPLACE' && <MarketplaceView />}
        {currentView === 'ADMIN_PORTAL' && <AdminLayout />}
        {currentView === 'TENANT_PORTAL' && <TenantPortalView />}
        {currentView === 'LANDLORD_PORTAL' && <LandlordPortalView />}
      </main>

      {/* Global Footer (shown for public and tenant/landlord portal) */}
      {currentView !== 'ADMIN_PORTAL' && <Footer />}

      {/* Global Interactive Modals */}
      <PropertyDetailModal />
      <ApplicationModal />
      <ScheduleTourModal />
      <AiSearchAssistantModal />

      {/* Global SSE Toast Notification Dispatcher */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
