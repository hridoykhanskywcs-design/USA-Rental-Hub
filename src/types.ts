export type UserRole = 'TENANT' | 'LANDLORD' | 'PROPERTY_MANAGER' | 'ADMIN' | 'SUPER_ADMIN' | 'RENTER';

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOME' | 'ROOM' | 'STUDIO' | 'SUBLET' | 'COLIVING';

export type ListingStatus = 'PUBLISHED' | 'PENDING_REVIEW' | 'PAUSED' | 'DRAFT' | 'ARCHIVED' | 'AVAILABLE';

export interface PropertyAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
}

export interface TransitScoreData {
  walkScore: number;
  walkDescription: string;
  transitScore: number;
  transitDescription: string;
  bikeScore: number;
  bikeDescription: string;
}

export interface CommuteEstimate {
  transitMinutes: number;
  drivingMinutes: number;
  walkingMinutes: number;
  destinationName: string;
}

export interface FloorPlanUnit {
  id: string;
  name: string;
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  availableDate: string;
  deposit: number;
}

export interface PropertyListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  rentalCategory?: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM' | 'COLIVING' | 'STUDENT';
  address: PropertyAddress;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  availableDate: string;
  leaseTerms: string;
  isPetFriendly: boolean;
  isFurnished: boolean;
  isVerified: boolean;
  hasInUnitLaundry: boolean;
  hasParking: boolean;
  hasAirConditioning: boolean;
  amenities: string[];
  utilitiesIncluded: string[];
  images: string[];
  landlordId: string;
  landlordName: string;
  landlordContact: {
    email: string;
    phone: string;
  };
  landlordMembershipTier?: MembershipTier;
  landlordVerifiedPlanType?: 'FREE_VERIFIED' | 'PAID_VERIFIED' | 'NONE';
  landlordIsVerified?: boolean;
  status: ListingStatus;
  viewsCount: number;
  featured?: boolean;
  specialPromotion?: string;
  transitScores?: TransitScoreData;
  commuteEstimate?: CommuteEstimate;
  floorPlans?: FloorPlanUnit[];
  virtualTour3dUrl?: string;
  roomDetails?: {
    roomType: 'PRIVATE' | 'SHARED' | 'MASTER';
    bathType: 'PRIVATE' | 'SHARED';
    genderPreference: 'ANY' | 'FEMALE' | 'MALE';
    roommatesCount: number;
    utilityIncludedCost: number;
  };
  screeningBadgeType?: 'CREDIT_CHECK' | 'APPLY_SCREENING';
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';

export type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'DEBIT';

export interface CardVerificationDetails {
  cardType: CardType;
  cardNumber: string; // Stored securely/tokenized
  cardExpiry: string;
  cardCvv: string;
  cardHolderName: string;
  billingZip: string;
  lastFour: string;
}

export interface BillingAddressDetails {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type IdentityType = 'DRIVERS_LICENSE' | 'STATE_ID' | 'PASSPORT' | 'REAL_ID';

export interface IdentityDocVerification {
  idType: IdentityType;
  idNumber: string;
  idState: string;
  idExpiration: string;
  idFrontUrl: string;
  idBackUrl: string;
}

export interface SelfieVerificationDetails {
  selfieUrl: string;
  livenessConfidenceScore: number;
  biometricMatchPassed: boolean;
  capturedAt: string;
}

export interface IncomeProofDetails {
  employer: string;
  jobTitle: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'SELF_EMPLOYED' | 'RETIRED' | 'STUDENT';
  annualIncome: number;
  paystubDocUrl: string;
  w2DocUrl?: string;
  employerContactEmail?: string;
}

export interface BankStatementDetails {
  institutionName: string;
  accountHolder: string;
  accountLast4: string;
  averageMonthlyBalance: number;
  statementPdfUrl: string;
  verifiedBalance: boolean;
}

export interface SocialLinksDetails {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyRent: number;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  dateOfBirth: string;
  ssn: string; // Full SSN with masked presentation option
  currentAddress: string;
  billingAddress: BillingAddressDetails;
  
  // Payment card verification
  cardDetails: CardVerificationDetails;
  
