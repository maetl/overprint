function fillArray2D(width, height, fill) {
  const list = new Array(width);
  for (let col=0; col<width; col++) {
    list[col] = new Array(height);
    for (let row=0; row<height; row++) {
      list[col][row] = fill;
    }
  }
  return list;
}

class DisplayState {
  constructor(width, height) {
    this._width = width;
  	this._height = height;

    this._renderedCells = fillArray2D(width, height, null);
  	this._updatedCells = fillArray2D(width, height, null);

  	this._dirty = true;
  }

  setCharacter(x, y, character) {
    if (x < 0) return;
    if (x >= this._width) return;
    if (y < 0) return;
    if (y >= this._height) return;

    if (!character) return;

    if (this._renderedCells[x][y].character != character) {
      const foregroundColor = this._updatedCells[x][y].foregroundColor || this._renderedCells[x][y].foregroundColor
      const backgroundColor = this._updatedCells[x][y].backgroundColor || this._renderedCells[x][y].backgroundColor
      this._updatedCells[x][y] = {
        character,
        foregroundColor,
        backgroundColor
      };
      this._dirty = true;
    } else {
      this._updatedCells[x][y] = null;
    }
  }

  setCell(x, y, cell) {
  	if (x < 0) return;
  	if (x >= this._width) return;
  	if (y < 0) return;
  	if (y >= this._height) return;

  	if (this._renderedCells[x][y] !== cell) {
  		this._updatedCells[x][y] = cell;
  		this._dirty = true;
  	} else {
  		this._updatedCells[x][y] = null;
  	}
  }

  getCell(x, y) {
    if (x < 0) return;
  	if (x >= this._width) return;
  	if (y < 0) return;
  	if (y >= this._height) return;

    return this._updatedCells[x][y] || this._renderedCells[x][y];
  }

  render(callback) {
  	if (!this._dirty) return;
    let cell;

  	for (let col=0; col<this._width; col++) {
  		for (let row=0; row<this._height; row++) {
  			cell = this._updatedCells[col][row];

  			if (cell == null) continue;

  			callback(col, row, cell);

  			this._renderedCells[col][row] = cell;
  			this._updatedCells[col][row] = null;
  		}
  	}
  }
}

export default DisplayState;
