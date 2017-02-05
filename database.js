'use strict';

var mongoose = require('mongoose');
var path = require('path');

// var config = require(path.join(__dirname, '/config/config'));
// var log = require(path.join(__dirname, 'log'));

module.exports = function (logger) {
  var db_url = ''.concat(process.env.MONGO_URI);
  mongoose.connect(db_url);
  var db = mongoose.connection;
  db.on('connected', function () {
    logger.info('Mongodb connection open to ' + db_url);
  });
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + db_url);
  });
  db.on('disconnected', function () {
    logger.info('Mongodb connection disconnected');
  });
  process.on('SIGINT', function () {
    db.close(function () {
      logger.info('Mongodb connection disconnected through app termination');
      process.exit(0);
    });
  });
};