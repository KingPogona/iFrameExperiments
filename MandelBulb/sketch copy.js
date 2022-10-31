// settings

// define fps
let fps = 30;

// define window size
// auto
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

// define grid size
let gridSize = 8;

let gridWidth = canvasWidth / gridSize;
let gridHeight = canvasHeight / gridSize;


// configure mandelbulb parameters
let DIM = 64;
let n = 8;
let maxIterations = 10;

let mandelbulb = [];

function setup() {
  // put setup code here


  createCanvas(canvasWidth, canvasHeight, WEBGL);
  frameRate(fps);

  camera()
  rotateX(.4);
  rotateY(.4);



  for (let i = 0; i < DIM; i++) {
    let edge = false;
    for (let j = 0; j < DIM; j++) {
      
      for (let k = 0; k < DIM; k++) {
        

        // map x, y, z to grid
        let x = map(i, 0, DIM, -1, 1);
        let y = map(j, 0, DIM, -1, 1);
        let z = map(k, 0, DIM, -1, 1);



        let zeta = createVector(0, 0, 0);

        let iteration = 0;

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
            break;
          }

          if (iteration > maxIterations) {
            if (!edge) {
              edge = true;
              mandelbulb.push(createVector(x * 200, y * 200, z * 200));
            }

            break;
          }
        }

      }
    }
  }
  // console.log(mandelbulb);
}

let programStartTime = Date.now();

function draw() {
  // put drawing code here

  let startTime = Date.now();

  // get mouse position and rotate camera if mouse is pressed
  if (mouseIsPressed) {
    rotateX(mouseY * 0.01);
    rotateY(mouseX * 0.01);
  }


  background(0);

  // draw 3d grid of points with length dim 

  stroke(255);
  strokeWeight(.2);

  for (let i = 0; i < mandelbulb.length; i++) {
    point(mandelbulb[i].x, mandelbulb[i].y, mandelbulb[i].z);
  }


  let endTime = Date.now();

  // calculate the time it took to draw the frame
  let timeDiff = endTime - startTime;

  // print the time it took to draw the frame to the top left corner of the screen in dom
  document.getElementById("time").innerHTML = "time: " + timeDiff + "ms";
  // print the framerate to the top left corner of the screen in dom
  document.getElementById("fps").innerHTML = "fps: " + round(frameRate());

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
