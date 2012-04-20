#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require('lib/Object');

//  start our server
var SequencerModel = require('app/models/SequencerModel'),
    TrackModel     = require('app/models/TrackModel'),
    PatternModel   = require('app/models/PatternModel'),
    song           = require('song'),
    io             = require('server'),
    midi           = require('midi'),
    sequencer, output;

// // Set up a new output.
output = new midi.output();

// // Count the available output ports.
// Create a virtual input port.
output.openVirtualPort("Renode");


sequencer = SequencerModel.spawn(song, output);

io.sockets.on('connection', function (socket) {
  socket.on("play", function() {
    sequencer.play();
  });

  socket.on("stop", function() {
    sequencer.stop();
  });

  socket.on("pattern", function(data) {
    sequencer.tracks.getByIndex(0).activatePattern(data.index);
  });

});

