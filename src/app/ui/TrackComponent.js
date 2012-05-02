/**

  @module       app/ui/TrackComponent
  @description  track component

*/
//"use strict";

var iter             = require("lib/iter"),
    TrackModel       = require("app/models/TrackModel"),
    BaseComponent    = require("app/ui/BaseComponent"),
    PatternComponent = require("app/ui/PatternComponent"),
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
    @description  role
  */
  role: "track",


  /**
    @description  template
    @todo         move this to an external file
  */
  html: "<div class=\"track\"  data-id=\"\">" +
          "<header>" +
            "<h1 data-title=\"\"></h1>" +
          "</header>" +
          "<div data-role=\"pattern\"></div>" +
        "</div>",


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


  //  controller methods

  /*
    @description  tells a track to cue up the next pattern
  */
  "click>pattern/activate": function(e) {

    e.preventDefault();

    this.model.activateNextPattern(e.target.getAttribute("data-id"));

  },

  "click>pattern/create": function() {

  }

});