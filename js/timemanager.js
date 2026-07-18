// =======================================================
// WaterPort
// Time Manager
// =======================================================

const TimeManager = {

levelDuration: 120,
remainingTime: 120,
    totalElapsedTime: 0,
    intervalId: null,

    startLevel() {

        this.stop();

        this.remainingTime = this.levelDuration;
        this.updateUI();

        this.intervalId = setInterval(() => {

            this.remainingTime--;
            this.totalElapsedTime++;

            if (this.remainingTime <= 0) {

                this.remainingTime = 0;

                this.updateUI();
                this.stop();
                this.handleTimeUp();

                return;
            }

            this.updateUI();

        }, 1000);
    },

    stop() {

        if (this.intervalId !== null) {

            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    addSeconds(seconds) {

        if (!GameState.is(GameState.PLAYING)) return;

        this.remainingTime += seconds;
        this.updateUI();
    },

    getRemainingTime() {

        return this.remainingTime;
    },

    getTotalElapsedTime() {

        return this.totalElapsedTime;
    },

    resetGameTime() {

        this.stop();

        this.totalElapsedTime = 0;
        this.remainingTime = this.levelDuration;

        this.updateUI();
    },

    handleTimeUp() {

        GameState.set(GameState.GAME_OVER);
        setTimeout(() => {

    GameState.set(GameState.WAITING_RESTART);

}, 1500);

        PopupManager.show(
            "TIEMPO AGOTADO",
            "level",
            1500
        );
    },

    updateUI() {

        const timerElement =
            document.getElementById("timer");

        if (!timerElement) return;

        const minutes =
            Math.floor(this.remainingTime / 60);

        const seconds =
            this.remainingTime % 60;

        timerElement.textContent =
            `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;
    }

};


// Cada tablero nuevo inicia su cuenta atrás.
document.addEventListener(
    "boardCreated",
    () => TimeManager.startLevel()
);