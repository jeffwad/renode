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

  "id"    : "F025898C-5C12-4BDF-8C1D-79F9BD6A5F29",
  "title" : "Test beats",
  "bpm"   : 120,


  "tracks": [
    {
      "id"        : "93B0C3E5-2B61-4E6C-9F61-53161564A716",
      "title"     : "Drum machine",
      "midiOn"    : 144,
      "midiOff"   : 128,
      "program"   : 192,
      "instrument": 14,
      "patterns"  : [
        {
          "id"       : "FFB1F359-4B2A-40AB-869B-F9CA020A8735",
          "stepCount": 128, // ((1-16) * 8) - 1
          "steps"    : {
            0:[
              {"key": 36, "velocity": 127, "duration": 120}
            ],
            32:[
              {"key": 40, "velocity": 127, "duration": 120}
            ],
            48:[
              {"key": 36, "velocity": 127, "duration": 120}
            ],
            64: [
              {"key": 36, "velocity": 127, "duration": 120}
            ],
            72:[
              {"key": 36, "velocity": 127, "duration": 120}
            ],
            96: [
              {"key": 40, "velocity": 127, "duration": 120}
            ]
          }
        },
        {
          "id"       : "C419CF41-4AE2-4F4C-85CA-33C9E3BFCB49",
          "stepCount": 128,
          "steps"    : {
            0:[
              {"key": 36, "velocity": 127, "duration": 120},
              {"key": 46, "velocity": 30, "duration": 120}
            ],
            16:[
              {"key": 46, "velocity": 80, "duration": 120}
            ],
            32:[
              {"key": 40, "velocity": 127, "duration": 120},
              {"key": 46, "velocity": 30, "duration": 120}
            ],
            48:[
              {"key": 36, "velocity": 127, "duration": 120},
              {"key": 46, "velocity": 80, "duration": 120}
            ],
            64: [
              {"key": 36, "velocity": 127, "duration": 120},
              {"key": 46, "velocity": 80, "duration": 120}
            ],
            72:[
              {"key": 36, "velocity": 127, "duration": 120}
            ],
            80: [
              {"key": 46, "velocity": 80, "duration": 120}
            ],
            96: [
              {"key": 40, "velocity": 127, "duration": 120},
              {"key": 46, "velocity": 30, "duration": 120}
            ],
            112:[
              {"key": 46, "velocity": 80, "duration": 120}
            ]
          }
        }
      ]
    },
    {
      "id"      : "5EA6FD55-2869-472C-A181-E8CCA4C4CD19",
      "title"   : "Base Line",
      "midiOn"  : 145,
      "midiOff" : 129,

      "patterns": [
        {
          "id"       : "FF365142-12A4-4259-8C39-91E37077FB13",
          "stepCount": 128,
          "steps"    : {
            0:[
              {"key": 36, "velocity": 127, "duration": 100}
            ],
            16:[
              {"key": 56, "velocity": 127, "duration": 100}
            ],
            32:[
              {"key": 56, "velocity": 127, "duration": 100}
            ],
            64: [
              {"key": 36, "velocity": 127, "duration": 100}
            ],
            96: [
              {"key": 66, "velocity": 127, "duration": 100}
            ]
          }
        }
      ]
    }
  ]
};

