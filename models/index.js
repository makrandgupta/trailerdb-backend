/* global __dirname:true */
   
var fs   = require('fs'),
    path = require('path');
    
function initialize(server, logger) {
  
  server.get('/', function (req, res, next) {
    res.send({ 'message': 'Restify is online and operational.' });      
    return next();
  });
  
};

var routes = [
  'comment',
  'person',
  'movie',
  'rating',
  'user'
];

module.exports = function(server, logger) {
  initialize(server, logger);
  
  routes.forEach(function (route) {
    try {
      require(path.join(__dirname, route));
    } catch (err) {
      throw new Error("Can't load '" + route + "' route");
    }
  });
};