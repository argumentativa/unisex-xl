// ========================================
// STRUDEL INDUSTRIAL TECHNO - 157 BPM
// ========================================

// Set tempo to 157 BPM
// EDIT: Change to any BPM. Formula: bpm / 60 / 4 = cps
// Examples: 0.5 = 120 BPM, 0.583 = 140 BPM, 0.708 = 170 BPM
setcps(0.654)


stack(
  // ========================================
  // INDUSTRIAL BASS LINE
  // ========================================
  
  // Bass note pattern - plays these notes in sequence
  // EDIT: Change note letters/octaves. Format: note + octave number
  // Examples: "c2 e2 g2" = C major, "f1 a1 c2" = F minor
  // Notes: c, d, e, f, g, a, b (add # for sharp, b for flat)
  note("b1 e2 b1 d3 b1 b2 b1 b1 b2 b1 b2 b1 b2 a2 b1 b2")
    
    // Slow down pattern by 2x (plays at half speed)
    // EDIT: Change number. Try: 1 (normal), 4 (very slow), 0.5 (double speed)
    // Range: 0.25-8
    .slow(2)
    
    // Transpose pattern in cycles (adds semitones)
    // EDIT: Pattern in < >. Try: "<0 7>" (fifth up), "<0 -5>" (down), "<0 0 0 12>" (octave)
    // Numbers = semitones: 5 = perfect fourth, 7 = fifth, 12 = octave
    .transpose("<0 0 0 5 7>")
    
    // Sound type - supersaw is thick, detuned sawtooth
    // EDIT: Try: "sawtooth" (raw), "square" (hollow), "triangle" (soft), 
    //            "sine" (pure), "bass" (deep), "fm" (metallic)
    .s("sawtooth")
    
    // Low-pass filter - removes frequencies above this value (in Hz)
    // EDIT: Change frequency. Try: 150 (very dark), 600 (bright), 1200 (open)
    // Range: 20-20000 Hz (lower = darker/muddier, higher = brighter/clearer)
    .lpf(300)
    
    // Filter resonance - emphasizes the cutoff frequency (creates "wah")
    // EDIT: Change amount. Try: 1 (smooth), 5 (mild emphasis), 20 (screaming)
    // Range: 0-30 (0 = no resonance, 30 = self-oscillating)
    .resonance(10)
    
    // Distortion/waveshaping - adds harmonics and grit
    // EDIT: Change amount. Try: 0.2 (mild crunch), 0.8 (heavy), 1.5 (destroyed)
    // Range: 0-2 (0 = clean, 2 = extreme saturation)
    .shape(0.4)
    
    // Volume/amplitude
    // EDIT: Change level. Try: 0.5 (quieter), 1.0 (normal), 1.5 (louder)
    // Range: 0-2 (0 = silent, 1 = normal, 2 = boosted)
    .gain(0.8)
    
    // Bit crushing - reduces bit depth for lo-fi/digital distortion
    // EDIT: Pattern in < >. Try: "<16 8>" (moderate), "<4 2>" (extreme), "<12>" (constant)
    // Range: 1-16 (1 = most degraded, 16 = clean/original quality)
    .crush("<16 8>")
    
    // Reverb - adds space/ambience
    // EDIT: Change amount. Try: 0 (completely dry), 0.5 (hall), 1.0 (cathedral)
    // Range: 0-1 (0 = no reverb, 1 = maximum space)
    .room(1.0)
    
    // Delay - echo effect
    // EDIT: Change mix. Try: 0 (no delay), 0.3 (noticeable), 0.7 (prominent)
    // Range: 0-1 (0 = dry, 1 = 100% wet)
    .delay(0.3),

  // ========================================
  // KICK DRUM - Aggressive filtered kick
  // ========================================
  
  // Drum sample pattern - "bd" = bass drum, "~" = rest/silence
  // EDIT: Change pattern. Try: "bd*2 ~ bd ~" (double kick), "bd bd bd bd" (four-floor)
  //                            "bd ~ ~ ~" (minimal), "[bd bd] ~ bd ~" (grouped)
  s("bd ~ bd ~")
    
    // Kick volume
    // EDIT: Try: 0.8 (softer), 1.5 (punchy), 2.0 (extreme)
    .gain(.64)
    
    // Filter to remove harsh highs and focus low end
    // EDIT: Try: 400 (very dark/subby), 2000 (brighter/clicky)
    .lpf(600)
    
    // Add grit to kick
    // EDIT: Try: 0.2 (clean/natural), 0.8 (distorted/industrial)
    .shape(0.6)
    
    // Pitch/playback speed
    // EDIT: Try: 0.7 (deeper/slower), 1.2 (higher/faster), 1.0 (original)
    // Range: 0.25-4 (below 1 = lower/slower, above 1 = higher/faster)
    .speed(.7),

  // ========================================
  // SNARE - Distorted clap/snare
  // ========================================
  
  // Clap pattern - "cp" = clap, "~" = rest
  // EDIT: Try: "~ sd ~ sd" (snare drum), "~ [cp cp] ~ cp" (double clap)
  //            "~ ~ cp ~" (sparse), "~ cp:2 ~ cp:1" (different samples)
  s("~ cp ~ cp")
    
    // Snare volume
    // EDIT: Try: 0.4 (quiet/background), 0.9 (loud/upfront)
    .gain(0.45)
    
    // Snare distortion for aggression
    // EDIT: Try: 0.1 (clean), 0.6 (crunchy), 1.0 (destroyed)
    .shape(0.6)
    
    // Brightness control
    // EDIT: Try: 1000 (darker/thuddy), 5000 (brighter/snappy), 8000 (crispy)
    .lpf(1000)
    
    // Pitch
    // EDIT: Try: 0.9 (lower), 1.0 (original), 1.3 (higher/snappier)
    .speed(0.9)
    
    // Delay for space and depth
    // EDIT: Try: 0 (completely dry), 0.4 (echoing), 0.6 (washy)
    .delay(0.6),

  // ========================================
  // HI-HATS - Noise percussion
  // ========================================
  
  // Hat pattern - "hh" = closed hi-hat
  // EDIT: Try: "hh*4" (16th notes), "[hh hh] ~ hh ~" (syncopated)
  //            "hh:1 hh:2 hh:3 hh:4" (different hat samples)
  s("~ ~ hh ~")
    
    // High-pass filter - removes low frequencies for crisp sound
    // EDIT: Try: 4000 (fuller/warmer), 12000 (thin/airy), 15000 (extreme brightness)
    // Range: 100-20000 Hz (lower = more body, higher = thinner/crisper)
    .hpf(20000)
    
    // Hat volume
    // EDIT: Try: 0.1 (very subtle), 0.4 (prominent), 0.6 (loud)
    .gain(0.2)
    
    // Pitch/texture
    // EDIT: Try: 1.0 (normal), 2.0 (brighter/tighter), 0.8 (darker/looser)
    .speed(1.5)
    
    // Stereo panning with sine wave modulation
    // EDIT: Change range values. Try: 0 (center), .range(-1, 1) (full stereo)
    //       Or use: rand.range(-0.5, 0.5) for random panning
    //       sine = smooth movement, saw = ramping, square = hard switching
    .pan(sine.range(-0.3, 0.3))
    
    // Lo-fi bit reduction
    // EDIT: Try: 4 (very crunchy), 12 (mild texture), 16 (clean)
    .crush(8),

  // ========================================
  // MELODIC SYNTH STABS - Dark melody
  // ========================================
  
  // Melodic pattern with rests - < > creates cycling pattern
  // EDIT: Change notes. Try: "c4 ~ e4 ~ g4 ~" (C major), "f3 ~ ab3 ~ c4 ~" (F minor)
  //       Add more patterns: "<b4 ~ d5 ~ | a4 ~ c5 ~>" (alternates every bar)
  note("<b4 ~ d5 ~ f#4 ~ b4 ~ a4 ~ f#4 ~ d5 ~ b4 ~>")
    
    // Synth sound type
    // EDIT: Try: "sawtooth" (bright/buzzy), "square" (hollow/videogame), 
    //            "sine" (pure/soft), "piano" (sampled), "pad" (atmospheric)
    .s("pad")
    
    // Filter for brightness/darkness
    // EDIT: Try: 800 (dark/mellow), 4000 (bright/present), 6000 (piercing)
    .lpf(4000)
    
    // Melody volume
    // EDIT: Try: 0.3 (background layer), 0.7 (lead/prominent), 1.0 (dominant)
    .gain(1)
    
    // Delay/echo amount
    // EDIT: Try: 0.1 (subtle tail), 0.6 (prominent echo), 0.8 (washy/ambient)
    .delay(0.3)
    
    // Reverb for space
    // EDIT: Try: 0.1 (tight/dry), 0.6 (large hall), 0.9 (huge space)
    .room(0.3)
    
    // Vowel formant filter - shapes tone like human voice
    // EDIT: Pattern of vowels. Try: "<a>" (constant), "<u o>" (darker), 
    //       "<e i>" (brighter), "<a e i o u>" (full cycle)
    // Options: a (ah), e (eh), i (ee), o (oh), u (oo)
    .vowel("<a e i o>")
    
    // Pattern speed multiplier
    // EDIT: Try: 2 (double-time), 0.5 (half-speed), 4 (very fast)
    .fast(1),

  // ========================================
  // FAST ARPEGGIO - High frequency texture
  // ========================================
  
  // Arpeggio notes - cycles through these pitches
  // EDIT: Change notes. Try: "c5 e5 g5" (C major triad), "d5 f5 a5 c6" (more notes)
  //       Add patterns: "b5 d6 f#5 <a5 a6>" (varying octaves)
  
 
  note("b5 d6 f#5 a5")

  // TAIL EFFECTS ON LAST NOTE:
  .delay("0 0 0 0.7")            // Last note gets echo
  .room("0.1 0.1 0.1 0.8")       // Last note gets space
  .release("0.1 0.1 0.1 0.5")    // Last note sustains longer
  .gain("0.3 0.3 0.3 0.45")      // Last note slightly louder
  .late(2)
    
    // Rhythm structure - "x" = trigger, "*2" = repeat twice
    // EDIT: Try: "x*4" (steady 16ths), "x ~ x ~" (sparse), "[x x x] ~ x ~" (grouped)
    //            "x(3,8)" (Euclidean rhythm - 3 hits in 8 steps)
    .struct("[x x x x]*2")
    
    // Arpeggio sound
    // EDIT: Try: "square" (harsh/chippy), "sine" (soft/pure), "fm" (bell-like)
    .s("fm")
    
    // Brightness
    // EDIT: Try: 2000 (darker/mellower), 8000 (very bright/cutting), 1000 (warm)
    .lpf(1000)
    
    // Arp volume
    // EDIT: Try: 0.2 (subtle background), 0.5 (prominent), 0.7 (lead)
    .gain(0.7)
    
    // Stereo movement with saw wave (ramps left to right)
    // EDIT: Try: 0 (center/mono), sine.range(-1, 1) (smooth full stereo)
    //       rand.range(-0.8, 0.8) (random per note)
    .pan(saw.range(-0.5, 0.5))
    
    // Delay for spaciousness
    // EDIT: Try: 0.2 (tight echo), 0.6 (spacey/ambient), 0.8 (very washy)
    .delay(0.4)
    
    // Entrance delay - starts after 2 measures
    // EDIT: Try: 0 (starts immediately), 1 (after 1 bar), 4 (after 4 bars)
    // Timing: numbers = measures/bars
    .late(4),

  // ========================================
  // ATMOSPHERIC PAD - Dark chord
  // ========================================
  
  // Pad chord notes - < > cycles through the chord tones
  // EDIT: Change chord. Try: "<c3 e3 g3>" (C major), "<d3 f3 a3>" (D minor)
  //       Add 7ths: "<b3 d4 f#4 a4>", Sus chords: "<c3 f3 g3>"
  note("<b3 d4 f#4>")
    
    // Pad sound - sawtooth is full/warm
    // EDIT: Try: "square" (hollow/airy), "triangle" (smooth), 
    //            "pad" (sampled pad), "strings" (orchestral)
    .s("sawtooth")
    
    // Chord change speed - very slow for atmospheric pad
    // EDIT: Try: 2 (changes more often), 8 (very slow drone), 1 (fast)
    .slow(4)
    
    // Filter for darkness/mood
    // EDIT: Try: 400 (very dark/murky), 1500 (brighter/clearer), 200 (extreme dark)
    .lpf(100)
    
    // Pad volume - should be subtle background
    // EDIT: Try: 0.1 (barely there), 0.25 (present), 0.4 (prominent)
    .gain(1)
    
    // Huge reverb for atmosphere
    // EDIT: Try: 0.5 (hall), 1.0 (cathedral/infinite), 0.3 (room)
    .room(0.2)
    
    // Delay wash
    // EDIT: Try: 0 (dry), 0.4 (ambient), 0.6 (very spacey)
    .delay(0.2)
    
    // Entrance time - pad comes in after 4 bars
    // EDIT: Try: 2 (earlier), 8 (much later), 0 (immediate)
    .late(4)
    
    // Automated filter sweep - sine wave modulates cutoff over 8 measures
    // EDIT: Change .slow(8) to .slow(4) (faster sweep) or .slow(16) (slower)
    //       Change .range(600, 1200) to .range(300, 800) (darker) or .range(1000, 2000) (brighter)
    //       Try: .range(sine.slow(4).range(400, 1000)) for nested modulation
    .cutoff(sine.slow(8).range(600, 1200))
)

// ========================================
// GLOBAL EFFECTS (applied to entire mix)
// ========================================

// Overall reverb amount
// EDIT: Try: 0.1 (dry/tight), 0.5 (spacious hall), 0.8 (huge cathedral)
.room(0.2)

// Overall delay amount
// EDIT: Try: 0 (none), 0.3 (ambient wash), 0.5 (prominent echo)
.delay(0.1)

// ========================================
// ADDITIONAL GLOBAL MODIFIERS (uncomment to use)
// ========================================

// Slow entire pattern by 2x
// .slow(2)                           // EDIT: Try different values

// Speed up entire pattern by 2x
// .fast(2)                           // EDIT: Try different values

// Apply effect every N cycles
// .every(4, x => x.speed(0.5))       // EDIT: Every 4 cycles, pitch down
// .every(8, x => x.room(0.8))        // EDIT: Every 8 cycles, huge reverb
// .every(2, x => x.gain(1.5))        // EDIT: Every 2 cycles, boost volume

// Random effect application
// .sometimes(x => x.crush(2))        // EDIT: Sometimes heavy bit crush
// .sometimes(x => x.shape(0.8))      // EDIT: Sometimes add distortion
// .rarely(x => x.gain(0))            // EDIT: Rarely mute completely