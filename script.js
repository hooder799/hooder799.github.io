// script.js

// Show Add Friend button after successful login/signup
function showAddFriendButton() {
    const addFriendButton = document.getElementById('add-friend-button');
    addFriendButton.classList.remove('hidden');
}

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageContainer = document.getElementById('signup-message');

    // Input validation
    if (!username || !email || !password) {
        messageContainer.innerHTML = '<p class="error-message">Please fill in all fields.</p>';
        return;
    }

    // Example of sending data to your backend to sign up
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageContainer.innerHTML = '<p class="success-message">signup successful!</p>';
            showAddFriendButton(); // Show the add friend button
        } else {
            messageContainer.innerHTML = `<p class="error-message">${data.message || 'Error: Could not sign up.'}</p>`;
        }
    })
    .catch(error => {
        messageContainer.innerHTML = '<p class="error-message">An error occurred during signup. Please try again.</p>';
    });
});

// Handle Login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageContainer = document.getElementById('login-message');

    // Input validation
    if (!email || !password) {
        messageContainer.innerHTML = '<p class="error-message">Please enter both email and password.</p>';
        return;
    }

    // Example of sending data to your backend to log in
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageContainer.innerHTML = '<p class="success-message">Login successful!</p>';
            showAddFriendButton(); // Show the add friend button
        } else {
            messageContainer.innerHTML = `<p class="error-message">${data.message || 'Error: Could not log in.'}</p>`;
        }
    })
    .catch(error => {
        messageContainer.innerHTML = '<p class="error-message">An error occurred during login. Please try again.</p>';
    });
});

// Handle Add Friend button click
document.getElementById('add-friend-button').addEventListener('click', function() {
    window.location.href = 'add-friends.html'; // Redirect to the add friends page
});
