// Helper function to check if the user is logged in
function checkLoginStatus() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "login.html";
    }
}

// Redirect to the main page if the user is already logged in
function redirectToMainPage() {
    const user = localStorage.getItem("user");
    if (user) {
        window.location.href = "index.html";
    }
}

// Handle login form submission
document.getElementById("login-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email === email && user.password === password) {
        localStorage.setItem("loggedIn", JSON.stringify(user));
        window.location.href = "index.html";
    } else {
        alert("Incorrect credentials. Please try again.");
    }
});

// Handle sign-up form submission
document.getElementById("signup-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if email already exists
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.email === email) {
        alert("User already exists. Please login.");
    } else {
        // Create new user and store in localStorage
        const newUser = {
            email: email,
            username: username,
            password: password
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        alert("Account created successfully! Redirecting to login...");
        window.location.href = "login.html";
    }
});

// Handle password recovery (reset password)
document.getElementById("recovery-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("recovery-email").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email) {
        alert("A password reset link has been sent to your email (simulated).");
        window.location.href = "login.html";
    } else {
        alert("No account found with that email.");
    }
});

// Check if the user is already logged in and redirect to main page
if (window.location.pathname === "/login.html" || window.location.pathname === "/signup.html") {
    redirectToMainPage();
}

// Ensure the user is logged in on the main page
if (window.location.pathname === "/index.html") {
    checkLoginStatus();
}
