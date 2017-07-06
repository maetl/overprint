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
}

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
}

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
}

export default DisplayState;
