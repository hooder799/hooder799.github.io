const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { users, messages } = require('./data');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('../client'));

app.get('/api/login', (req, res) => {
    const { username } = req.query;
    if (users[username]) {
        return res.status(200).json({ message: 'Login Successful', user: users[username] });
    } else {
        users[username] = { username, friends: [] };
        return res.status(201).json({ message: 'User Created', user: users[username] });
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
        messages.push(message);
        io.emit('message', message);
    });

    socket.on('addFriend', ({ user, friend }) => {
        if (users[user] && users[friend]) {
            users[user].friends.push(friend);
            io.emit('friendAdded', { user, friend });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
