const socket = io();
const loginBtn = document.getElementById('loginBtn');
const chatDiv = document.getElementById('chat');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

loginBtn.onclick = async () => {
    const username = document.getElementById('username').value;
    const res = await fetch(`/api/login?username=${username}`);
    const data = await res.json();

    if (res.ok) {
        document.getElementById('login').style.display = 'none';
        chatDiv.style.display = 'block';
    }

    console.log(data.message);
};

socket.on('message', (message) => {
    messagesDiv.innerHTML += `<div>${message}</div>`;
});

sendBtn.onclick = () => {
    const message = messageInput.value;
    socket.emit('sendMessage', message);
    messageInput.value = '';
};
