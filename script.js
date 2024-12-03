// Helper functions to interact with localStorage

function saveUserData(email, username, password) {
    const user = { email, username, password };
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

document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    saveUserData(email, username, password);
    alert("Account created successfully!");
    window.location.href = "login.html"; 
});

window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (document.getElementById("chat-messages")) {
        if (!loggedInUser) {
            window.location.href = "login.html";
        } else {
            displayMessages();
        }
    }

    document.getElementById("login-form")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const emailOrUsername = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const loggedInUser = getUserData(emailOrUsername, password);

        if (loggedInUser) {
            storeLoggedInUser(loggedInUser);
            window.location.href = "index.html";
        } else {
            alert("Invalid credentials.");
        }
    });

    // Logout functionality
    document.getElementById("logout-button")?.addEventListener("click", function () {
        logout();
        window.location.href = "login.html";
    });
};

document.getElementById("send-message")?.addEventListener("click", function () {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();

    if (messageText === "") return;

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const newMessage = { username: loggedInUser.username, text: messageText };
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

    messages.forEach((message, index) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = `${message.username}: ${message.text}`;

        if (message.username === getLoggedInUser()?.username) {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                deleteMessage(index);
            };
            messageElement.appendChild(deleteButton);
        }

        chatMessagesDiv.appendChild(messageElement);
    });
}

function deleteMessage(messageIndex) {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.splice(messageIndex, 1);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    displayMessages();
}

// Add Friend Page Logic
document.getElementById("add-friend-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const friendInput = document.getElementById("friend-email-or-username").value;
    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        alert("You must be logged in to add friends.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const friend = users.find(user => user.email === friendInput || user.username === friendInput);

    if (!friend) {
        alert("User not found!");
        return;
    }

    let friendsList = JSON.parse(localStorage.getItem(loggedInUser.username + "_friends")) || [];
    
    if (friendsList.some(f => f.username === friend.username)) {
        alert("You are already friends with this person.");
        return;
    }

    friendsList.push({ username: friend.username, email: friend.email });
    localStorage.setItem(loggedInUser.username + "_friends", JSON.stringify(friendsList));

    alert("Friend added successfully!");
    window.location.href = "index.html";
});

function displayFriends() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const friendsList = JSON.parse(localStorage.getItem(loggedInUser.username + "_friends")) || [];
    const friendsListElement = document.getElementById("friends-list");
    friendsListElement.innerHTML = "";

    friendsList.forEach(friend => {
        const li = document.createElement("li");
        li.textContent = friend.username;

        const unfriendButton = document.createElement("button");
        unfriendButton.textContent = "Unfriend";
        unfriendButton.onclick = function () {
            removeFriend(friend.username);
        };

        li.appendChild(unfriendButton);
        friendsListElement.appendChild(li);
    });
}

function removeFriend(friendUsername) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    let friendsList = JSON.parse(localStorage.getItem(loggedInUser.username + "_friends")) || [];
    friendsList = friendsList.filter(friend => friend.username !== friendUsername);
    localStorage.setItem(loggedInUser.username + "_friends", JSON.stringify(friendsList));

    alert("Friend removed.");
    displayFriends();
}
