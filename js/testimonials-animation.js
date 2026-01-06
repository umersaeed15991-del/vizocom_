(function() {
    'use strict';

    // Initialize animation on scroll
    function init() {
        const testimonialsSection = document.querySelector('.testimonials-section');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (!testimonialsSection || testimonialCards.length === 0) return;
        
        // Check if already animated
        let hasAnimated = false;
        
        // Intersection Observer for scroll animation
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    
                    // Animate each card with stagger
                    testimonialCards.forEach(function(card, index) {
                        setTimeout(function() {
                            card.classList.add('animate');
                        }, index * 80); // 80ms stagger delay
                    });
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% visible
            rootMargin: '0px'
        });
        
        observer.observe(testimonialsSection);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

