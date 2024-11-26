    // Initialize Auth0 client
const auth0 = new Auth0Client({
  domain: 'dev-1npm001fd35mvxyz.us.auth0.com',
  client_id: 'BbfekPq7qWqsLmtOxYW3JKDskudqmPhb',
  redirect_uri: window.location.href
});

// Handle the login form submission
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Look up the email based on the username (Assume username is stored in user_metadata)
    const email = await getEmailFromUsername(username);
    
    if (!email) {
      alert('No account found with this username.');
      return;
    }

    // Now use the email and password to authenticate
    await loginUser(email, password);

    alert('Login successful!');
    window.location.href = 'index.html'; // Redirect to homepage or dashboard
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Function to look up the email based on the username (from metadata or a backend)
async function getEmailFromUsername(username) {
  try {
    // Query the Auth0 Management API to search for the user by username in the metadata (using a rule)
    const response = await fetch(`/api/get-user-email?username=${username}`);
    const data = await response.json();

    if (data && data.email) {
      return data.email;
    }
    
    return null;
  } catch (error) {
    throw new Error('Failed to retrieve user email.');
  }
}

// Function to log in using email and password
async function loginUser(email, password) {
  try {
    await auth0.loginWithCredentials({
      username: email,
      password: password
    });
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}
