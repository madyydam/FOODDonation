// Dashboard initialization - OPTIMIZED
// Initialization code for all dashboards

(function () {
    'use strict';

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

    async function initializePage() {
        // Check authentication for dashboard pages
        const isDashboard = window.location.pathname.includes('donor.html') ||
            window.location.pathname.includes('ngo.html') ||
            window.location.pathname.includes('volunteer.html') ||
            window.location.pathname.includes('admin.html');

        if (isDashboard && typeof Auth !== 'undefined') {
            // Auth.requireAuth(); // Disabled login requirement as per user request
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

        // Initialize prefetching and reveal animations
        setupPrefetching();
        setupRevealAnimations();
    }

    function handleScroll(e) {
        // Handle scroll events (throttled)
    }

    function setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Handle regular images
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    // Handle background images
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.removeAttribute('data-bg');
                    }

                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px', threshold: 0.01 });

        document.querySelectorAll('img.lazy, [data-src], [data-bg]').forEach(el => {
            imageObserver.observe(el);
        });
    }

    // Prefetch links on hover for faster navigation
    function setupPrefetching() {
        const prefetchHandler = (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.dataset.prefetched && link.origin === window.location.origin) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
                link.dataset.prefetched = 'true';
            }
        };

        document.addEventListener('mouseover', Utils.debounce(prefetchHandler, 100));
    }

    // Initialize smoothness (reveal animations)
    function setupRevealAnimations() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }

})();
