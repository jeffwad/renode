/**

  @module       lib/midi
  @description  midi port

*/
var midi = require("midi"),
    output, input;

// Set up a new output.
output = new midi.output();
output.openVirtualPort("renode");

input = new midi.input();
input.openVirtualPort("renode");

exports.output = output;
exports.input = input;
