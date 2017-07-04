const Hexgrid = function(width, height, canvas) {
	this._width = width;
	this._height = height;
	this._canvas = canvas;

	this._context = this._canvas.getContext('2d');

	this._ratio = window.devicePixelRatio || 1;

	this.resetLayout();

	var cell = this._emptyCell = Glyph();
	this._display = new DisplayState(width, height, cell);
}

Hexgrid.prototype.resetLayout = function() {
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
}

Hexgrid.prototype.writeCell = function(x, y, glyph) {
	this._display.setCell(x, y, glyph);
}

Hexgrid.prototype.render = function() {
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
}

Hexgrid.prototype.clear = function(glyph) {
	var bgGlyph = glyph ? glyph : Glyph();
	for (var col=0; col<this._width; col++) {
		for (var row=0; row<this._height; row++) {
			this._display.setCell(col, row, bgGlyph);
		}
	}
}

eport default Hexgrid;
