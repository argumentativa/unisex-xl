# Strudel Mixing Cheatsheet
## Based on "Mixing and Mastering In the Box" by Steve Savage

Professional mixing principles translated into Strudel code for live coding techno and electronic music.

---

## Quick Reference: Strudel Effects Map

```javascript
// FREQUENCY EFFECTS
.lpf(freq)           // Low-pass filter (darker)
.hpf(freq)           // High-pass filter (thinner)
.bpf(freq)           // Band-pass filter (telephone)
.resonance(amount)   // Filter emphasis (squelchy)

// DYNAMICS
.gain(level)         // Volume (0-1)
.compress(amount)    // Compression
.shape(amount)       // Distortion/saturation (0-1)
.crush(bits)         // Bit crusher (1-16, lower = grittier)

// SPACE/TIME
.room(amount)        // Reverb (0-1)
.delay(time)         // Echo
.pan(position)       // Stereo position (-1 to 1)

// MODULATION
.lfo(...)            // Modulation source
```

---

## Instrument-Specific Mixing

### 1. Kick Drum (Foundation)

**Savage's Principle:** "Kick owns 60-80 Hz. Keep it punchy and clear."

```javascript
// BASIC KICK
s("kick")
  .gain(1.8)           // Loud (foundation)
  .lpf(3000)           // Remove harsh highs
  .shape(0.3)          // Slight saturation for punch

// FILTERED KICK (Berlin techno)
s("kick")
  .gain(1.8)
  .lpf(slider(800, 200, 3000))  // Sweep for dynamics
  .shape(0.4)
  .crush(10)           // Slight digital grit

// LAYERED KICK (depth)
stack(
  s("kick").gain(1.5).lpf(120),      // Sub layer
  s("kick:1").gain(1.0).hpf(1000)    // Attack layer
)
```

---

### 2. Bass (The Partner)

**Savage's Rule:** "Roll off lows, boost presence at 900-1200 Hz"

```javascript
// CLEAN BASS (techno)
note("a1 a1 e2 a1")
  .s("sawtooth")
  .lpf(slider(400, 200, 800))    // Controlled highs
  .hpf(40)                         // Remove sub-mud
  .resonance(slider(15, 10, 20))   // Squelchy
  .shape(0.5)                      // Saturation
  .crush(8)                        // Lo-fi character
  .gain(0.8)

// BASS WITH PRESENCE
note("a1 e2 a1 d2")
  .s("sawtooth")
  .lpf(1000)           // Open filter for presence
  .hpf(35)             // Clean lows
  .shape(0.6)          // Heavy saturation
  .compress(0.8)       // Consistent level
  .gain(0.9)

// ROLLING BASS (Berlin style)
note("a1 [a1 a2] a1 [a2 a1] a1 [e2 a1] [g1 a1] [a1 a2]")
  .s("sawtooth")
  .slow(2)
  .lpf(slider(400, 150, 800))
  .resonance(slider(15, 10, 20))
  .shape(slider(0.5, 0.3, 0.7))
  .crush(slider(8, 6, 12))
  .gain(0.8)
```

**Critical:** Bass and kick work together:
```javascript
stack(
  // Kick owns low frequencies
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000),
  
  // Bass has controlled lows, emphasized presence
  note("a1 e2 a1 d2")
    .s("sawtooth")
    .hpf(40)           // Don't compete with kick lows
    .lpf(800)          // Focus on mids
    .shape(0.6)
    .gain(0.8)
)
```

---

### 3. Snare (The Crack)

**Savage's Focus:** "Body 200-400 Hz, crack 1-3 kHz, sizzle 5-10 kHz"

```javascript
// BASIC SNARE
s("~ snare ~ snare")
  .gain(0.7)
  .hpf(200)            // Remove mud
  .shape(0.4)          // Some distortion
  .room(0.1)           // Minimal reverb

// AGGRESSIVE SNARE (Berlin techno)
s("~ snare ~ snare")
  .gain(0.8)
  .hpf(2000)           // Very thin
  .shape(0.6)          // Heavy distortion
  .crush(6)            // Aggressive digital grit
  .lpf(8000)           // Control harshness

// LAYERED SNARE
stack(
  s("~ snare ~ snare")
    .gain(0.6),
  s("~ snare:1 ~ snare:1")
    .gain(0.4)
    .hpf(4000)         // Just the crack
)
```

---

### 4. Hi-Hats (The Air)

**Savage's Rule:** "Should be felt, not heard. Keep quiet."

