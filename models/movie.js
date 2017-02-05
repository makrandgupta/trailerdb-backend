'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
  // movie_id: {type: String, required: true, index: true, unique: true},
  name: {
    type: String, 
    required: true
  },
  director: {
    type: Schema.Types.ObjectId, 
    ref: 'Person'
  },
  actors: [{
    type : Schema.Types.ObjectId, 
    ref: 'Person'
  }]
});

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