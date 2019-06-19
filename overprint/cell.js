import Char from './char'
import Color from './color'

const Cell = function(character, foregroundColor, backgroundColor) {
	return {
		character: character || Char.NULL,
		foregroundColor: foregroundColor || Color.WHITE,
		backgroundColor: backgroundColor || Color.BLACK
	}
}

Cell.blank = function(backgroundColor) {
  return Cell(false, false, backgroundColor);
}

export default Cell;
