// Initialize Auth0 client
const auth0 = new Auth0Client({
  domain: 'YOUR_AUTH0_DOMAIN',
  client_id: 'YOUR_AUTH0_CLIENT_ID',
  redirect_uri: window.location.href
});

// Handle login button click
document.getElementById('loginButton').addEventListener('click', async () => {
  await auth0.loginWithRedirect();
});

// Check if user is logged in after redirect
window.onload = async () => {
  const user = await auth0.getUser();
  if (user) {
    alert(`Welcome, ${user.name}`);
    window.location.href = 'index.html'; // Redirect to the homepage
  }
};
