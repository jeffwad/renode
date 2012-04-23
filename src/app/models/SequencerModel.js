/**

  @module       app/models/SequencerModel
  @description  A sequencer that plays midi data

*/
var BaseModel  = require("app/models/BaseModel"),
    TrackModel = require("app/models/TrackModel"),
    forEach    = require("lib/iter").forEach;

module.exports = BaseModel.create({

  //  properties


  /**
    @description  relationships
  */
  hasMany: {

    tracks: TrackModel

  },


  // /**
  //   @description  service
  // */
  // services: {
  //   midi: "midiInterface"
  // },


  /**
    @description  accessors
  */
  accessors: {

    title: {
      type: "string"
    },

    bpm: {
      defaultValue : 120,
      type         : "number"
    },

    playing: {
      defaultValue : false,
      type         : "boolean"
    },

    steps: {
      defaultValue : 128,
      type         : "number"
    },

    midiInterface: {
      type: "object"
    }

  },


  syncApi: [
    "play", "stop"
  ],


  /**
    @description  constructor
  */
  __init__: function(data, output) {

    BaseModel.__init__.call(this, data);

    if(data.tracks) {

      forEach(data.tracks, this.createTrack, this);

    }

    this.midiInterface = {
      out: output
    };
  },


  //  public


  /**
    @description  pauses the sequencer
  */
  pause: function() {

    clearTimeout(this._timer);
    this.playing = false;

  },


  /**
    @description  starts the sequencer
                  loop through all the tracks and play the active pattern
  */
  play: function() {

    if(this.playing) {
      return;
    }
    this.playing = true;
    this._timer = setInterval(this._playStep.bind(this), this._barDuration() / this.steps);

  },



  /**
    @description  stops the sequencer
  */
  stop: function() {

    clearTimeout(this._timer);
    forEach(this.tracks.items(), function(track) {
      track.reset();
    });
    this.playing = false;

  },


  //  private


  /**
    @description  calculate the duration of a bar
    @return       {Number}
  */
  _barDuration: function() {

    return 60000 / this.bpm * 4;

  },


  /**
    @description  forwards a midi on message via the midi interface
    @param        {app/models/NoteModel} note
  */
  _playNote: function(track, note) {

    this.midiInterface.out.sendMessage([track.midiOn, note.key, note.velocity]);
    setTimeout(this._stopNote.bind(this, track, note), note.duration);

  },


  /**
    @description  plays all the notes from each track on each step
  */
  _playStep: function() {

    forEach(this.tracks.items(), this._playTrack, this);

  },


  /**
    @description  plays all the notes from each track on each step
  */
  _playTrack: function(track) {

    var notes = track.currentNotes();
    if(notes) {
      forEach(notes, this._playNote.bind(this, track));
    }

  },


  /**
    @description  forwards a midi off message via the midi interface
    @param        {app/models/NoteModel} note

  */
  _stopNote: function(track, note) {

    this.midiInterface.out.sendMessage([track.midiOff, note.key, this.VELOCITY_OFF]);

  }

});