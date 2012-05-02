/**

  @module       lib/EventMachine
  @description  we want to beef up the EventEmitter somewhat
                it now has added stop/start functionality
  @todo         add EventObject usage

*/
require("lib/Object");

var EventEmitter = require("events").EventEmitter,
    iter         = require("lib/iter"),
    forEach      = iter.forEach;


/**
  @description  returns an object used to add and remove listeners
  @param        {object} object
  @param        {string} event
  @param        {function} listener
  @return       object
*/
function createEventHandler(object, event, listener) {
  return {
    start: function() {
      EventEmitter.prototype.on.call(object, event, listener);
    },
    stop: function() {
      EventEmitter.prototype.removeListener.call(object, event, listener);
    }
  };
}



module.exports = EventEmitter.create({

  /**
    @description  constructor
  */
  __init__: function() {

    Object.defineProperty(this, "handlers", {

      value: {}

    });

    this._initListeners();

  },


  /**
    @description  creates and starts an event handler
    @param        {string} event
    @param        {function} listener
    @return       object
  */
  on: function(event, listener) {

    var eventHandler = createEventHandler(this, event, listener);
    eventHandler.start();
    return eventHandler;

  },


  /**
    @description  creates and starts a single event handler
    @param        {string} event
    @param        {function} listener
    @return       object
  */
  once: function(event, listener) {

    var eventHandler, boundListener;

    boundListener = function() {
      this.removeListener(event, boundListener);
      listener.apply(null, arguments);
    }.bind(this);

    eventHandler = createEventHandler(this, event, boundListener);
    eventHandler.start();
    return eventHandler;

  },


  /**
    @description  stops and destroys all registered handlers
  */
  destroy: function() {

    forEach(this.handlers, function(handler){
      handler.stop();
      handler.destroy();
    });

  },


  //  private

  /**
    @description  initialises all handlers specified by the subscribers property
  */
  _initListeners: function() {

    forEach(this.subscribers || {}, function(methodName, event) {

      if(typeof this[methodName] !== "function") {
        throw ReferenceError.spawn(methodName + ": is not a method on this object");
      }

      this.handlers[event] = this.on(event, this[methodName].bind(this));

    }, this);

  }


});