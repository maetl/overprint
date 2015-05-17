# Overprint

Overprint is a minimalist toolkit for rendering cell grids and tile maps using the [HTML Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

It’s intended to be useful for discrete visualisations, abstract/fantasy/procedural map generation and 2D game development with an old-school flavour.

## Status

[![npm](https://img.shields.io/npm/v/overprint.svg)]()

## Usage

Display a retro glyph terminal:

```js
// Find or create an HTML canvas element in the DOM
// eg: <canvas id="demo-canvas"></canvas> 
var canvas = document.querySelector(".demo-canvas");

// Create a 40x30 retro glyph terminal using the builtin browser fonts
var terminal = new Overprint.Terminal(40, 30, canvas);

// Create a glyph object representing an nonprinting character
// with defined foreground and background colors
var blackBg = Overprint.Glyph(Overprint.Char.NULL, 'black', 'black');

// Flood fill the grid with the given background glyph
terminal.fill(blackBg);

// Render the filled terminal
terminal.render();

// Write text glyphs to specific cells in the grid
terminal.writeGlyph(10, 20, Overprint.Glyph("@", "#fff"));
terminal.writeGlyph(11, 20, Overprint.Glyph("#", "#ccc", "#333"));

// Re-render the cells that changed since the previous render
terminal.render();
```

## Credits

Overprint is a little library by [Mark Rickerby](http://maetl.net).

Several of the ideas in this codebase were heavily influenced by [Malison](https://github.com/munificent/malison) by Bob Nystrom and [rot.js](https://github.com/ondras/rot.js) by Ondřej Žára. If you’re at all interested in browser-based roguelike games, you should check out their work—it’s awesome.

Also thanks to Amit Patel at [Red Blob Games](http://www.redblobgames.com/) whose grid geometry resources saved me a whole heap of time that would have otherwise been spent scrabbling and scratching on graph paper and scrolling through verbose Wikipedia pages.

## License

See the `LICENSE` file packaged with this software distribution.
