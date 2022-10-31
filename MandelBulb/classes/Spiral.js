// create spiral class 
class Spiral {
  constructor(x, y, gridSize, speed = 1, SpeedMultiplier = 0, lineColor, optimized = 0) {
    this.x = x;
    this.y = y;
    this.gridSize = gridSize;

    this.n = 1;
    this.previousDirection = "";
    this.currentDirection = "start";
    this.currentLength = 0;
    this.lineLength = 1;
    this.updateLineLength = false;

    this.gridSquares = [];

    this.speed = speed;
    this.speedMultiplier = SpeedMultiplier;

    this.lineColor = lineColor;
    this.optimized = optimized;

    this.primeNumbers = [2];
  }

  // get the varient of the current direction
  getVarient(previousDirection, currentDirection) {
    if (currentDirection === "start") {
      return "start";
    } else {
      return previousDirection + "-" + currentDirection;
    }
  }

  // check if n is prime and if it is, return true
  isPrime(n, optimized) {
    switch (optimized) {
      case 0:
        // basic version of isPrime
        if (n === 1) {
          return false; // 1 is not prime
        } else {
          for (let i = 2; i < n; i++) {
            if (n % i === 0) {
              return false;
            }
          }
          return true;
        }
      case 1:
        // optimized version of isPrime
        if (n === 1) {
          return false; // 1 is not prime
        } else if (n === 2) {
          return true; // 2 is prime
        } else if (n % 2 === 0) {
          return false; // even numbers are not prime
        } else {
          for (let i = 2; i < n / 2; i++) {
            if (n % i === 0) {
              return false;
            }
          }
          return true;
        }
      case 2:
        // further optimized version of isPrime
        if (n === 1) {
          return false; // 1 is not prime
        } else if (n === 2) {
          return true; // 2 is prime
        } else if (n % 2 === 0) {
          return false; // even numbers are not prime
        } else {
          // check if n is a prime number by checking if it is divisible by primeNumbers
          for (let i = 0; i < this.primeNumbers.length; i++) {
            if (n % this.primeNumbers[i] === 0) {
              return false;
            }
          }
          this.primeNumbers.push(n);
          return true;
        }
        case 3:
        // further optimized version of isPrime incorporating stopping at sqrt(n)
        // further optimized version of isPrime
        if (n === 1) {
          return false; // 1 is not prime
        } else if (n === 2) {
          return true; // 2 is prime
        } else if (n % 2 === 0) {
          return false; // even numbers are not prime
        } else {
          // check if n is a prime number by checking if it is divisible by primeNumbers
          for (let i = 0; this.primeNumbers[i] <= sqrt(n); i++) {
            if (n % this.primeNumbers[i] === 0) {
              return false;
            }
          }
          this.primeNumbers.push(n);
          return true;
        }

    }
  }

  // create a new gridSquare and add it to the gridSquares array
  createGridSquare() {
    let varient = this.getVarient(this.previousDirection, this.currentDirection);
    let isPrime = this.isPrime(this.n, this.optimized);
    let gridSquare = new GridSquare(this.x, this.y, isPrime, varient, this.gridSize, this.lineColor, this.optimized);
    this.gridSquares.push(gridSquare);
  }

  // draw the gridSquares
  // draw() {
  //   for (let i = 0; i < this.gridSquares.length; i++) {
  //     this.gridSquares[i].draw();
  //   }
  // }

  // increment n and currentLength
  increment() {
    this.n++;
    this.currentLength++;
  }

  // update x,y coordinates based on current direction
  updateCoordinates(currentDirection) {
    switch (currentDirection) {
      case "start":
      case "right":
        this.x++;
        break;
      case "up":
        this.y--;
        break;
      case "left":
        this.x--;
        break;
      case "down":
        this.y++;
        break;
      default:
        console.error("Invalid direction: " + currentDirection + "at n: " + this.n + "and x,y: " + this.x + "," + this.y);
    }
  }


  // update the previous direction
  updatePreviousDirection(currentDirection) {
    if (currentDirection == "start") {
      this.previousDirection = "right";
    } else {
      this.previousDirection = currentDirection;
    }
  }

  // check if lineLength should change and if so, change lineLength
  checkLineLengthChange(updateLineLength) {
    if (updateLineLength) {
      this.lineLength++;
    }
    this.updateLineLength = !this.updateLineLength;
  }

  // update speed by adding speedMultiplier
  updateSpeed() {
    this.speed += this.speedMultiplier;
  }

  // check if direction should change and if so, change current direction
  checkDirectionChange(currentLength, lineLength, currentDirection) {
    if (currentLength === lineLength) {
      switch (currentDirection) {
        case "start":
        case "right":
          this.currentDirection = "up";
          break;
        case "up":
          this.currentDirection = "left";
          break;
        case "left":
          this.currentDirection = "down";
          break;
        case "down":
          this.currentDirection = "right";
          break;
      }
      this.currentLength = 0;
      this.checkLineLengthChange(this.updateLineLength);
      this.updateSpeed();
    }
  }

  // delete first gridSqare from gridSquares array
  deleteFirstGridSquare() {
    this.gridSquares.shift();
  }

  // run the spiral algorithm at the current speed
  run() {
    for (let i = 0; i < this.speed; i++) {
      this.createGridSquare();
      this.increment();
      this.updateCoordinates(this.currentDirection);
      this.updatePreviousDirection(this.currentDirection);
      this.checkDirectionChange(this.currentLength, this.lineLength, this.currentDirection);
      this.deleteFirstGridSquare();
    }
  }

  // get n
  getN() {
    return this.n;
  }

  // get length of primeNumbers array
  getPrimeNumbersLength() {
    return this.primeNumbers.length;
  }
}
