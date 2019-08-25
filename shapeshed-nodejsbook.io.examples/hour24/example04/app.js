var express = require('express'),
http = require('http'),
path = require('path'),
favicon = require('serve-favicon'),
methodOverride = require('method-override'),
morgan = require('morgan'),
router = express.Router();
bodyParser = require('body-parser'),
errorHandler = require('errorhandler'),
//mongoose = require('mongoose'),
mongojs = require("mongojs");

db = mongojs('backbone_tasks', ['tasks']);

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler({dumpExceptions: true, showStack: true})); 

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
