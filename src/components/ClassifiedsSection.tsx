import React, { useState } from 'react';
import { Search, Filter, MapPin, DollarSign, Clock, Eye, Heart, Share2 } from 'lucide-react';
import { ClassifiedAd } from '../types';

const ClassifiedsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - in a real app, this would come from your backend
  const classifieds: ClassifiedAd[] = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max - Excellent Condition',
      description: 'Barely used iPhone 14 Pro Max, 256GB, Space Black. Includes original box, charger, and screen protector. No scratches or damage.',
      category: 'For Sale',
      subcategory: 'Electronics',
      price: 899,
      location: 'Edison, NJ',
      contactInfo: {
        name: 'Raj Patel',
        email: 'raj.patel@email.com',
        phone: '(732) 555-0123'
      },
      images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'approved',
      authorId: '1',
      authorName: 'Raj Patel',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      expiresAt: '2024-02-15T10:00:00Z',
      featured: true
    },
    {
      id: '2',
      title: '2BR Apartment for Rent - Jersey City',
      description: 'Beautiful 2-bedroom apartment in prime Jersey City location. Close to PATH train, grocery stores, and restaurants. Parking included.',
      category: 'Housing',
      subcategory: 'Apartments for Rent',
      price: 2800,
      location: 'Jersey City, NJ',
      contactInfo: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '(201) 555-0456'
      },
      images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'approved',
      authorId: '2',
      authorName: 'Priya Sharma',
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      expiresAt: '2024-02-14T15:30:00Z',
      featured: false
    },
    {
      id: '3',
      title: 'Math Tutoring Services - All Levels',
      description: 'Experienced math tutor offering personalized lessons for students from elementary to college level. Specializing in SAT/ACT prep.',
      category: 'Services',
      subcategory: 'Tutoring',
      price: 50,
      location: 'Princeton, NJ',
      contactInfo: {
        name: 'Dr. Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '(609) 555-0789'
      },
      images: ['https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
      status: 'approved',
      authorId: '3',
      authorName: 'Dr. Amit Kumar',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      expiresAt: '2024-02-13T09:15:00Z',
      featured: false
    }
  ];

  const categories = ['All', 'For Sale', 'Housing', 'Jobs', 'Services', 'Community'];

  const filteredClassifieds = classifieds.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedClassifieds = [...filteredClassifieds].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  const formatPrice = (price?: number) => {
    if (!price) return 'Contact for price';
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <section id="classifieds" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Community Classifieds
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Buy, sell, rent, and find services within the Indian community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classifieds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 appearance-none bg-white min-w-[150px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-white min-w-[150px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClassifieds.map((ad) => (
            <div key={ad.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${ad.featured ? 'ring-2 ring-orange-200' : ''}`}>
              {ad.featured && (
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-semibold px-3 py-1 text-center">
                  FEATURED
                </div>
              )}
              
              <div className="relative overflow-hidden">
                <img 
                  src={ad.images[0]} 
                  alt={ad.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-700">
                  {ad.category}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                    {ad.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                  {ad.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="text-sm">{ad.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-sm">{formatDate(ad.createdAt)}</span>
                    </div>
                  </div>
                  
                  {ad.price && (
                    <div className="flex items-center text-orange-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="text-lg font-bold">{formatPrice(ad.price)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-2 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 text-sm flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 text-sm">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedClassifieds.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classifieds found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-lg">
            Load More Classifieds
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClassifiedsSection;