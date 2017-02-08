/* global process:true, __dirname:true */

'use strict';

var path    = require('path'),
    restify = require('restify'),
    jwt = require('restify-jwt'),
    config  = require('config'),
    models  = require('./models'),
    routes  = require('./routes');


exports.createServer = createServer;

/*Set appRoot*/
global.appRoot = path.resolve(__dirname);

/*
 * Set up server
 * @return the created server
 */
function createServer (logger) {

  var settings = {
    name: (config.has('server.name') && config.get('server.name'))
            ? config.get('server.name')
            : require(path.join(__dirname, 'package')).name
  };

  if (logger) settings.log = logger;

  var server = restify.createServer(settings);

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser({
    mapParams: true,
    mapFiles: false,
    overrideParams: false,
    keepExtensions: true,
    multiples: true
  }));

  var unprotected_endpoints = {
    path: [
      '/',
      /\/video/i
    ]
  }
  server.use(jwt({secret: process.env.JWT_SECRET}).unless(unprotected_endpoints));


  server.on('NotFound', function (req, res, next) {
    if (logger) {
      logger.debug('404', 'No route that matches request for ' + req.url);
    }
    res.send(404, req.url + ' was not found');
  });
  
  if (logger) server.on('after', restify.auditLogger({ log: logger }));
  
  models(server, logger);
  routes(server, logger);

  return server;
}
