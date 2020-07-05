import CellState from "./cell-state.js";

const defaultSettings = {
  el: null,
  canvas: null,
  width: 40,
  height: 30,
  cellWidth: 20,
  cellHeight: 20
}

class CellularGrid {
  constructor(settings) {
    const config = { ...defaultSettings, ...settings };

    // Length of cells along the X axis
    this.width = config.width;

    // Length of cells along the Y axis
    this.height = config.height;

    // Device pixel ratio. Values above 1 indicate a high DPI display
    this.pixelRatio = window.devicePixelRatio || 1;

    // DOM element representing the underlying canvas to draw to
    this.canvas = config.canvas ? config.canvas : document.createElement("canvas");

    // Dom element representing the element to attach the canvas to.
    if (config.el) {
      config.el.appendChild(this.canvas);
    } else {
      // Attach to body if the canvas was internally generated. If it was passed
      // in assume that it will be handled outside this component.
      if (!config.canvas) {
        document.body.appendChild(this.canvas);
      }
    }

    // Screen pixels
    const screenCellWidth = config.cellWidth;
    const screenCellHeight = config.cellHeight;

    // Width of each cell in device pixels
    this.cellWidth = screenCellWidth * this.pixelRatio;

    // Height of each cell in device pixels
    this.cellHeight = screenCellHeight * this.pixelRatio;

    // Set dimensions of canvas to device pixels
    this.canvas.width = screenCellWidth * this.width * this.pixelRatio;
    this.canvas.height = screenCellHeight * this.height * this.pixelRatio;

    // Set dimensions of DOM element to screen pixels
    this.canvas.style.width = `${screenCellWidth * this.width}px`;
    this.canvas.style.height = `${screenCellHeight * this.height}px`;

    // Set up the drawing context
    this.context = this.canvas.getContext('2d');

    // Set up the rendering buffer
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

export default CellularGrid;
