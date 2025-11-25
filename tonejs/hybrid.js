// Industrial Techno - 157 BPM
setcps(0.654) // 157 BPM

stack(
  // BASS - Industrial filtered bass
  note("b1 e2 b1 d3 b1 b2 b1 b1 b2 b1 b2 b1 b2 a2 b1 b2")
    .slow(2)
    .transpose("<0 0 0 5 7>")
    .s("sawtooth")
    .lpf(300).resonance(10)
    .shape(0.4).gain(0.8)
    .crush("<16 8>")
    .room(1.0).delay(0.3),

  // KICK
  s("bd ~ bd ~")
    .gain(0.64).lpf(600)
    .shape(0.6).speed(0.7),

  // SNARE
  s("~ cp ~ cp")
    .gain(0.45).shape(0.6)
    .lpf(1000).speed(0.9)
    .delay(0.6),

  // HI-HAT
  s("~ ~ hh ~")
    .hpf(20000).gain(0.2)
    .speed(1.5)
    .pan(sine.range(-0.3, 0.3))
    .crush(8),

  // MELODY - Dark stabs
  note("<b4 ~ d5 ~ f#4 ~ b4 ~ a4 ~ f#4 ~ d5 ~ b4 ~>")
    .s("pad")
    .lpf(4000).gain(1)
    .delay(0.3).room(0.3)
    .vowel("<a e i o>"),

  // ARPEGGIO - Trailing last note
  note("b5 d6 f#5 a5")
    .struct("[x x x x]*2")
    .s("fm")
    .lpf(1000).gain(0.7)
    .pan(saw.range(-0.5, 0.5))
    .delay("0 0 0 0.7")
    .room("0.1 0.1 0.1 0.8")
    .release("0.1 0.1 0.1 0.5")
    .gain("0.3 0.3 0.3 0.45")
    .late(4),

  // PAD - Atmospheric chord with sweep
  note("<b3 d4 f#4>")
    .s("sawtooth").slow(4)
    .lpf(100).gain(1)
    .room(0.2).delay(0.2)
    .cutoff(sine.slow(8).range(600, 1200))
    .late(4)
)
// Global effects
.room(0.2).delay(0.1)