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

// Valid passwords for demo accounts
const DEMO_PASSWORDS: Record<string, string> = {
  'admin@upkaar.org': 'test',
  'user@example.com': 'test',
  'moderator@upkaar.org': 'test'
};

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if it's a demo account with correct password
      if (DEMO_PASSWORDS[email] && DEMO_PASSWORDS[email] === password) {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          setIsLoading(false);
          return;
        }
      }
      
      // Check if user exists in mock data (for any password in demo mode)
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setIsLoading(false);
        return;
      }
      
      // Create a guest user for any other email (demo purposes)
      const guestUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      setUser(guestUser);
      localStorage.setItem('currentUser', JSON.stringify(guestUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: string): boolean => {
    // Allow guest users to post classifieds
    if (!user && permission === 'add_classified') return true;
    if (!user) return permission === 'read_content'; // Guests can only read other content

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