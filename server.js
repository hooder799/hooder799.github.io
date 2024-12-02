// server.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Basic route to check server status
app.get('/', (req, res) => {
    res.send('IXL Server is running!');
});

// Add your routes for login, signup, and password reset here

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
