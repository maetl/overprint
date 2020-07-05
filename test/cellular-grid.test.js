import test from "ava";
import td from "testdouble";
import { domWithCanvas } from "./lib/dom-canvas";

import CellularGrid from "../src/cellular-grid";

test("render single cell", t => {
  domWithCanvas()

  const grid = new CellularGrid();

  grid.writeCell(0, 0, "#f00");
  grid.print();

  t.notThrows(() => {
    td.verify(grid.context.fillStyle.set("#f00"));
    td.verify(grid.context.fillRect(0, 0, 20, 20));
  });
});
