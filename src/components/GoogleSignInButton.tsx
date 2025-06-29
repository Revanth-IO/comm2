import React, { useEffect, useRef } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface GoogleSignInButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  className = '',
  children
}) => {
  const { isLoading, user, isSignedIn, isInitialized } = useGoogleAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (isInitialized && buttonRef.current && window.google && !isSignedIn) {
      // Clear any existing content
      buttonRef.current.innerHTML = '';
      
      // Render Google Sign-In button
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        width: buttonRef.current.offsetWidth || 300,
        text: 'signin_with',
        shape: 'rectangular'
      });
    }
  }, [isInitialized, isSignedIn]);

  if (isSignedIn && user) {
    return null; // Don't show button if already signed in
  }

  // Show setup message if Google Client ID is not configured
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your-google-client-id-here') {
    return (
      <div className="w-full px-6 py-3 border border-yellow-300 bg-yellow-50 rounded-lg text-center">
        <p className="text-yellow-800 font-medium mb-2">Google Authentication Setup Required</p>
        <p className="text-sm text-yellow-700">
          To enable Google sign-in, please configure your Google Client ID in the environment variables.
        </p>
        <details className="mt-3 text-left">
          <summary className="text-sm text-yellow-800 cursor-pointer font-medium">Setup Instructions</summary>
          <ol className="mt-2 text-xs text-yellow-700 space-y-1 ml-4">
            <li>1. Go to <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
            <li>2. Create a new project or select existing one</li>
            <li>3. Enable Google Identity Services API</li>
            <li>4. Create OAuth 2.0 Client ID credentials</li>
            <li>5. Add your domain to authorized origins</li>
            <li>6. Set VITE_GOOGLE_CLIENT_ID in your .env file</li>
          </ol>
        </details>
      </div>
    );
  }

  if (isLoading || !isInitialized) {
    return (
      <div className={`flex items-center justify-center space-x-3 w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 bg-white ${className}`}>
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div ref={buttonRef} className="w-full flex justify-center"></div>
    </div>
  );
};

export default GoogleSignInButton;