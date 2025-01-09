const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { users } = require('./data');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('../client'));

// Utility function to hash passwords (for demonstration purposes, this is very simple)
const hashPassword = password => {
    // In a real app, use bcrypt or another library to hash password
    return 'hashed_' + password;
};

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users[username] = { username, password: hashPassword(password), friends: [] };
    return res.status(201).json({ message: 'User Created' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    return res.status(200).json({ message: 'Login Successful', user });
});

app.post('/api/reset-password', (req, res) => {
    const { username, newPassword } = req.body;
    if (!users[username]) {
        return res.status(404).json({ message: 'User not found' });
    }
    users[username].password = hashPassword(newPassword);
    return res.status(200).json({ message: 'Password reset successful' });
});

// Chat system
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
