let macroEnabled = false;

// Function to perform the action (simulate a click or input)
function performAction() {
    if (macroEnabled) {
        console.log("Macro action performed!");
        // Here you can replace this with actual actions
        alert("Action performed by the macro!");
    }
}

// Toggle the macro enabled state
function toggleMacro() {
    macroEnabled = !macroEnabled;
    document.getElementById("macro-status").textContent = macroEnabled ? "ON" : "OFF";
}

// Listen for keydown events
window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'm') {  // CTRL + M
        toggleMacro();
    }
});

// Set an interval to run the macro action periodically
setInterval(() => {
    performAction();
}, 5000); // Perform action every 5 seconds (change as needed)

// Event listener for the button
document.getElementById("perform-action").addEventListener('click', performAction);
