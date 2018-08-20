class BitmapFont {
	constructor(imagePath, width, height, rowLength) {
		this.width = width;
		this.height = height;
	  this.rowLength = rowLength
		this.image = new Image();
		this.image.addEventListener('load', function() {
			if (this._onReady) this._onReady();
		}.bind(this), false);
		this.image.src = imagePath;
	}

	ready(onReady) {
		this._onReady = onReady;
	}
}

export default BitmapFont;
