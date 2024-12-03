// Helper functions to interact with localStorage

// Save user data (signup)
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

// Retrieve user data for login
function getUserData(emailOrUsername, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => (user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password);
}

// Store logged-in user
function storeLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Get logged-in user data
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Logout: Remove the logged-in user
function logout() {
    localStorage.removeItem("loggedInUser");
}

// Sign-up page logic
document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    saveUserData(email, username, password);
    alert("Account created successfully!");
    window.location.href = "login.html"; // Redirect to login page after successful sign up
});

// Login page logic
window.onload = function () {
    const loggedInUser = getLoggedInUser();

    // Redirect to main page if already logged in
    if (loggedInUser) {
        window.location.href = "index.html";
    }

    // Handle login form submission
    document.getElementById("login-form")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const emailOrUsername = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const loggedInUser = getUserData(emailOrUsername, password);

        if (loggedInUser) {
            storeLoggedInUser(loggedInUser);
            window.location.href = "index.html"; // Redirect to main page after login
        } else {
            alert("Invalid credentials, please try again.");
        }
    });
};

// Main Chat Page (index.html) logic

// Ensure the user is logged in before accessing the chat page
if (document.getElementById("chat-messages")) {
    window.onload = function () {
        const loggedInUser = getLoggedInUser();
        if (!loggedInUser) {
            window.location.href = "login.html"; // Redirect to login page if not logged in
        } else {
            displayMessages(); // Display messages if the user is logged in
        }

        // Display messages in the chat
        function displayMessages() {
            const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
            const chatMessagesDiv = document.getElementById("chat-messages");
            chatMessagesDiv.innerHTML = "";

            messages.forEach(message => {
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");
                messageElement.textContent = `${message.username}: ${message.text}`;
                chatMessagesDiv.appendChild(messageElement);
            });
        }

        // Handle message sending
        document.getElementById("send-message")?.addEventListener("click", function () {
            const messageInput = document.getElementById("message-input");
            const messageText = messageInput.value.trim();

            if (messageText === "") return;

            const loggedInUser = getLoggedInUser();
            if (!loggedInUser) {
                window.location.href = "login.html"; // Redirect if not logged in
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
            displayMessages();
        });
    };
}

// Logout functionality
document.getElementById("logout-button")?.addEventListener("click", function () {
    logout();
    window.location.href = "login.html"; // Redirect to login page after logout
});


// Logout functionality
document.getElementById("logout-button")?.addEventListener("click", function () {
    logout();
    window.location.href = "login.html"; // Redirect to login page after logout
});

// Add Friend functionality
document.getElementById("add-friend-button")?.addEventListener("click", function () {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("You must be logged in to add friends.");
        return;
    }

    const friendEmailOrUsername = prompt("Enter the email or username of the person you want to add:");

    if (!friendEmailOrUsername) {
        alert("Please enter a valid email or username.");
        return;
    }

    // Check if the user exists in the stored users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const friend = users.find(user => user.email === friendEmailOrUsername || user.username === friendEmailOrUsername);

    if (!friend) {
        alert("Friend not found.");
        return;
    }

    // Add the friend to the logged-in user's friend list
    let friendsList = JSON.parse(localStorage.getItem(loggedInUser.username + "_friends")) || [];
    if (friendsList.some(f => f.username === friend.username)) {
        alert("You are already friends with this person.");
        return;
    }

    friendsList.push({ username: friend.username, email: friend.email });
    localStorage.setItem(loggedInUser.username + "_friends", JSON.stringify(friendsList));

    alert("Friend added successfully!");
    displayFriends(); // Refresh the friends list
});

// Display Friends List in the sidebar
function displayFriends() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const friendsList = JSON.parse(localStorage.getItem(loggedInUser.username + "_friends")) || [];
    const friendsListElement = document.getElementById("friends-list");
    friendsListElement.innerHTML = ""; // Clear existing friends

    friendsList.forEach(friend => {
        const li = document.createElement("li");
        li.textContent = friend.username;

        // Add "Remove Friend" button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Unfriend";
        removeButton.onclick = function () {
            removeFriend(friend.username);
        };

        li.appendChild(removeButton);
        friendsListElement.appendChild(li);
    });
}

// Remove Friend functionality
function removeFriend(friendUsername) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    let friendsList = JSON.parse(localStorage.getItem(loggedInUser.username + "_friends")) || [];
    friendsList = friendsList.filter(friend => friend.username !== friendUsername);
    localStorage.setItem(loggedInUser.username + "_friends", JSON.stringify(friendsList));

    alert("Friend removed.");
    displayFriends(); // Refresh the friends list
}

// Call displayFriends on page load to show the friends list
window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        window.location.href = "login.html"; // Redirect if not logged in
    } else {
        displayFriends(); // Show the friends list
    }
};

