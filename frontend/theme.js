// Prospera AI Realtors - Core Frontend Theme & Navigation
(function() {
    // Single light visual system lock
    function applyLightSystem() {
        if (document.documentElement) {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.remove('dark');
        }
    }
    applyLightSystem();

    // Compatibility no-op stubs for any legacy references
    window.toggleTheme = function() {
        applyLightSystem();
    };

    window.initThemeUI = function() {
        applyLightSystem();
    };

    // Header Navigation: About Dropdown Toggle (Desktop & Mobile)
    window.toggleAboutDropdown = function(event, id) {
        if (event) { event.preventDefault(); event.stopPropagation(); }
        const wrap = document.getElementById(id);
        if (!wrap) return;
        const isOpen = wrap.classList.toggle("is-open");
        const trigger = wrap.querySelector(".prospera-about-trigger,.prospera-mobile-about-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", String(isOpen));
    };

    // Header Navigation: Outside Click to Close Dropdown
    document.addEventListener("click", function(event) {
        document.querySelectorAll(".prospera-about-dropdown.is-open,.prospera-mobile-about.is-open").forEach(function(wrap) {
            if (!wrap.contains(event.target)) {
                wrap.classList.remove("is-open");
                const trigger = wrap.querySelector(".prospera-about-trigger,.prospera-mobile-about-trigger");
                if (trigger) trigger.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Header Navigation: Mobile Hamburger Menu Toggle
    window.toggleMobileMenu = function() {
        const menu = document.getElementById("mobileMenu");
        const icon = document.getElementById("mobileMenuIcon");
        if (!menu) return;
        const hidden = menu.classList.contains("hidden");
        menu.classList.toggle("hidden", !hidden);
        if (icon) {
            icon.classList.toggle("fa-bars", !hidden);
            icon.classList.toggle("fa-xmark", hidden);
        }
    };

    // Global location helper for footer links
    if (!window.askAILocation) {
        window.askAILocation = function(loc) {
            window.location.href = 'ai-property-finder.html?q=' + encodeURIComponent('Find best properties in ' + loc);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLightSystem);
    }
})();
