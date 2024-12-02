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
