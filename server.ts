import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_PROPERTIES,
  INITIAL_APPLICATIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_SETTINGS,
  INITIAL_TOURS,
  INITIAL_MAINTENANCE,
  INITIAL_AFFILIATES,
  CITY_TRENDS,
} from './src/data/mockData';
import { PropertyListing, RentalApplication, MarketingCampaign, SystemSettings, TourBooking, MaintenanceTicket, AffiliatePartnerLink } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory persistent database store during application lifecycle
let properties: PropertyListing[] = [...INITIAL_PROPERTIES];
let applications: RentalApplication[] = [...INITIAL_APPLICATIONS];
let campaigns: MarketingCampaign[] = [...INITIAL_CAMPAIGNS];
let systemSettings: SystemSettings = { ...INITIAL_SETTINGS };
let tours: TourBooking[] = [...INITIAL_TOURS];
let maintenanceTickets: MaintenanceTicket[] = [...INITIAL_MAINTENANCE];

// Quota & metrics tracker
const systemMetrics = {
  geminiApiRequests: 42,
  geminiQuotaLimit: 1500,
  databaseQueries: 389,
  smsSentToday: 450,
  smsDailyLimit: 2500,
  emailsSentToday: 630,
  emailDailyLimit: 10000,
  storageMbUsed: 148,
  storageMbLimit: 2048,
  activeConnections: 1,
};

// SSE Connected Clients
const sseClients: Response[] = [];

function broadcastEvent(type: string, data: unknown) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// Lazy Gemini SDK client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Gemini AI client:', err);
    }
  }
  return geminiClient;
}

// Resilient Gemini execution with automatic retry and 503 fallback to flash-lite
async function generateContentWithFallback(
  client: GoogleGenAI,
  prompt: string,
  config?: any
): Promise<string> {
  // Primary attempt: gemini-3.8-flash
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config,
    });
    if (response.text) return response.text;
  } catch (err: any) {
    const is503OrUnavailable =
      err?.status === 'UNAVAILABLE' ||
      err?.code === 503 ||
      String(err?.message || '').includes('503') ||
      String(err?.message || '').includes('high demand') ||
      String(err?.message || '').includes('temporarily unavailable') ||
      String(err?.message || '').includes('overloaded');

    if (is503OrUnavailable) {
      console.warn('gemini-3.8-flash high demand (503), falling back to gemini-3.1-flash-lite...');
      try {
        const fallbackResponse = await client.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config,
        });
        if (fallbackResponse.text) return fallbackResponse.text;
      } catch (fallbackErr: any) {
        console.warn('Gemini fallback model notice:', fallbackErr?.message || fallbackErr);
        throw fallbackErr;
      }
    }
    throw err;
  }
  return '';
}

// ==========================================
// REAL-TIME SSE (SERVER SENT EVENTS)
// ==========================================
app.get('/api/realtime/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  res.write(`data: ${JSON.stringify({ message: 'Connected to Nestryy Realtime Stream' })}\n\n`);
  sseClients.push(res);
  systemMetrics.activeConnections = sseClients.length;

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
    systemMetrics.activeConnections = sseClients.length;
  });
});

// ==========================================
// SYSTEM SETTINGS & CREDIT SCORE LINK EDITING
// ==========================================
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, settings: systemSettings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const updates = req.body;
  systemSettings = { ...systemSettings, ...updates };
  broadcastEvent('settings_updated', systemSettings);
  res.json({ success: true, settings: systemSettings, message: 'Settings & Credit Score link updated successfully' });
});

// ==========================================
// AFFILIATE PARTNER LINKS MANAGEMENT
// ==========================================
app.get('/api/affiliates', (req: Request, res: Response) => {
  if (!systemSettings.affiliatePartners) {
    systemSettings.affiliatePartners = [...INITIAL_AFFILIATES];
  }
  res.json({ success: true, affiliates: systemSettings.affiliatePartners });
});

app.post('/api/affiliates', (req: Request, res: Response) => {
  if (!systemSettings.affiliatePartners) {
    systemSettings.affiliatePartners = [...INITIAL_AFFILIATES];
  }
  const body = req.body;
  const newAffiliate: AffiliatePartnerLink = {
    id: `aff-${Date.now()}`,
    name: body.name || 'New Affiliate Partner',
    category: body.category || 'CREDIT_SCORE',
    url: body.url || 'https://experian.com',
    commissionInfo: body.commissionInfo || '$10 per conversion',
    badgeText: body.badgeText || 'Special Offer',
    description: body.description || '',
    bannerText: body.bannerText || 'Exclusive tenant discount available',
    ctaLabel: body.ctaLabel || 'Claim Offer',
    active: body.active ?? true,
    placements: body.placements || ['HEADER_BANNER', 'APPLICATION_FORM', 'PROPERTY_DETAIL'],
    clicksCount: 0,
  };

  systemSettings.affiliatePartners.unshift(newAffiliate);
  // Also keep creditScorePartnerLink in sync if it's a credit score partner
  if (newAffiliate.category === 'CREDIT_SCORE' && newAffiliate.active) {
    systemSettings.creditScorePartnerLink = newAffiliate.url;
    systemSettings.creditScorePartnerName = newAffiliate.name;
  }

  broadcastEvent('affiliates_updated', systemSettings.affiliatePartners);
  res.status(201).json({ success: true, affiliate: newAffiliate, message: 'Affiliate link added successfully' });
});

