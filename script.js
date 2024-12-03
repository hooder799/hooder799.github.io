// Toggle visibility between pages
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}

// Handle signup form
document.getElementById('signup-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Save user data logic here (localStorage, etc.)

    showPage('login-page'); // After signup, show the login page
});

// Handle login form
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailOrUsername = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Check login credentials (localStorage, etc.)

    showPage('home-page'); // After login, show the home page
});

// Handle friend request
function sendFriendRequest() {
    const friendUsername = document.getElementById('friend-username').value;

    // Logic to send a friend request (localStorage, etc.)
}

// Functionality for pending requests, accepting/declining friend requests, etc.
