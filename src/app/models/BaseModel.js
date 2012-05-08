/**

  @module       app/models/BaseModel
  @description  base model object

*/
var Base     = require("lib/Base"),
    utils    = require("lib/utils"),
    iter     = require("lib/iter"),
    toArray  = iter.toArray,
    forEach  = iter.forEach;



module.exports = Base.create({

  //  properties

  services: ["sync", "registry"],


  //  constructors

  /**
    @description  prototype constructor
  */
  create: function(definition) {

    var baseModel;

    //  merge all the syncApi declarations
    definition.syncApi = utils.concat(definition.syncApi, this.syncApi);

    baseModel = Base.create.call(this, definition);

    baseModel.syncClientAndServer();

    return baseModel;

  },



  /**
    @description  instance constructor
  */
  __init__: function(data) {

    Base.__init__.call(this, data);

    this.registry.add(this);

  },


  //  public


  /**
    @description  sets up the sync api accross the client and server
  */
  syncClientAndServer: function() {

    forEach(this.syncApi, this._syncMethod, this);

  },


  //  private


  /**
    @description  creates a set of related entites based on our incoming data
    @param        {string} name
    @param        {data} data
  */
  _createEntities: function(name, data) {

    var factoryMethodName = "create" + name.singularize().capitalize();

    if(data[name]) {
      forEach(data[name], this[factoryMethodName], this);
    }

  },



  /**
    @description  sets up the sync api on a given method
    @param        {string} methodName
  */
  _syncMethod: function(methodName) {

    var method = this[methodName];

    Object.defineProperty(this, methodName, {

      value: function() {

        this.sync.emit("/sync", {
          id        : this.id,
          methodName: methodName,
          args      : toArray(arguments)
        });

        return method.apply(this, arguments);
      }

    });

    //  attach the original method to the wrapped one to grant
    //  the sync api access
    this[methodName].sync = method;

  }

});