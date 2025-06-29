import React from 'react';
import { Star, MapPin, Phone, ExternalLink } from 'lucide-react';

const BusinessDirectory = () => {
  const businesses = [
    {
      id: 1,
      name: 'Spice Garden Restaurant',
      category: 'Restaurant',
      rating: 4.8,
      reviews: 234,
      location: 'Edison, NJ',
      phone: '(732) 555-0123',
      description: 'Authentic North Indian cuisine with traditional recipes passed down through generations.',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      featured: true
    },
    {
      id: 2,
      name: 'Patel Immigration Law',
      category: 'Legal Services',
      rating: 4.9,
      reviews: 156,
      location: 'Jersey City, NJ',
      phone: '(201) 555-0456',
      description: 'Specialized immigration attorney with 15+ years helping Indian families.',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      featured: true
    },
    {
      id: 3,
      name: 'Mumbai Market',
      category: 'Grocery Store',
      rating: 4.7,
      reviews: 89,
      location: 'Jackson Heights, NY',
      phone: '(718) 555-0789',
      description: 'Fresh Indian groceries, spices, and specialty items imported weekly.',
      image: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      featured: false
    },
    {
      id: 4,
      name: 'Sharma Real Estate',
      category: 'Real Estate',
      rating: 4.6,
      reviews: 67,
      location: 'Philadelphia, PA',
      phone: '(215) 555-0321',
      description: 'Helping Indian families find their dream homes in the tri-state area.',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      featured: false
    },
    {
      id: 5,
      name: 'Bollywood Dance Studio',
      category: 'Entertainment',
      rating: 4.9,
      reviews: 123,
      location: 'Manhattan, NY',
      phone: '(212) 555-0654',
      description: 'Professional dance classes for all ages in classical and modern Indian dance.',
      image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      featured: true
    },
    {
      id: 6,
      name: 'Indian Medical Center',
      category: 'Healthcare',
      rating: 4.8,
      reviews: 201,
      location: 'Princeton, NJ',
      phone: '(609) 555-0987',
      description: 'Comprehensive healthcare services with Hindi and Gujarati speaking doctors.',
      image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      featured: false
    }
  ];

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