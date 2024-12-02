// Sign-up: Store user details in localStorage
document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const newUser = { email, username, password };
    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Account created successfully!");
    window.location.href = "login.html"; // Redirect to login page
});

// Login: Check credentials from localStorage
document.getElementById("login-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailOrUsername = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && (storedUser.email === emailOrUsername || storedUser.username === emailOrUsername) && storedUser.password === password) {
        localStorage.setItem("loggedIn", JSON.stringify(storedUser));
        window.location.href = "index.html"; // Redirect to main page
    } else {
        alert("Invalid credentials, please try again.");
    }
});

// Load messages from localStorage
function loadMessages() {
    return JSON.parse(localStorage.getItem("chatMessages")) || [];
}

// Save messages to localStorage
function saveMessages(messages) {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Display messages in chat
function displayMessages() {
    const messages = loadMessages();
    const chatMessagesDiv = document.getElementById("chat-messages");
    chatMessagesDiv.innerHTML = "";

    messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = `${message.username}: ${message.text}`;
        chatMessagesDiv.appendChild(messageElement);
    });
}

// Send message
document.getElementById("send-message")?.addEventListener("click", function() {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();

    if (messageText === "") return;

    const loggedInUser = JSON.parse(localStorage.getItem("loggedIn"));
    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    const newMessage = { username: loggedInUser.username, text: messageText };
    const messages = loadMessages();
    messages.push(newMessage);
    saveMessages(messages);

    messageInput.value = "";
    displayMessages();
});

// Load messages on page load
window.onload = function() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedIn"));
    if (!loggedInUser) {
        window.location.href = "login.html"; // Redirect to login page if not logged in
    } else {
        displayMessages(); // Show saved messages
    }
};
