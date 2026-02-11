// Supabase Configuration
// Load environment variables
const SUPABASE_URL = 'https://sypahimjzofhrzrtglsh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cGFoaW1qem9maHJ6cnRnbHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NzcyMjQsImV4cCI6MjA4NjM1MzIyNH0.wALGaihV0XTNXq2CqU3QJxfXxoV0mUs16Ij2_otuKA8';

// Initialize Supabase client
// Note: Include Supabase JS library in your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper functions
const Database = {
    // Get current user
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    // Users Table Operations
    users: {
        async getById(userId) {
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            return { data, error };
        },

        async getByEmail(email) {
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            return { data, error };
        },

        async create(userData) {
            const { data, error } = await supabaseClient
                .from('users')
                .insert([userData])
                .select();
            return { data, error };
        },

        async update(userId, updates) {
            const { data, error } = await supabaseClient
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select();
            return { data, error };
        }
    },

    // Donations Table Operations
    donations: {
        async getAll() {
            const { data, error } = await supabaseClient
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false });
            return { data, error };
        },

        async getByDonor(donorId) {
            const { data, error } = await supabaseClient
                .from('donations')
                .select('*')
                .eq('donor_id', donorId)
                .order('created_at', { ascending: false });
            return { data, error };
        },

        async getByNGO(ngoId) {
            const { data, error } = await supabaseClient
                .from('donations')
                .select('*')
                .eq('ngo_id', ngoId)
                .order('created_at', { ascending: false });
            return { data, error };
        },

        async getAvailable() {
            const { data, error } = await supabaseClient
                .from('donations')
                .select('*')
                .is('ngo_id', null)
                .eq('status', 'available')
                .order('created_at', { ascending: false });
            return { data, error };
        },

        async create(donationData) {
            const { data, error } = await supabaseClient
                .from('donations')
                .insert([donationData])
                .select();
            return { data, error };
        },

        async update(donationId, updates) {
            const { data, error } = await supabaseClient
                .from('donations')
                .update(updates)
                .eq('id', donationId)
                .select();
            return { data, error };
        },

        async acceptDonation(donationId, ngoId) {
            const { data, error } = await supabaseClient
                .from('donations')
                .update({
                    ngo_id: ngoId,
                    status: 'accepted',
                    accepted_at: new Date().toISOString()
                })
                .eq('id', donationId)
                .select();
            return { data, error };
        }
    },

    // Deliveries Table Operations
    deliveries: {
        async getAll() {
            const { data, error } = await supabaseClient
                .from('deliveries')
                .select('*, donations(*), volunteers(*)')
                .order('created_at', { ascending: false });
            return { data, error };
        },

        async getByVolunteer(volunteerId) {
            const { data, error } = await supabaseClient
                .from('deliveries')
                .select('*, donations(*)')
                .eq('volunteer_id', volunteerId)
                .order('created_at', { ascending: false });
            return { data, error };
        },

        async getByDonation(donationId) {
            const { data, error } = await supabaseClient
                .from('deliveries')
                .select('*, volunteers(*)')
                .eq('donation_id', donationId)
                .single();
            return { data, error };
        },

        async create(deliveryData) {
            const { data, error } = await supabaseClient
                .from('deliveries')
                .insert([deliveryData])
                .select();
            return { data, error };
        },

        async updateStatus(deliveryId, status) {
            const { data, error } = await supabaseClient
                .from('deliveries')
                .update({
                    status: status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', deliveryId)
                .select();
            return { data, error };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabaseClient, Database };
}
