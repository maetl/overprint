import test from "ava"
import TextCell from "../src/text-cell"

test("cell constructed with all attributes", t => {
  const cell = new TextCell("@", "#fff", "#000")
  t.is(cell.char, "@")
  t.is(cell.fg, "#fff")
  t.is(cell.bg, "#000")
})

test("check value equality", t => {
  const cell1 = new TextCell("@", "#fff", "#000")
  const cell2 = new TextCell("@", "#fff", "#000")
  t.true(cell1.equals(cell2));
});
