'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var min = [1, 'Rating ({VALUE}) is below the min allowed rating of ({MIN}).'];
var max = [5, 'Rating ({VALUE}) is above the max allowed rating of ({MAX}).'];

var ratingSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId, 
    ref: 'Movie', 
    required: true
  },
  user: {
    type : Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  rating: {
    type: Number, 
    required: true, 
    min: min, 
    max: max
  }
});

ratingSchema.set('timestamps', true); // include timestamps in docs

module.exports = mongoose.model('Rating', ratingSchema);