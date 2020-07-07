import test from "ava";
import td from "testdouble";
import { domWithCanvas } from "../lib/dom-canvas";

import MonospaceDisplay from "../../src/display/monospace-display";

test("font config", t => {
  domWithCanvas()

  const display = new MonospaceDisplay({
    fontSize: 20,
    fontFamily: "Attribute Mono",
    fontWeight: "bold"
  });

  t.notThrows(() => {
    td.verify(display.context.font.set("bold 20px Attribute Mono"));
    td.verify(display.context.textAlign.set("center"));
    td.verify(display.context.textBaseline.set("middle"));
  });
});

test("font size follows pixel ratio", t => {
  domWithCanvas()
  global.window.devicePixelRatio = 2;

  const display = new MonospaceDisplay({
    fontSize: 20
  });

  t.notThrows(() => {
    td.verify(display.context.font.set("normal 40px monospace"));
  });
});

test("render single glyph", t => {
  domWithCanvas()

  const display = new MonospaceDisplay();

  display.writeGlyph(0, 0, { char: "@", fg: "#f00", bg: "#312"});
  display.print();

  t.notThrows(() => {
    td.verify(display.context.fillStyle.set("#312"));
    td.verify(display.context.fillRect(0, 0, 20, 20));
    td.verify(display.context.fillStyle.set("#f00"));
    td.verify(display.context.fillText("@", 10, 10));
  });
});