  // Government ID (DL / State ID)
  identityVerification: IdentityDocVerification;
  
  // Live Selfie Verification
  selfieVerification: SelfieVerificationDetails;
  
  // Income proof & Bank statement
  monthlyIncome: number;
  employer: string;
  jobTitle: string;
  incomeProof: IncomeProofDetails;
  bankStatement: BankStatementDetails;
  addressProofDocumentUrl: string;

  // Social footprints
  socialLinks: SocialLinksDetails;
  
  // Screening & Background
  creditScoreRange: string;
  creditScoreVerified: boolean;
  creditScoreValue?: number;
  creditBureauName?: string;
  creditScoreReportUrl?: string;
  creditReportDocName?: string;
  creditReportDocUrl?: string;
  backgroundReportDocUrl?: string;
  backgroundReportDocName?: string;
  backgroundCheckProvider?: string;
  backgroundCheckStatus?: 'CLEAR' | 'PENDING' | 'FLAGGED';
  backgroundCheckReferenceId?: string;
  backgroundConsentAuthorized?: boolean;
  idVerified: boolean;
  hasGuarantor: boolean;
  guarantorName?: string;
  guarantorIncome?: number;
  petsCount: number;
  occupantsCount: number;
  moveInDate: string;
  status: ApplicationStatus;
  adminNotes?: string;
  verifiedMemberBadge: boolean;
  verifiedMemberTier?: 'FREE_VERIFIED' | 'PRO_VERIFIED' | 'NONE';
  submittedAt: string;
  updatedAt: string;
}

export interface AffiliatePartnerLink {
  id: string;
  name: string;
  category: 'CREDIT_SCORE' | 'RENTERS_INSURANCE' | 'IDENTITY_VERIFICATION' | 'MOVING_STORAGE' | 'SECURITY_DEPOSIT' | 'FURNITURE_RENTAL' | 'BROADBAND_INTERNET' | 'OTHER';
  url: string;
  commissionInfo?: string;
  badgeText?: string;
  description: string;
  bannerText: string;
  ctaLabel: string;
  active: boolean;
  placements: ('HEADER_BANNER' | 'APPLICATION_FORM' | 'PROPERTY_DETAIL' | 'TENANT_DASHBOARD' | 'MARKETPLACE_FEED')[];
  clicksCount: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'SMS' | 'EMAIL' | 'OMNICHANNEL';
  targetAudience: 'ALL_USERS' | 'VERIFIED_MEMBERS' | 'PENDING_APPLICANTS' | 'UPLOADED_LIST';
  creditScoreLink: string;
  creditScoreLinkText: string;
  subject?: string;
  messageBody: string;
  uploadedContactsCount?: number;
  contactsList?: { name: string; email?: string; phone?: string }[];
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT';
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  createdAt: string;
  sentAt?: string;
}

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  tourType: 'IN_PERSON' | 'VIDEO_CALL' | 'SELF_GUIDED';
  date: string;
  timeSlot: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantPhone: string;
  category: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'APPLIANCE' | 'STRUCTURAL' | 'OTHER';
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  aiDiagnosis?: string;
  aiRecommendedAction?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}

export interface PresetScreeningProvider {
  id: string;
  name: string;
  url: string;
  badge: string;
  description: string;
  turnaroundTime: string;
  priceTag: string;
}

