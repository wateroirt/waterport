// =======================================================
// WaterPort
// Level Manager
// =======================================================

const LEVELS = [

    // Nivel 1
    {
        blocked: [0, 0],
        frozen: [0, 0],
        rewards: [],
        clocks: [],
        multipliers: []
    },

    // Nivel 2
    {
        blocked: [0, 0],
        frozen: [0, 0],
        rewards: [100],
        clocks: [],
        multipliers: []
    },

    // Nivel 3
    {
        blocked: [0, 0],
        frozen: [0, 0],
        rewards: [100],
        clocks: [],
        multipliers: []
    },

    // Nivel 4
    {
        blocked: [0, 0],
        frozen: [0, 0],
        rewards: [100, 200],
        clocks: [],
        multipliers: []
    },

    // Nivel 5
    {
        blocked: [0, 1],
        frozen: [0, 0],
        rewards: [100, 200],
        clocks: [30],
        multipliers: []
    },

    // Nivel 6
    {
        blocked: [0, 1],
        frozen: [0, 0],
        rewards: [100, 200, 300],
        clocks: [30],
        multipliers: []
    },

    // Nivel 7
    {
        blocked: [0, 1],
        frozen: [0, 0],
        rewards: [100, 200, 300],
        clocks: [30],
        multipliers: [2]
    },

    // Nivel 8
    {
        blocked: [0, 2],
        frozen: [0, 0],
        rewards: [100, 200, 300],
        clocks: [30],
        multipliers: [2]
    },

    // Nivel 9
    {
        blocked: [0, 2],
        frozen: [0, 0],
        rewards: [100, 200, 300],
        clocks: [30, 60],
        multipliers: [2]
    },

    // Nivel 10
    {
        blocked: [1, 2],
        frozen: [0, 0],
        rewards: [100, 200, 300],
        clocks: [60],
        multipliers: [2]
    },

    // Nivel 11
    {
        blocked: [1, 2],
        frozen: [0, 0],
        rewards: [100, 100, 200, 300],
        clocks: [30, 60],
        multipliers: [2]
    },

    // Nivel 12
    {
        blocked: [1, 2],
        frozen: [0, 0],
        rewards: [100, 100, 200, 200, 300],
        clocks: [30, 60],
        multipliers: [2]
    },

    // Nivel 13
    {
        blocked: [1, 3],
        frozen: [0, 0],
        rewards: [100, 100, 200, 300],
        clocks: [30, 60],
        multipliers: [2, 3]
    },

    // Nivel 14
    {
        blocked: [1, 3],
        frozen: [0, 0],
        rewards: [100, 100, 200, 300],
        clocks: [30, 60],
        multipliers: [2, 3]
    },

    // Nivel 15
    {
        blocked: [2, 3],
        frozen: [0, 0],
        rewards: [100, 100, 200, 300],
        clocks: [30, 60],
        multipliers: [2, 3]
    },

    // Nivel 16
    {
        blocked: [2, 3],
        frozen: [0, 1],
        rewards: [100, 100, 200, 300],
        clocks: [30, 60],
        multipliers: [2, 3]
    },

    // Nivel 17
    {
        blocked: [2, 3],
        frozen: [0, 1],
        rewards: [100, 100, 200, 300, 500],
        clocks: [60],
        multipliers: [2, 3]
    },

    // Nivel 18
    {
        blocked: [2, 3],
        frozen: [0, 1],
        rewards: [100, 100, 200, 300, 500],
        clocks: [30, 60, 90],
        multipliers: [2, 3]
    },

    // Nivel 19
    {
        blocked: [3, 3],
        frozen: [1, 1],
        rewards: [100, 100, 200, 300, 500],
        clocks: [60, 90],
        multipliers: [2, 3]
    },

    // Nivel 20
    {
        blocked: [3, 3],
        frozen: [1, 1],
        rewards: [100, 100, 200, 300, 500, 1000],
        clocks: [60, 90],
        multipliers: [2, 3]
    }

];

