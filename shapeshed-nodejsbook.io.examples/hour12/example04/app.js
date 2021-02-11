var http = require('http'),
  fs = require('fs');
  //var jsdom = require("jsdom");  
  //var window = jsdom.jsdom().defaultView;  
  //var $ = require('jquery');//(window); 
var $ = require("jquery");
var server = http.createServer(function (req, res) {
  fs.readFile('./index.html', function(error, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data, 'utf-8');
  });
}).listen(3000, "0.0.0.0");
console.log('Server running at http://127.0.0.1:3000/');

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('ping', function (data) {
    console.log('Received PING. Sending PONG..');
    socket.emit('pong', { text: 'pong' });
  });

  socket.on('pong', function (data) {
    console.log('Received PONG response. PONG!');
  });

 // setInterval(function() {
 //   console.log('Sending PING to client..');
 //   socket.emit('ping', { text: 'PING' });
 // }, 10000);
});
