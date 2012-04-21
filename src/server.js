#!/usr/bin/env node

var http       = require("http"),
    nodeStatic = require("node-static"),
    socket         = require("socket.io"),
    server, io, file;

file = new(nodeStatic.Server)('htdocs', { cache: 0, headers: {'X-App':'Nodebeat!'} });

server = http.createServer(function (request, response) {

  request.on('end', function () {
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



io.sockets.on('connection', function (socket) {
  socket.emit('/connection/initialised', {});
});


module.exports = io;