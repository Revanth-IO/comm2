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

      // First try to get users from Supabase
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log('❌ Supabase auth admin not available, using fallback users');
        // Fallback to mock users when Supabase admin is not available
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
        return;
      }

      // Get user profiles from our database
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (profilesError) {
        console.error('❌ Error fetching user profiles:', profilesError);
      }

      // Combine auth users with profiles
      const combinedUsers: User[] = authUsers.users.map(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || '',
          name: profile?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          role: (profile?.role as UserRole) || 'user',
          isActive: profile?.is_active ?? true,
          createdAt: authUser.created_at,
          picture: profile?.avatar_url || authUser.user_metadata?.avatar_url
        };
      });

      setUsers(combinedUsers);
      console.log('✅ Fetched users:', combinedUsers.length);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      
      // Fallback to mock users on any error
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
        }
      ];
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: UserRole): Promise<void> => {
    try {
      setError(null);

      // Update in Supabase user_profiles table
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          role: role
        });

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role } : user
        )
      );

      console.log('✅ Updated user role:', userId, role);
    } catch (err) {
      console.error('❌ Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      throw err;
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, isActive: boolean): Promise<void> => {
    try {
      setError(null);

      // Update in Supabase user_profiles table
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          is_active: isActive
        });

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive } : user
        )
      );

      console.log('✅ Updated user status:', userId, isActive);
    } catch (err) {
      console.error('❌ Error updating user status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string): Promise<void> => {
    try {
      setError(null);

      // Delete from Supabase auth (this will cascade to user_profiles due to foreign key)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      console.log('✅ Deleted user:', userId);
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