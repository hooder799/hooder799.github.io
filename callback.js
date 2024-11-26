// Initialize Auth0 client
const auth0 = new Auth0Client({
  domain: 'dev-1npm001fd35mvxyz.us.auth0.com',
  client_id: 'BbfekPq7qWqsLmtOxYW3JKDskudqmPhb',
  redirect_uri: window.location.href
});

// Process the authentication response
window.onload = async () => {
  await auth0.handleRedirectCallback();
  const user = await auth0.getUser();
  if (user) {
    alert(`Welcome back, ${user.name}`);
    window.location.href = 'index.html'; // Redirect to homepage or dashboard
  }
};
