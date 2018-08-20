var overprint = (function (exports) {
  'use strict';

  const Char = {};

  Char.NULL = ' ';
  Char.SPACE = ' ';
  Char.AMPERSAND = '&';
  Char.DOT = '.';
  Char.FULL_STOP = '.';
  Char.PLUS = '+';
  Char.MINUS = '-';
  Char.HASH = '#';
  Char.DOLLAR = '$';
  Char.PERCENT = '%';
  Char.CARET = '^';
  Char.ASTERISK = '*';
  Char.TILDE = '~';
  Char.LEFT_PARENS = '(';
  Char.RIGHT_PARENS = ')';
  Char.LEFT_BRACKET = '[';
  Char.RIGHT_BRACKET = ']';
  Char.AT = '@';

  const Color = {
    BLACK: '#000',
    WHITE: '#fff'
  };

  const Font$1 = function(family, weight, size) {
  	return {
  		family: family || 'monospace',
  		weight: weight || 'normal',
  		size: size || 16,
  		toCSS: function() {
  			return this.weight + ' '+ this.size +'px ' + this.family;
  		}
  	}
  };

  const Glyph = function(character, color, bgColor) {
  	return {
  		char: character || Overprint.Char.NULL,
  		color: color || Overprint.Color.WHITE,
  		bgColor: bgColor || Overprint.Color.BLACK
  	}
  };

  function fillArray2D(width, height, fill) {
    var list = new Array(width);
    for (var col=0; col<width; col++) {
      list[col] = new Array(height);
      for (var row=0; row<height; row++) {
        list[col][row] = fill;
      }
    }
    return list;
  }

  const DisplayState = function(width, height, cell) {
  	this._width = width;
  	this._height = height;
  	this._emptyCell = cell;

  	this._renderedCells = fillArray2D(width, height, cell);
  	this._updatedCells = fillArray2D(width, height, cell);

  	this._dirty = true;
  };

  DisplayState.prototype.setCell = function(x, y, cell) {
  	if (x < 0) return;
  	if (x >= this._width) return;
  	if (y < 0) return;
  	if (y >= this._height) return;

  	if (!cell) cell = this._emptyCell;

  	if (this._renderedCells[x][y] !== cell) {
  		this._updatedCells[x][y] = cell;
  		this._dirty = true;
  	} else {
  		this._updatedCells[x][y] = null;
  	}
  };

  DisplayState.prototype.render = function(callback) {
  	if (!this._dirty) return;

  	for (var col=0; col<this._width; col++) {
  		for (var row=0; row<this._height; row++) {
  			var cell = this._updatedCells[col][row];

  			if (cell == null) continue;

  			callback(col, row, cell);

  			this._renderedCells[col][row] = cell;
  			this._updatedCells[col][row] = null;
  		}
  	}
  };

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
  };

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
  };

  Terminal.prototype.clear = function(glyph) {
  	var bgGlyph = glyph ? glyph : this._emptyCell;
  	for (var col=0; col<this._width; col++) {
  		for (var row=0; row<this._height; row++) {
  			this._display.setCell(col, row, bgGlyph);
  		}
  	}
  };

  Terminal.prototype.fill = function(glyph) {
  	this.clear(glyph);
  };

  Terminal.prototype.writeGlyph = function(x, y, glyph) {
  	this._display.setCell(x, y, glyph);
  };

  Terminal.prototype.writeText = function(x, y, text) {
  	var cursorPosition = 0;
  	var endPosition = this._width - x;

  	while (cursorPosition <= endPosition) {
  		var textGlyph = Glyph(text[cursorPosition]);
  		this._display.setCell(cursorPosition + x, y, textGlyph);
  		cursorPosition++;
  	}
  };

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
  };

  Terminal.prototype.pxToCell = function(ev) {
  	var bounds = this._canvas.getBoundingClientRect();
  	var relativeX = ev.clientX - bounds.left;
  	var relativeY = ev.clientY - bounds.top;
  	var colPos = Math.trunc(relativeX / this._cellWidth * this._ratio);
  	var rowPos = Math.trunc(relativeY / this._cellHeight * this._ratio);
  	return [colPos, rowPos];
  };

  Terminal.prototype.onClick = function(cb) {
  	this._canvas.addEventListener('click', function(ev) {
  		var cell = this.pxToCell(ev);
  		cb(cell[0], cell[1]);
  	}.bind(this));
  };

  Terminal.prototype.onMouseMove = function(cb) {
  	this._canvas.addEventListener('mousemove', function(ev) {
  		var cell = this.pxToCell(ev);
  		cb(cell[0], cell[1]);
  	}.bind(this));
  };

  exports.Char = Char;
  exports.Color = Color;
  exports.Font = Font$1;
  exports.Glyph = Glyph;
  exports.Terminal = Terminal;

  return exports;

}({}));
