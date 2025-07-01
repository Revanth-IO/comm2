# 🌟 Upkaar - Indian Diaspora Community Website

Welcome to **Upkaar**, a comprehensive community platform designed to connect and serve the Indian diaspora in the tri-state area (Pennsylvania, New Jersey, and Delaware). Our platform brings together community members through events, business networking, classifieds, and cultural engagement.

## 🎯 Mission

Upkaar aims to strengthen the bonds within the Indian diaspora community by providing a centralized platform for:
- **Community Events** - Discover and participate in cultural and social gatherings
- **Business Networking** - Connect with Indian-owned businesses and professionals
- **Classifieds** - Buy, sell, and trade within the community
- **Cultural Exchange** - Share news, stories, and celebrate our heritage together

## ✨ Features

### 🏠 **Homepage**
- **Hero Section** - Welcome message and community overview
- **Featured Events** - Upcoming community events and gatherings
- **Business Directory** - Searchable directory of Indian businesses
- **Classifieds Section** - Community marketplace for buying/selling
- **News Section** - Latest community news and updates
- **Services Section** - Available community services
- **Community Highlights** - Showcasing community achievements

### 🔐 **User Management**
- **Google Sign-In Integration** - Secure authentication via Google OAuth
- **User Profiles** - Personalized user experience
- **Guest Posting** - Limited posting capabilities for non-registered users
- **Admin Panel** - Content moderation and user management

### 📝 **Content Management**
- **Post Creation** - Easy-to-use posting interface
- **Approval System** - Moderated content for quality assurance
- **Feedback System** - User suggestions and issue reporting
- **Search Functionality** - Comprehensive search across all content

### 🛠️ **Administrative Features**
- **Database Management** - Built-in tools for data management
- **Content Moderation** - Approve/reject user submissions
- **User Management** - Manage community members
- **Analytics Dashboard** - Monitor community engagement

## 🚀 Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Lucide React** - Beautiful and consistent icons
- **Vite** - Fast build tool and development server

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - Authentication and user management
- **Google OAuth** - Secure sign-in integration

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **Terser** - JavaScript minification for production builds

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account for database
- Google Cloud Console account for OAuth

### **1. Clone the Repository**
```bash
git clone https://github.com/Revanth-IO/comm2.git
cd comm2
```

2. Install Dependencies
`npm install`
3. Environment Configuration
Create a .env file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
4. Database Setup
Create a new Supabase project
Run the SQL scripts from SUPABASE_SETUP.md
Configure Row Level Security (RLS) policies
Set up the required tables and relationships
5. Google OAuth Setup
Create a project in Google Cloud Console
Enable Google+ API
Create OAuth 2.0 credentials
Add authorized domains
6. Start Development Server
npm run dev
The application will be available at http://localhost:5173

🏗️ Project Structure
src/
├── components/          # React components
│   ├── AdminPanel.tsx          # Admin dashboard
│   ├── BusinessDirectory.tsx   # Business listings
│   ├── ClassifiedsSection.tsx  # Marketplace
│   ├── FeaturedEvents.tsx      # Events display
│   ├── Header.tsx              # Navigation
│   ├── Hero.tsx                # Landing section
│   ├── FeedbackButton.tsx      # User feedback
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
🛠️ Available Scripts
# Development
npm run dev                 # Start development server
npm run preview            # Preview production build
# Building
npm run build              # Build for production
npm run build:production   # Build with linting
# Code Quality
npm run lint               # Run ESLint
🌐 Deployment
Production Build
npm run build:production
Deployment Options
The project is configured for deployment on:

Namecheap Hosting (with cPanel)
Vercel (recommended for React apps)
Netlify
Supabase Hosting
Refer to DEPLOYMENT.md for detailed deployment instructions.

📖 Documentation
Database Integration Guide - Supabase setup and configuration
Deployment Guide - Production deployment instructions
cPanel Reset Guide - Hosting troubleshooting
Supabase Setup - Database schema and configuration
🤝 Contributing
We welcome contributions from the community! Please follow these guidelines:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Code Style
Follow TypeScript best practices
Use ESLint configuration provided
Write meaningful commit messages
Add comments for complex logic
🐛 Bug Reports & Feature Requests
Use the Feedback Button within the application
Create GitHub issues for bugs and feature requests
Provide detailed descriptions and steps to reproduce
📧 Support & Contact
Website: https://upkaar.org
Email: Contact through the website feedback form
Community: Join our events and connect with other members
📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Supabase for providing excellent backend-as-a-service
React & TypeScript communities for robust development tools
Tailwind CSS for beautiful and responsive design
Indian Diaspora Community for their continuous support and feedback
Made with ❤️ for the Indian diaspora community in Pennsylvania, New Jersey, and Delaware

🔄 Version History
v1.0.0 - Initial release with core features
Current - Enhanced user feedback system and improved admin panel
This README is regularly updated. Last updated: July 2025
