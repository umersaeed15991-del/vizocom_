(function() {
    'use strict';

    // Initialize animation on scroll
    function init() {
        const numbersSection = document.querySelector('.numbers-section');
        const numberValues = document.querySelectorAll('.numbers-value');
        
        if (!numbersSection || numberValues.length === 0) return;
        
        // Check if already animated
        let hasAnimated = false;
        
        // Intersection Observer for scroll animation
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    
                    // Animate each number with stagger
                    numberValues.forEach(function(value, index) {
                        setTimeout(function() {
                            value.classList.add('animate');
                        }, index * 100); // 100ms stagger delay
                    });
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3, // Trigger when 30% visible
            rootMargin: '0px'
        });
        
        observer.observe(numbersSection);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

