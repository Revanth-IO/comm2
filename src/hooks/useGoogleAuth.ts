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

        // Initialize Google Identity Services with redirect mode instead of popup
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'redirect',
          redirect_uri: window.location.origin
        });

        // Check if user is already signed in
        const savedUser = localStorage.getItem('googleUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsSignedIn(true);
        }

        // Check for credential in URL (after redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const credential = urlParams.get('credential');
        if (credential) {
          handleCredentialResponse({ credential });
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
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
    } catch (error) {
      console.error('Failed to process Google credential:', error);
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

      // Use the One Tap prompt which is more reliable
      window.google.accounts.id.prompt((notification: any) => {
        console.log('Prompt notification:', notification);
        setIsLoading(false);
        
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap doesn't work, fall back to button rendering
          console.log('One Tap not available, using button approach');
          renderSignInButton();
        }
      });
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      setIsLoading(false);
    }
  };

  const renderSignInButton = () => {
    // Create a temporary container for the Google button
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'google-signin-button';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '50%';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translate(-50%, -50%)';
    buttonContainer.style.zIndex = '10000';
    buttonContainer.style.backgroundColor = 'white';
    buttonContainer.style.padding = '20px';
    buttonContainer.style.borderRadius = '10px';
    buttonContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      document.body.removeChild(buttonContainer);
      setIsLoading(false);
    };
    
    buttonContainer.appendChild(closeButton);
    document.body.appendChild(buttonContainer);

    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      width: 250,
      text: 'signin_with'
    });
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