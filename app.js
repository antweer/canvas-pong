var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var playerArr = []

app.set('view engine', 'hbs');

app.use('/socket-io', express.static('node_modules/socket.io-client/dist'));
app.use('/static', express.static('public'));

app.get('/', function (request, response) {
  response.render('index.hbs');
});

io.on('connection', function(client){
  console.log('CONNECTED', client.id);
  playerArr.push(client.id);
  client.emit('player' + playerArr.length)

  client.on('up', function(){
    client.broadcast.emit('up');
  });

  client.on('down', function(){
    client.broadcast.emit('down');
  });

  client.on('stop', function(){
    client.broadcast.emit('stop');
  });

  client.on('disconnect', function () {
    console.log('EXITED');
    let index = playerArr.indexOf(client.id);
    if (index > -1) {
      playerArr.splice(index, 1);
    }

  });
});

http.listen(8000, function(){
  console.log('Listening on port 8000')
});
