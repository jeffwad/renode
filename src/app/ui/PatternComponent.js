/**

  @module       app/ui/PatternComponent
  @description  pattern component

*/
//"use strict";

var iter          = require("lib/iter"),
    PatternModel  = require("app/models/PatternModel"),
    BaseComponent = require("app/ui/BaseComponent"),
    forEach       = iter.forEach;


module.exports = BaseComponent.create({

  //  properties

  /**
    @description  accessors
  */
  accessors: {

    model: {
      type: PatternModel
    },

    state: {
      type: "string"
    }

  },


  /**
    @description  template
    @todo         move this to an external file
  */
  html: "<div class=\"pattern\" data-event=\"/pattern/activate\" data-id=\"\">",



  //  public


  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseComponent.__init__.call(this, data);

    this.model.on("update", function(data) {

      switch(data.accessor) {
        case "state":
          this._updateState(data.value);
          break;
        case "some other shit":
          break;
        default:
      }

    }.bind(this));

  },


  //  public


  //  private


  /*
    @description  updates the state of the patterns
    @param        {string} state
  */
  _updateState: function(state) {

    this.node.className = "pattern " + state;

  }

});