app.put('/api/affiliates/:id', (req: Request, res: Response) => {
  if (!systemSettings.affiliatePartners) {
    systemSettings.affiliatePartners = [...INITIAL_AFFILIATES];
  }
  const { id } = req.params;
  const idx = systemSettings.affiliatePartners.findIndex(a => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Affiliate partner not found' });
  }

  systemSettings.affiliatePartners[idx] = {
    ...systemSettings.affiliatePartners[idx],
    ...req.body,
  };

  if (systemSettings.affiliatePartners[idx].category === 'CREDIT_SCORE' && systemSettings.affiliatePartners[idx].active) {
    systemSettings.creditScorePartnerLink = systemSettings.affiliatePartners[idx].url;
    systemSettings.creditScorePartnerName = systemSettings.affiliatePartners[idx].name;
  }

  broadcastEvent('affiliates_updated', systemSettings.affiliatePartners);
  res.json({ success: true, affiliate: systemSettings.affiliatePartners[idx], message: 'Affiliate partner updated successfully' });
});

app.delete('/api/affiliates/:id', (req: Request, res: Response) => {
  if (!systemSettings.affiliatePartners) {
    systemSettings.affiliatePartners = [...INITIAL_AFFILIATES];
  }
  const { id } = req.params;
  systemSettings.affiliatePartners = systemSettings.affiliatePartners.filter(a => a.id !== id);
  broadcastEvent('affiliates_updated', systemSettings.affiliatePartners);
  res.json({ success: true, message: 'Affiliate partner deleted' });
});

app.post('/api/affiliates/:id/click', (req: Request, res: Response) => {
  if (!systemSettings.affiliatePartners) {
    systemSettings.affiliatePartners = [...INITIAL_AFFILIATES];
  }
  const { id } = req.params;
  const partner = systemSettings.affiliatePartners.find(a => a.id === id);
  if (partner) {
    partner.clicksCount = (partner.clicksCount || 0) + 1;
    res.json({ success: true, clicksCount: partner.clicksCount });
  } else {
    res.json({ success: false, message: 'Affiliate partner not found' });
  }
});

// ==========================================
// PROPERTIES & LISTINGS APIS
// ==========================================
app.get('/api/properties', (req: Request, res: Response) => {
  const { city, minRent, maxRent, bedrooms, propertyType, verifiedOnly, petFriendly, laundry, parking, query } = req.query;

  let filtered = [...properties];

  if (city && typeof city === 'string' && city !== 'ALL') {
    filtered = filtered.filter(p => p.address.city.toLowerCase().includes(city.toLowerCase()));
  }

  if (minRent) {
    filtered = filtered.filter(p => p.rent >= Number(minRent));
  }
  if (maxRent) {
    filtered = filtered.filter(p => p.rent <= Number(maxRent));
  }
  if (bedrooms && bedrooms !== 'ANY') {
    filtered = filtered.filter(p => p.bedrooms >= Number(bedrooms));
  }
  if (propertyType && propertyType !== 'ALL') {
    filtered = filtered.filter(p => p.propertyType === propertyType);
  }
  if (verifiedOnly === 'true') {
    filtered = filtered.filter(p => p.isVerified);
  }
  if (petFriendly === 'true') {
    filtered = filtered.filter(p => p.isPetFriendly);
  }
  if (laundry === 'true') {
    filtered = filtered.filter(p => p.hasInUnitLaundry);
  }
  if (parking === 'true') {
    filtered = filtered.filter(p => p.hasParking);
  }
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.address.neighborhood.toLowerCase().includes(q) ||
      p.address.city.toLowerCase().includes(q)
    );
  }

  systemMetrics.databaseQueries += 1;
  res.json({ success: true, count: filtered.length, properties: filtered });
});

app.get('/api/properties/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const prop = properties.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Property listing not found' });
  }
  prop.viewsCount += 1;
  res.json({ success: true, property: prop });
});

