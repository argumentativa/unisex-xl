setcps(0.654)

stack(
  // ========================================
  // BASS - Industrial filtered bass
  // ========================================
  note("b1 e2 b1 d3 b1 b2 b1 b1 b2 b1 b2 b1 b2 a2 b1 b2")
    .slow(2)
    .transpose("<0 0 0 5 7>")
    .s("sawtooth")
    .lpf(slider(300, 80, 2000, 10))
    .resonance(slider(10, 0, 30, 1))
    .shape(slider(0.4, 0, 2, 0.05))
    .gain(slider(0.8, 0, 2, 0.05))
    .crush(slider(12, 1, 16, 1))
    .room(slider(1.0, 0, 1, 0.05))
    .delay(slider(0.3, 0, 1, 0.05)),

  // ========================================
  // KICK - Aggressive filtered kick
  // ========================================
  s("bd ~ bd ~")
    .gain(slider(0.64, 0, 2, 0.05))
    .lpf(slider(600, 300, 1500, 50))
    .shape(slider(0.6, 0, 2, 0.05))
    .speed(slider(0.7, 0.5, 1.5, 0.05)),

  // ========================================
  // SNARE - Distorted clap/snare
  // ========================================
  s("~ cp ~ cp")
    .gain(slider(0.05, 0, 1.5, 0.05))
    .shape(slider(0.9, 0, 2, 0.05))
    .lpf(slider(2100, 500, 5000, 100))
    .speed(slider(0.8, 0.5, 1.5, 0.05))
    .delay(slider(0.6, 0, 1, 0.05)),

  // ========================================
  // HI-HAT - Noise percussion
  // ========================================
  s("~ ~ hh ~")
    .hpf(slider(20000, 4000, 20000, 500))
    .gain(slider(0.2, 0, 0.8, 0.05))
    .speed(slider(1.5, 0.5, 3, 0.1))
    .pan(sine.range(-0.3, 0.3))
    .crush(slider(8, 1, 16, 1)),

  // ========================================
  // MELODY - Dark melodic stabs
  // ========================================
  note("<b4 ~ d5 ~ f#4 ~ b4 ~ a4 ~ f#4 ~ d5 ~ b4 ~>")
    .s("pad")
    .lpf(slider(4000, 800, 8000, 100))
    .gain(slider(1, 0, 2, 0.05))
    .delay(slider(0.3, 0, 1, 0.05))
    .room(slider(0.3, 0, 1, 0.05))
    .shape(slider(0, 0, 1, 0.05))
    .speed(slider(1, 0.5, 2, 0.05))
    .vowel("<a e i o>"),

  // ========================================
  // ARPEGGIO - High frequency texture
  // ========================================
  note("b5 d6 f#5 a5")
    .struct("[x x x x]*2")
    .s("fm")
    .lpf(slider(1000, 500, 10000, 100))
    .gain(slider(0.7, 0, 1.5, 0.05))
    .speed(slider(1, 0.5, 2, 0.1))
    .shape(slider(0, 0, 1, 0.05))
    .pan(saw.range(-0.5, 0.5))
    .delay("0 0 0 0.7")
    .room("0.1 0.1 0.1 0.8")
    .release("0.1 0.1 0.1 0.5")
    .late(4),

  // ========================================
  // PAD - Atmospheric chord with sweep
  // ========================================
  note("<b3 d4 f#4>")
    .s("sawtooth")
    .slow(4)
    .lpf(slider(140, 50, 1000, 10))
    .gain(slider(0.7, 0, 2, 0.05))
    .room(slider(0.65, 0, 1, 0.05))
    .delay(slider(0.05, 0, 1, 0.05))
    .shape(slider(0.15, 0, 1, 0.05))
    .cutoff(sine.slow(8).range(600, 1200))
    .late(4)
)

// Global effects
.room(slider(0, 0, 1, 0.05))
.delay(slider(0, 0, 1, 0.05))