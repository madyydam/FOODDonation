# From Surplus to Smiles - Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) in the sidebar
3. Click on **API** settings
4. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Project API Key (anon, public)** (looks like: `eyJhbGc...`)

## Step 2: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholders with your actual Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase_schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

This will create all necessary tables:
- `users` - Base user information
- `donors` - Donor-specific data
- `ngos` - NGO organization data
- `volunteers` - Volunteer information
- `donations` - Donation records
- `deliveries` - Delivery tracking
- `ratings` - Rating system

## Step 4: Update JavaScript Configuration

1. Open `js/database.js`
2. Update lines 2-3 with your Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your_anon_key_here';
```

## Step 5: Include Supabase Library

Add this script tag to the `<head>` section of each HTML file that needs database access:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/database.js"></script>
```

## Step 6: Using the Database

### Example: Get All Available Donations
```javascript
async function loadDonations() {
    const { data, error } = await Database.donations.getAvailable();
    if (error) {
        console.error('Error loading donations:', error);
        return;
    }
    console.log('Available donations:', data);
    // Display donations in your UI
}
```

### Example: Accept a Donation (NGO)
```javascript
async function acceptDonation(donationId, ngoId) {
    const { data, error } = await Database.donations.acceptDonation(donationId, ngoId);
    if (error) {
        console.error('Error accepting donation:', error);
        return;
    }
    alert('Donation accepted successfully!');
}
```

### Example: Get Donor's Donation History
```javascript
async function loadDonorHistory(donorId) {
    const { data, error } = await Database.donations.getByDonor(donorId);
    if (error) {
        console.error('Error loading history:', error);
        return;
    }
    console.log('Donation history:', data);
}
```

## Step 7: Authentication (Optional but Recommended)

### Enable Email Auth in Supabase
1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Configure email templates if needed

### Example Login Function
```javascript
async function login(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        console.error('Login error:', error);
        return;
    }
    
    console.log('Logged in user:', data.user);
}
```

## Database Helper Functions

The `Database` object in `database.js` provides helper functions:

### Users
- `Database.users.getById(userId)` - Get user by ID
- `Database.users.getByEmail(email)` - Get user by email
- `Database.users.create(userData)` - Create new user
- `Database.users.update(userId, updates)` - Update user

### Donations
- `Database.donations.getAll()` - Get all donations
- `Database.donations.getByDonor(donorId)` - Get donor's donations
- `Database.donations.getByNGO(ngoId)` - Get NGO's received donations
- `Database.donations.getAvailable()` - Get available donations
- `Database.donations.create(donationData)` - Create donation
- `Database.donations.update(donationId, updates)` - Update donation
- `Database.donations.acceptDonation(donationId, ngoId)` - Accept donation

### Deliveries
- `Database.deliveries.getAll()` - Get all deliveries
- `Database.deliveries.getByVolunteer(volunteerId)` - Get volunteer's deliveries
- `Database.deliveries.getByDonation(donationId)` - Get delivery for donation
- `Database.deliveries.create(deliveryData)` - Create delivery
- `Database.deliveries.updateStatus(deliveryId, status)` - Update delivery status

## Testing the Setup

1. Open your browser's Developer Console (F12)
2. Open any HTML file in the project
3. Run this test command:
```javascript
Database.donations.getAll().then(result => console.log(result));
```

If you see `{ data: [], error: null }`, the connection is working!

## Security Notes

⚠️ **IMPORTANT:**
- Never commit the `.env` file with real credentials to GitHub
- The `.env.example` file is safe to commit (it has placeholders)
- Use environment variables in production
- Enable Row Level Security (RLS) policies for production use

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project issues: Create an issue in the repository

---

Happy Coding! 🚀
