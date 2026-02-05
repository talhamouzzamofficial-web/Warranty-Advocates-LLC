
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PARTNER = 'PARTNER'
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
  BUYING_ASSISTANCE = 'BUYING_ASSISTANCE',
  RENOVATION = 'RENOVATION'
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
  territoryId?: string;
  referralCode?: string;
  referredBy?: string;
  totalEarned?: number;
  pendingRewards?: number;
  plan?: 'FREE' | 'PREMIUM';
}

export interface Warranty {
  id: string;
  userId: string;
  title: string;
  provider: string;
  expirationDate: string;
  type: 'HOME' | 'AUTO';
  documentUrl?: string;
  createdAt: string;
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
  documents: string[];
  createdAt: string;
  updatedAt: string;
  territoryId?: string;
}

export interface Territory {
  id: string;
  name: string;
  partnerId: string;
  location: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  completed: boolean;
}