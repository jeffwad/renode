/**

  @module       app/models/BaseModel
  @description  base model object

*/
var Base = require("lib/Base"),
    iter         = require("lib/iter"),
    forEach      = iter.forEach;



module.exports = Base.create({

  //  properties


  services: [
    "socket"
  ],


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

    var method = this[methodName].bind(this);

    this[methodName] = function() {

      //this.socket.emit("/sync/" + this.id + "/" + methodName , arguments);
      this.socket.emit("/sync/" + methodName , arguments);
      return method.apply(this, arguments);
    };

    //this.socket.on("/sync/" + this.id + "/" + methodName , method);
    this.socket.on("/sync/" + methodName , method);

  }



});