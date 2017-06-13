var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'hbs');

app.use('/socket-io', express.static('node_modules/socket.io-client/dist'));
app.use('/static', express.static('public'));

app.get('/', function (request, response) {
  response.render('index.hbs');
});

io.on('connection', function(client){
  console.log('CONNECTED', client.id);

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
  });
});

http.listen(9005, function(){
  console.log('Listening on port 9005')
});
