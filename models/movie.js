'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

var movieSchema = new Schema({
  name: {
    type: String, 
    required: true,
    unique: true,
    dropDups: true
  },
  description: {
    type: String
  },
  trailer:{
    type: String
  },
  thumbnail: {
    type: String
  },
  director: {
    type: Schema.Types.ObjectId, 
    ref: 'Person'
  },
  actors: [{
    type : Schema.Types.ObjectId, 
    ref: 'Person'
  }]
}, schemaOptions);

movieSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'movie'
});

movieSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'movie'
});

module.exports = mongoose.model('Movie', movieSchema);