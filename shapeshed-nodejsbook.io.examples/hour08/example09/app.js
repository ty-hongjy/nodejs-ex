/**
 * Module dependencies.
 */

  
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  favicon = require('serve-favicon'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  router = express.Router();
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler'),
  mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost:27017/todo_development', {useNewUrlParser: true});
//mongoose.connect('mongodb://localhost/todo_development');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Task = new Schema({
  task: String
});

var Task = mongoose.model('Task', Task);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: false }))  
// parse application/json  
app.use(bodyParser.json())  
//app.use(bodyParser());

app.use(methodOverride());
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
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

app.del('/tasks/:id', function(req, res){
  Task.findOne({ _id: req.params.id }, function(err, doc) {
    doc.remove(function() {
      res.redirect('/tasks');
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
