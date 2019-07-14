//var express = require('express');
//var app = module.exports = express.createServer();

const express = require('express')
const app = module.exports = express.createServer();

//var express = require("express"),
 // app = express();

//const express = require('express')
//const app = express()
//var http = require('http');
  //server = http.createServer(app);
  //*/

var rebels = [
  { name: 'Han Solo' },
  { name: 'Luke Skywalker' },
  { name: 'C-3PO' },
  { name: 'R2-D2' },
  { name: 'Chewbacca' },
  { name: 'Princess Leia' }
];

app.get('/', function(req, res, next){
  res.send(rebels);
});

app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
