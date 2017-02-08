'use strict';

var jwt = require('restify-jwt');
var ffmpeg = require('fluent-ffmpeg');

module.exports = function(server, logger) {
  server.get('/video/:filename',  function (req, res, next) {
    var input = appRoot + '/video/' + req.params.filename;
    ffmpeg.ffprobe(input, function(err, metadata) {
      console.log(metadata);
      if(!metadata){
        res.json(404, {error: 'Video not found'});
        next();
      }
      res.writeHead(200, {
          'Content-Type': 'video/webm',
          'Content-Length': metadata.format.size
      });
      var proc = ffmpeg(input)
        .videoCodec('libvpx')
        .audioCodec('libvorbis')
        .size('1920x1080')
        .videoBitrate('3000k')
        .outputOptions([
          '-deadline realtime',
          '-preset ultrafast'
        ])
        .format('webm')
        .on('error', function(err,stdout,stderr) {
            console.log('an error happened: ' + err.message);
            console.log('ffmpeg stdout: ' + stdout);
            console.log('ffmpeg stderr: ' + stderr);
        })
        .on('end', function() {
            console.log('Processing finished !');
        })
        .pipe(res, { end: true });
    });
  });
  
};