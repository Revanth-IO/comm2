import React, { useEffect, useRef } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface GoogleSignInButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  className = ''
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
    const currentOrigin = window.location.origin;
    
    return (
      <div className="w-full px-6 py-3 border border-yellow-300 bg-yellow-50 rounded-lg text-center">
        <p className="text-yellow-800 font-medium mb-2">Google Authentication Setup Required</p>
        <p className="text-sm text-yellow-700">
          To enable Google sign-in, please configure your Google Client ID in the environment variables.
        </p>
        <details className="mt-3 text-left">
          <summary className="text-sm text-yellow-800 cursor-pointer font-medium">Setup Instructions</summary>
          <div className="mt-2 text-xs text-yellow-700 space-y-2">
            <ol className="space-y-1 ml-4">
              <li>1. Go to <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>2. Create a new project or select existing one</li>
              <li>3. Enable Google Identity Services API</li>
              <li>4. Create OAuth 2.0 Client ID credentials (Web application)</li>
              <li>5. Configure authorized origins and redirect URIs:</li>
            </ol>
            <div className="ml-8 p-3 bg-yellow-100 rounded border-l-4 border-yellow-400">
              <p className="font-medium text-yellow-800 mb-2">⚠️ Important for Dynamic Environments:</p>
              <p className="mb-2">Add the following URL to <strong>both</strong> sections in your Google OAuth configuration:</p>
              <div className="bg-white p-2 rounded border font-mono text-xs break-all">
                {currentOrigin}
              </div>
              <div className="mt-2 space-y-1">
                <p><strong>Authorized JavaScript origins:</strong> Add the URL above</p>
                <p><strong>Authorized redirect URIs:</strong> Add the URL above</p>
              </div>
              <p className="mt-2 text-xs">
                Note: In dynamic environments like WebContainers, the URL changes each session. 
                You may need to update these settings when the URL changes.
              </p>
            </div>
            <ol className="space-y-1 ml-4" start={6}>
              <li>6. Copy your Client ID and set it as VITE_GOOGLE_CLIENT_ID in your .env file</li>
              <li>7. Restart your development server after updating the .env file</li>
            </ol>
          </div>
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