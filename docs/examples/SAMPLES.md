// Industrial Techno - 157 BPM
setcps(0.654)

stack(
  // KICK - Tight and punchy
  s("kick ~ kick ~")
    .end(0.15)              // Cut to 15% for tightness
    .gain(1.8)
    .lpf(3000)
    .shape(0.3)
    .speed(0.9)
    ._punchcard({
      labels: 1, 
      cycles: 2,
      active: "#FF0000",
      fillActive: 1
    }),

  // SNARE - Short and snappy
  s("~ snare ~ snare")
    .end(0.25)              // Cut to 25% for snap
    .gain(1.2)
    .shape(0.3)
    .lpf(5000)
    .speed(0.9)
    ._punchcard({
      labels: 1, 
      cycles: 2,
      active: "#FF0000",
      fillActive: 1
    }),

  // HAT - Crisp and controlled
  s("hat*4")
    .clip(0.2)              // Cut to fit rhythm
    .gain(1.0)
    .hpf(3000)
    .speed(1.5)
    ._punchcard({
      labels: 1, 
      cycles: 2,
      active: "#FF0000",
      fillActive: 1
    }),

  // BASS - Controlled length
  s("bass*8")
    .clip(0.8)              // Cut slightly to prevent overlap
    .gain(1.5)
    .lpf(slider(1500, 400, 3000, 10))
    .resonance(slider(6, 0, 30, 1))
    .shape(slider(0.4, 0, 1, 0.05))
    .crush(slider(6, 1, 16, 1))
    ._punchcard({
      labels: 1, 
      cycles: 2,
      active: "#FF0000",
      fillActive: 1
    }),

  // MELODY
  note("<b4 ~ d5 ~ f#4 ~ b4 ~ a4 ~ f#4 ~ d5 ~ b4 ~>")
    .s("triangle")
    .clip(0.5)              // Controlled decay
    .lpf(4000).gain(0.8)
    .delay(0.3).room(0.3)
    .vowel("<a e i o>")
    ._punchcard({
      labels: 1, 
      cycles: 4,
      active: "#FF0000",
      fillActive: 1
    }),

  // PAD - Fixed to stop properly
  s("pad")
    .slow(4)
    .end(0.4)               // Only play first 40% of sample
    .cut(1)                 // Stop previous pad when new one plays
    .lpf(1500)
    .gain(1.2)
    .room(0.5)
    .delay(0.3)
    ._punchcard({
      labels: 1, 
      cycles: 4,
      active: "#FF0000",
      fillActive: 1
    })
)
.room(0.2).delay(0.1)