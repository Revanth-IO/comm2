import { supabase } from '../lib/supabase';

export const insertMockData = async () => {
  try {
    console.log('🔄 Starting mock data insertion...');

    // Check if we can connect to Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'your-supabase-url' || 
        supabaseKey === 'your-supabase-anon-key') {
      throw new Error('Supabase not configured. Please set up your environment variables.');
    }

    // 1. Insert Categories (if they don't exist)
    console.log('📂 Inserting categories...');
    const { data: existingCategories } = await supabase.from('categories').select('id');
    
    if (!existingCategories || existingCategories.length === 0) {
      const { error: categoriesError } = await supabase.from('categories').insert([
        {
          name: 'For Sale',
          type: 'classified',
          subcategories: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Home & Garden', 'Sports & Recreation']
        },
        {
          name: 'Housing',
          type: 'classified',
          subcategories: ['Apartments for Rent', 'Houses for Rent', 'Rooms for Rent', 'Real Estate for Sale', 'Roommates']
        },
        {
          name: 'Jobs',
          type: 'classified',
          subcategories: ['Full-time', 'Part-time', 'Contract', 'Internships', 'Freelance']
        },
        {
          name: 'Services',
          type: 'classified',
          subcategories: ['Home Services', 'Professional Services', 'Tutoring', 'Healthcare', 'Beauty & Wellness', 'Transportation']
        },
        {
          name: 'Community',
          type: 'classified',
          subcategories: ['Events', 'Classes', 'Groups', 'Volunteers', 'Lost & Found']
        },
        {
          name: 'Cultural Events',
          type: 'event',
          subcategories: ['Festivals', 'Religious', 'Music & Dance', 'Art & Literature']
        },
        {
          name: 'Business Events',
          type: 'event',
          subcategories: ['Networking', 'Workshops', 'Conferences', 'Trade Shows']
        },
        {
          name: 'Community Events',
          type: 'event',
          subcategories: ['Meetups', 'Sports', 'Family', 'Volunteer']
        },
        {
          name: 'Restaurants',
          type: 'business',
          subcategories: ['North Indian', 'South Indian', 'Street Food', 'Sweets', 'Catering']
        },
        {
          name: 'Services',
          type: 'business',
          subcategories: ['Legal', 'Medical', 'Financial', 'Real Estate', 'Education']
        },
        {
          name: 'Retail',
          type: 'business',
          subcategories: ['Grocery', 'Clothing', 'Jewelry', 'Electronics', 'Books']
        }
      ]);

      if (categoriesError) {
        console.error('❌ Error inserting categories:', categoriesError);
      } else {
        console.log('✅ Categories inserted successfully');
      }
    } else {
      console.log('ℹ️ Categories already exist, skipping...');
    }

    // 2. Insert Classified Ads
    console.log('🏷️ Inserting classified ads...');
    const classifiedAds = [
      {
        title: 'iPhone 14 Pro Max - Excellent Condition',
        description: 'Barely used iPhone 14 Pro Max, 256GB, Space Black. Includes original box, charger, and screen protector. No scratches or damage. Perfect for someone looking for a premium phone at a great price.',
        category_id: 1,
        subcategory: 'Electronics',
        price: 899.00,
        location: 'Edison, NJ',
        contact_name: 'Raj Patel',
        contact_email: 'raj.patel@email.com',
        contact_phone: '(732) 555-0123',
        images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'approved',
        author_name: 'Raj Patel',
        featured: true
      },
      {
        title: '2BR Apartment for Rent - Jersey City',
        description: 'Beautiful 2-bedroom apartment in prime Jersey City location. Close to PATH train, grocery stores, and restaurants. Parking included. Hardwood floors, updated kitchen, and great natural light.',
        category_id: 2,
        subcategory: 'Apartments for Rent',
        price: 2800.00,
        location: 'Jersey City, NJ',
        contact_name: 'Priya Sharma',
        contact_email: 'priya.sharma@email.com',
        contact_phone: '(201) 555-0456',
        images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'approved',
        author_name: 'Priya Sharma',
        featured: false
      },
      {
        title: 'Math Tutoring Services - All Levels',
        description: 'Experienced math tutor offering personalized lessons for students from elementary to college level. Specializing in SAT/ACT prep, calculus, algebra, and statistics. Flexible scheduling available.',
        category_id: 4,
        subcategory: 'Tutoring',
        price: 50.00,
        location: 'Princeton, NJ',
        contact_name: 'Dr. Amit Kumar',
        contact_email: 'amit.kumar@email.com',
        contact_phone: '(609) 555-0789',
        images: ['https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'approved',
        author_name: 'Dr. Amit Kumar',
        featured: false
      },
      {
        title: 'Software Engineer Position - Remote',
        description: 'Looking for experienced React developer for remote position. Competitive salary and benefits. Must have 3+ years experience with React, TypeScript, and Node.js. Great opportunity for career growth.',
        category_id: 3,
        subcategory: 'Full-time',
        location: 'Remote',
        contact_name: 'HR Team',
        contact_email: 'hr@techcompany.com',
        contact_phone: '(555) 123-4567',
        images: ['https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'pending',
        author_name: 'HR Team',
        featured: false
      },
      {
        title: 'Wedding Photography Services',
        description: 'Professional wedding photographer with 10+ years experience. Packages starting from $1500. Includes engagement session, full wedding day coverage, and edited digital gallery. Available for tri-state area.',
        category_id: 4,
        subcategory: 'Professional Services',
        price: 1500.00,
        location: 'Philadelphia, PA',
        contact_name: 'Sarah Johnson',
        contact_email: 'sarah@photography.com',
        contact_phone: '(215) 555-9876',
        images: ['https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'pending',
        author_name: 'Sarah Johnson',
        featured: false
      },
      {
        title: 'Car for Sale - Honda Civic 2020',
        description: 'Well-maintained Honda Civic 2020, low mileage (25,000 miles), excellent condition. Single owner, all service records available. Clean title, no accidents. Great fuel economy.',
        category_id: 1,
        subcategory: 'Vehicles',
        price: 18500.00,
        location: 'Wilmington, DE',
        contact_name: 'Mike Chen',
        contact_email: 'mike.chen@email.com',
        contact_phone: '(302) 555-1234',
        images: ['https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'pending',
        author_name: 'Mike Chen',
        featured: false
      },
      {
        title: 'Dining Table Set - 6 Chairs',
        description: 'Beautiful solid wood dining table with 6 matching chairs. Perfect for family dinners and entertaining. Excellent condition, no scratches or damage. Must sell due to moving.',
        category_id: 1,
        subcategory: 'Furniture',
        price: 450.00,
        location: 'Newark, DE',
        contact_name: 'Lisa Patel',
        contact_email: 'lisa.patel@email.com',
        contact_phone: '(302) 555-5678',
        images: ['https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'approved',
        author_name: 'Lisa Patel',
        featured: false
      },
      {
        title: 'Room for Rent - Shared House',
        description: 'Furnished room available in shared house with Indian family. Kitchen privileges, WiFi included. Close to public transportation. Vegetarian household. Perfect for students or young professionals.',
        category_id: 2,
        subcategory: 'Rooms for Rent',
        price: 800.00,
        location: 'Edison, NJ',
        contact_name: 'Ravi Sharma',
        contact_email: 'ravi.sharma@email.com',
        contact_phone: '(732) 555-9999',
        images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'approved',
        author_name: 'Ravi Sharma',
        featured: false
      },
      {
        title: 'Laptop for Sale - MacBook Air M2',
        description: 'MacBook Air M2, 13-inch, 256GB SSD, 8GB RAM. Purchased 6 months ago, barely used. Includes original charger and box. Perfect for students or professionals.',
        category_id: 1,
        subcategory: 'Electronics',
        price: 950.00,
        location: 'Jersey City, NJ',
        contact_name: 'Anita Gupta',
        contact_email: 'anita.gupta@email.com',
        contact_phone: '(201) 555-7777',
        images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'pending',
        author_name: 'Anita Gupta',
        featured: false
      },
      {
        title: 'House Cleaning Services',
        description: 'Professional house cleaning services available. Weekly, bi-weekly, or monthly cleaning. Experienced, reliable, and affordable. References available upon request. Serving tri-state area.',
        category_id: 4,
        subcategory: 'Home Services',
        price: 120.00,
        location: 'Philadelphia, PA',
        contact_name: 'Maria Rodriguez',
        contact_email: 'maria@cleaningservice.com',
        contact_phone: '(215) 555-3333',
        images: ['https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
        status: 'approved',
        author_name: 'Maria Rodriguez',
        featured: false
      }
    ];

    const { error: classifiedsError } = await supabase
      .from('classified_ads')
      .insert(classifiedAds);

    if (classifiedsError) {
      console.error('❌ Error inserting classified ads:', classifiedsError);
    } else {
      console.log('✅ Classified ads inserted successfully');
    }

    // 3. Insert Events
    console.log('📅 Inserting events...');
    const events = [
      {
        title: 'Diwali Festival Celebration',
        description: 'Join us for the grand Diwali celebration with traditional performances, food, and fireworks. Family-friendly event with activities for all ages. Traditional Indian food will be served.',
        event_date: '2024-10-28',
        event_time: '18:00:00',
        location: 'Newark, DE',
        category_id: 6,
        organizer: 'Indian Cultural Center',
        contact_name: 'Event Coordinator',
        contact_email: 'events@icc.org',
        contact_phone: '(302) 555-1111',
        image_url: 'https://images.pexels.com/photos/6664189/pexels-photo-6664189.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
        max_attendees: 500,
        registration_required: true,
        status: 'approved',
        featured: true
      },
      {
        title: 'Bollywood Dance Workshop',
        description: 'Learn classical and modern Bollywood dance moves from professional instructors. Suitable for all skill levels. Wear comfortable clothing and bring water.',
        event_date: '2024-11-05',
        event_time: '14:00:00',
        location: 'Jersey City, NJ',
        category_id: 6,
        organizer: 'Dance Academy',
        contact_name: 'Dance Instructor',
        contact_email: 'dance@academy.com',
        contact_phone: '(201) 555-2222',
        image_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
        max_attendees: 50,
        registration_required: true,
        status: 'approved',
        featured: false
      },
      {
        title: 'Indian Entrepreneurs Meet',
        description: 'Network with successful Indian entrepreneurs and share business insights. Panel discussion followed by networking session. Light refreshments will be provided.',
        event_date: '2024-11-12',
        event_time: '19:00:00',
        location: 'Wilmington, DE',
        category_id: 7,
        organizer: 'Business Network',
        contact_name: 'Business Coordinator',
        contact_email: 'business@network.org',
        contact_phone: '(302) 555-3333',
        image_url: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
        max_attendees: 100,
        registration_required: true,
        status: 'approved',
        featured: false
      },
      {
        title: 'Holi Color Festival',
        description: 'Celebrate the festival of colors with music, dance, and traditional Holi colors. Bring white clothes to get colorful! Food stalls and cultural performances.',
        event_date: '2024-03-15',
        event_time: '11:00:00',
        location: 'Edison, NJ',
        category_id: 6,
        organizer: 'Community Center',
        contact_name: 'Festival Organizer',
        contact_email: 'holi@community.org',
        contact_phone: '(732) 555-4444',
        image_url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
        max_attendees: 300,
        registration_required: false,
        status: 'pending',
        featured: true
      },
      {
        title: 'Yoga and Meditation Workshop',
        description: 'Learn traditional yoga and meditation techniques. Suitable for beginners and experienced practitioners. Bring your own yoga mat. Guided by certified instructor.',
        event_date: '2024-11-20',
        event_time: '09:00:00',
        location: 'Princeton, NJ',
        category_id: 8,
        organizer: 'Wellness Center',
        contact_name: 'Yoga Instructor',
        contact_email: 'yoga@wellness.com',
        contact_phone: '(609) 555-5555',
        image_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
        max_attendees: 30,
        registration_required: true,
        status: 'pending',
        featured: false
      }
    ];

    const { error: eventsError } = await supabase
      .from('events')
      .insert(events);

    if (eventsError) {
      console.error('❌ Error inserting events:', eventsError);
    } else {
      console.log('✅ Events inserted successfully');
    }

    // 4. Insert Businesses
    console.log('🏢 Inserting businesses...');
    const businesses = [
      {
        name: 'Spice Garden Restaurant',
        description: 'Authentic North Indian cuisine with traditional recipes passed down through generations. Family-owned restaurant serving the community for over 15 years.',
        category_id: 9,
        address: '123 Main St, Edison, NJ 08817',
        phone: '(732) 555-0123',
        email: 'info@spicegarden.com',
        website: 'https://spicegarden.com',
        hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
        image_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        rating: 4.8,
        review_count: 234,
        status: 'approved',
        featured: true,
        verified: true
      },
      {
        name: 'Patel Immigration Law',
        description: 'Specialized immigration attorney with 15+ years helping Indian families navigate the complex immigration process. Expertise in H1B, green cards, and citizenship.',
        category_id: 10,
        address: '456 Oak Ave, Jersey City, NJ 07302',
        phone: '(201) 555-0456',
        email: 'info@patellaw.com',
        website: 'https://patellaw.com',
        hours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 2:00 PM',
        image_url: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        rating: 4.9,
        review_count: 156,
        status: 'approved',
        featured: true,
        verified: true
      },
      {
        name: 'Mumbai Market',
        description: 'Fresh Indian groceries, spices, and specialty items imported weekly. Wide selection of vegetables, lentils, rice, and frozen foods. One-stop shop for all Indian cooking needs.',
        category_id: 11,
        address: '789 Jackson Heights Blvd, Jackson Heights, NY 11372',
        phone: '(718) 555-0789',
        email: 'info@mumbaimarket.com',
        website: 'https://mumbaimarket.com',
        hours: 'Mon-Sun: 8:00 AM - 9:00 PM',
        image_url: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        rating: 4.7,
        review_count: 89,
        status: 'approved',
        featured: false,
        verified: true
      },
      {
        name: 'Sharma Real Estate',
        description: 'Helping Indian families find their dream homes in the tri-state area. Specializing in residential properties with understanding of cultural preferences and needs.',
        category_id: 10,
        address: '321 Broad St, Philadelphia, PA 19102',
        phone: '(215) 555-0321',
        email: 'info@sharmarealty.com',
        website: 'https://sharmarealty.com',
        hours: 'Mon-Sat: 9:00 AM - 7:00 PM, Sun: 12:00 PM - 5:00 PM',
        image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        rating: 4.6,
        review_count: 67,
        status: 'approved',
        featured: false,
        verified: false
      },
      {
        name: 'Bollywood Dance Studio',
        description: 'Professional dance classes for all ages in classical and modern Indian dance. Experienced instructors, performance opportunities, and cultural education.',
        category_id: 10,
        address: '654 Broadway, Manhattan, NY 10012',
        phone: '(212) 555-0654',
        email: 'info@bollywooddance.com',
        website: 'https://bollywooddance.com',
        hours: 'Mon-Fri: 4:00 PM - 9:00 PM, Sat-Sun: 10:00 AM - 6:00 PM',
        image_url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        rating: 4.9,
        review_count: 123,
        status: 'approved',
        featured: true,
        verified: true
      },
      {
        name: 'Indian Medical Center',
        description: 'Comprehensive healthcare services with Hindi and Gujarati speaking doctors. Family medicine, pediatrics, and specialist consultations available.',
        category_id: 10,
        address: '987 University Ave, Princeton, NJ 08540',
        phone: '(609) 555-0987',
        email: 'info@indianmedical.com',
        website: 'https://indianmedical.com',
        hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
        image_url: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        rating: 4.8,
        review_count: 201,
        status: 'pending',
        featured: false,
        verified: false
      }
    ];

    const { error: businessesError } = await supabase
      .from('businesses')
      .insert(businesses);

    if (businessesError) {
      console.error('❌ Error inserting businesses:', businessesError);
    } else {
      console.log('✅ Businesses inserted successfully');
    }

    // 5. Insert Sample Feedback
    console.log('💬 Inserting feedback...');
    const feedback = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        subject: 'Great website!',
        message: 'Love the new community platform. Very easy to use and find what I need.',
        feedback_type: 'compliment',
        priority: 'low',
        page_url: '/',
        browser_info: 'Chrome 120.0.0.0',
        allow_contact: true,
        status: 'new'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        subject: 'Search feature suggestion',
        message: 'It would be great to have more advanced search filters for classifieds, like price range and distance.',
        feedback_type: 'suggestion',
        priority: 'medium',
        page_url: '/#classifieds',
        browser_info: 'Safari 17.0',
        allow_contact: true,
        status: 'new'
      },
      {
        name: 'Raj Kumar',
        email: 'raj.kumar@email.com',
        subject: 'Login issue',
        message: 'Having trouble logging in with Google. The button seems to be unresponsive sometimes.',
        feedback_type: 'bug',
        priority: 'high',
        page_url: '/',
        browser_info: 'Firefox 121.0',
        allow_contact: true,
        status: 'in_progress'
      }
    ];

    const { error: feedbackError } = await supabase
      .from('feedback')
      .insert(feedback);

    if (feedbackError) {
      console.error('❌ Error inserting feedback:', feedbackError);
    } else {
      console.log('✅ Feedback inserted successfully');
    }

    console.log('🎉 Mock data insertion completed successfully!');
    
    return {
      success: true,
      message: 'All mock data has been inserted into the database successfully!',
      counts: {
        categories: 11,
        classifieds: classifiedAds.length,
        events: events.length,
        businesses: businesses.length,
        feedback: feedback.length
      }
    };

  } catch (error) {
    console.error('❌ Error inserting mock data:', error);
    throw error;
  }
};

// Helper function to clear all data (for testing)
export const clearAllData = async () => {
  try {
    console.log('🗑️ Clearing all data...');
    
    // Delete in reverse order of dependencies
    await supabase.from('business_reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('event_registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('content_reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('feedback').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('classified_ads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', 0);
    
    console.log('✅ All data cleared successfully');
    return { success: true, message: 'All data cleared successfully' };
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
};