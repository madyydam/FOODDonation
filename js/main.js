// Dashboard initialization - OPTIMIZED
// Initialization code for all dashboards

(function () {
    'use strict';

    // Dashboard loaded - removed console.log for production

    // Common utility functions
    const Utils = {
        // Debounce function for search/filter inputs
        debounce(func, wait = 300) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll/resize events
        throttle(func, limit = 100) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Format date to readable format
        formatDate(date) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(date).toLocaleDateString('en-IN', options);
        },

        // Format number with commas
        formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        // Safe DOM query
        $(selector) {
            return document.querySelector(selector);
        },

        // Safe DOM query all
        $$(selector) {
            return document.querySelectorAll(selector);
        },

        // Toggle Role Switcher
        toggleRoleSwitcher() {
            const menu = document.getElementById('roleSwitcher');
            if (menu) {
                const isVisible = menu.style.display === 'block';
                menu.style.display = isVisible ? 'none' : 'block';

                // Add class for animation/smoothness if needed
                if (!isVisible) {
                    menu.classList.add('fade-in');
                }
            }
        }
    };

    // Make utilities globally available
    window.Utils = Utils;
    window.toggleRoleSwitcher = Utils.toggleRoleSwitcher;

    // Initialize page when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage);
    } else {
        initializePage();
    }

    async function initializePage() {
        // Check authentication for dashboard pages
        const isDashboard = window.location.pathname.includes('donor.html') ||
            window.location.pathname.includes('ngo.html') ||
            window.location.pathname.includes('volunteer.html') ||
            window.location.pathname.includes('admin.html');

        if (isDashboard && typeof Auth !== 'undefined') {
            Auth.requireAuth(); // Uncommented for stability, but careful with logic changes
            // For now, keep it as is if it was commented out to avoid breaking local testing
        }

        // Add passive event listeners for better scroll performance
        const scrollElements = document.querySelectorAll('.content-area, .sidebar-menu');
        scrollElements.forEach(el => {
            el.addEventListener('scroll', Utils.throttle(handleScroll), { passive: true });
        });

        // Setup lazy loading for images
        if ('IntersectionObserver' in window) {
            setupLazyLoading();
        }

        // Global click handler for closing dropdowns
        document.addEventListener('click', function (event) {
            // Role Switcher closing
            const menu = document.getElementById('roleSwitcher');
            const button = event.target.closest('button[onclick*="toggleRoleSwitcher"]');
            if (!button && menu && menu.style.display === 'block' && !menu.contains(event.target)) {
                menu.style.display = 'none';
            }
        });
    }

    function handleScroll(e) {
        // Handle scroll events (throttled)
    }

    function setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img.lazy, img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

})();
