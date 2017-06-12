// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

class DrawRectangle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    var width = 100;
    var height = 200;
    var color = 'black';
    var dy = 5;
  }

  draw (y = 0){
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y + y, width, height);
  }
}

// defines Circle object
class Circle {
  constructor (x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = 10;
    this.dy = 10;
    this.radius = 100;
    var color = 'black';
  }

  update() {
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
        console.log('GAME OVER');
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy
      }
      this.x += this.dx;
      this.y += this.dy;

      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      context.fillStyle = color;
      context.fill();
    }
  }

// set canvas width and height to width and height of screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// resize canvas on screen resize
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

//Game logic
