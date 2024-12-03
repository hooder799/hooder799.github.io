let currentUser = null;

// Fake data for testing purposes
const users = [
    { username: 'user1', password: 'password1', friends: ['user2'], sentRequests: [], receivedRequests: [] },
    { username: 'user2', password: 'password2', friends: ['user1'], sentRequests: [], receivedRequests: [] }
];

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate the username and password
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        showMainInterface();
    } else {
        alert('Invalid credentials');
    }
}

// Signup function (for simplicity, we simulate it with existing data)
function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users.some(u => u.username === username)) {
        alert('Username already exists');
    } else {
        users.push({ username, password, friends: [], sentRequests: [], receivedRequests: [] });
        alert('Account created! Please login.');
    }
}

// Show the main chat interface after login
function showMainInterface() {
    document.getElementById('authForm').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'flex';
    document.getElementById('sidebar').style.display = 'block';
    showChat();
}

// Logout function
function logout() {
    currentUser = null;
    document.getElementById('authForm').style.display = 'block';
    document.getElementById('mainContainer').style.display = 'none';
}

// Show chat
function showChat() {
    document.getElementById('chatContainer').style.display = 'block';
    document.getElementById('friendsList').style.display = 'none';
    document.getElementById('receivedRequests').style.display = 'none';
    document.getElementById('sentRequests').style.display = 'none';
}

// Show Friends List
function showFriends() {
    document.getElementById('friendsList').style.display = 'block';
    document.getElementById('receivedRequests').style.display = 'none';
    document.getElementById('sentRequests').style.display = 'none';
    renderFriendsList();
}

// Show Received Requests
function showRequests() {
    document.getElementById('friendsList').style.display = 'none';
    document.getElementById('receivedRequests').style.display = 'block';
    document.getElementById('sentRequests').style.display = 'none';
    renderReceivedRequests();
}

// Render Friends List
function renderFriendsList() {
    const friendsUl = document.getElementById('friendsListUl');
    friendsUl.innerHTML = '';
    currentUser.friends.forEach(friend => {
        const li = document.createElement('li');
        li.textContent = friend;
        friendsUl.appendChild(li);
    });
}

// Render Received Requests
function renderReceivedRequests() {
    const receivedUl = document.getElementById('receivedRequestsUl');
    receivedUl.innerHTML = '';
    currentUser.receivedRequests.forEach(request => {
        const li = document.createElement('li');
        li.textContent = request;
        receivedUl.appendChild(li);
    });
}

// Send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<span>${message}</span><button onclick="deleteMessage(this)">Delete</button>`;
        chatMessages.appendChild(messageElement);
        messageInput.value = '';
    }
}

// Delete a message
function deleteMessage(button) {
    button.parentElement.remove();
}

