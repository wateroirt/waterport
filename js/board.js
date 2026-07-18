let boardTiles = [];
let tanks = [];

function createBoard() {
  const board = document.getElementById("board");
  const rows = WATERPORT_CONFIG.board.rows;
  const cols = WATERPORT_CONFIG.board.cols;

  const levelData = generateLevelData(rows, cols);

  const blockedAmount = getRandomBlockedCount();
  const frozenAmount = getRandomFrozenCount();
  const rewards = getRandomRewards();
  const clock = getRandomClock();
  const multiplier = getRandomMultiplier();

  applyBlockedTiles(
    levelData,
    blockedAmount,
    rows,
    cols
  );

  applyFrozenTiles(
    levelData,
    frozenAmount,
    rows,
    cols
  );

  applyRewards(
    levelData,
    rewards,
    rows,
    cols
  );

  applyClock(
    levelData,
    clock,
    rows,
    cols
  );

  applyMultiplier(
    levelData,
    multiplier,
    rows,
    cols
  );

  board.innerHTML = "";
  boardTiles = [];
  tanks = [];

  for (let row = 0; row < rows; row++) {
    boardTiles[row] = [];

    for (let col = 0; col < cols; col++) {
      const tileData = levelData[row][col];

      const tile =
        new Tile(row, col, tileData.type);

      tile.rotation =
        tileData.rotation;

      tile.visualRotation =
        tile.rotation * 90;

      tile.blocked =
        tileData.blocked || false;

      tile.frozen =
        tileData.frozen || false;

      tile.reward =
        tileData.reward || null;

      tile.clock =
        tileData.clock || null;

      tile.multiplier =
        tileData.multiplier || null;

      boardTiles[row][col] = tile;

      const tileElement =
        tile.createElement();

      if (tile.blocked) {
        tileElement.classList.add(
          "blocked-tile"
        );
      }

      if (tile.frozen) {
        tileElement.classList.add(
          "frozen-tile"
        );
      }

      if (tile.reward !== null) {
        addRewardMarker(
          tileElement,
          tile.reward
        );
      }

      if (tile.clock !== null) {
        addClockMarker(
          tileElement,
          tile.clock
        );
      }

      if (tile.multiplier !== null) {
        addMultiplierMarker(
          tileElement,
          tile.multiplier
        );
      }

      board.appendChild(tileElement);
    }
  }

  assignNeighbors();
  createTanks();

  document.dispatchEvent(
    new CustomEvent("boardCreated")
  );
}


// =======================================================
// CASILLAS BLOQUEADAS
// =======================================================

function applyBlockedTiles(
  levelData,
  amount,
  rows,
  cols
) {
  const candidates = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

      /*
       * La última columna del tablero
       * conecta directamente con los depósitos.
       * No puede contener casillas bloqueadas.
       */
      if (col === cols - 1) {
        continue;
      }

      const tileData =
        levelData[row][col];

      if (
        tileDataHasHorizontalContinuity(
          tileData
        )
      ) {
        candidates.push(tileData);
      }
    }
  }

  shuffleArray(candidates);

  const selectedAmount =
    Math.min(
      amount,
      candidates.length
    );

  for (
    let index = 0;
    index < selectedAmount;
    index++
  ) {
    candidates[index].blocked = true;
  }
}


function tileDataHasHorizontalContinuity(
  tileData
) {
  const connections =
    PIPE_CONNECTIONS[
      tileData.type
    ][
      tileData.rotation
    ];

  return (
    connections.includes("W") &&
    connections.includes("E")
  );
}


// =======================================================
// CASILLAS CONGELADAS
// =======================================================

function getRandomFrozenCount() {
  const levelData =
    getCurrentLevelData();

  const minimum =
    levelData.frozen[0];

  const maximum =
    levelData.frozen[1];

  return Math.floor(
    Math.random() *
    (maximum - minimum + 1)
  ) + minimum;
}


function applyFrozenTiles(
  levelData,
  amount,
  rows,
  cols
) {
  if (amount <= 0) return;

  const candidates = [];

  /*
   * Columnas jugables 3 y 4.
   * En JavaScript corresponden
   * a los índices 2 y 3.
   */
  const allowedColumns = [2, 3];

  for (let row = 0; row < rows; row++) {
    allowedColumns.forEach(col => {
      if (col >= cols) return;

      const tileData =
        levelData[row][col];

      if (
        !tileData.blocked &&
        !tileData.frozen &&
        tileData.reward == null &&
        tileData.clock == null &&
        tileData.multiplier == null
      ) {
        candidates.push(tileData);
      }
    });
  }

  shuffleArray(candidates);

  const selectedAmount =
    Math.min(
      amount,
      candidates.length
    );

  for (
    let index = 0;
    index < selectedAmount;
    index++
  ) {
    candidates[index].frozen = true;
  }
}


