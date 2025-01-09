const socket = io();
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const resetBtn = document.getElementById('resetBtn');
const sendBtn = document.getElementById('sendBtn');
const chatDiv = document.getElementById('chat');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Toggle between pages
document.getElementById('showSignupBtn').onclick = () => {
    document.getElementById('login').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
};
document.getElementById('backToLogin').onclick = () => {
    document.getElementById('signup').style.display = 'none';
    document.getElementById('login').style.display = 'block';
};
document.getElementById('showResetBtn').onclick = () => {
    document.getElementById('login').style.display = 'none';
    document.getElementById('resetPassword').style.display = 'block';
};
document.getElementById('backToLoginFromReset').onclick = () => {
    document.getElementById('resetPassword').style.display = 'none';
    document.getElementById('login').style.display = 'block';
};

// Handling Login
loginBtn.onclick = async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    if (res.ok) {
        document.getElementById('login').style.display = 'none';
        chatDiv.style.display = 'block';
    } else {
        alert('Login failed: ' + (await res.json()).message);
    }
};

// Handling Signup
signupBtn.onclick = async () => {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        alert('Signup Successful! Please log in.');
        document.getElementById('signup').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    } else {
        alert('Signup failed: ' + (await res.json()).message);
    }
};

// Handling Reset Password
resetBtn.onclick = async () => {
    const username = document.getElementById('resetUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, newPassword })
    });

    if (res.ok) {
        alert('Password reset successful! Please log in.');
        document.getElementById('resetPassword').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    } else {
        alert('Password reset failed: ' + (await res.json()).message);
    }
};

// Handling chat messages
socket.on('message', (message) => {
    messagesDiv.innerHTML += `<div>${message}</div>`;
});

sendBtn.onclick = () => {
    const message = messageInput.value;
    socket.emit('sendMessage', message);
    messageInput.value = '';
};
