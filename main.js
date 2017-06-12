// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

//defines Paddles
class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 150;
    this.color = 'black';
    this.dy = 5;

  }

  draw (dy = 0){
    ctx.fillStyle = this.color;

    if  (this.y + this.height <= canvas.height && this.y >= 0){
      this.y = this.y + dy;
    }
    else if(this.y <= 0){
      this.y = 0;
    }
    else{
      this.y = canvas.height - this.height;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// defines Ball object
class Ball {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.dx = 7;
    this.dy = 7;
    this.radius = 20;
    this.color = 'black';
  }

  update() {
      if (this.x - this.radius <= player.x + player.width && this.x - this.radius >= 0
        && this.y + this.radius >= player.y && this.y + this.radius <= player.y + player.height) {
        // this.dy = this.dy - player.dy;
        this.dx = -this.dx;
        console.log('HIT');
      }
      if (this.x + this.radius >= ai.x && this.x - this.radius <= canvas.width
        && this.y + this.radius >= ai.y && this.y + this.radius <= ai.y + ai.height) {
        // this.dy = this.dy - player.dy;
        this.dx = -this.dx;
        console.log('AI HIT');
      }
      if (this.x + this.radius > canvas.width) {
        console.log('Player Wins');
      }
      if (this.x - this.radius < 0) {
        console.log('Bot Wins');
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy
      }

      this.x += this.dx;
      this.y += this.dy;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

// set canvas width and height to width and height of screen
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight;

// resize canvas on screen resize
// window.addEventListener('resize', function() {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   draw();
// });

//Game logic
var player = new Paddle(10, (canvas.height/2)-75);
var ai = new Paddle(canvas.width - 30, (canvas.height/2)-75);
var ball = new Ball(canvas.width/2, canvas.height/2)
player.draw();
ai.draw();

var dy, aidy;
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.addEventListener('mousemove', function(event) {
      if (event.offsetY > player.y + player.height) {
        dy = player.dy;
      }
      else if (event.offsetY < player.y) {
        dy = -player.dy;
      } else {
        dy = 0;
      }
    });
    window.addEventListener('keydown', function(event){
      if (event.keyCode == 38) {
        dy = -player.dy;
      }
      else if(event.keyCode == 40) {
        dy = player.dy;
      }
    });
    window.addEventListener('keyup', function(event){
      if (event.keyCode == 38 || event.keyCode == 40) {
        dy = 0;
      }
    });
    player.draw(dy);
    if(ball.y > ai.y + ai.height/2){
      aidy = ai.dy;
    } else {
      aidy = -ai.dy;
    }
    ai.draw(aidy);
    ball.update();
}

animate();
