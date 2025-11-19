  // KICK - Use .bank() to access Roland samples
  s("bd ~ bd ~")
    .bank("RolandTR909")              // Add .bank() here!
    .gain(slider(1.8, 1, 3, 0.05))
    .lpf(slider(1200, 400, 2000, 50))
    .speed(slider(1, 0.8, 1.3, 0.05))
    .shape(slider(0.5, 0, 1, 0.05)),

  // SNARE - Use RolandTR909 clap
  s("~ cp ~ cp")
    .bank("RolandTR909")
    .gain(slider(1.2, 0.4, 2, 0.05))
    .lpf(slider(4000, 2000, 8000, 100))
    .speed(slider(1, 0.8, 1.3, 0.05))
    .shape(slider(0.4, 0, 1, 0.05))
    .delay(slider(0.2, 0, 0.5, 0.05)),

  // HI-HAT - Use RolandTR909 hat
  s("~ ~ hh ~")
    .bank("RolandTR909")
    .gain(slider(0.8, 0.2, 1.5, 0.05))
    .speed(slider(1.5, 0.8, 3, 0.1))
    .hpf(slider(6000, 4000, 12000, 500))
    .crush(slider(8, 4, 16, 1)),