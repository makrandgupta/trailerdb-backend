var jwt = require('restify-jwt');

module.exports = function(server, logger) {
  
  // Sample route
  server.get('/bazinga', jwt({secret: process.env.JWT_SECRET}), function (req, res, next) {
    res.send({ 'result': 'test' });      
    return next();
  });
  
};