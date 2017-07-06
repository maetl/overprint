const Glyph = function(character, color, bgColor) {
	return {
		char: character || Overprint.Char.NULL,
		color: color || Overprint.Color.WHITE,
		bgColor: bgColor || Overprint.Color.BLACK
	}
}

export default Glyph;
