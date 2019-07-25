var express = require('express'),
  mongoose = require('mongoose'),
  http = require('http'),
  path = require('path'),
  favicon = require('serve-favicon'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  router = express.Router();
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler');

var app = express();
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskSchema = new Schema({
  task : { 
    type: String, 
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at : Date
});

var Task = mongoose.model('Task', TaskSchema);

app.set('address', '0.0.0.0');
app.set('env','test');

app.use(bodyParser());
app.use(methodOverride());
app.use(router);

if ('development' === app.get('env')) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true })); 
  mongoose.connect('mongodb://localhost:27017/todo_development', {useNewUrlParser: true});
  app.set('port', process.env.PORT || 3000);
  app.listen(3000,"0.0.0.0");
};

if ('test' === app.get('env')) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect('mongodb://localhost:27017/todo_test', {useNewUrlParser: true});
  app.set('port', process.env.PORT || 3001);
  app.listen(3001,"0.0.0.0");
};

app.get('/api/v1/tasks', function(req, res, next){
  Task.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.post('/api/v1/tasks', function(req, res){
  var doc = new Task(req.body.task);
  doc.save(function (err) {
    if (!err) {
      res.send(doc);
    } else {
      res.send(err, 422);
    }
  });
});

app.get('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (doc) {
      res.send(doc);
    } else {
      res.send(404);
    }
  });
});

app.put('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (!doc) {
      res.send(404)
    } else {
      doc.updated_at = new Date();
      doc.task = req.body.task.task;
      doc.save(function (err) {
        if (!err) {
          res.send(doc);
        } else {
          res.send(err, 422);
        }
      });
    }
  });
});

app.del('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (doc) {
      doc.remove(function() {
        res.send(200)
      });
    } else {
      res.send(404)
    }
  });
});

console.log("Express server listening on port %d in %s mode", app.get("port"),app.settings.env);
