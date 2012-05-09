/**

  @module   adds some usefull inheritance methods to Object.prototype

*/
var iter    = require("lib/iter"),
    forEach = iter.forEach;

Object.defineProperties(Object.prototype, {


  /**
    @public   creates a new copy of the "this", applying the extending definition
              calls any pre and post create methods  
    @param    {object} definition
    @return   object
  */
  create: {

    value: function(definition) {

      var object, 
          postCreate = false;

      //  if we have a pre create method, run it on the definition now
      if(typeof this.__preCreate__ === "function") {
        this.__preCreate__(definition);
      }

      //  if we have a post create method, cache it now to run post create
      if(typeof this.__postCreate__ === "function") {
        postCreate = this.__postCreate__;
      }

      //  get a new object
      var object = Object.create(typeof this === "function" ? this.prototype: this);

      //  and apply all our new definitions
      forEach(definition, function(property, name) {

        Object.defineProperty(object, name, {
          value: property,
          configurable: true
        });

      });

      //  if we cached a post create method - call it
      if(postCreate) {
        postCreate.call(object);
      }

      //   mr freeze...
      Object.freeze(object);

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
              are 5 args enough
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
