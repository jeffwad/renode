/**

  @module       song
  @description  test beats

*/

// 0
// 15
// 31
// 47
// 63
// 79
// 95
// 111

module.exports = {

  "title" : "Test beats",
  "bpm"   : 120,


  "tracks": [
    {
      "title"     : "Drum machine",
      "midiOn"    : 144,
      "midiOff"   : 128,
      "program"   : 192,
      "instrument": 14,
      "patterns"  : [
        {
          "stepCount": 128, // ((1-16) * 8) - 1
          "steps"    : {
            0: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            32: {
                "notes": [
                  {"key": 40, "velocity": 127, "duration": 120}
                ]
            },
            48: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            64: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            72: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            96: {
                "notes": [
                  {"key": 40, "velocity": 127, "duration": 120}
                ]
            }
          }
        },
        {
          "stepCount": 128,
          "steps"    : {
            0: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            16: {
                "notes": [
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            },
            32: {
                "notes": [
                  {"key": 40, "velocity": 127, "duration": 120},
                  {"key": 46, "velocity": 65, "duration": 120}
                ]
            },
            48: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            64: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            72: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            80: {
                "notes": [
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            },
            96: {
                "notes": [
                  {"key": 40, "velocity": 127, "duration": 120}
                ]
            },
            112: {
                "notes": [
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            }
          }
        },
        {
          "stepCount": 128,
          "steps"    : {
            0: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120},
                  {"key": 46, "velocity": 65, "duration": 120}
                ]
            },
            16: {
                "notes": [
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            },
            32: {
                "notes": [
                  {"key": 40, "velocity": 127, "duration": 120},
                  {"key": 46, "velocity": 65, "duration": 120}
                ]
            },
            48: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120},
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            },
            64: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120},
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            },
            72: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 120}
                ]
            },
            80: {
                "notes": [
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            },
            96: {
                "notes": [
                  {"key": 40, "velocity": 127, "duration": 120},
                  {"key": 46, "velocity": 65, "duration": 120}
                ]
            },
            112: {
                "notes": [
                  {"key": 46, "velocity": 80, "duration": 120}
                ]
            }
          }
        }
      ]
    },
    {
      "title"   : "Base Line",
      "midiOn"  : 145,
      "midiOff" : 129,

      "patterns": [
        {
          "stepCount": 128,
          "steps"    : {
            0: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 100}
                ]
            },
            12: {
                "notes": [
                  {"key": 56, "velocity": 127, "duration": 100}
                ]
            },
            32: {
                "notes": [
                  {"key": 56, "velocity": 127, "duration": 100}
                ]
            },
            64: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 100}
                ]
            },
            96: {
                "notes": [
                  {"key": 66, "velocity": 127, "duration": 100}
                ]
            }
          }
        },
        {
          "stepCount": 128,
          "steps"    : {
            0: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 100}
                ]
            },
            12: {
                "notes": [
                  {"key": 56, "velocity": 127, "duration": 100}
                ]
            },
            16: {
                "notes": [
                  {"key": 68, "velocity": 127, "duration": 100}
                ]
            },
            24: {
                "notes": [
                  {"key": 68, "velocity": 127, "duration": 100}
                ]
            },
            32: {
                "notes": [
                  {"key": 56, "velocity": 127, "duration": 100}
                ]
            },
            64: {
                "notes": [
                  {"key": 36, "velocity": 127, "duration": 100}
                ]
            },
            96: {
                "notes": [
                  {"key": 66, "velocity": 127, "duration": 100}
                ]
            }
          }
        }
      ]
    }
  ]
};

