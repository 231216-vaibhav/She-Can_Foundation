/* 
   She Can Foundation - Modern NGO Single-Page Website
   Interactive Logic & Features (Vanilla JS)
*/

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Theme Management (Light / Dark Mode Toggle)
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check saved theme or respect system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme button click listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            let newTheme = 'light';
            
            if (currentTheme === 'light') {
                newTheme = 'dark';
            }
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ----------------------------------------------------
    // 2. Sticky Header scroll styling
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger immediately in case page is loaded scrolled

    // ----------------------------------------------------
    // 3. Mobile Navigation Menu Toggle
    // ----------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        // Toggle mobile menu drawer
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Close menu when clicking navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ----------------------------------------------------
    // 4. ScrollSpy: Highlight active navigation link
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 100; // Offset for sticky navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    // ----------------------------------------------------
    // 5. Scroll Entrance Animations (IntersectionObserver)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve element to run animation only once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust scroll trigger threshold offset
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------
    // 6. Impact Statistics Count-up Animations
    // ----------------------------------------------------
    const counterElements = document.querySelectorAll('.counter');
    
    const animateCounter = (counterEl) => {
        const targetVal = parseInt(counterEl.getAttribute('data-target'), 10);
        const suffix = counterEl.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds animation duration
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function (easeOutQuad)
            const easedProgress = progress * (2 - progress);
            
            const currentVal = Math.floor(easedProgress * targetVal);
            counterEl.textContent = currentVal.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                counterEl.textContent = targetVal.toLocaleString() + suffix;
            }
        };
        
        requestAnimationFrame(updateNumber);
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% visible in viewport
    });
    
    counterElements.forEach(counter => counterObserver.observe(counter));

    // ----------------------------------------------------
    // 7. Interactive Form Validation & API Connection
    // ----------------------------------------------------
    const regForm = document.getElementById('registration-form');
    
    // Inputs & Error span fields
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const messageInput = document.getElementById('reg-message');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    
    const submitBtn = document.getElementById('btn-submit');
    const spinner = document.getElementById('submit-spinner');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    // Toast Notification Dispatcher
    const showToast = (title, message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-card toast-${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        } else {
            iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
        }

        toast.innerHTML = `
            <div class="toast-icon-box">
                ${iconSvg}
            </div>
            <div class="toast-content-box">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close-btn" aria-label="Close Toast">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        `;

        container.appendChild(toast);

        // Bind close button click
        const closeBtn = toast.querySelector('.toast-close-btn');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('slide-out');
            setTimeout(() => toast.remove(), 400);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('slide-out');
                setTimeout(() => toast.remove(), 400);
            }
        }, 5000);
    };

    // Client-side Real-time Validation helpers
    const validateName = () => {
        if (!nameInput) return false;
        const val = nameInput.value.trim();
        if (val.length === 0) {
            showFieldError(nameInput, nameError, 'Full name is required');
            return false;
        } else if (val.length < 2) {
            showFieldError(nameInput, nameError, 'Name must be at least 2 characters long');
            return false;
        } else if (val.length > 50) {
            showFieldError(nameInput, nameError, 'Name cannot exceed 50 characters');
            return false;
        }
        clearFieldError(nameInput, nameError);
        return true;
    };

    const validateEmail = () => {
        if (!emailInput) return false;
        const val = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val.length === 0) {
            showFieldError(emailInput, emailError, 'Email address is required');
            return false;
        } else if (!emailRegex.test(val)) {
            showFieldError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        clearFieldError(emailInput, emailError);
        return true;
    };

    const validateMessage = () => {
        if (!messageInput) return false;
        const val = messageInput.value.trim();
        if (val.length === 0) {
            showFieldError(messageInput, messageError, 'Message details are required');
            return false;
        } else if (val.length < 5) {
            showFieldError(messageInput, messageError, 'Message must be at least 5 characters long');
            return false;
        } else if (val.length > 1000) {
            showFieldError(messageInput, messageError, 'Message cannot exceed 1000 characters');
            return false;
        }
        clearFieldError(messageInput, messageError);
        return true;
    };

    const showFieldError = (inputEl, errorEl, msg) => {
        if (!inputEl || !errorEl) return;
        inputEl.classList.remove('valid');
        inputEl.classList.add('invalid');
        errorEl.textContent = msg;
    };

    const clearFieldError = (inputEl, errorEl) => {
        if (!inputEl || !errorEl) return;
        inputEl.classList.remove('invalid');
        inputEl.classList.add('valid');
        errorEl.textContent = '';
    };

    // Attach real-time keyup and blur listeners
    if (nameInput) {
        nameInput.addEventListener('input', validateName);
        nameInput.addEventListener('blur', validateName);
    }
    if (emailInput) {
        emailInput.addEventListener('input', validateEmail);
        emailInput.addEventListener('blur', validateEmail);
    }
    if (messageInput) {
        messageInput.addEventListener('input', validateMessage);
        messageInput.addEventListener('blur', validateMessage);
    }

    // Submit listener
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Run all validations
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMsgValid = validateMessage();

            if (!isNameValid || !isEmailValid || !isMsgValid) {
                showToast('Validation Error', 'Please correct the highlighted errors before submitting.', 'warning');
                return;
            }

            // Set loading state
            if (btnText) btnText.textContent = 'Registering...';
            if (spinner) spinner.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;

            const payload = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            try {
                let success = false;
                let result = null;
                
                // Check if we are running in a static environment (e.g., GitHub Pages or no server)
                const isStaticEnv = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';
                
                if (isStaticEnv) {
                    // Simulate network delay for premium feel
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    const submissions = JSON.parse(localStorage.getItem('static_submissions') || '[]');
                    const newSubmission = {
                        _id: 'sub_' + Math.random().toString(36).substr(2, 9),
                        name: payload.name,
                        email: payload.email,
                        message: payload.message,
                        createdAt: new Date().toISOString()
                    };
                    submissions.unshift(newSubmission);
                    localStorage.setItem('static_submissions', JSON.stringify(submissions));
                    
                    success = true;
                    result = { success: true };
                } else {
                    // Post to Express backend endpoint
                    const response = await fetch('/api/submissions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    result = await response.json();
                    success = response.ok && result.success;
                }

                if (success) {
                    showToast('Registration Successful', 'Thank you! Your registration has been received successfully.', 'success');
                    
                    // Reset Form and fields class lists
                    regForm.reset();
                    [nameInput, emailInput, messageInput].forEach(input => {
                        input.classList.remove('valid', 'invalid');
                    });
                } else {
                    // Backend validation error or spam limit warning
                    const errMsg = result.message || (result.errors && result.errors[0].message) || 'Failed to submit registration.';
                    showToast('Submission Rejected', errMsg, 'error');
                }
            } catch (error) {
                console.error('Submission API error:', error);
                
                // Fallback to localStorage on network error
                console.log('Falling back to local storage due to connection failure.');
                const submissions = JSON.parse(localStorage.getItem('static_submissions') || '[]');
                const newSubmission = {
                    _id: 'sub_' + Math.random().toString(36).substr(2, 9),
                    name: payload.name,
                    email: payload.email,
                    message: payload.message,
                    createdAt: new Date().toISOString()
                };
                submissions.unshift(newSubmission);
                localStorage.setItem('static_submissions', JSON.stringify(submissions));
                
                showToast('Registration Saved Offline', 'Thank you! Your registration has been saved offline/locally.', 'success');
                regForm.reset();
                [nameInput, emailInput, messageInput].forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
            } finally {
                // Reset button loading state
                if (btnText) btnText.textContent = 'Submit Registration';
                if (spinner) spinner.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});

