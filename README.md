# Overprint

A toolkit for rendering ASCII tilemaps with HTML canvas.

```javascript
// Create a Terminal emulator instance
var canvas = document.getElementById("demo");
var terminal = new Overprint.Terminal(80, 46, canvas);

// Render the empty grid
terminal.render();

// Write glyphs to col/rows in the grid
terminal.writeGlyph(10, 20, Overprint.Glyph("#", "#f90"));
terminal.writeGlyph(11, 20, Overprint.Glyph("%", "#f90", "#333"));

// Re-render cells that changed since the previous render
terminal.render();
```