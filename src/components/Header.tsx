import React, { useState } from 'react';
import { Menu, X, Home, Calendar, Building, Newspaper, Users, Tag, Search } from 'lucide-react';
import UserMenu from './UserMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigation = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'Events', href: '#events', icon: Calendar },
    { name: 'Business', href: '#business', icon: Building },
    { name: 'Classifieds', href: '#classifieds', icon: Tag },
    { name: 'News', href: '#news', icon: Newspaper },
    { name: 'Community', href: '#community', icon: Users },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Scroll to classifieds section and trigger search
      const classifiedsSection = document.getElementById('classifieds');
      if (classifiedsSection) {
        classifiedsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Dispatch custom event with search term
        window.dispatchEvent(new CustomEvent('headerSearch', { 
          detail: { searchTerm: searchTerm.trim() } 
        }));
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchOpen(false);
    // Dispatch event to clear search
    window.dispatchEvent(new CustomEvent('headerSearch', { 
      detail: { searchTerm: '' } 
    }));
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">उ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Upkaar</h1>
              <p className="text-xs text-gray-600">Tri-State Community</p>
            </div>
          </div>

          {/* Desktop Navigation with Search */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search classifieds..."
                      className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  title="Search Classifieds"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search</span>
                </button>
              )}
            </div>
          </div>

          {/* User Menu and Mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-colors duration-200"
              title="Search Classifieds"
            >
              <Search className="w-5 h-5" />
            </button>

            <UserMenu />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search classifieds..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                autoFocus
              />
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                Search through all classified ads in the community
              </p>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;