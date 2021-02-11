var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  $ = require("jquery"),
  path = require('path'),
  nicknames = [];

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '')));//指定app使用该静态路径
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('nickname', function (data, fn) {
    if (nicknames.indexOf(data) !== -1) {
      fn(true);
    } else {
      fn(false);
      nicknames.push(data);
      socket.nickname = data;
      io.sockets.emit('nicknames', nicknames);
    }
  });
  socket.on('user message', function (data) {
    io.sockets.emit('user message', {
      nick: socket.nickname,
      message: data
    });
  });
  socket.on('disconnect', function () {
    if (!socket.nickname) { return; }
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
  });
});

// server.listen(app.get('port'), function(){
server.listen(app.get('port'),'0.0.0.0', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
