var mongoose = require('mongoose');
var restifyMongoose = require('restify-mongoose');

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
    server.get('/movie/list', movies.query({populate: 'director,actors,comments,ratings'}));
    server.get('/movie/:id', movies.detail({populate: 'director,actors,comments,ratings'}));
    server.post('/movie', movies.insert()); // TODO Does not accept array as input
    server.patch('/movie/:id', movies.update());
    server.del('/movie/:id', movies.remove()); 

    server.get('/user/list', users.query({populate: 'comments,ratings'}));
    server.get('/user/:id', users.detail({populate: 'comments,ratings'}));
    server.post('/user', users.insert());
    server.patch('/user/:id', users.update());
    server.del('/user/:id', users.remove()); 

    server.get('/comment/list', comments.query({populate: 'movie,user'}));
    server.get('/comment/:id', comments.detail({populate: 'movie,user'}));
    server.post('/comment', comments.insert());
    server.patch('/comment/:id', comments.update());
    server.del('/comment/:id', comments.remove()); 

    server.get('/rating/list', ratings.query({populate: 'movie,user'}));
    server.get('/rating/:id', ratings.detail({populate: 'movie,user'}));
    server.post('/rating', ratings.insert());
    server.patch('/rating/:id', ratings.update());
    server.del('/rating/:id', ratings.remove()); 

    server.get('/person/list', persons.query({populate: 'director,actors,comments,persons'}));
    server.get('/person/:id', persons.detail({populate: 'director,actors,comments,persons'}));
    server.post('/person', persons.insert());
    server.patch('/person/:id', persons.update());
    server.del('/person/:id', persons.remove()); 

};