app.post('/api/properties', (req: Request, res: Response) => {
  const newId = req.body.id || `prop-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const newProp: PropertyListing = {
    ...req.body,
    id: newId,
    slug: (req.body.title || 'rental')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, ''),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 0,
  };

  properties = [newProp, ...properties.filter(p => p.id !== newProp.id)];
  broadcastEvent('property_created', newProp);
  res.status(201).json({ success: true, property: newProp });
});

app.put('/api/properties/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = properties.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  properties[idx] = {
    ...properties[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  broadcastEvent('property_updated', properties[idx]);
  res.json({ success: true, property: properties[idx] });
});

app.delete('/api/properties/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = properties.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  const deleted = properties.splice(idx, 1)[0];
  broadcastEvent('property_deleted', { id: deleted.id });
  res.json({ success: true, message: 'Listing removed successfully' });
});

// ==========================================
// BULK AUTO LISTING IMPORT (CSV / JSON)
// ==========================================
app.post('/api/properties/bulk', (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty listings array provided' });
  }

  const report = {
    total: items.length,
    successful: 0,
    failed: 0,
    duplicates: 0,
    addedListings: [] as PropertyListing[],
    errors: [] as string[],
  };

  items.forEach((item: Partial<PropertyListing>, index: number) => {
    // Validate required fields
    if (!item.title || !item.rent || !item.address?.city) {
      report.failed += 1;
      report.errors.push(`Row ${index + 1}: Missing essential title, rent, or city`);
      return;
    }

    // Duplicate check by address & title
    const exists = properties.some(p =>
      p.title.toLowerCase() === item.title?.toLowerCase() ||
      (p.address.street.toLowerCase() === item.address?.street?.toLowerCase() &&
       p.address.city.toLowerCase() === item.address?.city?.toLowerCase())
    );

    if (exists) {
      report.duplicates += 1;
      report.errors.push(`Row ${index + 1}: Duplicate detected for "${item.title}"`);
      return;
    }

    const newListing: PropertyListing = {
      id: `prop-bulk-${Date.now()}-${index}`,
      slug: (item.title || 'rental')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Math.floor(Math.random() * 1000)}`,
      title: item.title,
      description: item.description || 'Recently imported luxury modern rental property in high-demand US location.',
      propertyType: item.propertyType || 'APARTMENT',
      address: {
        street: item.address?.street || '100 Main St',
        unit: item.address?.unit || '',
        city: item.address?.city || 'San Francisco',
        state: item.address?.state || 'CA',
        zip: item.address?.zip || '94105',
        neighborhood: item.address?.neighborhood || 'Downtown',
        latitude: item.address?.latitude || 37.7749,
        longitude: item.address?.longitude || -122.4194,
      },
      rent: Number(item.rent),
      deposit: Number(item.deposit || item.rent),
      bedrooms: Number(item.bedrooms || 1),
      bathrooms: Number(item.bathrooms || 1),
      sqft: Number(item.sqft || 750),
      availableDate: item.availableDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      leaseTerms: item.leaseTerms || '12 months',
      isPetFriendly: item.isPetFriendly ?? true,
      isFurnished: item.isFurnished ?? false,
      isVerified: item.isVerified ?? true,
      hasInUnitLaundry: item.hasInUnitLaundry ?? true,
      hasParking: item.hasParking ?? true,
      hasAirConditioning: item.hasAirConditioning ?? true,
      amenities: item.amenities || ['Keyless Entry', 'Modern Kitchen', 'In-Unit Washer & Dryer', 'Fitness Center'],
      utilitiesIncluded: item.utilitiesIncluded || ['Water', 'Trash'],
      images: item.images && item.images.length > 0 ? item.images : [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      ],
      landlordId: item.landlordId || 'll-admin-bulk',
      landlordName: item.landlordName || 'Nestryy Managed Residences',
      landlordContact: {
        email: item.landlordContact?.email || 'concierge@nestryy.com',
        phone: item.landlordContact?.phone || '+1 (800) 555-NEST',
      },
      status: systemSettings.bulkAutoListingDefaultStatus || 'PUBLISHED',
      viewsCount: 0,
      featured: item.featured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    properties.unshift(newListing);
    report.successful += 1;
    report.addedListings.push(newListing);
  });

  systemMetrics.storageMbUsed += Math.round(report.successful * 0.2);
  broadcastEvent('bulk_listings_added', { count: report.successful });
  res.json({ success: true, report });
});

