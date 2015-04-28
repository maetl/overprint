var Overprint = {};

Overprint.Terminal = function(width, height, canvas) {
	this._context = canvas.getContext('2d');
	this._display = new Overprint.DisplayState(width, height);
}

Overprint.Terminal.prototype.render = function() {
	this._display.render(function(x, y, item){
		this._context.fillStyle = '#952';
		this._context.fillRect(x * 32, y * 32, 32, 32);
	}.bind(this));
}

Overprint.DisplayState = function(width, height) {
	function array2D(width, height, fill) {
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

	this._renderedCells = array2D(width, height, ' ');
	this._updatedCells = array2D(width, height, ' ');
}

Overprint.DisplayState.prototype.setCell = function(x, y, item) {
	if (x < 0) return;
	if (x >= this._width) return;
	if (y < 0) return;
	if (y >= this._height) return;

	if (this._renderedCells[x][y] != item) {
		this._updatedCells[x][y] = item;
	} else {
		this._updatedCells[x][y] = null;
	}
}

Overprint.DisplayState.prototype.render = function(callback) {
	for (var row=0; row<this._width; row++) {
		for (var col=0; col<this._height; col++) {
			var item = this._updatedCells[row][col];

			if (item == null) continue;

			callback(row, col, item);

			this._renderedCells[row][col] = item;
			this._updatedCells[row][col] = null;
		}
	}
}
