/**
 * Module dependencies.
 */
/*
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose');
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

//mongoose.connect('mongodb://localhost/todo_development');
mongoose.connect('mongodb://local/todo_development');
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
//app.use(express.favicon());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

// parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: false }))  
// parse application/json  
app.use(bodyParser.json())  
//app.use(bodyParser());

app.use(methodOverride());
app.use(router);
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);

app.get('/tasks', function(req, res){
  Task.find({}, function (err, docs) {
    res.render('tasks/index', {
      title: 'Todos index view',
      docs: docs
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
