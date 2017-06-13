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

http.listen(8000, function(){
  console.log('Listening on port 8000')
});