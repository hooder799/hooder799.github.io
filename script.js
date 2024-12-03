// Helper function to update friend lists in localStorage
function updateFriendLists() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    // Get users, sent and received requests
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const sentRequests = loggedInUser.sentRequests || [];
    const receivedRequests = loggedInUser.receivedRequests || [];

    // Populate friends list
    const friendsList = document.getElementById("friends-list");
    friendsList.innerHTML = "";
    loggedInUser.friends.forEach(friend => {
        const li = document.createElement("li");
        li.textContent = friend;
        friendsList.appendChild(li);
    });

    // Populate sent friend requests
    const sentRequestsList = document.getElementById("sent-requests");
    sentRequestsList.innerHTML = "";
    sentRequests.forEach(request => {
        const li = document.createElement("li");
        li.textContent = request;
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel Request";
        cancelButton.onclick = () => cancelRequest(request);
        li.appendChild(cancelButton);
        sentRequestsList.appendChild(li);
    });

    // Populate received friend requests
    const receivedRequestsList = document.getElementById("received-requests");
    receivedRequestsList.innerHTML = "";
    receivedRequests.forEach(request => {
        const li = document.createElement("li");
        li.textContent = request;
        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Accept";
        acceptButton.onclick = () => acceptRequest(request);

        const declineButton = document.createElement("button");
        declineButton.textContent = "Decline";
        declineButton.onclick = () => declineRequest(request);

        li.appendChild(acceptButton);
        li.appendChild(declineButton);
        receivedRequestsList.appendChild(li);
    });
}

// Accept Friend Request
function acceptRequest(username) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        // Add to friends list
        loggedInUser.friends.push(user.username);
        user.friends.push(loggedInUser.username);
        
        // Remove from received requests
        const index = loggedInUser.receivedRequests.indexOf(username);
        if (index > -1) {
            loggedInUser.receivedRequests.splice(index, 1);
        }

        // Save updated data
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        localStorage.setItem("users", JSON.stringify(users));

        // Update UI
        updateFriendLists();
    }
}

// Decline Friend Request
function declineRequest(username) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Remove from received requests
    const index = loggedInUser.receivedRequests.indexOf(username);
    if (index > -1) {
        loggedInUser.receivedRequests.splice(index, 1);
    }

    // Save updated data
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    localStorage.setItem("users", JSON.stringify(users));

    // Update UI
    updateFriendLists();
}

// Cancel Sent Friend Request
function cancelRequest(username) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Remove from sent requests
    const index = loggedInUser.sentRequests.indexOf(username);
    if (index > -1) {
        loggedInUser.sentRequests.splice(index, 1);
    }

    // Save updated data
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    localStorage.setItem("users", JSON.stringify(users));

    // Update UI
    updateFriendLists();
}

// Adding a Friend
document.getElementById("add-friend-button").addEventListener("click", function () {
    const username = prompt("Enter the username of the friend you want to add:");
    const loggedInUser = getLoggedInUser();
    
    if (!loggedInUser) return;
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);
    
    if (user && user.username !== loggedInUser.username) {
        // Add to sent requests
        if (!loggedInUser.sentRequests) {
            loggedInUser.sentRequests = [];
        }

        loggedInUser.sentRequests.push(username);
        user.receivedRequests = user.receivedRequests || [];
        user.receivedRequests.push(loggedInUser.username);
        
        // Save updated data
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        localStorage.setItem("users", JSON.stringify(users));

        alert(`Friend request sent to ${username}`);
        updateFriendLists();
    } else {
        alert("User does not exist or you cannot send a request to yourself.");
    }
});

// Logout function
document.getElementById("logout-button").addEventListener("click", function () {
