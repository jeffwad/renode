/**

  @module       app/models/BaseModel
  @description  base model object

*/
var Base = require("lib/Base"),
    iter         = require("lib/iter"),
    toArray      = iter.toArray,
    forEach      = iter.forEach;



module.exports = Base.create({

  //  properties


  services: ["sync"],


  //  constructor

  /**
    @description  constructor
  */
  __init__: function(data) {

    Base.__init__.call(this, data);

    this._syncClientAndServer();

  },


  //  private

  _syncClientAndServer: function() {

    if(this.syncApi) {
      forEach(this.syncApi, this._syncMethod, this);
    }

  },

  _syncMethod: function(methodName) {

    var method = this[methodName];

    this[methodName] = function() {

      //this.sync.emit("/sync/" + this.id + "/" + methodName , arguments);
      this.sync.emit("/sync", {
        methodName: methodName,
        args: toArray(arguments)
      });
      return method.apply(this, arguments);
    };

    //this.sync.on("/sync/" + this.id + "/" + methodName , method);
    this.sync.on("/sync/" + methodName, function(data) {
      console.log("evm wtf: ", data);
      method.apply(this, data.args);

    }.bind(this));

  }

});