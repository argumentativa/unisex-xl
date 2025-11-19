# Strudel Advanced

Advanced pattern techniques, transformations, and composition strategies.

## Pattern Transformations

### Every (Conditional)

```javascript
// Every Nth cycle, apply transformation
s("bd sd bd sd")
  .every(4, x => x.fast(2))  // Every 4th cycle, double speed
  
s("bd sd bd sd")
  .every(2, x => x.rev())    // Every 2nd cycle, reverse
  
// Multiple transformations
s("bd sd")
  .every(3, x => x.fast(2).gain(0.5))
```

### Sometimes (Random)

```javascript
// Randomly apply transformations
s("bd sd bd sd")
  .sometimes(x => x.fast(2))     // 50% chance
  
s("bd sd bd sd")
  .often(x => x.gain(0.5))       // 75% chance
  
s("bd sd bd sd")
  .rarely(x => x.rev())          // 25% chance
  
s("bd sd bd sd")
  .never(x => x.fast(2))         // 0% chance (for testing)
```

### Degradation (Glitch)

```javascript
// Randomly remove events
s("bd sd bd sd").degrade()        // Remove some hits
s("bd sd bd sd").degradeBy(0.3)   // Remove 30% of hits
s("bd sd bd sd").undegrade(0.7)   // Keep 70% of hits

// Creates organic, glitchy patterns
s("[hh hh hh hh]*4").degradeBy(0.4) // Sparse hi-hats
```

---

## Advanced Euclidean Patterns

### Rotation

```javascript
// Rotate the pattern
s("bd").euclidean(3, 8)               // x..x..x.
s("bd").euclidean(3, 8).rotate(1)     // .x..x..x
s("bd").euclidean(3, 8).rotate(-1)    // .x..x.x.

// Animate rotation
s("bd").euclidean(3, 8).rotate("<0 1 2 3>") // Cycles through rotations
```

### Offset

```javascript
// Start at different position
s("bd").euclidean(5, 8, 0)   // Default start
s("bd").euclidean(5, 8, 2)   // Start at position 2
```

### Polyrhythmic Layers

```javascript
// Complex polyrhythms using Euclidean
stack(
  s("bd").euclidean(3, 8),     // Kick: 3/8
  s("sd").euclidean(5, 8),     // Snare: 5/8
  s("hh").euclidean(7, 8),     // Hats: 7/8
  s("rim").euclidean(4, 7)     // Rim: 4/7 (different base!)
)
```

---

## Stereo & Spatial

### Panning

```javascript
// Static pan
s("bd").pan(0)      // Center
s("bd").pan(-1)     // Full left
s("bd").pan(1)      // Full right

// Modulated pan (stereo movement)
s("hh hh hh hh")
  .pan(sine.range(-1, 1))      // Sine wave sweep
  
s("hh hh hh hh")
  .pan(saw.range(-0.5, 0.5))   // Sawtooth sweep

// Pattern-based pan
s("bd sd bd sd")
  .pan("<0 0.25 0.5 0.75>")    // Sequence positions
```

### Jux (Stereo Trickery)

```javascript
// Apply transformation to one channel only
s("bd sd bd sd")
  .jux(rev)                    // Right channel reversed
  
note("c e g a")
  .jux(x => x.add(7))          // Right channel +7 semitones
  
s("hh hh hh hh")
  .jux(x => x.fast(2))         // Right channel double speed

// Creates wide stereo field
```

---

## Scales & Harmony

### Scale Modes

```javascript
// Major modes
note("0 2 4 5 7").scale("C:major")     // Ionian (major)
note("0 2 4 5 7").scale("C:dorian")    // Dorian
note("0 2 4 5 7").scale("C:mixolydian") // Mixolydian

// Minor modes
note("0 2 4 5 7").scale("A:minor")     // Aeolian (natural minor)
note("0 2 4 5 7").scale("A:phrygian")  // Phrygian

// Exotic
note("0 2 4 5 7").scale("C:harmonic_minor")
note("0 2 4 5 7").scale("C:melodic_minor")
note("0 2 4 5 7").scale("C:whole_tone")
note("0 2 4 5 7").scale("C:chromatic")
```

