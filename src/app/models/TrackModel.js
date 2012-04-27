/**

  @module       app/models/TrackModel
  @description  A track containing multiple patterns, of which only one can play
                at any one time

*/
var BaseModel    = require("app/models/BaseModel"),
    PatternModel = require("app/models/PatternModel"),
    forEach      = require("lib/iter").forEach;

module.exports = BaseModel.create({

  //  properties


  /**
    @description  relationships
  */
  hasMany: {

    patterns: PatternModel

  },


  /**
    @description  accessors
  */
  accessors: {

    title: {
      type: "string"
    },

    midiOn: {
      type: "number"
    },

    midiOff: {
      type: "number"
    },

    activePattern: {
      type : PatternModel
    },

    nextPattern: {
      type : PatternModel
    }

  },


  /**
    @description  synchronisation api
  */
  syncApi: ["activateNextPattern"],


  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseModel.__init__.call(this, data);

    this.activatePattern(this.patterns.getByIndex(0).id);
    this._activateNextPattern(this.patterns.getByIndex(0).id);

  },


  //  public

  /**
    @description  sets the currently active pattern
    @param        {String} id
  */
  activatePattern: function(id) {

    this.activePattern = this.patterns.getById(id);

  },

  /**
    @description  sets the currently active pattern
    @param        {String} id
  */
  activateNextPattern: function(id) {

    this._activateNextPattern(id);

  },


  /**
    @description  retrieves the current steps notes from the active pattern
    @return       {Collection: app/models/NotesModel}
  */
  currentNotes: function() {

    if(this.activePattern.currentStep === 1) {
      if(this.activePattern !== this.nextPattern) {
        this.activePattern = this.nextPattern;
      }
    }

    return this.activePattern.currentNotes();

  },


  /**
    @description  reset this tracks patterns
  */
  reset: function() {

    forEach(this.patterns.items(), function(pattern) {
      pattern.reset();
    });

  },


  //  private

  /**
    @description  sets the currently active pattern
    @param        {String} id
  */
  _activateNextPattern: function(id) {

    this.nextPattern = this.patterns.getById(id);

  }



});