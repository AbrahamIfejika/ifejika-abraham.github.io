// Author: Abraham Ifejika
// Student ID: 100948478
// Date: 23/02/25

// DOMContentLoaded Event Listener
window.addEventListener('DOMContentLoaded', () => {
    // Highlight the active page in the navbar
    highlightActiveNavLink();

    // Add 'Donate' link dynamically to the navbar
    addDonateLink();

    // Back to Top Button Logic
    setupBackToTopButton();

    // Fetch and display events dynamically
    if (document.getElementById('events-list')) {
        fetchEvents();
    }

    // Fetch and display volunteer-related news
    if (document.getElementById('news-section')) {
        fetchVolunteerNews();
    }

    // Setup search functionality
    setupSearch();

    // Dynamically update the navbar based on user login status
    updateNavbar();
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

// Fetch and Display Events using AJAX
function fetchEvents() {
    const eventsContainer = document.getElementById('events-list');
    const eventFilter = document.getElementById('eventCategory');
    eventsContainer.innerHTML = '<p>Loading events...</p>';

    fetch('events.json') // Load from JSON file
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            return response.json();
        })
        .then(data => {
            displayFilteredEvents(data, 'all');
            eventFilter.addEventListener('change', function () {
                displayFilteredEvents(data, this.value);
            });
        })
        .catch(error => {
            eventsContainer.innerHTML = '<p>Unable to load events. Please try again later.</p>';
            console.error('Error fetching events:', error);
        });
}

// Display Filtered Events
function displayFilteredEvents(events, filter) {
    const eventsContainer = document.getElementById('events-list');
    eventsContainer.innerHTML = '';
    const filteredEvents = filter === 'all' ? events : events.filter(event => event.category === filter);

    filteredEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'col-md-4';
        eventCard.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${event.description}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                </div>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

// Fetch News API and Display Articles
function fetchVolunteerNews() {
    const apiKey = 'd2d0665d9d204b3eb7934aae73babfb4';
    const apiUrl = `https://newsapi.org/v2/everything?q=volunteering&apiKey=${apiKey}`;

    const newsContainer = document.getElementById('news-section');
    if (!newsContainer) return;
    newsContainer.innerHTML = '<p>Loading news...</p>';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            return response.json();
        })
        .then(data => {
            if (!data.articles) throw new Error('No articles found');
            newsContainer.innerHTML = '';
            data.articles.slice(0, 5).forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                `;
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => {
            newsContainer.innerHTML = '<p class="alert alert-danger">Error fetching news. Please try again later.</p>';
            console.error('Error fetching news:', error);
        });
}

// Setup Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('search-bar');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        searchEvents(query);
        searchNews(query);
    });
}

// Search Events
function searchEvents(query) {
    fetch('events.json')
        .then(response => response.json())
        .then(events => {
            const filteredEvents = events.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query)
            );
            displayFilteredEvents(filteredEvents, 'all');
        })
        .catch(error => console.error('Error searching events:', error));
}

// Search News
function searchNews(query) {
    const newsContainer = document.getElementById('news-section');
    if (!newsContainer) return;
    fetchVolunteerNews(); // Reloads news

    setTimeout(() => {
        const newsItems = newsContainer.getElementsByClassName('news-item');
        Array.from(newsItems).forEach(item => {
            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            if (!title.includes(query) && !description.includes(query)) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
    }, 1500);
}

// Redirect logged-in users away from login page
if (window.location.pathname.includes('login.html') && localStorage.getItem('loggedInUser')) {
    window.location.href = 'index.html';
}

// Update Navbar Based on Login Status
function updateNavbar() {
    const user = localStorage.getItem('loggedInUser');
    const loginNavItem = document.getElementById('login-nav');
    const logoutNavItem = document.getElementById('logout-nav');

    if (user) {
        if (loginNavItem) loginNavItem.style.display = 'none';
        if (logoutNavItem) logoutNavItem.style.display = 'block';
    } else {
        if (loginNavItem) loginNavItem.style.display = 'block';
        if (logoutNavItem) logoutNavItem.style.display = 'none';
    }
}

// Ensures logout button works
window.addEventListener('DOMContentLoaded', function () {
    updateNavbar();
    const logoutButton = document.getElementById('logout-nav');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.reload();
        });
    }
});