```javascript
// BASIC HI-HATS
s("hh hh hh hh")
  .gain(0.3)           // Quiet!
  .hpf(8000)           // Remove everything else
  .pan(0.2)            // Slight right

// ROLLING 16THS (techno)
s("[hat hat hat hat]*4")
  .gain(0.3)
  .hpf(8000)
  .pan(sine.range(-0.3, 0.3))  // Stereo movement
  .sometimes(x => x.degradeBy(0.3))  // Organic variation

// OPEN/CLOSED HAT COMBO
stack(
  s("hh ~ hh ~")
    .gain(0.3)
    .hpf(10000),
  s("~ oh ~ ~")
    .gain(0.4)
    .hpf(6000)
    .room(0.2)
)
```

---

### 5. Pads/Atmospheres

**Savage's Principle:** "Cut lows aggressively. Pads compete with everything."

```javascript
// BASIC PAD
note("c3 e3 g3 b3")
  .s("triangle")
  .slow(4)
  .hpf(300)            // Remove low competition
  .lpf(4000)           // Smooth highs
  .room(0.8)           // Lush reverb
  .delay(0.5)          // Space
  .gain(0.3)           // Background element

// MOVING PAD (wide stereo)
note("a2 c3 d3 e3")
  .s("triangle")
  .slow(8)
  .hpf(400)
  .lpf(3000)
  .room(0.9)
  .pan(perlin.range(-0.8, 0.8))  // Wandering
  .gain(0.25)

// TECHNO PAD (minimal, dark)
note("a2 e3 a2 d3")
  .s("sine")
  .slow(8)
  .hpf(200)
  .lpf(slider(1000, 500, 2000))
  .room(0.5)
  .gain(0.2)
```

---

### 6. Lead Synth

**Savage's Focus:** "Presence at 2-4 kHz, air at 8-12 kHz"

```javascript
// BRIGHT LEAD
note("c4 e4 g4 a4")
  .s("sawtooth")
  .lpf(slider(2000, 1000, 4000))
  .resonance(8)
  .delay(0.3)
  .room(0.4)
  .gain(0.7)

// ACID LEAD (303-style)
note("c3 [e3 g3] c4 [c3 e3]")
  .s("sawtooth")
  .lpf(slider(300, 100, 2000))
  .resonance(slider(20, 10, 25))
  .shape(0.4)
  .delay(0.2)
  .gain(0.8)

// PLUCK LEAD
note("c4 d4 e4 g4")
  .s("triangle")
  .decay(0.1)
  .lpf(3000)
  .delay("8n")
  .room(0.3)
  .gain(0.6)
```

---

## Frequency Management (Strudel)

### The HPF Strategy (Most Important!)

**Savage's Core Teaching:** "Remove lows from everything except kick and bass"

```javascript
// WRONG - Everything has full spectrum
stack(
  s("kick ~ kick ~"),
  s("~ snare ~ snare"),
  note("c3 e3 g3").s("triangle"),
  note("c4 e4 g4").s("sawtooth")
)
// = MUDDY MESS

// RIGHT - Strategic highpass filtering
stack(
  s("kick ~ kick ~")
    .gain(1.8),                    // Full spectrum
  
  s("~ snare ~ snare")
    .hpf(200)                      // Remove kick frequency
    .gain(0.7),
  
  note("c3 e3 g3")
    .s("triangle")
    .hpf(300)                      // Remove bass/kick
    .gain(0.4),
  
  note("c4 e4 g4")
    .s("sawtooth")
    .hpf(400)                      // Remove everything below
    .gain(0.6)
)
```

### Filter Cutoff Reference

```javascript
// COPY-PASTE FILTERS

// Kick - keep full spectrum
.lpf(3000)               // Just remove harshness

// Bass - controlled lows
.hpf(40)                 // Clean up sub
.lpf(800)                // Focus on mids

// Snare - thin
.hpf(200)                // Remove mud

// Hi-hats - air only
.hpf(8000)               // Everything else gone

// Pads - no competition
.hpf(300)                // Aggressive cut
.lpf(4000)               // Smooth top

// Lead - presence
.lpf(3000)               // Character range
```

---

## Effects Chains (Complete)

### Berlin Techno Kick Chain

```javascript
s("kick ~ kick ~")
  .gain(1.8)
  .lpf(slider(2000, 800, 3000))  // Sweepable
  .shape(0.3)                     // Saturation
  .compress(0.4)                  // Consistent
  ._punchcard({labels: 1, cycles: 2})
```

### Industrial Bass Chain

