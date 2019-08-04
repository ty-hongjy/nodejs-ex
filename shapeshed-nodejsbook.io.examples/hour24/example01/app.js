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
//mongoose = require('mongoose'),
mongojs = require("mongojs");

var app = express();

//var databaseUrl = "localhost:27017/backbone_tasks";
var db = mongojs('backbone_tasks', ['tasks']);

app.use(bodyParser());
app.use(errorHandler({dumpExceptions: true, showStack: true})); 
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(morgan('dev'));

app.get('/', function(req, res){
  res.render('index.jade', { 
    layout: false
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

app.del('/api/tasks/:id', function(req, res){
  db.tasks.remove( { _id: db.ObjectId(req.params.id) }, function(err) {
    res.send();
  });
});

app.listen(3000);
/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/