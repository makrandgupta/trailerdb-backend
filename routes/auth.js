var nJwt = require('njwt');
var User = require(appRoot + '/models/user');
var signingKey = process.env.JWT_SECRET || 'SomeSecretKey';

module.exports = function(server, logger) {
  
  server.post('/login', function (req, res, next) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ 
          success: false, 
          message: 'Auth failed: User not found' 
        });
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
            // return the information including token as JSON
            res.json({
              success: true,
              token: token.compact()
            });
          }
          else 
            res.send("no match");
        });
        
      }

    });

  });

  // for now, to log out a user, simply delete jwt from frontend

  server.post('/signup', function (req, res, next) {
    //check if username is taken

    logger.debug(req.body);
    
    User.findOne({
      username: req.body.username
    }, function(err, user) {

    logger.debug("Signup endpoint hit");
      if (err) throw err;

      if (user) {
        res.json({ 
          success: false, message: 'Signup failed. Username is taken.' 
        });
      } 

      else if (!user) {


        var new_user = new User({ 
          username: req.body.username, 
          password: req.body.password, 
        });

        new_user.save(function(err) {
          if (err) throw err;

          logger.info('New user created: ' + req.body.username);
          res.json({ success: true });
        });

      }

    });
 
  });
  
};
