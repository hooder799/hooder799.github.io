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

    saveUserData(email, username, password);

    alert("Account created successfully!");
    window.location.href = "login.html"; // Redirect to login page
});

document.getElementById("login-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailOrUsername = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const loggedInUser = getUserData(emailOrUsername, password);

    if (loggedInUser) {
        storeLoggedInUser(loggedInUser);
        window.location.href = "index.html"; // Redirect to main page
    } else {
        alert("Invalid credentials, please try again.");
    }
});

// Display messages in the chat
function displayMessages() {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const chatMessagesDiv = document.getElementById("chat-messages");
    chatMessagesDiv.innerHTML = "";

    messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = `${message.username}: ${message.text}`;
        chatMessagesDiv.appendChild(messageElement);
    });
}

// Handle message sending
document.getElementById("send-message")?.addEventListener("click", function () {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();

    if (messageText === "") return;

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        window.location.href = "login.html";
        return;
    }

    const newMessage = {
        username: loggedInUser.username,
        text: messageText
    };

    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push(newMessage);
    localStorage.setItem("chatMessages", JSON.stringify(messages));

    messageInput.value = "";
    displayMessages();
});

// Load messages when page is loaded
window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        window.location.href = "login.html"; // Redirect to login if not logged in
    } else {
        displayMessages(); // Display existing messages
    }
};
