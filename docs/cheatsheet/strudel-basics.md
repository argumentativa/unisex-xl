# Strudel Basics

Quick reference for Strudel mini-notation and pattern language.

## What is Strudel?

Strudel is a **pattern-based music language** inspired by Tidal Cycles. Instead of writing traditional code, you write **patterns** using a compact notation.

**Think of it like:**
- **CSS Grid** - Concise syntax for complex layouts
- **Regular expressions** - Compact patterns for powerful matching
- **Musical notation** - Symbols represent timing and notes

---

## Basic Syntax

```javascript
// Play drum samples
s("bd sd bd sd")
// s() = sound/sample
// "bd sd bd sd" = pattern (kick, snare, kick, snare)

// Play notes
note("c4 e4 g4")
// note() = pitch
// "c4 e4 g4" = C major triad

// Stack patterns (play simultaneously)
stack(
  s("bd ~ bd ~"),      // Kick on 1 and 3
  s("~ sd ~ sd")       // Snare on 2 and 4
)
```

---

## Mini-Notation Cheatsheet

```javascript
// BASIC PATTERNS
"a b c d"          // Play 4 events in sequence
"a ~ b ~"          // ~ = rest/silence
"a [b c]"          // [brackets] = subdivision (b and c fit in one step)
"a [b c d]"        // b, c, d play 3x faster in one step
"a [b [c d]]"      // Nested subdivisions

// REPETITION
"a*4"              // Repeat 'a' 4 times
"[a b]*2"          // Repeat pattern 2 times
"a!4"              // Same as a*4 (alternative syntax)

// RHYTHM
"a . b . c"        // . = extend previous event (legato)
"a _ b"            // _ = hold previous event

// RANDOMNESS
"a | b"            // | = OR (choose one randomly each cycle)
"a, b, c"          // , = randomly pick from list
"[a b | c d]"      // Randomly pick bracketed group

// POLYRHYTHMS
"a b c, d e"       // , = separate rhythmic layers (3 against 2)
"{a b, c d e}"     // {} = polyrhythm container
```

---

## Essential Functions

```javascript
// SOUND/SAMPLE SELECTION
s("bd")                    // Built-in samples (bd = kick)
note("c4").s("sawtooth")   // Synth with note

// EFFECTS
.lpf(1000)                 // Low-pass filter (cutoff freq in Hz)
.hpf(200)                  // High-pass filter
.room(0.5)                 // Reverb (0-1)
.delay(0.5)                // Echo
.gain(0.8)                 // Volume (0-1)
.pan(0.5)                  // Stereo position (-1 left, 1 right)
.shape(0.5)                // Distortion
.crush(8)                  // Bit crusher (lower = more distortion)

// TIMING
.slow(2)                   // Half speed (play pattern over 2 cycles)
.fast(2)                   // Double speed (2 cycles in 1)
.early(0.1)                // Shift earlier
.late(0.1)                 // Shift later

// TRANSFORMATION
.rev()                     // Reverse pattern
.jux(rev)                  // Stereo trick (right channel reversed)
.every(4, x => x.fast(2))  // Every 4th cycle, double speed
.sometimes(x => x.gain(0.5)) // Randomly apply transformation
```

---

## Working with Samples

### Built-in Samples

```javascript
// Common drum samples
s("bd")        // Bass drum/kick
s("sd")        // Snare
s("hh")        // Hi-hat (closed)
s("oh")        // Open hi-hat
s("cp")        // Clap
s("rim")       // Rimshot
s("tom")       // Tom

// Melodic samples
s("piano")
s("bass")
s("pad")
```

### Custom Samples (Your Kit01)

```javascript
// After loading samples folder in Strudel UI
s("kick")      // Your Kit01_Kick.wav
s("snare")     // Your Kit01_Snare.wav
s("hat")       // Your Kit01_Hat.wav
s("bass")      // Your Kit01_Bass.wav
s("pad")       // Your Kit01_SynthPad.wav
s("tom")       // Your Kit01_tom.wav
```

### Sample Selection

```javascript
s("bd:0")      // First variation
s("bd:1")      // Second variation
s("bd:2")      // Third variation

// Random variations
s("bd:[0 1 2]")  // Cycle through
s("bd:rand")     // Random each time
```

---

## Note Patterns

```javascript
// Basic notes
note("c4")              // Middle C
note("c4 e4 g4")        // C major chord (as arpeggio)
note("c4 e4 g4").chord() // Play as chord

// Scales
note("0 2 4 5").scale("C:minor")  // Scale degrees
note("c d e f g").scale("C:major") // Note names

// Octaves
note("c3")     // Low
note("c4")     // Middle
note("c5")     // High

// Accidentals
note("c# d# e")   // Sharps
note("db eb f")   // Flats
```

---

## Tempo & Timing

