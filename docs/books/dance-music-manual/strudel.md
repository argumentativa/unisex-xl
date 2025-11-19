# Dance Music Manual - Strudel Cheatsheet
## Based on Rick Snoman's Production Principles

Complete guide to creating professional dance music with Strudel, following techniques from the Dance Music Manual.

---

## Table of Contents

1. [Kick Drum Fundamentals](#kick-drum-fundamentals)
2. [Four-to-the-Floor Patterns](#four-to-the-floor-patterns)
3. [Layering in Strudel](#layering-in-strudel)
4. [Swing & Syncopation](#swing--syncopation)
5. [Sound Design Workflow](#sound-design-workflow)
6. [Complete Track Patterns](#complete-track-patterns)

---

## Kick Drum Fundamentals

### Snoman's Kick Philosophy

**"A kick consists of three essential elements: transient, body, and tail."**

### Kick Tuning (36-65 Hz)

**Snoman's Sweet Spots:** E, F, G, A, Bb

```javascript
// KICK TUNING IN STRUDEL
// Tune your kick to match the track's key

// If track is in A minor:
s("kick").note("a1")  // 55 Hz - optimal

// If track is in E minor:
s("kick").note("e1")  // 41 Hz - optimal

// If track is in G minor:
s("kick").note("g1")  // 49 Hz - optimal
```

### Basic Kick with Processing

```javascript
// PROFESSIONAL KICK CHAIN
s("kick")
  .gain(1.8)           // Loud foundation
  .lpf(3000)           // Remove harshness
  .shape(0.3)          // Subtle saturation for punch
  .room(0)             // Dry (no reverb on kick)
```

### Removing "Boxiness" (325 Hz)

**Snoman's Warning:** "The 300-450 Hz region exhibits a boxy character"

```javascript
// Cut problematic frequencies
s("kick")
  .gain(1.8)
  .lpf(3000)
  .hpf(60)            // Clean sub
  .shape(0.3)
  // Note: Strudel doesn't have parametric EQ
  // Use layering to avoid boxy kicks
```

---

## Four-to-the-Floor Patterns

### Snoman's Rule

**"The snare must sit on the bar's second and fourth beat"**

### Basic House Pattern (128 BPM)

```javascript
setcps(0.533)  // 128 BPM

stack(
  // KICK - Every quarter note
  s("kick kick kick kick")
    .gain(1.8)
    .lpf(3000)
    .shape(0.3),
  
  // SNARE - Beats 2 & 4
  s("~ snare ~ snare")
    .gain(0.7)
    .hpf(200)
    .shape(0.4)
    .room(0.2),
  
  // OPEN HI-HAT - Every dotted quarter (every 3rd eighth)
  s("~ ~ oh")
    .gain(0.5)
    .hpf(6000)
    .room(0.3)
)
```

### Complete Loop with Closed Hats

```javascript
setcps(0.533)  // 128 BPM

stack(
  // Kick - four-on-floor
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000)
    .shape(0.3),
  
  // Snare - backbeat
  s("~ snare ~ snare")
    .gain(0.7)
    .hpf(200)
    .shape(0.4)
    .room(0.2),
  
  // Closed hats - every 16th
  s("[hh hh hh hh]*4")
    .gain(0.3)
    .hpf(8000),
  
  // Open hat - dotted quarter
  s("~ ~ oh ~")
    .gain(0.5)
    .hpf(6000)
    .room(0.3)
)
```

---

## Layering in Strudel

### Frequency-Based Layering (Snares)

**Snoman's Method:** "Layering snares and claps is frequency-based"

```javascript
// THREE-LAYER SNARE SYSTEM

stack(
  // LAYER 1: LOW-MID BODY (200-800 Hz)
  s("~ snare ~ snare")
    .lpf(800)
    .hpf(200)
    .gain(0.5)
    .room(0.1),
  
  // LAYER 2: MID-HIGH CRACK (1-3 kHz)
  s("~ cp ~ cp")
    .lpf(3000)
    .hpf(1000)
    .gain(0.8)
    .shape(0.3)
    .room(0.2),
  
  // LAYER 3: HIGH SIZZLE (5-10 kHz)
  s("~ hh ~ hh")
    .hpf(5000)
    .gain(0.3)
    .room(0.15)
)
```

### Practical Layering Example

```javascript
// LAYERED DRUM LOOP (Professional)
setcps(0.542)  // 130 BPM

stack(
  // Kick - punchy
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000)
    .shape(0.3),
  
  // Snare body layer
  s("~ snare ~ snare")
    .lpf(800)
    .gain(0.6)
    .room(0.2),
  
  // Clap crack layer
  s("~ cp ~ cp")
    .hpf(1000)
    .gain(0.7)
    .shape(0.4),
  
  // Hat sparkle layer
  s("~ hh:2 ~ hh:2")
    .hpf(6000)
    .gain(0.3),
  
  // Closed hats
  s("[hh hh hh hh]*4")
    .gain(0.3)
    .hpf(8000)
)
```

---

## Swing & Syncopation

### Swing (51-59%)

**Snoman's Guidance:** "51% to 59% swing generally provides good results"

```javascript
// BASIC SWING ON HI-HATS
s("[hh hh hh hh]*4")
  .gain(0.3)
  .hpf(8000)
  .late(0.02)           // Slight delay = swing feel
  .sometimes(x => x.late(0.04))  // Random variation
```

### Advanced Swing with Humanization

```javascript
// HUMANIZED HI-HAT PATTERN
s("[hh hh hh hh]*4")
  .gain(0.3)
  .hpf(8000)
  .late(rand.range(0, 0.03))    // Random timing (humanize)
  .gain(rand.range(0.25, 0.35)) // Random velocity
```

### Syncopation

**Snoman's Definition:** "Placing stress off the beat"

```javascript
// SYNCOPATED PERCUSSION PATTERN

stack(
  // Regular kick
  s("kick ~ kick ~")
    .gain(1.8),
  
  // Regular snare
  s("~ snare ~ snare")
    .gain(0.7),
  
  // Syncopated percussion (unequal divisions)
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ perc ~ ~ perc ~")
    .gain(0.5)
    .hpf(2000)
    // Positions 12 and 15 = syncopated
)
```

### Syncopation with Mini-Notation

```javascript
// SYNCOPATED PATTERN (Easier notation)
s("[~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ perc ~ ~ perc ~]")
  .fast(4)  // 16 steps per bar

// OR using subdivision
s("~ ~ ~ [perc ~ ~] ~ ~ ~ [~ ~ perc ~]")
  .gain(0.5)
  .hpf(2000)
```

---

## Sound Design Workflow

### Snoman's Five Parameters

1. **Pitch** - `.note()` or sample selection
2. **Transient** - `.attack()`, `.decay()`
3. **EQ** - `.lpf()`, `.hpf()`, `.bpf()`
4. **Dynamics** - `.compress()`, `.shape()`
5. **Reverberation** - `.room()`, `.delay()`

### Complete Processing Chain

```javascript
// PROFESSIONAL SOUND DESIGN WORKFLOW

// 1. PITCH
note("a1 e2 a1 d2")
  .s("sawtooth")

// 2. TRANSIENT (via envelope simulation)
  .decay(0.2)           // Short = percussive
  
// 3. EQ (Frequency shaping)
  .hpf(40)              // Remove sub-mud
  .lpf(slider(800, 200, 1200))  // Control brightness
  
// 4. DYNAMICS
  .shape(slider(0.5, 0, 0.8))   // Saturation
  .compress(0.6)        // Consistent level
  
// 5. REVERBERATION
  .room(0.3)            // Subtle space
  .delay(0.2)           // Short delay
  
  .gain(0.8)
```

### Cyclic Filter Modulation

**Snoman's Technique:** "Introduces textural variance"

```javascript
// FILTER MODULATION ON SNARE
s("~ snare ~ snare")
  .lpf(sine.slow(2).range(1500, 3000))  // Modulates over 2 bars
  .gain(0.7)
  .hpf(200)
  .room(0.2)

// Result: First snare = brighter
//         Second snare = darker
//         Creates subtle but important variation
```

### Velocity Variation

**Snoman's Principle:** "Small amounts of variation introduce interest"

```javascript
// DYNAMIC VARIATION ON PERCUSSION
s("[hh hh hh hh]*4")
  .gain(sine.segment(16).range(0.25, 0.35))  // Stepped variation
  .hpf(8000)

// OR random variation
s("[hh hh hh hh]*4")
  .gain(rand.range(0.25, 0.35))
  .hpf(8000)
```

---

## Complete Track Patterns

### Template 1: House (128 BPM)

```javascript
// COMPLETE HOUSE PATTERN
setcps(0.533)  // 128 BPM

stack(
  // KICK - Four-on-floor, punchy
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000)
    .shape(0.3),
  
  // LAYERED SNARE (body + crack)
  s("~ snare ~ snare")
    .lpf(800)
    .gain(0.6)
    .room(0.2),
  s("~ cp ~ cp")
    .hpf(1000)
    .gain(0.7)
    .shape(0.3),
  
  // CLOSED HATS (with swing)
  s("[hh hh hh hh]*4")
    .gain(0.3)
    .hpf(8000)
    .late(rand.range(0, 0.03)),
  
  // OPEN HAT (dotted rhythm)
  s("~ ~ oh ~")
    .gain(0.5)
    .hpf(6000)
    .room(0.3)
    .delay(0.3),
  
  // PERCUSSION (syncopated)
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ perc ~ ~ perc ~")
    .gain(0.4)
    .hpf(4000)
    .pan(rand.range(-0.3, 0.3))
)
```

### Template 2: Techno (138 BPM)

```javascript
// INDUSTRIAL TECHNO PATTERN
setcps(0.575)  // 138 BPM

stack(
  // KICK - Hard, industrial
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(slider(2000, 800, 3000))  // Sweepable
    .shape(0.4)
    .crush(10),
  
  // SNARE - Aggressive
  s("~ snare ~ snare")
    .gain(0.8)
    .hpf(2000)
    .shape(0.6)
    .crush(6)
    .lpf(8000),
  
  // ROLLING 16TH HATS
  s("[hat]*16")
    .gain(0.35)
    .hpf(10000)
    .pan(sine.range(-0.3, 0.3)),
  
  // SYNCOPATED TOMS
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ tom ~ ~ tom ~")
    .note("c3 d3")
    .gain(0.6)
    .shape(0.3),
  
  // BASS (optional - tuned to kick)
  note("a1 [~ a2] [~ ~] [a1 ~]")
    .s("sawtooth")
    .slow(2)
    .hpf(40)
    .lpf(slider(600, 200, 1000))
    .resonance(slider(15, 10, 20))
    .shape(0.6)
    .crush(8)
    .gain(0.8)
)
```

### Template 3: Minimal Techno (130 BPM)

```javascript
// MINIMAL TECHNO (Sparse, deep)
setcps(0.542)  // 130 BPM

stack(
  // KICK - Deep, sparse pattern
  s("kick ~ ~ ~ kick ~ ~ ~")
    .gain(1.8)
    .lpf(sine.slow(4).range(1000, 3000))
    .shape(0.3),
  
  // SNARE - Minimal hits
  s("~ ~ ~ sd ~ ~ ~ ~")
    .gain(0.6)
    .hpf(3000)
    .room(0.2),
  
  // HATS - Sparse
  s("~ ~ hat ~")
    .gain(0.3)
    .hpf(8000),
  
  // TEXTURE - Clicks and pops
  s("~ ~ ~ ~ perc ~ ~ ~")
    .gain(0.2)
    .hpf(4000)
    .pan(rand.range(-0.5, 0.5)),
  
  // BASS - Deep sub focus
  note("a1 ~ ~ ~ ~ ~ ~ ~")
    .s("sine")
    .slow(2)
    .hpf(30)
    .lpf(150)
    .gain(1.2)
)
```

### Template 4: Rolling Drum & Bass (174 BPM)

```javascript
// DRUM & BASS PATTERN
setcps(0.725)  // 174 BPM

stack(
  // KICK - Complex pattern
  s("kick ~ [~ kick] ~ kick ~ [~ kick] ~")
    .gain(1.5)
    .lpf(2000)
    .shape(0.4),
  
  // SNARE - Layered, varied
  s("~ snare ~ [snare ~] ~ snare ~ [~ snare]")
    .gain(0.8)
    .sometimes(x => x.speed(1.2))
    .hpf(500)
    .room(0.2),
  
  // FAST HATS
  s("[hh hh]*8")
    .gain(0.4)
    .hpf(10000)
    .sometimes(x => x.degradeBy(0.3)),
  
  // BASS - Reese-style
  note("a1 [~ a2] d2 [~ e2] a1 [~ g1] d2 ~")
    .s("sawtooth")
    .lpf(slider(600, 300, 1200))
    .resonance(8)
    .shape(0.4)
    .gain(0.9)
)
```

---

## Advanced Techniques

### Parallel Compression (NY Compression)

**Snoman's Method:** "Upward compression for thick, punchy drums"

```javascript
// SIMULATING PARALLEL COMPRESSION IN STRUDEL
// (Strudel doesn't have buses, so we layer compressed/uncompressed)

stack(
  // Original drums (uncompressed)
  s("kick ~ kick ~")
    .gain(1.5),
  
  // Heavily compressed duplicate (lower gain)
  s("kick ~ kick ~")
    .compress(0.9)      // Heavy compression
    .gain(0.8),         // Lower than original
  
  // Result: Transients from original + body from compressed
)
```

### Sidechain-Style Pumping

**Snoman's Technique:** "Ducking delay signal with compressor"

```javascript
// PUMPING EFFECT (Manual ducking)

stack(
  // Kick triggers the pump
  s("kick ~ kick ~")
    .gain(1.8),
  
  // Bass pumps around kick
  note("a1 a1 a1 a1")
    .s("sawtooth")
    .gain(sine.segment(4).range(0.3, 0.9))  // Pumps 4x per bar
    .lpf(800)
    .shape(0.5)
)
```

### Triplet Interpolation

**Snoman's Description:** "Complex rhythmical interpolation"

```javascript
// TRIPLET RHYTHM AGAINST 4/4

stack(
  // Standard 4/4 kick
  s("kick ~ kick ~"),
  
  // Triplet percussion (3 against 4)
  s("perc perc perc")
    .slow(4/3)          // Triplet timing
    .gain(0.5)
    .hpf(2000)
)
```

---

## Sound Design by Instrument

### Kick Drum

```javascript
// PROFESSIONAL KICK
s("kick")
  .note("a1")           // Tuned (55 Hz)
  .gain(1.8)            // Loud
  .lpf(3000)            // Remove harshness
  .shape(0.3)           // Subtle saturation
  .room(0)              // Dry
```

### Snare/Clap

```javascript
// LAYERED SNARE
stack(
  s("~ snare ~ snare").lpf(800).gain(0.6).room(0.2),
  s("~ cp ~ cp").hpf(1000).gain(0.7).shape(0.3)
)
```

### Hi-Hats

```javascript
// CLOSED HAT
s("[hh]*16")
  .gain(0.3)
  .hpf(8000)
  .late(rand.range(0, 0.03))

// OPEN HAT
s("~ ~ oh ~")
  .gain(0.5)
  .hpf(6000)
  .room(0.3)
  .delay(0.3)
```

### Bass

```javascript
// TECHNO BASS (tuned to kick)
note("a1 [a1 a2] a1 [a2 a1]")
  .s("sawtooth")
  .slow(2)
  .hpf(40)              // Don't compete with kick sub
  .lpf(slider(600, 200, 1000))
  .resonance(slider(15, 10, 20))
  .shape(0.6)
  .crush(8)
  .gain(0.8)
```

---

## Quick Copy-Paste Chains

```javascript
// === HOUSE KICK ===
s("kick ~ kick ~")
  .gain(1.8).lpf(3000).shape(0.3)

// === TECHNO KICK ===
s("kick ~ kick ~")
  .gain(1.8).lpf(slider(2000, 800, 3000)).shape(0.4).crush(10)

// === LAYERED SNARE ===
s("~ snare ~ snare").lpf(800).gain(0.6).room(0.2)
s("~ cp ~ cp").hpf(1000).gain(0.7).shape(0.3)

// === ROLLING HATS ===
s("[hat]*16").gain(0.3).hpf(8000).late(rand.range(0, 0.03))

// === OPEN HAT ===
s("~ ~ oh ~").gain(0.5).hpf(6000).room(0.3).delay(0.3)

// === TECHNO BASS ===
note("a1 a2 a1 e2").s("saw").hpf(40).lpf(600).shape(0.6).crush(8).gain(0.8)
```

---

## Key Snoman Principles (Strudel Translation)

### Kick Drums
- **Tune to key**: Use `.note("a1")` for 55 Hz sweet spot
- **Processing**: `.lpf(3000).shape(0.3)` minimum
- **Gain**: 1.5-1.8 (loudest element)

### Drum Loops
- **Snare position**: ALWAYS beats 2 & 4: `s("~ snare ~ snare")`
- **Open hat**: Dotted rhythm: `s("~ ~ oh ~")`
- **Layer everything**: Stack for textural richness
- **Apply swing**: `.late()` and `.sometimes()` on hats only

### Sound Design
- **Five parameters**: Note, Decay, LPF/HPF, Shape, Room
- **Process order**: Pitch → Filter → Saturation → Space
- **Cyclic modulation**: `.lpf(sine.slow(2).range(...))`
- **Velocity variation**: `.gain(rand.range(...))`

### Rhythm
- **Swing**: 51-59% = `.late(rand.range(0, 0.03))`
- **Syncopation**: Off-beat accents create interest
- **Humanize**: Random timing and velocity
- **Triplets**: `.slow(4/3)` for 3 against 4

---

## Resources

- **Book:** Dance Music Manual (5th Edition) by Rick Snoman
- **Strudel:** https://strudel.cc
- **Strudel Workshop:** https://strudel.cc/workshop
- **Altar Academy:** www.altaracademy.com

---

**Last Updated:** November 18, 2024  
**For:** UNISEX XL Project - Professional Dance Music Production