```javascript
note("a1 [a1 a2] a1 [a2 a1]")
  .s("sawtooth")
  .slow(2)
  .hpf(40)                        // Clean lows
  .lpf(slider(400, 150, 800))     // Controlled highs
  .resonance(slider(15, 10, 20))  // Squelch
  .shape(slider(0.5, 0.3, 0.7))   // Saturation
  .crush(slider(8, 6, 12))        // Grit
  .compress(0.8)                  // Glue
  .gain(0.8)
```

### Aggressive Snare Chain

```javascript
s("~ snare ~ snare")
  .gain(0.7)
  .hpf(2000)                      // Very thin
  .shape(0.6)                     // Heavy distortion
  .crush(6)                       // Digital grit
  .lpf(8000)                      // Tame harshness
  .room(0.1)                      // Minimal reverb
```

### Atmospheric Pad Chain

```javascript
note("<c3'm7 f3'm7 bb3'm7 eb3'm7>")
  .s("triangle")
  .slow(4)
  .hpf(400)                       // No low-end
  .lpf(3000)                      // Smooth
  .room(0.9)                      // Lush space
  .delay(0.7)                     // Deep echo
  .pan(perlin.range(-0.7, 0.7))  // Wandering
  .gain(0.3)                      // Background
```

---

## Panning Strategies

### Center = Power

**Savage's Rule:** "Most important elements stay centered"

```javascript
stack(
  // CENTER (Foundation)
  s("kick ~ kick ~").pan(0),
  s("~ snare ~ snare").pan(0),
  note("a1 e2 a1 d2").s("bass").pan(0),
  
  // SLIGHT MOVEMENT (Interest)
  s("hh hh hh hh").pan(sine.range(-0.2, 0.2)),
  
  // WIDE (Stereo field)
  note("c3 e3 g3")
    .s("triangle")
    .pan(perlin.range(-0.8, 0.8))
)
```

### Dynamic Panning

```javascript
// SINE WAVE PANNING (smooth)
s("hh hh hh hh")
  .pan(sine.range(-0.5, 0.5))

// SAW WAVE PANNING (sweep)
s("hat hat hat hat")
  .pan(saw.range(-1, 1))

// RANDOM PANNING (chaos)
s("perc perc perc perc")
  .pan(rand.range(-0.8, 0.8))

// PERLIN NOISE (organic wandering)
note("c4 e4 g4")
  .s("sine")
  .pan(perlin.range(-0.7, 0.7))
```

### Stereo Width Techniques

```javascript
// JUX (stereo trick - different processing per channel)
note("c4 e4 g4 a4")
  .s("sawtooth")
  .jux(rev)                      // Right channel reversed
  .room(0.5)

note("c3 e3 g3")
  .s("triangle")
  .jux(x => x.add(7))            // Right channel +7 semitones

s("hh hh hh hh")
  .jux(x => x.fast(2))           // Right channel double speed
```

---

## Compression in Strudel

### The .compress() Function

```javascript
// LIGHT COMPRESSION (glue)
s("kick ~ kick ~")
  .compress(0.3)
  .gain(1.5)

// MEDIUM COMPRESSION (control)
note("a1 e2 a1 d2")
  .s("sawtooth")
  .compress(0.6)               // Noticeable
  .gain(0.8)

// HEAVY COMPRESSION (leveling)
note("c4 e4 g4")
  .s("sawtooth")
  .compress(0.9)               // Very squashed
  .gain(0.7)
```

**Savage's Compression Guide:**
- 0.2-0.4 = Light/transparent
- 0.5-0.7 = Medium/noticeable  
- 0.8-1.0 = Heavy/obvious

---

## Common Mistakes (Strudel)

### Mistake 1: Everything Too Loud

```javascript
// WRONG
stack(
  s("kick").gain(1.5),
  s("snare").gain(1.5),
  s("hat").gain(1.5),
  note("a1").s("bass").gain(1.5)
)
// = DISTORTED CLIPPING MESS

// RIGHT - Relative levels
stack(
  s("kick").gain(1.8),          // Loudest
  s("snare").gain(0.7),         // Medium
  s("hat").gain(0.3),           // Quiet
  note("a1").s("bass").gain(0.8) // Just below kick
)
```

### Mistake 2: No Highpass Filters

```javascript
// WRONG - Frequency buildup
stack(
  s("kick ~ kick ~"),
  note("a1 e2").s("bass"),
  note("c3 e3 g3").s("pad"),
  note("c4 e4 g4").s("lead")
)
// All fighting in low-end = mud

// RIGHT - Strategic filtering
stack(
  s("kick ~ kick ~")
    .gain(1.8),
  note("a1 e2")
    .s("bass")
    .hpf(40)
    .gain(0.8),
  note("c3 e3 g3")
    .s("pad")
    .hpf(300)                   // Aggressive!
    .gain(0.4),
  note("c4 e4 g4")
    .s("lead")
    .hpf(400)
    .gain(0.6)
)
```

