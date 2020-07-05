import test from "ava";
import CellState from "../src/cell-state";

test("isDirty on initialize", t => {
  const state = new CellState(30, 20);

  t.true(state.isDirty);
});

test("isDirty wiped after buffer dumped", t => {
  const state = new CellState(30, 20);
  const cells = [...state.changed()];

  t.false(state.isDirty);
});


test("size computed from area", t => {
  const state = new CellState(30, 20);

  t.is(state.size, 600);
});

test("check within bounds", t => {
  const state = new CellState(30, 20);

  t.true(state.withinBounds(0, 0));
  t.true(state.withinBounds(1, 1));
  t.false(state.withinBounds(-1, 1));
  t.false(state.withinBounds(1, -1));
  t.false(state.withinBounds(30, 20));
  t.false(state.withinBounds(40, 20));
});

test("write cells", t => {
  const state = new CellState(30, 20);

  state.setCell(10, 10, "#f00");
  state.setCell(10, 11, "#f30");
  state.setCell(15, 15, "#f60");

  const cells = [...state.changed()];

  t.is(cells.length, 3);

  const [cell1, cell2, cell3] = cells;

  t.is(cell1.x, 10);
  t.is(cell1.y, 10);
  t.is(cell1.fill, "#f00");

  t.is(cell2.x, 10);
  t.is(cell2.y, 11);
  t.is(cell2.fill, "#f30");

  t.is(cell3.x, 15);
  t.is(cell3.y, 15);
  t.is(cell3.fill, "#f60");
});

test("double buffered render", t => {
  const state = new CellState(30, 20);

  state.setCell(10, 10, "#f00");
  state.setCell(10, 11, "#f30");
  state.setCell(15, 15, "#f60");

  const cells1 = [...state.changed()];

  t.is(cells1.length, 3);

  state.setCell(10, 10, "#ff0");

  const cells2 = [...state.changed()];

  t.is(cells2.length, 1);
  t.is(cells2[0].fill, "#ff0");
});
