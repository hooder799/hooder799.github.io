// Helper functions to interact with localStorage

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

function getUserData(emailOrUsername, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => (user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password);
}

function storeLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function logout() {
    localStorage.removeItem("loggedInUser");
}

// Add Friend and Remove Friend
function addFriend(friendUsername) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;
    
    let friends = JSON.parse(localStorage.getItem(`friends_${loggedInUser.username}`)) || [];
    if (!friends.includes(friendUsername)) {
        friends.push(friendUsername);
        localStorage.setItem(`friends_${loggedInUser.username}`, JSON.stringify(friends));
        alert(`${friendUsername} added as a friend!`);
    } else {
        alert(`${friendUsername} is already your friend.`);
    }
}

function removeFriend(friendUsername) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    let friends = JSON.parse(localStorage.getItem(`friends_${loggedInUser.username}`)) || [];
    friends = friends.filter(friend => friend !== friendUsername);
    localStorage.setItem(`friends_${loggedInUser.username}`, JSON.stringify(friends));
    alert(`${friendUsername} removed from your friends.`);
}

// Sending Emojis and Images
document.getElementById("emoji-button")?.addEventListener("click", function() {
    const messageInput = document.getElementById("message-input");
    messageInput.value += "😊"; // Add emoji to the message
});

document.getElementById("image-upload")?.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            const imageUrl = reader.result;
            const loggedInUser = getLoggedInUser();
            const newMessage = {
                username: loggedInUser.username,
                text: "Image sent",
                image: imageUrl
            };
            const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
            messages.push(newMessage);
            localStorage.setItem("chatMessages", JSON.stringify(messages));
            displayMessages();
        };
        reader.readAsDataURL(file);
    }
});

// Send Message
document.getElementById("send-message")?.addEventListener("click", function() {
    const messageInput = document.getElementById("message-input");
    const loggedInUser = getLoggedInUser();
    const newMessage = {
        username: loggedInUser.username,
        text: messageInput.value.trim()
    };
    if (!newMessage.text) return;
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push(newMessage);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    messageInput.value = "";
    displayMessages();
});

function displayMessages() {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const chatMessagesDiv = document.getElementById("chat-messages");
    chatMessagesDiv.innerHTML = '';
    messages.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerText = `${message.username}: ${message.text}`;
        if (message.image) {
            const img = document.createElement("img");
            img.src = message.image;
            img.style.maxWidth = '200px';
            messageDiv.appendChild(img);
        }
        chatMessagesDiv.appendChild(messageDiv);
    });
}

window.onload = () => {
    displayMessages();
};

// User Authentication Logic
if (window.location.pathname.includes("login.html")) {
    document.getElementById("login-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const user = getUserData(email, password);
        if (user) {
            storeLoggedInUser(user);
            window.location.href = "index.html";
        } else {
            alert("Invalid login credentials!");
        }
    });
}

if (window.location.pathname.includes("signup.html")) {
    document.getElementById("signup-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        saveUserData(email, username, password);
        alert("Signup successful! You can now login.");
        window.location.href = "login.html";
    });
}

if (window.location.pathname.includes("recovery.html")) {
    document.getElementById("recovery-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document.getElementById("recovery-email").value;
        alert(`Password recovery instructions sent to ${email}`);
    });
}
