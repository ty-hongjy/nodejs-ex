var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  errorHandler = require('errorhandler'),
  nicknames = [];

app.set('port', process.env.PORT || 3000);
// app.configure(function(){
//   app.set('views', __dirname + '/views');
//   app.set('view engine', 'jade');
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(require('stylus').middleware({ src: __dirname + '/public' }));
//   app.use(app.router);
app.use(express.static(__dirname + '/public'));
// });

if ('development' === app.get('env')) {
  app.use(errorHandler());
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

  socket.on('nickname', function (data) {
    nicknames.push(data);
    socket.nickname = data;
    console.log('Nicknames are ' + nicknames);
  });

  socket.on('disconnect', function () {
    if (!socket.nickname) { return; }
    if (nicknames.indexOf(socket.nickname) > -1) {
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    }
    console.log('Nicknames are ' + nicknames);
  });

});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
