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
    midi           = require("midi"),
    Base           = require("lib/Base"),
    SequencerModel = require("app/models/SequencerModel"),
    song           = require("song"),
    io, sequencer, output, server, file;


// // Set up a new output.
output = new midi.output();

// // Count the available output ports.
// Create a virtual input port.
output.openVirtualPort("Renode");


file = new(nodeStatic.Server)("htdocs", { cache: 0, headers: {"X-App":"Nodebeat!"} });

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

io = socket.listen(server);

io.sockets.on("connection", function (socket) {
  socket.on("play", function() {
    sequencer.play();
  });

  socket.on("stop", function() {
    sequencer.stop();
  });

  socket.on("pattern", function(data) {
    sequencer.tracks.getByIndex(0).activateNextPattern(data.index);
  });

  Base.registerService("socket", socket);
  sequencer = SequencerModel.spawn(song, output);


});