// ==========================================
// BULK LISTING INPUT PARSER (LINK, CSV, ALL FILE TYPES & TEXT)
// ==========================================
app.post('/api/listings/parse-input', async (req: Request, res: Response) => {
  const { inputType, content, url, defaultCity = 'San Francisco' } = req.body;

  if (!content && !url) {
    return res.status(400).json({ success: false, message: 'No URL, text, or file content provided' });
  }

  const client = getGeminiClient();
  const rawInput = url ? `Rental Listing URL: ${url}\n${content || ''}` : content;

  if (client) {
    try {
      systemMetrics.geminiApiRequests += 1;
      const prompt = `You are a real estate listing parser for modern portals like Apartments.com, Roomster, and Zillow.
Extract or convert the following rental listing data into a JSON array of complete PropertyListing objects.
If it is a single listing, return an array of 1 item. If multiple listings or a CSV/file, return all parsed listings.

Make sure each object strictly has:
{
  "title": string,
  "description": string,
  "propertyType": "APARTMENT" | "HOUSE" | "CONDO" | "TOWNHOME" | "ROOM" | "STUDIO" | "COLIVING",
  "rentalCategory": "ENTIRE_PLACE" | "PRIVATE_ROOM" | "SHARED_ROOM" | "COLIVING",
  "address": {
    "street": string,
    "unit": string,
    "city": string,
    "state": string,
    "zip": string,
    "neighborhood": string,
    "latitude": number,
    "longitude": number
  },
  "rent": number,
  "deposit": number,
  "bedrooms": number,
  "bathrooms": number,
  "sqft": number,
  "availableDate": string (YYYY-MM-DD),
  "leaseTerms": string,
  "isPetFriendly": boolean,
  "isFurnished": boolean,
  "isVerified": boolean,
  "hasInUnitLaundry": boolean,
  "hasParking": boolean,
  "hasAirConditioning": boolean,
  "amenities": string[],
  "utilitiesIncluded": string[],
  "specialPromotion": string,
  "images": string[] (provide 2-3 realistic luxury apartment unsplash images)
}

Input data to parse:
${rawInput}`;

      const responseText = await generateContentWithFallback(client, prompt, {
        responseMimeType: 'application/json',
      });

      const parsedArray = JSON.parse(responseText || '[]');
      const listings = Array.isArray(parsedArray) ? parsedArray : [parsedArray];
      return res.json({ success: true, count: listings.length, listings, isAiPowered: true });
    } catch (err) {
      console.warn('Gemini Listing Parse unavailable, using smart heuristic parser:', err);
    }
  }

  // Fallback intelligent heuristic parser for URLs, CSVs, and free text
  const fallbackListings: Partial<PropertyListing>[] = [];
  const text = String(rawInput);

  if (inputType === 'csv' || text.includes(',') && text.includes('\n')) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/["']/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(c => c.trim().replace(/["']/g, ''));
      if (row.length < 2) continue;

      const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('name'));
      const rentIdx = headers.findIndex(h => h.includes('rent') || h.includes('price'));
      const bedIdx = headers.findIndex(h => h.includes('bed'));
      const bathIdx = headers.findIndex(h => h.includes('bath'));
      const cityIdx = headers.findIndex(h => h.includes('city'));
      const streetIdx = headers.findIndex(h => h.includes('street') || h.includes('address'));
      const typeIdx = headers.findIndex(h => h.includes('type'));

      const rent = rentIdx >= 0 && Number(row[rentIdx]) ? Number(row[rentIdx]) : 2400 + i * 250;
      const beds = bedIdx >= 0 && Number(row[bedIdx]) !== undefined ? Number(row[bedIdx]) : 1;
      const baths = bathIdx >= 0 && Number(row[bathIdx]) ? Number(row[bathIdx]) : 1;
      const street = streetIdx >= 0 ? row[streetIdx] : `${100 + i * 15} Market Street`;
      const city = cityIdx >= 0 ? row[cityIdx] : defaultCity;
      const propType = typeIdx >= 0 ? (row[typeIdx].toUpperCase() as any) : (beds === 0 ? 'STUDIO' : 'APARTMENT');

      fallbackListings.push({
        title: titleIdx >= 0 ? row[titleIdx] : `Modern ${city} Residence #${i}`,
        description: `Stunning ${beds} bed ${baths} bath residence located in ${city}. Newly renovated with premium fixtures, open-concept floorplan, and abundant natural light.`,
        propertyType: propType,
        rentalCategory: propType === 'ROOM' ? 'PRIVATE_ROOM' : 'ENTIRE_PLACE',
        address: {
          street,
          city,
          state: 'CA',
          zip: '94105',
          neighborhood: 'Downtown / Metro',
          latitude: 37.7749 + i * 0.005,
          longitude: -122.4194 + i * 0.005,
        },
        rent,
        deposit: rent,
        bedrooms: beds,
        bathrooms: baths,
        sqft: 650 + beds * 350,
        availableDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        leaseTerms: '12 Months',
        isPetFriendly: true,
        isFurnished: false,
        isVerified: true,
        hasInUnitLaundry: true,
        hasParking: true,
        hasAirConditioning: true,
        amenities: ['In-Unit Washer & Dryer', 'Stainless Appliances', 'Hardwood Floors', 'Fitness Center', 'Keyless Entry'],
        utilitiesIncluded: ['Water', 'Trash'],
        specialPromotion: '🎉 $500 Move-In Credit with Verified Tenant Badge',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        ],
      });
    }
  } else {
    // URL or freeform description parsing
    const rentMatch = text.match(/\$?([0-9],[0-9]{3}|[0-9]{3,5})(\/mo|\s*rent|\s*per month)?/i);
    const rent = rentMatch ? Number(rentMatch[1].replace(/,/g, '')) : 2850;
    const bedMatch = text.match(/([0-9])\s*(bed|br|bedroom)/i);
    const beds = bedMatch ? Number(bedMatch[1]) : (text.toLowerCase().includes('studio') ? 0 : 1);
    const bathMatch = text.match(/([0-9](\.[0-9])?)\s*(bath|ba|bathroom)/i);
    const baths = bathMatch ? Number(bathMatch[1]) : 1;
    const isRoom = text.toLowerCase().includes('room') || text.toLowerCase().includes('roommate') || text.toLowerCase().includes('coliving');

    let parsedCity = defaultCity;
    ['San Francisco', 'Austin', 'New York', 'Miami', 'Seattle', 'Chicago', 'Denver', 'Boston', 'Los Angeles', 'Oakland', 'Brooklyn'].forEach(c => {
      if (text.toLowerCase().includes(c.toLowerCase())) parsedCity = c;
    });

    const titleExtract = url ? `Imported from ${new URL(url.startsWith('http') ? url : `https://${url}`).hostname} - ${beds} Bed in ${parsedCity}` : (text.split('\n')[0].substring(0, 70) || `Modern Rental Listing in ${parsedCity}`);

    fallbackListings.push({
      title: titleExtract,
      description: text.length > 20 ? text.substring(0, 500) : `Spacious ${beds} bedroom home in ${parsedCity} featuring contemporary styling, upgraded chef's kitchen, and high-efficiency climate control.`,
      propertyType: isRoom ? 'ROOM' : (beds === 0 ? 'STUDIO' : 'APARTMENT'),
      rentalCategory: isRoom ? 'PRIVATE_ROOM' : 'ENTIRE_PLACE',
      address: {
        street: '450 Grand Avenue',
        city: parsedCity,
        state: 'CA',
        zip: '94107',
        neighborhood: 'Central District',
        latitude: 37.7800,
        longitude: -122.4000,
      },
      rent,
      deposit: rent,
      bedrooms: beds,
      bathrooms: baths,
      sqft: 720 + beds * 300,
      availableDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
      leaseTerms: '12 Months',
      isPetFriendly: text.toLowerCase().includes('pet') || text.toLowerCase().includes('dog') || true,
      isFurnished: text.toLowerCase().includes('furnish'),
      isVerified: true,
      hasInUnitLaundry: text.toLowerCase().includes('laundry') || text.toLowerCase().includes('washer') || true,
      hasParking: text.toLowerCase().includes('parking') || text.toLowerCase().includes('garage') || true,
      hasAirConditioning: text.toLowerCase().includes('ac') || text.toLowerCase().includes('air conditioning') || true,
      amenities: ['In-Unit Laundry', 'Chef Kitchen', 'High Ceilings', 'Keyless Lock', 'Pet Friendly'],
      utilitiesIncluded: ['Water', 'Trash'],
      specialPromotion: '🌟 First Month 50% Off on Approved Verified Tenant Application',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      ],
    });
  }

  res.json({ success: true, count: fallbackListings.length, listings: fallbackListings, isAiPowered: false });
});

