var http = require('http'),
  fs = require('fs');
const url = require('url');

var server = http.createServer(function (req, res) {
let pathName = url.parse(req.url).pathname;
    console.log("1",pathName);
    pathName = pathName=='./'?'index.html':pathName;
    console.log("2",pathName);

	if(pathName!='/favicon.ico'){ 
        // fs.readFile('static/'+pathName,function(err,data){
        fs.readFile('./'+pathName,function(err,data){
            if(err){ 
                console.log('404');
            }else{
                res.writeHead(200,{"Content-Type":"text/html;charset='utf-8'"});
                res.write(data);
                res.end(); 
            }
        })
    }
 
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
