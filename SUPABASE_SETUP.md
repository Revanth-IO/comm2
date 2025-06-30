# Supabase Setup Guide for Upkaar

## Step 1: Create Supabase Project

1. **Visit Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Organization: Create or select
   - Name: `upkaar-community`
   - Database Password: Generate strong password
   - Region: Choose closest to your users (US East for tri-state area)
   - Click "Create new project"

3. **Wait for Setup** (2-3 minutes)

## Step 2: Get Project Credentials

1. **Go to Settings > API**
2. **Copy these values:**
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Set Up Database Schema

1. **Go to SQL Editor in Supabase Dashboard**
2. **Run this SQL to create all tables:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('classified', 'event', 'business')),
  subcategories TEXT[],
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, type, subcategories, icon, color) VALUES
('For Sale', 'classified', ARRAY['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Home & Garden', 'Sports & Recreation'], '🏷️', 'orange'),
('Housing', 'classified', ARRAY['Apartments for Rent', 'Houses for Rent', 'Rooms for Rent', 'Real Estate for Sale', 'Roommates'], '🏠', 'blue'),
('Jobs', 'classified', ARRAY['Full-time', 'Part-time', 'Contract', 'Internships', 'Freelance'], '💼', 'green'),
('Services', 'classified', ARRAY['Home Services', 'Professional Services', 'Tutoring', 'Healthcare', 'Beauty & Wellness', 'Transportation'], '🔧', 'purple'),
('Community', 'classified', ARRAY['Events', 'Classes', 'Groups', 'Volunteers', 'Lost & Found'], '👥', 'pink'),
('Cultural Events', 'event', ARRAY['Festivals', 'Religious', 'Music & Dance', 'Art & Literature'], '🎭', 'red'),
('Business Events', 'event', ARRAY['Networking', 'Workshops', 'Conferences', 'Trade Shows'], '🤝', 'blue'),
('Community Events', 'event', ARRAY['Meetups', 'Sports', 'Family', 'Volunteer'], '🌟', 'green'),
('Restaurants', 'business', ARRAY['North Indian', 'South Indian', 'Street Food', 'Sweets', 'Catering'], '🍽️', 'orange'),
('Services', 'business', ARRAY['Legal', 'Medical', 'Financial', 'Real Estate', 'Education'], '⚖️', 'blue'),
('Retail', 'business', ARRAY['Grocery', 'Clothing', 'Jewelry', 'Electronics', 'Books'], '🛍️', 'purple');

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('guest', 'user', 'vendor', 'content_manager', 'moderator', 'admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classified ads
CREATE TABLE classified_ads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  subcategory TEXT,
  price DECIMAL(10,2),
  location TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  rejection_reason TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  organizer TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  image_url TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT FALSE,
  registration_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses
CREATE TABLE businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  hours TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content reviews/approvals
CREATE TABLE content_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('classified', 'event', 'business')),
  content_id UUID NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected')),
  reason TEXT,
  notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User feedback
CREATE TABLE feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug', 'suggestion', 'general', 'compliment')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  page_url TEXT,
  browser_info TEXT,
  allow_contact BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations
CREATE TABLE event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Business reviews
CREATE TABLE business_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_classified_ads_status ON classified_ads(status);
CREATE INDEX idx_classified_ads_category ON classified_ads(category_id);
CREATE INDEX idx_classified_ads_location ON classified_ads(location);
CREATE INDEX idx_classified_ads_created_at ON classified_ads(created_at DESC);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_status ON businesses(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classified_ads_updated_at BEFORE UPDATE ON classified_ads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classified_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_reviews ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Classified ads policies
CREATE POLICY "Anyone can view approved classifieds" ON classified_ads FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can insert classifieds" ON classified_ads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own classifieds" ON classified_ads FOR UPDATE USING (auth.uid() = author_id);

-- Events policies
CREATE POLICY "Anyone can view approved events" ON events FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = author_id);

-- Businesses policies
CREATE POLICY "Anyone can view approved businesses" ON businesses FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can insert businesses" ON businesses FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own businesses" ON businesses FOR UPDATE USING (auth.uid() = author_id);

-- Categories are public
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- Feedback policies
CREATE POLICY "Anyone can insert feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all feedback" ON feedback FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator')
  )
);

-- Content reviews policies (admin only)
CREATE POLICY "Admins can manage content reviews" ON content_reviews FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'moderator', 'content_manager')
  )
);

-- Event registrations policies
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own registrations" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON event_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Business reviews policies
CREATE POLICY "Anyone can view approved reviews" ON business_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert own reviews" ON business_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON business_reviews FOR UPDATE USING (auth.uid() = user_id);
```

## Step 5: Insert Sample Data

```sql
-- Insert sample classified ads
INSERT INTO classified_ads (title, description, category_id, subcategory, price, location, contact_name, contact_email, contact_phone, status, author_name, featured) VALUES
('iPhone 14 Pro Max - Excellent Condition', 'Barely used iPhone 14 Pro Max, 256GB, Space Black. Includes original box, charger, and screen protector.', 1, 'Electronics', 899.00, 'Edison, NJ', 'Raj Patel', 'raj.patel@email.com', '(732) 555-0123', 'approved', 'Raj Patel', true),
('2BR Apartment for Rent - Jersey City', 'Beautiful 2-bedroom apartment in prime Jersey City location. Close to PATH train.', 2, 'Apartments for Rent', 2800.00, 'Jersey City, NJ', 'Priya Sharma', 'priya.sharma@email.com', '(201) 555-0456', 'approved', 'Priya Sharma', false),
('Math Tutoring Services - All Levels', 'Experienced math tutor offering personalized lessons for students from elementary to college level.', 4, 'Tutoring', 50.00, 'Princeton, NJ', 'Dr. Amit Kumar', 'amit.kumar@email.com', '(609) 555-0789', 'approved', 'Dr. Amit Kumar', false);

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, category_id, organizer, contact_name, contact_email, status, featured) VALUES
('Diwali Festival Celebration', 'Join us for the grand Diwali celebration with traditional performances, food, and fireworks.', '2024-10-28', '18:00:00', 'Newark, NJ', 6, 'Indian Cultural Center', 'Event Coordinator', 'events@icc.org', 'approved', true),
('Bollywood Dance Workshop', 'Learn classical and modern Bollywood dance moves from professional instructors.', '2024-11-05', '14:00:00', 'Jersey City, NJ', 6, 'Dance Academy', 'Instructor', 'dance@academy.com', 'approved', false);

-- Insert sample businesses
INSERT INTO businesses (name, description, category_id, address, phone, email, website, rating, review_count, status, featured) VALUES
('Spice Garden Restaurant', 'Authentic North Indian cuisine with traditional recipes passed down through generations.', 9, '123 Main St, Edison, NJ 08817', '(732) 555-0123', 'info@spicegarden.com', 'https://spicegarden.com', 4.8, 234, 'approved', true),
('Patel Immigration Law', 'Specialized immigration attorney with 15+ years helping Indian families.', 10, '456 Oak Ave, Jersey City, NJ 07302', '(201) 555-0456', 'info@patellaw.com', 'https://patellaw.com', 4.9, 156, 'approved', true);
```

## Step 6: Configure Environment Variables

Create `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 7: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 8: Test Connection

You can test the connection by going to the Supabase dashboard and checking if your tables were created successfully.

## Next Steps

1. **Implement Supabase client in React app**
2. **Replace mock data with real database calls**
3. **Add authentication integration**
4. **Implement CRUD operations**
5. **Add real-time subscriptions**

The database is now ready to handle thousands of users and content items with proper relationships, security, and performance optimizations!