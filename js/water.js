function clearWater() {

  document.querySelectorAll(".tile").forEach(tileElement => {
    tileElement.classList.remove("water-tile");
  });

}


function updateWaterFlow() {

  clearWater();

  const visited = new Set();
  const pathTiles = [];
  const stack = [];

  for (let row = 0; row < WATERPORT_CONFIG.board.rows; row++) {

    const firstTile = boardTiles[row][0];

    if (firstTile && firstTile.hasConnection("W")) {
      stack.push(firstTile);
    }

  }

  while (stack.length > 0) {

    const tile = stack.pop();
    const key = `${tile.row},${tile.col}`;

    if (visited.has(key)) continue;

    visited.add(key);
    pathTiles.push(tile);

    tile.element.classList.add("water-tile");

    ["N", "E", "S", "W"].forEach(direction => {

      const neighbor = tile.neighbors[direction];

      if (
        tile.canConnectTo(direction) &&
        neighbor &&
        !neighbor.frozen
      ) {
        stack.push(neighbor);
      }

    });

  }

  const newFilled = fillReachedTanks(visited);
  const totalFilled = getFilledTankCount();

  if (newFilled > 0) {

    const tankPoints =
      ScoreManager.getTankPoints(newFilled);

    const rewardPoints =
      collectRewards(pathTiles);

    const clockSeconds =
      collectClock(pathTiles);

    const multiplier =
      collectMultiplier(pathTiles);

    const totalPoints =
      (tankPoints + rewardPoints) * multiplier;

    const totalSeconds =
      clockSeconds * multiplier;

    if (totalPoints > 0) {
      ScoreManager.add(totalPoints);
    }

    if (totalSeconds > 0) {
      TimeManager.addSeconds(totalSeconds);
    }

    const messages = [];

    // Premios recogidos
    if (rewardPoints > 0) {
      messages.push({
        text: `+${rewardPoints}`,
        type: "points",
        duration: 450
      });
    }

    // Tiempo conseguido
    if (clockSeconds > 0) {
      messages.push({
        text: `+${totalSeconds} s`,
        type: "seconds",
        duration: 450
      });
    }

    // Multiplicador conseguido
    if (multiplier > 1) {
      messages.push({
        text: `x${multiplier}`,
        type: "multiplier",
        duration: 450
      });
    }

    // Puntuación total de la jugada
    messages.push({
      text: `${totalPoints} PUNTOS`,
      type: "points",
      duration: 1000
    });

    // Perfect únicamente si se llenan los cinco bidones a la vez
    if (newFilled === 5) {
      messages.push({
        text: "PERFECT",
        type: "perfect",
        duration: 650
      });
    }

    PopupManager.playSequence(
      messages,
      totalFilled === 5
        ? () => completeLevel()
        : null
    );

  } else if (totalFilled === 5) {

    completeLevel();

  }

}


function fillReachedTanks(visited) {

  let newFilled = 0;

  const lastCol =
    WATERPORT_CONFIG.board.cols - 1;

  for (let row = 0; row < WATERPORT_CONFIG.board.rows; row++) {

    const tile = boardTiles[row][lastCol];
    const key = `${tile.row},${tile.col}`;

    const reachesTank =
      visited.has(key) &&
      tile.hasConnection("E");

    if (reachesTank) {

      const tank = tanks[row];

      if (tank && tank.fill()) {
        newFilled++;
      }

    }

  }

  return newFilled;

}


function getFilledTankCount() {

  return tanks.filter(
    tank => tank.isFilled()
  ).length;

}


document.addEventListener(
  "boardCreated",
  updateWaterFlow
);

document.addEventListener(
  "tileRotated",
  updateWaterFlow
);