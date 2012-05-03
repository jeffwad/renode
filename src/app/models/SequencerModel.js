/**

  @module       app/models/SequencerModel
  @description  A sequencer that plays midi data

*/
var BaseModel  = require("app/models/BaseModel"),
    TrackModel = require("app/models/TrackModel"),
    forEach    = require("lib/iter").forEach,
    Sequencer;

Sequencer = BaseModel.create({

  //  properties


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
    }

  },


  /**
    @description  relationships
  */
  hasMany: {

    tracks: TrackModel

  },


  /**
    @description  services
  */
  services: ["midi"],


  /**
    @description  synchronisation api
  */
  syncApi: ["play", "stop"],


  /**
    @description  constructor
  */
  __init__: function(data) {

    BaseModel.__init__.call(this, data);

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

    if(this.playing || typeof window !== "undefined") {
      return;
    }
    this.playing = true;
    this._timer = setInterval(this.playStep.bind(this), this._barDuration() / this.steps);

  },


  /**
    @description  plays all the notes from each track on each step
  */
  playStep: function() {

    forEach(this.tracks.items(), this._playTrack, this);

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

    this.midi.output.sendMessage([track.midiOn, note.key, note.velocity]);
    setTimeout(this._stopNote.bind(this, track, note), note.duration);

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

    this.midi.output.sendMessage([track.midiOff, note.key, note.VELOCITY_OFF]);

  }

});

module.exports = Sequencer;