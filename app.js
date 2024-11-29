const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Mock user database
const users = [
    { id: 1, email: 'user@example.com', password: '$2a$10$J6mZ0.kUKgDT8wJk.3FPEe0fXsHR7L8yZYOkxEecO0hv7vXopFqaS' } // password is 'password123'
];

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });

    return res.json({ success: true, message: 'Login successful', token });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
