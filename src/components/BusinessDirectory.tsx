import React, { useState, useEffect } from 'react';
import { Star, MapPin, Phone, ExternalLink } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
const supabase = getSupabaseClient();

const BusinessDirectory = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*');

      if (error) {
        console.error('Error fetching businesses:', error);
      } else {
        setBusinesses(data);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  const categories = ['All', 'Restaurant', 'Legal Services', 'Grocery Store', 'Real Estate', 'Entertainment', 'Healthcare'];

  return (
    <section id="business" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Business Directory
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover trusted Indian-owned businesses and services in your area
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-200 font-medium"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business) => (
            <div key={business.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${business.featured ? 'ring-2 ring-orange-200 ring-opacity-50' : ''}`}>
              {business.featured && (
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-semibold px-3 py-1 text-center">
                  FEATURED
                </div>
              )}
              
              <div className="relative overflow-hidden">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-700">
                  {business.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                    {business.name}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors duration-200" />
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(business.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {business.rating} ({business.reviews} reviews)
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {business.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{business.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">{business.phone}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-2 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 text-sm">
                    Contact
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-lg">
            Browse All Businesses
          </button>
        </div>
      </div>
    </section>
  );
};

export default BusinessDirectory;