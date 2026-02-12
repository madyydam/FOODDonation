// Supabase Authentication Helper - OPTIMIZED
// Make sure to include Supabase JS library and database.js before this file

const Auth = {
    // Sign up new user
    async signup(email, password, fullName, role) {
        try {
            // 1. Create auth user in Supabase Auth
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role
                    }
                }
            });

            if (authError) {
                console.error('Auth signup error:', authError);
                throw authError;
            }

            // 2. Create user profile in users table
            if (authData.user) {
                const { data: userData, error: userError } = await Database.users.create({
                    id: authData.user.id,
                    email: email,
                    full_name: fullName,
                    role: role
                });

                if (userError) {
                    console.error('User profile creation error:', userError);
                    // Don't throw error here, auth user is already created
                }

                // 3. Create role-specific table entry
                try {
                    if (role === 'donor') {
                        await supabaseClient.from('donors').insert([{
                            user_id: authData.user.id
                        }]);
                    } else if (role === 'ngo') {
                        await supabaseClient.from('ngos').insert([{
                            user_id: authData.user.id,
                            organization_name: fullName // Can be updated later
                        }]);
                    } else if (role === 'volunteer') {
                        await supabaseClient.from('volunteers').insert([{
                            user_id: authData.user.id
                        }]);
                    }
                } catch (roleError) {
                    console.error('Role-specific table creation error:', roleError);
                    // Continue even if role table insert fails
                }
            }

            return {
                success: true,
                user: authData.user,
                message: 'Account created successfully!'
            };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: error.message || 'Signup failed. Please try again.'
            };
        }
    },

    // Login existing user
    async login(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Login error:', error);
                throw error;
            }

            // Get user profile to find role
            const { data: userData, error: userError } = await Database.users.getById(data.user.id);

            if (userError || !userData) {
                console.error('User profile not found:', userError);
                return {
                    success: false,
                    error: 'User profile not found'
                };
            }

            return {
                success: true,
                user: data.user,
                role: userData.role,
                profile: userData
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Login failed. Please check your credentials.'
            };
        }
    },

    // Logout user
    async logout() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;

            // Clear local storage
            localStorage.removeItem('selectedRole');

            // Redirect to login
            window.location.href = 'role_selection.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed. Please try again.');
        }
    },

    // Check if user is authenticated
    async isAuthenticated() {
        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error) throw error;
            return session !== null;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    },

    // Get current session
    async getSession() {
        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error) throw error;
            return session;
        } catch (error) {
            console.error('Get session error:', error);
            return null;
        }
    },

    // Require authentication (redirect to login if not authenticated)
    async requireAuth() {
        // Authentication disabled as per user request
        return true;
    },

    // Redirect user based on role
    redirectUser(role) {
        const routes = {
            'donor': 'donor.html',
            'ngo': 'ngo.html',
            'volunteer': 'volunteer.html',
            'admin': 'admin.html'
        };
        window.location.href = routes[role] || 'donor.html';
    },

    // Reset password
    async resetPassword(email) {
        try {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html'
            });

            if (error) throw error;

            return {
                success: true,
                message: 'Password reset email sent! Check your inbox.'
            };
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                error: error.message || 'Password reset failed.'
            };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
