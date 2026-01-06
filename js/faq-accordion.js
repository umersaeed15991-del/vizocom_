(function() {
    'use strict';

    // Initialize FAQ accordion
    function init() {
        const faqItems = document.querySelectorAll('.faq-item');
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        if (faqItems.length === 0) return;
        
        // Add click event to each question
        faqQuestions.forEach(function(question, index) {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                
                // Close all items
                faqItems.forEach(function(item) {
                    item.classList.remove('active');
                    const btn = item.querySelector('.faq-question');
                    if (btn) {
                        btn.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

