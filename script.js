// Simple functionality for form submissions, game play, and avatar customization
document.getElementById('gameForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Game Created: ' + document.getElementById('gameName').value);
});

function playGame(gameName) {
  alert('Playing ' + gameName);
}

function customizeAvatar() {
  alert('Avatar customization page coming soon!');
}