### Chord Voicings

```javascript
// Single notes to chords
note("c4 e4 g4").chord()             // Play simultaneously

// Chord inversions
note("c4 e4 g4").voicing()           // Smart voicing
note("c4 g4 e4").voicing()           // Different inversion

// Chord types
note("c4").chord("<major minor dim aug>")
```

### Harmonic Progressions

```javascript
// Common progressions
note("<c4 a3 f3 g3>")               // I - VI - IV - V
  .chord("major")
  .voicing()
  
note("<c4 e4 a3 f3>")               // I - III - VI - IV
  .chord("<major minor minor major>")
  
// Berlin techno progression
note("<a3 c4 d4 e4>")               // Am - C - Dm - Em
  .chord("minor")
  .voicing()
  .slow(4)                           // Slow chord changes
```

---

## Modulation & LFOs

### Built-in Modulators

```javascript
// Sine wave (smooth)
s("bd").gain(sine.range(0.5, 1))
s("bd").lpf(sine.range(200, 2000))

// Saw wave (ramp)
s("hh hh hh hh").pan(saw.range(-1, 1))

// Square wave (on/off)
s("bd").gain(square.range(0, 1))

// Triangle wave
s("bd").lpf(tri.range(300, 1000))

// Random (perlin noise)
s("bd").pan(perlin.range(-0.5, 0.5))
```

### Modulation Speed

```javascript
// Slow modulation
s("bd").lpf(sine.slow(4).range(200, 1000))  // Over 4 cycles

// Fast modulation
s("bd").lpf(sine.fast(8).range(200, 1000))  // 8 times per cycle

// Rhythmic modulation
s("bd").lpf(sine.segment(4).range(200, 1000)) // Stepped
```

---

## Pattern Composition

### Layering (Stack)

```javascript
// Vertical composition
stack(
  s("bd ~ bd ~"),               // Layer 1: Kick
  s("~ sd ~ sd"),               // Layer 2: Snare
  s("hh hh hh hh"),             // Layer 3: Hats
  note("a1 e2 a1 d2").s("bass") // Layer 4: Bass
)
```

### Sequential (Cat)

```javascript
// Horizontal composition (one after another)
cat(
  s("bd sd bd sd"),     // Pattern A (plays first)
  s("bd bd sd sd")      // Pattern B (plays second)
)
// Each plays for one cycle, then switches

// With different lengths
cat(
  s("bd sd").slow(2),   // 2 cycles
  s("hh hh hh hh")      // 1 cycle
)
```

### Alternating (Alt)

```javascript
// Alternate between patterns
s("bd").alt(s("sd"))    // Alternates each cycle
```

---

## Advanced Timing

### Polymetric Patterns

```javascript
// Different pattern lengths playing together
stack(
  s("bd sd bd"),        // 3 steps
  s("hh hh hh hh")      // 4 steps
)
// They'll phase in and out!

// Explicit polymeter
"{bd sd bd, hh hh hh hh}"
```

### Offset Timing

```javascript
// Shift pattern in time
s("bd sd bd sd").early(0.1)   // Ahead of beat
s("bd sd bd sd").late(0.1)    // Behind beat

// Humanize (random timing)
s("hh hh hh hh").late(rand.range(0, 0.05))
```

### Time Stretching

```javascript
// Non-linear time
s("bd sd bd sd").slow(2)              // Half speed
s("bd sd bd sd").fast(2)              // Double speed
s("bd sd bd sd").stretch(1.5)         // 1.5x length

// Accelerando/ritardando
s("bd sd bd sd").speed("<1 1.1 1.2 1.3>")
```

---

## Sample Manipulation

### Playback Speed

```javascript
s("kick").speed(1)      // Normal
s("kick").speed(2)      // Double speed (octave up)
s("kick").speed(0.5)    // Half speed (octave down)
s("kick").speed(-1)     // Reversed

// Random speeds
s("kick").speed(rand.range(0.8, 1.2))
```

### Sample Slicing

```javascript
// Play specific slice of sample
s("break").slice(8, "0 2 4 6")  // 8 slices, play 0,2,4,6

// Cut up breaks
s("break:0").slice(16, "<0 2 4 6 | 1 3 5 7>")
```

