import CanvasDisplay from "./canvas-display.js";
import GlyphState from "../state/glyph-state.js";

const defaultSettings = {
  fontFamily: "monospace",
  fontSize: 16,
  fontWeight: "normal"
}

class MonospaceDisplay extends CanvasDisplay {
  constructor(settings) {
    const config = { ...defaultSettings, ...settings };

    super(config);

    this.fontFamily = config.fontFamily;
    this.fontSize = config.fontSize * this.pixelRatio;
    this.fontWeight = config.fontWeight;

    this.context.font = `${this.fontWeight} ${this.fontSize}px/${this.fontSize}px ${this.fontFamily}`;
  	this.context.textAlign = "center";

    // Vertical placement from middle of box
  	this.context.textBaseline = "middle";

    // Vertical placement from bottom of box
  	//this.context.textBaseline = "bottom";

    // Set up the display state buffer
    this.glyphs = new GlyphState(this.width, this.height);
  }

  resetLayout() {
    if (this._responsive) {
  		// Calculates the dimensions of the containing element first
  		if (!this._canvas.style.width) this._canvas.style.width = 640;
  		if (!this._canvas.style.height) this._canvas.style.height = 480;

  		const elementWidth = parseInt(this._canvas.style.width, 10)  * this._ratio;
  		const elementHeight = parseInt(this._canvas.style.height, 10) * this._ratio;

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
  		const textMeasure = this._context.measureText("M");

  		// Canvas measure text with direct multiple of font size
  		let textWidth = Math.ceil(textMeasure.width);
  		let textHeight = this._font.size;

  		// Force square aspect ratio
  		if (this._squared) {
  			textWidth = textHeight = Math.max(textWidth, textHeight);
  		}

  		this._cellWidth = textWidth * this._ratio;
  		this._cellHeight = textHeight * this._ratio;

  		const drawWidth = textWidth * this._width;
  		const drawHeight = textHeight * this._height;

  		this._canvas.width = drawWidth * this._ratio;
  		this._canvas.height = drawHeight * this._ratio;

      this._canvas.style.width = `${drawWidth}px`;
  		this._canvas.style.height = `${drawHeight}px`;
  	}

  	this._font.size = this._font.size * this._ratio;
  	this._context.font = this._font.toCSS();
  	this._context.textAlign = 'center';
  	this._context.textBaseline = 'middle';
  }

  clear() {
    this.fill(this._emptyCell);
  }

  fill(cell) {
    for (let col=0; col<this._width; col++) {
      for (let row=0; row<this._height; row++) {
        this._display.setCell(col, row, cell);
      }
    }
  }

  writeCell(x, y, fill) {
    this.glyphs.setGlyph(x, y, {char: "", fg: null, bg: fill});
  }

  writeChar(x, y, char, fg, bg) {
    this.glyphs.setGlyph(x, y, {char, fg, bg});
  }

  writeGlyph(x, y, glyph) {
    this.glyphs.setGlyph(x, y, glyph);
  }

  writeText(x, y, text, fg, bg) {
    for (let cursor=x; cursor < text.length + x; cursor++) {
      this.writeChar(cursor, y, text[cursor - x], fg, bg);
    }
  }

  writeTextTo(x, y, text, fg, bg) {
    this.writeText(x - text.length + 1, y, text, fg, bg);
  }

  writeTextAround(x, y, text, fg, bg) {
    this.writeText(x - Math.round((text.length - 1) / 2), y, text, fg, bg)
  }

  writeTextCentered(x, y, text, fg, bg) {
    this.writeText(this.width / 2 - Math.round((text.length - 1) / 2), y, text, fg, bg)
  }

  print() {
    if (!this.glyphs.isDirty) return;

    for (const cell of this.glyphs.changed()) {
      this.context.fillStyle = cell.glyph.bg;
      this.context.fillRect(
        cell.x * this.cellWidth,
        cell.y * this.cellHeight,
        this.cellWidth,
        this.cellHeight
      );

      if (!cell.glyph.char) continue;

      this.context.fillStyle = cell.glyph.fg;


      const cx = (cell.x * this.cellWidth) + this.cellWidth / 2;

      // Vertical placement from middle of box
      //const cy = (cell.y * this.cellHeight) + this.cellHeight / 2;
      //
      // Vertical placement from bottom of box
      const cy = (cell.y * this.cellHeight) + this.fontSize / 1.8;

      this.context.fillText(cell.glyph.char, cx, cy);
    }
  }

  pxToCell(ev) {
  	const bounds = this._canvas.getBoundingClientRect();
  	const relativeX = ev.clientX - bounds.left;
  	const relativeY = ev.clientY - bounds.top;
  	const colPos = Math.trunc(relativeX / this._cellWidth * this._ratio);
  	const rowPos = Math.trunc(relativeY / this._cellHeight * this._ratio);
  	return [colPos, rowPos];
  }

  onClick(handler) {
    this._canvas.addEventListener('click', (ev) => {
      const cell = this.pxToCell(ev);
      handler(cell[0], cell[1]);
    });
  }

  onMouseMove(handler) {
    this._canvas.addEventListener('mousemove', (ev) => {
      const cell = this.pxToCell(ev);
      handler(cell[0], cell[1]);
    });
  }
}

export default MonospaceDisplay;
