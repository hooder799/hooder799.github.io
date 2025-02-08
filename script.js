let macroEnabled = false;
let actionQueue = [];

// Function to perform an action based on the command
function performAction(action) {
    if (macroEnabled) {
        switch (action.type) {
            case 'alert':
                alert(action.message);
                break;
            case 'log':
                console.log(action.message);
                break;
            default:
                console.error('Unknown action type');
        }
    }
}

// Execute all queued actions
function executeActions() {
    if (macroEnabled) {
        actionQueue.forEach(action => performAction(action));
    }
}

// Toggle the macro enabled state
function toggleMacro() {
    macroEnabled = !macroEnabled;
    document.getElementById("macro-status").textContent = macroEnabled ? "ON" : "OFF";
}

// Listen for keydown events for macro control
window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'm') {  // CTRL + M
        toggleMacro();
    }
});

// Event listener for button to perform the action
document.getElementById("perform-action").addEventListener('click', executeActions);

// Add action to the queue based on user input
document.getElementById("add-action").addEventListener('click', () => {
    const input = document.getElementById("actions-input").value;
    try {
        const action = JSON.parse(input);
        actionQueue.push(action);
        document.getElementById("action-list").innerHTML += `<li>${JSON.stringify(action)}</li>`;
        document.getElementById("actions-input").value = ''; // Clear input
    } catch (error) {
        alert("Invalid action format. Make sure to use JSON format.");
    }
});

// Clear all actions from the queue
document.getElementById("clear-actions").addEventListener('click', () => {
    actionQueue = [];
    document.getElementById("action-list").innerHTML = ''; // Clear displayed actions
});
