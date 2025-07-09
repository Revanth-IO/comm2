import React, { useState } from 'react';
import { X, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isOpen, onClose, message }) => {
  const { login, signUp, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('🔐 Login form submitted:', { email: formData.email, password: '***' });
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        console.log('✅ Login successful, closing modal');
        onClose();
      } else {
        await signUp(formData.email, formData.password, formData.name);
        console.log('✅ Sign up successful');
        showNotification(`A verification link has been sent to ${formData.email}. Please click the link in the email to complete your registration.`, 'info');
        onClose();
      }
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      setError(error instanceof Error ? error.message : 'Sign up failed. Please check your details and try again.');
    }
  };

  const handleDemoLogin = async (email: string) => {
    console.log('🎯 Demo login clicked for:', email);
    setFormData({ ...formData, email, password: 'test' });
    setError('');
    
    try {
      await login(email, 'test');
      console.log('✅ Demo login successful');
      onClose();
    } catch (error) {
      console.error('❌ Demo login failed:', error);
      setError('Demo login failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-600">Join the Upkaar community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">🚀 Quick Demo Login:</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('admin@upkaar.org')}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 bg-red-100 hover:bg-red-200 rounded text-sm font-medium text-red-800 transition-colors duration-200 disabled:opacity-50"
              >
                🛡️ Admin Account (Full Access)
              </button>
              <button
                onClick={() => handleDemoLogin('moderator@upkaar.org')}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 bg-orange-100 hover:bg-orange-200 rounded text-sm font-medium text-orange-800 transition-colors duration-200 disabled:opacity-50"
              >
                ⚖️ Moderator Account (Content Review)
              </button>
              <button
                onClick={() => handleDemoLogin('user@example.com')}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm font-medium text-blue-800 transition-colors duration-200 disabled:opacity-50"
              >
                👤 Regular User Account
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All demo accounts use password: <strong>test</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;