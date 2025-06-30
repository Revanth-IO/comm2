import { useState, useEffect } from 'react';
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

  // Mock data fallback
  const mockClassifieds: ClassifiedAd[] = [
    {
      id: '1',
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
      authorId: '1',
      authorName: 'Raj Patel',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      expiresAt: '2024-02-15T10:00:00Z',
      featured: true
    },
    {
      id: '2',
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
      authorId: '2',
      authorName: 'Priya Sharma',
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      expiresAt: '2024-02-14T15:30:00Z',
      featured: false
    },
    {
      id: '3',
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
      authorId: '3',
      authorName: 'Dr. Amit Kumar',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      expiresAt: '2024-02-13T09:15:00Z',
      featured: false
    },
    {
      id: '4',
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
      authorId: '4',
      authorName: 'HR Team',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      expiresAt: '2024-02-16T14:20:00Z',
      featured: false
    },
    {
      id: '5',
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
      authorId: '5',
      authorName: 'Sarah Johnson',
      createdAt: '2024-01-17T11:45:00Z',
      updatedAt: '2024-01-17T11:45:00Z',
      expiresAt: '2024-02-17T11:45:00Z',
      featured: false
    }
  ];

  const fetchClassifieds = async () => {
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
        console.log('🔄 Supabase not configured, using mock data');
        setClassifieds(mockClassifieds);
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
        console.log('🔄 Falling back to mock data');
        setClassifieds(mockClassifieds);
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
            featured: Boolean(item.featured)
          }));
          setClassifieds([...transformedData, ...mockClassifieds]);
        } else {
          console.log('🔄 No data in Supabase, using mock data');
          setClassifieds(mockClassifieds);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching classifieds:', error);
      console.log('🔄 Using mock data due to error');
      setClassifieds(mockClassifieds);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

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
          id: Date.now().toString(),
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          price: data.price,
          location: data.location,
          contactInfo: data.contactInfo,
          images: data.images,
          status: 'pending',
          authorId: 'guest_' + Date.now(),
          authorName: data.contactInfo.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          featured: false
        };

        setClassifieds(prev => [newClassified, ...prev]);
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
          id: Date.now().toString(),
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          price: data.price,
          location: data.location,
          contactInfo: data.contactInfo,
          images: data.images,
          status: 'pending',
          authorId: 'guest_' + Date.now(),
          authorName: data.contactInfo.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          featured: false
        };

        setClassifieds(prev => [newClassified, ...prev]);
        console.log('✅ Created classified locally (fallback)');
      }
    } catch (error) {
      console.error('❌ Error creating classified:', error);
      throw new Error('Failed to create classified ad');
    }
  };

  const approveClassified = async (id: string): Promise<void> => {
    try {
      setError(null);

      // Try Supabase first
      try {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase
          .from('classified_ads')
          .update({ status: 'approved' })
          .eq('id', id);

        if (error) {
          throw error;
        }
        console.log('✅ Approved classified in Supabase');
      } catch (supabaseError) {
        console.warn('⚠️ Supabase update failed, updating locally only');
      }

      // Update local state
      setClassifieds(prev => 
        prev.map(ad => 
          ad.id === id ? { ...ad, status: 'approved' } : ad
        )
      );
    } catch (error) {
      console.error('❌ Error approving classified:', error);
      throw new Error('Failed to approve classified');
    }
  };

  const rejectClassified = async (id: string, reason?: string): Promise<void> => {
    try {
      setError(null);

      // Try Supabase first
      try {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase
          .from('classified_ads')
          .update({ 
            status: 'rejected',
            rejection_reason: reason 
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
        console.log('✅ Rejected classified in Supabase');
      } catch (supabaseError) {
        console.warn('⚠️ Supabase update failed, updating locally only');
      }

      // Update local state
      setClassifieds(prev => 
        prev.map(ad => 
          ad.id === id ? { ...ad, status: 'rejected', rejectionReason: reason } : ad
        )
      );
    } catch (error) {
      console.error('❌ Error rejecting classified:', error);
      throw new Error('Failed to reject classified');
    }
  };

  useEffect(() => {
    fetchClassifieds();
  }, []);

  return {
    classifieds,
    isLoading,
    error,
    createClassified,
    approveClassified,
    rejectClassified,
    refetch: fetchClassifieds
  };
};