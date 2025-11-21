setcps(0.654)

stack(
  // ========================================
  // DRUMS (Attack Magazine Recommended Banks)
  // ========================================
  
  // KICK - Layer 909 + 808 (Book's recommended technique!)
  // 909 for punch and attack
  s("bd ~ bd ~")
    .bank("RolandTR909")
    .gain(slider(0.7, 0.5, 1.0, 0.05))
    .lpf(slider(120, 80, 200, 10))
    .hpf(slider(50, 40, 70, 5))
    .shape(slider(0.2, 0, 0.4, 0.05)),
  
  // 808 for deep sub-bass weight (layer underneath)
  s("bd ~ bd ~")
    .bank("RolandTR808")
    .gain(slider(0.4, 0.2, 0.6, 0.05))    // Lower gain
    .lpf(slider(80, 60, 120, 10))         // Only sub frequencies
    .hpf(35),

  // SNARE/CLAP - 909 (Standard for techno)
  s("~ cp ~ cp")
    .bank("RolandTR909")
    .gain(slider(0.7, 0.5, 0.9, 0.05))
    .hpf(slider(200, 150, 300, 10))
    .lpf(slider(8000, 6000, 12000, 100))
    .shape(slider(0.15, 0, 0.3, 0.05))
    .delay(slider(0.1, 0, 0.3, 0.05))
    .room(0.1),

  // CLOSED HI-HAT - 909 (Crisp and clean)
  s("~ ~ hh ~")
    .bank("RolandTR909")
    .gain(slider(0.3, 0.2, 0.5, 0.05))
    .speed(slider(1.5, 1.2, 2, 0.1))
    .hpf(slider(8000, 6000, 12000, 500))
    .crush(slider(8, 6, 12, 1))
    .pan(slider(0.3, -0.5, 0.5, 0.1)),

  // OPEN HAT - 909 (Metallic, long decay)
  s("~ oh ~ ~")
    .bank("RolandTR909")
    .gain(slider(0.4, 0.25, 0.6, 0.05))
    .speed(slider(0.9, 0.7, 1.2, 0.1))
    .hpf(slider(4000, 3000, 6000, 100))
    .decay(slider(0.4, 0.2, 0.6, 0.05))
    .delay(slider(0.15, 0, 0.3, 0.05))
    .pan(slider(-0.3, -0.5, 0.5, 0.1)),

  // ========================================
  // BASS
  // ========================================
  note("a1 [a1 a2] a1 [a2 a1] a1 [e2 a1] [g1 a1] [a1 a2]")
    .s("sawtooth")
    .slow(2)
    .transpose("<0 0 0 5 7>")
    .hpf(slider(35, 30, 50, 2))
    .lpf(slider(400, 250, 800, 10))
    .resonance(slider(15, 10, 20, 1))
    .shape(slider(0.5, 0.3, 0.7, 0.05))
    .gain(slider(0.75, 0.6, 0.9, 0.05))
    .room(0.05)
    .crush(slider(8, 6, 12, 1))
    .slide(slider(-0.3, -1, 1, 0.1)),

  // ========================================
  // STABS
  // ========================================
  note("<~ a3 ~ a3>")
    .chord("<m m7>")
    .s("supersaw")
    .hpf(slider(400, 300, 600, 50))
    .lpf(slider(3000, 2000, 5000, 50))
    .resonance(slider(5, 2, 10, 1))
    .gain(slider(0.5, 0.3, 0.7, 0.05))
    .shape(slider(0.3, 0, 0.5, 0.05))
    .decay(slider(0.2, 0.1, 0.4, 0.05))
    .delay(slider(0.25, 0, 0.4, 0.05))
    .room(slider(0.3, 0.1, 0.5, 0.05))
    .pan(slider(0, -0.4, 0.4, 0.1))
)
  // ========================================
  // GLOBAL EFFECTS
  // ========================================
  .hpf(35)
  .lpf(slider(15000, 10000, 20000, 500))
  .room(0.1)
  .size(0.5)
  .delay(0.08)
  .delaytime(0.25)
  .delayfeedback(0.25)
  .gain(slider(0.8, 0.6, 0.9, 0.05))