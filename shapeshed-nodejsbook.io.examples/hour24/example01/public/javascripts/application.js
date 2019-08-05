var App = App || {};

App.Task = Backbone.Model.extend({
  idAttribute: "_id",
}); 

App.Tasks = Backbone.Collection.extend({
  model: App.Task,
  url: '/api/tasks',
  initialize: function() {
    console.log('集合初始化成功');
  }
});

