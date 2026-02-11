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
        }
    };

    // Make utilities globally available
    window.Utils = Utils;

    // Initialize page when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage);
    } else {
        initializePage();
    }

    function initializePage() {
        // Add passive event listeners for better scroll performance
        const scrollElements = document.querySelectorAll('.content-area, .sidebar-menu');
        scrollElements.forEach(el => {
            el.addEventListener('scroll', Utils.throttle(handleScroll), { passive: true });
        });

        // Setup lazy loading for images
        if ('IntersectionObserver' in window) {
            setupLazyLoading();
        }
    }

    function handle Scroll(e) {
        // Handle scroll events (throttled)
    }

    function setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

})();
