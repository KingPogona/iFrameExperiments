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


// configure mandelbulb parameters
let DIM = 400;
let n = 8;
let maxIterations = 10;
let scale = DIM;
// let minDepth = DIM * -1;
let minDepth = 0;
let pointSize = 2.5;
let drawInterior = false;

let camera;

let mandelbulb = [];
let edge = false;
let iteration = 0;

// let globalX = DIM / 2;
let globalX = minDepth + (DIM / 2);
let globalY = 0;
let globalZ = 0;

let points = 0;

function setup() {
  // put setup code here


  createCanvas(canvasWidth, canvasHeight, WEBGL);
  frameRate(fps);

  camera = createCamera();
  // rotateX(90);
  // rotateY(90);
  // console.log(camera);
}

let programStartTime = Date.now();

function draw() {
  // put drawing code here

  let startTime = Date.now();

  // get mouse position and rotate camera if mouse is pressed
  // if (mouseIsPressed) {
  //   background(0);
  //   rotateX(mouseY * 0.1);
  //   rotateY(mouseX * 0.1);
  //   globalX = 0;
  //   globalY = 0;
  //   globalZ = 0;
  //   loop();
  // }

  rotateY(radians(-90));


  stroke(255);
  strokeWeight(pointSize);



  let currentTime = Date.now();

  while (currentTime - startTime < (1000 / fps) * .9) {


    let x = map(globalX, 0, DIM, -1, 1);
    let y = map(globalY, 0, DIM, -1, 1);
    let z = map(globalZ, 0, DIM, -1, 1);

    if (x > minDepth) {
      if (drawInterior) {
        edge = false;
      }



      let calculatedPoint = calculateMandelBulbPoint(x, y, z);

      if (calculatedPoint) {
        let distance = dist(calculatedPoint.x, calculatedPoint.y, calculatedPoint.z, 0, 0, 0);
        // change stroke hue based on distance
        colorMode(HSB);

        let exponent = 20;
        let maxMapValue = pow(255, exponent);
        let depthLuminosity = pow(map(x, -1, 1, 1, 255), exponent);
        stroke(map(distance, scale / 3, scale, 0, 255), 255, map(depthLuminosity, 0, maxMapValue, 0, 500) + map(x,-1,1,0,255) / 3, 0);
      }




      if (calculatedPoint) {
        point(calculatedPoint.x, calculatedPoint.y, calculatedPoint.z);
      }

    }

    if (globalZ == DIM) {
      globalZ = 0;
      globalY++;
    }
    if (globalY == DIM) {
      globalY = 0;
      globalX++;
    }
    if (globalX == DIM) {
      globalX = 0;
      noLoop();
    }
    globalZ++;
    points++;

    currentTime = Date.now();

  }


  let endTime = Date.now();

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

// function mousePressed() {
//   loop();
// }
