/**

  @module       app/ui/SequencerComponent
  @description  sequencer component

*/
//"use strict";

var iter           = require("lib/iter"),
    SequencerModel = require("app/models/SequencerModel"),
    BaseComponent  = require("app/ui/BaseComponent"),
    TrackComponent = require("app/ui/TrackComponent"),
    forEach        = iter.forEach;


module.exports = BaseComponent.create({

  //  properties

  /**
    @description  accessors
  */
  accessors: {

    model: {
      type: SequencerModel
    }

  },


  /**
    @description  maps methods on this object to dom listening functions
  */
  events: {

    "sequencer:control" : "_control",
    "track:create": "_createTrack"

  },


  /**
    @description  relationships
  */
  hasMany: {

    tracks: TrackComponent

  },


  /**
    @description  template
    @todo         move this to an external file
  */
  html: "<div class=\"sequencer\" data-id=\"\">" +
          "<header>" +
            "<h1 data-title=\"\"></h1>" +
            "<h2 data-bpm=\"\"></h2>" +
          "</header>" +
          "<div data-role=\"track\"></div>" +
          "<div data-role=\"control\">" +
            "<a data-event=\"sequencer:control\" data-control=\"play\">play</a>" +
            "<a data-event=\"sequencer:control\" data-control=\"stop\">stop</a>" +
          "</div>" +
        "</div>",


  /**
    @description  role
  */
  role: "sequencer",


  /**
    @description  services
  */
  services: [],


  //  public


  /**
    @description  constructor
  */
  __init__: function(model) {

    BaseComponent.__init__.call(this, model);

  },


  //  public


  //  private


  /*
    @description  emits a control event
                  data-action="play"
  */
  _control: function(e) {

    var control = e.target.getAttribute("data-control");

    e.preventDefault();

    if(typeof this.model[control] !== "function") {
      throw Error.spawn("method (" + control + ") does not exist on this.model");
    }
    this.model[control]();

  },


  _createTrack: function(e) {

    this.model.createTrack({
      id: utils.generateId()
    });
  }


});