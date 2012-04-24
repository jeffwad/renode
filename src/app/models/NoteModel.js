/**

  @module       app/models/NoteModel
  @description  A note containing midi data

*/
var BaseModel    = require("app/models/BaseModel");

module.exports = BaseModel.create({

  //  properties


  accessors: {

    key: {
      type: "number"
    },

    velocity: {
      type: "number"
    },

    duration: {
      type: "number"
    }

  },


  VELOCITY_OFF: 0,

  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseModel.__init__.call(this, data);

  }

});