import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Diwali Festival Celebration',
      date: 'October 28, 2024',
      time: '6:00 PM - 11:00 PM',
      location: 'Newark, DE',
      attendees: 500,
      image: 'https://images.pexels.com/photos/6664189/pexels-photo-6664189.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
      description: 'Join us for the grand Diwali celebration with traditional performances, food, and fireworks.'
    },
    {
      id: 2,
      title: 'Bollywood Dance Workshop',
      date: 'November 5, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'Jersey City, NJ',
      attendees: 50,
      image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
      description: 'Learn classical and modern Bollywood dance moves from professional instructors.'
    },
    {
      id: 3,
      title: 'Indian Entrepreneurs Meet',
      date: 'November 12, 2024',
      time: '7:00 PM - 9:00 PM',
      location: 'Wilmington, DE',
      attendees: 100,
      image: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
      description: 'Network with successful Indian entrepreneurs and share business insights.'
    }
  ];

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join upcoming celebrations, workshops, and community gatherings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{event.attendees}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-lg">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;