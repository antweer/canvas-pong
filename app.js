var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var playerArr = []
var p1score = 0;
var p2score = 0;
var players = 0;

app.set('view engine', 'hbs');

app.use('/socket-io', express.static('node_modules/socket.io-client/dist'));
app.use('/static', express.static('public'));

app.get('/', function (request, response) {
  response.render('index.hbs');
});

io.on('connection', function(client){
  console.log('CONNECTED', client.id);
  playerArr.push(client.id);
  client.emit('player' + playerArr.length);
  players += 1;
  io.emit('playerJoined', players);

  client.on('up', function(){
    client.broadcast.emit('up');
  });

  client.on('down', function(){
    client.broadcast.emit('down');
  });

  client.on('stop', function(){
    client.broadcast.emit('stop');
  });

  client.on('p1', function(){
    p1score++;
    io.emit('score', {'p1s':p1score, 'p2s':p2score});
    console.log('p1 scores');
  });

  client.on('p2', function(){
    p2score++;
    io.emit('score', {'p1s':p1score, 'p2s':p2score});
    console.log('p2 scores');
  });

  client.on('start', function() {
    io.emit('start')
  })

  client.on('disconnect', function () {
    console.log('EXITED');
    players -= 1;
    io.emit('playerLeft');
    let index = playerArr.indexOf(client.id);
    if (index > -1) {
      playerArr.splice(index, 1);
    }
  });
});

http.listen(9005, function(){
  console.log('Listening on port 9005')
});
