const Trigrid = function(width, height, canvas) {
	this._width = width;
	this._height = height;
	this._canvas = canvas;

	this._context = this._canvas.getContext('2d');

	this.resetLayout();

	var cell = this._emptyCell = Glyph();
	this._display = new DisplayState(width, height, cell);
}

Trigrid.prototype.resetLayout = function() {
	if (!this._canvas.style.width) this._canvas.style.width = 640;
	if (!this._canvas.style.height) this._canvas.style.height = 480;

	var elementWidth = parseInt(this._canvas.style.width, 10);
	var elementHeight = parseInt(this._canvas.style.height, 10);

	this._canvas.width = elementWidth;
	this._canvas.height = elementHeight;

	this._cellWidth = elementWidth / this._width;
	this._cellHeight = elementHeight / this._height;
}

// TODO: +api work out the best value obj structure to pass here instead of glyph
Trigrid.prototype.writeCell = function(x, y, glyph) {
	this._display.setCell(x, y, glyph);
}

Trigrid.prototype.render = function() {
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

		var verticalOrientationUp = (y % 2 === 0) ? true : false

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
}

export default Trigrid;
