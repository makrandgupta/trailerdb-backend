module.exports = function(server, logger) {
  
  // Sample route
  server.get('/bazinga', function (req, res, next) {
    res.send({ 'result': 'test' });      
    return next();
  });
  
};
