// Helper functions to interact with localStorage
function saveUserData(email, username, password) {
    const user = { email, username, password, friends: [], sentRequests: [], receivedRequests: [] };
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

// Handle login logic
window.onload = function () {
    const loggedInUser = getLoggedInUser();
    const currentPage = window.location.pathname;

    // If user is already logged in and on login page, redirect them to index.html
    if (loggedInUser && currentPage.includes("login.html")) {
        window.location.href = 'index.html';
        return;
    }

    // If user is not logged in and not on login page, redirect them to login.html
    if (!loggedInUser && !currentPage.includes("login.html")) {
        window.location.href = 'login.html';
        return;
    }

    // If the user is logged in, handle display of friends, requests, and messages
    if (loggedInUser) {
        displayFriendsAndRequests(loggedInUser);
        displayMessages(loggedInUser);

        // Send message logic
        document.getElementById("send-message").addEventListener("click", function () {
            const messageText = document.getElementById("message-input").value.trim();
            if (messageText) {
                const loggedInUser = getLoggedInUser();
                if (loggedInUser) {
                    const newMessage = {
                        username: loggedInUser.username,
                        text: messageText
                    };
                    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
                    messages.push(newMessage);
                    localStorage.setItem("chatMessages", JSON.stringify(messages));
                    document.getElementById("message-input").value = "";
                    displayMessages(loggedInUser);
                }
            }
        });
    }

    // Display messages in chat
    function displayMessages(user) {
        const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        const chatMessagesDiv = document.getElementById("chat-messages");
        chatMessagesDiv.innerHTML = "";
        messages.forEach((message, index) => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.innerHTML = `
                <span>${message.username}: ${message.text}</span>
                ${message.username === user.username ? `<button onclick="deleteMessage(${index})">Delete</button>` : ""}
            `;
            chatMessagesDiv.appendChild(messageElement);
        });
    }

    // Delete a message
    window.deleteMessage = function (index) {
        const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        messages.splice(index, 1);
        localStorage.setItem("chatMessages", JSON.stringify(messages));
        displayMessages(loggedInUser);
    };

    // Display friends and requests
    function displayFriendsAndRequests(user) {
        const friendsList = document.getElementById("friends-list");
        const receivedRequests = document.getElementById("received-requests");
        const sentRequests = document.getElementById("sent-requests");

        friendsList.innerHTML = "";
        receivedRequests.innerHTML = "";
        sentRequests.innerHTML = "";

        // Display friends
        user.friends.forEach(friend => {
            const li = document.createElement("li");
            li.textContent = friend;
            friendsList.appendChild(li);
        });

        // Display received friend requests
        user.receivedRequests.forEach((request, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${request} <button onclick="acceptFriendRequest(${index})">Accept</button> 
                <button onclick="declineFriendRequest(${index})">Decline</button>
            `;
            receivedRequests.appendChild(li);
        });

        // Display sent friend requests
        user.sentRequests.forEach((request, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${request} <button onclick="cancelFriendRequest(${index})">Cancel</button>
            `;
            sentRequests.appendChild(li);
        });
    }

    // Accept friend request
    window.acceptFriendRequest = function (index) {
        const loggedInUser = getLoggedInUser();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const senderUsername = loggedInUser.receivedRequests[index];
        const senderUser = users.find(user => user.username === senderUsername);

        // Add friend
        if (senderUser) {
            loggedInUser.friends.push(senderUser.username);
            senderUser.friends.push(loggedInUser.username);
            loggedInUser.receivedRequests.splice(index, 1);
            senderUser.sentRequests = senderUser.sentRequests.filter(request => request !== loggedInUser.username);
            localStorage.setItem("users", JSON.stringify(users));
            storeLoggedInUser(loggedInUser);
            displayFriendsAndRequests(loggedInUser);
        }
    };

    // Decline friend request
    window.declineFriendRequest = function (index) {
        const loggedInUser = getLoggedInUser();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const senderUsername = loggedInUser.receivedRequests[index];
        const senderUser = users.find(user => user.username === senderUsername);

        // Remove request
        if (senderUser) {
            loggedInUser.receivedRequests.splice(index, 1);
            senderUser.sentRequests = senderUser.sentRequests.filter(request => request !== loggedInUser.username);
            localStorage.setItem("users", JSON.stringify(users));
            storeLoggedInUser(loggedInUser);
            displayFriendsAndRequests(loggedInUser);
        }
    };

    // Cancel sent friend request
    window.cancelFriendRequest = function (index) {
        const loggedInUser = getLoggedInUser();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const recipientUsername = loggedInUser.sentRequests[index];
        const recipientUser = users.find(user => user.username === recipientUsername);

        // Remove sent request
        if (recipientUser) {
            loggedInUser.sentRequests.splice(index, 1);
            recipientUser.receivedRequests = recipientUser.receivedRequests.filter(request => request !== loggedInUser.username);
            localStorage.setItem("users", JSON.stringify(users));
            storeLoggedInUser(loggedInUser);
            displayFriendsAndRequests(loggedInUser);
        }
    };
};
