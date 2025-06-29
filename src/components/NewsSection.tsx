import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: 'New Indian Cultural Center Opens in Edison',
      excerpt: 'The tri-state area welcomes a new 50,000 sq ft cultural center featuring performance halls, classrooms, and community spaces.',
      author: 'Priya Sharma',
      date: '2 days ago',
      category: 'Community',
      image: 'https://images.pexels.com/photos/6664189/pexels-photo-6664189.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
      featured: true
    },
    {
      id: 2,
      title: 'Local Indian Startup Receives $5M Funding',
      excerpt: 'TechVeda Solutions, founded by immigrants from Gujarat, secures Series A funding for their AI healthcare platform.',
      author: 'Raj Patel',
      date: '1 week ago',
      category: 'Business',
      image: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
      featured: false
    },
    {
      id: 3,
      title: 'H-1B Visa Updates: What You Need to Know',
      excerpt: 'Latest changes to H-1B policies and how they affect Indian professionals in the tri-state area.',
      author: 'Attorney Kumar',
      date: '1 week ago',
      category: 'Immigration',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
      featured: false
    },
    {
      id: 4,
      title: 'Indian Students Excel in Regional Science Fair',
      excerpt: 'Students from local Indian families win top honors at the tri-state science competition with innovative projects.',
      author: 'Dr. Meera Singh',
      date: '2 weeks ago',
      category: 'Education',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
      featured: false
    }
  ];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Community News
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news affecting the Indian diaspora
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="md:flex">
                <div className="md:w-1/2 relative overflow-hidden">
                  <img 
                    src={news[0].image} 
                    alt={news[0].title}
                    className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    FEATURED
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {news[0].category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {news[0].date}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-200">
                    {news[0].title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {news[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{news[0].author}</span>
                    </div>
                    <button className="flex items-center text-orange-600 hover:text-orange-700 font-semibold group">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regular Articles */}
          {news.slice(1).map((article) => (
            <div key={article.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-semibold text-gray-700">
                  {article.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.date}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{article.author}</span>
                  </div>
                  <button className="flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm group">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-lg">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;