// script.js

// Handle Login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const emailOrUsername = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Validate input
    if (!emailOrUsername || !password) {
        alert("Please fill in both fields.");
        return;
    }

    // Example of sending data to your backend API
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            // Redirect to the dashboard or home page
            window.location.href = '/dashboard'; // Change this URL to where you want to redirect
        } else {
            alert('Invalid credentials');
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred, please try again later.');
    });
});

// Handle Signup
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate input
    if (!email || !username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Example of sending data to your backend API for signup
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Account created successfully!');
            // Redirect to the login page
            window.location.href = 'login.html'; // Adjust the redirection URL as necessary
        } else {
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during signup:', error);
        alert('An error occurred, please try again later.');
    });
});

// Handle Password Recovery
document.getElementById('recovery-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('recovery-email').value;

    // Validate input
    if (!email) {
        alert("Please enter your email.");
        return;
    }

    // Example of sending data to your backend API for password recovery
    fetch('/password-recovery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('A password recovery email has been sent to ' + email);
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during password recovery:', error);
        alert('An error occurred, please try again later.');
    });
});