// =======================================================
// PREMIOS
// =======================================================

function applyRewards(
  levelData,
  rewards,
  rows,
  cols
) {
  const candidates = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileData =
        levelData[row][col];

      if (!tileData.frozen) {
        candidates.push(tileData);
      }
    }
  }

  shuffleArray(candidates);

  const selectedAmount =
    Math.min(
      rewards.length,
      candidates.length
    );

  for (
    let index = 0;
    index < selectedAmount;
    index++
  ) {
    candidates[index].reward =
      rewards[index];
  }
}


function addRewardMarker(
  tileElement,
  rewardValue
) {
  const rewardElement =
    document.createElement("div");

  rewardElement.className =
    "reward-marker";

  rewardElement.textContent =
    `+${rewardValue}`;

  tileElement.appendChild(
    rewardElement
  );
}


// =======================================================
// RELOJ
// =======================================================

function applyClock(
  levelData,
  clock,
  rows,
  cols
) {
  if (clock === null) return;

  const candidates = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileData =
        levelData[row][col];

      if (
        !tileData.frozen &&
        tileData.reward == null &&
        tileData.clock == null &&
        tileData.multiplier == null
      ) {
        candidates.push(tileData);
      }
    }
  }

  if (candidates.length === 0) return;

  shuffleArray(candidates);

  candidates[0].clock = clock;
}


function addClockMarker(
  tileElement,
  clockValue
) {
  const clockElement =
    document.createElement("div");

  clockElement.className =
    "clock-marker";

  clockElement.textContent =
    `⏱ +${clockValue}s`;

  tileElement.appendChild(
    clockElement
  );
}


// =======================================================
// MULTIPLICADOR
// =======================================================

function applyMultiplier(
  levelData,
  multiplier,
  rows,
  cols
) {
  if (multiplier === null) return;

  const candidates = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileData =
        levelData[row][col];

      if (
        !tileData.frozen &&
        tileData.reward == null &&
        tileData.clock == null &&
        tileData.multiplier == null
      ) {
        candidates.push(tileData);
      }
    }
  }

  if (candidates.length === 0) return;

  shuffleArray(candidates);

  candidates[0].multiplier =
    multiplier;
}


function addMultiplierMarker(
  tileElement,
  multiplierValue
) {
  const multiplierElement =
    document.createElement("div");

  multiplierElement.className =
    "multiplier-marker";

  multiplierElement.textContent =
    `x${multiplierValue}`;

  tileElement.appendChild(
    multiplierElement
  );
}


// =======================================================
// UTILIDADES DEL TABLERO
// =======================================================

function shuffleArray(items) {
  for (
    let index = items.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
        (index + 1)
      );

    [
      items[index],
      items[randomIndex]
    ] = [
      items[randomIndex],
      items[index]
    ];
  }

  return items;
}


// =======================================================
// VECINOS
// =======================================================

function assignNeighbors() {
  const rows =
    WATERPORT_CONFIG.board.rows;

  const cols =
    WATERPORT_CONFIG.board.cols;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile =
        boardTiles[row][col];

      tile.neighbors.N =
        row > 0
          ? boardTiles[row - 1][col]
          : null;

      tile.neighbors.E =
        col < cols - 1
          ? boardTiles[row][col + 1]
          : null;

      tile.neighbors.S =
        row < rows - 1
          ? boardTiles[row + 1][col]
          : null;

      tile.neighbors.W =
        col > 0
          ? boardTiles[row][col - 1]
          : null;
    }
  }
}


// =======================================================
// DEPÓSITOS
// =======================================================

function createTanks() {
  const tankColumn =
    document.getElementById(
      "tank-column"
    );

  tankColumn.innerHTML = "";

  for (
    let row = 0;
    row <
      WATERPORT_CONFIG.board.rows;
    row++
  ) {
    const tankElement =
      document.createElement("div");

    tankElement.className =
      "tank-indicator";

    tankElement.dataset.row = row;

    tankColumn.appendChild(
      tankElement
    );

    const tank =
      new Tank(
        row,
        tankElement
      );

    tanks.push(tank);
  }
}