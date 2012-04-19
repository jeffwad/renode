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
    socket         = require('server'),
    midi           = require('midi'),
    sequencer, output;

// // Set up a new output.
// output = new midi.output();

// // Count the available output ports.
// output.getPortCount();

// // Get the name of a specified output port.
// output.getPortName(0);

// // Open the first available output port.
// output.openPort(0);

// // Send a MIDI message.
// output.sendMessage([176,22,1]);


sequencer = SequencerModel.spawn(song);

sequencer.play();
