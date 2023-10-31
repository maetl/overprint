import Char from "./char";
import Font from "./font";
import Cell from "./cell";
import DisplayState from "./display-state";

const defaultSettings = {
  width: 40,
  height: 30,
  font: Font(),
  emptyCell: Cell(),
  isResponsive: false,
  forceSquare: true
}

class TextGrid {
  constructor(canvas, settings) {
    const _settings = Object.assign(defaultSettings, { ...settings });
    this._width = _settings.width;
  	this._height = _settings.height;
  	this._font = _settings.font;
  	this._responsive = _settings.isResponsive;
  	this._squared = _settings.forceSquare;
    this._emptyCell = _settings.emptyCell;

    this._glyphCache = new Map();

    this._canvas = canvas;
    this._context = this._canvas.getContext('2d', { willReadFrequently: true });
  	this._context.font = this._font.toCSS();

    this._ratio = window.devicePixelRatio || 1;
    this._display = new DisplayState(this._width, this._height);

    this.resetLayout();
    this.clear();
  }

  resetLayout() {
    if (this._responsive) {
  		// Calculates the dimensions of the containing element first
  		if (!this._canvas.style.width) this._canvas.style.width = 640;
  		if (!this._canvas.style.height) this._canvas.style.height = 480;

  		const elementWidth = parseInt(this._canvas.style.width, 10)  * this._ratio;
  		const elementHeight = parseInt(this._canvas.style.height, 10) * this._ratio;

  		// Calculates cell width and height based on the containing element
  		this._cellWidth = Math.floor(elementWidth / this._width);
  		this._cellHeight = Math.floor(elementHeight / this._height);

  		// Force square aspect ratio
  		if (this._squared) {
  			this._cellWidth = this._cellHeight = Math.max(this._cellWidth, this._cellHeight);
  		}

  		this._canvas.width = elementWidth;
  		this._canvas.height = elementHeight;

  	} else {
  		// Measure text width from canvas context
  		const textMeasure = this._context.measureText("M");

  		// Canvas measure text with direct multiple of font size
  		let textWidth = Math.ceil(textMeasure.width);
  		let textHeight = this._font.size;

  		// Force square aspect ratio
  		if (this._squared) {
  			textWidth = textHeight = Math.max(textWidth, textHeight);
  		}

  		this._cellWidth = Math.ceil(textWidth * this._ratio);
  		this._cellHeight = Math.ceil(textHeight * this._ratio);

  		const drawWidth = textWidth * this._width;
  		const drawHeight = textHeight * this._height;

  		this._canvas.width = drawWidth * this._ratio;
  		this._canvas.height = drawHeight * this._ratio;

      this._canvas.style.width = `${drawWidth}px`;
  		this._canvas.style.height = `${drawHeight}px`;
  	}

  	this._font.size = this._font.size * this._ratio;
  	this._context.font = this._font.toCSS();
  	this._context.textAlign = 'center';
  	this._context.textBaseline = 'middle';

    this._cellCache = new Map();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  clear() {
    this.fill(this._emptyCell);
  }

  fill(cell) {
    for (let col=0; col<this._width; col++) {
      for (let row=0; row<this._height; row++) {
        this._display.setCell(col, row, cell);
      }
    }
  }

  readCell(x, y) {
    return this._display.getCell(x, y);
  }

  writeCell(x, y, cell) {
    this._display.setCell(x, y, cell);
  }

  writeCharacter(x, y, character) {
    this._display.setCharacter(x, y, character);
  }

  render() {
    this._display.render((x, y, cell) => {
      const cellWidth = this._cellWidth;
      const cellHeight = this._cellHeight;
      const blitKey = `${cell.character};${cell.foregroundColor};${cell.backgroundColor}`;

      if (this._cellCache.has(blitKey)) {
        this._context.putImageData(this._cellCache.get(blitKey), x * cellWidth, y * cellHeight);
      } else {
        this._context.fillStyle = cell.backgroundColor;
        this._context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

        if (cell.character == Char.NULL) return;

        this._context.fillStyle = cell.foregroundColor;

        const xPos = (x * cellWidth) + cellWidth / 2;
        const yPos = (y * cellHeight) + cellHeight / 2;
        this._context.fillText(cell.character, Math.round(xPos), Math.round(yPos));

        const blitCell = this._context.getImageData(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        this._cellCache.set(blitKey, blitCell);
      }
    });
  }

  pxToCell(ev) {
  	const bounds = this._canvas.getBoundingClientRect();
  	const relativeX = ev.clientX - bounds.left;
  	const relativeY = ev.clientY - bounds.top;
  	const colPos = Math.trunc(relativeX / this._cellWidth * this._ratio);
  	const rowPos = Math.trunc(relativeY / this._cellHeight * this._ratio);
  	return [colPos, rowPos];
  }

  onClick(handler) {
    this._canvas.addEventListener('click', (ev) => {
      const cell = this.pxToCell(ev);
      handler(cell[0], cell[1]);
    });
  }

  onMouseMove(handler) {
    this._canvas.addEventListener('mousemove', (ev) => {
      const cell = this.pxToCell(ev);
      handler(cell[0], cell[1]);
    });
  }
}

export default TextGrid;
