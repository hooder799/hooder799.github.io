// Save user data (signup)
function saveUserData(email, username, password) {
  const user = { email, username, password, friends: [] };
  let users = JSON.parse(localStorage.getItem("users")) || [];
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

// Main Chat Page (index.html) logic
if (document.getElementById("chat-messages")) {
  window.onload = function () {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      window.location.href = "login.html"; // Redirect to login page if not logged in
    } else {
      displayMessages(); // Display messages if the user is logged in
      loadFriends(); // Load friend list
    }
  };
}

// Display messages in the chat
function displayMessages() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  const chatMessagesDiv = document.getElementById("chat-messages");
  chatMessagesDiv.innerHTML = "";
  messages.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    if (message.image) {
      const imageElement = document.createElement("img");
      imageElement.src = message.image;
      chatMessagesDiv.appendChild(imageElement);
    }
    messageElement.textContent = `${message.username}: ${message.text || ""}`;
    chatMessagesDiv.appendChild(messageElement);
  });
}

// Send message functionality
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

// Add Friend functionality
document.getElementById("add-friend")?.addEventListener("click", function () {
  const friendUsername = prompt("Enter the username to add:");
  if (!friendUsername) return;

  const loggedInUser = getLoggedInUser();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === loggedInUser.email);

  if (user && !user.friends.includes(friendUsername)) {
    user.friends.push(friendUsername);
    localStorage.setItem("users", JSON.stringify(users));
    loadFriends();
  } else {
    alert("User not found or already a friend.");
  }
});

// Load and display friends list
function loadFriends() {
  const loggedInUser = getLoggedInUser();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === loggedInUser.email);
  const friendListDiv = document.getElementById("friend-list");

  if (user && user.friends) {
    friendListDiv.innerHTML = ""; // Clear the friend list
    user.friends.forEach(friend => {
      const friendDiv = document.createElement("div");
      friendDiv.textContent = friend;
      const removeButton = document.createElement("button");
      removeButton.textContent = "Unfriend";
      removeButton.addEventListener("click", function () {
        unfriendUser(friend);
      });
      friendDiv.appendChild(removeButton);
      friendListDiv.appendChild(friendDiv);
    });
  }
}

// Remove friend functionality
function unfriendUser(friendUsername) {
  const loggedInUser = getLoggedInUser();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === loggedInUser.email);
  if (user) {
    user.friends = user.friends.filter(friend => friend !== friendUsername);
    localStorage.setItem("users", JSON.stringify(users));
    loadFriends(); // Refresh friend list
  }
}

// Emoji picker functionality
document.querySelectorAll('.emoji').forEach(button => {
  button.addEventListener('click', function () {
    const emoji = button.getAttribute('data-emoji');
    const messageInput = document.getElementById('message-input');
    messageInput.value += emoji;
  });
});

// Send image functionality
document.getElementById("send-image")?.addEventListener("click", function () {
  const fileInput = document.getElementById("image-input");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      const imageSrc = reader.result;
      const loggedInUser = getLoggedInUser();
      const newMessage = {
        username: loggedInUser.username,
        image: imageSrc
      };

      const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
      messages.push(newMessage);
      localStorage.setItem("chatMessages", JSON.stringify(messages));
      displayMessages();
    };
    reader.readAsDataURL(file);
  }
});
