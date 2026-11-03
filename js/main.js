document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('fa-bars');
            hamburger.classList.toggle('fa-times');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('fa-times');
                hamburger.classList.add('fa-bars');
            }
        });
    });

    // 2. Sticky Header
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // 4. Number Counters Animation
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                let startValue = 0;
                const duration = 2000;
                const increment = endValue / (duration / 16); // 60fps

                const updateCounter = () => {
                    startValue += increment;
                    if (startValue < endValue) {
                        target.innerText = Math.ceil(startValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = endValue + (target.getAttribute('data-plus') ? '+' : '');
                    }
                };
                updateCounter();
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 5. Scroll to Top Button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = 'var(--glass-border)';
                }
            });

            if (isValid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = 'Sending...';
                btn.disabled = true;

                // Simulate API Call
                setTimeout(() => {
                    alert('Thank you for reaching out! Your message has been sent successfully.');
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 1500);
            }
        });
    }
});
