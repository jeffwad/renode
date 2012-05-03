/**

  @module   adds some usefull inheritance methods to Object.prototype

*/
var iter    = require("lib/iter"),
    forEach = iter.forEach;

Object.defineProperties(Object.prototype, {


  /**
    @public   creates a new copy of the "this"
              objects passed in on the key "extend" are merged with the equivalent
              object on "this" into a new object
    @param    {object} definition
    @return   object
  */
  create: {

    value: function(definition) {

      var object = Object.create(typeof this === "function" ? this.prototype: this);

      forEach(definition, function(property, name) {

        Object.defineProperty(object, name, {
          value: property,
          configurable: true
        });

      });

      return object;

    },
    enumerable: false

  },


  /**
    @public   cleans up "this"
  */
  destroy: {

    value: function() {
      //this = null;
    },
    enumerable: false

  },


  /**
    @public   creates a new copy of "this" with no extending definition
              if "this" is a function we call new on it
    @return   object
  */
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
