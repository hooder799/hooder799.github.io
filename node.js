const express = require('express');
const axios = require('axios');
const app = express();

const AUTH0_DOMAIN = 'dev-1npm001fd35mvxyz.us.auth0.com';
const AUTH0_CLIENT_ID = 'BbfekPq7qWqsLmtOxYW3JKDskudqmPhb';
const AUTH0_CLIENT_SECRET = 'pqq2_wmlh_wS1ZOJ-9VsT05KuEHUWZpusvhhB2G0tQNyTuyrW82AUzAdnwPgO6kg';
const MANAGEMENT_API_URL = `https://${AUTH0_DOMAIN}/api/v2/`;

const auth0ManagementClient = axios.create({
  baseURL: MANAGEMENT_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.AUTH0_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Endpoint to get email based on username
app.get('/api/get-user-email', async (req, res) => {
  const { username } = req.query;

  try {
    // Get users based on username (search in metadata)
    const response = await auth0ManagementClient.get(`users-by-email?search_engine=v3&q=nickname:"${username}"`);
    
    if (response.data.length > 0) {
      const user = response.data[0];
      return res.json({ email: user.email });
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve user email' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