### Begin/End

```javascript
// Play portion of sample
s("pad").begin(0.25)     // Start 25% in
s("pad").end(0.75)       // End at 75%
s("pad").begin(0.25).end(0.5) // Middle 25%

// Scrubbing effect
s("pad").begin("<0 0.25 0.5 0.75>")
```

---

## Advanced Effects

### Filter Sweeps

```javascript
// Classic techno filter sweep
note("a1 a1 a1 a1")
  .s("sawtooth")
  .lpf(sine.slow(4).range(100, 2000))
  .resonance(15)
  .gain(0.8)
```

### Sidechain Pumping

```javascript
// Volume ducking effect
stack(
  s("bd ~ bd ~").gain(1),
  note("a1 a1 a1 a1")
    .s("sawtooth")
    .gain(sine.segment(4).range(0.3, 0.8)) // Ducks with kick
)
```

### Frequency Shifter

```javascript
s("bd").fshift(100)      // Shift frequencies up 100Hz
s("bd").fshift(-50)      // Shift down (metallic effect)
```

---

## Pattern Variables

### Reusable Patterns

```javascript
// Store patterns in variables
const kick = s("bd ~ bd ~").gain(1.2);
const snare = s("~ sd ~ sd").gain(0.7);
const hats = s("hh hh hh hh").gain(0.3);

// Compose
stack(kick, snare, hats)
```

### Pattern Functions

```javascript
// Create pattern generators
const bassline = (root) => 
  note(`${root}1 ${root}1 ${root}2 ${root}1`)
    .s("sawtooth")
    .lpf(400);

// Use with different roots
bassline("a")
bassline("e")

// Switch between them
bassline("<a e d f>")
```

---

## Berlin Techno Techniques

### Rolling Bass

```javascript
note("a1 [a1 a2] a1 [a2 a1] a1 [e2 a1] [g1 a1] [a1 a2]")
  .s("sawtooth")
  .slow(2)
  .lpf(slider(400, 150, 800))
  .resonance(slider(15, 10, 20))
  .shape(slider(0.5, 0.3, 0.7))
  .crush(slider(8, 6, 12))
```

### Filtered Drums

```javascript
s("kick ~ kick ~")
  .lpf(sine.slow(2).range(800, 3000))  // Sweeping filter
  .shape(0.4)                           // Saturation
```

### Aggressive Snare

```javascript
s("~ snare ~ snare")
  .gain(0.8)
  .shape(0.6)              // Heavy distortion
  .hpf(2000)               // Remove low end
  .room(0.1)               // Minimal reverb
```

---

## Performance Tips

### Live Coding Workflow

```javascript
// Start simple
s("bd ~ bd ~")

// Add layer by layer
s("bd ~ bd ~").stack(
  s("~ sd ~ sd")
)

// Build up
s("bd ~ bd ~").stack(
  s("~ sd ~ sd"),
  s("hh hh hh hh")
)

// Add bass
s("bd ~ bd ~").stack(
  s("~ sd ~ sd"),
  s("hh hh hh hh"),
  note("a1 e2 a1 d2").s("bass")
)
```

### Quick Mutes

```javascript
// Mute layer with gain(0)
stack(
  s("bd ~ bd ~").gain(1),      // Playing
  s("~ sd ~ sd").gain(0),      // Muted
  s("hh hh hh hh").gain(1)     // Playing
)
```

### Transitions

```javascript
// Gradual filter opening
note("a1 a1 a1 a1")
  .s("sawtooth")
  .lpf("<200 400 800 1600 3200>") // Opens over 5 cycles
```

---

## Debugging Patterns

```javascript
// See what's happening
s("bd sd bd sd")._inspect()

// Visualize timing
s("bd sd bd sd")._punchcard()

// Check notes
note("c e g a")._pianoroll()

// See structure
s("[bd sd] ~ [bd [sd sd]]")._scope()
```

---

## Next Steps

- See [Strudel Basics](./strudel-basics.md) for fundamentals
- Check [Templates](./templates.md) for complete examples
- Learn [Timing](./timing.md) for rhythm theory
