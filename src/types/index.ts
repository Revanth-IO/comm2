export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  picture?: string;
}

export type UserRole = 'guest' | 'user' | 'vendor' | 'content_manager' | 'moderator' | 'admin' | 'super_admin';

export interface ClassifiedAd {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  price?: number;
  location: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  rejectionReason?: string;
  featured: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  authorId: string;
  createdAt: string;
  maxAttendees?: number;
  registrationRequired: boolean;
  featured: boolean;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  hours: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  authorId: string;
  createdAt: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'classified' | 'event' | 'business';
  subcategories: string[];
  icon: string;
  color: string;
}

// Updated permissions to allow guest posting
export const USER_PERMISSIONS = {
  guest: ['read_content', 'add_classified'], // Guests can now post classifieds
  user: ['read_content', 'add_classified'],
  vendor: ['read_content', 'add_classified', 'add_event', 'add_business'],
  content_manager: ['read_content', 'add_classified', 'add_event', 'add_business', 'approve_content'],
  moderator: ['read_content', 'add_classified', 'add_event', 'add_business', 'approve_content', 'reject_content', 'remove_comments'],
  admin: ['read_content', 'add_classified', 'add_event', 'add_business', 'approve_content', 'reject_content', 'remove_comments', 'manage_roles', 'add_categories', 'ban_users'],
  super_admin: ['all']
} as const;

export type Permission = 
  | 'read_content'
  | 'add_classified'
  | 'add_event'
  | 'add_business'
  | 'approve_content'
  | 'reject_content'
  | 'remove_comments'
  | 'manage_roles'
  | 'add_categories'
  | 'ban_users'
  | 'all';