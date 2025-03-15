// document.addEventListener('DOMContentLoaded', function () {
//     // Add event listeners to all process cards
//     const processCards = document.querySelectorAll('.process-card');

//     processCards.forEach(card => {
//         // Add hover effect for touch devices
//         card.addEventListener('touchstart', function () {
//             this.classList.add('touch-hover');
//         }, { passive: true });

//         card.addEventListener('touchend', function () {
//             this.classList.remove('touch-hover');
//         }, { passive: true });

//         // Make cards interactive - when clicked, add 'active' class
//         card.addEventListener('click', function () {
//             // Remove active class from all cards
//             processCards.forEach(c => c.classList.remove('active'));

//             // Add active class to clicked card
//             this.classList.add('active');
//         });
//     });

//     // Add animation for elements as they scroll into view
//     // const animateOnScroll = function () {
//     //     const elements = document.querySelectorAll('.animated:not(.animation-triggered)');

//     //     elements.forEach(element => {
//     //         const elementPosition = element.getBoundingClientRect().top;
//     //         const windowHeight = window.innerHeight;

//     //         if (elementPosition < windowHeight - 50) {
//     //             const delay = element.style.animationDelay || '0s';
//     //             element.style.animationDelay = delay;
//     //             element.classList.add('animation-triggered');
//     //         }
//     //     });
//     // };

//     // Run on load
//     animateOnScroll();

//     // Run on scroll
//     window.addEventListener('scroll', animateOnScroll);

//     // Ensure diamond layouts are correct on mobile
//     const adjustForMobile = function () {
//         const diamondsContainer = document.querySelector('.diamonds-container');
//         const connectors = document.querySelectorAll('.connector');

//         if (window.innerWidth <= 768) {
//             diamondsContainer.classList.add('mobile-layout');
//             connectors.forEach(connector => {
//                 connector.style.transform = 'rotate(90deg)';
//                 connector.style.height = '30px';
//                 connector.style.width = '4px';
//             });
//         } else {
//             diamondsContainer.classList.remove('mobile-layout');
//             connectors.forEach(connector => {
//                 connector.style.transform = '';
//                 connector.style.height = '2px';
//                 connector.style.width = '';
//             });
//         }
//     };

//     // Run on load
//     adjustForMobile();

//     // Run on window resize
//     window.addEventListener('resize', adjustForMobile);

//     // Add smooth scrolling for internal links
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             e.preventDefault();

//             const targetId = this.getAttribute('href');
//             const targetElement = document.querySelector(targetId);

//             if (targetElement) {
//                 window.scrollTo({
//                     top: targetElement.offsetTop,
//                     behavior: 'smooth'
//                 });
//             }
//         });
//     });

//     // Add performance optimizations
//     // Debounce function to limit how often a function is called
//     const debounce = (func, delay) => {
//         let timeout;
//         return function () {
//             const context = this;
//             const args = arguments;
//             clearTimeout(timeout);
//             timeout = setTimeout(() => func.apply(context, args), delay);
//         };
//     };

//     // Debounced scroll and resize event handlers
//     const debouncedScroll = debounce(animateOnScroll, 10);
//     const debouncedResize = debounce(adjustForMobile, 100);

//     // Replace original event listeners with debounced versions
//     window.removeEventListener('scroll', animateOnScroll);
//     window.removeEventListener('resize', adjustForMobile);

//     window.addEventListener('scroll', debouncedScroll);
//     window.addEventListener('resize', debouncedResize);
// });