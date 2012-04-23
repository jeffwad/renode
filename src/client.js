#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require("lib/Object");
require("lib/String");

//  start our server
var Base           = require("lib/Base"),
    SequencerModel = require("app/models/SequencerModel"),
    song           = require("song"),
    sequencer;



var socket = io.connect('http://localhost');
//var socket = io.connect('http://192.168.1.82');

Base.registerService("socket", socket);
sequencer = SequencerModel.spawn(song, null);


socket.on('/connection/initialised', function (data) {
  console.log(data);
});

document.getElementById('play').addEventListener('click', function(e) {
  sequencer.play();
  e.preventDefault();
}, false);
document.getElementById('stop').addEventListener('click', function(e) {
  sequencer.stop();
  e.preventDefault();
}, false);
document.getElementById('one').addEventListener('click', function(e) {
  socket.emit("pattern", {
    index: 0
  });
  e.preventDefault();
}, false);
document.getElementById('two').addEventListener('click', function(e) {
  socket.emit("pattern", {
    index: 1
  });
  e.preventDefault();
}, false);

