
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PARTNER = 'PARTNER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum ClaimStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ClaimType {
  HOME = 'HOME',
  AUTO = 'AUTO',
  BUYING_ASSISTANCE = 'BUYING_ASSISTANCE'
}

export enum ClaimPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  photoUrl?: string;
  phone?: string;
  address?: string;
  postcode?: string;
  state?: string;
  regionId?: string;
  referralCode?: string;
  referredBy?: string;
  totalEarned?: number;
  pendingRewards?: number;
  plan?: 'FREE' | 'BASIC' | 'PREMIUM';
}

export interface Warranty {
  id: string;
  userId: string;
  title: string;
  provider: string;
  planName: string;
  startDate: string;
  expirationDate: string;
  isActive: boolean;
  type: 'HOME' | 'AUTO';
  documentUrl?: string;
  createdAt: string;
}

export interface ClaimDocument {
  name: string;
  url: string;
  type: string;
}

export interface Claim {
  id: string;
  userId: string;
  type: ClaimType;
  status: ClaimStatus;
  priority: ClaimPriority;
  title: string;
  description: string;
  amount?: number;
  documents: ClaimDocument[];
  createdAt: string;
  updatedAt: string;
  regionId?: string;
  propertyAddress?: string;
  propertyType?: string;
  isPrimaryResidence?: boolean;
}

// --- CMS Interfaces ---

export interface CMSSection {
  id: string;
  type: 'hero' | 'features' | 'steps' | 'cta' | 'text' | 'image' | 'pricing' | 'faqs';
  title: string;
  subtitle?: string;
  content?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  imageUrl?: string;
  items?: any[]; // Feature items, step items, etc.
  isVisible: boolean;
  order: number;
}

export interface CMSPage {
  slug: string;
  title: string;
  sections: CMSSection[];
  lastUpdated: string;
}

export interface CMSPricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  label?: string; // e.g. "Best Value"
  isActive: boolean;
  order: number;
}

export interface CMSFAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

export interface CMSSEO {
  pageSlug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  keywords?: string;
}

export interface CMSSettings {
  logoUrl: string;
  logoWidth: number;
  footerLogoUrl?: string;
  footerLogoWidth?: number;
  faviconUrl: string;
  phone: string;
  email: string;
  address: string;
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  footerText: string;
  copyrightText: string;
  brandPrimary: string;
}

export interface CMSMedia {
  id: string;
  url: string;
  name: string;
  type: string;
  uploadedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  status: 'DRAFT' | 'PUBLISHED';
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: string;
  name: string;
  partnerId: string;
  location: string;
}
