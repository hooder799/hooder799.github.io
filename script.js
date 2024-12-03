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
    window.location.href = "login.html";
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
            displayFriends();
            displayPendingRequests();
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

    document.getElementById("logout-button")?.addEventListener("click", function () {
        logout();
    });

    document.getElementById("add-friend-button")?.addEventListener("click", function () {
        window.location.href = "add-friend.html";
    });
};

// Send Message
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

// Display Messages
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

// Delete Message
function deleteMessage(messageIndex) {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.splice(messageIndex, 1);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    displayMessages();
}

// Display Friends
function displayFriends() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const friendsList = JSON.parse(localStorage.getItem(loggedInUser.username + "_friends")) || [];
    const friendsListElement = document.getElementById("friends-list");
    friendsListElement.innerHTML = "";

    friendsList.forEach(friend => {
        const li = document.createElement("li");
        li.textContent = friend.username;
        li.onclick = function () {
            chatWithFriend(friend.username);
        };
        friendsListElement.appendChild(li);
    });
}

// Chat with Friend
function chatWithFriend(friendUsername) {
    // Here you can implement a function that filters messages for the selected friend
    alert("Start chatting with " + friendUsername);
}

// Send Friend Request
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

    let sentRequests = JSON.parse(localStorage.getItem(loggedInUser.username + "_sentRequests")) || [];
    let receivedRequests = JSON.parse(localStorage.getItem(friend.username + "_receivedRequests")) || [];

    if (sentRequests.some(request => request.username === friend.username)) {
        alert("You have already sent a friend request.");
        return;
    }

    if (receivedRequests.some(request => request.username === loggedInUser.username)) {
        alert("You already have a pending friend request.");
        return;
    }

    sentRequests.push({ username: friend.username });
    localStorage.setItem(loggedInUser.username + "_sentRequests", JSON.stringify(sentRequests));

    receivedRequests.push({ username: loggedInUser.username });
    localStorage.setItem(friend.username + "_receivedRequests", JSON.stringify(receivedRequests));

    alert("Friend request sent!");
    window.location.href = "index.html";
});

// Display Pending Friend Requests
function displayPendingRequests() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const sentRequests = JSON.parse(localStorage.getItem(loggedInUser.username + "_sentRequests")) || [];
    const receivedRequests = JSON.parse(localStorage.getItem(loggedInUser.username + "_receivedRequests")) || [];

    const sentRequestsList = document.getElementById("sent-requests");
    const receivedRequestsList = document.getElementById("received-requests");

    sentRequestsList.innerHTML = "";
    receivedRequestsList.innerHTML = "";

    sentRequests.forEach(request => {
        const li = document.createElement("li");
        li.textContent = request.username;
        sentRequestsList.appendChild(li);
    });

    receivedRequests.forEach(request => {
        const li = document.createElement("li");
        li.textContent = request.username;
        receivedRequestsList.appendChild(li);
    });
}
