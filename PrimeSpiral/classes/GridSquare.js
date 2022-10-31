// create GridSquare class
class GridSquare {
  constructor(x, y, isPrime, varient, gridSize, lineColor = 128) {
    this.x = x;
    this.y = y;
    this.isPrime = isPrime;
    this.varient = varient;
    this.gridSize = gridSize;
    this.lineColor = lineColor;
    this.offset = gridSize / 2;
    this.endpoints = this.calculateEndpoints(this.x, this.y, this.gridSize, this.offset);
    this.drawLines(this.varient, optimized);
    this.drawCircle(this.isPrime);
  }
  // calculate line endpoints and return them as an array
  calculateEndpoints(x, y, gridsize, offset) {
    let endpoints = [];
    offset = offset - 0.4;
    // center point
    let x1 = x * gridsize - offset;
    let y1 = y * gridsize - offset;
    // top point
    let x2 = x1;
    let y2 = y1 - offset;
    // right point
    let x3 = x1 + offset;
    let y3 = y1;
    // bottom point
    let x4 = x1;
    let y4 = y1 + offset;
    // left point
    let x5 = x1 - offset;
    let y5 = y1;
    endpoints.push(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5);
    return endpoints;
  }

  // draw lines
  drawLines(varient) {
    let [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5] = this.endpoints;
    if (this.lineColor === 0) {
      noStroke();
    } else {
      stroke(this.lineColor);
    }
    switch (varient) {
      case "start":
        line(x1, y1, x3, y3);
        break;
      case "up-up":
      case "down-down":
        line(x2, y2, x4, y4);
        break;
      case "up-left":
        line(x4, y4, x1, y1);
        line(x1, y1, x5, y5);
        break;
      case "left-left":
      case "right-right":
        line(x3, y3, x5, y5);
        break;
      case "left-down":
        line(x3, y3, x1, y1);
        line(x1, y1, x4, y4);
        break;
      case "down-right":
        line(x2, y2, x1, y1);
        line(x1, y1, x3, y3);
        break;
      case "right-up":
        line(x5, y5, x1, y1);
        line(x1, y1, x2, y2);
        break;
      default:
        console.error("varient not found" + this.varient + "for line at " + this.x + "," + this.y);
        break;
    }
  }

  // if the grid square is prime, draw a circle at the center of the square
  drawCircle(isPrime) {
    let circleSize = this.offset;
    if (circleSize < 1) {
      circleSize = 1;
    }
    if (isPrime) {
      fill(255);
      noStroke();
      circle(this.endpoints[0], this.endpoints[1], circleSize);
    }
  }
}
