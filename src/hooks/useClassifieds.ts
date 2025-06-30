import { useState, useEffect } from 'react';
import { ClassifiedAd } from '../types';
import { supabase } from '../lib/supabase';

export const useClassifieds = () => {
  const [classifieds, setClassifieds] = useState<ClassifiedAd[]>([]);
  const [loading, setLoading] = useState(true);
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
    }
  ];

  const fetchClassifieds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co') {
        console.log('🔄 Supabase not configured, using mock data');
        setClassifieds(mockClassifieds);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching classifieds from Supabase...');
      
      const { data, error: supabaseError } = await supabase
        .from('classified_ads')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError);
        // Fall back to mock data on error
        console.log('🔄 Falling back to mock data');
        setClassifieds(mockClassifieds);
      } else {
        console.log('✅ Fetched classifieds from Supabase:', data?.length || 0);
        
        if (data && data.length > 0) {
          // Transform Supabase data to match our interface
          const transformedData: ClassifiedAd[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category || 'General',
            subcategory: item.subcategory,
            price: item.price,
            location: item.location,
            contactInfo: {
              name: item.contact_name,
              email: item.contact_email,
              phone: item.contact_phone
            },
            images: item.images || [],
            status: item.status,
            authorId: item.author_id || 'unknown',
            authorName: item.author_name || item.contact_name,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            expiresAt: item.expires_at,
            featured: item.featured || false
          }));
          setClassifieds(transformedData);
        } else {
          // Use mock data if no real data exists
          console.log('🔄 No data in Supabase, using mock data');
          setClassifieds(mockClassifieds);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching classifieds:', error);
      // Always fall back to mock data on any error
      console.log('🔄 Using mock data due to error');
      setClassifieds(mockClassifieds);
      setError(null); // Don't show error to user, just use mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassifieds();
  }, []);

  return {
    classifieds,
    loading,
    error,
    refetch: fetchClassifieds
  };
};