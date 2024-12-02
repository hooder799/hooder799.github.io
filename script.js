// Check if the user is logged in
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    if (!user) {
        window.location.href = "login.html";
    }
}

// Redirect to the main page if already logged in
function redirectToMainPage() {
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    if (user) {
        window.location.href = "index.html";
    }
}

// Handle login form submission
document.getElementById("login-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Simulate login by checking localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && (user.email === email || user.username === email) && user.password === password) {
        localStorage.setItem("loggedIn", JSON.stringify(user));
        window.location.href = "index.html";  // Redirect to the main page
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

    // Check if the email already exists
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
        window.location.href = "login.html";  // Redirect to login page
    }
});

// Handle password recovery (reset password)
document.getElementById("recovery-form")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("recovery-email").value;
    const user = JSON.parse(localStorage.getItem("user"));

    // Simulate password recovery
    if (user && user.email === email) {
        alert("A password reset link has been sent to your email (simulated).");
        window.location.href = "login.html";  // Redirect to login page
    } else {
        alert("No account found with that email.");
    }
});

// Ensure the user is logged in on the main page
if (window.location.pathname === "/index.html") {
    checkLoginStatus();
}

// Redirect to the main page if already logged in
if (window.location.pathname === "/login.html" || window.location.pathname === "/signup.html") {
    redirectToMainPage();
}
// Check if the user is logged in, and retrieve their username
function checkLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedIn"));
    if (!loggedInUser) {
        window.location.href = "login.html"; // Redirect to login page if not logged in
    }
    return loggedInUser;
}

// Save messages in localStorage
function saveMessages(messages) {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Load messages from localStorage
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    return messages;
}

// Display messages in the chat window
function displayMessages() {
    const messages = loadMessages();
    const chatMessagesDiv = document.getElementById("chat-messages");
    chatMessagesDiv.innerHTML = ""; // Clear current messages

    messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = `${message.username}: ${message.text}`;
        chatMessagesDiv.appendChild(messageElement);
    });
}

// Handle message send action
document.getElementById("send-message")?.addEventListener("click", function() {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();

    if (messageText === "") {
        return; // Don't send empty messages
    }

    const loggedInUser = checkLoginStatus(); // Get logged-in user data
    const username = loggedInUser.username; // Username of the logged-in user

    // Create a new message object
    const newMessage = {
        username: username,
        text: messageText
    };

    // Load existing messages from localStorage
    const messages = loadMessages();

    // Add the new message to the list
    messages.push(newMessage);

    // Save updated messages back to localStorage
    saveMessages(messages);

    // Clear the input field
    messageInput.value = "";

    // Display updated messages in the chat
    displayMessages();
});

// Load messages when the page loads
window.onload = function() {
    checkLoginStatus(); // Ensure the user is logged in
    displayMessages(); // Display messages from localStorage
};
