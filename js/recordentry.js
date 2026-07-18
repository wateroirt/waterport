// =======================================================
// WaterPort
// Entrada de iniciales
// =======================================================

const RecordEntry = {

    overlayElement: null,
    inputElement: null,
    saveButtonElement: null,

    pendingScore: 0,
    pendingTime: 0,
    pendingGameCompleted: false,

    init() {

        this.overlayElement =
            document.getElementById("record-entry");

        this.inputElement =
            document.getElementById("record-initials");

        this.saveButtonElement =
            document.getElementById("record-save-button");

        if (
            !this.overlayElement ||
            !this.inputElement ||
            !this.saveButtonElement
        ) {
            return;
        }

        this.saveButtonElement.addEventListener(
            "click",
            () => this.confirm()
        );

        this.inputElement.addEventListener(
            "input",
            () => {

                this.inputElement.value =
                    this.inputElement.value
                        .toUpperCase()
                        .replace(/[^A-ZÑ]/g, "")
                        .slice(0, 3);

            }
        );

        this.inputElement.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {
                    this.confirm();
                }

            }
        );

    },

    open(score, time, gameCompleted) {

        if (!this.overlayElement) return;

        this.pendingScore = score;
        this.pendingTime = time;
        this.pendingGameCompleted = gameCompleted;

        GameState.set(
            GameState.ENTERING_RECORD
        );

        this.inputElement.value = "";

        this.overlayElement.classList.add(
            "record-entry-visible"
        );

        setTimeout(() => {
            this.inputElement.focus();
        }, 100);

    },

    confirm() {

        const initials =
            this.inputElement.value.trim();

        if (initials.length === 0) {
            this.inputElement.focus();
            return;
        }

        RecordManager.addRecord(
            initials,
            this.pendingScore,
            this.pendingTime,
            this.pendingGameCompleted
        );

        this.close();

        GameState.set(
            GameState.WAITING_RESTART
        );

        PopupManager.show(
            "RÉCORD GUARDADO",
            "level",
            1200
        );

    },

    close() {

        if (!this.overlayElement) return;

        this.overlayElement.classList.remove(
            "record-entry-visible"
        );

        this.inputElement.blur();

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => RecordEntry.init()
);