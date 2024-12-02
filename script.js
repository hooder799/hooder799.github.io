// Check if the user is logged in
function checkLoginStatus() {
    const user = localStorage.getItem("user");
    if (!user) {
        // Redirect to login page if not logged in
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

// Handle login
document.getElementById("login-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Simulate login (in a real app, this would be checked against a database)
    if (email && password) {
        localStorage.setItem("user", email);  // Store the user email as the session
        window.location.href = "index.html";  // Redirect to the main page
    } else {
        alert("Please enter valid login credentials.");
    }
});

// Handle sign up
document.getElementById("signup-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simulate sign up (in a real app, this data would be sent to a server)
    if (email && username && password) {
        localStorage.setItem("user", email);  // Simulate saving user data
        window.location.href = "index.html";  // Redirect to the main page
    } else {
        alert("Please fill out all fields.");
    }
});

// Handle sending messages
document.getElementById("send-message")?.addEventListener("click", function() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = message;
        document.getElementById("chat-messages").appendChild(messageElement);
        messageInput.value = ""; // Clear the message input
        messageElement.scrollIntoView(); // Scroll to the newest message
    }
});

// Handle emoji selection
document.getElementById("emoji-picker")?.addEventListener("click", function(event) {
    if (event.target.tagName === "IMG") {
        const emoji = event.target.alt;  // Get the emoji that was clicked
        const messageInput = document.getElementById("message-input");
        messageInput.value += emoji;  // Append emoji to message input
        messageInput.focus();  // Keep focus on message input
    }
});

// Ensure the user is logged in on the main page
if (window.location.pathname === "/index.html") {
    checkLoginStatus();
}

// Redirect to main page if already logged in
if (window.location.pathname === "/login.html" || window.location.pathname === "/signup.html") {
    redirectToMainPage();
}
