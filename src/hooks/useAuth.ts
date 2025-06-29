import { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

// Mock user data - in a real app, this would come from your backend
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@indiaconnect.com',
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
  }
];

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - in a real app, this would call your authentication API
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    } else {
      // Create a guest user for demo purposes
      const guestUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setUser(guestUser);
      localStorage.setItem('currentUser', JSON.stringify(guestUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return permission === 'read_content'; // Guests can only read

    const { USER_PERMISSIONS } = require('../types');
    const userPermissions = USER_PERMISSIONS[user.role];
    
    if (userPermissions.includes('all')) return true;
    return userPermissions.includes(permission);
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    isLoading
  };
};