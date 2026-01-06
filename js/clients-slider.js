(function() {
    'use strict';

    // Configuration
    const LOGOS_PER_VIEW = 6;
    const TOTAL_LOGOS = 16;
    
    // State
    let currentIndex = 0;
    let isAnimating = false;

    // DOM Elements
    const sliderTrack = document.getElementById('clientsSlider');
    const leftArrow = document.querySelector('.clients-arrow-left');
    const rightArrow = document.querySelector('.clients-arrow-right');
    const loadAllBtn = document.getElementById('loadAllClients');

    // Initialize
    function init() {
        if (!sliderTrack) return;
        
        // Wait for images to load before calculating distances
        const images = sliderTrack.querySelectorAll('img');
        let loadedCount = 0;
        
        if (images.length === 0) {
            attachEventListeners();
            updateArrowStates();
            return;
        }
        
        const checkAllLoaded = function() {
            loadedCount++;
            if (loadedCount === images.length) {
                // All images loaded, now initialize
                attachEventListeners();
                updateArrowStates();
            }
        };
        
        images.forEach(function(img) {
            if (img.complete) {
                checkAllLoaded();
            } else {
                img.addEventListener('load', checkAllLoaded);
                img.addEventListener('error', checkAllLoaded); // Count errors too
            }
        });
    }

    // Calculate slide distance (one group of 6 logos)
    function getSlideDistance() {
        if (!sliderTrack || !sliderTrack.children.length) return 0;
        
        let totalWidth = 0;
        const gap = 30; // Match CSS gap value (updated)
        
        // Calculate width of first group (6 logos + 5 gaps)
        for (let i = 0; i < LOGOS_PER_VIEW && i < sliderTrack.children.length; i++) {
            const logo = sliderTrack.children[i];
            const logoWidth = logo.offsetWidth || logo.getBoundingClientRect().width || 120; // fallback
            totalWidth += logoWidth;
            if (i < LOGOS_PER_VIEW - 1) {
                totalWidth += gap;
            }
        }
        
        return totalWidth;
    }

    // Update slider position (called on resize)
    function updateSliderPosition() {
        if (!sliderTrack || isAnimating) return;
        
        // Recalculate based on current index
        let totalWidth = 0;
        const gap = 30; // Match CSS gap value (updated)
        
        // Calculate width of first group for reference
        for (let i = 0; i < LOGOS_PER_VIEW && i < sliderTrack.children.length; i++) {
            const logo = sliderTrack.children[i];
            const logoWidth = logo.offsetWidth || logo.getBoundingClientRect().width;
            totalWidth += logoWidth;
            if (i < LOGOS_PER_VIEW - 1) {
                totalWidth += gap;
            }
        }
        
        const translateX = -currentIndex * totalWidth;
        sliderTrack.style.transform = `translateX(${translateX}px)`;
    }

    // Slide to next
    function slideNext() {
        if (isAnimating) return;
        
        // Calculate max index: total groups we can show
        // With 16 logos and 6 per view: we can show groups at index 0, 1, 2
        // Group 0: logos 0-5, Group 1: logos 6-11, Group 2: logos 12-15 (4 logos)
        const maxIndex = Math.floor((TOTAL_LOGOS - 1) / LOGOS_PER_VIEW);
        
        if (currentIndex < maxIndex) {
            isAnimating = true;
            currentIndex++;
            
            // Calculate exact distance to move (one group width)
            const distance = getSlideDistance();
            const translateX = -currentIndex * distance;
            sliderTrack.style.transform = `translateX(${translateX}px)`;
            
            setTimeout(() => {
                isAnimating = false;
                updateArrowStates();
            }, 350);
        }
    }

    // Slide to previous
    function slidePrev() {
        if (isAnimating || !sliderTrack) return;
        
        if (currentIndex > 0) {
            isAnimating = true;
            currentIndex--;
            
            // Calculate exact distance to move (one group width)
            const distance = getSlideDistance();
            const translateX = -currentIndex * distance;
            sliderTrack.style.transform = `translateX(${translateX}px)`;
            
            setTimeout(() => {
                isAnimating = false;
                updateArrowStates();
            }, 350);
        } else {
            updateArrowStates();
        }
    }

    // Update arrow button states
    function updateArrowStates() {
        if (!sliderTrack) return;
        
        const actualLogos = sliderTrack.children.length;
        const maxIndex = Math.ceil((actualLogos - LOGOS_PER_VIEW) / LOGOS_PER_VIEW);
        
        if (leftArrow) {
            if (currentIndex > 0) {
                leftArrow.style.opacity = '1';
                leftArrow.style.pointerEvents = 'auto';
                leftArrow.disabled = false;
            } else {
                leftArrow.style.opacity = '0.5';
                leftArrow.style.pointerEvents = 'none';
                leftArrow.disabled = true;
            }
        }
        
        if (rightArrow) {
            if (currentIndex < maxIndex) {
                rightArrow.style.opacity = '1';
                rightArrow.style.pointerEvents = 'auto';
                rightArrow.disabled = false;
            } else {
                rightArrow.style.opacity = '0.5';
                rightArrow.style.pointerEvents = 'none';
                rightArrow.disabled = true;
            }
        }
    }

    // Load All Clients (show all logos, no pagination)
    function loadAllClients() {
        // This function can be used to show all logos at once if needed
        // For now, all logos are already loaded, so we just ensure they're all visible
        if (loadAllBtn) {
            loadAllBtn.style.display = 'none';
        }
    }

    // Event Listeners
    function attachEventListeners() {
        // Arrow buttons
        if (leftArrow) {
            leftArrow.addEventListener('click', slidePrev);
            leftArrow.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    slidePrev();
                }
            });
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', slideNext);
            rightArrow.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    slideNext();
                }
            });
        }
        
        // Load All Clients button
        if (loadAllBtn) {
            loadAllBtn.addEventListener('click', loadAllClients);
            loadAllBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    loadAllClients();
                }
            });
        }
        
        // Handle window resize - recalculate positions
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                updateSliderPosition();
                updateArrowStates();
            }, 250);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

