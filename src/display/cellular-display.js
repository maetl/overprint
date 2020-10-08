import CanvasDisplay from "./canvas-display.js";
import CellState from "../state/cell-state.js";

const defaultCellularSettings = {
  el: null,
  canvas: null,
  width: 40,
  height: 30,
  cellWidth: 20,
  cellHeight: 20,
  cellMode: "rect"
}

class CellularDisplay extends CanvasDisplay {
  constructor(settings) {
    super(settings);

    // Defines the type of shape that represents each cell
    //this.cellMode = settings.cellMode;
    this.cellMode = "rect";

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

      switch(this.cellMode) {
        case "rect":
          this.context.fillRect(
            cell.x * this.cellWidth,
            cell.y * this.cellHeight,
            this.cellWidth,
            this.cellHeight
          );
          break;

        case "dot":
          const cx = (cell.x * this.cellWidth) + this.cellWidth / 2;
          const cy = (cell.y * this.cellHeight) + this.cellHeight / 2;

          this.context.beginPath();

          this.context.ellipse(
            cx,
            cy,
            this.cellWidth / 2,
            this.cellHeight / 2,
            0,
            0,
            2 * Math.PI
          );

          this.context.closePath();

          this.context.fill();

          // this.context.fillRect(
          //   cell.x * this.cellWidth + cx,
          //   cell.y * this.cellHeight + cy,
          //   this.cellWidth,
          //   this.cellHeight
          // );
          break;
      }
    }
  }
}

export default CellularDisplay;