```javascript
// Set tempo (cycles per second)
setcps(1)      // 120 BPM (1 cycle per second)
setcps(0.654)  // 157 BPM (for techno)

// BPM conversion
// BPM ÷ 60 ÷ 4 = CPS
// 120 BPM = 120 ÷ 60 ÷ 4 = 0.5 CPS
// 157 BPM = 157 ÷ 60 ÷ 4 = 0.654 CPS
```

---

## Common Patterns

### Basic Beat
```javascript
s("bd sd bd sd")
```

### Four-on-Floor with Hi-Hats
```javascript
stack(
  s("bd ~ bd ~"),           // Kick every other step
  s("~ sd ~ sd"),           // Snare on backbeat
  s("hh hh hh hh")          // Hi-hat on every step
)
```

### Rolling Hi-Hats
```javascript
s("[hh hh hh hh]*4")       // 16 hi-hats per cycle
```

### Bassline
```javascript
note("a1 a1 e2 a1")
  .s("sawtooth")
  .lpf(800)
  .resonance(10)
```

---

## Subdivision Examples

```javascript
// Each means something different:

"a b c d"          // 4 equal steps
"a [b c] d"        // a, then b+c (subdivided), then d
"[a b c d]"        // All 4 in the time of 1 step
"a [b [c d]]"      // a, then b, then c+d (nested)

// Visual timing:
"a b c d"          →  | a | b | c | d |
"a [b c] d"        →  | a |b c| d |   |
"[a b c d]"        →  |abcd|   |   |   |
```

---

## Euclidean Rhythms

Automatically distribute hits evenly across steps:

```javascript
s("bd").euclidean(3, 8)    // 3 hits in 8 steps → x..x..x.
s("bd").euclidean(5, 8)    // 5 hits in 8 steps → x.xx.xx.
s("bd").euclidean(7, 12)   // 7 hits in 12 steps

// Great for polyrhythms
stack(
  s("bd").euclidean(3, 8),   // Kick
  s("sd").euclidean(5, 8),   // Snare
  s("hh").euclidean(7, 8)    // Hats
)
```

---

## Sliders (Live Control)

```javascript
// Create interactive sliders
note("a1 e2 a1 d2")
  .s("sawtooth")
  .lpf(slider(800, 200, 2000))  // Min 200, Max 2000, Start 800
  .resonance(slider(10, 0, 20))
  .gain(slider(0.8, 0, 1))

// Now you can tweak in real-time while playing!
```

---

## Visualizations

```javascript
// Punchcard (piano roll style)
s("bd sd bd sd")
  ._punchcard({
    labels: 1,        // Show labels
    cycles: 2,        // Show 2 cycles
    active: "#FF0000", // Color
    fillActive: 1     // Fill style
  })

// Scope (oscilloscope)
s("bd sd")._scope()

// Pianoroll
note("c4 e4 g4")._pianoroll()

// Spiral
s("bd")._spiral()
```

---

## Complete Example

```javascript
// Industrial techno pattern
setcps(0.654) // 157 BPM

stack(
  // Kick - punchy 4/4
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000)
    .shape(0.3),
  
  // Snare - backbeat
  s("~ snare ~ snare")
    .gain(0.7)
    .hpf(2000),
  
  // Hi-hats - rolling
  s("[hat hat hat hat]*4")
    .gain(0.3)
    .hpf(8000)
    .pan(sine.range(-0.3, 0.3)), // Stereo movement
  
  // Bass - filtered
  note("a1 [a1 a2] a1 [a2 a1]")
    .s("sawtooth")
    .slow(2)
    .lpf(slider(400, 200, 800))
    .resonance(slider(15, 10, 20))
    .shape(0.5)
    .crush(8)
)
```

---

## Quick Modifications

```javascript
// CHANGE PATTERN DENSITY
"a b c d"          →  "a [b c] d e"       // Add subdivision
"a b c d"          →  "a ~ b ~ c ~ d ~"   // Add rests

// CHANGE SPEED
s("bd sd").slow(2)    // Slower
s("bd sd").fast(2)    // Faster

// ADD RANDOMNESS
s("bd sd")            →  s("bd | sd | cp") // Random choice
note("c e g")         →  note("c e g, a c e") // Random pattern

// ADD EFFECTS
s("bd")               →  s("bd").room(0.5).delay(0.3)
note("c e g")         →  note("c e g").lpf(1000).resonance(10)
```

---

## Troubleshooting

**No sound:**
- Check sample name: `s("kick")` not `s("Kit01_Kick")`
- Verify samples folder loaded in UI
- Check browser console for errors

**Pattern doesn't loop:**
- Strudel patterns loop by default
- Press stop/start if needed

**Timing feels off:**
- Use `setcps()` to set tempo
- Check if `.slow()` or `.fast()` applied

---

## Next Steps

- Learn [Advanced Strudel](./strudel-advanced.md) for transformations
- See [Templates](./templates.md) for complete patterns
- Check [Timing](./timing.md) for rhythm concepts
