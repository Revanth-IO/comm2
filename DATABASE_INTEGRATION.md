# Database Integration Guide for Upkaar

## Current Problem
The website currently uses mock data stored in JavaScript memory, which means:
- All content disappears on page refresh
- No real user authentication
- No persistent storage for classifieds, events, businesses
- No content approval workflow
- Cannot scale to handle thousands of users and posts

## Recommended Database Solutions

### Option 1: Supabase (Recommended for Quick Setup)
**Best for: Fast deployment, built-in auth, real-time features**

#### Setup Steps:
1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com
   # Create new project
   # Get your project URL and anon key
   ```

2. **Database Schema**
   ```sql
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
     name TEXT NOT NULL,
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
   ```

3. **Environment Variables**
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

#### Pros:
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Row Level Security (RLS)
- ✅ Auto-generated APIs
- ✅ Free tier available
- ✅ Easy to set up

#### Cons:
- ❌ Vendor lock-in
- ❌ Limited customization
- ❌ Costs can grow with scale

### Option 2: Firebase (Google)
**Best for: Google ecosystem integration, real-time features**

#### Setup Steps:
1. **Create Firebase Project**
2. **Enable Firestore Database**
3. **Set up Authentication**
4. **Configure security rules**

#### Pros:
- ✅ Google integration
- ✅ Real-time database
- ✅ Built-in authentication
- ✅ Good mobile support

#### Cons:
- ❌ NoSQL learning curve
- ❌ Vendor lock-in
- ❌ Complex pricing

### Option 3: Traditional Backend (Node.js + PostgreSQL)
**Best for: Full control, custom requirements**

#### Tech Stack:
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **File Storage**: AWS S3 or Cloudinary
- **Hosting**: Railway, Render, or DigitalOcean

#### Pros:
- ✅ Full control
- ✅ No vendor lock-in
- ✅ Highly customizable
- ✅ Can optimize for performance

#### Cons:
- ❌ More complex setup
- ❌ Need to manage infrastructure
- ❌ More development time

### Option 4: Headless CMS (Strapi/Sanity)
**Best for: Content management focus**

#### Pros:
- ✅ Admin interface included
- ✅ Content modeling
- ✅ API generation

#### Cons:
- ❌ Less flexible for custom logic
- ❌ Additional complexity

## Recommended Implementation Plan

### Phase 1: Quick Win with Supabase (1-2 weeks)
1. **Set up Supabase project**
2. **Implement user authentication**
3. **Create basic CRUD for classifieds**
4. **Add content approval workflow**

### Phase 2: Full Feature Implementation (2-4 weeks)
1. **Add events and businesses**
2. **Implement admin panel with real data**
3. **Add image upload functionality**
4. **Set up email notifications**

### Phase 3: Advanced Features (4-6 weeks)
1. **Real-time notifications**
2. **Advanced search and filtering**
3. **User profiles and messaging**
4. **Analytics and reporting**

## Cost Estimates

### Supabase
- **Free tier**: Up to 50,000 monthly active users
- **Pro tier**: $25/month for more features
- **Estimated for Upkaar**: $0-25/month initially

### Firebase
- **Free tier**: Limited usage
- **Pay-as-you-go**: Variable based on usage
- **Estimated for Upkaar**: $10-50/month

### Self-hosted (DigitalOcean)
- **VPS**: $12-24/month
- **Database**: $15/month
- **Total**: $27-39/month

## Next Steps

1. **Choose database solution** (I recommend Supabase for quick start)
2. **Set up development environment**
3. **Implement user authentication first**
4. **Migrate mock data to real database**
5. **Add content approval workflow**
6. **Deploy to production**

Would you like me to implement the Supabase integration first? It's the fastest way to get a working database with real persistence.