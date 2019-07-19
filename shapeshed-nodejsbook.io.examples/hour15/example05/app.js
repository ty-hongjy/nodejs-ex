const express = require('express'),
 app = express(),
 errorHandler = require('errorhandler'),
 http = require('http'),
 server = http.createServer(app);
  
var rebels = [
  { name: 'Han Solo' },
  { name: 'Luke Skywalker' },
  { name: 'C-3PO' },
  { name: 'R2-D2' },
  { name: 'Chewbacca' },
  { name: 'Princess Leia' }
];

app.set('port', process.env.PORT || 3000);
app.set('address', '0.0.0.0');

app.get('/', function(req, res, next){
  res.send(rebels);
});

app.use(errorHandler({ dumpExceptions: true, showStack: true })); 

server.listen(3000,app.get('address'));
console.log("Express server listening on address %s port %d in %s mode", app.get('address'), app.get('port'), app.settings.env);
