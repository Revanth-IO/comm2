import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, DollarSign, Clock, Eye, Heart, Share2, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { useClassifieds } from '../hooks/useClassifieds';

const ClassifiedsSection: React.FC = () => {
  const { classifieds, isLoading, error } = useClassifieds();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination state
  const [displayCount, setDisplayCount] = useState(6); // Show 6 initially
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = ['All', 'For Sale', 'Housing', 'Jobs', 'Services', 'Community'];
  const locations = ['All Locations', 'PA', 'NJ', 'DE', 'Philadelphia, PA', 'Jersey City, NJ', 'Wilmington, DE', 'Newark, DE', 'Edison, NJ'];

  // Listen for search events from header
  useEffect(() => {
    const handleHeaderSearch = (event: CustomEvent) => {
      const { searchTerm: headerSearchTerm } = event.detail;
      setSearchTerm(headerSearchTerm);
      if (headerSearchTerm) {
        setShowAdvancedFilters(false); // Close advanced filters when searching from header
      }
    };

    window.addEventListener('headerSearch', handleHeaderSearch as EventListener);
    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch as EventListener);
    };
  }, []);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(6);
  }, [searchTerm, selectedCategory, sortBy, priceRange, locationFilter, dateFilter]);

  const filteredClassifieds = classifieds.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.contactInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || ad.category === selectedCategory;
    
    const matchesLocation = !locationFilter || locationFilter === 'All Locations' || 
                           ad.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesPrice = (!priceRange.min || !ad.price || ad.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || !ad.price || ad.price <= parseFloat(priceRange.max));
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const adDate = new Date(ad.createdAt);
      const now = new Date();
      const diffDays = Math.ceil((now.getTime() - adDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return diffDays <= 1;
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        default: return true;
      }
    })();
    
    const isApproved = ad.status === 'approved';
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesDate && isApproved;
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
      case 'title':
        return a.title.localeCompare(b.title);
      case 'location':
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
  });

  // Get the classifieds to display (with pagination)
  const displayedClassifieds = sortedClassifieds.slice(0, displayCount);
  const hasMoreToLoad = displayCount < sortedClassifieds.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDisplayCount(prev => Math.min(prev + 6, sortedClassifieds.length));
    setIsLoadingMore(false);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setLocationFilter('');
    setDateFilter('all');
    setShowAdvancedFilters(false);
    setDisplayCount(6);
  };

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

  if (error) {
    return (
      <section id="classifieds" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Classifieds</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

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
          {searchTerm && (
            <div className="mt-4 bg-orange-100 border border-orange-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-orange-800 font-medium">
                🔍 Searching for: "{searchTerm}"
              </p>
            </div>
          )}
          {classifieds.length > 0 && (
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ Database Connected
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                📊 {classifieds.filter(ad => ad.status === 'approved').length} Published Ads
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                📝 {classifieds.length} Total Ads
              </div>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                🔄 Real-time Updates
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Local Search Bar (Secondary) */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Refine your search here or use the search bar above..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-3 border rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  showAdvancedFilters 
                    ? 'bg-orange-100 border-orange-300 text-orange-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              {(searchTerm || selectedCategory !== 'All' || locationFilter || priceRange.min || priceRange.max || dateFilter !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {locations.map(location => (
                      <option key={location} value={location === 'All Locations' ? '' : location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posted</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">Any time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="title">Title A-Z</option>
                    <option value="location">Location A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
            <span>
              Showing {displayedClassifieds.length} of {sortedClassifieds.length} results
              {searchTerm && ` for "${searchTerm}"`}
            </span>
            {sortedClassifieds.length !== classifieds.filter(ad => ad.status === 'approved').length && (
              <span className="text-orange-600 font-medium">
                Filters applied
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Classifieds...</h3>
            <p className="text-gray-600">Fetching the latest ads from our database</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedClassifieds.map((ad) => (
              <div key={ad.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${ad.featured ? 'ring-2 ring-orange-200' : ''}`}>
                {ad.featured && (
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs font-semibold px-3 py-1 text-center">
                    FEATURED
                  </div>
                )}
                
                <div className="relative overflow-hidden">
                  <img 
                    src={ad.images[0] || 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'} 
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
        )}

        {!isLoading && sortedClassifieds.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classifieds found</h3>
            <p className="text-gray-600 mb-4">
              {classifieds.length === 0 
                ? "No classified ads have been posted yet. Be the first to post!" 
                : searchTerm 
                ? `No results found for "${searchTerm}". Try different keywords or clear your search.`
                : "Try adjusting your search terms or filters"
              }
            </p>
            {(searchTerm || selectedCategory !== 'All' || locationFilter || priceRange.min || priceRange.max || dateFilter !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && hasMoreToLoad && (
          <div className="text-center mt-12">
            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                Showing {displayedClassifieds.length} of {sortedClassifieds.length} classifieds
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 max-w-md mx-auto">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(displayedClassifieds.length / sortedClassifieds.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading More...</span>
                </>
              ) : (
                <>
                  <span>Load More Classifieds</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    +{Math.min(6, sortedClassifieds.length - displayedClassifieds.length)}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* All Loaded Message */}
        {!isLoading && !hasMoreToLoad && sortedClassifieds.length > 6 && (
          <div className="text-center mt-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-green-800 font-medium">
                ✅ All {sortedClassifieds.length} classifieds loaded!
              </p>
              <p className="text-green-600 text-sm mt-1">
                You've reached the end of the results.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClassifiedsSection;