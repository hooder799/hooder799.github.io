// Handle form submissions
document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    // Here you could use Firebase or another service to handle user authentication
    console.log("User signed up with", email, username, password);
});

// Handle sending messages
document.getElementById("send-message").addEventListener("click", function() {
    let message = document.getElementById("message-input").value;
    let messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = message;
    document.getElementById("chat-area").appendChild(messageElement);
    document.getElementById("message-input").value = ""; // Clear input
});
