
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
          "steps": {
            0:[
              {"key": 36, "velocity": 127, "duration": 40}
            ],
            32:[
              {"key": 40, "velocity": 127, "duration": 40}
            ],
            48:[
              {"key": 36, "velocity": 127, "duration": 40}
            ],
            64: [
              {"key": 36, "velocity": 127, "duration": 40}
            ],
            72:[
              {"key": 36, "velocity": 127, "duration": 40}
            ],
            96: [
              {"key": 40, "velocity": 127, "duration": 40}
            ]
          }
        },
        {
          "stepCount": 128,
          "steps": {
            0:[
              {"key": 36, "velocity": 127, "duration": 40},
              {"key": 46, "velocity": 30, "duration": 40}
            ],
            16:[
              {"key": 46, "velocity": 80, "duration": 40}
            ],
            32:[
              {"key": 40, "velocity": 127, "duration": 40},
              {"key": 46, "velocity": 30, "duration": 40}
            ],
            48:[
              {"key": 36, "velocity": 127, "duration": 40},
              {"key": 46, "velocity": 80, "duration": 40}
            ],
            64: [
              {"key": 36, "velocity": 127, "duration": 40},
              {"key": 46, "velocity": 80, "duration": 40}
            ],
            72:[
              {"key": 36, "velocity": 127, "duration": 40}
            ],
            80: [
              {"key": 46, "velocity": 80, "duration": 40}
            ],
            96: [
              {"key": 40, "velocity": 127, "duration": 40},
              {"key": 46, "velocity": 30, "duration": 40}
            ],
            112:[
              {"key": 46, "velocity": 80, "duration": 40}
            ]
          }
        }
      ]
    },
    // {
    //   "title"   : "Base Line",
    //   "midiOn"  : 145,
    //   "midiOff" : 129,

    //   "patterns": [
    //     {
    //       "stepCount": 128,
    //       "steps": {
    //         0:[
    //           {"key": 36, "velocity": 127, "duration": 100}
    //         ],
    //         16:[
    //           {"key": 56, "velocity": 127, "duration": 100}
    //         ],
    //         32:[
    //           {"key": 56, "velocity": 127, "duration": 100}
    //         ],
    //         64: [
    //           {"key": 36, "velocity": 127, "duration": 100}
    //         ],
    //         96: [
    //           {"key": 66, "velocity": 127, "duration": 100}
    //         ]
    //       }
    //     }
    //   ]
    // }
  ]
};

