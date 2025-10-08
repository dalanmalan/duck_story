// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.setupLazyLoading();
    }

    optimizeImages() {
        const images = $$("img");
        images.forEach(img => {
            if (!img.hasAttribute("loading")) {
                img.setAttribute("loading", "lazy");
            }
        });
    }

    setupLazyLoading() {
        if ("IntersectionObserver" in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute("data-src");
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            $$("img[data-src]").forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// ===== TOUCH GESTURES =====
class TouchGestures {
    constructor() {
        this.init();
    }

    init() {
        this.setupTouchFeedback();
    }

    setupTouchFeedback() {
        const touchElements = $$(".cta-button, .gallery-item");
        
        touchElements.forEach(element => {
            element.addEventListener("touchstart", () => {
                element.style.transform = "scale(0.95)";
            });

            element.addEventListener("touchend", () => {
                setTimeout(() => {
                    element.style.transform = "";
                }, 150);
            });
        });
    }
}

// ===== INITIALIZATION =====
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize all components
        new PerformanceMonitor();
        new TouchGestures();
    }
}

// Start the application
new App();