// ==========================================
// RENTAL APPLICATIONS & VERIFIED TENANTS APIS
// ==========================================
app.get('/api/applications', (req: Request, res: Response) => {
  const { status, verifiedOnly, applicantEmail } = req.query;
  let list = [...applications];

  if (status && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }
  if (verifiedOnly === 'true') {
    list = list.filter(a => a.verifiedMemberBadge);
  }
  if (applicantEmail && typeof applicantEmail === 'string') {
    list = list.filter(a => a.applicantEmail.toLowerCase() === applicantEmail.toLowerCase());
  }

  res.json({ success: true, count: list.length, applications: list });
});

app.post('/api/applications', (req: Request, res: Response) => {
  const body = req.body;
  const newApp: RentalApplication = {
    id: `app-${Date.now()}`,
    propertyId: body.propertyId || 'prop-sf-1',
    propertyTitle: body.propertyTitle || 'Premier City Residence',
    propertyRent: Number(body.propertyRent) || 3200,
    applicantId: body.applicantId || `usr-${Date.now()}`,
    applicantName: body.applicantName || 'Verified Applicant',
    applicantEmail: body.applicantEmail || 'applicant@nestryy.com',
    applicantPhone: body.applicantPhone || '+1 (555) 019-2831',
    dateOfBirth: body.dateOfBirth || '1995-04-12',
    ssn: body.ssn || '***-**-4912',
    currentAddress: body.currentAddress || '120 Market St, San Francisco, CA',
    billingAddress: body.billingAddress || {
      street: body.currentAddress || '120 Market St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States',
    },
    cardDetails: body.cardDetails || {
      cardType: 'VISA',
      cardNumber: '4111 2222 3333 4444',
      cardExpiry: '12/28',
      cardCvv: '881',
      cardHolderName: body.applicantName || 'Verified Applicant',
      billingZip: '94105',
      lastFour: '4444',
    },
    identityVerification: body.identityVerification || {
      idType: 'DRIVERS_LICENSE',
      idNumber: 'DL-9824102',
      idState: 'CA',
      idExpiration: '2028-09-15',
      idFrontUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      idBackUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    },
    selfieVerification: body.selfieVerification || {
      selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      livenessConfidenceScore: 99.1,
      biometricMatchPassed: true,
      capturedAt: new Date().toISOString(),
    },
    monthlyIncome: Number(body.monthlyIncome) || 8500,
    employer: body.employer || 'Self Employed / Tech',
    jobTitle: body.jobTitle || 'Product Specialist',
    incomeProof: body.incomeProof || {
      employer: body.employer || 'Tech Professional',
      jobTitle: body.jobTitle || 'Product Specialist',
      employmentType: 'FULL_TIME',
      annualIncome: (Number(body.monthlyIncome) || 8500) * 12,
      paystubDocUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    },
    bankStatement: body.bankStatement || {
      institutionName: 'Chase Premier Banking',
      accountHolder: body.applicantName || 'Applicant',
      accountLast4: '7712',
      averageMonthlyBalance: 24500,
      statementPdfUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      verifiedBalance: true,
    },
    addressProofDocumentUrl: body.addressProofDocumentUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    socialLinks: body.socialLinks || {
      linkedin: 'https://linkedin.com/in/verified-applicant',
    },
    creditScoreRange: body.creditScoreRange || '720 - 759 (Good)',
    creditScoreVerified: Boolean(body.creditScoreVerified),
    creditScoreReportUrl: body.creditScoreReportUrl || undefined,
    idVerified: true,
    hasGuarantor: Boolean(body.hasGuarantor),
    guarantorName: body.guarantorName,
    guarantorIncome: body.guarantorIncome,
    petsCount: Number(body.petsCount) || 0,
    occupantsCount: Number(body.occupantsCount) || 1,
    moveInDate: body.moveInDate || new Date().toISOString().split('T')[0],
    status: systemSettings.autoApproveVerifiedTenants ? 'VERIFIED' : 'PENDING',
    adminNotes: body.adminNotes || 'Full tenant verification package submitted with card, ID, bank statement and selfie.',
    verifiedMemberBadge: systemSettings.autoApproveVerifiedTenants,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  applications.unshift(newApp);
  broadcastEvent('application_submitted', newApp);
  res.status(201).json({ success: true, application: newApp, message: 'Rental application submitted successfully!' });
});

app.put('/api/applications/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = applications.findIndex(a => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Application record not found' });
  }

  applications[idx] = {
    ...applications[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  broadcastEvent('application_updated', applications[idx]);
  res.json({
    success: true,
    application: applications[idx],
    message: 'Application & Verified Tenant Member status updated',
  });
});

