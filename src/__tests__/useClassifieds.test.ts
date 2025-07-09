import { renderHook, waitFor, act } from '@testing-library/react';
import { useClassifieds } from '../hooks/useClassifieds';
import { getSupabaseClient } from '../lib/supabase';
import { vi } from 'vitest';
import { getFreshSupabaseMocks } from '../setupTests';

describe('useClassifieds', () => {
  let mockSupabase: ReturnType<typeof getSupabaseClient>;
  let mockChainable: any; // Declare mockChainable here

  beforeEach(() => {
    vi.clearAllMocks();
    const { mockSupabaseClient, mockChainable: mc } = getFreshSupabaseMocks();
    mockSupabase = mockSupabaseClient;
    mockChainable = mc; // Assign the returned mockChainable
  });

  it('should return the hook\'s result object', () => {
    const { result } = renderHook(() => useClassifieds());
    expect(result.current).toBeDefined();
    expect(typeof result.current.classifieds).toBe('object');
    expect(typeof result.current.isLoading).toBe('boolean');
    expect(typeof result.current.error).toBe('object'); // Can be null
    expect(typeof result.current.createClassified).toBe('function');
  });

  it('should fetch classifieds successfully', async () => {
    const mockData = [
      { id: '1', title: 'Test Ad 1', description: 'Desc 1', category: 'For Sale', contact_name: 'John Doe', created_at: new Date().toISOString() },
      { id: '2', title: 'Test Ad 2', description: 'Desc 2', category: 'Housing', contact_name: 'Jane Doe', created_at: new Date().toISOString() },
    ];
    
    // Mock the initial fetchClassifieds call BEFORE rendering the hook
    mockChainable.then.mockResolvedValueOnce({ data: mockData, error: null });

    const { result } = renderHook(() => useClassifieds());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.classifieds).toHaveLength(2);
    expect(result.current.classifieds[0].title).toBe('Test Ad 1');
    expect(result.current.error).toBeNull();
  });

  it('should handle error when fetching classifieds', async () => {
    const mockError = { message: 'Failed to fetch' };
    
    // Mock the initial fetchClassifieds call BEFORE rendering the hook
    mockChainable.then.mockResolvedValueOnce({ data: null, error: mockError });

    const { result } = renderHook(() => useClassifieds());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.classifieds).toHaveLength(0);
    expect(result.current.error).toBe(mockError.message);
  });

  it('should create a classified successfully', async () => {
    const newAd = {
      title: 'New Ad',
      description: 'New Desc',
      category_id: 1,
      location: 'Test Location',
      contactInfo: { name: 'Test User', email: 'test@example.com' },
      images: [],
    };

    // Mock initial fetchClassifieds call
    mockChainable.then.mockResolvedValueOnce({ data: [], error: null });

    const { result } = renderHook(() => useClassifieds());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Mock the insert operation
    mockChainable.then.mockResolvedValueOnce({ data: [], error: null });

    // Mock the subsequent fetchClassifieds call after creation
    mockChainable.then.mockResolvedValueOnce({ data: [{ id: '3', title: 'New Ad', description: 'New Desc', category: 'Test', contact_name: 'Test User', created_at: new Date().toISOString() }], error: null });

    await act(async () => {
      await result.current.createClassified(newAd);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('classified_ads');
    expect(mockSupabase.from('classified_ads').insert).toHaveBeenCalledWith({
      title: newAd.title,
      description: newAd.description,
      category_id: newAd.category_id,
      subcategory: undefined,
      price: undefined,
      location: newAd.location,
      contact_name: newAd.contactInfo.name,
      contact_email: newAd.contactInfo.email,
      contact_phone: undefined,
      images: newAd.images,
      status: 'pending',
      author_name: newAd.contactInfo.name,
    });
  });

  it('should approve a classified successfully', async () => {
    const adId = 'some-ad-id';
    
    // Mock initial fetchClassifieds call
    mockChainable.then.mockResolvedValueOnce({ data: [], error: null });

    const { result } = renderHook(() => useClassifieds());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Mock the update operation
    mockChainable.then.mockResolvedValueOnce({ data: [], error: null });

    // Mock the subsequent fetchClassifieds call after approval
    mockChainable.then.mockResolvedValueOnce({ data: [{ id: adId, status: 'approved' }], error: null });

    await act(async () => {
      await result.current.approveClassified(adId);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('classified_ads');
    expect(mockSupabase.from('classified_ads').update).toHaveBeenCalledWith({ status: 'approved' });
    expect(mockSupabase.from('classified_ads').update().eq).toHaveBeenCalledWith('id', adId);
  });

  it('should reject a classified successfully', async () => {
    const adId = 'some-ad-id';
    const reason = 'Bad content';
    
    // Mock initial fetchClassifieds call
    mockChainable.then.mockResolvedValueOnce({ data: [], error: null });

    const { result } = renderHook(() => useClassifieds());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Mock the update operation
    mockChainable.then.mockResolvedValueOnce({ data: [], error: null });

    // Mock the subsequent fetchClassifieds call after rejection
    mockChainable.then.mockResolvedValueOnce({ data: [{ id: adId, status: 'rejected', rejection_reason: reason }], error: null });

    await act(async () => {
      await result.current.rejectClassified(adId, reason);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('classified_ads');
    expect(mockSupabase.from('classified_ads').update).toHaveBeenCalledWith({ status: 'rejected', rejection_reason: reason });
    expect(mockSupabase.from('classified_ads').update().eq).toHaveBeenCalledWith('id', adId);
  });
});