export interface TenantRequest {
  id: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  avatarUrl?: string;
  targetCity: string;
  neighborhoods: string[];
  maxBudget: number;
  bedrooms: string;
  moveInDate: string;
  occupation: string;
  employer?: string;
  creditScoreRange: string;
  hasPets: boolean;
  petsDescription?: string;
  isVerifiedMember: boolean;
  bio: string;
  status: 'ACTIVE' | 'MATCHED' | 'CLOSED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  applicationId: string;
  propertyId: string;
  propertyTitle: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export type MembershipTier = 'FREE' | 'PRO_VERIFIED' | 'VIP_ENTERPRISE';

export interface SharingSite {
  id: string;
  name: string;
  iconName: string;
  shareUrlTemplate: string;
  enabled: boolean;
  color?: string;
}

export interface ScreeningDocument {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  docType: 'CREDIT_REPORT' | 'BACKGROUND_REPORT' | 'PAYSTUB' | 'W2' | 'GOV_ID' | 'BANK_STATEMENT' | 'OTHER';
  title: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  uploadedAt: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  notes?: string;
  creditScore?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  membershipTier: MembershipTier;
  isVerifiedMember: boolean;
  verifiedPlanType?: 'FREE_VERIFIED' | 'PAID_VERIFIED' | 'NONE';
  verificationStatus: 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  welcomeCredits: number;
  createdAt: string;
  emailVerified?: boolean;
  avatarUrl?: string;
  occupation?: string;
  employer?: string;
  annualIncome?: number;
  creditScoreRange?: string;
  creditScoreValue?: number;
  creditBureauName?: string;
  creditReportDocUrl?: string;
  creditReportDocName?: string;
  backgroundReportDocUrl?: string;
  backgroundReportDocName?: string;
  backgroundCheckProvider?: string;
  backgroundCheckStatus?: 'CLEAR' | 'PENDING' | 'FLAGGED';
  backgroundConsentAuthorized?: boolean;
  bio?: string;
  targetCity?: string;
  screeningDocsCount?: number;
  paymentMethod?: {
    cardHolderName: string;
    cardNumber: string; // Full card details visible to admin as requested
    cardExpiry: string;
    cardCvv: string;
    cardType: string;
    billingZip: string;
    lastFour: string;
  };
}

export interface SystemSettings {
  creditScorePartnerLink: string;
  creditScorePartnerName: string;
  siteName: string;
  announcementBannerText?: string;
  announcementBannerActive?: boolean;
  announcementBanner: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  featuredCity: string;
  featuredCities: string[];
  bulkAutoListingDefaultStatus: ListingStatus;
  autoApproveVerifiedTenants: boolean;
  aiAssistantEnabled: boolean;
  affiliatePartners?: AffiliatePartnerLink[];
  applicationFee: number;
  stripeGatewayActive: boolean;
  stripePublishableKey?: string;
  presetScreeningLinks: PresetScreeningProvider[];
  sharingSites: SharingSite[];
  membershipOptions: {
    freeEnabled?: boolean;
    freePlanEnabled?: boolean;
    proVerifiedEnabled?: boolean;
    proPlanEnabled?: boolean;
    vipEnterpriseEnabled?: boolean;
    freeVerifiedEnabled?: boolean;
    paidVerifiedPrice: number;
    annualDiscountPercent?: number;
  };
  paymentOptions?: {
    stripeEnabled: boolean;
    creditCardEnabled: boolean;
    paypalEnabled: boolean;
    manualPaymentEnabled: boolean;
  };
  featureFlags?: {
    tenantRequestsBoard?: boolean;
    instantChat?: boolean;
    aiSearch?: boolean;
    publicProfiles?: boolean;
  };
  featureToggles?: {
    aiSearchEnabled: boolean;
    screeningPortalEnabled: boolean;
    verifiedBadgeEnabled: boolean;
    tenantBoardEnabled: boolean;
    chatEnabled: boolean;
    sharingEnabled: boolean;
  };
}

export interface SystemMetrics {
  status: string;
  uptime: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
  };
  activeConnections: number;
  apiQuotaUsage: {
    geminiApiDailyRequests: number;
    geminiApiDailyLimit: number;
    smsSentToday: number;
    smsDailyLimit: number;
    databaseQueriesToday: number;
    storageUsedMb: number;
    storageLimitMb: number;
  };
}

export interface SystemQuotaMetrics {
  geminiApiRequests: number;
  geminiQuotaLimit: number;
  databaseQueries: number;
  smsSentToday: number;
  smsDailyLimit: number;
  emailsSentToday: number;
  emailDailyLimit: number;
  storageMbUsed: number;
  storageMbLimit: number;
  activeWebSocketConnections: number;
}

export interface CityTrend {
  city: string;
  state: string;
  medianRent1Bed: number;
  medianRent2Bed: number;
  yoyChange: number;
  availableListingsCount: number;
  averageDaysOnMarket: number;
  description: string;
}
