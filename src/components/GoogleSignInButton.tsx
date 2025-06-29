import React from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface GoogleSignInButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  className = '',
  children
}) => {
  const { signIn, isLoading, user, isSignedIn } = useGoogleAuth();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSignIn = async () => {
    try {
      await signIn();
      if (onSuccess && user) {
        onSuccess(user);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

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

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`flex items-center justify-center space-x-3 w-full px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{children || 'Continue with Google'}</span>
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;