// import classes
// import Spiral from "./classes/Spiral.js";
// import GridSquare from "./classes/GridSquare.js";


// settings

// define grid size
let gridSize = 2;
// 1280 x 720
// let canvasWidth = 1280;
// let canvasHeight = 720;

// 1920 x 1080
// let canvasWidth = 1920;
// let canvasHeight = 1080;

// auto
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let gridWidth = canvasWidth / gridSize;
let gridHeight = canvasHeight / gridSize;

let lineSpeed = 1;
let lineSpeedMultiplier = 2;

let lineColor = 0;

let optimized = 3;

function setup() {
  // put setup code here


  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);

  background(0);

  // draw grid
  // drawGrid(canvasWidth, canvasHeight, gridSize);
}

let spiral = new Spiral(gridWidth / 2, gridHeight / 2, gridSize, lineSpeed, lineSpeedMultiplier, lineColor, optimized);

let frameCount = 0;

let programStartTime = Date.now();

function draw() {
  // put drawing code here

  let startTime = Date.now();

  // background(128);

  // draw the spiral
  spiral.run();

  let endTime = Date.now();

  // calculate the time it took to draw the frame
  let timeDiff = endTime - startTime;

  if (frameCount % 250 === 0) {
    console.log(`frameCount: ${frameCount}`);
    console.log(`frame time: ${timeDiff}`);
    console.log(`fps: ${round(frameRate())}`);
    console.log('total program time: ' + (Date.now() - programStartTime) / 1000);
    console.log('\n');
  }

  if (frameCount >= 2000 / (lineSpeedMultiplier * gridSize)) {
    // get number of n, prime numbers calculated, and time it took to calculate them
    console.log(`spiral length: ${spiral.getN()}`);
    console.log(`prime numbers: ${spiral.getPrimeNumbersLength()}`);
    console.log('total program time: ' + (Date.now() - programStartTime) / 1000);
    // stop the program
    noLoop();
  }

  // print the time it took to draw the frame to the top left corner of the screen in dom
  document.getElementById("time").innerHTML = "time: " + timeDiff + "ms";
  // print the framerate to the top left corner of the screen in dom
  document.getElementById("fps").innerHTML = "fps: " + round(frameRate());

  frameCount++;
}

// function to draw the grid using lines based on params width height and gridSize
function drawGrid(width, height, gridSize) {
  stroke(120);
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }
}