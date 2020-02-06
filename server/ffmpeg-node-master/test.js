var ffmpeg = require('./ffmpeg-node.js');

ffmpeg.wav(
   './audio.webm',
   function (err, out, code) {
      console.log(err, out, code);
   }
);
