import { useState, useEffect, useCallback } from 'react';
import { ClassifiedAd } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface CreateClassifiedData {
  title: string;
  description: string;
  category_id: number;
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

  const fetchClassifieds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await getSupabaseClient()
        .from('classified_ads')
        .select(`
          *,
          categories ( name )
        `)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data) {
        const transformedData: ClassifiedAd[] = data.map(item => ({
          id: item.id,
          title: item.title || 'Untitled',
          description: item.description || '',
          category: item.categories.name || 'General',
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
        setClassifieds(transformedData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createClassified = async (data: CreateClassifiedData): Promise<void> => {
    try {
      const { error: supabaseError } = await getSupabaseClient()
        .from('classified_ads')
        .insert({
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          subcategory: data.subcategory,
          price: data.price,
          location: data.location,
          contact_name: data.contactInfo.name,
          contact_email: data.contactInfo.email,
          contact_phone: data.contactInfo.phone,
          images: data.images,
          status: 'pending',
          author_name: data.contactInfo.name
        });

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchClassifieds();
    } catch (error) {
      console.error('Failed to create classified ad:', error);
      throw new Error('Failed to create classified ad');
    }
  };

  const approveClassified = useCallback(async (id: string): Promise<void> => {
    try {
      const { error: supabaseError } = await getSupabaseClient()
        .from('classified_ads')
        .update({ status: 'approved' })
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchClassifieds();
    } catch (error) {
      console.error('Failed to approve classified:', error);
      throw new Error('Failed to approve classified');
    }
  }, [fetchClassifieds]);

  const rejectClassified = useCallback(async (id: string, reason?: string): Promise<void> => {
    try {
      const { error: supabaseError } = await getSupabaseClient()
        .from('classified_ads')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchClassifieds();
    } catch (error) {
      console.error('Failed to reject classified:', error);
      throw new Error('Failed to reject classified');
    }
  }, [fetchClassifieds]);

  useEffect(() => {
    fetchClassifieds();
  }, [fetchClassifieds]);

  return {
    classifieds,
    isLoading,
    error,
    createClassified,
    approveClassified,
    rejectClassified,
    refetch: fetchClassifieds,
  };
};