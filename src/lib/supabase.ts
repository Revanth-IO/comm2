import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          location: string | null
          role: string
          is_active: boolean
          avatar_url: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          role?: string
          is_active?: boolean
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          role?: string
          is_active?: boolean
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
        }
      }
      classified_ads: {
        Row: {
          id: string
          title: string
          description: string
          category_id: number | null
          subcategory: string | null
          price: number | null
          location: string
          contact_name: string
          contact_email: string
          contact_phone: string | null
          images: string[]
          status: string
          author_id: string | null
          author_name: string
          featured: boolean
          rejection_reason: string | null
          views: number
          created_at: string
          updated_at: string
          expires_at: string
        }
        Insert: {
          title: string
          description: string
          category_id?: number | null
          subcategory?: string | null
          price?: number | null
          location: string
          contact_name: string
          contact_email: string
          contact_phone?: string | null
          images?: string[]
          status?: string
          author_id?: string | null
          author_name: string
          featured?: boolean
          rejection_reason?: string | null
          views?: number
        }
        Update: {
          title?: string
          description?: string
          category_id?: number | null
          subcategory?: string | null
          price?: number | null
          location?: string
          contact_name?: string
          contact_email?: string
          contact_phone?: string | null
          images?: string[]
          status?: string
          author_id?: string | null
          author_name?: string
          featured?: boolean
          rejection_reason?: string | null
          views?: number
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          type: string
          subcategories: string[]
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          name: string
          type: string
          subcategories?: string[]
          icon?: string | null
          color?: string | null
        }
        Update: {
          name?: string
          type?: string
          subcategories?: string[]
          icon?: string | null
          color?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          event_date: string
          event_time: string
          location: string
          category_id: number | null
          organizer: string
          contact_name: string
          contact_email: string
          contact_phone: string | null
          image_url: string | null
          max_attendees: number | null
          current_attendees: number
          registration_required: boolean
          registration_url: string | null
          status: string
          author_id: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description: string
          event_date: string
          event_time: string
          location: string
          category_id?: number | null
          organizer: string
          contact_name: string
          contact_email: string
          contact_phone?: string | null
          image_url?: string | null
          max_attendees?: number | null
          current_attendees?: number
          registration_required?: boolean
          registration_url?: string | null
          status?: string
          author_id?: string | null
          featured?: boolean
        }
        Update: {
          title?: string
          description?: string
          event_date?: string
          event_time?: string
          location?: string
          category_id?: number | null
          organizer?: string
          contact_name?: string
          contact_email?: string
          contact_phone?: string | null
          image_url?: string | null
          max_attendees?: number | null
          current_attendees?: number
          registration_required?: boolean
          registration_url?: string | null
          status?: string
          author_id?: string | null
          featured?: boolean
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          description: string
          category_id: number | null
          address: string
          phone: string
          email: string
          website: string | null
          hours: string | null
          image_url: string | null
          rating: number
          review_count: number
          status: string
          author_id: string | null
          featured: boolean
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description: string
          category_id?: number | null
          address: string
          phone: string
          email: string
          website?: string | null
          hours?: string | null
          image_url?: string | null
          rating?: number
          review_count?: number
          status?: string
          author_id?: string | null
          featured?: boolean
          verified?: boolean
        }
        Update: {
          name?: string
          description?: string
          category_id?: number | null
          address?: string
          phone?: string
          email?: string
          website?: string | null
          hours?: string | null
          image_url?: string | null
          rating?: number
          review_count?: number
          status?: string
          author_id?: string | null
          featured?: boolean
          verified?: boolean
        }
      }
      feedback: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          feedback_type: string
          priority: string
          page_url: string | null
          browser_info: string | null
          allow_contact: boolean
          status: string
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          subject: string
          message: string
          feedback_type: string
          priority?: string
          page_url?: string | null
          browser_info?: string | null
          allow_contact?: boolean
          status?: string
          assigned_to?: string | null
        }
        Update: {
          name?: string
          email?: string
          subject?: string
          message?: string
          feedback_type?: string
          priority?: string
          page_url?: string | null
          browser_info?: string | null
          allow_contact?: boolean
          status?: string
          assigned_to?: string | null
        }
      }
    }
  }
}