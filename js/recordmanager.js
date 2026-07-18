// =======================================================
// WaterPort
// Record Manager
// =======================================================

const RecordManager = {

    maximumScoreRecords: 5,
    maximumTimeRecords: 3,

    records: {
        scores: [],
        times: []
    },


    // ===================================================
    // INICIO Y ALMACENAMIENTO
    // ===================================================

    init() {

        const savedRecords =
            localStorage.getItem("waterportRecords");

        if (!savedRecords) return;

        try {

            const parsedRecords =
                JSON.parse(savedRecords);

            this.records.scores =
                Array.isArray(parsedRecords.scores)
                    ? parsedRecords.scores
                    : [];

            this.records.times =
                Array.isArray(parsedRecords.times)
                    ? parsedRecords.times
                    : [];

            this.sortRecords();

        } catch (error) {

            console.warn(
                "No se pudieron leer los récords guardados.",
                error
            );

            this.records = {
                scores: [],
                times: []
            };
        }
    },


    save() {

        localStorage.setItem(
            "waterportRecords",
            JSON.stringify(this.records)
        );
    },


    // ===================================================
    // COMPROBACIÓN DE RÉCORDS
    // ===================================================

    isHighScore(score, time) {

        const candidate = {
            score: score,
            time: time
        };

        const ranking = [
            ...this.records.scores,
            candidate
        ];

        ranking.sort(
            this.compareScoreRecords
        );

        return (
            ranking.indexOf(candidate) <
            this.maximumScoreRecords
        );
    },


    isBestTime(score, time, gameCompleted) {

        if (!gameCompleted) {
            return false;
        }

        const candidate = {
            score: score,
            time: time
        };

        const ranking = [
            ...this.records.times,
            candidate
        ];

        ranking.sort(
            this.compareTimeRecords
        );

        return (
            ranking.indexOf(candidate) <
            this.maximumTimeRecords
        );
    },


    // ===================================================
    // GUARDAR UNA PARTIDA
    // ===================================================

    addRecord(initials, score, time, gameCompleted) {

        const cleanInitials =
            this.cleanInitials(initials);

        const entersScoreList =
            this.isHighScore(score, time);

        const entersTimeList =
            this.isBestTime(
                score,
                time,
                gameCompleted
            );

        if (entersScoreList) {

            this.records.scores.push({
                initials: cleanInitials,
                score: score,
                time: time
            });
        }

        if (entersTimeList) {

            this.records.times.push({
                initials: cleanInitials,
                score: score,
                time: time
            });
        }

        if (
            entersScoreList ||
            entersTimeList
        ) {

            this.sortRecords();
            this.save();
        }

        return {
            highScore: entersScoreList,
            bestTime: entersTimeList
        };
    },


    cleanInitials(initials) {

        const cleaned =
            String(initials || "")
                .toUpperCase()
                .replace(/[^A-ZÑ]/g, "")
                .slice(0, 3);

        return cleaned.padEnd(3, "-");
    },


    // ===================================================
    // ORDEN DE LAS CLASIFICACIONES
    // ===================================================

    compareScoreRecords(recordA, recordB) {

        if (recordB.score !== recordA.score) {
            return recordB.score - recordA.score;
        }

        return recordA.time - recordB.time;
    },


    compareTimeRecords(recordA, recordB) {

        if (recordA.time !== recordB.time) {
            return recordA.time - recordB.time;
        }

        return recordB.score - recordA.score;
    },


    sortRecords() {

        this.records.scores.sort(
            this.compareScoreRecords
        );

        this.records.times.sort(
            this.compareTimeRecords
        );

        this.records.scores =
            this.records.scores.slice(
                0,
                this.maximumScoreRecords
            );

        this.records.times =
            this.records.times.slice(
                0,
                this.maximumTimeRecords
            );
    }

};


// Inicializar al arrancar el juego.
document.addEventListener(
    "DOMContentLoaded",
    () => RecordManager.init()
);