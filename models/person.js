'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var personSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['director', 'actor']
  }
});

module.exports = mongoose.model('Person', personSchema);