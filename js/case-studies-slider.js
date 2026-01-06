(function() {
    'use strict';

    // Configuration
    const PANELS_PER_VIEW = 1; // Show one panel at a time
    const TOTAL_PANELS = 4;
    
    // State
    let currentIndex = 0;
    let isAnimating = false;

    // DOM Elements
    const sliderGrid = document.querySelector('.case-studies-grid');
    const leftArrow = document.querySelector('.case-studies-arrow-left');
    const rightArrow = document.querySelector('.case-studies-arrow-right');
    const loadAllBtn = document.getElementById('loadAllCaseStudies');

    // Initialize
    function init() {
        if (!sliderGrid) {
            console.warn('Case studies grid not found');
            return;
        }
        
        if (!leftArrow || !rightArrow) {
            console.warn('Case studies arrows not found');
            return;
        }
        
        // Ensure grid is ready
        setTimeout(() => {
            attachEventListeners();
            updateArrowStates();
            updateSliderPosition();
        }, 100);
    }

    // Update slider position
    function updateSliderPosition() {
        if (!sliderGrid || isAnimating) return;
        
        // Get the actual width of the visible container
        const container = sliderGrid.parentElement;
        if (!container) return;
        
        const containerWidth = container.offsetWidth;
        const translateX = -currentIndex * containerWidth;
        
        sliderGrid.style.transform = `translateX(${translateX}px)`;
        sliderGrid.style.transition = 'transform 0.4s ease-out';
    }

    // Slide to next
    function slideNext(e) {
        if (e) e.preventDefault();
        if (isAnimating || !sliderGrid) {
            console.log('Cannot slide: isAnimating=', isAnimating, 'sliderGrid=', !!sliderGrid);
            return;
        }
        
        const maxIndex = TOTAL_PANELS - PANELS_PER_VIEW;
        console.log('slideNext: currentIndex=', currentIndex, 'maxIndex=', maxIndex);
        
        if (currentIndex < maxIndex) {
            isAnimating = true;
            currentIndex++;
            console.log('Moving to index:', currentIndex);
            
            updateSliderPosition();
            
            setTimeout(() => {
                isAnimating = false;
                updateArrowStates();
            }, 400);
        }
        updateArrowStates();
    }

    // Slide to previous
    function slidePrev(e) {
        if (e) e.preventDefault();
        if (isAnimating || !sliderGrid) {
            console.log('Cannot slide: isAnimating=', isAnimating, 'sliderGrid=', !!sliderGrid);
            return;
        }
        
        console.log('slidePrev: currentIndex=', currentIndex);
        
        if (currentIndex > 0) {
            isAnimating = true;
            currentIndex--;
            console.log('Moving to index:', currentIndex);
            
            updateSliderPosition();
            
            setTimeout(() => {
                isAnimating = false;
                updateArrowStates();
            }, 400);
        }
        updateArrowStates();
    }

    // Update arrow button states
    function updateArrowStates() {
        const maxIndex = TOTAL_PANELS - PANELS_PER_VIEW;
        
        if (leftArrow) {
            if (currentIndex > 0) {
                leftArrow.style.opacity = '1';
                leftArrow.style.pointerEvents = 'auto';
                leftArrow.style.cursor = 'pointer';
            } else {
                leftArrow.style.opacity = '0.5';
                leftArrow.style.pointerEvents = 'none';
                leftArrow.style.cursor = 'not-allowed';
            }
        }
        
        if (rightArrow) {
            if (currentIndex < maxIndex) {
                rightArrow.style.opacity = '1';
                rightArrow.style.pointerEvents = 'auto';
                rightArrow.style.cursor = 'pointer';
            } else {
                rightArrow.style.opacity = '0.5';
                rightArrow.style.pointerEvents = 'none';
                rightArrow.style.cursor = 'not-allowed';
            }
        }
    }

    // Load All Case Studies (show all panels)
    function loadAllCaseStudies() {
        if (!sliderGrid) return;
        
        // Reset to show all panels
        currentIndex = 0;
        sliderGrid.style.transform = 'translateX(0)';
        
        // Hide the button
        if (loadAllBtn) {
            loadAllBtn.style.display = 'none';
        }
        
        // Update grid to show all panels
        const panels = sliderGrid.querySelectorAll('.case-study-panel');
        panels.forEach(panel => {
            panel.style.flex = '0 0 25%';
            panel.style.width = '25%';
        });
        
        updateArrowStates();
    }

    // Event Listeners
    function attachEventListeners() {
        // Arrow buttons
        if (leftArrow) {
            leftArrow.addEventListener('click', slidePrev, false);
            leftArrow.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    slidePrev(e);
                }
            });
        } else {
            console.warn('Left arrow not found');
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', slideNext, false);
            rightArrow.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    slideNext(e);
                }
            });
        } else {
            console.warn('Right arrow not found');
        }
        
        // Load All Case Studies button
        if (loadAllBtn) {
            loadAllBtn.addEventListener('click', loadAllCaseStudies);
            loadAllBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    loadAllCaseStudies();
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
    function startInit() {
        // Try multiple times if elements aren't ready
        if (!sliderGrid || !leftArrow || !rightArrow) {
            setTimeout(startInit, 100);
            return;
        }
        init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInit);
    } else {
        startInit();
    }
})();

