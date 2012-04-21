#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require('lib/Object');
require('lib/String');

//  start our server
var SequencerModel = require('app/models/SequencerModel'),
    song           = require('song'),
    sequencer, output;


sequencer = SequencerModel.spawn(song, null);