// Bootstrap Offcanvas Sidebar Menu Script
(function() {
    'use strict';

    function initSidebar() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const sidebarMenu = document.getElementById('sidebarMenu');

        if (!hamburgerMenu || !sidebarMenu) {
            console.error('Sidebar elements not found');
            return;
        }

        // Get Bootstrap offcanvas instance
        const offcanvasElement = new bootstrap.Offcanvas(sidebarMenu);

        // Handle hamburger icon animation
        function toggleHamburger(isOpen) {
            if (isOpen) {
                hamburgerMenu.classList.add('active');
            } else {
                hamburgerMenu.classList.remove('active');
            }
        }

        // Listen to Bootstrap offcanvas events
        sidebarMenu.addEventListener('show.bs.offcanvas', function() {
            toggleHamburger(true);
            console.log('Sidebar opening');
        });

        sidebarMenu.addEventListener('shown.bs.offcanvas', function() {
            console.log('Sidebar opened');
        });

        sidebarMenu.addEventListener('hide.bs.offcanvas', function() {
            toggleHamburger(false);
            console.log('Sidebar closing');
        });

        sidebarMenu.addEventListener('hidden.bs.offcanvas', function() {
            console.log('Sidebar closed');
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }
})();

