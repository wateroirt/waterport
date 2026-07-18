class Tank {
  constructor(row, element) {
    this.row = row;
    this.element = element;
    this.filled = false;
  }

  fill() {
    if (this.filled) return false;

    this.filled = true;
    this.element.classList.add("tank-filled");

    return true;
  }

  reset() {
    this.filled = false;
    this.element.classList.remove("tank-filled");
  }

  isFilled() {
    return this.filled;
  }
}