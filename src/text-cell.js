class TextCell {
  constructor(char, fg, bg) {
    this.char = char;
    this.fg = fg;
    this.bg = bg;
  }

  equals(cell) {
    return cell.char == this.char && cell.fg == this.fg && cell.bg == this.bg;
  }
}

export default TextCell;
