let macroEnabled = false;
let actionQueue = [];
let intervalId = null;
let repeatCount = 1;
let actionIndex = 0;

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

// Execute actions based on the repeat count
function executeActions() {
    if (macroEnabled && actionIndex < repeatCount) {
        actionQueue.forEach(action => performAction(action));
        actionIndex++;
    } else if (actionIndex >= repeatCount) {
        clearInterval(intervalId); // Stop executing once the repeat count is reached
        actionIndex = 0; // Reset for next use
    }
}

// Toggle the macro enabled state
function toggleMacro() {
    macroEnabled = !macroEnabled;
    document.getElementById("macro-status").textContent = macroEnabled ? "ON" : "OFF";
    if (macroEnabled) {
        actionIndex = 0; // Reset action index
        if (document.getElementById("activation-method").value === "hold") {
            executeActions();
            intervalId = setInterval(executeActions, calculateSpeed());
        }
    } else {
        clearInterval(intervalId); // Stop executing on toggle off
    }
}

// Key press event
window.addEventListener('keydown', (event) => {
    if (String.fromCharCode(event.keyCode).toLowerCase() === document.getElementById("macro-key").value.toLowerCase()) {
        if (document.getElementById("activation-method").value === "toggle") {
            toggleMacro();
        } else if (document.getElementById("activation-method").value === "hold") {
            if (!macroEnabled) {
                toggleMacro(); // Enable the macro
            }
        }
    }
});

// Stop macro on key up for hold method
window.addEventListener('keyup', (event) => {
    if (String.fromCharCode(event.keyCode).toLowerCase() === document.getElementById("macro-key").value.toLowerCase() && macroEnabled) {
        toggleMacro(); // Disable the macro
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
        alert("Invalid action format. Ensure to use JSON format.");
    }
});

// Clear all actions from the queue
document.getElementById("clear-actions").addEventListener('click', () => {
    actionQueue = [];
    document.getElementById("action-list").innerHTML = ''; // Clear displayed actions
});

// Calculate the speed based on user input
function calculateSpeed() {
    const speed = parseFloat(document.getElementById("speed-input").value);
    const unit = document.getElementById("speed-unit").value;
    switch (unit) {
        case 'milliseconds':
            return speed; // speed is already in ms
        case 'seconds':
            return speed * 1000; // convert to ms
        case 'minutes':
            return speed * 60000; // convert to ms
        case 'hours':
            return speed * 3600000; // convert to ms
        default:
            return 1000; // default to 1 second
    }
}

// Set repeat count when the value changes
document.getElementById("repeat-count").addEventListener('change', () => {
    repeatCount = parseInt(document.getElementById("repeat-count").value);
});
