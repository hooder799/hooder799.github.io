// Helper functions to interact with localStorage
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function storeLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Toggle visibility of pages
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Show the home page
document.getElementById("home-btn").addEventListener("click", () => {
    showPage("home-page");
    displayMessages();
    loadFriendsAndRequests();
});

// Show login page
document.getElementById("login-btn").addEventListener("click", () => {
    showPage("login-page");
});

// Show signup page
document.getElementById("signup-btn").addEventListener("click", () => {
    showPage("signup-page");
});

// Show add friend page
document.getElementById("add-friend-btn").addEventListener("click", () => {
    showPage("add-friend-page");
});

// Login functionality
document.getElementById("submit-login").addEventListener("click", function () {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        storeLoggedInUser(user);
        alert("Login successful!");
        showPage("home-page");
        displayMessages();
        loadFriendsAndRequests();
    } else {
        alert("Invalid credentials");
    }
});

// Signup functionality
document.getElementById("submit-signup").addEventListener("click", function () {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (!username || !password) {
        alert("Please fill in all fields!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    const newUser = {
        username: username,
        password: password,
        friends: []
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please log in.");
    showPage("login-page");
});

// Add Friend functionality
document.getElementById("send-friend-request").addEventListener("click", function () {
    const username = document.getElementById("friend-username").value;
    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        alert("Please login first!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const friend = users.find(user => user.username === username);
    if (friend && friend.username !== loggedInUser.username) {
        const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
        requests.push({ from: loggedInUser.username, to: friend.username, status: "pending" });
        localStorage.setItem("friendRequests", JSON.stringify(requests));

        alert("Friend request sent!");
    } else {
        alert("User not found or you cannot send a request to yourself.");
    }
});

// Send message functionality
document.getElementById("send-message").addEventListener("click", function () {
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

// Load friends and pending requests for the home page
function loadFriendsAndRequests() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    // Display friends
    const friendsList = document.querySelector(".friends-list");
    friendsList.innerHTML = '';
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
                <button onclick="declineRequest('${request.from}')">Decline</button>
            `;
            pendingRequests.appendChild(requestItem);
        }
    });
}

// Accept friend request
function acceptRequest(fromUser) {
    const loggedInUser = getLoggedInUser();
    const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    const requestIndex = requests.findIndex(req => req.from === fromUser && req.to === loggedInUser.username);
    
    if (requestIndex !== -1) {
        // Add the user to the friend's list
        loggedInUser.friends.push(fromUser);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        // Mark the request as accepted
        requests[requestIndex].status = "accepted";
        localStorage.setItem("friendRequests", JSON.stringify(requests));

        loadFriendsAndRequests();
    }
}

// Decline friend request
function declineRequest(fromUser) {
    let requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    requests = requests.filter(req => !(req.from === fromUser && req.status === "pending"));
    localStorage.setItem("friendRequests", JSON.stringify(requests));

    loadFriendsAndRequests();
}

showPage("home-page"); // Default page on load
