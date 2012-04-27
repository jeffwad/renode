/**

  @module       app/models/PatternModel
  @description  A track containing multiple notes, keyed by time

*/
var BaseModel = require("app/models/BaseModel"),
    StepModel = require("app/models/StepModel");
    iter      = require("lib/iter"),
    range     = iter.range,
    forEach   = iter.forEach;

module.exports = BaseModel.create({

  //  properties


  /**
    @description  relationships
  */
  hasMany: {

    steps: StepModel
  },


  /**
    @description  accessors
  */
  accessors: {

    currentStep: {
      defaultValue : 1,
      type         : "number"
    },

    stepCount: {
      defaultValue : 128,
      type         : "number"
    }

  },


  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseModel.__init__.call(this, data);

    forEach(range(0, this.stepCount), function(step) {

      this.createStep(data.steps[step] || {});

    }, this);

  },


  //  public


  /**
    @description  retrieves the current steps notes from the pattern
    @return       {Collection: app/models/NoteModel}
  */
  currentNotes: function() {

    var notes = this.steps.getByIndex(this.currentStep - 1).notes.items();

    this.currentStep = (this.currentStep === this.stepCount) ? 1 : ++this.currentStep;

    return notes;

  },

  /**
    @description  reset the pattern
  */
  reset: function() {

    this.currentStep = 1;

  }


  //  private




});