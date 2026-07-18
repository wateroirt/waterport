// =======================================================
// WaterPort
// Game State
// =======================================================

const GameState = {

    PLAYING: "playing",
    GAME_OVER: "game_over",
    ENTERING_RECORD: "entering_record",
    WAITING_RESTART: "waiting_restart",

    current: "playing",

    set(state) {

        this.current = state;

    },

    is(state) {

        return this.current === state;

    }

};