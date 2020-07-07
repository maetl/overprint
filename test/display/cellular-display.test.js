import test from "ava";
import td from "testdouble";
import { domWithCanvas } from "../lib/dom-canvas";

import CellularDisplay from "../../src/display/cellular-display";

test("render single cell", t => {
  domWithCanvas()

  const display = new CellularDisplay();

  display.writeCell(0, 0, "#f00");
  display.print();

  t.notThrows(() => {
    td.verify(display.context.fillStyle.set("#f00"));
    td.verify(display.context.fillRect(0, 0, 20, 20));
  });
});
