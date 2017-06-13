// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var p1score = 0;
var p2score = 0;
var currentPlayer;

// set canvas width and height to width and height of screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.background = 'black';

// setup socketio
var socket = io();

socket.on('up', function() {
  player2.moveup();
  console.log('you pressed up');
});
socket.on('down', function() {
  player2.movedown();
  console.log('you pressed down');
});
socket.on('stop', function() {
  player2.stop();
  console.log('you pressed down');
});

//defines Paddles
class Paddle {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 150;
    this.color = 'white';
    this.dy = 0;
    this.speed = speed;

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

  moveup() {
    this.dy = -this.speed;
  }

  movedown() {
    this.dy = this.speed;
  }

  stop() {
    this.dy = 0;
  }
}

// defines Ball object
class Ball {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.dx = 6;
    this.dy = 6;
    this.radius = 20;
    this.color = 'white';
  }

  update() {
      if (this.x - this.radius <= player1.x + player1.width && this.x - this.radius >= player1.x
        && this.y + this.radius >= player1.y && this.y - this.radius <= player1.y + player1.height) {
        this.dy = this.dy + player1.dy;
        this.dx = -this.dx;
      }
      if (this.x + this.radius >= player2.x && this.x - this.radius <= canvas.width - (player2.width + 10)
        && this.y + this.radius >= player2.y && this.y - this.radius <= player2.y + player2.height) {
        this.dy = this.dy + player1.dy;
        this.dx = -this.dx;
      }
      if (this.x + this.radius > canvas.width) {
        p1score += 1
        this.x = canvas.width/2
        this.y = canvas.height/2
        this.dy = Math.floor(this.dy*Math.random());
      }
      if (this.x - this.radius < 0) {
        p2score += 1
        this.x = canvas.width/2
        this.y = canvas.height/2
        this.dy = Math.floor(this.dy*Math.random());
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

// listener section
window.addEventListener('touchmove', function(event) {
  if (event.offsetY > player1.y + player1.height/2) {
    player1.dy = player1.speed;
  }
  else if (event.offsetY < player1.y - player1.height/2) {
    player1.dy = -player1.speed;
  }
});
window.addEventListener('touchend', function(event) {
  player1.dy = 0;
});
window.addEventListener('keydown', function(event){
  if (event.keyCode == 38) {
    player1.moveup();
    socket.emit('up');
  }
  else if(event.keyCode == 40) {
    player1.movedown();
    socket.emit('down');
  }
});
window.addEventListener('keyup', function(event){
  if (event.keyCode == 38 || event.keyCode == 40) {
    player1.dy = 0;
    socket.emit('stop');
  }
});

//Game logic
var player1 = new Paddle(10, (canvas.height/2)-75, 8);
var player2 = new Paddle(canvas.width - 30, (canvas.height/2)-75, 8);
var ball = new Ball(canvas.width/2, canvas.height/2)
player1.draw();
player2.draw();

// game loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player1.draw(player1.dy);

    player2.draw(player2.dy);
    ball.update();
    ctx.font = "50px Arial"
    ctx.fillStyle = 'white';
    ctx.fillText(p1score, 100, 50);
    ctx.fillText(p2score, canvas.width - 100, 50);
}

animate();
