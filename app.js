document.getElementById("signUpForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get form values
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation checks
    if (!email || !username || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // If everything is okay, simulate a successful form submission
    alert(`Success! Account created for ${username}`);

    // Clear the form (for a real application, you'd submit data to a backend)
    document.getElementById("signUpForm").reset();
});
