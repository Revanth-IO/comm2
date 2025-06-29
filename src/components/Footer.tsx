import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, MessageSquare } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Business Directory', href: '#business' },
    { name: 'News', href: '#news' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    { name: 'Immigration Help', href: '#immigration' },
    { name: 'Real Estate', href: '#realestate' },
    { name: 'Healthcare', href: '#healthcare' },
    { name: 'Education', href: '#education' },
    { name: 'Business Services', href: '#business-services' }
  ];

  const locations = [
    { city: 'New York', state: 'NY' },
    { city: 'Newark', state: 'NJ' },
    { city: 'Jersey City', state: 'NJ' },
    { city: 'Philadelphia', state: 'PA' },
    { city: 'Edison', state: 'NJ' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">उ</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Upkaar</h3>
                <p className="text-sm text-gray-400">Tri-State Community</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting and empowering the Indian diaspora across Pennsylvania, New Jersey, and New York through community, culture, and kindness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a 
                    href={service.href} 
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and Locations */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@upkaar.org</p>
                  <p className="text-gray-300">support@upkaar.org</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">(555) 123-4567</p>
                  <p className="text-gray-400 text-sm">Mon-Fri 9AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">dev@upkaar.org</p>
                  <p className="text-gray-400 text-sm">Technical Issues & Suggestions</p>
                </div>
              </div>
            </div>
            
            <h5 className="text-md font-semibold text-white mb-3">Serving Areas</h5>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={`${location.city}-${location.state}`} className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-300 text-sm">{location.city}, {location.state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 pt-12 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-semibold text-white mb-4">
              Stay Connected with Our Community
            </h4>
            <p className="text-gray-300 mb-6">
              Get the latest news, events, and community updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-200"
              />
              <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2022 Upkaar Tri-State Community. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;