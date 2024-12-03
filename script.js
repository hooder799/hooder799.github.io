window.onload = function () {
    const loggedInUser = getLoggedInUser();
    const currentPage = window.location.pathname;

    // If user is already logged in, show the chat interface
    if (loggedInUser && currentPage.includes("index.html")) {
        window.location.href = 'chat.html';
        return;
    }

    // Show buttons only on the index page
    if (currentPage.includes("index.html")) {
        // Show Login and Sign Up buttons
        document.getElementById("login-button").addEventListener("click", function() {
            window.location.href = 'login.html';
        });
        
        document.getElementById("sign-up-button").addEventListener("click", function() {
            window.location.href = 'signup.html';
        });
    }

    // Handle login logic
    if (loggedInUser) {
        // Handle displaying the friends and messages interface
        displayFriendsAndRequests(loggedInUser);
        displayMessages(loggedInUser);
    }
};

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
    window.location.href = "index.html";
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
    displayMessages(getLoggedInUser());
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

// Add friend logic
document.getElementById("add-friend-button")?.addEventListener("click", function () {
    const usernameToAdd = prompt("Enter the username of the person you want to add:");
    if (usernameToAdd) {
        const loggedInUser = getLoggedInUser();
        const users = JSON.parse(localStorage.getItem("users"));
        const userToAdd = users.find(user => user.username === usernameToAdd);
        if (userToAdd && userToAdd.username !== loggedInUser.username) {
            if (!loggedInUser.sentRequests.includes(usernameToAdd) && !loggedInUser.friends.includes(usernameToAdd)) {
                loggedInUser.sentRequests.push(usernameToAdd);
                storeLoggedInUser(loggedInUser);
                localStorage.setItem("users", JSON.stringify(users));
                alert("Friend request sent!");
                displayFriendsAndRequests(loggedInUser);
            } else {
                alert("You already sent a request or are already friends.");
            }
        } else {
            alert("User not found.");
        }
    }
});

// Accept friend request
window.acceptFriendRequest = function (index) {
    const loggedInUser = getLoggedInUser();
    const users = JSON.parse(localStorage.getItem("users"));
    const friendUsername = loggedInUser.receivedRequests[index];
    loggedInUser.friends.push(friendUsername);
    const friendUser = users.find(user => user.username === friendUsername);
    friendUser.friends.push(loggedInUser.username);

    loggedInUser.receivedRequests.splice(index, 1);
    friendUser.sentRequests = friendUser.sentRequests.filter(request => request !== loggedInUser.username);
    storeLoggedInUser(loggedInUser);
    localStorage.setItem("users", JSON.stringify(users));

    displayFriendsAndRequests(loggedInUser);
    displayFriendsAndRequests(friendUser);
};

// Decline friend request
window.declineFriendRequest = function (index) {
    const loggedInUser = getLoggedInUser();
    const users = JSON.parse(localStorage.getItem("users"));
    const friendUsername = loggedInUser.receivedRequests[index];
    loggedInUser.receivedRequests.splice(index, 1);
    const friendUser = users.find(user => user.username === friendUsername);
    friendUser.sentRequests = friendUser.sentRequests.filter(request => request !== loggedInUser.username);
    storeLoggedInUser(loggedInUser);
    localStorage.setItem("users", JSON.stringify(users));

    displayFriendsAndRequests(loggedInUser);
    displayFriendsAndRequests(friendUser);
};

// Cancel sent friend request
window.cancelFriendRequest = function (index) {
    const loggedInUser = getLoggedInUser();
    const users = JSON.parse(localStorage.getItem("users"));
    const friendUsername = loggedInUser.sentRequests[index];
    loggedInUser.sentRequests.splice(index, 1);
    const friendUser = users.find(user => user.username === friendUsername);
    friendUser.receivedRequests = friendUser.receivedRequests.filter(request => request !== loggedInUser.username);
    storeLoggedInUser(loggedInUser);
    localStorage.setItem("users", JSON.stringify(users));

    displayFriendsAndRequests(loggedInUser);
    displayFriendsAndRequests(friendUser);
};

// Logout
document.getElementById("logout-button")?.addEventListener("click", function () {
    logout();
});

// Create server feature
document.getElementById('create-server-button')?.addEventListener('click', function() {
    const serverName = prompt("Enter the name of the new server:");
    if (serverName) {
        const loggedInUser = getLoggedInUser();
        const servers = JSON.parse(localStorage.getItem('servers')) || [];
        const newServer = { name: serverName, members: [loggedInUser.username] };
        servers.push(newServer);
        localStorage.setItem('servers', JSON.stringify(servers));
        alert("Server created!");
    }
});
