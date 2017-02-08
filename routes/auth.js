var nJwt = require('njwt');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var signingKey = process.env.JWT_SECRET || 'SomeSecretKey';

module.exports = function(server, logger) {
  server.get('/auth/account', function (req, res, next) {

    User.findOne({
      username: req.user.preferred_username
    }, function (err, user) {
      if(err) throw err;

      if(!user){
        res.json({
          success: false,
          message: "User not found"
        });
        next();
      } else {
        res.json({
          success: true,
          data: {
            username: user.username,
            email: user.email
          }
        });
        next();
      }
    });
  });

  server.post('/auth/login', function (req, res, next) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ 
          success: false, 
          message: 'Auth failed: User not found' 
        });
        return next();
      } 

      else if (user) {

        user.checkPassword(req.body.password, function (err, match) {
          if(err) throw err;

          if(match){

            // create a token
            var payload = {
              iss: "TrailerDb",
              type: "user",
              preferred_username: user.username,
              scope: "view, rate, comment"
            };

            var token = nJwt.create(payload, signingKey);
            res.json({
              success: true,
              token: token.compact()
            });
            return next();
          }
          else {
            res.json({
              success: false, 
              message: 'Auth failed: Incorrect password' 
            });
            return next();
          }

        });
        
      }

    });

  });

  // for now, to log out a user, simply delete jwt from frontend

  server.post('/auth/signup', function (req, res, next) {
    //check if username is taken

    User.findOne({
      username: req.body.username
    }, function(err, user) {

    logger.debug("Signup endpoint hit");
      if (err) throw err;

      if (user) {
        res.json({ 
          success: false, message: 'Signup failed. Username is taken.' 
        });
        return next();
      } 

      else if (!user) {


        var new_user = new User({ 
          username: req.body.username, 
          password: req.body.password, 
        });

        new_user.save(function(err) {
          if (err) throw err;

          logger.info('New user created: ' + req.body.username);
          res.json({ 
            success: true 
          });
          return next();
        });

      }

    });
 
  });
  
};
