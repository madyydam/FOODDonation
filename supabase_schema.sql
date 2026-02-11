-- ================================================================
-- COMPLETE FRESH START - Every Bite Matters Database Schema
-- This script will completely reset and recreate your database
-- ================================================================

-- STEP 1: Drop all tables (this will delete all data!)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS ngos CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- STEP 2: Create all tables with correct structure
-- Users Table (main auth table)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('donor', 'ngo', 'volunteer', 'admin')),
    avatar_url TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors Table
CREATE TABLE donors (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    organization_name TEXT,
    total_donations INTEGER DEFAULT 0,
    meals_saved INTEGER DEFAULT 0,
    impact_score DECIMAL(3, 1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NGOs Table
CREATE TABLE ngos (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    registration_number TEXT UNIQUE,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    total_received INTEGER DEFAULT 0,
    meals_distributed INTEGER DEFAULT 0,
    beneficiaries_served INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers Table
CREATE TABLE volunteers (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    deliveries_completed INTEGER DEFAULT 0,
    hours_contributed DECIMAL(5, 1) DEFAULT 0.0,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    vehicle_info TEXT,
    availability TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations Table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES donors(user_id) ON DELETE CASCADE,
    ngo_id UUID REFERENCES ngos(user_id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    food_type TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    expiry_date DATE NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_time TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'accepted', 'in_transit', 'delivered', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Deliveries Table
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES volunteers(user_id) ON DELETE SET NULL,
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    pickup_time TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'delivered')),
    eta TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings Table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ratee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Create indexes for performance
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_ngo ON donations(ngo_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_deliveries_volunteer ON deliveries(volunteer_id);
CREATE INDEX idx_deliveries_donation ON deliveries(donation_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- STEP 4: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create RLS Policies
-- USERS POLICIES
CREATE POLICY "Users can view all users" 
ON users FOR SELECT 
USING (true);

CREATE POLICY "Users can insert own profile" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- DONORS POLICIES
CREATE POLICY "Anyone can view donors" 
ON donors FOR SELECT 
USING (true);

CREATE POLICY "Users can insert own donor profile" 
ON donors FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own donor profile" 
ON donors FOR UPDATE 
USING (auth.uid() = user_id);

-- NGOS POLICIES
CREATE POLICY "Anyone can view NGOs" 
ON ngos FOR SELECT 
USING (true);

CREATE POLICY "Users can insert own NGO profile" 
ON ngos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own NGO profile" 
ON ngos FOR UPDATE 
USING (auth.uid() = user_id);

-- VOLUNTEERS POLICIES
CREATE POLICY "Anyone can view volunteers" 
ON volunteers FOR SELECT 
USING (true);

CREATE POLICY "Users can insert own volunteer profile" 
ON volunteers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own volunteer profile" 
ON volunteers FOR UPDATE 
USING (auth.uid() = user_id);

-- DONATIONS POLICIES
CREATE POLICY "Anyone can view donations" 
ON donations FOR SELECT 
USING (true);

CREATE POLICY "Donors can insert donations" 
ON donations FOR INSERT 
WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update own donations" 
ON donations FOR UPDATE 
USING (auth.uid() = donor_id);

-- DELIVERIES POLICIES
CREATE POLICY "Users can view deliveries" 
ON deliveries FOR SELECT 
USING (true);

CREATE POLICY "Volunteers can update deliveries" 
ON deliveries FOR UPDATE 
USING (auth.uid() = volunteer_id);

-- RATINGS POLICIES
CREATE POLICY "Users can view ratings" 
ON ratings FOR SELECT 
USING (true);

CREATE POLICY "Users can insert ratings" 
ON ratings FOR INSERT 
WITH CHECK (auth.uid() = rater_id);

-- ================================================================
-- DONE! Database is ready for Every Bite Matters 🎉
-- ================================================================
