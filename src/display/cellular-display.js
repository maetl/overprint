import CanvasDisplay from "./canvas-display.js";
import CellState from "../state/cell-state.js";

const defaultCellularSettings = {
  el: null,
  canvas: null,
  width: 40,
  height: 30,
  cellWidth: 20,
  cellHeight: 20
}

class CellularDisplay extends CanvasDisplay {
  constructor(settings) {
    super(settings);

    // Set up the display state buffer
    this.cells = new CellState(this.width, this.height);
  }

  writeCell(x, y, fill) {
    this.cells.setCell(x, y, fill);
  }

  print() {
    if (!this.cells.isDirty) return;

    for (const cell of this.cells.changed()) {
      this.context.fillStyle = cell.fill;
      this.context.fillRect(
        cell.x * this.cellWidth,
        cell.y * this.cellHeight,
        this.cellWidth,
        this.cellHeight
      );
    }
  }
}

export default CellularDisplay;
