class Cursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.cursorOutline = document.getElementById('cursor-outline');
        this.pos = { x: 0, y: 0 };
        this.posOutline = { x: 0, y: 0 };
        this.hover = false;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
        });

        setInterval(() => {
            this.posOutline.x += (this.pos.x - this.posOutline.x) * 0.25;
            this.posOutline.y += (this.pos.y - this.posOutline.y) * 0.25;
        }, 16);

        this.animate();

        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .social-link, .tag, .contact-method');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.setHover(true));
            el.addEventListener('mouseleave', () => this.setHover(false));
        });
    }

    setHover(hover) {
        this.hover = hover;
        this.cursor.classList.toggle('hover', hover);
        this.cursorOutline.classList.toggle('hover', hover);
    }

    animate() {
        this.cursor.style.left = this.pos.x + 'px';
        this.cursor.style.top = this.pos.y + 'px';
        this.cursorOutline.style.left = this.posOutline.x + 'px';
        this.cursorOutline.style.top = this.posOutline.y + 'px';
        requestAnimationFrame(() => this.animate());
    }
}

class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });

        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.menuToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll('.section-header, .about-card, .skill-card, .project-card, .contact-info, .contact-form, .hero-project-card, .hero-content');
        animateElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });

        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    entry.target.style.width = progress + '%';
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }
}

class CounterAnimation {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>发送中...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        setTimeout(() => {
            const name = this.form.querySelector('#name').value;
            alert(`感谢您的留言，${name}！我会尽快回复您。`);
            
            this.form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            inputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
        }, 1500);
    }
}

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

class PageLoader {
    constructor() {
        this.element = document.getElementById('page-transition');
        this.init();
    }

    init() {
        if (this.element) {
            this.element.style.opacity = '1';
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.element.style.opacity = '0';
                    this.element.style.transform = 'scale(1.1)';
                }, 100);
                
                setTimeout(() => {
                    this.element.style.display = 'none';
                }, 900);
            });
        }
    }
}

class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scroll-progress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            if (this.progressBar) {
                this.progressBar.style.width = progress + '%';
            }
        });
    }
}

class Parallax {
    constructor() {
        this.heroGradient = document.querySelector('.hero-bg-gradient');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (this.heroGradient && scrolled < window.innerHeight) {
                this.heroGradient.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }
}

class MagneticEffect {
    constructor() {
        this.init();
    }

    init() {
        const magneticElements = document.querySelectorAll('.social-link, .btn');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
}

class Particles {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.maxParticles = 50;
        this.init();
    }

    init() {
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机延迟
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        // 随机持续时间
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        // 随机颜色
        const opacity = Math.random() * 0.6 + 0.2;
        particle.style.background = `rgba(102, 126, 234, ${opacity})`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // 粒子动画结束后重新创建
        particle.addEventListener('animationend', () => {
            this.container.removeChild(particle);
            this.particles = this.particles.filter(p => p !== particle);
            this.createParticle();
        });
    }

    animateParticles() {
        // 粒子动画由CSS处理
    }
}

class ImageLazyLoad {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.onload = () => {
                            image.classList.add('loaded');
                        };
                        image.classList.remove('lazy');
                        imageObserver.unobserve(image);
                    }
                });
            });

            this.images.forEach(image => {
                imageObserver.observe(image);
            });
        } else {
            // 回退方案
            this.images.forEach(image => {
                image.src = image.dataset.src;
                image.classList.add('loaded');
                image.classList.remove('lazy');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Cursor();
    new Navbar();
    new ScrollAnimations();
    new CounterAnimation();
    new ProjectCards();
    new FormHandler();
    new SmoothScroll();
    new ScrollProgress();
    new PageLoader();
    new Parallax();
    new MagneticEffect();
    new Particles();
    new ImageLazyLoad();

    const style = document.createElement('style');
    style.textContent = `
        .section-header,
        .about-card,
        .skill-card,
        .project-card,
        .contact-info,
        .contact-form,
        .hero-project-card,
        .hero-content {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section-header.revealed,
        .about-card.revealed,
        .skill-card.revealed,
        .project-card.revealed,
        .contact-info.revealed,
        .contact-form.revealed,
        .hero-project-card.revealed,
        .hero-content.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-card.revealed .skill-progress {
            width: var(--progress, 90%);
        }
        
        .particle {
            will-change: transform, opacity;
        }
    `;
    document.head.appendChild(style);
});