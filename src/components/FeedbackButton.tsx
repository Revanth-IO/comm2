import React, { useState } from 'react';
import { MessageSquare, Bug, Lightbulb } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-40 group"
        title="Send Feedback"
      >
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-6 h-6" />
          <span className="hidden sm:inline font-semibold">Feedback</span>
        </div>
        
        {/* Tooltip for mobile */}
        <div className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap sm:hidden">
          Send Feedback
        </div>
      </button>

      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default FeedbackButton;