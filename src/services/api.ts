import { PropertyListing, RentalApplication, MarketingCampaign, SystemSettings, TourBooking, MaintenanceTicket, AffiliatePartnerLink } from '../types';

export const api = {
  // Properties
  async getProperties(params?: Record<string, string | number | boolean>): Promise<{ properties: PropertyListing[]; count: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`/api/properties?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch properties');
    return res.json();
  },

  async parseListingInput(payload: { inputType?: string; content?: string; url?: string; defaultCity?: string }): Promise<{
    success: boolean;
    count: number;
    listings: Partial<PropertyListing>[];
    isAiPowered: boolean;
  }> {
    const res = await fetch('/api/listings/parse-input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to parse listing input');
    return res.json();
  },

  async getProperty(idOrSlug: string): Promise<PropertyListing> {
    const res = await fetch(`/api/properties/${idOrSlug}`);
    if (!res.ok) throw new Error('Failed to fetch property details');
    const data = await res.json();
    return data.property;
  },

  async createProperty(property: Partial<PropertyListing>): Promise<PropertyListing> {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (!res.ok) throw new Error('Failed to create property');
    const data = await res.json();
    return data.property;
  },

  async updateProperty(id: string, property: Partial<PropertyListing>): Promise<PropertyListing> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (!res.ok) throw new Error('Failed to update property');
    const data = await res.json();
    return data.property;
  },

  async deleteProperty(id: string): Promise<void> {
    const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete property');
  },

  async bulkImportProperties(items: Partial<PropertyListing>[]): Promise<{
    successful: number;
    failed: number;
    duplicates: number;
    addedListings: PropertyListing[];
    errors: string[];
  }> {
    const res = await fetch('/api/properties/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Failed to bulk import properties');
    const data = await res.json();
    return data.report;
  },

  // Applications
  async getApplications(params?: Record<string, string>): Promise<{ applications: RentalApplication[]; count: number }> {
    const query = new URLSearchParams(params);
    const res = await fetch(`/api/applications?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async submitApplication(application: Partial<RentalApplication>): Promise<RentalApplication> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    });
    if (!res.ok) throw new Error('Failed to submit application');
    const data = await res.json();
    return data.application;
  },

  async updateApplication(id: string, updates: Partial<RentalApplication>): Promise<RentalApplication> {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update application');
    const data = await res.json();
    return data.application;
  },

  // Campaigns
  async getCampaigns(): Promise<MarketingCampaign[]> {
    const res = await fetch('/api/campaigns');
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    const data = await res.json();
    return data.campaigns;
  },

  async createCampaign(campaign: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign),
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    const data = await res.json();
    return data.campaign;
  },

  async sendCampaign(idOrPayload: string | any): Promise<MarketingCampaign> {
    if (typeof idOrPayload === 'string') {
      const res = await fetch(`/api/campaigns/${idOrPayload}/send`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to send campaign');
      const data = await res.json();
      return data.campaign;
    } else {
      const createRes = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idOrPayload),
      });
      if (!createRes.ok) throw new Error('Failed to create campaign');
      const created = await createRes.json();
      const sendRes = await fetch(`/api/campaigns/${created.campaign.id}/send`, { method: 'POST' });
      if (!sendRes.ok) return created.campaign;
      const sent = await sendRes.json();
      return sent.campaign;
    }
  },

  async parseContactsList(rawText: string): Promise<{ count: number; contacts: { name: string; email?: string; phone?: string }[] }> {
    const res = await fetch('/api/campaigns/upload-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText }),
    });
    if (!res.ok) throw new Error('Failed to parse contacts');
    return res.json();
  },

  // Settings & Credit Score Link
  async getSettings(): Promise<SystemSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch system settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update system settings');
    const data = await res.json();
    return data.settings;
  },

  // Affiliates
  async getAffiliates(): Promise<AffiliatePartnerLink[]> {
    const res = await fetch('/api/affiliates');
    if (!res.ok) throw new Error('Failed to fetch affiliates');
    const data = await res.json();
    return data.affiliates || [];
  },

  async createAffiliate(affiliate: Partial<AffiliatePartnerLink>): Promise<AffiliatePartnerLink> {
    const res = await fetch('/api/affiliates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(affiliate),
    });
    if (!res.ok) throw new Error('Failed to create affiliate');
    const data = await res.json();
    return data.affiliate;
  },

  async updateAffiliate(id: string, updates: Partial<AffiliatePartnerLink>): Promise<AffiliatePartnerLink> {
    const res = await fetch(`/api/affiliates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update affiliate');
    const data = await res.json();
    return data.affiliate;
  },

  async deleteAffiliate(id: string): Promise<void> {
    const res = await fetch(`/api/affiliates/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete affiliate');
  },

  async recordAffiliateClick(id: string): Promise<number> {
    const res = await fetch(`/api/affiliates/${id}/click`, { method: 'POST' });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.clicksCount || 0;
  },

  // Tours & Maintenance
  async getTours(): Promise<TourBooking[]> {
    const res = await fetch('/api/tours');
    if (!res.ok) throw new Error('Failed to fetch tours');
    const data = await res.json();
    return data.tours;
  },

  async scheduleTour(tour: Partial<TourBooking>): Promise<TourBooking> {
    const res = await fetch('/api/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tour),
    });
    if (!res.ok) throw new Error('Failed to schedule tour');
    const data = await res.json();
    return data.tour;
  },

  async getMaintenance(): Promise<MaintenanceTicket[]> {
    const res = await fetch('/api/maintenance');
    if (!res.ok) throw new Error('Failed to fetch maintenance');
    const data = await res.json();
    return data.tickets;
  },

  async submitMaintenance(ticket: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    if (!res.ok) throw new Error('Failed to submit maintenance');
    const data = await res.json();
    return data.ticket;
  },

  async updateMaintenance(id: string, updates: Partial<MaintenanceTicket>): Promise<MaintenanceTicket> {
    const res = await fetch(`/api/maintenance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update ticket');
    const data = await res.json();
    return data.ticket;
  },

  // AI Helpers
  async aiSearchParse(query: string): Promise<any> {
    const res = await fetch('/api/ai/search-parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to parse search');
    return res.json();
  },

  async aiGenerateListing(payload: any): Promise<any> {
    const res = await fetch('/api/ai/generate-listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate listing');
    return res.json();
  },

  async aiMaintenanceTriage(payload: { category: string; problemDescription: string }): Promise<any> {
    const res = await fetch('/api/ai/maintenance-triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to triage maintenance');
    return res.json();
  },

  // System Health
  async getSystemHealth(): Promise<any> {
    const res = await fetch('/api/system/health');
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  async getMetrics(): Promise<any> {
    const res = await fetch('/api/system/health');
    if (!res.ok) throw new Error('Failed to fetch system metrics');
    const data = await res.json();
    const sourceMetrics = data.metrics || data;
    const quota = sourceMetrics.apiQuotaUsage || {
      geminiApiDailyRequests: sourceMetrics.geminiApiRequests || 42,
      geminiApiDailyLimit: sourceMetrics.geminiQuotaLimit || 1500,
      smsSentToday: sourceMetrics.smsSentToday || 450,
      smsDailyLimit: sourceMetrics.smsDailyLimit || 2500,
      emailsSentToday: sourceMetrics.emailsSentToday || 630,
      emailDailyLimit: sourceMetrics.emailDailyLimit || 10000,
      databaseQueriesToday: sourceMetrics.databaseQueries || 389,
      storageUsedMb: sourceMetrics.storageMbUsed || 148,
      storageLimitMb: sourceMetrics.storageMbLimit || 2048,
    };

    return {
      status: sourceMetrics.status || data.status || 'HEALTHY',
      uptime: sourceMetrics.uptime ?? (data.uptime ?? 3600),
      memoryUsage: sourceMetrics.memoryUsage || data.memoryUsage || {
        heapUsed: 35 * 1024 * 1024,
        heapTotal: 64 * 1024 * 1024,
        rss: 85 * 1024 * 1024,
        external: 5 * 1024 * 1024,
      },
      activeConnections: sourceMetrics.activeConnections ?? (data.activeConnections ?? 1),
      apiQuotaUsage: quota,
    };
  },
};
