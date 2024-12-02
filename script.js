// Helper functions to interact with localStorage

// Save user data (signup)
function saveUserData(email, username, password) {
    const user = { email, username, password };
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if user already exists
    if (users.some(existingUser => existingUser.email === email || existingUser.username === username)) {
        alert("User already exists!");
        return;
    }
    
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

// Retrieve user data for login
function getUserData(emailOrUsername, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => (user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password);
}

// Store logged-in user
function storeLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Get logged-in user data
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Logout: Remove the logged-in user
function logout() {
    localStorage.removeItem("loggedInUser");
}

document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Save user data
    saveUserData(email, username, password);

    alert("Account created successfully!");
    window.location.href = "login.html"; // Redirect to login page after successful sign up
});

// Check if the user is already logged in. If yes, redirect them to the main chat page
window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        window.location.href = "index.html"; // If user is logged in, go to main page
    }

    document.getElementById("login-form")?.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailOrUsername = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const loggedInUser = getUserData(emailOrUsername, password);

        if (loggedInUser) {
            storeLoggedInUser(loggedInUser);
            window.location.href = "index.html"; // Redirect to main page after login
        } else {
            alert("Invalid credentials, please try again.");
        }
    });
};
