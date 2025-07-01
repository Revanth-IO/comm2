import React from 'react';
import { Heart, Users, Code, Globe, Mail, Github, Linkedin } from 'lucide-react';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'Seema',
      role: 'Lead Developer & Community Manager',
      bio: 'Passionate about building technology that connects communities and empowers immigrants.',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skills: ['React', 'Community Building', 'Product Strategy']
    },
    {
      name: 'Shristi',
      role: 'Full Stack Developer',
      bio: 'Dedicated to creating seamless user experiences and robust backend systems.',
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skills: ['Node.js', 'Database Design', 'API Development']
    },
    {
      name: 'Purvi',
      role: 'Frontend Developer & UX Designer',
      bio: 'Focused on creating beautiful, accessible interfaces that serve our diverse community.',
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skills: ['UI/UX Design', 'React', 'Accessibility']
    },
    {
      name: 'Khwahish',
      role: 'Backend Developer & DevOps',
      bio: 'Ensuring our platform is secure, scalable, and reliable for our growing community.',
      avatar: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skills: ['DevOps', 'Security', 'Cloud Infrastructure']
    },
    {
      name: 'Shashank',
      role: 'Full Stack Developer',
      bio: 'Building features that help community members connect and support each other.',
      avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skills: ['JavaScript', 'Database Management', 'Testing']
    },
    {
      name: 'Karthik',
      role: 'Mobile Developer & QA',
      bio: 'Ensuring our platform works seamlessly across all devices and platforms.',
      avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skills: ['Mobile Development', 'Quality Assurance', 'Cross-platform Testing']
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'Every decision we make is guided by what\'s best for our community members and their families.'
    },
    {
      icon: Users,
      title: 'Volunteer Driven',
      description: 'We\'re a team of volunteers passionate about helping fellow immigrants navigate life in America.'
    },
    {
      icon: Globe,
      title: 'Cultural Bridge',
      description: 'We help preserve Indian culture while facilitating integration into American society.'
    },
    {
      icon: Code,
      title: 'Open & Transparent',
      description: 'We believe in transparency, open communication, and building trust within our community.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            About Upkaar
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Upkaar is currently run by a dedicated team of <strong>volunteers</strong> who are passionate about 
              helping fellow immigrants get and provide help within our community.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe in the power of community support and are committed to creating a platform where 
              Indian diaspora members can connect, share resources, and build meaningful relationships 
              across Pennsylvania, New Jersey, and Delaware.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              To create a supportive digital ecosystem where Indian immigrants can find community, 
              share resources, discover opportunities, and maintain cultural connections while 
              building new lives in America.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Development Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Meet Our Development Team
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our volunteer development team works tirelessly to build and maintain this platform 
              for our community, contributing their time and expertise to help fellow immigrants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
                      <p className="text-orange-600 font-medium text-sm">{member.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{member.bio}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Impact */}
        <div className="bg-gradient-to-r from-orange-600 to-green-600 rounded-2xl text-white p-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">Volunteer Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-orange-100">Volunteer Run</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-orange-100">Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-orange-100">Hours Contributed</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-orange-100">Community Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* How We Help */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How We Help Our Community</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🤝 Getting Help</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Find housing, jobs, and essential services</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Connect with experienced community members</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Access immigration and legal resources</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Discover cultural events and celebrations</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">💝 Providing Help</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Share your expertise and experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Mentor newcomers to the community</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>List your business or services</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Organize community events and activities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Join Us */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to Help?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate volunteers to help grow and improve our platform. 
            Whether you're a developer, designer, community organizer, or just someone who wants to help, 
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Join Our Team
            </button>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors duration-200 shadow-lg">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;