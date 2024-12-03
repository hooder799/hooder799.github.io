// Helper functions to interact with localStorage
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function storeLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Add Friend functionality
document.getElementById("add-friend-btn")?.addEventListener("click", function () {
    const username = prompt("Enter the username of the friend to add:");
    if (!username) return;

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("Please login first!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const friend = users.find(user => user.username === username);
    if (friend) {
        // Send friend request
        const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
        requests.push({ from: loggedInUser.username, to: friend.username, status: "pending" });
        localStorage.setItem("friendRequests", JSON.stringify(requests));
        alert("Friend request sent!");
    } else {
        alert("User not found!");
    }
});

// Handle message sending
document.getElementById("send-message")?.addEventListener("click", function () {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("Please login first!");
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
    displayMessages(); // Update chat display after sending message
});

// Display messages in the chat container
function displayMessages() {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const chatMessagesDiv = document.getElementById("chat-messages");
    chatMessagesDiv.innerHTML = "";

    messages.forEach((message, index) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `
            <span><strong>${message.username}:</strong> ${message.text}</span>
            <button class="delete-message" onclick="deleteMessage(${index})">Delete</button>
        `;
        chatMessagesDiv.appendChild(messageElement);
    });
}

// Delete message functionality
function deleteMessage(messageIndex) {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.splice(messageIndex, 1);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    displayMessages(); // Update the chat display after deletion
}

// Display friends and pending requests
window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("Please login first!");
        return;
    }

    // Display friends
    const friendsList = document.querySelector(".friends-list");
    friendsList.innerHTML = '';
    loggedInUser.friends = loggedInUser.friends || [];
    loggedInUser.friends.forEach(friend => {
        const friendItem = document.createElement("div");
        friendItem.classList.add("friend-item");
        friendItem.innerHTML = `${friend} <button onclick="startChat('${friend}')">Chat</button>`;
        friendsList.appendChild(friendItem);
    });

    // Display pending requests
    const pendingRequests = document.querySelector(".pending-requests");
    const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    requests.forEach(request => {
        if (request.to === loggedInUser.username && request.status === "pending") {
            const requestItem = document.createElement("div");
            requestItem.classList.add("pending-request-item");
            requestItem.innerHTML = `
                ${request.from} 
                <button onclick="acceptRequest('${request.from}')">Accept</button>
                <button class="decline" onclick="declineRequest('${request.from}')">Decline</button>
            `;
            pendingRequests.appendChild(requestItem);
        }
    });
};

// Accept friend request
function acceptRequest(username) {
    const loggedInUser = getLoggedInUser();
    const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    const request = requests.find(req => req.from === username && req.to === loggedInUser.username);
    if (request) {
        request.status = "accepted";
        loggedInUser.friends.push(username);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        localStorage.setItem("friendRequests", JSON.stringify(requests));

        // Dynamically update the UI without refreshing the page
        updateFriendsList(loggedInUser);
        updatePendingRequests(loggedInUser);
    }
}

// Decline friend request
function declineRequest(username) {
    const loggedInUser = getLoggedInUser();
    const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    const index = requests.findIndex(req => req.from === username && req.to === loggedInUser.username);
    if (index !== -1) {
        requests.splice(index, 1);
        localStorage.setItem("friendRequests", JSON.stringify(requests));

        // Dynamically update the UI without refreshing the page
        updatePendingRequests(loggedInUser);
    }
}

// Update friends list dynamically
function updateFriendsList(loggedInUser) {
    const friendsList = document.querySelector(".friends-list");
    friendsList.innerHTML = '';
    loggedInUser.friends.forEach(friend => {
        const friendItem = document.createElement("div");
        friendItem.classList.add("friend-item");
        friendItem.innerHTML = `${friend} <button onclick="startChat('${friend}')">Chat</button>`;
        friendsList.appendChild(friendItem);
    });
}

// Update pending requests dynamically
function updatePendingRequests(loggedInUser) {
    const pendingRequests = document.querySelector(".pending-requests");
    pendingRequests.innerHTML = '';
    const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    requests.forEach(request => {
        if (request.to === loggedInUser.username && request.status === "pending") {
            const requestItem = document.createElement("div");
            requestItem.classList.add("pending-request-item");
            requestItem.innerHTML = `
                ${request.from} 
                <button onclick="acceptRequest('${request.from}')">Accept</button>
                <button class="decline" onclick="declineRequest('${request.from}')">Decline</button>
            `;
            pendingRequests.appendChild(requestItem);
        }
    });
}

// Start chat with a friend
function startChat(friendUsername) {
    alert(`Starting chat with ${friendUsername}`);
}
