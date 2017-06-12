// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

class drawRectangle{
  constructor(x, y){
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