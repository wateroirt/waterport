// =======================================================
// WaterPort
// Popup Manager
// =======================================================

const PopupManager = {

    popupElement: null,
    hideTimer: null,
    sequenceTimer: null,

    init() {
        this.popupElement =
            document.getElementById("popup-message");
    },

    show(text, type = "normal", duration = 1000) {
        if (!this.popupElement) return;

        const popup = this.popupElement;

        clearTimeout(this.hideTimer);

        popup.className = "";
        popup.textContent = text;
        popup.classList.add(`popup-${type}`);

        void popup.offsetWidth;

        popup.classList.add("popup-visible");

        this.hideTimer = setTimeout(() => {
            popup.classList.remove("popup-visible");
        }, duration);
    },

    playSequence(messages, onFinished = null) {
        clearTimeout(this.sequenceTimer);

        let index = 0;

        const showNext = () => {
            if (index >= messages.length) {
                if (onFinished) {
                    onFinished();
                }

                return;
            }

            const message = messages[index];

            this.show(
                message.text,
                message.type,
                message.duration
            );

            index++;

            this.sequenceTimer = setTimeout(
                showNext,
                message.duration
            );
        };

        showNext();
    },

    points(amount) {
        this.show(
            `${amount} PUNTOS`,
            "points",
            1000
        );
    },

    seconds(amount) {
        this.show(
            `+${amount} s`,
            "seconds",
            700
        );
    },

    multiplier(value) {
        this.show(
            `x${value}`,
            "multiplier",
            700
        );
    },

    perfect() {
        this.show(
            "PERFECT",
            "perfect",
            1000
        );
    },

    levelCompleted() {
        this.show(
            "NIVEL COMPLETADO",
            "level",
            1000
        );
    },

    gameCompleted() {
        this.show(
            "JUEGO COMPLETADO",
            "level",
            1500
        );
    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => PopupManager.init()
);