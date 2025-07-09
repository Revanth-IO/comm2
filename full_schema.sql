-- Users table (Supabase handles this automatically)

-- Additional user profile data
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'classified', 'event', 'business'
  subcategories TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Classified Ads
CREATE TABLE classified_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  subcategory TEXT,
  price DECIMAL(10,2),
  location TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  images TEXT[],
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
  author_id UUID REFERENCES auth.users(id),
  featured BOOLEAN DEFAULT FALSE,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  registration_required BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  author_id UUID REFERENCES auth.users(id),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Businesses
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  hours TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  author_id UUID REFERENCES auth.users(id),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content Reviews/Approvals
CREATE TABLE content_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- 'classified', 'event', 'business'
  content_id UUID NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'approved', 'rejected'
  reason TEXT,
  reviewed_at TIMESTAMP DEFAULT NOW()
);

-- User Feedback
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  feedback_type TEXT NOT NULL, -- 'bug', 'suggestion', 'general', 'compliment'
  priority TEXT DEFAULT 'medium',
  page_url TEXT,
  browser_info TEXT,
  allow_contact BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'resolved'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Initial Categories Data
INSERT INTO categories (name, type, subcategories) VALUES
('Restaurant', 'business', NULL),
('Legal Services', 'business', NULL),
('Grocery Store', 'business', NULL),
('Real Estate', 'business', NULL),
('Entertainment', 'business', NULL),
('Healthcare', 'business', NULL),
('For Sale', 'classified', ARRAY['Electronics', 'Vehicles', 'Furniture', 'Books']),
('Housing', 'classified', ARRAY['Apartments for Rent', 'Rooms for Rent', 'Houses for Sale']),
('Jobs', 'classified', ARRAY['Full-time', 'Part-time', 'Contract']),
('Services', 'classified', ARRAY['Tutoring', 'Photography', 'Web Development', 'Home Services']),
('Community', 'classified', NULL),
('Festival', 'event', NULL),
('Workshop', 'event', NULL),
('Meetup', 'event', NULL);
