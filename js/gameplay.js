// =======================================================
// WaterPort
// Gameplay
// =======================================================


// =======================================================
// PREMIOS
// =======================================================

function collectRewards(pathTiles) {

    let totalReward = 0;

    pathTiles.forEach(tile => {

        if (tile.reward !== null) {

            totalReward += tile.reward;

            tile.reward = null;

            removeRewardMarker(tile);

        }

    });

    return totalReward;

}


// =======================================================
// RELOJES
// =======================================================

function collectClock(pathTiles) {

    let totalSeconds = 0;

    pathTiles.forEach(tile => {

        if (tile.clock !== null) {

            totalSeconds += tile.clock;

            tile.clock = null;

            removeClockMarker(tile);

        }

    });

    return totalSeconds;

}


// =======================================================
// MULTIPLICADORES
// =======================================================

function collectMultiplier(pathTiles) {

    let multiplier = 1;

    pathTiles.forEach(tile => {

        if (tile.multiplier !== null) {

            multiplier = tile.multiplier;

            tile.multiplier = null;

            removeMultiplierMarker(tile);

        }

    });

    return multiplier;

}


// =======================================================
// VISUAL
// =======================================================

function removeRewardMarker(tile) {

    if (!tile.element) return;

    const marker =
        tile.element.querySelector(".reward-marker");

    if (marker) {
        marker.remove();
    }

}


function removeClockMarker(tile) {

    if (!tile.element) return;

    const marker =
        tile.element.querySelector(".clock-marker");

    if (marker) {
        marker.remove();
    }

}


function removeMultiplierMarker(tile) {

    if (!tile.element) return;

    const marker =
        tile.element.querySelector(".multiplier-marker");

    if (marker) {
        marker.remove();
    }

}