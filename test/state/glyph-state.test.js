import test from "ava";
import GlyphState from "../../src/state/glyph-state";

test("isDirty on initialize", t => {
  const state = new GlyphState(30, 20);

  t.true(state.isDirty);
});

test("isDirty wiped after buffer dumped", t => {
  const state = new GlyphState(30, 20);
  const cells = [...state.changed()];

  t.false(state.isDirty);
});


test("size computed from area", t => {
  const state = new GlyphState(30, 20);

  t.is(state.size, 600);
});

test("check within bounds", t => {
  const state = new GlyphState(30, 20);

  t.true(state.withinBounds(0, 0));
  t.true(state.withinBounds(1, 1));
  t.false(state.withinBounds(-1, 1));
  t.false(state.withinBounds(1, -1));
  t.false(state.withinBounds(30, 20));
  t.false(state.withinBounds(40, 20));
});

test("write cells", t => {
  const state = new GlyphState(30, 20);

  state.setGlyph(10, 10, { char: "A", fg: "#f00", bg: "#000"});
  state.setGlyph(10, 11, { char: "B", fg: "#f90", bg: "#111"});
  state.setGlyph(15, 15, { char: "C", fg: "#f60", bg: "#222"});

  const glyphs = [...state.changed()];

  t.is(glyphs.length, 3);

  const [glyph1, glyph2, glyph3] = glyphs;

  t.is(glyph1.x, 10);
  t.is(glyph1.y, 10);
  t.is(glyph1.glyph.char, "A");
  t.is(glyph1.glyph.fg, "#f00");
  t.is(glyph1.glyph.bg, "#000");

  t.is(glyph2.x, 10);
  t.is(glyph2.y, 11);
  t.is(glyph2.glyph.char, "B");
  t.is(glyph2.glyph.fg, "#f90");
  t.is(glyph2.glyph.bg, "#111");

  t.is(glyph3.x, 15);
  t.is(glyph3.y, 15);
  t.is(glyph3.glyph.char, "C");
  t.is(glyph3.glyph.fg, "#f60");
  t.is(glyph3.glyph.bg, "#222");
});

test("double buffered render", t => {
  const state = new GlyphState(30, 20);

  state.setGlyph(10, 10, { char: "A", fg: "#f00", bg: "#000"});
  state.setGlyph(10, 11, { char: "B", fg: "#f90", bg: "#111"});
  state.setGlyph(15, 15, { char: "C", fg: "#f60", bg: "#222"});

  const glyphs1 = [...state.changed()];

  t.is(glyphs1.length, 3);

  state.setGlyph(10, 10, { char: "Z", fg: "#00f", bg: "#222"});

  const glyphs2 = [...state.changed()];

  t.is(glyphs2.length, 1);
  t.is(glyphs2[0].x, 10);
  t.is(glyphs2[0].y, 10);
  t.is(glyphs2[0].glyph.char, "Z");
  t.is(glyphs2[0].glyph.fg, "#00f");
  t.is(glyphs2[0].glyph.bg, "#222");
});