### Mistake 3: Over-Processing

```javascript
// WRONG - Every effect at once
note("c4 e4 g4")
  .s("sawtooth")
  .lpf(500)
  .hpf(200)
  .resonance(25)
  .shape(0.9)
  .crush(4)
  .delay(0.8)
  .room(0.9)
  .compress(0.9)
// = Unrecognizable mush

// RIGHT - Purposeful effects
note("c4 e4 g4")
  .s("sawtooth")
  .lpf(2000)                    // One filter
  .shape(0.3)                   // Subtle saturation
  .delay(0.3)                   // Tasteful echo
  .room(0.4)                    // Controlled space
```

### Mistake 4: Bass Panned Off-Center

```javascript
// WRONG - Lopsided mix
note("a1 e2 a1 d2")
  .s("bass")
  .pan(-0.5)                    // NO! Mix feels tilted

// RIGHT - Bass always centered
note("a1 e2 a1 d2")
  .s("bass")
  .pan(0)                       // Center = balanced
```

---

## Complete Mix Templates

### Template 1: Industrial Techno (157 BPM)

```javascript
setcps(0.654) // 157 BPM

stack(
  // KICK - Punchy, filtered
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(slider(2000, 800, 3000))
    .shape(0.3)
    ._punchcard({labels: 1, cycles: 2}),
  
  // SNARE - Aggressive
  s("~ snare ~ snare")
    .gain(0.7)
    .hpf(2000)
    .shape(0.6)
    .lpf(8000),
  
  // HI-HATS - Rolling, moving
  s("[hat hat hat hat]*4")
    .gain(0.3)
    .hpf(8000)
    .pan(sine.range(-0.3, 0.3))
    .sometimes(x => x.degradeBy(0.3)),
  
  // BASS - Squelchy, filtered
  note("a1 [a1 a2] a1 [a2 a1]")
    .s("sawtooth")
    .slow(2)
    .hpf(40)
    .lpf(slider(400, 150, 800))
    .resonance(slider(15, 10, 20))
    .shape(slider(0.5, 0.3, 0.7))
    .crush(slider(8, 6, 12))
    .gain(0.8),
  
  // PAD - Dark, atmospheric
  note("a2 c3 d3 e3")
    .s("triangle")
    .slow(8)
    .hpf(300)
    .lpf(2000)
    .room(0.8)
    .pan(perlin.range(-0.6, 0.6))
    .gain(0.25)
)
```

### Template 2: Minimal Techno (130 BPM)

```javascript
setcps(0.542) // 130 BPM

stack(
  // KICK - Deep, sparse
  s("kick ~ ~ ~ kick ~ ~ ~")
    .gain(1.8)
    .lpf(sine.slow(4).range(1000, 3000)),
  
  // SNARE - Minimal
  s("~ ~ ~ sd ~ ~ ~ ~")
    .gain(0.6)
    .hpf(3000)
    .room(0.2),
  
  // HI-HAT - Sparse pattern
  s("~ ~ hat ~")
    .gain(0.3)
    .hpf(8000),
  
  // BASS - Deep, sub focus
  note("a1 ~ ~ ~ ~ ~ ~ ~")
    .s("sine")
    .slow(2)
    .hpf(30)
    .lpf(150)
    .gain(1.2),
  
  // TEXTURE - Subtle clicks
  s("~ ~ perc ~ ~ perc ~ ~")
    .gain(0.2)
    .hpf(4000)
    .pan(rand.range(-0.5, 0.5))
)
```

### Template 3: Acid Techno (138 BPM)

```javascript
setcps(0.575) // 138 BPM

stack(
  // KICK - Hard
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000)
    .shape(0.4),
  
  // SNARE - Crisp
  s("~ sd ~ sd")
    .gain(0.7)
    .hpf(2000)
    .shape(0.3),
  
  // 303 BASSLINE - Sweeping
  note("c2 [~ c3] [e2 c2] [~ g2] c2 [c3 ~] [g2 c2] [e2 ~]")
    .s("sawtooth")
    .lpf(slider(300, 100, 2000))
    .resonance(slider(20, 15, 25))
    .shape(0.5)
    .delay(0.2)
    .gain(0.9),
  
  // HI-HATS - Constant
  s("hh*8")
    .gain(0.35)
    .hpf(10000)
    .sometimes(x => x.fast(2))
)
```

---

## Pro Mixing Workflow (Strudel)

