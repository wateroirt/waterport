function generateLevelData(rows, cols) {
  let levelData;

  do {
    levelData = createSimpleSolvedLevel(rows, cols);
    scrambleLevel(levelData, rows, cols);
  } while (countInitialFilledTanks(levelData, rows, cols) > 0);

  return levelData;
}

function createSimpleSolvedLevel(rows, cols) {

    const grid = createConnectionGrid(rows, cols);

    buildMainPath(grid, rows, cols);

    debugConnectionGrid(grid);

    const tileBag = createBalancedTileBag(rows, cols);

    return convertGridToLevelData(grid, rows, cols, tileBag);

}

function scrambleLevel(levelData, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      levelData[row][col].rotation = Math.floor(Math.random() * 4);
    }
  }
}

function countInitialFilledTanks(levelData, rows, cols) {
  const visited = new Set();
  const stack = [];

  for (let row = 0; row < rows; row++) {
    if (tileDataHasConnection(levelData[row][0], "W")) {
      stack.push({ row, col: 0 });
    }
  }

  while (stack.length > 0) {
    const current = stack.pop();
    const key = `${current.row},${current.col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    ["N", "E", "S", "W"].forEach(direction => {
      const next = getNextPosition(current.row, current.col, direction);

      if (!isInsideBoard(next.row, next.col, rows, cols)) return;

      const currentTile = levelData[current.row][current.col];
      const nextTile = levelData[next.row][next.col];

      if (
        tileDataHasConnection(currentTile, direction) &&
        tileDataHasConnection(nextTile, OPPOSITE_DIRECTION[direction])
      ) {
        stack.push(next);
      }
    });
  }

  let filled = 0;
  const lastCol = cols - 1;

  for (let row = 0; row < rows; row++) {
    const key = `${row},${lastCol}`;

    if (
      visited.has(key) &&
      tileDataHasConnection(levelData[row][lastCol], "E")
    ) {
      filled++;
    }
  }

  return filled;
}

function tileDataHasConnection(tileData, direction) {
  return PIPE_CONNECTIONS[tileData.type][tileData.rotation].includes(direction);
}

function getNextPosition(row, col, direction) {
  if (direction === "N") return { row: row - 1, col };
  if (direction === "E") return { row, col: col + 1 };
  if (direction === "S") return { row: row + 1, col };
  if (direction === "W") return { row, col: col - 1 };
}

function isInsideBoard(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}
function connectionKeyToTileData(connectionList) {
  const key = connectionList.slice().sort().join(",");

  const map = {
    "E,W": { type: "straight", rotation: 0 },
    "N,S": { type: "straight", rotation: 1 },

    "E,N": { type: "curve", rotation: 0 },
    "E,S": { type: "curve", rotation: 1 },
    "S,W": { type: "curve", rotation: 2 },
    "N,W": { type: "curve", rotation: 3 },

    "E,N,W": { type: "tee", rotation: 0 },
    "E,N,S": { type: "tee", rotation: 1 },
    "E,S,W": { type: "tee", rotation: 2 },
    "N,S,W": { type: "tee", rotation: 3 },

    "E,N,S,W": { type: "cross", rotation: 0 }
  };

  if (!map[key]) {
    console.warn("Combinación de conexiones no reconocida:", key);

    return {
      type: "straight",
      rotation: 0
    };
  }

  return {
    type: map[key].type,
    rotation: map[key].rotation
  };
}
function createConnectionGrid(rows, cols) {
  const grid = [];

  for (let row = 0; row < rows; row++) {
    grid[row] = [];

    for (let col = 0; col < cols; col++) {
      grid[row][col] = [];
    }
  }

  return grid;
}
function addConnection(grid, row, col, direction) {

  if (!grid[row][col].includes(direction)) {
    grid[row][col].push(direction);
  }

}

function createHorizontalPath(grid, row, cols) {

  addConnection(grid, row, 0, "W");

  for (let col = 0; col < cols - 1; col++) {

    addConnection(grid, row, col, "E");
    addConnection(grid, row, col + 1, "W");

  }

  addConnection(grid, row, cols - 1, "E");

}
function debugConnectionGrid(grid) {

    console.log("===== CONNECTION GRID =====");

    for (let row = 0; row < grid.length; row++) {

        let line = "";

        for (let col = 0; col < grid[row].length; col++) {

            const cell = grid[row][col];

            if (cell.length === 0) {
                line += "[   ] ";
            } else {
                line += "[" + cell.join("") + "] ";
            }

        }

        console.log(line);

    }

    console.log("===========================");

}
function convertGridToLevelData(grid, rows, cols, tileBag) {
  const levelData = [];
  let tileIndex = 0;

  for (let row = 0; row < rows; row++) {
    levelData[row] = [];

    for (let col = 0; col < cols; col++) {
      const connections = grid[row][col];
      const type = tileBag[tileIndex];

      const solutionRotation = findBestRotationForType(
        type,
        connections
      );

      levelData[row][col] = {
        type: type,
        solutionRotation: solutionRotation,
        rotation: solutionRotation
      };

      tileIndex++;
    }
  }

  return levelData;
}
function createRowChange(grid, fromRow, toRow, col) {

    if (toRow > fromRow) {

        addConnection(grid, fromRow, col, "S");
        addConnection(grid, toRow, col, "N");

    } else if (toRow < fromRow) {

        addConnection(grid, fromRow, col, "N");
        addConnection(grid, toRow, col, "S");

    }

}
function buildMainPath(grid, rows, cols) {

    // Generator 2.0:
    // cada fila crea su propio caminante.
    // El caminante avanza hacia la derecha,
    // puede subir o bajar,
    // y al final vuelve a su fila original para llenar su bidón.

    for (let row = 0; row < rows; row++) {

        buildWalkerPath(grid, row, rows, cols);

    }

}
function createDetourPath(grid, startRow, detourRow, startCol, endCol, cols) {

    addConnection(grid, startRow, 0, "W");

    // Avanza por la fila inicial hasta la columna donde baja.
    for (let col = 0; col < startCol; col++) {

        addConnection(grid, startRow, col, "E");
        addConnection(grid, startRow, col + 1, "W");

    }

    // Baja o sube a otra fila.
    createRowChange(grid, startRow, detourRow, startCol);

    // Avanza por la fila alternativa.
    for (let col = startCol; col < endCol; col++) {

        addConnection(grid, detourRow, col, "E");
        addConnection(grid, detourRow, col + 1, "W");

    }

    // Vuelve a la fila original.
    createRowChange(grid, detourRow, startRow, endCol);

    // Continúa hasta el bidón.
    for (let col = endCol; col < cols - 1; col++) {

        addConnection(grid, startRow, col, "E");
        addConnection(grid, startRow, col + 1, "W");

    }

    addConnection(grid, startRow, cols - 1, "E");

}
function randomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}
function buildWalkerPath(grid, startRow, rows, cols) {

    let currentRow = startRow;
    let currentCol = 0;

    addConnection(grid, currentRow, currentCol, "W");

    while (currentCol < cols - 1) {

        // Entre medias del tablero, el caminante puede cambiar de fila.
        if (
            currentCol > 0 &&
            currentCol < cols - 2 &&
            Math.random() < 0.35
        ) {

            const nextRow = chooseWalkerNextRow(currentRow, rows);

            connectAdjacentCells(
                grid,
                currentRow,
                currentCol,
                nextRow,
                currentCol
            );

            currentRow = nextRow;

        }

        // Siempre avanza hacia la derecha.
        connectAdjacentCells(
            grid,
            currentRow,
            currentCol,
            currentRow,
            currentCol + 1
        );

        currentCol++;

    }

    // Si terminó en otra fila, vuelve a su fila original
    // antes de salir hacia el bidón.
    while (currentRow !== startRow) {

        const nextRow = currentRow < startRow
            ? currentRow + 1
            : currentRow - 1;

        connectAdjacentCells(
            grid,
            currentRow,
            currentCol,
            nextRow,
            currentCol
        );

        currentRow = nextRow;

    }

    addConnection(grid, startRow, cols - 1, "E");

}

function chooseWalkerNextRow(currentRow, rows) {

    const options = [];

    if (currentRow > 0) {
        options.push(currentRow - 1);
    }

    if (currentRow < rows - 1) {
        options.push(currentRow + 1);
    }

    return options[randomInt(0, options.length - 1)];

}

function connectAdjacentCells(grid, rowA, colA, rowB, colB) {

    if (rowA === rowB && colB === colA + 1) {
        addConnection(grid, rowA, colA, "E");
        addConnection(grid, rowB, colB, "W");
    }

    if (rowA === rowB && colB === colA - 1) {
        addConnection(grid, rowA, colA, "W");
        addConnection(grid, rowB, colB, "E");
    }

    if (colA === colB && rowB === rowA + 1) {
        addConnection(grid, rowA, colA, "S");
        addConnection(grid, rowB, colB, "N");
    }

    if (colA === colB && rowB === rowA - 1) {
        addConnection(grid, rowA, colA, "N");
        addConnection(grid, rowB, colB, "S");
    }

}
function createBalancedTileBag(rows, cols) {

  const totalTiles = rows * cols;

  if (totalTiles !== 30) {
    console.warn(
      "La composición equilibrada está diseñada para tableros de 30 casillas."
    );
  }

  const tileBag = [
    ...Array(7).fill("straight"),
    ...Array(9).fill("curve"),
    ...Array(7).fill("tee"),
    ...Array(7).fill("cross")
  ];

  shuffleArray(tileBag);

  return tileBag;

}

function shuffleArray(array) {

  for (let index = array.length - 1; index > 0; index--) {

    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    const temporaryValue = array[index];

    array[index] = array[randomIndex];
    array[randomIndex] = temporaryValue;

  }

}

function findBestRotationForType(type, requiredConnections) {

  const possibleRotations = PIPE_CONNECTIONS[type];

  let bestScore = -Infinity;
  let bestRotations = [];

  for (
    let rotation = 0;
    rotation < possibleRotations.length;
    rotation++
  ) {

    const tileConnections = possibleRotations[rotation];

    let matchedConnections = 0;
    let missingConnections = 0;
    let extraConnections = 0;

    requiredConnections.forEach(direction => {

      if (tileConnections.includes(direction)) {
        matchedConnections++;
      } else {
        missingConnections++;
      }

    });

    tileConnections.forEach(direction => {

      if (!requiredConnections.includes(direction)) {
        extraConnections++;
      }

    });

    const score =
      matchedConnections * 10 -
      missingConnections * 10 -
      extraConnections;

    if (score > bestScore) {

      bestScore = score;
      bestRotations = [rotation];

    } else if (score === bestScore) {

      bestRotations.push(rotation);

    }

  }

  return bestRotations[
    Math.floor(Math.random() * bestRotations.length)
  ];

}