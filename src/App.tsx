import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedEvents from './components/FeaturedEvents';
import BusinessDirectory from './components/BusinessDirectory';
import NewsSection from './components/NewsSection';
import ServicesSection from './components/ServicesSection';
import CommunityHighlights from './components/CommunityHighlights';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedEvents />
      <BusinessDirectory />
      <NewsSection />
      <ServicesSection />
      <CommunityHighlights />
      <Footer />
    </div>
  );
}

export default App;