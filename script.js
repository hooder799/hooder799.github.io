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
}

// Handle login logic
window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        displayFriendsAndRequests(loggedInUser);
        displayMessages(loggedInUser);
    } else {
        window.location.href = "login.html";
    }

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

    // Display messages
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
    }

    // Display friends and friend requests
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
    document.getElementById("add-friend-button").addEventListener("click", function () {
        const usernameToAdd = prompt("Enter the username of the person you want to add:");
        if (usernameToAdd) {
            const loggedInUser = getLoggedInUser();
            const users = JSON.parse(localStorage.getItem("users"));
            const userToAdd = users.find(user => user.username === usernameToAdd);

            if (userToAdd) {
                // Send friend request
                if (!loggedInUser.sentRequests.includes(usernameToAdd) && !loggedInUser.friends.includes(usernameToAdd)) {
                    loggedInUser.sentRequests.push(usernameToAdd);
                    userToAdd.receivedRequests.push(loggedInUser.username);
                    alert("Friend request sent!");
                } else {
                    alert("You are already friends or have sent a request.");
                }
            } else {
                alert("User not found.");
            }
            storeLoggedInUser(loggedInUser);
            localStorage.setItem("users", JSON.stringify(users));
            displayFriendsAndRequests(loggedInUser);
        }
    });

    // Accept friend request
    window.acceptFriendRequest = function (index) {
        const loggedInUser = getLoggedInUser();
        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find(user => user.username === loggedInUser.username);

        const friendUsername = user.receivedRequests[index];
        user.friends.push(friendUsername);
        loggedInUser.friends.push(friendUsername);

        user.receivedRequests.splice(index, 1);
        const friendUser = users.find(user => user.username === friendUsername);
        friendUser.sentRequests = friendUser.sentRequests.filter(request => request !== loggedInUser.username);
        storeLoggedInUser(loggedInUser);
        localStorage.setItem("users", JSON.stringify(users));

        displayFriendsAndRequests(loggedInUser);
    };

    // Decline friend request
    window.declineFriendRequest = function (index) {
        const loggedInUser = getLoggedInUser();
        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find(user => user.username === loggedInUser.username);

        const friendUsername = user.receivedRequests[index];
        user.receivedRequests.splice(index, 1);
        const friendUser = users.find(user => user.username === friendUsername);
        friendUser.sentRequests = friendUser.sentRequests.filter(request => request !== loggedInUser.username);
        storeLoggedInUser(loggedInUser);
        localStorage.setItem("users", JSON.stringify(users));

        displayFriendsAndRequests(loggedInUser);
    };

    // Cancel friend request
    window.cancelFriendRequest = function (index) {
        const loggedInUser = getLoggedInUser();
        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find(user => user.username === loggedInUser.username);

        const friendUsername = user.sentRequests[index];
        user.sentRequests.splice(index, 1);
        const friendUser = users.find(user => user.username === friendUsername);
        friendUser.receivedRequests = friendUser.receivedRequests.filter(request => request !== loggedInUser.username);
        storeLoggedInUser(loggedInUser);
        localStorage.setItem("users", JSON.stringify(users));

        displayFriendsAndRequests(loggedInUser);
    };

    // Logout logic
    document.getElementById("logout-button").addEventListener("click", function () {
        logout();
        window.location.href = "login.html";
    });
};
