document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic form validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Send login request to backend API
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = '/dashboard'; // Redirect to the user dashboard
    } else {
        alert(result.message); // Show error message if login fails
    }
});
