import { useEffect } from 'react';
import { User } from '../types';
import { useSupabaseAuth } from './useSupabaseAuth';
import { getSupabaseClient } from '../lib/supabase';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  // Try Supabase first
  const supabaseAuth = useSupabaseAuth();

  // Check if Supabase is working
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl === 'your-supabase-url' || 
            supabaseKey === 'your-supabase-anon-key') {
          console.log('ℹ️ Supabase not configured, using fallback auth');
          return;
        }

        // Test Supabase connection
        const { error } = await getSupabaseClient().from('categories').select('count').limit(2);
        
        if (error) {
          console.log('ℹ️ Supabase connection failed, using fallback auth:', error.message);
        } else {
          console.log('✅ Supabase connection successful');
        }
      } catch (error) {
        console.log('ℹ️ Supabase not available, using fallback auth:', error);
      }
    };

    checkSupabase();
  }, []);

  // Determine current user and auth state
  const currentUser = supabaseAuth.user;
  const isCurrentlyLoading = supabaseAuth.isLoading;

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    login: supabaseAuth.login,
    signUp: supabaseAuth.signUp,
    logout: supabaseAuth.logout,
    hasPermission: supabaseAuth.hasPermission,
    isLoading: isCurrentlyLoading
  };
};