class CellState {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.writeBuffer = Array(width * height).fill(null);
    this.printBuffer = Array(width * height).fill(null);
    this.isDirty = true;
  }

  get size() {
    return this.width * this.height;
  }

  withinBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  setCell(x, y, cell) {
    if (!this.withinBounds(x, y)) return;

    const index = x + this.width * y;

    if (this.printBuffer[index] !== cell) {
      this.writeBuffer[index] = cell;
      this.isDirty = true;
    } else {
      this.printBuffer[index] = null;
    }
  }

  *changed() {
    if (!this.isDirty) return;

    for (let y=0; y < this.height; y++) {
      for (let x=0; x < this.width; x++) {
        const index = x + this.width * y;
        if (this.writeBuffer[index] == null) continue;
        yield { x, y, fill: this.writeBuffer[index] }
        this.printBuffer[index] = this.writeBuffer[index];
        this.writeBuffer[index] = null;
      }
    }

    this.isDirty = false;
  }
}

export default CellState;
