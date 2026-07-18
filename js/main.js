console.log("WaterPort Alpha");

function startWaterPort() {

    restartGame();

}


function restartGame() {

    GameState.set(GameState.PLAYING);

    LevelManager.currentLevel = 1;

    document.getElementById("level").textContent = 1;

    scaleGameToViewport();

    ScoreManager.reset();

    TimeManager.resetGameTime();

    createBoard();

    document.getElementById("message").textContent =
        "NIVEL 1 · DEPÓSITOS 0/5";

}


window.addEventListener(
    "resize",
    scaleGameToViewport
);

window.addEventListener(
    "DOMContentLoaded",
    startWaterPort
);


// =======================================================
// Reiniciar tras finalizar la partida
// =======================================================

document.addEventListener("click", () => {

    if (
        GameState.is(GameState.GAME_OVER) ||
        GameState.is(GameState.WAITING_RESTART)
    ) {

        restartGame();

    }

});