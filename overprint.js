var overprint = (function () {
	'use strict';

	var Overprint = {
		Char: {
			NULL: ' ',
			SPACE: ' '
		},
		Color: {
			BLACK: '#000',
			WHITE: '#fff'
		}
	};

	Overprint.Char.AMPERSAND = '&';
	Overprint.Char.DOT = '.';
	Overprint.Char.FULL_STOP = '.';
	Overprint.Char.PLUS = '+';
	Overprint.Char.MINUS = '-';
	Overprint.Char.HASH = '#';
	Overprint.Char.DOLLAR = '$';
	Overprint.Char.PERCENT = '%';
	Overprint.Char.CARET = '^';
	Overprint.Char.ASTERISK = '*';
	Overprint.Char.TILDE = '~';
	Overprint.Char.LEFT_PARENS = '(';
	Overprint.Char.RIGHT_PARENS = ')';
	Overprint.Char.LEFT_BRACKET = '[';
	Overprint.Char.RIGHT_BRACKET = ']';
	Overprint.Char.AT = '@';

	Overprint.Glyph = function(character, color, bgColor) {
		return {
			char: character || Overprint.Char.NULL,
			color: color || Overprint.Color.WHITE,
			bgColor: bgColor || Overprint.Color.BLACK
		}
	};

	Overprint.Font = function(family, weight, size) {
		return {
			family: family || 'monospace',
			weight: weight || 'normal',
			size: size || 16,
			toCSS: function() {
				return this.weight + ' '+ this.size +'px ' + this.family;
			}
		}
	};

	Overprint.Terminal = function(width, height, canvas, font, isResponsive, forceSquare) {
		this._width = width;
		this._height = height;
		this._canvas = canvas;
		this._font = font || Overprint.Font();
		this._responsive = isResponsive ? true : false;
		this._squared = forceSquare ? true : false;

		this._context = this._canvas.getContext('2d');

		this._ratio = window.devicePixelRatio || 1;

		this._context.font = this._font.toCSS();

		this.resetLayout();

		var cell = this._emptyCell = Overprint.Glyph();
		this._display = new Overprint.DisplayState(width, height, cell);
	};

	Overprint.Terminal.prototype.resetLayout = function() {
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

	Overprint.Terminal.prototype.clear = function(glyph) {
		var bgGlyph = glyph ? glyph : this._emptyCell;
		for (var col=0; col<this._width; col++) {
			for (var row=0; row<this._height; row++) {
				this._display.setCell(col, row, bgGlyph);
			}
		}
	};

	Overprint.Terminal.prototype.fill = function(glyph) {
		this.clear(glyph);
	};

	Overprint.Terminal.prototype.writeGlyph = function(x, y, glyph) {
		this._display.setCell(x, y, glyph);
	};

	Overprint.Terminal.prototype.writeText = function(x, y, text) {
		var cursorPosition = 0;
		var endPosition = this._width - x;

		while (cursorPosition <= endPosition) {
			var textGlyph = Overprint.Glyph(text[cursorPosition]);
			this._display.setCell(cursorPosition + x, y, textGlyph);
			cursorPosition++;
		}
	};

	Overprint.Terminal.prototype.render = function() {
		this._display.render(function(x, y, glyph){
			var cellWidth = this._cellWidth;
			var cellHeight = this._cellHeight;

			this._context.fillStyle = glyph.bgColor;
			this._context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

			if (glyph.char == Overprint.Char.NULL) return;

			this._context.fillStyle = glyph.color;

			var xPos = (x * cellWidth) + cellWidth / 2;
			var yPos = (y * cellHeight) + cellHeight / 2;
			this._context.fillText(glyph.char, xPos, yPos);
		}.bind(this));
	};

	Overprint.Terminal.prototype.pxToCell = function(ev) {
		var bounds = this._canvas.getBoundingClientRect();
		var relativeX = ev.clientX - bounds.left;
		var relativeY = ev.clientY - bounds.top;
		var colPos = Math.trunc(relativeX / this._cellWidth * this._ratio);
		var rowPos = Math.trunc(relativeY / this._cellHeight * this._ratio);
		return [colPos, rowPos];
	};

	Overprint.Terminal.prototype.onClick = function(cb) {
		this._canvas.addEventListener('click', function(ev) {
			var cell = this.pxToCell(ev);
			cb(cell[0], cell[1]);
		}.bind(this));
	};

	Overprint.Terminal.prototype.onMouseMove = function(cb) {
		this._canvas.addEventListener('mousemove', function(ev) {
			var cell = this.pxToCell(ev);
			cb(cell[0], cell[1]);
		}.bind(this));
	};

	Overprint.Hexgrid = function(width, height, canvas) {
		this._width = width;
		this._height = height;
		this._canvas = canvas;

		this._context = this._canvas.getContext('2d');

		this._ratio = window.devicePixelRatio || 1;

		this.resetLayout();

		var cell = this._emptyCell = Overprint.Glyph();
		this._display = new Overprint.DisplayState(width, height, cell);
	};

	Overprint.Hexgrid.prototype.resetLayout = function() {
		if (!this._canvas.style.width) this._canvas.style.width = 640;
		if (!this._canvas.style.height) this._canvas.style.height = 480;

		var elementWidth = parseInt(this._canvas.style.width, 10) * this._ratio;
		var elementHeight = parseInt(this._canvas.style.height, 10) * this._ratio;

		this._canvas.width = elementWidth;
		this._canvas.height = elementHeight;

		// TODO: support a hex grid coordinate system
		//this._cellWidth = elementWidth / this._width / 2;
		//this._cellHeight = elementHeight / this._height / 2;
		this._cellWidth = 16;
		this._cellHeight = 16;
	};

	Overprint.Hexgrid.prototype.writeCell = function(x, y, glyph) {
		this._display.setCell(x, y, glyph);
	};

	Overprint.Hexgrid.prototype.render = function() {
		this._display.render(function(x, y, glyph){
			var cellWidth = this._cellWidth;
			var cellHeight = this._cellHeight;

			var sideLength = (cellWidth > cellHeight) ? cellWidth : cellHeight;

			var widthRadius = sideLength * Math.cos(60 * Math.PI / 180) + sideLength * 0.5;
			var heightRadius = sideLength * Math.sin(60 * Math.PI / 180);
			var halfSize = sideLength * 0.5;

			// See: http://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element

			//this._context.save();
			this._context.fillStyle = glyph.bgColor;

			this._context.imageSmoothingEnabled = true;

			//this._context.lineJoin = 'round';

			this._context.beginPath();

			centerX = x * (sideLength * 0.5 + widthRadius) + widthRadius;
			centerY = y * heightRadius * 2 + heightRadius * (x % 2 ? 2 : 1);

			this._context.moveTo(centerX - halfSize, centerY - heightRadius);
			this._context.lineTo(centerX + halfSize, centerY - heightRadius);
			this._context.lineTo(centerX + widthRadius, centerY);
			this._context.lineTo(centerX + halfSize, centerY + heightRadius);
			this._context.lineTo(centerX - halfSize, centerY + heightRadius);
			this._context.lineTo(centerX - widthRadius, centerY);
			this._context.lineTo(centerX - halfSize, centerY - heightRadius);
			this._context.fill();

			this._context.strokeStyle = '#fff';
			this._context.strokeSize = 0.1;
			this._context.stroke();

			this._context.closePath();
			//this._context.restore();

		}.bind(this));
	};

	Overprint.Hexgrid.prototype.clear = function(glyph) {
		var bgGlyph = glyph ? glyph : Overprint.Glyph();
		for (var col=0; col<this._width; col++) {
			for (var row=0; row<this._height; row++) {
				this._display.setCell(col, row, bgGlyph);
			}
		}
	};

	Overprint.Trigrid = function(width, height, canvas) {
		this._width = width;
		this._height = height;
		this._canvas = canvas;

		this._context = this._canvas.getContext('2d');

		this.resetLayout();

		var cell = this._emptyCell = Overprint.Glyph();
		this._display = new Overprint.DisplayState(width, height, cell);
	};

	Overprint.Trigrid.prototype.resetLayout = function() {
		if (!this._canvas.style.width) this._canvas.style.width = 640;
		if (!this._canvas.style.height) this._canvas.style.height = 480;

		var elementWidth = parseInt(this._canvas.style.width, 10);
		var elementHeight = parseInt(this._canvas.style.height, 10);

		this._canvas.width = elementWidth;
		this._canvas.height = elementHeight;

		this._cellWidth = elementWidth / this._width;
		this._cellHeight = elementHeight / this._height;
	};

	// TODO: +api work out the best value obj structure to pass here instead of glyph
	Overprint.Trigrid.prototype.writeCell = function(x, y, glyph) {
		this._display.setCell(x, y, glyph);
	};

	Overprint.Trigrid.prototype.render = function() {
		this._display.render(function(x, y, glyph){
			var cellWidth = this._cellWidth;
			var cellHeight = this._cellHeight;

			var sideLength = (cellWidth > cellHeight) ? cellWidth : cellHeight;

			var widthRadius = sideLength * Math.cos(60 * Math.PI / 180) + sideLength * 0.5;
			var heightRadius = sideLength * Math.sin(60 * Math.PI / 180);
			var halfSize = sideLength * 0.5;

			// See: http://stackoverflow.com/questions/195262/can-i-turn-off-antialiasing-on-an-html-canvas-element
			this._context.fillStyle = glyph.bgColor;

			this._context.imageSmoothingEnabled = true;

			this._context.beginPath();

			var verticalOrientationUp = (y % 2 === 0) ? true : false;

			// Calculate the tip vertex based on the row orientation
			var tipX = x * sideLength + (verticalOrientationUp ? halfSize : 0);
			var tipY = y * sideLength;

			// Draw a triangle with an up or down orientation
			// TODO: introduce a specialised coordinate system for this type of grid
			if (verticalOrientationUp) {
				this._context.moveTo(tipX, tipY);
				this._context.lineTo(tipX + halfSize, tipY + sideLength);
				this._context.lineTo(tipX - halfSize, tipY + sideLength);
			} else {
				this._context.moveTo(tipX, tipY);
				this._context.lineTo(tipX + sideLength, tipY);
				this._context.lineTo(tipX + halfSize, tipY + sideLength);
			}

			this._context.fill();

			this._context.strokeStyle = '#fff';
			this._context.strokeSize = 0.1;
			this._context.stroke();

			this._context.closePath();
			//this._context.restore();
		}.bind(this));
	};

	Overprint.DisplayState = function(width, height, cell) {
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

		this._width = width;
		this._height = height;
		this._emptyCell = cell;

		this._renderedCells = fillArray2D(width, height, cell);
		this._updatedCells = fillArray2D(width, height, cell);

		this._dirty = true;
	};

	Overprint.DisplayState.prototype.setCell = function(x, y, cell) {
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

	Overprint.DisplayState.prototype.render = function(callback) {
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

	return Overprint;

}());
