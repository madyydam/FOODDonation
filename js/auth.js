// Supabase Authentication Helper
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

            console.log('✅ Auth user created:', authData.user);

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

                console.log('✅ User profile created:', userData);

                // 3. Create role-specific table entry
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

            console.log('✅ User logged in:', data.user);

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
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed. Please try again.');
        }
    },

    // Check if user is authenticated
    async isAuthenticated() {
        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
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
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Redirect user based on role
    redirectUser(role) {
        if (role === 'donor') {
            window.location.href = 'donor.html';
        } else if (role === 'ngo') {
            window.location.href = 'ngo.html';
        } else if (role === 'volunteer') {
            window.location.href = 'volunteer.html';
        } else if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'donor.html'; // Default
        }
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