const LevelManager = {

    currentLevel: 1,

    getCurrentLevel() {
        return this.currentLevel;
    },

    getCurrentLevelData() {
        return LEVELS[this.currentLevel - 1];
    },

    getRandomBlockedCount() {
        const levelData = this.getCurrentLevelData();

        return randomNumberBetween(
            levelData.blocked[0],
            levelData.blocked[1]
        );
    },

    getRandomRewards() {
        const levelData = this.getCurrentLevelData();
        const rewardPool = shuffleArrayCopy(levelData.rewards);

        const maximumAmount =
            Math.min(3, rewardPool.length);

        const amount =
            randomNumberBetween(0, maximumAmount);

        return rewardPool.slice(0, amount);
    },

    getRandomClock() {
        const levelData = this.getCurrentLevelData();

        if (levelData.clocks.length === 0) {
            return null;
        }

        if (Math.random() >= 0.5) {
            return null;
        }

        const randomIndex =
            randomNumberBetween(
                0,
                levelData.clocks.length - 1
            );

        return levelData.clocks[randomIndex];
    },

    getRandomMultiplier() {
        const levelData = this.getCurrentLevelData();

        if (levelData.multipliers.length === 0) {
            return null;
        }

        if (Math.random() >= 0.5) {
            return null;
        }

        const randomIndex =
            randomNumberBetween(
                0,
                levelData.multipliers.length - 1
            );

        return levelData.multipliers[randomIndex];
    }

};


// =======================================================
// CAMBIO Y FINAL DE NIVEL
// =======================================================

function completeLevel() {

    TimeManager.stop();

    document.getElementById("message").textContent =
        `NIVEL ${LevelManager.currentLevel} COMPLETADO`;

    PopupManager.levelCompleted();

    setTimeout(() => {

        LevelManager.currentLevel++;

        if (LevelManager.currentLevel > LEVELS.length) {

            finishGame();
            return;

        }

        document.getElementById("level").textContent =
            LevelManager.currentLevel;

        createBoard();

        document.getElementById("message").textContent =
            `NIVEL ${LevelManager.currentLevel}: LLENA LOS 5 DEPÓSITOS`;

    }, 1000);

}


function finishGame() {

    TimeManager.stop();

    const finalScore =
        ScoreManager.get();

    const finalTime =
        TimeManager.getTotalElapsedTime();

    const entersScoreRecords =
        RecordManager.isHighScore(
            finalScore,
            finalTime
        );

    const entersTimeRecords =
        RecordManager.isBestTime(
            finalScore,
            finalTime,
            true
        );

    PopupManager.gameCompleted();

    if (
        entersScoreRecords ||
        entersTimeRecords
    ) {

        RecordEntry.open(
            finalScore,
            finalTime,
            true
        );

        return;
    }

    GameState.set(
        GameState.GAME_OVER
    );

    document.getElementById("message").textContent =
        "JUEGO COMPLETADO · CLIC PARA EMPEZAR";

}


// =======================================================
// FUNCIONES PÚBLICAS
// =======================================================

function getCurrentLevel() {
    return LevelManager.getCurrentLevel();
}


function getCurrentLevelData() {
    return LevelManager.getCurrentLevelData();
}


function getRandomBlockedCount() {
    return LevelManager.getRandomBlockedCount();
}


function getRandomRewards() {
    return LevelManager.getRandomRewards();
}


function getRandomClock() {
    return LevelManager.getRandomClock();
}


function getRandomMultiplier() {
    return LevelManager.getRandomMultiplier();
}


// =======================================================
// UTILIDADES
// =======================================================

function randomNumberBetween(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function shuffleArrayCopy(items) {

    const shuffled = items.slice();

    for (
        let index = shuffled.length - 1;
        index > 0;
        index--
    ) {

        const randomIndex =
            Math.floor(Math.random() * (index + 1));

        [
            shuffled[index],
            shuffled[randomIndex]
        ] = [
            shuffled[randomIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}