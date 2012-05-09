/**

  @module       app/models/StepModel
  @description  A step containing multiple notes

*/
var BaseModel = require("lib/BaseModel"),
    NoteModel = require("app/models/NoteModel"),
    iter      = require("lib/iter"),
    forEach   = iter.forEach;

module.exports = BaseModel.create({

  //  properties

  /**
    @description  relationships
  */
  hasMany: {

    notes: NoteModel

  },


  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseModel.__init__.call(this, data);

  }


});