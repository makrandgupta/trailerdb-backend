/* global __dirname:true */
   
var fs   = require('fs'),
    path = require('path');

var models = [
  'comment',
  'person',
  'movie',
  'rating',
  'user'
];

module.exports = function(server, logger) {
  
  models.forEach(function (model) {
    try {
      require(path.join(__dirname, model));
    } catch (err) {
      throw new Error("Can't load '" + model + "' model");
    }
  });
};