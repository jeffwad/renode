/**

  @module       app/models/BaseModel
  @description  base model object

*/
var Base     = require("lib/Base"),
    iter     = require("lib/iter"),
    toArray  = iter.toArray,
    forEach  = iter.forEach;



module.exports = Base.create({

  //  properties

  services: ["sync", "registry"],


  //  constructor

  /**
    @description  constructor
  */
  __init__: function(data) {

    Base.__init__.call(this, data);

    this._syncClientAndServer();

    this.registry.add(this);

  },


  //  private


  _createChild: function(name, data) {

    var factoryMethodName = "create" + name.singularize().capitalize();

    if(data[name]) {
      forEach(data[name], this[factoryMethodName], this);
    }

  },

  _syncClientAndServer: function() {

    if(this.syncApi) {
      forEach(this.syncApi, this._syncMethod, this);
    }

  },

  _syncMethod: function(methodName) {

    var method = this[methodName];

    this[methodName] = function() {

      this.sync.emit("/sync", {
        id        : this.id,
        methodName: methodName,
        args      : toArray(arguments)
      });

      return method.apply(this, arguments);

    };

    //  attach the original method to the wrapped one to enable
    //  the sync api to access the original one
    this[methodName].sync = method;

  }

});