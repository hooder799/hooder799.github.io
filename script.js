// Helper functions to interact with localStorage
function saveUserData(email, username, password) {
    const user = { email, username, password, friends: [] };
    let users = JSON.parse(localStorage.getItem("users")) || [];
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

// Function to send a friend request
function sendFriendRequest(targetUsername) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("You must be logged in to send a friend request.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const targetUser = users.find(user => user.username === targetUsername);
    
    if (targetUser) {
        if (loggedInUser.username === targetUsername) {
            alert("You cannot send a friend request to yourself.");
            return;
        }

        // Check if the user is already a friend
        if (loggedInUser.friends.includes(targetUsername)) {
            alert("You are already friends with this user.");
            return;
        }

        // Add to the friend list of both users
        loggedInUser.friends.push(targetUsername);
        targetUser.friends.push(loggedInUser.username);

        // Save the updated users to localStorage
        const updatedUsers = users.map(user => 
            user.username === loggedInUser.username ? loggedInUser : 
            user.username === targetUsername ? targetUser : user
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        alert(`Friend request sent to ${targetUsername}!`);
    } else {
        alert("User not found.");
    }
}

// Sign-up page logic
document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    saveUserData(email, username, password);
    alert("Account created successfully!");
    window.location.href = "login.html";
});

// Login page logic
window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        window.location.href = "index.html"; // Redirect to main page if already logged in
    }

    document.getElementById("login-form")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const emailOrUsername = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const user = getUserData(emailOrUsername, password);

        if (user) {
            storeLoggedInUser(user);
            window.location.href = "index.html"; // Redirect to main page
        } else {
            alert("Invalid login credentials.");
        }
    });
};

// Password recovery page logic
document.getElementById("recovery-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("recovery-email").value;
    alert(`Password recovery link sent to ${email}`);
});

// Add friend page logic
document.getElementById("add-friend-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const friendUsername = document.getElementById("friend-username").value;
    sendFriendRequest(friendUsername);
});

// Chat page logic
function startCall() {
    alert("Call started!");
}

function endCall() {
    alert("Call ended!");
}

function openChannel(channelName) {
    document.getElementById("channel-name").innerText = `${channelName} Chat`;
}

document.getElementById("send-message")?.addEventListener("click", function () {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

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

function displayMessages() {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const chatMessagesDiv = document.getElementById("chat-messages");
    chatMessagesDiv.innerHTML = "";
    messages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `${message.username}: ${message.text}`;
        chatMessagesDiv.appendChild(messageElement);
    });
}

// Logout functionality
document.getElementById("logout-button")?.addEventListener("click", function () {
    logout();
    window.location.href = "login.html";
});
