import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ClassifiedAd } from '../types';

interface UseClassifiedsReturn {
  classifieds: ClassifiedAd[];
  isLoading: boolean;
  error: string | null;
  createClassified: (data: Partial<ClassifiedAd>) => Promise<void>;
  updateClassified: (id: string, data: Partial<ClassifiedAd>) => Promise<void>;
  deleteClassified: (id: string) => Promise<void>;
  approveClassified: (id: string) => Promise<void>;
  rejectClassified: (id: string, reason: string) => Promise<void>;
  refreshClassifieds: () => Promise<void>;
}

export const useClassifieds = (): UseClassifiedsReturn => {
  const [classifieds, setClassifieds] = useState<ClassifiedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassifieds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('classified_ads')
        .select(`
          *,
          categories (
            name,
            type
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Convert database format to our ClassifiedAd type
      const convertedClassifieds: ClassifiedAd[] = (data || []).map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        category: ad.categories?.name || 'Uncategorized',
        subcategory: ad.subcategory || undefined,
        price: ad.price || undefined,
        location: ad.location,
        contactInfo: {
          name: ad.contact_name,
          email: ad.contact_email,
          phone: ad.contact_phone || undefined
        },
        images: ad.images || [],
        status: ad.status as 'pending' | 'approved' | 'rejected' | 'expired',
        authorId: ad.author_id || '',
        authorName: ad.author_name,
        createdAt: ad.created_at,
        updatedAt: ad.updated_at,
        expiresAt: ad.expires_at,
        rejectionReason: ad.rejection_reason || undefined,
        featured: ad.featured
      }));

      setClassifieds(convertedClassifieds);
      console.log('✅ Fetched classifieds:', convertedClassifieds.length);
    } catch (err) {
      console.error('❌ Error fetching classifieds:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch classifieds');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createClassified = useCallback(async (data: Partial<ClassifiedAd>): Promise<void> => {
    try {
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      const insertData = {
        title: data.title!,
        description: data.description!,
        subcategory: data.subcategory,
        price: data.price,
        location: data.location!,
        contact_name: data.contactInfo!.name,
        contact_email: data.contactInfo!.email,
        contact_phone: data.contactInfo?.phone,
        images: data.images || [],
        author_id: user?.id,
        author_name: data.contactInfo!.name,
        status: 'pending'
      };

      const { error: insertError } = await supabase
        .from('classified_ads')
        .insert(insertData);

      if (insertError) {
        throw insertError;
      }

      console.log('✅ Created classified ad');
      await fetchClassifieds(); // Refresh the list
    } catch (err) {
      console.error('❌ Error creating classified:', err);
      setError(err instanceof Error ? err.message : 'Failed to create classified');
      throw err;
    }
  }, [fetchClassifieds]);

  const updateClassified = useCallback(async (id: string, data: Partial<ClassifiedAd>): Promise<void> => {
    try {
      setError(null);

      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.subcategory) updateData.subcategory = data.subcategory;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.location) updateData.location = data.location;
      if (data.contactInfo) {
        updateData.contact_name = data.contactInfo.name;
        updateData.contact_email = data.contactInfo.email;
        updateData.contact_phone = data.contactInfo.phone;
      }
      if (data.images) updateData.images = data.images;
      if (data.status) updateData.status = data.status;

      const { error: updateError } = await supabase
        .from('classified_ads')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      console.log('✅ Updated classified ad:', id);
      await fetchClassifieds(); // Refresh the list
    } catch (err) {
      console.error('❌ Error updating classified:', err);
      setError(err instanceof Error ? err.message : 'Failed to update classified');
      throw err;
    }
  }, [fetchClassifieds]);

  const deleteClassified = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('classified_ads')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      console.log('✅ Deleted classified ad:', id);
      await fetchClassifieds(); // Refresh the list
    } catch (err) {
      console.error('❌ Error deleting classified:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete classified');
      throw err;
    }
  }, [fetchClassifieds]);

  const approveClassified = useCallback(async (id: string): Promise<void> => {
    await updateClassified(id, { status: 'approved' });
  }, [updateClassified]);

  const rejectClassified = useCallback(async (id: string, reason: string): Promise<void> => {
    await updateClassified(id, { status: 'rejected', rejectionReason: reason });
  }, [updateClassified]);

  const refreshClassifieds = useCallback(async (): Promise<void> => {
    await fetchClassifieds();
  }, [fetchClassifieds]);

  // Initial fetch
  useEffect(() => {
    fetchClassifieds();
  }, [fetchClassifieds]);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('classified_ads_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'classified_ads' 
        }, 
        (payload) => {
          console.log('🔄 Real-time update:', payload);
          fetchClassifieds(); // Refresh when data changes
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchClassifieds]);

  return {
    classifieds,
    isLoading,
    error,
    createClassified,
    updateClassified,
    deleteClassified,
    approveClassified,
    rejectClassified,
    refreshClassifieds
  };
};