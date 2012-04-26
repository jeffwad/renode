#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require("lib/Object");
require("lib/String");
require("lib/dom");

//  start our server
var service            = require("lib/service"),
    EventMachine       = require("lib/EventMachine"),
    SequencerModel     = require("app/models/SequencerModel"),
    SequencerComponent = require("app/ui/SequencerComponent"),
    song               = require("song"),
    sequencer, socket, sync;



socket = io.connect("http://localhost");
sync = EventMachine.spawn();

//var socket = io.connect('http://192.168.1.82');

socket.on("/connection/initialised", function (data) {

  console.log("/connection/initialised");

});

socket.on("/sync", function(data) {

  sync.emit("/sync/" + data.id + "/" + data.methodName, data);

});

sync.on("/sync", function(data) {

  socket.emit("/sync", data);

});


service.register("sync", sync);
service.register("midi", {
  input: {recieveMessage: function() {}},
  output: {sendMessage: function() {}}
});


sequencer = SequencerComponent.spawn(SequencerModel.spawn(song));
sequencer.render(document.body);
sequencer.addEventListeners();
