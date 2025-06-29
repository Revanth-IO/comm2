import React from 'react';
import { Award, Users, Heart, Star, MapPin } from 'lucide-react';

const CommunityHighlights = () => {
  const highlights = [
    {
      id: 1,
      type: 'Achievement',
      title: 'Dr. Priya Patel Wins Medical Excellence Award',
      description: 'Recognized for outstanding contributions to pediatric care in underserved communities.',
      location: 'Princeton, NJ',
      image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 2,
      type: 'Community Service',
      title: 'Free Food Distribution Drive',
      description: 'Local temple organized food distribution helping 500+ families during the pandemic.',
      location: 'Edison, NJ',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 3,
      type: 'Business Success',
      title: 'Indian Restaurant Chain Expands',
      description: 'Spice Route opens 5th location, employing 50+ community members across tri-state area.',
      location: 'Multiple Locations',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Software Engineer',
      location: 'Jersey City, NJ',
      quote: 'This platform helped me find the perfect apartment and connect with other Indian families in the area.',
      rating: 5
    },
    {
      id: 2,
      name: 'Meera Sharma',
      role: 'Teacher',
      location: 'Philadelphia, PA',
      quote: 'Amazing community events! My kids love the cultural programs and made so many friends.',
      rating: 5
    },
    {
      id: 3,
      name: 'Amit Patel',
      role: 'Business Owner',
      location: 'New York, NY',
      quote: 'Listing my restaurant here brought in so many customers. Great way to support Indian businesses.',
      rating: 5
    }
  ];

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Community Highlights */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Community Highlights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating achievements and positive impact of our community members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {highlights.map((highlight) => (
            <div key={highlight.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={highlight.image} 
                  alt={highlight.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className={`${highlight.bgColor} backdrop-blur-sm rounded-lg p-2`}>
                    <highlight.icon className={`w-4 h-4 ${highlight.color}`} />
                  </div>
                  <span className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-semibold text-gray-700">
                    {highlight.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                  {highlight.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {highlight.description}
                </p>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {highlight.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from community members who found their home away from home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Local Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Annual Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Service Categories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHighlights;