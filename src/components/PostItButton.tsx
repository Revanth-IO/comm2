import React, { useState } from 'react';
import { Plus, PenTool } from 'lucide-react';
import CreateClassifiedModal from './CreateClassifiedModal';
import { useAuth } from '../hooks/useAuth';

const PostItButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasPermission } = useAuth();

  const canCreateClassified = hasPermission('add_classified');

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-40 group"
        title="Post a Classified Ad"
      >
        <div className="flex items-center space-x-2">
          <PenTool className="w-6 h-6" />
          <span className="hidden sm:inline font-semibold">Post It</span>
        </div>
        
        {/* Tooltip for mobile */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap sm:hidden">
          Post a Classified Ad
        </div>
      </button>

      <CreateClassifiedModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default PostItButton;