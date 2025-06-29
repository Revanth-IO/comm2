import React, { useState } from 'react';
import { MapPin, Users, Calendar } from 'lucide-react';
import JoinCommunity from './JoinCommunity';

const Hero = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="home" className="bg-gradient-to-br from-orange-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your Indian Community
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
                in the Tri-State Area
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connecting Indians in Pennsylvania, New Jersey, and New York through events, 
              businesses, news, and cultural celebrations. Your gateway to community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={scrollToEvents}
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Explore Events
              </button>
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Join Community
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                <div className="text-gray-600">Community Members</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">200+</div>
                <div className="text-gray-600">Annual Events</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
                <div className="text-gray-600">Local Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JoinCommunity 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
      />
    </>
  );
};

export default Hero;