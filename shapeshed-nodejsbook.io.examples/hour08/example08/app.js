/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/todo_development');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TaskSchema = new Schema({
  task: String
});

var Task = mongoose.model('Task', TaskSchema);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/tasks', function(req, res){
  Task.find({}, function (err, docs) {
    res.render('tasks/index', {
      title: 'Tasks index view',
      docs: docs
    });
  });
});

app.get('/tasks/new', function(req, res){
  res.render('tasks/new.jade', {
    title: 'New task view'
  });
});

app.post('/tasks', function(req, res){
  var task = new Task(req.body.task);
  task.save(function (err) {
    if (!err) {
      res.redirect('/tasks');
    }
    else {
      res.redirect('/tasks/new');
    }
  });
});

app.get('/tasks/:id/edit', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    res.render('tasks/edit', {
      title: 'Edit Task View',
      task: doc
    });
  });
});

app.put('/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    doc.updated_at = new Date();
    doc.task = req.body.task.task;
    doc.save(function(err) {
      if (!err){
        res.redirect('/tasks');
      }
      else {
        console.err(err);
      }
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
