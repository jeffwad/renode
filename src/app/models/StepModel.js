/**

  @module       app/models/StepModel
  @description  A step containing multiple notes

*/
var BaseModel = require("app/models/BaseModel"),
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
  __init__: function(notes) {

    BaseModel.__init__.call(this);

    forEach(notes, this.createNote, this);

  }


});