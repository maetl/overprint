import { JSDOM } from "jsdom";
import createCanvasRenderingContext2D from "./CanvasRenderingContext2D";

export function domWithCanvas(domString = "") {
  const dom = new JSDOM(domString);

  global.window = dom.window;
  global.document = dom.window.document;

  global.window.HTMLCanvasElement.prototype.getContext = () => {
    return createCanvasRenderingContext2D();
  }
}
