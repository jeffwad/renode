/**

  @module       app/ui/TrackComponent
  @description  track component

*/
//"use strict";

var iter             = require("lib/iter"),
    BaseComponent    = require("lib/BaseComponent"),
    TrackModel       = require("app/models/TrackModel"),
    PatternComponent = require("app/ui/PatternComponent"),
    template         = require("app/ui/templates/track.html"),
    forEach          = iter.forEach;


module.exports = BaseComponent.create({

  //  properties

  /**
    @description  accessors
  */
  accessors: {

    model: {
      type: TrackModel
    }

  },


  /**
    @description  relationships
  */
  hasMany: {

    patterns: PatternComponent

  },


  /**
    @description  template
  */
  html: template,


  //  public


  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseComponent.__init__.call(this, data);

  },


  //  public


  //  private


  //  controller methods

  /*
    @description  tells a track to cue up the next pattern
  */
  "click>/pattern/activate": function(e) {

    e.preventDefault();

    this.model.activateNextPattern(e.target.getAttribute("data-id"));

  },

  "click>/pattern/create": function() {

  }

});