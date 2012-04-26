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
    }

  },


  /**
    @description  template
    @todo         move this to an external file
  */
  html: "<div class=\"pattern\" data-event=\"pattern:activate\" data-id=\"\">",


  /**
    @description  role
  */
  role: "pattern",


  /**
    @description  services
  */
  services: [],


  //  public


  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseComponent.__init__.call(this, data);

  },


  //  public


  //  private


  /*
    @description  tells a track to cue up the next pattern
                  data-action="play"
  */
  _activateNextPattern: function(e) {

    e.preventDefault();

    this.model.activateNextPattern(e.boundTarget.getAttribute("data-id"));

  }

});