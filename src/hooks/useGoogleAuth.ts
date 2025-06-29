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
  signIn: () => Promise<void>;
  signOut: () => void;
  isSignedIn: boolean;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

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

        // Initialize Google Identity Services - no popup mode
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

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
  }, []);

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

  const handleCredentialResponse = (response: any) => {
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
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to process Google credential:', error);
      setIsLoading(false);
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your-google-client-id-here') {
        alert('Google authentication is not configured. Please contact the administrator.');
        return;
      }

      setIsLoading(true);
      
      if (!window.google) {
        await loadGoogleScript();
      }

      // Create a modal overlay
      const overlay = document.createElement('div');
      overlay.id = 'google-signin-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // Create modal content
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        position: relative;
      `;

      // Add title
      const title = document.createElement('h3');
      title.textContent = 'Sign in with Google';
      title.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
      `;

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        border: none;
        background: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      const cleanup = () => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        setIsLoading(false);
      };

      closeButton.onclick = cleanup;
      overlay.onclick = (e) => {
        if (e.target === overlay) cleanup();
      };

      // Create container for Google button
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'google-button-container';

      modal.appendChild(closeButton);
      modal.appendChild(title);
      modal.appendChild(buttonContainer);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Render Google Sign-In button
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        width: 300,
        text: 'signin_with',
        shape: 'rectangular'
      });

      // Override the callback to handle cleanup
      const originalCallback = window.google.accounts.id.initialize;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          cleanup();
          handleCredentialResponse(response);
        },
        auto_select: false,
        cancel_on_tap_outside: false,
      });

    } catch (error) {
      console.error('Google Sign-In failed:', error);
      setIsLoading(false);
    }
  };

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
    signIn,
    signOut,
    isSignedIn,
  };
};