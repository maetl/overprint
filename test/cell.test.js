import test from "ava"
import Cell from "../overprint/cell"

test("default empty cell", t => {
  const cell = Cell()
  t.is(cell.character, " ")
  t.is(cell.foregroundColor, "#fff")
  t.is(cell.backgroundColor, "#000")
})

test("blank cell sets background only", t => {
  const cell = Cell.blank("#f00")
  t.is(cell.character, " ")
  t.is(cell.foregroundColor, "#fff")
  t.is(cell.backgroundColor, "#f00")
})

test("cell constructed with all attributes", t => {
  const cell = Cell("%", "#eee", "#f30")
  t.is(cell.character, "%")
  t.is(cell.foregroundColor, "#eee")
  t.is(cell.backgroundColor, "#f30")
})

test("cell constructed with character only", t => {
  const cell = Cell("!")
  t.is(cell.character, "!")
  t.is(cell.foregroundColor, "#fff")
  t.is(cell.backgroundColor, "#000")
})

test("cell constructed with foreground only", t => {
  const cell = Cell(false, "#eee")
  t.is(cell.character, " ")
  t.is(cell.foregroundColor, "#eee")
  t.is(cell.backgroundColor, "#000")
})

test("cell constructed with background only", t => {
  const cell = Cell(false, false, "#f30")
  t.is(cell.character, " ")
  t.is(cell.foregroundColor, "#fff")
  t.is(cell.backgroundColor, "#f30")
})
