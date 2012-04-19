function forEach(object, func, scope) {

  var i, l, key,
      keys = Object.keys(object);
  for(i = 0, l = keys.length; i < l; i++) {
    key = keys[i];
    func.call(scope || self, object[key], key);
  }
}



Object
  create
  delete
  spawn

EventMachine -> EventEmitter

Base -> EventMachine
  on

//  Models
BaseModel -> Base
  accessors
    id
  hasMany
  hasOne

Sequence -> BaseModel
Track -> BaseModel
MidiTrack -> Track
AudioTrack -> Track
Phrase -> BaseModel
Note -> BaseModel


//  UI Layouts
BaseLayout -> Base

//  UI Components
BaseComponent -> Base

//  services
BaseFactory
AccessorFactory

//  Commands

//  Sequences?





//  Object
Object.defineProperties(Object.prototype, {

  create: {

    value: function(definition) {

      var object = Object.create(typeof this === "function" ? this.prototype: this);

      forEach(definition, function(property, name) {

        if(name === 'extend') {

          forEach(property, function(mixin, key) {

            Object.defineProperty(object, key, {
              value: Object.extend(this[key], mixin)
            });

          }, this);

        }
        else {

          Object.defineProperty(object, name, {
              value: property
          });

        }

      }, this);

    },
    enumerable: false

  },

  destroy: {

    value: function() {
      this = null;
    },
    enumerable: false

  },

  spawn: {

    value: function() {

      var object;

      if(typeof this === "function") {

        object = new this(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);

      }
      else {

        object = Object.create(this);
        if(typeof object.__init__ === 'function') {
          object.__init__.apply(object, arguments);
        }

      }

      return object;

    },
    enumerable: false

  }

});


//  EventMachine
var EventEmitter = require('events').EventEmitter;

function createListener(object, event, listener) {
  return {
    start: function() {
      EventEmitter.prototype.on.call(object, event, listener);
    }
    stop: function() {
      EventEmitter.prototype.removeListener.call(object, event, listener);
    }
  }
}

module.exports = EventEmitter.create({

  __init__: function() {

    this._initListeners();

  },

  on: function(event, listener) {
    var eventListener = createListener(this, event, listener);
    eventListener.start();
    return eventListener;
  },

  once: function(event, listener) {

    var eventListener, boundListener;

    boundListener = function() {
      this.removeListener(event, boundListener);
      listener.apply(null, arguments);
    }.bind(this);

    eventListener = createListener(this, event, boundListener);
    eventListener.start();
    return eventListener;
  },

  _initListeners: function() {

    this._handlers = map(this.subscribers || {}, function(methodName, event) {

      return this.on(event, this[eventName].bind(this));

    }, this);
  },

  destroy: function() {

    forEach(this._handlers, function(handler){
      handler.stop();
      handler.destroy();
    });

  }

});



//  Base
var EventMachine = require('/app/events').EventMachine;

module.exports = EventMachine.create({

  __init__: function() {

      EventMachine.__init__.call(this);

  }

});



//  BaseModel
var utils = require('/app/utils'),
    Base = require('/app/Base')
    accessorFactory = require('/app/services/accessorFactory'),
    forEach = utils.iter.forEach;

module.exports = Base.create({

  accessors: {
    id: {
      prop: 'id'
    }
  },

  __init__: function() {

    Base.__init__.apply(this);

    this._initAccessors();
    this.id.value(utils.generateId());

    }
  },


  _initAccessors: function() {

    forEach(this.accessors, function(accessor, name) {

      Object.defineProperty(this, name, {
        value: this.accessorFactory.create(accessor),
        enumerable: true
      });

    }, this);

  }


});


//  Midi Track
var BaseModel   = require('/app/models/BaseModel'),
    PhraseModel = require('/app/models/PhraseModel');

module.exports = BaseModel.create({

  extend: {

    subscribers: {
      "/track/add/phrase": "addPhrase"
    },

    publish: {
      trackMute: "/track/mute"
    },

    hasMany: {
      phrases: PhraseModel
    },

    accessors: {

      activePhrase: {}

    }

  },

  __init__: function(duration) {

    BaseModel.__init__.call(this);

  },

  activatePhrase: function() {},
  addPhrase: function() {},
  copyPhrase: function() {},
  deactivatePhrase: function() {},
  deletePhrase: function() {}

});


//  Phrase
var Base = require('/app/models/Base'),
    Note = require('/app/models/Note');

module.exports = Base.create({

  mixin: {

    hasMany: {
      notes: Notes
    },

    accessors: {

      duration: {}

    }

  },

  __init__: function(duration) {

    Base.__init__.call(this);

    this.duration.value(duration);

  }

});


//  Note
var Base = require('/app/models/Base');

module.exports = Base.create({

  mixin: {

    accessors: {

      note     : {},
      veloctiy : {},
      duration : {}

    }

  },

  __init__: function(note, velocity, duration) {

    Base.__init__.call(this);

    this.note.value(note);
    this.velocity.value(velocity);
    this.duration.value(duration);

  }

});

var note = Note.spawn(10, 13, 7);