const DIRECTIONS = {
  NORTH: "N",
  EAST: "E",
  SOUTH: "S",
  WEST: "W"
};

const OPPOSITE_DIRECTION = {
  N: "S",
  E: "W",
  S: "N",
  W: "E"
};

const PIPE_CONNECTIONS = {
  straight: [
    ["W", "E"],
    ["N", "S"],
    ["W", "E"],
    ["N", "S"]
  ],
  curve: [
    ["N", "E"],
    ["E", "S"],
    ["S", "W"],
    ["W", "N"]
  ],
  tee: [
    ["N", "E", "W"],
    ["N", "E", "S"],
    ["E", "S", "W"],
    ["N", "S", "W"]
  ],
  cross: [
    ["N", "E", "S", "W"],
    ["N", "E", "S", "W"],
    ["N", "E", "S", "W"],
    ["N", "E", "S", "W"]
  ]
};

class Tile {
  constructor(row, col, type = "straight") {
    this.row = row;
    this.col = col;
    this.type = type;

    this.rotation = 0;
    this.visualRotation = 0;
    this.blocked = false;
this.frozen = false;
this.reward = null;
this.clock = null;
this.multiplier = null;

    this.neighbors = { N: null, E: null, S: null, W: null };

    this.element = null;
    this.pipeElement = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.className = "tile";
    this.element.dataset.row = this.row;
    this.element.dataset.col = this.col;

    this.pipeElement = document.createElement("div");
    this.pipeElement.className = `pipe ${this.type}`;

    this.element.appendChild(this.pipeElement);

    this.element.addEventListener("click", () => {
      this.rotateRight();

      document.dispatchEvent(new CustomEvent("tileRotated", {
        detail: { tile: this }
      }));
    });

    this.updateVisual();
    return this.element;
  }

  rotateRight() {
    if (!GameState.is(GameState.PLAYING)) {
    return;
}
  if (this.locked || this.blocked || this.frozen) return;

  this.rotation = (this.rotation + 1) % 4;
  this.visualRotation += 90;
  this.updateVisual();
}

  getConnections() {
    return PIPE_CONNECTIONS[this.type][this.rotation];
  }

  hasConnection(direction) {
    return this.getConnections().includes(direction);
  }

  canConnectTo(direction) {
    const neighbor = this.neighbors[direction];
    if (!neighbor) return false;

    const opposite = OPPOSITE_DIRECTION[direction];

    return this.hasConnection(direction) && neighbor.hasConnection(opposite);
  }

  updateVisual() {
    this.pipeElement.style.transform = `rotate(${this.visualRotation}deg)`;
  }
}