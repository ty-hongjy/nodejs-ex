var express = require('express'),
//routes = require('./routes'),
http = require('http'),
path = require('path'),
favicon = require('serve-favicon'),
methodOverride = require('method-override'),
morgan = require('morgan'),
router = express.Router();
bodyParser = require('body-parser'),
errorHandler = require('errorhandler'),
mongojs = require("mongojs");

var app = express();

//var databaseUrl = "localhost:27017/backbone_tasks";
var db = mongojs('backbone_tasks', ['tasks']);

app.use(bodyParser());
app.use(errorHandler({dumpExceptions: true, showStack: true})); 
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  db.tasks.find().sort({ $natural: -1 }, function(err, tasks) {
    res.render('index.jade', { 
      tasks: JSON.stringify(tasks),
      layout: false
    });
  });
});

app.get('/api/tasks', function(req, res){
  db.tasks.find().sort({ $natural: -1 }, function(err, tasks) {
    res.json(tasks);
  });
});

app.get('/api/tasks/:id', function(req, res){
  db.tasks.findOne( { _id: db.ObjectId(req.params.id) } , function(err, task) {
    res.json(task);
  });
});

app.post('/api/tasks', function(req, res){
  db.tasks.save(req.body, function(err, task) {
    res.json(task, 201);
  });
});

app.put('/api/tasks/:id', function(req, res){
  db.tasks.update( { _id: db.ObjectId(req.params.id) }, { $set: { title: req.body.title } }, function(err, task) {
    res.json(200);
  });
});

app.delete('/api/tasks/:id', function(req, res){
  db.tasks.remove( { _id: db.ObjectId(req.params.id) }, function(err) {
    res.send();
  });
});

app.listen(3000);
