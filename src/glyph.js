import Char from './char'
import Color from './color'

const Glyph = function(character, color, bgColor) {
	return {
		char: character || Char.NULL,
		color: color || Color.WHITE,
		bgColor: bgColor || Color.BLACK
	}
}

export default Glyph;
