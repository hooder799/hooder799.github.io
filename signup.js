// Initialize Auth0 client
const auth0 = new Auth0Client({
  domain: 'dev-1npm001fd35mvxyz.us.auth0.com',
  client_id: 'BbfekPq7qWqsLmtOxYW3JKDskudqmPhb',
  redirect_uri: window.location.href
});

// Handle sign up button click
document.getElementById('signupButton').addEventListener('click', async () => {
  await auth0.loginWithRedirect({
    screen_hint: 'signup'
  });
});

// Check if user is logged in after redirect
window.onload = async () => {
  const user = await auth0.getUser();
  if (user) {
    alert(`Welcome, ${user.name}`);
    window.location.href = 'index.html'; // Redirect to the homepage
  }
};
