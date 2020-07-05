import td from "testdouble";

function createCanvasRenderingContext2D() {
  const CanvasRenderingContext2D = {
    arc: td.func(),
    arcTo: td.func(),
    beginPath: td.func(),
    bezierCurveTo: td.func(),
    clearRect: td.func(),
    clip: td.func(),
    closePath: td.func(),
    createImageData: td.func(),
    createLinearGradient: td.func(),
    createPattern: td.func(),
    createRadialGradient: td.func(),
    drawFocusIfNeeded: td.func(),
    drawImage: td.func(),
    ellipse: td.func(),
    fill: td.func(),
    fillRect: td.func(),
    fillText: td.func(),
    getImageData: td.func(),
    getLineDash: td.func(),
    getTransform: td.func(),
    isPointInPath: td.func(),
    isPointInStroke: td.func(),
    lineTo: td.func(),
    measureText: td.func(),
    moveTo: td.func(),
    putImageData: td.func(),
    quadraticCurveTo: td.func(),
    rect: td.func(),
    restore: td.func(),
    rotate: td.func(),
    save: td.func(),
    scale: td.func(),
    setLineDash: td.func(),
    setTransform: td.func(),
    stroke: td.func(),
    strokeRect: td.func(),
    strokeText: td.func(),
    transform: td.func(),
    translate: td.func()
  }

  const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function randomStr(len) {
    const result = [];

    for (let i = 0; i < len; i++) {
      result.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)])
    }

    return result.join("");
  }

  function definePropertyDouble(object, property) {
    const propertyGetterRef = randomStr(18);
    const propertySetterRef = randomStr(18);

    Object.defineProperty(object, propertyGetterRef, {
      value: td.func(),
      enumerable: false
    });

    Object.defineProperty(object, propertySetterRef, {
      value: td.func(),
      enumerable: false
    });

    Object.defineProperty(object, property, {
      get: () => ({
        get: object[propertyGetterRef],
        set: object[propertySetterRef]
      }),
      set: value => object[propertySetterRef](value),
      enumerable: true
    });
  }

  definePropertyDouble(CanvasRenderingContext2D, "fillStyle");
  definePropertyDouble(CanvasRenderingContext2D, "font");
  definePropertyDouble(CanvasRenderingContext2D, "globalAlpha");
  definePropertyDouble(CanvasRenderingContext2D, "globalCompositeOperation");
  definePropertyDouble(CanvasRenderingContext2D, "imageSmoothingEnabled");
  definePropertyDouble(CanvasRenderingContext2D, "lineCap");
  definePropertyDouble(CanvasRenderingContext2D, "lineDashOffset");
  definePropertyDouble(CanvasRenderingContext2D, "lineJoin");
  definePropertyDouble(CanvasRenderingContext2D, "lineWidth");
  definePropertyDouble(CanvasRenderingContext2D, "miterLimit");
  definePropertyDouble(CanvasRenderingContext2D, "shadowBlur");
  definePropertyDouble(CanvasRenderingContext2D, "shadowColor");
  definePropertyDouble(CanvasRenderingContext2D, "shadowOffsetX");
  definePropertyDouble(CanvasRenderingContext2D, "shadowOffsetY");
  definePropertyDouble(CanvasRenderingContext2D, "strokeStyle");
  definePropertyDouble(CanvasRenderingContext2D, "textAlign");
  definePropertyDouble(CanvasRenderingContext2D, "textBaseline");

  return CanvasRenderingContext2D;
}

export default createCanvasRenderingContext2D;
