// Helper functions to interact with localStorage
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function storeLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Add Friend functionality
document.getElementById("add-friend-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("friend-username").value.trim();
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
            requestItem.innerHTML = `${request.from} <button onclick="acceptRequest('${request.from}')">Accept</button><button class="decline" onclick="declineRequest('${request.from}')">Decline</button>`;
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
        alert(`You are now friends with ${username}`);
        window.location.reload();
    }
}

// Decline friend request
function declineRequest(username) {
    const requests = JSON.parse(localStorage.getItem("friendRequests")) || [];
    const index = requests.findIndex(req => req.from === username && req.status === "pending");
    if (index !== -1) {
        requests.splice(index, 1);
        localStorage.setItem("friendRequests", JSON.stringify(requests));
        alert(`You declined the friend request from ${username}`);
        window.location.reload();
    }
}

// Start chat with a friend
function startChat(friendUsername) {
    alert(`Starting chat with ${friendUsername}`);
}

// Signup and Login buttons
document.getElementById("signup-btn")?.addEventListener("click", function () {
    window.location.href = "signup.html";
});

document.getElementById("login-btn")?.addEventListener("click", function () {
    window.location.href = "login.html";
});
