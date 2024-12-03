// Helper functions to interact with localStorage

// Get all users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Get the currently logged-in user
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Save the updated list of users to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Save the logged-in user to localStorage
function storeLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Send a friend request to another user
function sendFriendRequest(receiverUsername) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("You need to be logged in to send a friend request.");
        return;
    }

    const users = getUsers();
    const receiver = users.find(user => user.username === receiverUsername);
    if (!receiver) {
        alert("User not found.");
        return;
    }

    if (receiverUsername === loggedInUser.username) {
        alert("You cannot send a friend request to yourself.");
        return;
    }

    if (receiver.friendRequests.some(request => request === loggedInUser.username)) {
        alert("Friend request already sent.");
        return;
    }

    receiver.friendRequests.push(loggedInUser.username);
    saveUsers(users);
    alert("Friend request sent!");
}

// Accept a friend request
function acceptFriendRequest(requesterUsername) {
    const loggedInUser = getLoggedInUser();
    const users = getUsers();
    
    const loggedInUserIndex = users.findIndex(user => user.username === loggedInUser.username);
    const requester = users.find(user => user.username === requesterUsername);

    if (!requester) {
        alert("User not found.");
        return;
    }

    // Remove the requester from the friend requests of the logged-in user
    const requestIndex = loggedInUser.friendRequests.indexOf(requesterUsername);
    if (requestIndex > -1) {
        loggedInUser.friendRequests.splice(requestIndex, 1);
    }

    // Add the logged-in user to the requester's friend list
    if (!requester.friends.includes(loggedInUser.username)) {
        requester.friends.push(loggedInUser.username);
    }

    // Add the requester to the logged-in user's friend list
    if (!loggedInUser.friends.includes(requesterUsername)) {
        loggedInUser.friends.push(requesterUsername);
    }

    saveUsers(users);
    alert("Friend request accepted!");
    displayFriendsAndRequests();
}

// Decline a friend request
function declineFriendRequest(requesterUsername) {
    const loggedInUser = getLoggedInUser();
    const users = getUsers();

    const loggedInUserIndex = users.findIndex(user => user.username === loggedInUser.username);
    const requester = users.find(user => user.username === requesterUsername);

    if (!requester) {
        alert("User not found.");
        return;
    }

    // Remove the requester from the friend requests of the logged-in user
    const requestIndex = loggedInUser.friendRequests.indexOf(requesterUsername);
    if (requestIndex > -1) {
        loggedInUser.friendRequests.splice(requestIndex, 1);
    }

    saveUsers(users);
    alert("Friend request declined.");
    displayFriendsAndRequests();
}

// Cancel a pending friend request
function cancelFriendRequest(receiverUsername) {
    const loggedInUser = getLoggedInUser();
    const users = getUsers();

    const loggedInUserIndex = users.findIndex(user => user.username === loggedInUser.username);

    const receiver = users.find(user => user.username === receiverUsername);
    if (!receiver) {
        alert("User not found.");
        return;
    }

    // Remove the logged-in user from the receiver's friend requests
    const requestIndex = receiver.friendRequests.indexOf(loggedInUser.username);
    if (requestIndex > -1) {
        receiver.friendRequests.splice(requestIndex, 1);
        saveUsers(users);
        alert("Friend request cancelled.");
    } else {
        alert("No pending request found.");
    }
}

// Send private messages between friends
function sendMessage(toUsername, messageText) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("You need to be logged in to send a message.");
        return;
    }

    const messagesKey = `messages_${loggedInUser.username}_${toUsername}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
    messages.push({ from: loggedInUser.username, text: messageText });

    localStorage.setItem(messagesKey, JSON.stringify(messages));
}

// Display friend requests and friends list
function displayFriendsAndRequests() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const users = getUsers();
    const loggedInUserIndex = users.findIndex(user => user.username === loggedInUser.username);

    // Display friends
    const friendsListDiv = document.getElementById("friend-list");
    friendsListDiv.innerHTML = "";
    loggedInUser.friends.forEach(friend => {
        const friendDiv = document.createElement("div");
        friendDiv.textContent = friend;
        friendDiv.onclick = function() {
            showChat(friend);
        };
        friendsListDiv.appendChild(friendDiv);
    });

    // Display friend requests
    const friendRequestListDiv = document.getElementById("friend-request-list");
    friendRequestListDiv.innerHTML = "";
    loggedInUser.friendRequests.forEach(request => {
        const requestDiv = document.createElement("div");
        requestDiv.textContent = request;

        // Create Accept and Decline buttons
        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Accept";
        acceptButton.onclick = function() {
            acceptFriendRequest(request);
        };

        const declineButton = document.createElement("button");
        declineButton.textContent = "Decline";
        declineButton.onclick = function() {
            declineFriendRequest(request);
        };

        requestDiv.appendChild(acceptButton);
        requestDiv.appendChild(declineButton);
        friendRequestListDiv.appendChild(requestDiv);
    });
}

// Show chat box for a particular friend
function showChat(friendUsername) {
    const loggedInUser = getLoggedInUser();
    const messagesKey = `messages_${loggedInUser.username}_${friendUsername}`;
    const messages = JSON.parse(localStorage.getItem(messagesKey)) || [];

    const chatBoxDiv = document.getElementById("chat-box");
    chatBoxDiv.innerHTML = "";
    messages.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `${message.from}: ${message.text}`;
        chatBoxDiv.appendChild(messageDiv);
    });

    document.getElementById("send-message-button").onclick = function() {
        const messageInput = document.getElementById("message-input");
        const messageText = messageInput.value.trim();
        if (messageText) {
            sendMessage(friendUsername, messageText);
            showChat(friendUsername);
            messageInput.value = "";
        }
    };
}

// Main Page Logic
window.onload = function() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        window.location.href = "login.html";
    }

    displayFriendsAndRequests();
};
