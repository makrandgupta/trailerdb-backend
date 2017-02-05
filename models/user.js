'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

var userSchema = new Schema({

  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String, 
    required: true
  }

});

userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user'
});

userSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'user'
}, schemaOptions);

userSchema.pre('save', function (next) {  
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.checkPassword = function(pw, cb) {  
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);