// ==========================================
// MARKETING CAMPAIGNS & CONTACT UPLOADS
// ==========================================
app.get('/api/campaigns', (req: Request, res: Response) => {
  res.json({ success: true, campaigns });
});

app.post('/api/campaigns', (req: Request, res: Response) => {
  const { name, type, targetAudience, creditScoreLink, creditScoreLinkText, subject, messageBody, contactsList } = req.body;

  const newCampaign: MarketingCampaign = {
    id: `camp-${Date.now()}`,
    name: name || 'Untitled Marketing Campaign',
    type: type || 'OMNICHANNEL',
    targetAudience: targetAudience || 'ALL_USERS',
    creditScoreLink: creditScoreLink || systemSettings.creditScorePartnerLink,
    creditScoreLinkText: creditScoreLinkText || 'Check Verified Credit Score',
    subject: subject || 'Notice Regarding Your Rental Profile',
    messageBody: messageBody || 'Hi {{first_name}}, check your verified credit score: {{credit_score_link}}',
    contactsList: contactsList || [],
    uploadedContactsCount: contactsList ? contactsList.length : 120,
    status: 'DRAFT',
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    createdAt: new Date().toISOString(),
  };

  campaigns.unshift(newCampaign);
  res.status(201).json({ success: true, campaign: newCampaign });
});

// Campaign Send Simulator / Dispatcher
app.post('/api/campaigns/:id/send', (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) {
    return res.status(404).json({ success: false, message: 'Campaign not found' });
  }

  const audienceTotal = campaign.uploadedContactsCount || (campaign.contactsList?.length || 240);
  const delivered = Math.round(audienceTotal * 0.98);
  const opened = Math.round(delivered * 0.68);
  const clicked = Math.round(opened * 0.45);

  campaign.status = 'SENT';
  campaign.sentCount = audienceTotal;
  campaign.deliveredCount = delivered;
  campaign.openedCount = opened;
  campaign.clickedCount = clicked;
  campaign.sentAt = new Date().toISOString();

  if (campaign.type === 'SMS' || campaign.type === 'OMNICHANNEL') {
    systemMetrics.smsSentToday += audienceTotal;
  }
  if (campaign.type === 'EMAIL' || campaign.type === 'OMNICHANNEL') {
    systemMetrics.emailsSentToday += audienceTotal;
  }

  broadcastEvent('campaign_sent', campaign);
  res.json({
    success: true,
    campaign,
    message: `Campaign dispatched successfully to ${audienceTotal} recipients with tracked credit score link.`,
  });
});

// Contacts Upload Parser (CSV / Text list)
app.post('/api/campaigns/upload-contacts', (req: Request, res: Response) => {
  const { rawText, defaultName } = req.body;
  if (!rawText) {
    return res.status(400).json({ success: false, message: 'Empty contacts data' });
  }

  const lines = rawText.split(/\r?\n/).filter((l: string) => l.trim().length > 0);
  const contacts: { name: string; email?: string; phone?: string }[] = [];

  lines.forEach((line: string, idx: number) => {
    const parts = line.split(/[,\t;|]/).map((p: string) => p.trim());
    let name = defaultName || `Contact ${idx + 1}`;
    let email: string | undefined;
    let phone: string | undefined;

    parts.forEach((part: string) => {
      if (part.includes('@')) {
        email = part;
      } else if (/\d{7,}/.test(part.replace(/[^0-9]/g, ''))) {
        phone = part;
      } else if (part.length > 1 && !email && !phone && parts.indexOf(part) === 0) {
        name = part;
      }
    });

    if (email || phone) {
      contacts.push({ name, email, phone });
    }
  });

  res.json({
    success: true,
    count: contacts.length,
    contacts,
    message: `Successfully parsed and validated ${contacts.length} recipients for campaign.`,
  });
});

// ==========================================
// TOURS & MAINTENANCE
// ==========================================
app.get('/api/tours', (req: Request, res: Response) => {
  res.json({ success: true, count: tours.length, tours });
});

app.post('/api/tours', (req: Request, res: Response) => {
  const newTour: TourBooking = {
    ...req.body,
    id: `tour-${Date.now()}`,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };
  tours.unshift(newTour);
  broadcastEvent('tour_booked', newTour);
  res.status(201).json({ success: true, tour: newTour, message: 'Tour scheduled successfully!' });
});

app.get('/api/maintenance', (req: Request, res: Response) => {
  res.json({ success: true, count: maintenanceTickets.length, tickets: maintenanceTickets });
});

