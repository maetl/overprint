import Glyph from './glyph'
import DisplayState from './display-state'

const Terminal = function(width, height, canvas, font, isResponsive, forceSquare) {
	this._width = width;
	this._height = height;
	this._canvas = canvas;
	this._font = font || Font();
	this._responsive = isResponsive ? true : false;
	this._squared = forceSquare ? true : false;

	this._context = this._canvas.getContext('2d');

	this._ratio = window.devicePixelRatio || 1;

	this._context.font = this._font.toCSS();

	this.resetLayout();

	var cell = this._emptyCell = Glyph();
	this._display = new DisplayState(width, height, cell);
}

Terminal.prototype.resetLayout = function() {
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

Terminal.prototype.clear = function(glyph) {
	var bgGlyph = glyph ? glyph : this._emptyCell;
	for (var col=0; col<this._width; col++) {
		for (var row=0; row<this._height; row++) {
			this._display.setCell(col, row, bgGlyph);
		}
	}
}

Terminal.prototype.fill = function(glyph) {
	this.clear(glyph);
}

Terminal.prototype.writeGlyph = function(x, y, glyph) {
	this._display.setCell(x, y, glyph);
}

Terminal.prototype.writeText = function(x, y, text) {
	var cursorPosition = 0;
	var endPosition = this._width - x;

	while (cursorPosition <= endPosition) {
		var textGlyph = Glyph(text[cursorPosition]);
		this._display.setCell(cursorPosition + x, y, textGlyph);
		cursorPosition++;
	}
}

Terminal.prototype.render = function() {
	this._display.render(function(x, y, glyph){
		var cellWidth = this._cellWidth;
		var cellHeight = this._cellHeight;

		this._context.fillStyle = glyph.bgColor;
		this._context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

		if (glyph.char == Char.NULL) return;

		this._context.fillStyle = glyph.color;

		var xPos = (x * cellWidth) + cellWidth / 2;
		var yPos = (y * cellHeight) + cellHeight / 2;
		this._context.fillText(glyph.char, xPos, yPos);
	}.bind(this));
}

export default Terminal;
