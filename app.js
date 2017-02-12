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
  server.use(restify.CORS({
      headers: [
          'authorization',
          'x-total-count',
          'link'
      ]
  }));
  restify.CORS.ALLOW_HEADERS.push( "authorization");
  restify.CORS.ALLOW_HEADERS.push( "withcredentials");
  restify.CORS.ALLOW_HEADERS.push( "x-requested-with");
  restify.CORS.ALLOW_HEADERS.push( "x-forwarded-for");
  restify.CORS.ALLOW_HEADERS.push( "x-real-ip");
  restify.CORS.ALLOW_HEADERS.push( "x-customheader");
  restify.CORS.ALLOW_HEADERS.push( "user-agent");
  restify.CORS.ALLOW_HEADERS.push( "keep-alive");
  restify.CORS.ALLOW_HEADERS.push( "host");
  restify.CORS.ALLOW_HEADERS.push( "accept");
  restify.CORS.ALLOW_HEADERS.push( "connection");
  restify.CORS.ALLOW_HEADERS.push( "upgrade"              );
  restify.CORS.ALLOW_HEADERS.push( "content-type");
  restify.CORS.ALLOW_HEADERS.push( "dnt"); // Do not track
  restify.CORS.ALLOW_HEADERS.push( "if-modified-since");
  restify.CORS.ALLOW_HEADERS.push( "cache-control");

  // Manually implement the method not allowed handler to fix failing preflights
  //
  server.on( "MethodNotAllowed", function( request, response ) {
      if ( request.method.toUpperCase() === "OPTIONS" ) {
          response.header( "Access-Control-Allow-Credentials", true                                    );
          response.header( "Access-Control-Allow-Headers",     restify.CORS.ALLOW_HEADERS.join( ", " ) );
          response.header( "Access-Control-Allow-Methods",     "GET, POST, PUT, DELETE, OPTIONS"       );
          response.header( "Access-Control-Allow-Origin",      request.headers.origin                  );
          response.header( "Access-Control-Max-Age",           0                                       );
          response.header( "Content-type",                     "text/plain charset=UTF-8"              );
          response.header( "Content-length",                   0                                       );
          response.send( 204 );
      }
      else {
          response.send( new restify.MethodNotAllowedError() );
      }
  });

  server.use(restify.urlEncodedBodyParser({ mapParams : false }));

  var unprotected_endpoints = {
    path: [
      '/',
      '/auth/login',
      '/auth/signup',
      // /\/video/i
    ]
  };

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
