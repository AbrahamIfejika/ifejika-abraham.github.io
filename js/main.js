// Author: Abraham Ifejika
// Student ID: 100948478
// Date: 21/01/24

// DOMContentLoaded Event Listener
window.addEventListener('DOMContentLoaded', () => {
    // Highlight the active page in the navbar
    highlightActiveNavLink();

    // Add 'Donate' link dynamically to the navbar
    addDonateLink();

    // Back to Top Button Logic
    setupBackToTopButton();
});

// Highlight Active Page in Navbar
function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

// Add 'Donate' Link to Navbar
function addDonateLink() {
    const navbar = document.querySelector('.navbar-nav');
    const donateLink = document.createElement('li');
    donateLink.className = 'nav-item';
    donateLink.innerHTML = '<a class="nav-link" href="#">Donate</a>';
    navbar.appendChild(donateLink);
}

// Setup Back to Top Button
function setupBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.textContent = '⬆';
    document.body.appendChild(backToTopButton);

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Smooth scroll to top
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
