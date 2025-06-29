import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, Building, Heart, CheckCircle } from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface JoinCommunityProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinCommunity: React.FC<JoinCommunityProps> = ({ isOpen, onClose }) => {
  const { user, isSignedIn, signOut } = useGoogleAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: 'NJ',
    interests: [] as string[],
    profession: '',
    experience: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Auto-fill form when user signs in with Google
  useEffect(() => {
    if (user && isSignedIn) {
      setFormData(prev => ({
        ...prev,
        firstName: user.given_name || '',
        lastName: user.family_name || '',
        email: user.email || '',
      }));
      setShowForm(true);
    }
  }, [user, isSignedIn]);

  const interests = [
    'Cultural Events',
    'Business Networking',
    'Religious Activities',
    'Sports & Recreation',
    'Education & Tutoring',
    'Volunteer Work',
    'Food & Cooking',
    'Arts & Music',
    'Professional Development',
    'Family Activities'
  ];

  const states = ['PA', 'NJ', 'NY'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGoogleSuccess = (googleUser: any) => {
    console.log('Google sign-in successful:', googleUser);
    // Form will be auto-filled via useEffect
  };

  const handleGoogleError = (error: any) => {
    console.error('Google sign-in error:', error);
    // You could show an error message here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    const submissionData = {
      ...formData,
      googleUser: user,
      signedInWithGoogle: isSignedIn
    };
    console.log('Form submitted:', submissionData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        state: 'NJ',
        interests: [],
        profession: '',
        experience: ''
      });
      onClose();
    }, 3000);
  };

  const handleStartOver = () => {
    signOut();
    setShowForm(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      state: 'NJ',
      interests: [],
      profession: '',
      experience: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Join Our Community</h2>
              <p className="text-sm text-gray-600">Connect with 50K+ Indians in the tri-state area</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Community!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for joining IndiaConnect. You'll receive a welcome email shortly with next steps and upcoming events.
            </p>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-orange-800 font-medium">
                🎉 You're now part of a vibrant community of 50,000+ Indians across PA, NJ, and NY!
              </p>
            </div>
          </div>
        ) : !showForm ? (
          /* Google Sign-In Section */
          <div className="p-8">
            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Exclusive event invitations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Business networking opportunities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Connect with like-minded families</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-700">Community support network</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600 mb-6">
                Sign in with Google to quickly join our community and auto-fill your information.
              </p>
            </div>

            <div className="space-y-4">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Continue without Google
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Info Display (if signed in with Google) */}
            {isSignedIn && user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-green-900">Signed in as {user.name}</p>
                      <p className="text-sm text-green-700">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="text-sm text-green-700 hover:text-green-800 underline"
                  >
                    Use different account
                  </button>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSignedIn}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                >
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profession */}
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                placeholder="e.g., Software Engineer, Doctor, Teacher"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map(interest => (
                  <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about yourself (Optional)
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                placeholder="Share your background, interests, or what you hope to gain from the community..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105"
              >
                Join Community
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinCommunity;