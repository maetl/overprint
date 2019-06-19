import Char from "./char";
import Font from "./font";
import Glyph from "./glyph";
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

    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');
  	this._context.font = this._font.toCSS();

    this._ratio = window.devicePixelRatio || 1;

    this.resetLayout();

    this._display = new DisplayState(this._width, this._height, this._emptyCell);
  }

  resetLayout() {
    if (this._responsive) {
  		// Calculates the dimensions of the containing element first
  		if (!this._canvas.style.width) this._canvas.style.width = 640;
  		if (!this._canvas.style.height) this._canvas.style.height = 480;

  		var elementWidth = parseInt(this._canvas.style.width, 10)  * this._ratio;
  		var elementHeight = parseInt(this._canvas.style.height, 10) * this._ratio;

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
  		var textMeasure = this._context.measureText("M");

  		// Canvas measure text with direct multiple of font size
  		var textWidth = Math.ceil(textMeasure.width);
  		var textHeight = this._font.size;

  		// Force square aspect ratio
  		if (this._squared) {
  			textWidth = textHeight = Math.max(textWidth, textHeight);
  		}

  		var glyphWidth = textWidth;
  		var glyphHeight = textHeight;

  		this._cellWidth = glyphWidth * this._ratio;
  		this._cellHeight = glyphHeight * this._ratio;

  		var drawWidth = glyphWidth * this._width;
  		var drawHeight = glyphHeight * this._height;

  		this._canvas.width = drawWidth * this._ratio;
  		this._canvas.height = drawHeight * this._ratio;

  		this._canvas.style.width = drawWidth;
  		this._canvas.style.height = drawHeight;
  	}

  	this._font.size = this._font.size * this._ratio;
  	this._context.font = this._font.toCSS();
  	this._context.textAlign = 'center';
  	this._context.textBaseline = 'middle';
  }

  clear() {
    this.fill(this._emptyCell);
  }

  fill(cell) {
    for (var col=0; col<this._width; col++) {
      for (var row=0; row<this._height; row++) {
        this._display.setCell(col, row, cell);
      }
    }
  }

  writeCell(x, y, cell) {
    this._display.setCell(x, y, cell);
  }

  writeCharacter(x, y, character) {
    this._display.setCharacter(x, y, character);
  }

  render() {
    this._display.render((x, y, cell) => {
      var cellWidth = this._cellWidth;
      var cellHeight = this._cellHeight;

      this._context.fillStyle = cell.backgroundColor;
      this._context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

      if (cell.character == Char.NULL) return;

      this._context.fillStyle = cell.foregroundColor;

      var xPos = (x * cellWidth) + cellWidth / 2;
      var yPos = (y * cellHeight) + cellHeight / 2;
      this._context.fillText(cell.character, xPos, yPos);
    });
  }
}

export default TextGrid;
