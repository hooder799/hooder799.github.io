// Check if the user is logged in (by checking for a session token in localStorage)
function checkLoginStatus() {
    const user = localStorage.getItem("user");  // You can store user data here, like email or username
    if (!user) {
        // If no user is found, redirect to login page
        window.location.href = "login.html";
    }
}

// Redirect to main page if already logged in
function redirectToMainPage() {
    const user = localStorage.getItem("user");
    if (user) {
        window.location.href = "index.html";  // Redirect to the main chat page if logged in
    }
}

// Handle login form submission
document.getElementById("login-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // In a real app, you'd authenticate with a server; here we mock login
    if (email && password) {
        // Simulate a successful login and store user data in localStorage
        localStorage.setItem("user", email);  // Store email or username as user session token
        window.location.href = "index.html";  // Redirect to main chat page
    } else {
        alert("Please enter valid login credentials.");
    }
});

// Handle sign up form submission
document.getElementById("signup-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // In a real app, you'd send the data to a server to register the user
    if (email && username && password) {
        localStorage.setItem("user", email);  // Simulate successful sign up
        window.location.href = "index.html";  // Redirect to main chat page
    } else {
        alert("Please fill out all fields.");
    }
});

// Call checkLoginStatus on the main chat page to ensure user is logged in
if (window.location.pathname === "/index.html") {
    checkLoginStatus();
}

// On login or sign-up pages, redirect to main page if already logged in
if (window.location.pathname === "/login.html" || window.location.pathname === "/signup.html") {
    redirectToMainPage();
}
