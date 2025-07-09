import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedEvents from './components/FeaturedEvents';
import BusinessDirectory from './components/BusinessDirectory';
import ClassifiedsSection from './components/ClassifiedsSection';
import NewsSection from './components/NewsSection';
import ServicesSection from './components/ServicesSection';
import CommunityHighlights from './components/CommunityHighlights';
import Footer from './components/Footer';
import PostItButton from './components/PostItButton';
import FeedbackButton from './components/FeedbackButton';
import { NotificationProvider } from './contexts/NotificationProvider';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Hero />
          <FeaturedEvents />
          <BusinessDirectory />
          <ClassifiedsSection />
          <NewsSection />
          <ServicesSection />
          <CommunityHighlights />
          <Footer />
          <PostItButton />
          <FeedbackButton />
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;