let currentLevel = 1;
let levelCompleted = false;

function completeLevel() {
  if (levelCompleted) return;

  levelCompleted = true;

  document.getElementById("message").textContent =
    `NIVEL ${currentLevel} COMPLETADO`;

  setTimeout(() => {
    nextLevel();
  }, 1800);
}

function nextLevel() {
  currentLevel++;

  document.getElementById("level").textContent = currentLevel;

  levelCompleted = false;

  createBoard();

  document.getElementById("message").textContent =
    `NIVEL ${currentLevel}: LLENA LOS 5 DEPÓSITOS`;
}