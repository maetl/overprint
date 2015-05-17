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

Overprint.Glyph = function(character, color, bgColor) {
	return {
		char: character || Overprint.Char.NULL,
		color: color || Overprint.Color.WHITE,
		bgColor: bgColor || Overprint.Color.BLACK
	}
}

Overprint.Font = function(family, weight, size) {
	return {
		family: family,
		weight: weight,
		size: size,
		toCSS: function() {
			return this.weight + ' '+ this.size +'px ' + this.family;
		}
	}
}

Overprint.Terminal = function(width, height, canvas, font) {
	this._width = width;
	this._height = height;
	this._canvas = canvas;
	this._font = font || Overprint.Font('inconsolata', 'normal');

	this._context = this._canvas.getContext('2d');

	this.resize();

	var cell = this._emptyCell = Overprint.Glyph();
	this._display = new Overprint.DisplayState(width, height, cell);
}

Overprint.Terminal.prototype.resize = function() {
	if (!this._canvas.style.width) this._canvas.style.width = 640;
	if (!this._canvas.style.height) this._canvas.style.height = 480;

	var elementWidth = parseInt(this._canvas.style.width, 10);
	var elementHeight = parseInt(this._canvas.style.height, 10);

	this._canvas.width = elementWidth;
	this._canvas.height = elementHeight;

	this._cellWidth = Math.floor(elementWidth / this._width);
	this._cellHeight = Math.floor(elementHeight / this._height);

	this._font.size = this._cellWidth;

	this._context.font = this._font.toCSS();
	this._context.textAlign = 'center';
	this._context.textBaseline = 'middle';
}

Overprint.Terminal.prototype.clear = function(glyph) {
	var bgGlyph = glyph ? glyph : Overprint.Glyph();
	for (var col=0; col<this._width; col++) {
		for (var row=0; row<this._height; row++) {
			this._display.setCell(col, row, bgGlyph);
		}
	}
}

Overprint.Terminal.prototype.writeGlyph = function(x, y, glyph) {
	this._display.setCell(x, y, glyph);
}

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
}

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
}

Overprint.DisplayState.prototype.setCell = function(x, y, cell) {
	if (x < 0) return;
	if (x >= this._width) return;
	if (y < 0) return;
	if (y >= this._height) return;

	if (!cell) cell = this._emptyCell;

	if (this._renderedCells[x][y] !== cell) {
		this._updatedCells[x][y] = cell;
	} else {
		this._updatedCells[x][y] = null;
	}
}

Overprint.DisplayState.prototype.render = function(callback) {
	for (var col=0; col<this._width; col++) {
		for (var row=0; row<this._height; row++) {
			var cell = this._updatedCells[col][row];

			if (cell == null) continue;

			callback(col, row, cell);

			this._renderedCells[col][row] = cell;
			this._updatedCells[col][row] = null;
		}
	}
}
