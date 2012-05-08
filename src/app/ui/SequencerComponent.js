/**

  @module       app/ui/SequencerComponent
  @description  sequencer component

*/
//"use strict";

var iter           = require("lib/iter"),
    SequencerModel = require("app/models/SequencerModel"),
    BaseComponent  = require("app/ui/BaseComponent"),
    TrackComponent = require("app/ui/TrackComponent"),
    template       = require("app/ui/templates/sequencer.html"),
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
    @description  relationships
  */
  hasMany: {

    tracks: TrackComponent

  },


  // hasOne: {

  //   editor: EditorComponent

  // },


  /**
    @description  template
  */

  html: template,


  //  public


  /**
    @description  constructor
  */
  __init__: function(model) {

    BaseComponent.__init__.call(this, model);

  },


  //  public


  //  private


  //  controller methods

  /*
    @description  emits a control event
                  data-action="play"
  */
  "click>/sequencer/control": function(e) {

    var control = e.target.getAttribute("data-control");

    e.preventDefault();

    if(typeof this.model[control] !== "function") {
      throw Error.spawn("method (" + control + ") does not exist on this.model");
    }

    this.model[control]();

  },


  "click>/track/create": function(e) {

    this.model.createTrack({
      id: utils.generateId()
    });
  }


});