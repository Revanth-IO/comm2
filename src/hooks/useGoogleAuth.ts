import { useState, useEffect } from 'react';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface UseGoogleAuthReturn {
  user: GoogleUser | null;
  isLoading: boolean;
  signOut: () => void;
  isSignedIn: boolean;
  isInitialized: boolean;
}

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: CredentialResponse) => void;
      auto_select: boolean;
      cancel_on_tap_outside: boolean;
    }) => void;
    renderButton: (
      parent: HTMLElement,
      options: {
        theme: string;
        size: string;
        type: string;
        width: number;
        text: string;
        shape: string;
      }
    ) => void;
    disableAutoSelect: () => void;
  };
}

declare global {
  interface Window {
    google: {
      accounts: GoogleAccounts;
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        // Check if Google Client ID is configured
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your-google-client-id-here') {
          console.warn('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.');
          setIsLoading(false);
          return;
        }

        // Load Google Identity Services
        if (!window.google) {
          await loadGoogleScript();
        }

        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        setIsInitialized(true);

        // Check if user is already signed in
        const savedUser = localStorage.getItem('googleUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsSignedIn(true);
        }
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGoogleAuth();
  }, [handleCredentialResponse]);

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-identity-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  };

  interface CredentialResponse {
  credential: string;
}

  const handleCredentialResponse = useCallback((response: CredentialResponse) => {
    try {
      // Decode the JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUser: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };

      setUser(googleUser);
      setIsSignedIn(true);
      localStorage.setItem('googleUser', JSON.stringify(googleUser));
    } catch (error) {
      console.error('Failed to process Google credential:', error);
    }
  }, []);

  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
    localStorage.removeItem('googleUser');
    
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return {
    user,
    isLoading,
    signOut,
    isSignedIn,
    isInitialized,
  };
};