# Timing Reference

Tempo, durations, and rhythm concepts for Tone.js and Strudel.

## Understanding Musical Time

**Cycle** = One loop/bar of your pattern (like a measure in music)
**Step** = One event within a cycle
**BPM** = Beats Per Minute (traditional tempo)
**CPS** = Cycles Per Second (Strudel's tempo)

---

## Tempo Conversion

### BPM to CPS (Strudel)

```
CPS = BPM ÷ 60 ÷ 4

Examples:
120 BPM = 120 ÷ 60 ÷ 4 = 0.5 CPS
140 BPM = 140 ÷ 60 ÷ 4 = 0.583 CPS
157 BPM = 157 ÷ 60 ÷ 4 = 0.654 CPS (Berlin techno)
174 BPM = 174 ÷ 60 ÷ 4 = 0.725 CPS (Fast techno)
```

### Common Tempos

| Genre | BPM | CPS (Strudel) |
|-------|-----|---------------|
| **Downtempo** | 80-100 | 0.33-0.42 |
| **Hip-Hop** | 85-95 | 0.35-0.40 |
| **House** | 120-130 | 0.50-0.54 |
| **Techno** | 125-135 | 0.52-0.56 |
| **Berlin Techno** | 155-165 | 0.65-0.69 |
| **Drum & Bass** | 160-180 | 0.67-0.75 |
| **Dubstep** | 140 | 0.58 |

---

## Setting Tempo

### Strudel

```javascript
setcps(0.5)    // 120 BPM
setcps(0.654)  // 157 BPM (industrial techno)
setcps(0.725)  // 174 BPM (fast techno)
```

### Tone.js

```javascript
Tone.Transport.bpm.value = 120;  // 120 BPM
Tone.Transport.bpm.value = 157;  // 157 BPM
Tone.Transport.bpm.value = 174;  // 174 BPM

// Get current tempo
console.log(Tone.Transport.bpm.value);
```

---

## Note Durations (Tone.js)

### Standard Notation

```javascript
"1n"   // Whole note (4 beats)
"2n"   // Half note (2 beats)
"4n"   // Quarter note (1 beat)
"8n"   // Eighth note (0.5 beats)
"16n"  // Sixteenth note (0.25 beats)
"32n"  // Thirty-second note (0.125 beats)

// Dotted (1.5x longer)
"4n."  // Dotted quarter (1.5 beats)
"8n."  // Dotted eighth (0.75 beats)

// Triplets (3 fit in 2)
"4t"   // Quarter triplet
"8t"   // Eighth triplet
"16t"  // Sixteenth triplet
```

### Visual Guide

```
One cycle (4 beats):
|----|----|----|----|
 1    2    3    4

Whole note (1n):
|----------------|
 1n

Half notes (2n):
|-------|-------|
 2n      2n

Quarter notes (4n):
|---|---|---|---|
 4n  4n  4n  4n

Eighth notes (8n):
|-|-|-|-|-|-|-|-|
 8n8n8n8n8n8n8n8n
```

### Time in Seconds

```javascript
// Seconds (literal)
synth.triggerAttackRelease("C4", 0.5);  // 0.5 seconds

// Transport notation (syncs to tempo)
synth.triggerAttackRelease("C4", "4n"); // Quarter note (changes with BPM)
```

---

## Rhythm Patterns

### Common Patterns

```javascript
// STRAIGHT (on the beat)
"x x x x"          // Four-on-floor kick
"x ~ x ~"          // Backbeat snare

// SYNCOPATED (off the beat)
"x ~ ~ x ~ x ~ ~"  // Syncopated rhythm
"x ~ x [~ x] ~"    // Subdivision syncopation

// DOTTED (swing feel)
"x. x x."          // Dotted rhythm
"4n. 8n 4n."       // Boom-chick pattern
```

### Strudel Rhythm Notation

```javascript
// Each space = one step
"a b c d"          // 4 equal steps (quarter notes)
"a [b c]"          // Subdivision (b and c = eighths)
"[a b c d]"        // All in one step (sixteenths)

// Extended notation
"a ~ ~ ~"          // Play, then rest 3 steps
"a _ _ _"          // Hold for 4 steps (legato)
"a . . ."          // Same as above (alternative)
```

---

## Subdivision Examples

### Standard Subdivisions

```javascript
// Quarter notes (4n)
s("bd sd bd sd")           // 4 hits per cycle

// Eighth notes (8n)
s("bd bd sd bd bd bd sd bd") // 8 hits per cycle

// Sixteenth notes (16n)
s("[bd bd bd bd] [sd sd sd sd] [bd bd bd bd] [sd sd sd sd]")

// Using repetition
s("bd*4")                  // 4 quarter notes
s("bd*8")                  // 8 eighth notes
s("bd*16")                 // 16 sixteenth notes
```

### Mixed Subdivisions

```javascript
// Quarter + eighths
s("bd [bd bd] sd [bd bd]")

// Nested subdivisions
s("bd [sd [bd bd]] bd sd")

// Visual breakdown:
//    |       |       |       |       |
//    bd      [sd[bdbd]]bd    sd
//    1       2       3       4
```

---

## Swing & Groove

### Strudel Swing

```javascript
// Add swing (delayed offbeats)
s("bd sd bd sd").slow(2).swing(0.1)  // Subtle swing
s("hh hh hh hh").swing(0.2)          // More pronounced

// Humanize (random timing)
s("hh hh hh hh")
  .late(rand.range(0, 0.03))  // Random delay (humanize)
```

### Tone.js Swing

```javascript
// Using swing in sequences
Tone.Transport.swing = 0.1;  // Global swing (0-1)
Tone.Transport.swingSubdivision = "8n"; // Apply to eighth notes

// Manual timing offsets
const pattern = new Tone.Sequence((time, note) => {
  // Add slight random timing
  const offset = Math.random() * 0.01 - 0.005;
  synth.triggerAttackRelease(note, "8n", time + offset);
}, ["C4", "E4", "G4", "A4"]).start(0);
```

---

## Polyrhythms

### Definition

**Polyrhythm** = Multiple rhythmic layers with different subdivisions playing simultaneously.

### Examples

```javascript
// 3 against 4
stack(
  s("bd bd bd"),      // 3 hits
  s("hh hh hh hh")    // 4 hits
)

// 5 against 4
stack(
  s("bd bd bd bd bd"),  // 5 hits (quintuplets)
  s("hh hh hh hh")      // 4 hits (quarter notes)
)

// Using Euclidean
stack(
  s("bd").euclidean(3, 8),  // 3 over 8
  s("sd").euclidean(5, 8),  // 5 over 8
  s("hh").euclidean(7, 8)   // 7 over 8
)
```

---

## Polymeter

### Definition

**Polymeter** = Different length patterns playing together (phase relationships).

### Examples

```javascript
// 3-step pattern with 4-step pattern
stack(
  s("bd sd bd"),        // 3 steps
  s("hh hh hh hh")      // 4 steps
)
// They align every 12 steps (LCM of 3 and 4)

// Explicit polymeter syntax
"{bd sd bd, hh hh hh hh}"

// Long-form phasing
stack(
  s("bd sd bd").slow(3),      // 3 cycles
  s("hh hh hh hh hh").slow(5) // 5 cycles
)
// Aligns every 15 cycles
```

---

## Scheduling & Transport

### Tone.js Transport

```javascript
// Start/stop
Tone.Transport.start();
Tone.Transport.stop();
Tone.Transport.pause();

// Schedule single event
Tone.Transport.schedule((time) => {
  synth.triggerAttackRelease("C4", "8n", time);
}, "1m"); // At 1 measure

// Schedule repeating event
Tone.Transport.scheduleRepeat((time) => {
  synth.triggerAttackRelease("C4", "8n", time);
}, "4n"); // Every quarter note

// Schedule once at specific time
Tone.Transport.scheduleOnce((time) => {
  synth.triggerAttackRelease("C4", "2n", time);
}, "2m"); // At 2 measures
```

### Transport Position

```javascript
// Get current position
console.log(Tone.Transport.position);  // "0:0:0"

// Set position
Tone.Transport.position = "4:0:0";  // Bar 4, beat 0

// Loop section
Tone.Transport.loop = true;
Tone.Transport.loopStart = "0:0:0";
Tone.Transport.loopEnd = "4:0:0";  // 4 bars
```

---

## Time Signatures

### Tone.js

```javascript
// Set time signature
Tone.Transport.timeSignature = [4, 4];  // 4/4 (default)
Tone.Transport.timeSignature = [3, 4];  // 3/4 (waltz)
Tone.Transport.timeSignature = [7, 8];  // 7/8 (odd meter)
Tone.Transport.timeSignature = [5, 4];  // 5/4

// Affects bar/beat calculations
```

### Strudel

```javascript
// Strudel patterns are flexible - change cycle length
s("bd sd bd").slow(3/4)  // 3/4 feel
s("bd sd bd sd bd").slow(5/4)  // 5/4 feel
```

---

## Timing in Practice

### House Beat (120 BPM, 4/4)

```javascript
// Strudel
setcps(0.5)  // 120 BPM

stack(
  s("bd ~ bd ~"),         // Kick on 1 & 3
  s("~ sd ~ sd"),         // Snare on 2 & 4
  s("hh hh hh hh")        // Hi-hat quarters
)

// Tone.js
Tone.Transport.bpm.value = 120;

const kick = new Tone.MembraneSynth().toDestination();
const kickPattern = new Tone.Loop((time) => {
  kick.triggerAttackRelease("C1", "8n", time);
}, "2n").start(0); // Every half note
```

### Berlin Techno (157 BPM, 4/4)

```javascript
// Strudel
setcps(0.654)  // 157 BPM

stack(
  s("kick ~ kick ~"),              // Hard 4/4 kick
  s("~ snare ~ snare"),            // Backbeat snare
  s("[hat hat hat hat]*4"),        // Rolling 16th hats
  note("a1 [a1 a2] a1 [a2 a1]")   // Syncopated bass
    .s("sawtooth")
    .slow(2)
)

// Tone.js
Tone.Transport.bpm.value = 157;
```

---

## Tempo Automation

### Gradual Change (Strudel)

```javascript
// Accelerando
setcps(sine.slow(16).range(0.5, 0.6))  // Speeds up over 16 cycles

// Stepped tempo changes
setcps("<0.5 0.52 0.54 0.56>")  // Incremental increase
```

### Gradual Change (Tone.js)

```javascript
// Ramp tempo over time
Tone.Transport.bpm.rampTo(140, 10);  // Ramp to 140 BPM over 10 seconds

// Exponential ramp (more natural)
Tone.Transport.bpm.exponentialRampTo(160, 5);
```

---

## Latency Compensation

### Tone.js Latency

```javascript
// Check audio context latency
console.log(Tone.context.latencyHint);

// Set latency hint
Tone.context.latencyHint = "interactive";  // Low latency
Tone.context.latencyHint = "playback";     // Higher quality
Tone.context.latencyHint = "balanced";     // Default

// Look-ahead time
console.log(Tone.context.lookAhead);  // Time scheduled ahead
```

---

## Practical Examples

### Changing Tempo Mid-Pattern

```javascript
// Strudel - instant change
setcps(0.5)
s("bd sd bd sd")

// Later...
setcps(0.6)  // Speed up!

// Tone.js - smooth transition
Tone.Transport.bpm.value = 120;
// Later...
Tone.Transport.bpm.rampTo(140, 4);  // Over 4 seconds
```

### Time-Stretched Patterns

```javascript
// Strudel
s("bd sd bd sd").slow(2)   // Play over 2 cycles (half speed)
s("bd sd bd sd").fast(2)   // Play in 0.5 cycles (double speed)

// Tone.js
const pattern = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, ["C4", "E4", "G4", "A4"], "2n").start(0); // Half speed (half notes)
```

---

## Quick Reference

### Duration Conversion Table

| Name | Notation | Beats | At 120 BPM |
|------|----------|-------|------------|
| Whole | 1n | 4 | 2 seconds |
| Half | 2n | 2 | 1 second |
| Quarter | 4n | 1 | 0.5 seconds |
| Eighth | 8n | 0.5 | 0.25 seconds |
| Sixteenth | 16n | 0.25 | 0.125 seconds |

### Common BPM Ranges

- **Slow**: 60-90 BPM (ballads, ambient)
- **Medium**: 90-120 BPM (pop, rock)
- **Fast**: 120-140 BPM (house, techno)
- **Very Fast**: 140-180 BPM (drum & bass, hardcore)

---

## Next Steps

- See [Tone Basics](./tone-basics.md) for rhythm implementation
- Check [Strudel Basics](./strudel-basics.md) for pattern notation
- Try [Templates](./templates.md) for complete examples
