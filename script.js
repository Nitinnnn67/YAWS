document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('open');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.nav')) {
                navList.classList.remove('open');
                hamburger.classList.remove('active');
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        }
    });

    // Mobile dropdown handling
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    
                    dropdowns.forEach(other => {
                        if (other !== dropdown && other.classList.contains('active')) {
                            other.classList.remove('active');
                        }
                    });
                }
            });
        }
    });

    const nestedDropdowns = document.querySelectorAll('.nested-dropdown');
    nestedDropdowns.forEach(nested => {
        if (window.innerWidth <= 768) {
            const nestedLink = nested.querySelector('a');
            nestedLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    nested.classList.toggle('active');
                }
            });
        }
    });
    
    // Modified buttons section - removed ripple effect completely
    const buttons = document.querySelectorAll('.m3-button, .m3-icon-button');
    // No ripple effect added - removed entirely

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.content, .feature-card, .achievement-card, .stat-card, .campus-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
            
            if (isVisible) {
                element.classList.add('in-view');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    
    const formInputs = document.querySelectorAll('.m3-text-field input');
    formInputs.forEach(input => {
        const validateInput = () => {
            const field = input.closest('.m3-text-field');
            if (input.validity.valid) {
                field.classList.remove('invalid');
                field.classList.add('valid');
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
            }
        };
        
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', validateInput);
    });
    
    const newsletterForm = document.querySelector('.m3-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailField = this.querySelector('input[type="email"]');
            
            if (emailField && emailField.validity.valid) {
                const successMsg = document.createElement('div');
                successMsg.textContent = 'Thank you for subscribing!';
                successMsg.classList.add('m3-success-message');
                
                this.appendChild(successMsg);
                emailField.value = '';
                
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            }
        });
    } 

    // Start notice board auto-scroll
    startScrolling();

    initializeStatCards();
});
const captions = [
    { title: "Join Us Today", text: "Experience world-class education and vibrant campus life." },
    { title: "Your Future Starts Here", text: "Explore endless learning opportunities at Saket College." },
    { title: "Learn, Grow, Succeed", text: "Join a community that fosters innovation and success." },
    { title: "Be a Part of Excellence", text: "Shape your career with our top-notch faculty and resources." }
];

let currentIndex = 0;

function changeCaption() {
    const titleElement = document.getElementById("caption-title");
    const textElement = document.getElementById("caption-text");

    currentIndex = (currentIndex + 1) % captions.length; // Loop through captions

    titleElement.style.opacity = "0";
    textElement.style.opacity = "0";

    setTimeout(() => {
        titleElement.textContent = captions[currentIndex].title;
        textElement.textContent = captions[currentIndex].text;
        
        titleElement.style.opacity = "1";
        textElement.style.opacity = "1";
    }, 500); // Delay for smooth transition
}

setInterval(changeCaption, 4000); // Change text every 4 seconds

function updateDateTime() {
    const dateTimeElement = document.getElementById("dateTime");
    if (dateTimeElement) {
        const now = new Date();
        dateTimeElement.textContent = now.toLocaleString();
    }
}

if (document.getElementById("dateTime")) {
    setInterval(updateDateTime, 1000);
    updateDateTime();
}

let noticeContainer = document.querySelector('.notices-content');
let animation;

function pauseScroll() {
    isScrollPaused = true;
    clearInterval(scrollInterval);
}

function resumeScroll() {
    isScrollPaused = false;
    startScrolling();
}

function startScrolling() {
    if (!isScrollPaused) {
        scrollInterval = setInterval(() => {
            const wrapper = document.querySelector('.notices-wrapper');
            if (wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight) {
                wrapper.scrollTop = 0;
            } else {
                wrapper.scrollTop += 1;
            }
        }, 50);
    }
}
// -------------------feature card animation-------------------
function initializeAnimations() {
    const cards = document.querySelectorAll(".feature-card");
    let delay = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Randomly select animation type
                    const animations = ['fade-up', 'fade-left', 'fade-right', 'zoom-in'];
                    const randomAnim = animations[index % animations.length];
                    entry.target.classList.add(randomAnim);
                }, delay);
                delay += 1600; // Stagger each card by 200ms
            } else {
                entry.target.classList.remove('visible', 'fade-up', 'fade-left', 'fade-right', 'zoom-in');
                delay = 1600;
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: "20px"
    });

    cards.forEach(card => {
        observer.observe(card);
        // Add enhanced hover interaction
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
}

// Replace existing style with enhanced animations
const style = document.createElement('style');
style.textContent = `
    .feature-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.9s cubic-bezier(0.4, 0, 0.2, 1);
        backface-visibility: hidden;
        will-change: transform, opacity;
    }

    .feature-card.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .feature-card.fade-up {
        transform: translateY(30px);
    }

    .feature-card.fade-left {
        transform: translateX(-30px);
    }

    .feature-card.fade-right {
        transform: translateX(30px);
    }

    .feature-card.zoom-in {
        transform: scale(0.95);
    }

    .feature-card.visible.fade-up,
    .feature-card.visible.fade-left,
    .feature-card.visible.fade-right,
    .feature-card.visible.zoom-in {
        transform: translate(0) scale(1);
    }

    .feature-card.hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }

    @media (prefers-reduced-motion: reduce) {
        .feature-card {
            transition: opacity 0.9s ease;
        }
        .feature-card.hover {
            transform: none;
        }
    }
`;
document.head.appendChild(style);

window.addEventListener("load", initializeAnimations);

function initializeStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Add number animation
    statCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
        
        const numberElement = card.querySelector('.stat-number');
        const targetNumber = parseInt(numberElement.textContent);
        let currentNumber = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(currentNumber, targetNumber, numberElement);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);
    });
}

function animateNumber(start, end, element) {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const increment = (end - start) / totalFrames;
    let currentFrame = 0;

    const animate = () => {
        currentFrame++;
        const current = Math.round(increment * currentFrame + start);
        element.textContent = current;

        if (currentFrame < totalFrames) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end;
        }
    };
    
    animate();
}