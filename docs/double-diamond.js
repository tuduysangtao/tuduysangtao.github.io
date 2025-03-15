/**
 * Double Diamond Framework Interactive Visualization
 * Enhanced JavaScript with accessibility, performance optimizations,
 * and better user interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements for better performance
    const problemHeader = document.getElementById('problem-header');
    const solutionHeader = document.getElementById('solution-header');
    const problemDiamond = document.getElementById('problem-diamond');
    const solutionDiamond = document.getElementById('solution-diamond');

    const card1 = document.getElementById('card-1');
    const card2 = document.getElementById('card-2');
    const card3 = document.getElementById('card-3');
    const card4 = document.getElementById('card-4');

    const problemExplanation = document.getElementById('problem-explanation');
    const solutionExplanation = document.getElementById('solution-explanation');

    const closeButtons = document.querySelectorAll('.explanation-close');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const diamondSides = document.querySelectorAll('.diamond-side');

    // Initialize with a small delay to allow page rendering
    setTimeout(() => {
        applyStaggeredAnimations();
    }, 100);

    /**
     * Apply staggered animations to elements to create a sequential appearance
     */
    function applyStaggeredAnimations() {
        const fadeInElements = document.querySelectorAll('.fade-in');
        const fadeInUpElements = document.querySelectorAll('.fade-in-up');
        const fadeInLeftElements = document.querySelectorAll('.fade-in-left');
        const fadeInRightElements = document.querySelectorAll('.fade-in-right');

        const applyDelayedClass = (elements, baseDelay = 0) => {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.animationDelay = '0s';
                    el.style.opacity = '0';
                    // Force reflow to ensure animation plays
                    void el.offsetWidth;
                    el.style.opacity = '';
                }, baseDelay + (index * 100));
            });
        };

        // Apply animations with staggered delays
        applyDelayedClass(fadeInElements, 0);
        applyDelayedClass(fadeInUpElements, 200);
        applyDelayedClass(fadeInLeftElements, 400);
        applyDelayedClass(fadeInRightElements, 400);
    }

    /**
     * Problem space interaction
     * Highlight related elements when hovering over the problem header
     */
    problemHeader.addEventListener('mouseenter', function () {
        problemDiamond.style.transform = 'scale(1.05)';
        card1.style.transform = 'translateY(-8px)';
        card2.style.transform = 'translateY(-8px)';
        card1.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        card2.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    });

    problemHeader.addEventListener('mouseleave', function () {
        problemDiamond.style.transform = '';
        card1.style.transform = '';
        card2.style.transform = '';
        card1.style.boxShadow = '';
        card2.style.boxShadow = '';
    });

    // Handle problem header click to show explanation
    problemHeader.addEventListener('click', function () {
        problemExplanation.classList.add('active');
        // Set ARIA attributes for accessibility
        this.setAttribute('aria-expanded', 'true');
    });

    // Handle problem header keyboard interaction
    problemHeader.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            problemExplanation.classList.add('active');
            this.setAttribute('aria-expanded', 'true');
        }
    });

    /**
     * Solution space interaction
     * Highlight related elements when hovering over the solution header
     */
    solutionHeader.addEventListener('mouseenter', function () {
        solutionDiamond.style.transform = 'scale(1.05)';
        card3.style.transform = 'translateY(-8px)';
        card4.style.transform = 'translateY(-8px)';
        card3.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        card4.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    });

    solutionHeader.addEventListener('mouseleave', function () {
        solutionDiamond.style.transform = '';
        card3.style.transform = '';
        card4.style.transform = '';
        card3.style.boxShadow = '';
        card4.style.boxShadow = '';
    });

    // Handle solution header click to show explanation
    solutionHeader.addEventListener('click', function () {
        solutionExplanation.classList.add('active');
        // Set ARIA attributes for accessibility
        this.setAttribute('aria-expanded', 'true');
    });

    // Handle solution header keyboard interaction
    solutionHeader.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            solutionExplanation.classList.add('active');
            this.setAttribute('aria-expanded', 'true');
        }
    });

    /**
     * Close explanation panels when close button is clicked
     */
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const explanationPanel = this.closest('.explanation-container');
            explanationPanel.classList.remove('active');

            // Update ARIA attributes on the related header
            const controlId = explanationPanel.id;
            const controllingHeader = document.querySelector(`[aria-controls="${controlId}"]`);
            if (controllingHeader) {
                controllingHeader.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard accessibility for close buttons
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    /**
     * Diamond quadrant highlighting
     * Add visual feedback when hovering over diamond sides
     */
    diamondSides.forEach(side => {
        side.addEventListener('mouseenter', function () {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            const title = this.querySelector('.side-title');
            title.style.transform = 'translateY(-3px) scale(1.1)';
            const description = this.querySelector('.side-description');
            description.style.transform = 'translateY(3px)';
        });

        side.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
            const title = this.querySelector('.side-title');
            title.style.transform = '';
            const description = this.querySelector('.side-description');
            description.style.transform = '';
        });

        // Keyboard accessibility for diamond sides
        side.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Toggle the hover state for keyboard users
                if (this.style.backgroundColor === 'rgba(255, 255, 255, 0.2)') {
                    this.style.backgroundColor = '';
                    this.querySelector('.side-title').style.transform = '';
                    this.querySelector('.side-description').style.transform = '';
                } else {
                    this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    this.querySelector('.side-title').style.transform = 'translateY(-3px) scale(1.1)';
                    this.querySelector('.side-description').style.transform = 'translateY(3px)';
                }
            }
        });
    });

    /**
     * FAQ accordion functionality
     */
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            toggleFaqItem(this);
        });

        // Keyboard accessibility for FAQ questions
        question.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaqItem(this);
            }
        });
    });

    /**
     * Helper function to toggle FAQ items
     */
    function toggleFaqItem(questionElement) {
        const answer = questionElement.nextElementSibling;
        const isExpanded = questionElement.classList.contains('active');

        // Close all other FAQ items first
        faqQuestions.forEach(q => {
            if (q !== questionElement) {
                q.classList.remove('active');
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.classList.remove('active');
            }
        });

        // Toggle current FAQ item
        questionElement.classList.toggle('active');
        answer.classList.toggle('active');

        // Update ARIA attributes
        questionElement.setAttribute('aria-expanded', !isExpanded);
    }

    /**
     * Add subtle tilt effect to diamonds on mousemove for enhanced interactivity
     */
    const diamonds = document.querySelectorAll('.diamond');

    diamonds.forEach(diamond => {
        diamond.addEventListener('mousemove', function (e) {
            // Check if user prefers reduced motion
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calculate the distance from center
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Apply subtle tilt based on mouse position
                const tiltX = ((y - centerY) / centerY) * 3;
                const tiltY = ((x - centerX) / centerX) * -3;

                this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
            }
        });

        diamond.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    /**
     * Interactive icons with click effects
     */
    const icons = document.querySelectorAll('.icon');

    icons.forEach(icon => {
        icon.addEventListener('click', function () {
            // Add pulse effect on click
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);

            // Highlight related diamond based on icon clicked
            if (this.classList.contains('problem-icon')) {
                problemDiamond.style.transform = 'scale(1.05)';
                animatePulse(problemDiamond);
                highlightCards([card1, card2]);
            }

            // If solution icon clicked, highlight solution space
            if (this.classList.contains('solution-icon')) {
                solutionDiamond.style.transform = 'scale(1.05)';
                animatePulse(solutionDiamond);
                highlightCards([card3, card4]);
            }
        });

        // Keyboard accessibility for icons
        icon.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    /**
     * Helper function to add a temporary pulse animation to an element
     * @param {HTMLElement} element - The element to animate
     */
    function animatePulse(element) {
        // Only apply if reduced motion is not preferred
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Temporarily disable transition for the animation
            const originalTransition = element.style.transition;
            element.style.transition = 'none';

            // Add pulse animation 
            element.animate([
                { transform: 'scale(1.05)', boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.4)' },
                { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(37, 99, 235, 0)' }
            ], {
                duration: 1000,
                iterations: 1
            });

            // Reset after animation
            setTimeout(() => {
                element.style.transition = originalTransition;
                element.style.transform = '';
            }, 1500);
        } else {
            // Just briefly highlight for reduced motion preference
            setTimeout(() => {
                element.style.transform = '';
            }, 500);
        }
    }

    /**
     * Helper function to highlight process cards with animation
     * @param {Array} cards - Array of card elements to highlight
     */
    function highlightCards(cards) {
        // Only apply if reduced motion is not preferred
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            cards.forEach(card => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';

                // Reset after animation
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }, 1500);
            });
        }
    }

    // Add intersection observer for scroll-triggered animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a subtle bounce effect when element scrolls into view
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        entry.target.animate([
                            { transform: 'translateY(0)' },
                            { transform: 'translateY(-10px)' },
                            { transform: 'translateY(0)' }
                        ], {
                            duration: 800,
                            easing: 'ease-out'
                        });
                    }

                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe process cards, example cards and FAQ items
        document.querySelectorAll('.process-card, .example-card, .faq-item').forEach(item => {
            observer.observe(item);
        });
    }

    // Close explanation panels when clicking outside of them
    document.addEventListener('click', function (e) {
        const clickedInsideExplanation = e.target.closest('.explanation-container');
        const clickedOnHeader = e.target.closest('.section-header');

        if (!clickedInsideExplanation && !clickedOnHeader) {
            // Close all explanation panels
            document.querySelectorAll('.explanation-container').forEach(panel => {
                panel.classList.remove('active');
            });

            // Reset ARIA attributes on headers
            document.querySelectorAll('.section-header').forEach(header => {
                header.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Support for escape key to close explanation panels
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const activeExplanations = document.querySelectorAll('.explanation-container.active');
            if (activeExplanations.length > 0) {
                activeExplanations.forEach(panel => {
                    panel.classList.remove('active');

                    // Update ARIA attributes on the related header
                    const controlId = panel.id;
                    const controllingHeader = document.querySelector(`[aria-controls="${controlId}"]`);
                    if (controllingHeader) {
                        controllingHeader.setAttribute('aria-expanded', 'false');
                    }
                });

                // Return focus to the appropriate header
                const lastActiveHeader = document.querySelector('.section-header[aria-expanded="true"]');
                if (lastActiveHeader) {
                    lastActiveHeader.setAttribute('aria-expanded', 'false');
                    lastActiveHeader.focus();
                }
            }
        }
    });

    // Initialize ARIA states
    function initializeAriaStates() {
        // Set initial ARIA states for section headers
        document.querySelectorAll('.section-header').forEach(header => {
            header.setAttribute('aria-expanded', 'false');
        });

        // Set initial ARIA states for FAQ items
        faqQuestions.forEach(question => {
            question.setAttribute('aria-expanded', 'false');
        });

        // Make explanation close buttons accessible via keyboard
        closeButtons.forEach(btn => {
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('role', 'button');
        });
    }

    // Initialize ARIA states when page loads
    initializeAriaStates();
});