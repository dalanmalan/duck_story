// Intersection Observer для анимаций при скролле
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Наблюдаем за элементами для анимации
document.addEventListener('DOMContentLoaded', () => {
    // Анимация секций
    const animatedElements = document.querySelectorAll('.intro-content, .gallery-item, .feature-card, .cta-content');
    animatedElements.forEach(el => observer.observe(el));

    // Плавная прокрутка для индикатора
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const introSection = document.querySelector('.intro');
            if (introSection) {
                introSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Добавляем эффект параллакса для hero-bg
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroBg = document.querySelector('.hero-bg');
                if (heroBg && scrolled < window.innerHeight) {
                    heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Улучшенная обработка касаний для мобильных устройств
    const touchElements = document.querySelectorAll('.gallery-item, .cta-button, .feature-card');
    
    touchElements.forEach(element => {
        let touchStartTime;
        let touchStartY;
        
        element.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            element.style.transition = 'transform 0.1s ease-out';
            
            if (element.classList.contains('gallery-item')) {
                element.style.transform = 'scale(0.95)';
            }
        }, { passive: true });
        
        element.addEventListener('touchmove', (e) => {
            const touchMoveY = e.touches[0].clientY;
            const deltaY = Math.abs(touchMoveY - touchStartY);
            
            // Если пользователь скроллит, отменяем эффект нажатия
            if (deltaY > 10) {
                element.style.transform = '';
            }
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = Math.abs(touchEndY - touchStartY);
            
            // Восстанавливаем состояние только если это был тап, а не скролл
            if (deltaY < 10 && touchDuration < 300) {
                setTimeout(() => {
                    element.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    element.style.transform = '';
                }, 100);
            } else {
                element.style.transform = '';
            }
        }, { passive: true });
        
        element.addEventListener('touchcancel', () => {
            element.style.transform = '';
        }, { passive: true });
    });

    // Добавляем эффект мерцания для заголовка
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.2}s`;
    });

    // Оптимизация производительности: отключаем анимации при низком FPS
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;
    
    function measureFPS() {
        const currentTime = performance.now();
        frames++;
        
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frames * 1000) / (currentTime - lastTime));
            frames = 0;
            lastTime = currentTime;
            
            // Если FPS низкий, упрощаем анимации
            if (fps < 30) {
                document.body.classList.add('low-performance');
            }
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    // Запускаем измерение FPS только на мобильных устройствах
    if (window.innerWidth <= 768) {
        requestAnimationFrame(measureFPS);
    }

    // Предзагрузка изображений для галереи
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        if (img.complete) {
            img.parentElement.parentElement.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.parentElement.parentElement.classList.add('loaded');
            });
        }
    });

    // Добавляем эффект ripple для кнопки CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Добавляем CSS для ripple анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .low-performance * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
        }
        
        .gallery-item.loaded {
            animation: fadeInScale 0.6s ease-out forwards;
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    // Скрываем индикатор прокрутки при скролле
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator && window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else if (scrollIndicator && window.pageYOffset <= 100) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
});

// Обработка изменения ориентации устройства
window.addEventListener('orientationchange', () => {
    // Небольшая задержка для корректного пересчета размеров
    setTimeout(() => {
        window.scrollTo(0, window.pageYOffset + 1);
        window.scrollTo(0, window.pageYOffset - 1);
    }, 100);
});

// Предотвращение масштабирования двойным тапом на iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });
