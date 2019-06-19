# Overprint

Overprint is a minimalist toolkit for rendering cell grids and tile maps using the [HTML Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

It’s intended to be useful for visualizing discrete simulations, cellular automata, abstract/fantasy procedural map generation and 2D game development with an old-school flavour.

## Status

[![npm](https://img.shields.io/npm/v/overprint.svg)](https://npmjs.org/package/overprint)
[![travis](https://img.shields.io/travis/maetl/overprint.svg)](https://travis-ci.org/maetl/overprint)

## Basic Usage

The following example illustrates the main features of the API.

```js
import { TextGrid, Cell } from "overprint"

// Find or create an HTML canvas element in the DOM
// eg: <canvas id="demo"></canvas>
const canvas = document.querySelector("#demo")

// Create a default text grid from the canvas element
const grid = new TextGrid(canvas)

// Predefine a map of cell objects representing text characters
// with foreground and background colors
const Cells = {
  Grass: Cell(".", "#37CC63", "#2F3D33"),
  Sapling: Cell("^", "#A09A2C", "#2F3D33"),
  Tree: Cell("↑", "#337C22", "#2F3D33")
}

// Fill the entire grid
grid.fill(Cells.Grass)

// Render the filled cells to the canvas
grid.render()

// Overwrite a bunch of cells in random positions
for (let x,y,s=0; s<10; s++) {
  x = Math.floor(Math.random() * grid.rows) - 1
  y = Math.floor(Math.random() * grid.cols) - 1
  grid.writeCell(x, y, Math.random() > 0.5 ? Cells.Sapling : Cells.Tree)
}

// Re-render the cells that changed since the previous render
grid.render()
```

## Credits

Overprint is a little library by [Mark Rickerby](http://maetl.net).

Several of the ideas in this codebase were heavily influenced by [Malison](https://github.com/munificent/malison) by Bob Nystrom and [rot.js](https://github.com/ondras/rot.js) by Ondřej Žára. If you’re at all interested in browser-based roguelike games, you should check out their work—it’s awesome.

Also thanks to Amit Patel at [Red Blob Games](http://www.redblobgames.com/) whose grid geometry resources saved me a whole heap of time that would have otherwise been spent scrabbling and scratching on graph paper and scrolling through verbose Wikipedia pages.

## License

See the `LICENSE` file packaged with this software distribution.
