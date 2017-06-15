// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var p1score = 0;
var p2score = 0;
var currentPlayer;
var gameText = 'Waiting on another player to join';

// set canvas width and height to width and height of screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var dw = canvas.width/1000;
var dh = canvas.height/1000;


canvas.style.background = 'black';

// socketio listeners
var socket = io();
var players = 0;
socket.on('playerJoined', function(numPlayers){
  console.log(numPlayers);
  if(numPlayers > 1){
    ball.dy = 6*dh;
    ball.dx = 6*dw;
    player1.x = 10*dw;
    player1.y = (canvas.height/2)-(75*dh);
    player1.speed = 8 * (dw + dh)/2;
    player2.x = canvas.width - 30*dw;
    player2.y = (canvas.height/2)-(75*dh);
    player2.speed = 8 * (dw + dh)/2;
    gameLoop();
    gameText = '';
  }
});

socket.on('playerLeft', function(numPlayers){
  console.log(numPlayers);
  if(numPlayers <= 1){
    ball.dy = 0;
    ball.dx = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    player1.x = 10*dw;
    player1.y = (canvas.height/2)-(75*dh);
    player1.speed = 0;
    player2.x = canvas.width - 30*dw;
    player2.y = (canvas.height/2)-(75*dh);
    player2.speed = 0;
    gameText = 'Player has left. Waiting on another player to join.';
  }
});

socket.on('up', function() {
  player1.moveup();
});
socket.on('down', function() {
  player1.movedown();
});
socket.on('stop', function() {
  player1.stop();
});
socket.on('up2', function() {
  player2.moveup();
});
socket.on('down2', function() {
  player2.movedown();
});
socket.on('stop2', function() {
  player2.stop();
});
socket.on('player1', function() {
  currentPlayer = 'p1';
});
socket.on('player2', function() {
  currentPlayer = 'p2';
});
socket.on('score', function(data) {
  p1score = data.p1s;
  p2score = data.p2s;
});

//defines Paddles
class Paddle {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = 20 * dw;
    this.height = 150 * dh;
    this.color = 'white';
    this.dy = 0;
    this.speed = speed * (dw + dh / 2);

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
    this.dx = 0;
    this.dy = 0;
    this.radius = 20 * (dw+dh/2);
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
        socket.emit(currentPlayer);
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        // randomize later
        this.dy = 5*(dw+dh)/2;
      }
      if (this.x - this.radius < 0) {
        socket.emit(currentPlayer);
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.dy = 5*(dw+dh)/2;
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }

      this.x += this.dx;
      this.y += this.dy;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

// JS listeners
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
  if (event.keyCode == 38 && currentPlayer == 'p1') {
    player1.moveup();
    socket.emit('up');
  }
  if (event.keyCode == 38 && currentPlayer == 'p2') {
    player2.moveup();
    socket.emit('up2');
  }
  if(event.keyCode == 40 && currentPlayer == 'p1') {
    player1.movedown();
    socket.emit('down');
  }
  if(event.keyCode == 40 && currentPlayer == 'p2') {
    player2.movedown();
    socket.emit('down2');
  }
});
window.addEventListener('keyup', function(event){
  if (currentPlayer == 'p1') {
    if (event.keyCode == 38 || event.keyCode == 40) {
      player1.dy = 0;
      socket.emit('stop');
    }
  }
  if (currentPlayer == 'p2') {
    if (event.keyCode == 38 || event.keyCode == 40) {
      player2.dy = 0;
      socket.emit('stop2');
    }
  }
});

var start = document.getElementById('start');

//Game logic
var player1 = new Paddle(10, (canvas.height/2)-75*dh, 8*(dw+dh)/2);
var player2 = new Paddle(canvas.width - 30, (canvas.height/2)-75*dh, 8*(dw+dh)/2);
var ball = new Ball(canvas.width/2, canvas.height/2);

start.addEventListener('click', function() {
  socket.emit('start');
  gameLoop();
});

function gameLoop() {
  // removes start button
  start.style.display = 'none';


  player1.draw();
  player2.draw();

  // game loop
  function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      player1.draw(player1.dy);
      player2.draw(player2.dy);
      ball.update();

      ctx.font = "50px Arial";
      ctx.fillStyle = 'white';
      ctx.fillText(p1score, 100*dw, 50*dh);
      ctx.fillText(p2score, canvas.width - 100*dw, 50*dh);
      ctx.fillText(gameText, 50*dw, canvas.height - 100*dh);
  }

  animate();
}
