// =======================================================
// WaterPort
// Vista de récords
// =======================================================

const RecordsView = {

    overlayElement: null,
    scoreListElement: null,
    timeListElement: null,
    closeButtonElement: null,
    deleteButtonElement: null,
    confirmationElement: null,
    confirmYesElement: null,
    confirmNoElement: null,

    previousState: null,


    init() {

        this.overlayElement =
            document.getElementById("records-window");

        this.scoreListElement =
            document.getElementById("score-records-list");

        this.timeListElement =
            document.getElementById("time-records-list");

        this.closeButtonElement =
            document.getElementById("records-close-button");

        this.deleteButtonElement =
            document.getElementById("records-delete-button");

        this.confirmationElement =
            document.getElementById("records-confirmation");

        this.confirmYesElement =
            document.getElementById("records-confirm-yes");

        this.confirmNoElement =
            document.getElementById("records-confirm-no");

        const recordsButton =
            document.getElementById("records-button");

        if (
            !this.overlayElement ||
            !this.scoreListElement ||
            !this.timeListElement ||
            !this.closeButtonElement ||
            !this.deleteButtonElement ||
            !this.confirmationElement ||
            !this.confirmYesElement ||
            !this.confirmNoElement ||
            !recordsButton
        ) {
            return;
        }

        recordsButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.open();

            }
        );

        this.closeButtonElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.close();

            }
        );

        this.deleteButtonElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.showDeleteConfirmation();

            }
        );

        this.confirmNoElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();
                this.hideDeleteConfirmation();

            }
        );

        this.confirmYesElement.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                RecordManager.clearRecords();

                this.hideDeleteConfirmation();
                this.render();

            }
        );

        this.overlayElement.addEventListener(
            "click",
            event => {

                if (event.target === this.overlayElement) {
                    this.close();
                }

            }
        );
    },


    open() {

        if (!this.overlayElement) return;

        this.previousState =
            GameState.current;

        GameState.set(
            GameState.ENTERING_RECORD
        );

        this.hideDeleteConfirmation();
        this.render();

        this.overlayElement.classList.add(
            "records-window-visible"
        );
    },


    close() {

        if (!this.overlayElement) return;

        this.hideDeleteConfirmation();

        this.overlayElement.classList.remove(
            "records-window-visible"
        );

        GameState.set(
            this.previousState ||
            GameState.PLAYING
        );
    },


    showDeleteConfirmation() {

        this.confirmationElement.classList.add(
            "records-confirmation-visible"
        );
    },


    hideDeleteConfirmation() {

        this.confirmationElement.classList.remove(
            "records-confirmation-visible"
        );
    },


    render() {

        this.renderScoreRecords();
        this.renderTimeRecords();
    },


    renderScoreRecords() {

        this.scoreListElement.innerHTML = "";

        const records =
            RecordManager.records.scores;

        if (records.length === 0) {

            this.scoreListElement.innerHTML =
                '<div class="records-empty">SIN RÉCORDS</div>';

            return;
        }

        records.forEach((record, index) => {

            const row =
                this.createRecordRow(
                    index,
                    record.initials,
                    `${record.score} PUNTOS`,
                    this.formatTime(record.time)
                );

            this.scoreListElement.appendChild(row);
        });
    },


    renderTimeRecords() {

        this.timeListElement.innerHTML = "";

        const records =
            RecordManager.records.times;

        if (records.length === 0) {

            this.timeListElement.innerHTML =
                '<div class="records-empty">SIN RÉCORDS</div>';

            return;
        }

        records.forEach((record, index) => {

            const row =
                this.createRecordRow(
                    index,
                    record.initials,
                    this.formatTime(record.time),
                    `${record.score} PUNTOS`
                );

            this.timeListElement.appendChild(row);
        });
    },


    createRecordRow(
        index,
        initials,
        mainValue,
        secondaryValue
    ) {

        const row =
            document.createElement("div");

        row.className = "record-row";

        if (index === 0) {
            row.classList.add("record-first");
        }

        row.innerHTML = `
            <span class="record-position">${index + 1}º</span>
            <span class="record-initials">${initials}</span>
            <span class="record-main">${mainValue}</span>
            <span class="record-secondary">${secondaryValue}</span>
        `;

        return row;
    },


    formatTime(totalSeconds) {

        const minutes =
            Math.floor(totalSeconds / 60);

        const seconds =
            totalSeconds % 60;

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => RecordsView.init()
);