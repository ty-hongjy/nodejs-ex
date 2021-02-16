var http = require('http'),
  fs = require('fs');
const url = require('url');

var server = http.createServer(function (req, res) {
	fs.readFile('./index.html', function(error, data) {
    console.log("index");
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data, 'utf-8');
 });
  // fs.readFile('./js/jquery.js', function(error, data) {
    // if(error){
	// 	console.error("jquery",error)}
	// console.log("jquery");
	// // res.writeHead(200, { 'Content-Type': 'application/x-javascript'})
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.end(data, 'utf-8');
 // });
 
}).listen(3000, "0.0.0.0");
console.log('Server running at http://127.0.0.1:3000/');

var io = require('socket.io').listen(server);
// var jquery.listen(server);
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
