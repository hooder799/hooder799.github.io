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