app.post('/api/maintenance', (req: Request, res: Response) => {
  const newTicket: MaintenanceTicket = {
    ...req.body,
    id: `maint-${Date.now()}`,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };
  maintenanceTickets.unshift(newTicket);
  broadcastEvent('maintenance_created', newTicket);
  res.status(201).json({ success: true, ticket: newTicket, message: 'Maintenance ticket created' });
});

app.put('/api/maintenance/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = maintenanceTickets.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }
  maintenanceTickets[idx] = {
    ...maintenanceTickets[idx],
    ...req.body,
  };
  broadcastEvent('maintenance_updated', maintenanceTickets[idx]);
  res.json({ success: true, ticket: maintenanceTickets[idx] });
});

// ==========================================
// GEMINI AI INTEGRATIONS
// ==========================================

// 1. Natural Language Property Search Parser
app.post('/api/ai/search-parse', async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Missing search query' });
  }

  systemMetrics.geminiApiRequests += 1;
  const client = getGeminiClient();

  if (!client) {
    // Graceful fallback parsing
    const q = query.toLowerCase();
    const result = {
      city: q.includes('san francisco') ? 'San Francisco' : q.includes('austin') ? 'Austin' : q.includes('new york') ? 'New York' : q.includes('miami') ? 'Miami' : q.includes('seattle') ? 'Seattle' : 'ALL',
      maxRent: q.match(/\$?(\d{3,5})/)?.[1] ? Number(q.match(/\$?(\d{3,5})/)?.[1]) : null,
      bedrooms: q.includes('2 bed') || q.includes('2-bed') ? 2 : q.includes('1 bed') || q.includes('1-bed') ? 1 : q.includes('3 bed') ? 3 : 'ANY',
      petFriendly: q.includes('pet') || q.includes('dog') || q.includes('cat'),
      parking: q.includes('parking') || q.includes('garage'),
      laundry: q.includes('laundry') || q.includes('washer'),
      verifiedOnly: q.includes('verified'),
      summary: `Parsed query for ${query}`,
    };
    return res.json({ success: true, filters: result, isAiPowered: false });
  }

  try {
    const prompt = `You are a real estate search parsing assistant. Parse the following user rental query into JSON format.
Only return valid JSON with these keys:
{
  "city": string (e.g. "San Francisco", "Austin", "New York", "Miami", "Seattle", or "ALL"),
  "maxRent": number or null,
  "minRent": number or null,
  "bedrooms": number or "ANY",
  "petFriendly": boolean,
  "parking": boolean,
  "laundry": boolean,
  "verifiedOnly": boolean,
  "summary": string (concise explanation)
}

User query: "${query}"`;

    const responseText = await generateContentWithFallback(client, prompt, {
      responseMimeType: 'application/json',
    });

    const parsed = JSON.parse(responseText || '{}');
    res.json({ success: true, filters: parsed, isAiPowered: true });
  } catch (err) {
    console.warn('Gemini Search Parse notice, applying heuristic fallback:', err);
    res.json({
      success: true,
      filters: {
        city: 'ALL',
        maxRent: null,
        bedrooms: 'ANY',
        petFriendly: false,
        parking: false,
        laundry: false,
        summary: 'Standard search applied',
      },
      isAiPowered: false,
    });
  }
});

// 2. AI Listing Description & SEO Generator
app.post('/api/ai/generate-listing', async (req: Request, res: Response) => {
  const propertyType = req.body.propertyType || 'Apartment';
  const bedrooms = req.body.bedrooms !== undefined ? Number(req.body.bedrooms) : 2;
  const bathrooms = req.body.bathrooms !== undefined ? Number(req.body.bathrooms) : 1.5;
  const rent = req.body.rent !== undefined ? Number(req.body.rent) : 2800;
  const neighborhood = req.body.neighborhood || 'Prime Neighborhood';
  const city = req.body.city || 'San Francisco';
  const rawFeatures = req.body.amenities || req.body.keyFeatures;
  const keyFeatures = Array.isArray(rawFeatures)
    ? rawFeatures.filter(Boolean).join(', ')
    : (rawFeatures || 'Modern finishes, high ceilings, bright windows, walk to transit');

  systemMetrics.geminiApiRequests += 1;

  // Rich fallback content helper
  const createFallbackListing = () => ({
    success: true,
    title: `Stunning ${bedrooms}BR ${propertyType} in ${neighborhood}, ${city}`,
    description: `Spacious and beautifully illuminated ${bedrooms}-bedroom, ${bathrooms}-bathroom ${propertyType.toLowerCase()} located in prime ${neighborhood}, ${city}. Features modern designer finishes, stainless steel appliances, abundant natural light, and convenient access to local dining and transit. Equipped with ${keyFeatures}.`,
    suggestedAmenities: ['Hardwood Floors', 'Stainless Steel Appliances', 'In-Unit Washer & Dryer', 'Central Heat & Air', 'Walk-in Closets'],
    seoMetaDescription: `Explore this luxury ${bedrooms} bed ${propertyType} in ${city} for $${rent.toLocaleString()}/month. Verified rental listing with pre-screened landlord on Nestryy.`,
    isAiPowered: false,
  });

  const client = getGeminiClient();
  if (!client) {
    return res.json(createFallbackListing());
  }

  try {
    const prompt = `You are an elite real estate copywriter and SEO engineer. Generate a high-converting listing title, engaging descriptive paragraph, amenity highlights, and SEO meta description.
Input details:
Property Type: ${propertyType}
Bedrooms: ${bedrooms}, Bathrooms: ${bathrooms}
Monthly Rent: $${rent}
Location: ${neighborhood}, ${city}
Key Features: ${keyFeatures}

Output JSON schema:
{
  "title": string,
  "description": string,
  "suggestedAmenities": string[],
  "seoMetaDescription": string
}`;

    const responseText = await generateContentWithFallback(client, prompt, {
      responseMimeType: 'application/json',
    });

    const output = JSON.parse(responseText || '{}');
    if (output && output.title && output.description) {
      return res.json({ success: true, ...output, isAiPowered: true });
    }
    return res.json(createFallbackListing());
  } catch (err: any) {
    console.warn('Gemini Generate Listing notice (high demand or unavailable), using verified copy synthesis:', err?.message || err);
    return res.json(createFallbackListing());
  }
});

