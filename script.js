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

// Throttle function for scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// ===== PRELOADER =====
class Preloader {
    constructor() {
        this.preloader = $('#preloader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 1500);
        });
    }

    hide() {
        this.preloader.classList.add('hidden');
        setTimeout(() => {
            this.preloader.style.display = 'none';
        }, 500);
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = $('#navbar');
        this.navToggle = $('#nav-toggle');
        this.navMenu = $('#nav-menu');
        this.navLinks = $$('.nav-link');
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLink();
    }

    setupScrollEffect() {
        const handleScroll = throttle(() => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            }
        });
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = $(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveLink() {
        const sections = $$('section[id]');
        
        const handleScroll = throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = $$('.animate-on-scroll, .section-header, .service-card, .gallery-item, .contact-item');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addAnimationClasses();
    }

    addAnimationClasses() {
        this.animatedElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, options);

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===== GALLERY MODAL =====
class GalleryModal {
    constructor() {
        this.modal = $('#gallery-modal');
        this.modalImage = $('#modal-image');
        this.modalTitle = $('#modal-title');
        this.modalDescription = $('#modal-description');
        this.modalClose = $('.modal-close');
        this.galleryItems = $$('.gallery-item');
        this.init();
    }

    init() {
        this.setupGalleryItems();
        this.setupModalClose();
        this.setupKeyboardNavigation();
    }

    setupGalleryItems() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-info h3').textContent;
                const description = item.querySelector('.gallery-info p').textContent;
                
                this.openModal(img.src, img.alt, title, description);
            });
        });
    }

    setupModalClose() {
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openModal(src, alt, title, description) {
        this.modalImage.src = src;
        this.modalImage.alt = alt;
        this.modalTitle.textContent = title;
        this.modalDescription.textContent = description;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add animation
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
    }

    closeModal() {
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.setupResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        const heroSection = $('#home');
        if (heroSection) {
            heroSection.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
        }
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${240 + Math.random() * 60}, 70%, 60%)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    setupResize() {
        window.addEventListener('resize', debounce(() => {
            this.resize();
        }, 250));
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        const images = $$('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            $$('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        const criticalImages = [
            'images/hero.jpg',
            'images/tattoo1.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// ===== TOUCH GESTURES =====
class TouchGestures {
    constructor() {
        this.init();
    }

    init() {
        this.setupSwipeGestures();
        this.setupTouchFeedback();
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left
                    this.handleSwipeLeft();
                } else {
                    // Swipe right
                    this.handleSwipeRight();
                }
            }
        });
    }

    setupTouchFeedback() {
        const touchElements = $$('.cta-primary, .cta-secondary, .main-cta-button, .gallery-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
            });

            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        });
    }

    handleSwipeLeft() {
        // Navigate to next section
        const currentSection = this.getCurrentSection();
        const nextSection = currentSection?.nextElementSibling;
        if (nextSection && nextSection.tagName === 'SECTION') {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleSwipeRight() {
        // Navigate to previous section
        const currentSection = this.getCurrentSection();
        const prevSection = currentSection?.previousElementSibling;
        if (prevSection && prevSection.tagName === 'SECTION') {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    getCurrentSection() {
        const sections = $$('section');
        let current = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                current = section;
            }
        });
        
        return current;
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.detectSystemTheme();
        this.setupThemeToggle();
    }

    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
    }

    setupThemeToggle() {
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
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
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize all components
        new Preloader();
        new Navigation();
        new ScrollAnimations();
        new GalleryModal();
        new PerformanceMonitor();
        new TouchGestures();
        new ThemeManager();
        
        // Initialize particle system only on desktop for performance
        if (window.innerWidth > 768) {
            new ParticleSystem();
        }

        // Add typing animation to hero subtitle if element exists
        const heroSubtitle = $('.hero-description');
        if (heroSubtitle) {
            const texts = [
                'Создаем уникальные истории на твоей коже',
                'Каждая татуировка — произведение искусства',
                'Твоя история начинается здесь'
            ];
            new TypingAnimation(heroSubtitle, texts, 80);
        }

        // Setup additional interactions
        this.setupAdditionalInteractions();
    }

    setupAdditionalInteractions() {
        // Smooth scroll for all anchor links
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(link.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add ripple effect to buttons
        $$('.cta-primary, .main-cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = button.querySelector('.button-ripple');
                if (ripple) {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                    setTimeout(() => {
                        ripple.style.width = '300px';
                        ripple.style.height = '300px';
                    }, 10);
                }
            });
        });

        // Setup form validation if forms exist
        this.setupFormValidation();
        
        // Setup analytics tracking
        this.setupAnalytics();
    }

    setupFormValidation() {
        const forms = $$('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    setupAnalytics() {
        // Track button clicks
        $$('.cta-primary, .cta-secondary, .main-cta-button').forEach(button => {
            button.addEventListener('click', () => {
                // Analytics tracking code would go here
                console.log('Button clicked:', button.textContent.trim());
            });
        });

        // Track section views
        const sections = $$('section[id]');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Analytics tracking code would go here
                    console.log('Section viewed:', entry.target.id);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

// Start the application
new App();
