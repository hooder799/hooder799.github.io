// Initialize Supabase
const supabaseUrl = 'https://YOUR_SUPABASE_URL';  // Replace with your Supabase URL
const supabaseKey = 'YOUR_SUPABASE_KEY';  // Replace with your Supabase anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Show Forms
function showSignupForm() {
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'none';
  document.getElementById('userInfo').style.display = 'none';
}

function showLoginForm() {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('resetForm').style.display = 'none';
  document.getElementById('userInfo').style.display = 'none';
}

function showResetForm() {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'block';
  document.getElementById('userInfo').style.display = 'none';
}

function showUserInfo(user) {
  document.getElementById('userInfo').style.display = 'block';
  document.getElementById('userEmail').innerText = user.email;
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('resetForm').style.display = 'none';
}

// Handle Signup
document.getElementById('signupBtn').addEventListener('click', async () => {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  const { user, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    alert(error.message);
  } else {
    alert('Signup successful! Please check your email for a verification link.');
    showLoginForm();
  }
});

// Handle Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    alert(error.message);
  } else {
    showUserInfo(user);
  }
});

// Handle Password Reset
document.getElementById('resetBtn').addEventListener('click', async () => {
  const email = document.getElementById('resetEmail').value;
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  
  if (error) {
    alert(error.message);
  } else {
    alert('Password reset email sent! Please check your inbox.');
    showLoginForm();
  }
});

// Handle Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  showLoginForm();
});

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', async () => {
  const user = supabase.auth.user();
  
  if (user) {
    showUserInfo(user);
  } else {
    showLoginForm();
  }
});
