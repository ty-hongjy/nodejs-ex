var express = require('express'),
  app = express(),
  routes = require('./routes'),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  router = express.Router();
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler'),
  nicknames = [];

app.set('port', process.env.PORT || 3000);

io.sockets.on('connection', function (socket) {
  socket.on('nickname', function (data, callback) {
    if (nicknames.indexOf(data) !== -1) {
      callback(false);
    } else {
      callback(true);
      nicknames.push(data);
      socket.nickname = data;
      console.log('Nicknames are ' + nicknames);
      io.sockets.emit('nicknames', nicknames);
      socket.broadcast.emit('announcement', {
        nick: 'system',
        message: data + ' connected'
      });
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
    if (nicknames.indexOf(socket.nickname) > -1) {
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    }
    console.log('Nicknames are ' + nicknames);
    socket.broadcast.emit('announcement', {
      nick: 'system',
      message: socket.nickname + ' disconnected'
    });
    io.sockets.emit('nicknames', nicknames);
  });
});

// Configuration

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(bodyParser());
  app.use(methodOverride());
  app.use(router);
  //app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
};

if (app.get('env') === 'production') {
  app.use(errorHandler());
};

// Routes
app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
