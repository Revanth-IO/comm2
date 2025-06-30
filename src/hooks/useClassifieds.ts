import { useState, useEffect, useCallback } from 'react';
import { ClassifiedAd } from '../types';

interface CreateClassifiedData {
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
}

export const useClassifieds = () => {
  const [classifieds, setClassifieds] = useState<ClassifiedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Mock data fallback with valid UUIDs
  const mockClassifieds: ClassifiedAd[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'iPhone 14 Pro Max - Excellent Condition',
      description: 'Barely used iPhone 14 Pro Max, 256GB, Space Black. Includes original box, charger, and screen protector. No scratches or damage.',
      category: 'For Sale',
      subcategory: 'Electronics',
      price: 899,
      location: 'Edison, NJ',
      contactInfo: {
        name: 'Raj Patel',
        email: 'raj.patel@email.com',
        phone: '(732) 555-0123'
      },
      images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'approved',
      authorId: '550e8400-e29b-41d4-a716-446655440011',
      authorName: 'Raj Patel',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      expiresAt: '2024-02-15T10:00:00Z',
      featured: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: '2BR Apartment for Rent - Jersey City',
      description: 'Beautiful 2-bedroom apartment in prime Jersey City location. Close to PATH train, grocery stores, and restaurants. Parking included.',
      category: 'Housing',
      subcategory: 'Apartments for Rent',
      price: 2800,
      location: 'Jersey City, NJ',
      contactInfo: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '(201) 555-0456'
      },
      images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'approved',
      authorId: '550e8400-e29b-41d4-a716-446655440012',
      authorName: 'Priya Sharma',
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      expiresAt: '2024-02-14T15:30:00Z',
      featured: false
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Math Tutoring Services - All Levels',
      description: 'Experienced math tutor offering personalized lessons for students from elementary to college level. Specializing in SAT/ACT prep.',
      category: 'Services',
      subcategory: 'Tutoring',
      price: 50,
      location: 'Princeton, NJ',
      contactInfo: {
        name: 'Dr. Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '(609) 555-0789'
      },
      images: ['https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'approved',
      authorId: '550e8400-e29b-41d4-a716-446655440013',
      authorName: 'Dr. Amit Kumar',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      expiresAt: '2024-02-13T09:15:00Z',
      featured: false
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Software Engineer Position - Remote',
      description: 'Looking for experienced React developer for remote position. Competitive salary and benefits.',
      category: 'Jobs',
      subcategory: 'Full-time',
      location: 'Remote',
      contactInfo: {
        name: 'HR Team',
        email: 'hr@techcompany.com',
        phone: '(555) 123-4567'
      },
      images: ['https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'pending',
      authorId: '550e8400-e29b-41d4-a716-446655440014',
      authorName: 'HR Team',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      expiresAt: '2024-02-16T14:20:00Z',
      featured: false
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      title: 'Wedding Photography Services',
      description: 'Professional wedding photographer with 10+ years experience. Packages starting from $1500.',
      category: 'Services',
      subcategory: 'Photography',
      price: 1500,
      location: 'Philadelphia, PA',
      contactInfo: {
        name: 'Sarah Johnson',
        email: 'sarah@photography.com',
        phone: '(215) 555-9876'
      },
      images: ['https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'pending',
      authorId: '550e8400-e29b-41d4-a716-446655440015',
      authorName: 'Sarah Johnson',
      createdAt: '2024-01-17T11:45:00Z',
      updatedAt: '2024-01-17T11:45:00Z',
      expiresAt: '2024-02-17T11:45:00Z',
      featured: false
    }
  ];

  // Storage key for persisted changes
  const STORAGE_KEY = 'upkaar_classified_changes';

  // Load persisted approvals/rejections from localStorage
  const loadPersistedChanges = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      console.log('📂 Loaded persisted changes:', parsed);
      return parsed;
    } catch (error) {
      console.warn('⚠️ Failed to load persisted changes:', error);
      return {};
    }
  }, []);

  // Save approval/rejection changes to localStorage
  const savePersistedChanges = useCallback((changes: Record<string, { status: string; rejectionReason?: string; timestamp: number }>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
      console.log('💾 Saved persisted changes:', changes);
    } catch (error) {
      console.warn('⚠️ Failed to save changes to localStorage:', error);
    }
  }, []);

  // Apply persisted changes to classifieds data
  const applyPersistedChanges = useCallback((data: ClassifiedAd[]) => {
    const persistedChanges = loadPersistedChanges();
    
    return data.map(ad => {
      const change = persistedChanges[ad.id];
      if (change) {
        console.log(`🔄 Applying persisted change to ${ad.id}:`, change);
        return {
          ...ad,
          status: change.status as any,
          rejectionReason: change.rejectionReason,
          updatedAt: new Date(change.timestamp).toISOString()
        };
      }
      return ad;
    });
  }, [loadPersistedChanges]);

  const fetchClassifieds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('🔄 Server-side rendering, using mock data');
        setClassifieds(mockClassifieds);
        setIsLoading(false);
        return;
      }

      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseUrl === 'your-supabase-url' ||
          supabaseKey === 'your-supabase-anon-key') {
        console.log('🔄 Supabase not configured, using mock data with persisted changes');
        
        const updatedMockData = applyPersistedChanges(mockClassifieds);
        setClassifieds(updatedMockData);
        setIsLoading(false);
        return;
      }

      console.log('🔄 Fetching classifieds from Supabase...');
      
      // Dynamic import to avoid SSR issues
      const { supabase } = await import('../lib/supabase');
      
      const { data, error: supabaseError } = await supabase
        .from('classified_ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError);
        console.log('🔄 Falling back to mock data with persisted changes');
        
        const updatedMockData = applyPersistedChanges(mockClassifieds);
        setClassifieds(updatedMockData);
      } else {
        console.log('✅ Fetched classifieds from Supabase:', data?.length || 0);
        
        if (data && data.length > 0) {
          const transformedData: ClassifiedAd[] = data.map(item => ({
            id: item.id,
            title: item.title || 'Untitled',
            description: item.description || '',
            category: item.category || 'General',
            subcategory: item.subcategory,
            price: item.price,
            location: item.location || 'Location not specified',
            contactInfo: {
              name: item.contact_name || 'Contact',
              email: item.contact_email || 'email@example.com',
              phone: item.contact_phone
            },
            images: Array.isArray(item.images) ? item.images : [],
            status: item.status || 'pending',
            authorId: item.author_id || 'unknown',
            authorName: item.author_name || item.contact_name || 'Unknown',
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
            expiresAt: item.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            featured: Boolean(item.featured),
            rejectionReason: item.rejection_reason
          }));
          
          // Combine Supabase data with mock data (with persisted changes applied)
          const updatedMockData = applyPersistedChanges(mockClassifieds);
          setClassifieds([...transformedData, ...updatedMockData]);
        } else {
          console.log('🔄 No data in Supabase, using mock data with persisted changes');
          const updatedMockData = applyPersistedChanges(mockClassifieds);
          setClassifieds(updatedMockData);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching classifieds:', error);
      console.log('🔄 Using mock data with persisted changes due to error');
      
      const updatedMockData = applyPersistedChanges(mockClassifieds);
      setClassifieds(updatedMockData);
      setError(null);
    } finally {
      setIsLoading(false);
      setLastUpdate(Date.now());
    }
  }, [applyPersistedChanges]);

  const createClassified = async (data: CreateClassifiedData): Promise<void> => {
    try {
      setError(null);

      // Check if Supabase is available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseUrl === 'your-supabase-url' ||
          supabaseKey === 'your-supabase-anon-key') {
        
        // Create mock classified for local state
        const newClassified: ClassifiedAd = {
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          price: data.price,
          location: data.location,
          contactInfo: data.contactInfo,
          images: data.images,
          status: 'pending',
          authorId: crypto.randomUUID(),
          authorName: data.contactInfo.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          featured: false
        };

        setClassifieds(prev => [newClassified, ...prev]);
        setLastUpdate(Date.now());
        console.log('✅ Created classified locally (mock mode)');
        return;
      }

      // Try to create in Supabase
      try {
        const { supabase } = await import('../lib/supabase');
        
        const { data: result, error } = await supabase
          .from('classified_ads')
          .insert({
            title: data.title,
            description: data.description,
            category: data.category,
            subcategory: data.subcategory,
            price: data.price,
            location: data.location,
            contact_name: data.contactInfo.name,
            contact_email: data.contactInfo.email,
            contact_phone: data.contactInfo.phone,
            images: data.images,
            status: 'pending',
            author_name: data.contactInfo.name
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log('✅ Created classified in Supabase');
        await fetchClassifieds(); // Refresh the list
      } catch (supabaseError) {
        console.error('❌ Supabase creation failed:', supabaseError);
        
        // Fall back to local creation
        const newClassified: ClassifiedAd = {
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          price: data.price,
          location: data.location,
          contactInfo: data.contactInfo,
          images: data.images,
          status: 'pending',
          authorId: crypto.randomUUID(),
          authorName: data.contactInfo.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          featured: false
        };

        setClassifieds(prev => [newClassified, ...prev]);
        setLastUpdate(Date.now());
        console.log('✅ Created classified locally (fallback)');
      }
    } catch (error) {
      console.error('❌ Error creating classified:', error);
      throw new Error('Failed to create classified ad');
    }
  };

  const approveClassified = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 Approving classified:', id);

      const timestamp = Date.now();
      let supabaseSuccess = false;

      // Try Supabase first
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey && 
            supabaseUrl !== 'https://placeholder.supabase.co' &&
            supabaseUrl !== 'your-supabase-url' &&
            supabaseKey !== 'your-supabase-anon-key') {
          
          const { supabase } = await import('../lib/supabase');
          const { error } = await supabase
            .from('classified_ads')
            .update({ 
              status: 'approved',
              updated_at: new Date(timestamp).toISOString()
            })
            .eq('id', id);

          if (error) {
            throw error;
          }
          
          console.log('✅ Approved classified in Supabase');
          supabaseSuccess = true;
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase update failed:', supabaseError);
      }

      // Update local state immediately for instant feedback
      setClassifieds(prev => {
        const updated = prev.map(ad => 
          ad.id === id ? { 
            ...ad, 
            status: 'approved' as const,
            updatedAt: new Date(timestamp).toISOString()
          } : ad
        );
        console.log('🔄 Updated local state for approval:', id);
        return updated;
      });

      // If Supabase failed, persist the change locally
      if (!supabaseSuccess) {
        const persistedChanges = loadPersistedChanges();
        persistedChanges[id] = { 
          status: 'approved', 
          timestamp 
        };
        savePersistedChanges(persistedChanges);
        console.log('💾 Saved approval to localStorage for persistence');
      }

      setLastUpdate(timestamp);
      console.log('✅ Classified approved successfully');
    } catch (error) {
      console.error('❌ Error approving classified:', error);
      throw new Error('Failed to approve classified');
    }
  }, [loadPersistedChanges, savePersistedChanges]);

  const rejectClassified = useCallback(async (id: string, reason?: string): Promise<void> => {
    try {
      setError(null);
      console.log('🔄 Rejecting classified:', id, 'Reason:', reason);

      const timestamp = Date.now();
      let supabaseSuccess = false;

      // Try Supabase first
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey && 
            supabaseUrl !== 'https://placeholder.supabase.co' &&
            supabaseUrl !== 'your-supabase-url' &&
            supabaseKey !== 'your-supabase-anon-key') {
          
          const { supabase } = await import('../lib/supabase');
          const { error } = await supabase
            .from('classified_ads')
            .update({ 
              status: 'rejected',
              rejection_reason: reason,
              updated_at: new Date(timestamp).toISOString()
            })
            .eq('id', id);

          if (error) {
            throw error;
          }
          
          console.log('✅ Rejected classified in Supabase');
          supabaseSuccess = true;
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase update failed:', supabaseError);
      }

      // Update local state immediately for instant feedback
      setClassifieds(prev => {
        const updated = prev.map(ad => 
          ad.id === id ? { 
            ...ad, 
            status: 'rejected' as const, 
            rejectionReason: reason,
            updatedAt: new Date(timestamp).toISOString()
          } : ad
        );
        console.log('🔄 Updated local state for rejection:', id);
        return updated;
      });

      // If Supabase failed, persist the change locally
      if (!supabaseSuccess) {
        const persistedChanges = loadPersistedChanges();
        persistedChanges[id] = { 
          status: 'rejected', 
          rejectionReason: reason,
          timestamp 
        };
        savePersistedChanges(persistedChanges);
        console.log('💾 Saved rejection to localStorage for persistence');
      }

      setLastUpdate(timestamp);
      console.log('✅ Classified rejected successfully');
    } catch (error) {
      console.error('❌ Error rejecting classified:', error);
      throw new Error('Failed to reject classified');
    }
  }, [loadPersistedChanges, savePersistedChanges]);

  // Clear persisted changes (for debugging)
  const clearPersistedChanges = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Cleared persisted changes');
      fetchClassifieds(); // Refresh data
    } catch (error) {
      console.warn('⚠️ Failed to clear persisted changes:', error);
    }
  }, [fetchClassifieds]);

  useEffect(() => {
    fetchClassifieds();
  }, [fetchClassifieds]);

  return {
    classifieds,
    isLoading,
    error,
    lastUpdate,
    createClassified,
    approveClassified,
    rejectClassified,
    refetch: fetchClassifieds,
    clearPersistedChanges // For debugging
  };
};