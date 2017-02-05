'use strict';

var jwt = require('restify-jwt');
var ffmpeg = require('fluent-ffmpeg');

module.exports = function(server, logger) {
  server.get('/video/:filename', jwt({secret: process.env.JWT_SECRET}), function (req, res, next) {
    res.setHeader('content-type', 'video/mp4');
    var pathToMovie = appRoot + '/video/' + req.params.filename;
    var proc = ffmpeg(pathToMovie)
      .videoBitrate('2000k')
      .videoCodec('libx264')
      .audioBitrate('128k')
      .audioCodec('aac')
      .audioChannels(2)
      .addOption('-preset', 'veryfast')
      .addOption('-maxrate', '2000k')
      .addOption('-bufsize', '6000k')
      .outputOptions('-movflags frag_keyframe+empty_moov')
      .format('mp4')
      .on('end', function() {
        console.log('file has been converted succesfully');
      })
      .on('error', function(err) {
        console.log('an error happened: ' + err.message);
      })
      .pipe(res, {end:true});
  });
  
};