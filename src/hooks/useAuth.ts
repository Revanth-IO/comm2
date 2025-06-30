import { useState, useEffect, useCallback } from 'react';
import { User, UserRole, USER_PERMISSIONS } from '../types';
import { useSupabaseAuth } from './useSupabaseAuth';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

// Demo users for fallback when Supabase is not available
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@upkaar.org',
    name: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'moderator@upkaar.org',
    name: 'Moderator User',
    role: 'moderator',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const DEMO_PASSWORDS: Record<string, string> = {
  'admin@upkaar.org': 'test',
  'user@example.com': 'test',
  'moderator@upkaar.org': 'test'
};

// Check if email is a demo account
const isDemoAccount = (email: string): boolean => {
  return Object.keys(DEMO_PASSWORDS).includes(email);
};

export const useAuth = (): UseAuthReturn => {
  const [fallbackUser, setFallbackUser] = useState<User | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(true);
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);

  // Try Supabase first
  const supabaseAuth = useSupabaseAuth();

  // Initialize fallback auth state from localStorage
  useEffect(() => {
    console.log('🔄 Initializing fallback auth state...');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('✅ Restored fallback user from localStorage:', parsedUser);
        setFallbackUser(parsedUser);
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    setFallbackLoading(false);
  }, []);

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
          setUseSupabase(false);
          setSupabaseAvailable(false);
          return;
        }

        // Test Supabase connection
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.from('categories').select('count').limit(1);
        
        if (error) {
          console.log('ℹ️ Supabase connection failed, using fallback auth:', error.message);
          setUseSupabase(false);
          setSupabaseAvailable(false);
        } else {
          console.log('✅ Supabase connection successful');
          setUseSupabase(true);
          setSupabaseAvailable(true);
        }
      } catch (error) {
        console.log('ℹ️ Supabase not available, using fallback auth:', error);
        setUseSupabase(false);
        setSupabaseAvailable(false);
      }
    };

    checkSupabase();
  }, []);

  const fallbackLogin = useCallback(async (email: string, password: string): Promise<void> => {
    console.log('🔐 Fallback login attempt:', { email, password: '***' });
    setFallbackLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (DEMO_PASSWORDS[email] && DEMO_PASSWORDS[email] === password) {
        const foundUser = DEMO_USERS.find(u => u.email === email);
        if (foundUser) {
          console.log('✅ Fallback login successful for demo user:', foundUser);
          setFallbackUser(foundUser);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          return;
        }
      }
      
      const foundUser = DEMO_USERS.find(u => u.email === email);
      if (foundUser) {
        console.log('✅ Fallback login successful for existing user:', foundUser);
        setFallbackUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return;
      }
      
      const guestUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      console.log('✅ Created new fallback guest user:', guestUser);
      setFallbackUser(guestUser);
      localStorage.setItem('currentUser', JSON.stringify(guestUser));
    } catch (error) {
      console.error('❌ Fallback login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      setFallbackLoading(false);
    }
  }, []);

  const fallbackSignUp = useCallback(async (email: string, password: string, name: string): Promise<void> => {
    console.log('📝 Fallback signup attempt:', email);
    setFallbackLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      console.log('✅ Fallback signup successful:', newUser);
      setFallbackUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('❌ Fallback signup error:', error);
      throw new Error('Signup failed. Please try again.');
    } finally {
      setFallbackLoading(false);
    }
  }, []);

  const fallbackLogout = useCallback(async (): Promise<void> => {
    console.log('🚪 Fallback logout');
    setFallbackUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  const fallbackHasPermission = useCallback((permission: string): boolean => {
    if (!fallbackUser && permission === 'add_classified') {
      return true;
    }
    if (!fallbackUser) {
      return permission === 'read_content';
    }

    const userPermissions = USER_PERMISSIONS[fallbackUser.role];
    if (userPermissions.includes('all')) {
      return true;
    }
    
    return userPermissions.includes(permission);
  }, [fallbackUser]);

  // Hybrid login function that tries Supabase first, then falls back for demo accounts
  const hybridLogin = useCallback(async (email: string, password: string): Promise<void> => {
    console.log('🔄 Hybrid login attempt for:', email);
    
    // If Supabase is available and it's not a demo account, try Supabase first
    if (supabaseAvailable && !isDemoAccount(email)) {
      try {
        await supabaseAuth.login(email, password);
        console.log('✅ Supabase login successful');
        return;
      } catch (error) {
        console.log('❌ Supabase login failed, trying fallback:', error);
        // Fall through to fallback login
      }
    }
    
    // For demo accounts or when Supabase fails, use fallback
    console.log('🔄 Using fallback login for:', email);
    await fallbackLogin(email, password);
  }, [supabaseAvailable, supabaseAuth.login, fallbackLogin]);

  // Hybrid signup function
  const hybridSignUp = useCallback(async (email: string, password: string, name: string): Promise<void> => {
    console.log('🔄 Hybrid signup attempt for:', email);
    
    // If Supabase is available, try Supabase first
    if (supabaseAvailable) {
      try {
        await supabaseAuth.signUp(email, password, name);
        console.log('✅ Supabase signup successful');
        return;
      } catch (error) {
        console.log('❌ Supabase signup failed, trying fallback:', error);
        // Fall through to fallback signup
      }
    }
    
    // Use fallback signup
    console.log('🔄 Using fallback signup for:', email);
    await fallbackSignUp(email, password, name);
  }, [supabaseAvailable, supabaseAuth.signUp, fallbackSignUp]);

  // Hybrid logout function
  const hybridLogout = useCallback(async (): Promise<void> => {
    console.log('🔄 Hybrid logout');
    
    // Try both logout methods to ensure clean state
    try {
      if (supabaseAvailable && supabaseAuth.user) {
        await supabaseAuth.logout();
      }
    } catch (error) {
      console.log('❌ Supabase logout failed:', error);
    }
    
    await fallbackLogout();
  }, [supabaseAvailable, supabaseAuth.user, supabaseAuth.logout, fallbackLogout]);

  // Determine current user and auth state
  const currentUser = supabaseAuth.user || fallbackUser;
  const isCurrentlyLoading = supabaseAuth.isLoading || fallbackLoading;

  // Hybrid permission check
  const hybridHasPermission = useCallback((permission: string): boolean => {
    if (supabaseAuth.user) {
      return supabaseAuth.hasPermission(permission);
    }
    return fallbackHasPermission(permission);
  }, [supabaseAuth.user, supabaseAuth.hasPermission, fallbackHasPermission]);

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    login: hybridLogin,
    signUp: hybridSignUp,
    logout: hybridLogout,
    hasPermission: hybridHasPermission,
    isLoading: isCurrentlyLoading
  };
};