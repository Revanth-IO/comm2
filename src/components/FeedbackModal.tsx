import React, { useState } from 'react';
import { X, Bug, Lightbulb, AlertCircle, Send, CheckCircle, Star } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'suggestion' | 'general' | 'compliment';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    page: window.location.pathname,
    browser: navigator.userAgent,
    allowContact: true
  });

  const feedbackTypes = [
    {
      id: 'bug' as FeedbackType,
      name: 'Bug Report',
      description: 'Report a problem or error',
      icon: Bug,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'suggestion' as FeedbackType,
      name: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'general' as FeedbackType,
      name: 'General Feedback',
      description: 'Share your thoughts or questions',
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'compliment' as FeedbackType,
      name: 'Compliment',
      description: 'Share what you love about the site',
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to your backend
    const feedbackData = {
      ...formData,
      type: feedbackType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };

    console.log('Feedback submitted:', feedbackData);

    

    // In production, this would be sent to your backend API
    // which would then email the dev team at dev@upkaar.org
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium',
        page: window.location.pathname,
        browser: navigator.userAgent,
        allowContact: true
      });
      setFeedbackType('general');
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send Feedback</h2>
              <p className="text-sm text-gray-600">Help us improve Upkaar for everyone</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your feedback has been sent to our development team. We appreciate you taking the time to help us improve Upkaar.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                📧 Our team will review your feedback and respond within 24-48 hours if you requested contact.
              </p>
            </div>
          </div>
        ) : (
          /* Feedback Form */
          <div className="p-6">
            {/* Feedback Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What type of feedback do you have?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      feedbackType === type.id
                        ? `${type.borderColor} ${type.bgColor}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <type.icon className={`w-6 h-6 ${type.color} mt-0.5`} />
                      <div>
                        <h4 className="font-semibold text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Subject and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Brief description of your feedback"
                  />
                </div>
                
                {feedbackType === 'bug' && (
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {feedbackType === 'bug' ? 'Describe the issue *' : 
                   feedbackType === 'suggestion' ? 'Describe your suggestion *' :
                   'Your message *'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                  placeholder={
                    feedbackType === 'bug' 
                      ? 'Please describe what happened, what you expected to happen, and steps to reproduce the issue...'
                      : feedbackType === 'suggestion'
                      ? 'Please describe your feature request or improvement suggestion in detail...'
                      : 'Share your thoughts, questions, or feedback...'
                  }
                />
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowContact"
                    name="allowContact"
                    checked={formData.allowContact}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="allowContact" className="ml-2 text-sm text-gray-700">
                    Allow our team to contact me about this feedback
                  </label>
                </div>

                {/* Technical Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Technical Information (automatically included)</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Page:</strong> {formData.page}</p>
                    <p><strong>Browser:</strong> {navigator.userAgent.split(' ').slice(-2).join(' ')}</p>
                    <p><strong>Screen:</strong> {window.innerWidth}x{window.innerHeight}</p>
                  </div>
                </div>
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Feedback</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;