import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { MarketplaceView } from './components/MarketplaceView';
import { TenantBoardView } from './components/TenantBoardView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ApplicationModal } from './components/ApplicationModal';
import { ScheduleTourModal } from './components/ScheduleTourModal';
import { AiSearchAssistantModal } from './components/AiSearchAssistantModal';
import { AdminLayout } from './components/AdminPortal/AdminLayout';
import { TenantPortalView } from './components/TenantPortalView';
import { LandlordPortalView } from './components/LandlordPortalView';
import { VerifiedPageView } from './components/VerifiedPageView';

// Auth & Feature Modals
import { AuthModal } from './components/AuthModal';
import { PostTenantRequestModal } from './components/PostTenantRequestModal';
import { AddListingModal } from './components/AddListingModal';
import { MembershipModal } from './components/MembershipModal';
import { VerifyMemberModal } from './components/VerifyMemberModal';
import { ScreeningPortalModal } from './components/ScreeningPortalModal';
import { ChatModal } from './components/ChatModal';
import { ListingShareModal } from './components/ListingShareModal';
import { UserProfileModal } from './components/UserProfileModal';

const MainAppContent: React.FC = () => {
  const { currentView, sharingProperty, isShareModalOpen, setShareModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Header Navigation */}
      <Header />

      {/* Primary Route Rendering */}
      <main className="flex-1">
        {currentView === 'MARKETPLACE' && <MarketplaceView />}
        {currentView === 'TENANT_BOARD' && <TenantBoardView />}
        {currentView === 'ADMIN_PORTAL' && <AdminLayout />}
        {currentView === 'TENANT_PORTAL' && <TenantPortalView />}
        {currentView === 'LANDLORD_PORTAL' && <LandlordPortalView />}
        {currentView === 'VERIFIED' && <VerifiedPageView />}
        {/* Support for other tabs gracefully showing relevant rental marketplace with pre-filters */}
        {(currentView === 'ROOMS' || currentView === 'ROOMMATES' || currentView === 'GUIDES' || currentView === 'MARKET_TRENDS' || currentView === 'COMMUNITY') && (
          <MarketplaceView />
        )}
      </main>

      {/* Global Footer */}
      {currentView !== 'ADMIN_PORTAL' && <Footer />}

      {/* Global Interactive Modals */}
      <PropertyDetailModal />
      <ApplicationModal />
      <ScheduleTourModal />
      <AiSearchAssistantModal />

      {/* Feature & Workflow Modals */}
      <AuthModal />
      <PostTenantRequestModal />
      <AddListingModal />
      <MembershipModal />
      <VerifyMemberModal />
      <ScreeningPortalModal />
      <ChatModal />
      <UserProfileModal />
      <ListingShareModal
        property={sharingProperty}
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

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