### Step 1: Build from Bottom Up

```javascript
// Start with kick
s("kick ~ kick ~")

// Add bass (make them work together)
s("kick ~ kick ~").stack(
  note("a1 e2 a1 d2")
    .s("bass")
    .hpf(40)
)

// Add snare
s("kick ~ kick ~").stack(
  note("a1 e2 a1 d2").s("bass").hpf(40),
  s("~ sd ~ sd")
)

// Build up from there...
```

### Step 2: Apply Filters First

```javascript
// Before effects, get frequencies right
stack(
  s("kick").gain(1.8),
  s("snare").hpf(200).gain(0.7),
  note("a1").s("bass").hpf(40).gain(0.8),
  note("c3 e3 g3").s("pad").hpf(300).gain(0.4)
)
```

### Step 3: Add Effects Tastefully

```javascript
// Then shape with effects
stack(
  s("kick").gain(1.8).shape(0.3),
  s("snare").hpf(200).shape(0.4).room(0.1).gain(0.7),
  note("a1").s("bass").hpf(40).lpf(800).shape(0.5).gain(0.8),
  note("c3 e3 g3").s("pad").hpf(300).room(0.7).gain(0.4)
)
```

### Step 4: Balance Levels

```javascript
// Relative loudness:
// 1. Kick (loudest)
// 2. Bass (just under kick)
// 3. Snare (medium)
// 4. Everything else (background)

stack(
  s("kick").gain(1.8),          // 1.8
  note("a1").s("bass").gain(0.8), // 0.8
  s("snare").gain(0.7),         // 0.7
  s("hat").gain(0.3),           // 0.3
  note("c3 e3").s("pad").gain(0.25) // 0.25
)
```

---

## Slider Mixing (Live Performance)

### Interactive Mix Controls

```javascript
// KICK FILTER SWEEP
s("kick ~ kick ~")
  .gain(1.8)
  .lpf(slider(2000, 800, 4000))    // Control cutoff live

// BASS RESONANCE CONTROL
note("a1 e2 a1 d2")
  .s("sawtooth")
  .lpf(slider(400, 200, 1000))
  .resonance(slider(15, 5, 25))    // Squelch amount
  .shape(slider(0.5, 0, 1))        // Distortion amount

// PAD SPACE CONTROL
note("c3 e3 g3")
  .s("triangle")
  .room(slider(0.5, 0, 1))         // Reverb amount
  .gain(slider(0.3, 0, 0.5))       // Volume
```

---

## Quick Reference: Copy-Paste Chains

```javascript
// === COPY-PASTE COMPLETE CHAINS ===

// INDUSTRIAL KICK
s("kick ~ kick ~")
  .gain(1.8).lpf(3000).shape(0.3)

// TECHNO BASS
note("a1 e2 a1 d2")
  .s("sawtooth")
  .hpf(40).lpf(800).resonance(15).shape(0.5).crush(8).gain(0.8)

// AGGRESSIVE SNARE
s("~ snare ~ snare")
  .gain(0.7).hpf(2000).shape(0.6).lpf(8000)

// ROLLING HATS
s("[hat]*16")
  .gain(0.3).hpf(8000).pan(sine.range(-0.3, 0.3))

// ATMOSPHERIC PAD
note("c3 e3 g3 b3")
  .s("triangle")
  .slow(4).hpf(300).lpf(4000).room(0.8).gain(0.3)

// ACID LEAD
note("c3 e3 g3 a3")
  .s("sawtooth")
  .lpf(slider(500, 100, 2000)).resonance(20).shape(0.4).gain(0.8)
```

---

## Key Savage Principles (Strudel Translation)

1. **"Sounds best vs. fits best"**
   - Solo: `s("hat").hpf(6000)` (sounds thin)
   - In mix: Perfect! Doesn't compete

2. **"Cut, don't boost"**
   - Use `.hpf()` liberally
   - Use `.lpf()` to control
   - Avoid over-boosting with `.resonance()`

3. **"Less is more" (especially lows)**
   - `.hpf(300)` on everything except kick/bass
   - Keep low-end clean and focused

4. **"Monitor at conversation level"**
   - Don't code at loud volumes
   - Trust quiet mixing

5. **"Reference constantly"**
   - Load professional tracks
   - A/B with your patterns

---

## Resources

- **Book:** "Mixing and Mastering In the Box" by Steve Savage
- **Strudel:** https://strudel.cc
- **Strudel Workshop:** https://strudel.cc/workshop

---

**Last Updated:** November 18, 2024  
**For:** UNISEX XL Project - Berlin Techno Live Coding
