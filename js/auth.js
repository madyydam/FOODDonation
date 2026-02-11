/**
 * Auth.js - Central Authentication Handler
 * Manages login, signup, and role-based redirection.
 */

const Auth = {
    // Simulate Login
    login: (email, password) => {
        console.log(`Logging in user: ${email}`);

        // In a real app, this would be an API call to Supabase
        // For now, we simulate a successful login

        // Mock logic to determine role based on email or default to 'donor'
        // You can use specific emails to test different roles:
        // admin@example.com -> admin
        // ngo@example.com -> ngo
        // volunteer@example.com -> volunteer

        let role = 'donor';
        if (email.includes('admin')) role = 'admin';
        else if (email.includes('ngo')) role = 'ngo';
        else if (email.includes('volunteer')) role = 'volunteer';

        // Save user session
        const user = { email, role, name: 'Test User' };
        localStorage.setItem('user', JSON.stringify(user));

        return Promise.resolve(user);
    },

    // Simulate Signup
    signup: (name, email, password, role) => {
        console.log(`Signing up user: ${email} as ${role}`);

        // In a real app, API call to create user

        const user = { email, role, name };
        localStorage.setItem('user', JSON.stringify(user));

        return Promise.resolve(user);
    },

    // Logout
    logout: () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },

    // Get Current User
    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Redirect based on role
    redirectUser: (role) => {
        switch (role) {
            case 'donor':
                window.location.href = 'donor.html';
                break;
            case 'ngo':
                window.location.href = 'ngo.html';
                break;
            case 'volunteer':
                window.location.href = 'volunteer.html';
                break;
            case 'admin':
                window.location.href = 'admin.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    },

    // Guard for dashboard pages
    requireAuth: () => {
        if (!Auth.getUser()) {
            window.location.href = 'login.html';
        }
    }
};

// Expose Auth globally
window.Auth = Auth;
