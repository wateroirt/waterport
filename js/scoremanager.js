// =======================================================
// WaterPort
// Score Manager
// =======================================================

const ScoreManager = {

    score: 0,

    reset() {

        this.score = 0;
        this.updateUI();

    },

    add(points) {

        this.score += points;
        this.updateUI();

    },

    getTankPoints(filledTanks) {

        const table = {
            1: 100,
            2: 300,
            3: 500,
            4: 800,
            5: 1200
        };

        return table[filledTanks] || 0;

    },

    get() {

        return this.score;

    },

    updateUI() {

        const scoreElement =
            document.getElementById("score");

        if (scoreElement) {

            scoreElement.textContent =
                this.score;

        }

    }

};