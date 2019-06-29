var express = require('express');
var mongoose = require('mongoose');
// routes = require('./routes'),
 //user = require('./routes/user'),
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

  app.use(bodyParser());
  app.use(methodOverride());
  app.use(router);

if ('development' === app.get('env')) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true })); 
  mongoose.connect('mongodb://localhost:27017/todo_development', {useNewUrlParser: true});
  app.listen(3000,"0.0.0.0");
};

if ('test' === app.get('env')) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
mongoose.connect('mongodb://localhost:27017/todo_test', {useNewUrlParser: true});
  app.listen(3001,"0.0.0.0");
};

console.log("Express server listening on port %d in %s mode", app.get("port"),app.settings.env);
