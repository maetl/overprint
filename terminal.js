var Overprint = {
	Char: {
		NULL: ' ',
		SPACE: ' '	
	},
	Color: {
		BLACK: '#000',
		WHITE: '#fff'
	},
	Cell: {
		WIDTH: 14,
		HEIGHT: 14
	}
};

Overprint.Glyph = function(character, color, bgColor) {
	return {
		char: character || Overprint.Char.NULL,
		color: color || Overprint.Color.WHITE,
		bgColor: bgColor || Overprint.Color.BLACK
	}
}

Overprint.Terminal = function(width, height, canvas) {
	this._width = width;
	this._height = height;

	var cell = this._emptyCell = Overprint.Glyph();

	canvas.width =  Overprint.Cell.WIDTH * this._width;
	canvas.height = Overprint.Cell.HEIGHT * this._height;

	this._context = canvas.getContext('2d');

	this._display = new Overprint.DisplayState(width, height, cell);
}

Overprint.Terminal.prototype.clear = function() {
	for (var row=0; row<this._width; row++) {
		for (var col=0; col<this._height; col++) {
			this._display.setCell(row, col, Overprint.Glyph());
		}
	}
}

Overprint.Terminal.prototype.writeGlyph = function(x, y, glyph) {
	this._display.setCell(x, y, glyph);
}

Overprint.Terminal.prototype.render = function() {
	var cellWidth = Overprint.Cell.WIDTH;
	var cellHeight = Overprint.Cell.HEIGHT;

	this._display.render(function(x, y, glyph){
		this._context.fillStyle = glyph.bgColor;
		this._context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

		this._context.fillStyle = glyph.color;
		this._context.fillText(glyph.char, x * cellWidth, y * cellHeight);
	}.bind(this));
}

Overprint.DisplayState = function(width, height, cell) {
	function fillArray2D(width, height, fill) {
		var list = new Array(width);
		for (var row=0; row<width; row++) {
			list[row] = new Array(height);
			for (var col=0; col<height; col++) {
				list[row][col] = fill;
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
	for (var row=0; row<this._width; row++) {
		for (var col=0; col<this._height; col++) {
			var cell = this._updatedCells[row][col];

			if (cell == null) continue;

			callback(row, col, cell);

			this._renderedCells[row][col] = cell;
			this._updatedCells[row][col] = null;
		}
	}
}
