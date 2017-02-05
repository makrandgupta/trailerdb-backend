'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
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
  content: {
    type: String, 
    required: true
  }
});

commentSchema.set('timestamps', true); // include timestamps in docs

module.exports = mongoose.model('Comment', commentSchema);