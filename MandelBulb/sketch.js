// settings

// define fps
let fps = 30;

// define window size
// auto
// let canvasWidth = window.innerWidth;
// let canvasHeight = window.innerHeight;
// 1080p
let canvasWidth = 1920;
let canvasHeight = 1080;
// 4k
// let canvasWidth = 3840;
// let canvasHeight = 2160;


// configure mandelbulb parameters
let DIM = 200;
let maxIterations = 10;
let scale = DIM;
let minDepth = DIM * -1;
// let minDepth = 0;
let pointSize = 2.5;
let drawInterior = false;

let camera;

let mandelBulb = [];
let edge = false;
let iteration = 0;

// let globalX = DIM / 2;
let globalX = minDepth + (DIM / 2);
let globalY = 0;
let globalZ = 0;

let points = 0;

let startN = 8;
let n = startN;
let endN = 8;
let totalFrames = 1;
let frameNumber = 1;

let firstLineFound = false;
let foundPoint = false;
let linesSinceLastPoint = 0;


function setup() {
  // put setup code here


  createCanvas(canvasWidth, canvasHeight, WEBGL);
  frameRate(fps);
  colorMode(HSB);

  camera = createCamera();
  // rotateX(90);
  // rotateY(90);
  // console.log(camera);
}

let programStartTime = Date.now();

function draw() {
  // put drawing code here

  let startTime = Date.now();

  rotateY(radians(-90));


  stroke(255);
  strokeWeight(pointSize);


  calculateMandelBulb();


  let endTime = Date.now();



  displayDebugInfo(startTime, endTime);



}

// create Spherical class
class Spherical {
  constructor(r, theta, phi) {
    this.r = r;
    this.theta = theta;
    this.phi = phi;
  }
}

let spherical = function (x, y, z) {
  let r = sqrt(x * x + y * y + z * z);
  let theta = atan2(sqrt(x * x + y * y), z);
  let phi = atan2(y, x);
  return new Spherical(r, theta, phi);
}

let calculateMandelBulbPoint = function (x, y, z) {
  let zeta = createVector(0, 0, 0);

  iteration = 0;

  while (true) {
    let sphericalZ = spherical(zeta.x, zeta.y, zeta.z);

    let newX = pow(sphericalZ.r, n) * sin(sphericalZ.theta * n) * cos(sphericalZ.phi * n);
    let newY = pow(sphericalZ.r, n) * sin(sphericalZ.theta * n) * sin(sphericalZ.phi * n);
    let newZ = pow(sphericalZ.r, n) * cos(sphericalZ.theta * n);

    zeta.x = newX + x;
    zeta.y = newY + y;
    zeta.z = newZ + z;

    iteration++;

    if (sphericalZ.r > 2) {
      if (edge) {
        edge = false;
      }
      return false;
      break;
    }

    if (iteration > maxIterations) {
      if (!edge) {
        edge = true;
        return createVector(x * scale, y * scale, z * scale);
      }

      break;
    }
  }
}

// function to iterate global x, y, z
let iterateGlobalCoordinates = function () {
  if (globalZ == DIM) {
    globalZ = 0;
    globalY++;
  }
  if (globalY == DIM) {
    globalY = 0;
    globalX++;

    if (foundPoint == false) {
      linesSinceLastPoint++;
    } else {
      linesSinceLastPoint = 0;
    }

    foundPoint = false;

    // console.log(linesSinceLastPoint);

    if (firstLineFound == true && linesSinceLastPoint > 9) {
      console.log("skipping");
      globalX = DIM;
    }
  }
  if (globalX == DIM) {
    globalX = 0;
    // saveCanvas('mandelbulb_' + frameNumber, 'png');
    iterateN()
    if (frameNumber > totalFrames) {
      noLoop();
    } else {
      background(0);
      firstLineFound = false;
    }
  }
  globalZ++;
  points++;
}

// function to draw the mandelbulb
let calculateMandelBulb = function () {
  let startTime = Date.now();
  let currentTime = Date.now();

  while (currentTime - startTime < (1000 / fps) * .92) {

    let x = map(globalX, 0, DIM, -1, 1);
    let y = map(globalY, 0, DIM, -1, 1);
    let z = map(globalZ, 0, DIM, -1, 1);

    let depth = x;

    if (depth > minDepth) {
      if (drawInterior) {
        edge = false;
      }

      let calculatedPoint = calculateMandelBulbPoint(x, y, z);

      if (calculatedPoint) {
        let color = calcuateColor(calculatedPoint, depth);
        let size = calculatePointSize(depth);

        mandelBulb.push({
          vector: calculatedPoint,
          color: color,
          size: size
        });

        firstLineFound = true;
        foundPoint = true;
      }
    }

    iterateGlobalCoordinates();

    currentTime = Date.now();
  }
  // console.log("frameTime: " + (currentTime - startTime));
  drawMandelBulb();
}

// funtion to display debug info
let displayDebugInfo = function (startTime, endTime) {
  // calculate the time it took to draw the frame
  let timeDiff = endTime - startTime;

  // print the number of points calculated to the top left corner of the screen
  document.getElementById("points").innerHTML = "points: " + points;
  // print the time it took to draw the frame to the top left corner of the screen in dom
  document.getElementById("time").innerHTML = "time: " + timeDiff + "ms";
  // print the framerate to the top left corner of the screen in dom
  document.getElementById("fps").innerHTML = "fps: " + round(frameRate());
  // print the render time to the top left corner of the screen in dom
  document.getElementById("renderTime").innerHTML = "render time: " + (endTime - programStartTime) / 1000 + "seconds";
  // print n to the top left corner of the screen in dom
  document.getElementById("n").innerHTML = "n: " + n;
}

// iterate n by mapping n to the range of startN and endN based on the frameNumber
let iterateN = function () {
  frameNumber++;
  // n = map(frameNumber, 0, totalFrames, startN, endN);
  n = n + n * .005;
  // console.log(n);
}

let drawMandelBulb = function () {
  // console.log(mandelBulb[0])
  mandelBulb.forEach(function (mandelPoint) {
    let vector = mandelPoint.vector;
    strokeWeight(mandelPoint.size);
    stroke(mandelPoint.color);
    point(vector.x, vector.y, vector.z);
    mandelBulb = [];
  });
}





// function to calculate point size
let calculatePointSize = function (depth) {
  return map(depth, -1, 1, 2.5, 3.5);
}

// funtion to cacluate the color of the point
let calcuateColor = function (calculatedPoint, depth) {

  let distance = dist(calculatedPoint.x, calculatedPoint.y, calculatedPoint.z, 0, 0, 0);
  // change stroke hue based on distance

  let exponent = 20;
  let maxMapValue = pow(255, exponent);
  let depthLuminosity = pow(map(depth, -1, 1, 1, 255), exponent);

  let hue = map(distance, scale / 3, scale, 0, 255);
  let saturation = 255;
  let brightness = map(depthLuminosity, 0, maxMapValue, 0, 500) + map(depth, -1, 1, 0, 255) / 3;
  return color(hue, saturation, brightness);
}

