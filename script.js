// Word animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedWord = document.querySelector('.animated-word');
    const words = ['father', 'partner', 'athlete', 'professional', 'you'];
    let currentIndex = 0;

    function changeWord() {
        // Fade out
        animatedWord.classList.add('fade-out');
        
        setTimeout(() => {
            // Change word
            currentIndex = (currentIndex + 1) % words.length;
            animatedWord.textContent = words[currentIndex];
            
            // Fade in
            animatedWord.classList.remove('fade-out');
        }, 300); // Half the transition time
    }

    // Change word every 2 seconds
    setInterval(changeWord, 2000);
});

// Biomarker slideshow
const slideshow = document.querySelector('.biomarker-slideshow');
const slides = slideshow.querySelectorAll('img');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Change slide every 1.5 seconds
setInterval(nextSlide, 1500);

// Condition card expansion
document.addEventListener('DOMContentLoaded', () => {
    const conditionCards = document.querySelectorAll('.condition-card');

    conditionCards.forEach(card => {
        const expandButton = card.querySelector('.expand-icon');
        const closeButton = card.querySelector('.close-icon');

        // Handle expand button click
        expandButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to card
            // Close any other expanded cards first
            conditionCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });
            card.classList.add('expanded');
        });

        // Handle close button click
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to card
            card.classList.remove('expanded');
        });

        // Handle click on entire card
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('expanded')) {
                // Close any other expanded cards first
                conditionCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('expanded');
                    }
                });
                card.classList.add('expanded');
            }
        });
    });
});

// Dashboard navigation
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    const dashboardImages = document.querySelectorAll('.dashboard-frame img');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active image
            const targetView = button.dataset.view;
            dashboardImages.forEach(img => {
                if (img.dataset.view === targetView) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        });
    });
});

// Value slider navigation
document.addEventListener('DOMContentLoaded', () => {
    const valueGrid = document.querySelector('.value-grid');
    const prevButton = document.querySelector('.value-nav.prev');
    const nextButton = document.querySelector('.value-nav.next');
    const cards = document.querySelectorAll('.value-card');

    if (!valueGrid || !prevButton || !nextButton) return;

    let currentIndex = 0;

    const scrollToCard = (index) => {
        const card = cards[index];
        if (!card) return;
        
        const scrollPosition = card.offsetLeft - (valueGrid.offsetWidth - card.offsetWidth) / 2;
        valueGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };

    prevButton.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        scrollToCard(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = Math.min(cards.length - 1, currentIndex + 1);
        scrollToCard(currentIndex);
    });

    // Handle scroll snapping end to update currentIndex
    valueGrid.addEventListener('scrollend', () => {
        const cardWidth = cards[0].offsetWidth;
        const scrollPosition = valueGrid.scrollLeft;
        currentIndex = Math.round(scrollPosition / cardWidth);
    });
});

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('waitlistModal');
    const openButtons = document.querySelectorAll('.join-waitlist');
    const findOutLink = document.querySelector('.find-out-link');
    const closeButton = modal.querySelector('.modal-close');
    const form = modal.querySelector('.waitlist-form');

    // Function to open modal
    const openModal = (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Open modal from waitlist buttons
    openButtons.forEach(button => {
        if (!button.closest('.waitlist-form')) { // Don't attach to form submit button
            button.addEventListener('click', openModal);
        }
    });

    // Open modal from "Find out" link
    if (findOutLink) {
        findOutLink.addEventListener('click', openModal);
    }

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeButton.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Prevent closing when clicking modal content
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Replace this URL with your Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzUELHUFLcCr5RXFlg_Aup70ki-VXd1Q0V4-rELgW0QUr6U8czd3PRB3u_a9AdLl_WU/exec';

        try {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => data[key] = value);

            const response = await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Add this to handle CORS
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Since we're using no-cors, we won't get a normal response
            // So we'll assume success if we get here
            const modalHeader = modal.querySelector('.modal-header');
            modalHeader.innerHTML = `
                <h2>Thank you for joining!</h2>
                <p>We've received your information and will be in touch soon.</p>
            `;
            form.style.display = 'none';
            
            // Close modal after 3 seconds
            setTimeout(closeModal, 3000);
        } catch (error) {
            console.error('Error!', error.message);
            submitButton.textContent = 'Error - Please try again';
            submitButton.disabled = false;
        }
    });
});
