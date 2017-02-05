var namespace = require('restify-namespace');
var restifyMongoose = require('restify-mongoose');
var jwt = require('restify-jwt');
var mongoose = require('mongoose');

var Movie = mongoose.model('Movie');
var movies = restifyMongoose(Movie);

var User = mongoose.model('User');
var users = restifyMongoose(User);

var Comment = mongoose.model('Comment');
var comments = restifyMongoose(Comment);

var Rating = mongoose.model('Rating');
var ratings = restifyMongoose(Rating);

var Person = mongoose.model('Person');
var persons = restifyMongoose(Person);

module.exports = function(server, logger) {
    server.get('/movie/list', jwt({secret: process.env.JWT_SECRET}), movies.query({populate: 'director,actors,comments,ratings'}));
    server.get('/movie/:id', jwt({secret: process.env.JWT_SECRET}), movies.detail({populate: 'director,actors,comments,ratings'}));
    server.post('/movie', jwt({secret: process.env.JWT_SECRET}), movies.insert());
    server.patch('/movie/:id', jwt({secret: process.env.JWT_SECRET}), movies.update());
    server.del('/movie/:id', jwt({secret: process.env.JWT_SECRET}), movies.remove()); 

    server.get('/user/list', jwt({secret: process.env.JWT_SECRET}), users.query({populate: 'comments,ratings'}));
    server.get('/user/:id', jwt({secret: process.env.JWT_SECRET}), users.detail({populate: 'comments,ratings'}));
    server.post('/user', jwt({secret: process.env.JWT_SECRET}), users.insert());
    server.patch('/user/:id', jwt({secret: process.env.JWT_SECRET}), users.update());
    server.del('/user/:id', jwt({secret: process.env.JWT_SECRET}), users.remove()); 

    server.get('/comment/list', jwt({secret: process.env.JWT_SECRET}), comments.query({populate: 'movie,user'}));
    server.get('/comment/:id', jwt({secret: process.env.JWT_SECRET}), comments.detail({populate: 'movie,user'}));
    server.post('/comment', jwt({secret: process.env.JWT_SECRET}), comments.insert());
    server.patch('/comment/:id', jwt({secret: process.env.JWT_SECRET}), comments.update());
    server.del('/comment/:id', jwt({secret: process.env.JWT_SECRET}), comments.remove()); 

    server.get('/rating/list', jwt({secret: process.env.JWT_SECRET}), ratings.query({populate: 'movie,user'}));
    server.get('/rating/:id', jwt({secret: process.env.JWT_SECRET}), ratings.detail({populate: 'movie,user'}));
    server.post('/rating', jwt({secret: process.env.JWT_SECRET}), ratings.insert());
    server.patch('/rating/:id', jwt({secret: process.env.JWT_SECRET}), ratings.update());
    server.del('/rating/:id', jwt({secret: process.env.JWT_SECRET}), ratings.remove()); 

    server.get('/person/list', jwt({secret: process.env.JWT_SECRET}), persons.query({populate: 'director,actors,comments,persons'}));
    server.get('/person/:id', jwt({secret: process.env.JWT_SECRET}), persons.detail({populate: 'director,actors,comments,persons'}));
    server.post('/person', jwt({secret: process.env.JWT_SECRET}), persons.insert());
    server.patch('/person/:id', jwt({secret: process.env.JWT_SECRET}), persons.update());
    server.del('/person/:id', jwt({secret: process.env.JWT_SECRET}), persons.remove()); 

};