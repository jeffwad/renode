#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require("lib/Object");
require("lib/String");

//  start our server
var service        = require("lib/service"),
    SequencerModel = require("app/models/SequencerModel"),
    song           = require("song"),
    EventMachine   = require("lib/EventMachine"),
    sequencer;



var socket = io.connect("http://localhost");
    //  set up the socket

    var sync = EventMachine.spawn();

//var socket = io.connect('http://192.168.1.82');

socket.on("/connection/initialised", function (data) {

  console.log("/connection/initialised");

});

socket.on("/sync", function(data) {

  console.log('wtf: ', data);

  sync.emit("/sync/" + data.methodName, data);
  //socket.emit("/sync", data);

});

sync.on("/sync", function(data) {

  socket.emit("/sync", data);

});


service.register("sync", sync);
service.register("midi", {
  input: {recieveMessage: function() {}},
  output: {sendMessage: function() {console.log(arguments);}}
});
sequencer = SequencerModel.spawn(song);



document.getElementById('play').addEventListener('click', function(e) {
  sequencer.play();
  e.preventDefault();
}, false);
document.getElementById('stop').addEventListener('click', function(e) {
  sequencer.stop();
  e.preventDefault();
}, false);
document.getElementById('one').addEventListener('click', function(e) {
  sequencer.tracks.getByIndex(0).activateNextPattern(0);
  e.preventDefault();
}, false);
document.getElementById('two').addEventListener('click', function(e) {
  sequencer.tracks.getByIndex(0).activateNextPattern(1);
  e.preventDefault();
}, false);

