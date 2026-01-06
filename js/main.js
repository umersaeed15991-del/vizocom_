/**
 * Progeen-Style Hero Section
 * 
 * Manages:
 * - One-time background image reveal animation
 * - Panel active state on hover/click
 * - Strict layout locking (no width changes)
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const heroBgBase = document.querySelector('.hero-bg-base');
        const heroBgOverlays = document.querySelector('.hero-bg-overlays');
        const panels = document.querySelectorAll('.panel');

        // ============================================
        // PANEL ACTIVE STATE - Toggle on hover/click
        // New image slides in from left on top of previous images
        // Previous images remain visible underneath
        // ============================================
        let activePanel = null;
        let previousPanel = null;
        let isLocked = false; // Track if a panel is clicked (locked)
        let lockedPanel = null;
        let activeOverlays = new Map(); // Track active overlay layers
        let overlayZIndex = 3; // Starting z-index for overlays (increment for each new overlay)
        
        function getBackgroundClass(panel) {
            if (!panel) return '';
            
            if (panel.classList.contains('panel-ict')) {
                return 'bg-ict';
            } else if (panel.classList.contains('panel-internet')) {
                return 'bg-internet';
            } else if (panel.classList.contains('panel-cyber')) {
                return 'bg-cyber';
            } else if (panel.classList.contains('panel-ai')) {
                return 'bg-ai';
            }
            return ''; // About panel uses default background
        }
        
        function getImagePathForClass(bgClass) {
            const imageMap = {
                'bg-ict': 'assets/images/services/ict_integrated_services.png',
                'bg-internet': 'assets/images/services/internet_services.jpg',
                'bg-cyber': 'assets/images/services/cyber_security.jpg',
                'bg-ai': 'assets/images/services/ai_services1.jpg'
            };
            return imageMap[bgClass] || null;
        }
        
        // Preload hero section images for better performance
        function preloadHeroImages() {
            const heroImages = [
                'assets/images/services/ict_integrated_services.png',
                'assets/images/services/internet_services.jpg',
                'assets/images/services/cyber_security.jpg',
                'assets/images/services/ai_services1.jpg'
            ];
            
            heroImages.forEach(function(imagePath) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = imagePath;
                link.fetchPriority = 'low'; // Low priority for hover images
                document.head.appendChild(link);
            });
        }
        
        // Preload hero images after initial page load
        if (document.readyState === 'complete') {
            setTimeout(preloadHeroImages, 1000);
        } else {
            window.addEventListener('load', function() {
                setTimeout(preloadHeroImages, 1000);
            });
        }
        
        function animateBackgroundReveal(panel, shouldAnimate) {
            if (!heroBgBase || !heroBgOverlays) return;
            
            const bgClass = getBackgroundClass(panel);
            
            // If no background class (like About panel), don't do anything
            if (!bgClass) return;
            
            // Only animate if shouldAnimate is true (not locked)
            if (shouldAnimate) {
                // Remove existing overlay of same type if it exists (to allow re-animation)
                if (activeOverlays.has(bgClass)) {
                    const existingOverlay = activeOverlays.get(bgClass);
                    if (existingOverlay && existingOverlay.parentNode) {
                        existingOverlay.parentNode.removeChild(existingOverlay);
                    }
                    activeOverlays.delete(bgClass);
                }
                
                // Create new overlay layer
                const overlay = document.createElement('div');
                overlay.className = 'hero-bg-overlay ' + bgClass;
                overlay.style.zIndex = overlayZIndex++; // Increment z-index for each new overlay
                
                // Add to container
                heroBgOverlays.appendChild(overlay);
                
                // Store reference
                activeOverlays.set(bgClass, overlay);
                
                // Trigger slide-in animation
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        overlay.classList.add('sliding-in');
                    });
                });
                
                // Keep all overlays visible - they stack on top of each other
            } else {
                // If locked, set base background without animation
                heroBgBase.classList.remove('bg-ict', 'bg-internet', 'bg-cyber', 'bg-ai');
                if (bgClass) {
                    heroBgBase.classList.add(bgClass);
                }
                
                // Clear all overlays when locked
                activeOverlays.forEach(function(overlay) {
                    overlay.classList.add('sliding-out');
                    setTimeout(function() {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 800);
                });
                activeOverlays.clear();
            }
        }
        
        function setActivePanel(panel, shouldAnimate) {
            // Remove active from all panels
            panels.forEach(function(p) {
                p.classList.remove('active');
            });
            
            // Set new active panel
            if (panel) {
                panel.classList.add('active');
                activePanel = panel;
                
                // Always animate on hover (unless locked), even if same panel
                if (shouldAnimate) {
                    animateBackgroundReveal(panel, true);
                } else {
                    animateBackgroundReveal(panel, false);
                }
                previousPanel = panel;
            } else {
                activePanel = null;
                
                // Reset to About background when no panel is active
                if (previousPanel) {
                    animateBackgroundReveal(null, shouldAnimate);
                    previousPanel = null;
                }
            }
        }
        
        panels.forEach(function(panel) {
            // Handle hover - activate panel and animate background (only if not locked)
            panel.addEventListener('mouseenter', function() {
                if (!isLocked || panel === lockedPanel) {
                    setActivePanel(panel, true);
                }
            });
            
            // Handle mouse leave - keep overlays visible (they stack on top of each other)
            // You can add cleanup logic here if needed
            
            // Handle click - lock panel and fix background
            panel.addEventListener('click', function(e) {
                // Don't toggle if clicking on a link
                if (e.target.tagName === 'A') {
                    return;
                }
                
                // If clicking the same locked panel, unlock it
                if (isLocked && panel === lockedPanel) {
                    isLocked = false;
                    lockedPanel = null;
                    setActivePanel(null, false);
                } else {
                    // Lock this panel
                    isLocked = true;
                    lockedPanel = panel;
                    setActivePanel(panel, false); // No animation on click, just fix it
                }
            });
        });

        // ============================================
        // SIDEBAR MENU - Hamburger menu functionality
        // ============================================
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const sidebarMenu = document.getElementById('sidebarMenu');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebarClose = document.getElementById('sidebarClose');

        function openSidebar() {
            if (sidebarMenu && sidebarOverlay && hamburgerMenu) {
                sidebarMenu.classList.add('active');
                sidebarOverlay.classList.add('active');
                hamburgerMenu.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
        }

        function closeSidebar() {
            if (sidebarMenu && sidebarOverlay && hamburgerMenu) {
                sidebarMenu.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = ''; // Restore body scroll
            }
        }

        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger clicked');
                if (sidebarMenu && sidebarMenu.classList.contains('active')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        } else {
            console.warn('Hamburger menu not found');
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeSidebar();
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function(e) {
                e.preventDefault();
                closeSidebar();
            });
        }

        // Close sidebar when clicking on a link
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeSidebar();
            });
        });

        // Close sidebar on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebarMenu && sidebarMenu.classList.contains('active')) {
                closeSidebar();
            }
        });

        // ============================================
        // DEFENSE SECTION - Sliding carousel effect
        // Current section slides right, new section comes from left
        // Rotates background + label + left panel content every 3 seconds
        // Includes 5 industries with "WE CONNECT" taglines
        // ============================================
        const defensePanelLeft = document.querySelector('.defense-panel-left');
        const defensePanelRight = document.querySelector('.defense-panel-right');
        const defenseContentWrapper = document.querySelector('.defense-content-wrapper');
        const defenseImageWrapper = document.querySelector('.defense-image-wrapper');
        const defenseLabel = document.querySelector('.defense-label');
        const defenseHeading = document.querySelector('.defense-heading');
        const defenseSubheading = document.querySelector('.defense-content h2');
        const defenseCta = document.querySelector('.defense-cta span');

        if (defensePanelRight && defenseLabel && defenseHeading && defenseSubheading && defenseCta) {
            // Industry carousel slides - Update image paths when you have the actual images
            const defenseSlides = [
                {
                    // Image: Soldiers connecting (preferably with their families) - using existing image
                    label: 'Defense / Military',
                    industryClass: 'industry-defense',
                    placeholderClass: '',
                    background: "url('assets/images/defense/defense_military_left.png')",
                    ariaLabel: 'Soldiers connecting with their families and mission command',
                    heading: 'WE CONNECT',
                    subheading: 'Warfighters to Mission Command',
                    ctaText: 'Learn More'
                },
                {
                    // Image: Men working on oil rigs (close-up of workers on rig) - using provided image
                    label: 'Oil & Gas / Energy',
                    industryClass: 'industry-oil-gas',
                    placeholderClass: 'placeholder-oil-gas',
                    background: "url('assets/images/defense/oil & gas.jpg')",
                    ariaLabel: 'Men working on oil rigs connecting to operational control',
                    heading: 'WE CONNECT',
                    subheading: 'Remote Rigs to Operational Control',
                    ctaText: 'Learn More'
                },
                {
                    // Image: Humanitarian case with people helping - medics helping - using provided image
                    label: 'Humanitarian / NGO',
                    industryClass: 'industry-humanitarian',
                    placeholderClass: 'placeholder-humanitarian',
                    background: "url('assets/images/defense/– image a humanitarian case with people helping – medics helping.jpg')",
                    ariaLabel: 'Humanitarian aid workers and medics helping people in need',
                    heading: 'WE CONNECT',
                    subheading: 'Aid Workers to Life-Saving Resources',
                    ctaText: 'Learn More'
                },
                {
                    // Image: Embassy with people in their offices - using provided image
                    label: 'Government / Public Sector',
                    industryClass: 'industry-government',
                    placeholderClass: 'placeholder-government',
                    background: "url('assets/images/defense/Government-public Sector .jpg')",
                    rightBackground: "url('assets/images/defense/border.jpg')",
                    ariaLabel: 'Embassy and government offices with people working',
                    heading: 'WE CONNECT',
                    subheading: 'Border Posts to Border Control Command',
                    ctaText: 'Learn More'
                },
                {
                    // Image: Enterprise/remote business setting - using provided image
                    label: 'Enterprise / Remote Business',
                    industryClass: 'industry-enterprise',
                    placeholderClass: 'placeholder-enterprise',
                    background: "url('assets/images/defense/Enterprise _ Remote Business.jpg')",
                    ariaLabel: 'Enterprise field offices connected to global networks',
                    heading: 'WE CONNECT',
                    subheading: 'Field Offices to Global Networks',
                    ctaText: 'Learn More'
                }
            ];

            let defenseIndex = 0;
            let isAnimating = false;

            // Remove all industry classes
            function removeIndustryClasses() {
                defensePanelRight.classList.remove(
                    'industry-defense',
                    'industry-oil-gas',
                    'industry-humanitarian',
                    'industry-government',
                    'industry-enterprise',
                    'placeholder-oil-gas',
                    'placeholder-humanitarian',
                    'placeholder-government',
                    'placeholder-enterprise'
                );
            }

            function setDefenseSlide(index, animate) {
                const slide = defenseSlides[index];
                if (!slide || isAnimating) return;

                // If no animation needed, just update content
                if (!animate) {
                    updateSlideContent(slide);
                    return;
                }

                // Start slide animation
                isAnimating = true;

                // Step 1: Slide out current content (both panels)
                const currentContent = defenseContentWrapper.querySelector('.defense-content');
                const currentLabel = defenseImageWrapper.querySelector('.defense-label');
                
                // Slide out left panel content and background
                if (currentContent) {
                    currentContent.classList.remove('defense-content-active');
                    currentContent.classList.add('defense-content-slide-out');
                }
                
                // Slide out left panel background
                if (defensePanelLeft) {
                    defensePanelLeft.classList.remove('defense-panel-active');
                    defensePanelLeft.classList.add('defense-panel-slide-out');
                }
                
                // Slide out right panel (entire panel including image and label)
                defensePanelRight.classList.remove('defense-panel-active');
                defensePanelRight.classList.add('defense-panel-slide-out');
                
                if (currentLabel) {
                    currentLabel.classList.remove('defense-label-active');
                    currentLabel.classList.add('defense-label-slide-out');
                }

                // Step 2: After slide-out animation, create new content and slide in
                setTimeout(function() {
                    // Remove old content
                    if (currentContent) {
                        currentContent.remove();
                    }
                    if (currentLabel) {
                        currentLabel.remove();
                    }

                    // Create new content elements
                    const newContent = document.createElement('div');
                    newContent.className = 'defense-content defense-content-fixed defense-content-slide-in';
                    newContent.innerHTML = `
                        <h1 class="defense-heading">${slide.heading}</h1>
                        <h2>${slide.subheading}</h2>
                        <div class="defense-text-wrapper">
                            <a href="#" class="defense-cta"><span>${slide.ctaText}</span></a>
                        </div>
                    `;

                    const newLabel = document.createElement('div');
                    newLabel.className = 'defense-label defense-label-slide-in';
                    newLabel.textContent = slide.label;

                    // Add to DOM (initially hidden)
                    defenseContentWrapper.appendChild(newContent);
                    defenseImageWrapper.appendChild(newLabel);

                    // Update background image (during transition)
                    updateBackgroundImage(slide);

                    // Set left panel to slide-in position
                    if (defensePanelLeft) {
                        defensePanelLeft.classList.remove('defense-panel-slide-out');
                        defensePanelLeft.classList.add('defense-panel-slide-in');
                    }

                    // Set right panel to slide-in position
                    defensePanelRight.classList.remove('defense-panel-slide-out');
                    defensePanelRight.classList.add('defense-panel-slide-in');

                    // Step 3: Trigger slide-in animation (both panels together)
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            // Slide in left panel content
                            newContent.classList.remove('defense-content-slide-in');
                            newContent.classList.add('defense-content-active');
                            
                            // Slide in left panel background
                            if (defensePanelLeft) {
                                defensePanelLeft.classList.remove('defense-panel-slide-in');
                                defensePanelLeft.classList.add('defense-panel-active');
                            }
                            
                            // Slide in right panel (entire panel)
                            defensePanelRight.classList.remove('defense-panel-slide-in');
                            defensePanelRight.classList.add('defense-panel-active');
                            
                            // Slide in label
                            newLabel.classList.remove('defense-label-slide-in');
                            newLabel.classList.add('defense-label-active');
                        });
                    });

                    // Step 4: Mark animation as complete
                    setTimeout(function() {
                        isAnimating = false;
                    }, 600);
                }, 600);
            }

            function updateBackgroundImage(slide) {
                // Remove all industry classes first
                removeIndustryClasses();

                // Load left panel image
                const leftImagePath = slide.background.replace("url('", '').replace("')", '');
                const leftImg = new Image();
                leftImg.loading = 'eager';
                leftImg.fetchPriority = 'high';
                
                // Determine right panel image path
                const rightBg = slide.rightBackground || slide.background;
                const rightImagePath = rightBg.replace("url('", '').replace("')", '');
                const rightImg = new Image();
                rightImg.loading = 'eager';
                rightImg.fetchPriority = 'high';
                
                let leftLoaded = false;
                let rightLoaded = false;
                
                function updateIfReady() {
                    if (leftLoaded && rightLoaded) {
                        // Both images loaded - update backgrounds
                        defensePanelLeft.style.backgroundImage = slide.background;
                        defensePanelRight.style.backgroundImage = rightBg;
                        if (slide.industryClass) {
                            defensePanelRight.classList.add(slide.industryClass);
                        }
                    }
                }
                
                // Load left panel image
                leftImg.onload = function() {
                    leftLoaded = true;
                    defensePanelLeft.style.backgroundImage = slide.background;
                    updateIfReady();
                };
                
                leftImg.onerror = function() {
                    leftLoaded = true;
                    defensePanelLeft.style.backgroundImage = '';
                    updateIfReady();
                };
                
                // Load right panel image
                rightImg.onload = function() {
                    rightLoaded = true;
                    defensePanelRight.style.backgroundImage = rightBg;
                    if (slide.industryClass) {
                        defensePanelRight.classList.add(slide.industryClass);
                    }
                    updateIfReady();
                };
                
                rightImg.onerror = function() {
                    rightLoaded = true;
                    defensePanelRight.style.backgroundImage = '';
                    if (slide.placeholderClass) {
                        defensePanelRight.classList.add(slide.placeholderClass);
                    }
                    if (slide.industryClass) {
                        defensePanelRight.classList.add(slide.industryClass);
                    }
                    updateIfReady();
                };
                
                // Start loading both images
                leftImg.src = leftImagePath;
                rightImg.src = rightImagePath;
                defensePanelRight.setAttribute('aria-label', slide.ariaLabel);
            }
            
            // Preload next carousel images for smoother transitions
            function preloadCarouselImages() {
                defenseSlides.forEach(function(slide, index) {
                    if (index > 0) { // Skip first image (already loaded)
                        const imagePath = slide.background.replace("url('", '').replace("')", '');
                        const link = document.createElement('link');
                        link.rel = 'preload';
                        link.as = 'image';
                        link.href = imagePath;
                        link.fetchPriority = 'low'; // Low priority for non-visible images
                        document.head.appendChild(link);
                    }
                });
            }
            
            // Preload images after page load
            if (document.readyState === 'complete') {
                setTimeout(preloadCarouselImages, 2000); // Preload after 2 seconds
            } else {
                window.addEventListener('load', function() {
                    setTimeout(preloadCarouselImages, 2000);
                });
            }

            function updateSlideContent(slide) {
                // Direct update without animation (for initial load)
                updateBackgroundImage(slide);
                
                if (defenseHeading) defenseHeading.textContent = slide.heading;
                if (defenseSubheading) defenseSubheading.textContent = slide.subheading;
                if (defenseCta) defenseCta.textContent = slide.ctaText;
                if (defenseLabel) defenseLabel.textContent = slide.label;
            }

            // Initialize first slide (no animation)
            setDefenseSlide(defenseIndex, false);
            
            // Set initial active state for both panels
            if (defensePanelLeft) {
                defensePanelLeft.classList.add('defense-panel-active');
            }
            if (defensePanelRight) {
                defensePanelRight.classList.add('defense-panel-active');
            }

            // Auto-rotate every 5 seconds (carousel effect with slide animation)
            setInterval(function() {
                defenseIndex = (defenseIndex + 1) % defenseSlides.length;
                setDefenseSlide(defenseIndex, true);
            }, 5000);
        }
    });
})();
