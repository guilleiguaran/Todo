const app = require('angular').module('todomvc')
app.factory('todoStorage', require('./todoStorage').todoStorage)
app.factory('api', require('./todoStorage').api)
app.factory('localStorage', require('./todoStorage').localStorage)
