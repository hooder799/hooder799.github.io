// Simulate user sending messages
document.getElementById("send-message").addEventListener("click", function() {
    let messageInput = document.getElementById("message-input");
    let message = messageInput.value.trim();
    
    if (message) {
        let messageElement = document.createElement("div");
        messageElement.classList.add("message", "user");
        messageElement.textContent = message;
        document.getElementById("chat-messages").appendChild(messageElement);
        messageInput.value = ""; // Clear input field
        messageElement.scrollIntoView(); // Scroll to the latest message
    }
});

// Add emoji picker functionality
document.getElementById("emoji-picker").addEventListener("click", function() {
    let emoji = "😊";  // You can add logic to select different emojis
    let messageInput = document.getElementById("message-input");
    messageInput.value += emoji;  // Append emoji to message
    messageInput.focus();  // Keep focus on message input
});
