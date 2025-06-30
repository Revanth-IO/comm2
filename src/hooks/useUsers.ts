import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('ℹ️ Using mock users (Supabase admin API requires server-side implementation)');
      
      // Use mock users since admin API calls require service role key on server-side
      const mockUsers: User[] = [
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
        },
        {
          id: '4',
          email: 'vendor@example.com',
          name: 'Vendor User',
          role: 'vendor',
          isActive: true,
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          id: '5',
          email: 'content@upkaar.org',
          name: 'Content Manager',
          role: 'content_manager',
          isActive: false,
          createdAt: '2024-01-03T00:00:00Z'
        }
      ];
      
      setUsers(mockUsers);
      console.log('✅ Loaded mock users:', mockUsers.length);
    } catch (err) {
      console.error('❌ Error in fetchUsers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: UserRole): Promise<void> => {
    try {
      setError(null);

      // Try to update in Supabase user_profiles table if available
      try {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .upsert({
            id: userId,
            role: role
          });

        if (updateError) {
          console.warn('⚠️ Could not update role in database:', updateError.message);
        }
      } catch (dbError) {
        console.warn('⚠️ Database update failed, updating locally only');
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role } : user
        )
      );

      console.log('✅ Updated user role locally:', userId, role);
    } catch (err) {
      console.error('❌ Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      throw err;
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, isActive: boolean): Promise<void> => {
    try {
      setError(null);

      // Try to update in Supabase user_profiles table if available
      try {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .upsert({
            id: userId,
            is_active: isActive
          });

        if (updateError) {
          console.warn('⚠️ Could not update status in database:', updateError.message);
        }
      } catch (dbError) {
        console.warn('⚠️ Database update failed, updating locally only');
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive } : user
        )
      );

      console.log('✅ Updated user status locally:', userId, isActive);
    } catch (err) {
      console.error('❌ Error updating user status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string): Promise<void> => {
    try {
      setError(null);

      // Note: User deletion from auth requires server-side implementation with service role key
      console.log('ℹ️ User deletion requires server-side implementation');

      // Update local state (remove user from mock data)
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      console.log('✅ Removed user from local state:', userId);
    } catch (err) {
      console.error('❌ Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  }, []);

  const refreshUsers = useCallback(async (): Promise<void> => {
    await fetchUsers();
  }, [fetchUsers]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    refreshUsers
  };
};