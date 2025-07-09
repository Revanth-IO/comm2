import React from 'react';
import { Scale, Home, Heart, GraduationCap, Car, Briefcase } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Immigration Services',
      description: 'Expert legal assistance for visas, green cards, and citizenship applications.',
      icon: Scale,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      providers: '25+ Attorneys'
    },
    {
      id: 2,
      title: 'Real Estate',
      description: 'Find your dream home with agents who understand Indian families.',
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      providers: '40+ Realtors'
    },
    {
      id: 3,
      title: 'Healthcare',
      description: 'Comprehensive medical care with Hindi and regional language support.',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      providers: '60+ Doctors'
    },
    {
      id: 4,
      title: 'Education',
      description: 'Tutoring, test prep, and college counseling for academic success.',
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      providers: '30+ Tutors'
    },
    {
      id: 5,
      title: 'Auto Services',
      description: 'Trusted mechanics, dealers, and insurance agents for your vehicle needs.',
      icon: Car,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      providers: '20+ Services'
    },
    {
      id: 6,
      title: 'Business Services',
      description: 'Accounting, tax preparation, and business consulting services.',
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      providers: '35+ Professionals'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Essential Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional services tailored for the Indian community's unique needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-gray-200">
              <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-8 h-8 ${service.color}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {service.providers}
                </span>
                <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm hover:underline transition-colors duration-200">
                  Explore →
                </button>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need a Service Not Listed?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our community network is extensive. Contact us and we'll help connect you with trusted professionals.
          </p>
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;