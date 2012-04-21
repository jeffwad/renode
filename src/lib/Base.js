/**

  @module       lib/Base
  @description  object that all other objects in our system will inherit from

*/
var EventMachine = require('lib/EventMachine');

module.exports = EventMachine.create({

  //  constructor

  /**
    @description  constructor
  */
  __init__: function() {

      EventMachine.__init__.call(this);

  }

});

