#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require("lib/Object");
require("lib/String");
require("lib/dom");

//  start our server
var registry           = require("lib/registry"),
    service            = require("lib/service"),
    EventMachine       = require("lib/EventMachine"),
    SequencerModel     = require("app/models/SequencerModel"),
    SequencerComponent = require("app/ui/SequencerComponent"),
    song               = require("song"),
    sequencer, socket, sync;



//socket = io.connect("http://localhost");
socket = io.connect('http://192.168.1.82');
sync = EventMachine.spawn();

socket.on("/connection/initialised", function (data) {

  sequencer = SequencerComponent.spawn(SequencerModel.spawn(data.song));
  sequencer.render(document.body);
  sequencer.addEventListeners();


});

socket.on("/sync", function(data) {

  var object = registry.get(data.id);
  object[data.methodName].sync.apply(object, data.args);

});

sync.on("/sync", function(data) {

  socket.emit("/sync", data);

});

service.register("registry", registry);
service.register("sync", sync);
service.register("midi", {
  input: {recieveMessage: function() {}},
  output: {sendMessage: function() {}}
});
