import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Supabase URL (inside getSupabaseClient):', supabaseUrl);
      console.log('Supabase Anon Key (inside getSupabaseClient):', supabaseAnonKey);
      console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
      // Provide a dummy client to prevent crashes, but operations will fail
      return {
        from: () => ({
          select: () => ({
            then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }),
            order: () => ({ then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }) }),
            eq: () => ({ then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }) }),
            limit: () => ({ then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }) }),
            single: () => ({ then: (callback: (data: any) => void) => callback({ data: null, error: new Error('Supabase not configured') }) }),
          }),
          insert: () => ({
            then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }),
            select: () => ({ then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }) }),
          }),
          update: () => ({
            then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }),
            eq: () => ({ then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }) }),
          }),
          upsert: () => ({
            then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }),
          }),
          delete: () => ({
            then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }),
            eq: () => ({ then: (callback: (data: any) => void) => callback({ data: [], error: new Error('Supabase not configured') }) }),
          }),
        }),
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase not configured') }),
          signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
          signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
          signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        // Add other necessary methods with dummy implementations
      } as unknown as SupabaseClient; // Cast to SupabaseClient to satisfy type checking
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};