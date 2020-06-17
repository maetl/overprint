import Glyph from './glyph'
import Char from './char'
import CodePage from './code-page'
import DisplayState from './display-state'

const BitmapTerminal = function(width, height, canvas, atlas, tileWidth, tileHeight) {
	this._atlas = atlas;
	this._width = width;
	this._height = height;
	this._canvas = canvas;
	this._tileWidth = tileWidth;
	this._tileHeight = tileHeight;
	this._context = this._canvas.getContext('2d');
	this._ratio = window.devicePixelRatio || 1;
	this.resetLayout();
	var cell = this._emptyCell = Glyph();
	this._display = new DisplayState(width, height, cell);
}

BitmapTerminal.prototype.resetLayout = function() {
	var glyphWidth = this._tileWidth;
	var glyphHeight = this._tileHeight;

	this._cellWidth = glyphWidth * this._ratio;
	this._cellHeight = glyphHeight * this._ratio;

	var drawWidth = glyphWidth * this._width;
	var drawHeight = glyphHeight * this._height;

	this._canvas.width = drawWidth * this._ratio;
	this._canvas.height = drawHeight * this._ratio;

	this._canvas.style.width = drawWidth;
	this._canvas.style.height = drawHeight;
}

BitmapTerminal.prototype.writeGlyph = function(x, y, glyph) {
	this._display.setCell(x, y, glyph);
}

BitmapTerminal.prototype.render = function() {
	this._display.render(function(x, y, glyph){

		this._context.fillStyle = glyph.bgColor;
		this._context.fillRect(
			Math.round(x * this._tileWidth),
			Math.round(y * this._tileHeight),
			this._tileWidth,
			this._tileHeight
		);

		if (glyph.char == Char.NULL) return;

    var codePoint = CodePage[glyph.char] || glyph.char;
    var glyphX = codePoint % this._atlas.rowLength;
    var glyphY = Math.trunc(codePoint / this._atlas.rowLength);

		this._context.drawImage(
			this._atlas.image,
			glyphX * this._atlas.width * this._ratio,
			glyphY * this._atlas.height * this._ratio,
			this._atlas.width * this._ratio,
			this._atlas.height * this._ratio,
			Math.round(x * this._tileWidth),
			Math.round(y * this._tileHeight),
			this._tileWidth,
			this._tileHeight
		);
	}.bind(this));
}

export default BitmapTerminal;