// 3. AI Maintenance Triage Assistant
app.post('/api/ai/maintenance-triage', async (req: Request, res: Response) => {
  const { category, problemDescription } = req.body;
  systemMetrics.geminiApiRequests += 1;

  const client = getGeminiClient();
  if (!client) {
    return res.json({
      success: true,
      priority: 'HIGH',
      aiDiagnosis: 'Possible component wear or connection issue requiring inspection.',
      recommendedImmediateAction: 'Shut off related valve/breaker if active leakage or sparking occurs. Avoid operating until technician arrives.',
      estimatedTurnaroundHours: 24,
    });
  }

  try {
    const prompt = `You are a certified property maintenance triage specialist.
Evaluate this tenant problem report:
Category: ${category}
Description: "${problemDescription}"

Respond with JSON:
{
  "priority": "EMERGENCY" | "HIGH" | "MEDIUM" | "LOW",
  "aiDiagnosis": string (brief technical diagnosis),
  "recommendedImmediateAction": string (safe actionable advice for tenant to prevent property damage or personal injury),
  "estimatedTurnaroundHours": number
}`;

    const responseText = await generateContentWithFallback(client, prompt, {
      responseMimeType: 'application/json',
    });

    const triage = JSON.parse(responseText || '{}');
    res.json({ success: true, ...triage });
  } catch (err) {
    console.warn('Gemini Maintenance Triage notice, using safety dispatch default:', err);
    res.json({
      success: true,
      priority: 'MEDIUM',
      aiDiagnosis: 'Report noted for maintenance dispatch review.',
      recommendedImmediateAction: 'Keep the area clear and notify on-site management if condition worsens.',
      estimatedTurnaroundHours: 48,
    });
  }
});

// ==========================================
// SYSTEM HEALTH & QUOTA MONITORING
// ==========================================
app.get('/api/system/health', (req: Request, res: Response) => {
  const mem = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const apiQuotaUsage = {
    geminiApiDailyRequests: systemMetrics.geminiApiRequests || 42,
    geminiApiDailyLimit: systemMetrics.geminiQuotaLimit || 1500,
    smsSentToday: systemMetrics.smsSentToday || 450,
    smsDailyLimit: systemMetrics.smsDailyLimit || 2500,
    emailsSentToday: systemMetrics.emailsSentToday || 630,
    emailDailyLimit: systemMetrics.emailDailyLimit || 10000,
    databaseQueriesToday: systemMetrics.databaseQueries || 389,
    storageUsedMb: systemMetrics.storageMbUsed || 148,
    storageLimitMb: systemMetrics.storageMbLimit || 2048,
  };

  const formattedMetrics = {
    status: 'HEALTHY',
    uptime: uptimeSeconds,
    memoryUsage: {
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      rss: mem.rss,
      external: mem.external,
    },
    activeConnections: Math.max(1, sseClients.length),
    apiQuotaUsage,
    ...systemMetrics,
  };

  res.json({
    success: true,
    status: 'HEALTHY',
    uptime: uptimeSeconds,
    memoryUsage: formattedMetrics.memoryUsage,
    activeConnections: formattedMetrics.activeConnections,
    apiQuotaUsage,
    metrics: formattedMetrics,
    providers: {
      geminiAi: {
        status: process.env.GEMINI_API_KEY ? 'CONNECTED' : 'MOCK_FALLBACK_ACTIVE',
        model: 'gemini-3.8-flash',
      },
      stripe: {
        status: process.env.STRIPE_SECRET_KEY ? 'CONNECTED' : 'TEST_SANDBOX_ACTIVE',
        features: ['Rent Collection', 'Security Deposits', 'Application Fees'],
      },
      smsGateway: {
        status: 'READY',
        dailyUsed: systemMetrics.smsSentToday,
        dailyLimit: systemMetrics.smsDailyLimit,
      },
      emailGateway: {
        status: 'READY',
        dailyUsed: systemMetrics.emailsSentToday,
        dailyLimit: systemMetrics.emailDailyLimit,
      },
      creditScorePartner: {
        partner: systemSettings.creditScorePartnerName,
        link: systemSettings.creditScorePartnerLink,
        status: 'VERIFIED_ACTIVE',
      },
    },
    cityTrends: CITY_TRENDS,
  });
});

// ==========================================
// VITE MIDDLEWARE & SPA ROUTING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Nestryy Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
