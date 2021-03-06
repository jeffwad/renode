#!/usr/bin/env node

/**

  @module   bootstrap the app

*/
require("lib/Object");
require("lib/String");

//  start our server
var http           = require("http"),
    nodeStatic     = require("node-static"),
    socket         = require("socket.io"),
    midi           = require("lib/midi"),
    registry       = require("lib/registry"),
    service        = require("lib/service"),
    EventMachine   = require("lib/EventMachine"),
    SequencerModel = require("app/models/SequencerModel"),
    song           = require("song"),
    io, sequencer, server, file, sync;


//  set up the file server
file = new(nodeStatic.Server)("htdocs", {
  cache: 0,
  headers: {
    "X-App":"renode"
  }
});

server = http.createServer(function (request, response) {

  request.on("end", function () {
    //
    // Serve files!
    //
    file.serve(request, response, function (err, res) {
      if (err) { // An error as occured
        console.error("> Error serving " + request.url + " - " + err.message);
        response.writeHead(err.status, err.headers);
        response.end();
      }
      else { // The file was served successfully
        console.log("> " + request.url + " - " + res.message);
      }
    });
  });
});

server.listen(8080);

console.log("> node-static is listening on http://127.0.0.1:8080");

//  set up the socket
sync = EventMachine.spawn();

io = socket.listen(server);

io.sockets.on("connection", function (socket) {

  socket.emit("/connection/initialised", {
    song: song
  });

  socket.on("/sync", function(data) {

    var object = registry.get(data.id);
    object[data.methodName].sync.apply(object, data.args);

    socket.broadcast.emit("/sync", data);

  });

  sync.on("/sync", function(data) {

    socket.broadcast.emit("/sync", data);

  });


});

service.register("registry", registry);
service.register("sync", sync);
service.register("midi", midi);
sequencer = SequencerModel.spawn(song);
