class Glyph {
  constructor(char, fg, bg) {
    this.char = char;
    this.fg = fg;
    this.bg = bg;
  }

  static default() {
    return new Glyph("", "#fff", "#000");
  }
}

class GlyphState {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.writeBuffer = Array(width * height).fill(null);
    this.printBuffer = Array(width * height).fill(null);
    this.isDirty = true;
  }

  get size() {
    return this.width * this.height;
  }

  withinBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  setGlyph(x, y, glyph) {
    if (!this.withinBounds(x, y)) return;

    const index = x + this.width * y;

    if (!this.printBuffer[index] || this.printBuffer[index].char !== glyph.char && this.printBuffer[index].fg !== glyph.fg && this.printBuffer[index].bg !== glyph.bg) {
      this.writeBuffer[index] = glyph;
      this.isDirty = true;
    }
  }

  *changed() {
    if (!this.isDirty) return;

    for (let y=0; y < this.height; y++) {
      for (let x=0; x < this.width; x++) {
        const index = x + this.width * y;
        if (this.writeBuffer[index] == null) continue;
        yield { x, y, glyph: this.writeBuffer[index] }
        this.printBuffer[index] = this.writeBuffer[index];
        this.writeBuffer[index] = null;
      }
    }

    this.isDirty = false;
  }
}

export default GlyphState;
