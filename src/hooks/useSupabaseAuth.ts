import { useState, useEffect, useCallback } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface UseSupabaseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const USER_PERMISSIONS = {
  guest: ['read_content', 'add_classified'],
  user: ['read_content', 'add_classified'],
  vendor: ['read_content', 'add_classified', 'add_event', 'add_business'],
  content_manager: ['read_content', 'add_classified', 'add_event', 'add_business', 'approve_content'],
  moderator: ['read_content', 'add_classified', 'add_event', 'add_business', 'approve_content', 'reject_content', 'remove_comments'],
  admin: ['read_content', 'add_classified', 'add_event', 'add_business', 'approve_content', 'reject_content', 'remove_comments', 'manage_roles', 'add_categories', 'ban_users'],
  super_admin: ['all']
} as const;

export const useSupabaseAuth = (): UseSupabaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our User type
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    // Get user profile from our user_profiles table
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user profile:', error);
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      role: (profile?.role as UserRole) || 'user',
      isActive: profile?.is_active ?? true,
      createdAt: supabaseUser.created_at,
      picture: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url
    };
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 Initializing Supabase auth...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        console.log('✅ Found existing session:', session.user.email);
        convertSupabaseUser(session.user).then(setUser);
      } else {
        console.log('ℹ️ No existing session found');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const convertedUser = await convertSupabaseUser(session.user);
          setUser(convertedUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    console.log('🔐 Attempting login with Supabase:', email);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('✅ Login successful:', data.user.email);
        const convertedUser = await convertSupabaseUser(data.user);
        setUser(convertedUser);
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<void> => {
    console.log('📝 Attempting signup with Supabase:', email);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('✅ Signup successful:', data.user.email);
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            full_name: name,
            role: 'user'
          });

        if (profileError) {
          console.error('❌ Error creating user profile:', profileError);
          // Don't throw here as the user was created successfully
        }

        const convertedUser = await convertSupabaseUser(data.user);
        setUser(convertedUser);
      }
    } catch (error) {
      console.error('❌ Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    console.log('🚪 Logging out from Supabase');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Logout error:', error);
        throw new Error(error.message);
      }
      
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) {
      return permission === 'read_content' || permission === 'add_classified';
    }

    const userPermissions = USER_PERMISSIONS[user.role];
    if (userPermissions.includes('all')) {
      return true;
    }
    
    return userPermissions.includes(permission);
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signUp,
    logout,
    hasPermission
  };
};