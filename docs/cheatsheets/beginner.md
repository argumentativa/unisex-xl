# Beginner's Cheatsheet
## Copy-Paste Blocks for Learning Tone.js & Strudel

This cheatsheet is designed for learning by doing. Each block is ready to paste and will make sound immediately.

---

## Getting Started

### Tone.js: Your First Sound

```javascript
// 1. Start Tone.js (ALWAYS run this first!)
await Tone.start();

// 2. Make a simple beep
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");
```

**What this does:**
- Creates a basic synthesizer
- Plays middle C for an 8th note duration
- `.toDestination()` sends sound to your speakers

### Strudel: Your First Pattern

```javascript
// Simple kick drum pattern
s("bd").slow(2)
```

**What this does:**
- `s()` = play a sample
- `"bd"` = bass drum/kick
- `.slow(2)` = play every 2 cycles (slower)

---

## Part 1: Single Sounds

### Tone.js: Different Synth Types

```javascript
// Simple beep synth
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");

// Fat bass synth
const bass = new Tone.FMSynth().toDestination();
bass.triggerAttackRelease("A1", "4n");

// Metallic percussion
const metal = new Tone.MetalSynth().toDestination();
metal.triggerAttackRelease("16n");

// Drum sound
const drum = new Tone.MembraneSynth().toDestination();
drum.triggerAttackRelease("C2", "8n");
```

**Try changing:**
- Notes: `"C4"`, `"A1"`, `"E3"`, `"G2"`
- Duration: `"8n"` (eighth), `"4n"` (quarter), `"16n"` (sixteenth)

### Strudel: Different Sample Types

```javascript
// Drums
s("bd")      // kick/bass drum
s("sd")      // snare drum
s("hh")      // hi-hat
s("cp")      // clap

// Instruments
s("bass")    // bass sound
s("piano")   // piano
s("casio")   // cheesy keyboard

// Effects
s("wind")    // whoosh
s("birds")   // nature sounds
```

**Mix them:**
```javascript
s("bd sd hh sd")  // kick, snare, hat, snare pattern
```

---

## Part 2: Sequences (Playing Multiple Notes)

### Tone.js: Basic Sequence

```javascript
await Tone.start();
Tone.Transport.bpm.value = 120;

const synth = new Tone.Synth().toDestination();

const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, ["C4", "E4", "G4", "E4"]).start(0);

Tone.Transport.start();
```

**What this does:**
- Sets tempo to 120 BPM
- Plays 4 notes in a loop: C, E, G, E
- `time` parameter keeps everything in sync

**Try different notes:**
```javascript
// Minor chord
["A4", "C5", "E5", "C5"]

// Bassline
["A2", "A2", "G2", "F2"]
```

### Strudel: Patterns with Mini-Notation

```javascript
// Basic pattern
note("c4 e4 g4 e4").s("sawtooth")

// With rests (~ means silence)
note("c4 ~ e4 ~").s("sawtooth")

// Sub-patterns [brackets = squeeze into one step]
note("c4 [e4 g4] c4 e4").s("sawtooth")

// Repeating (! means repeat)
note("c4!4").s("sawtooth")  // plays c4 four times
```

---

## Part 3: Drums & Rhythm

### Tone.js: Simple Drum Pattern

```javascript
await Tone.start();
Tone.Transport.bpm.value = 120;

// Create drum sounds
const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth().toDestination();
const hat = new Tone.MetalSynth().toDestination();

// Kick pattern (4 on the floor)
new Tone.Loop((time) => {
  kick.triggerAttackRelease("C1", "8n", time);
}, "4n").start(0);

// Snare on 2 and 4
new Tone.Loop((time) => {
  snare.triggerAttackRelease("16n", time);
}, "2n").start("4n");  // Start offset by a quarter note

// Hi-hat eighths
new Tone.Loop((time) => {
  hat.triggerAttackRelease("32n", time);
}, "8n").start(0);

Tone.Transport.start();
```

### Strudel: Drum Patterns (Easier!)

```javascript
// Four on the floor kick
s("bd bd bd bd")

// Kick + snare (classic)
s("bd sd bd sd")

// With hi-hats
stack(
  s("bd ~ bd ~"),
  s("~ sd ~ sd"),
  s("hh hh hh hh")
)

// Using samples with rhythm
s("bd*4, ~ sd ~ sd, hh*8")
```

**Pattern shortcuts:**
- `*` = repeat: `"bd*4"` = four kicks
- `,` = play simultaneously (layers)
- `~` = rest/silence

---

## Part 4: Adding Effects

### Tone.js: Effect Chain

```javascript
await Tone.start();

// Create reverb
const reverb = new Tone.Reverb(2).toDestination();

// Create delay
const delay = new Tone.FeedbackDelay("8n", 0.5).toDestination();

// Connect synth through effects
const synth = new Tone.Synth().connect(reverb);

// Play
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, ["C4", "E4", "G4"]).start(0);

Tone.Transport.start();
```

**Common effects:**
```javascript
// Reverb (space/room)
new Tone.Reverb(2)  // 2 seconds decay

// Delay (echo)
new Tone.FeedbackDelay("8n", 0.5)  // eighth note, 50% feedback

// Distortion (grit)
new Tone.Distortion(0.5)  // 0-1 amount

// Filter (tone shaping)
new Tone.Filter(1000, "lowpass")  // cut above 1000Hz
```

### Strudel: Effects (Built-in!)

```javascript
// Reverb
s("bd sd").room(0.5)  // 0-1 wet amount

// Delay
s("bd sd").delay(0.5)  // 0-1 wet amount

// Distortion
s("bd").shape(0.7)  // 0-1 drive amount

// Filters
s("bd").lpf(1000)   // lowpass filter at 1000Hz
s("bass").hpf(200)  // highpass filter at 200Hz

// Crush (bitcrusher)
s("bd").crush(4)    // bit depth (1-16)

// Combine effects
s("bd sd").room(0.3).delay(0.2).shape(0.5)
```

---

## Part 5: Quick Wins (Sounds Good Immediately)

### Tone.js: Ambient Pad

```javascript
await Tone.start();
Tone.Transport.bpm.value = 80;

const reverb = new Tone.Reverb(4).toDestination();
const synth = new Tone.PolySynth(Tone.Synth).connect(reverb);

const seq = new Tone.Sequence((time, chord) => {
  synth.triggerAttackRelease(chord, "2n", time);
}, [
  ["C3", "E3", "G3"],
  ["A2", "C3", "E3"],
  ["F2", "A2", "C3"],
  ["G2", "B2", "D3"]
]).start(0);

Tone.Transport.start();
```

### Strudel: Techno Beat

```javascript
stack(
  s("bd*4").gain(1.5),
  s("~ sd ~ sd").gain(0.8),
  s("hh*8").gain(0.4).hpf(8000),
  note("a1 ~ ~ a1 g1 ~ f1 ~").s("sawtooth").lpf(800).gain(0.7)
).cpm(130)
```

### Strudel: Hypnotic Arp

```javascript
note("c4 e4 g4 b4 c5 b4 g4 e4")
  .s("square")
  .lpf(2000)
  .delay(0.3)
  .room(0.5)
  .fast(2)
  .cpm(120)
```

---

## Part 6: Common Patterns

### Tone.js: Bassline Loop

```javascript
await Tone.start();
Tone.Transport.bpm.value = 120;

const bass = new Tone.MonoSynth({
  oscillator: { type: "square" },
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 }
}).toDestination();

const bassline = new Tone.Sequence((time, note) => {
  bass.triggerAttackRelease(note, "8n", time);
}, ["A1", "A1", "C2", "G1", "A1", "F1", "C2", "G1"]).start(0);

Tone.Transport.start();
```

### Strudel: Euclidean Rhythm

```javascript
// Euclidean patterns (evenly distribute hits)
s("bd(3,8)")   // 3 kicks in 8 steps
s("sd(5,8)")   // 5 snares in 8 steps
s("hh(7,8)")   // 7 hats in 8 steps

// Combined
stack(
  s("bd(3,8)").gain(1.5),
  s("sd(5,8)").gain(0.8),
  s("hh(13,16)").gain(0.3)
)
```

---

## Part 7: Cheat Codes

### Tempo Control

```javascript
// Tone.js
Tone.Transport.bpm.value = 140;  // Set BPM

// Strudel
.cpm(140/4)  // cycles per minute (BPM ÷ 4)
.fast(2)     // double speed
.slow(2)     // half speed
```

### Volume/Gain

```javascript
// Tone.js
synth.volume.value = -10;  // in decibels (-∞ to 0)

// Strudel
.gain(0.8)   // 0-1 amplitude
.gain("0.5 1 0.3 0.8")  // pattern of gains
```

### Note Names Reference

```
C1  C2  C3  C4  C5  C6
↑   ↑   ↑   ↑   ↑   ↑
Sub Bass Middle Treble
```

**Common ranges:**
- Kick: `C1`, `C2`
- Bass: `A1`, `E2`, `G2`
- Melody: `C4`, `E4`, `G4` (middle octave)
- High: `C5`, `E5`, `G5`

### Duration Reference (Tone.js)

```
"1n"  = Whole note (4 beats)
"2n"  = Half note (2 beats)
"4n"  = Quarter note (1 beat)
"8n"  = Eighth note (0.5 beats)
"16n" = Sixteenth note (0.25 beats)
"32n" = Thirty-second note
```

---

## Part 8: Common Mistakes & Fixes

### Tone.js

❌ **Forgot to await Tone.start()**
```javascript
// Won't work
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");
```

✅ **Always start Tone first**
```javascript
// Works!
await Tone.start();
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");
```

❌ **Forgot to start Transport**
```javascript
// Sequence won't play
new Tone.Sequence(...).start(0);
```

✅ **Start the Transport**
```javascript
new Tone.Sequence(...).start(0);
Tone.Transport.start();  // This!
```

### Strudel

❌ **String vs function**
```javascript
s(bd)  // Error! Missing quotes
```

✅ **Use quotes for samples**
```javascript
s("bd")  // Correct
```

❌ **Wrong separator**
```javascript
s("bd, sd, hh")  // Comma creates layers, not sequence
```

✅ **Use spaces for sequence**
```javascript
s("bd sd hh")  // Correct sequence
```

---

## Part 9: Next Steps

Once you're comfortable with these blocks:

1. **Combine them**: Put a Tone.js bassline with drums
2. **Modify values**: Change notes, timings, effect amounts
3. **Mix frameworks**: Use both in your pattern
4. **Reference the guides**:
   - `docs/books/dance-music-manual/` for genre techniques
   - `docs/books/mixing-mastering/quick-ref.md` for mixing
   - `docs/reference/strudel-syntax.md` for advanced patterns

---

## Quick Copy-Paste Templates

### Template: Tone.js Full Track

```javascript
await Tone.start();
Tone.Transport.bpm.value = 120;

// Effects
const reverb = new Tone.Reverb(2).toDestination();
const filter = new Tone.Filter(1000, "lowpass").connect(reverb);

// Bass
const bass = new Tone.MonoSynth().connect(filter);
new Tone.Loop((time) => {
  bass.triggerAttackRelease("A1", "8n", time);
}, "4n").start(0);

// Kick
const kick = new Tone.MembraneSynth().toDestination();
new Tone.Loop((time) => {
  kick.triggerAttackRelease("C1", "8n", time);
}, "4n").start(0);

Tone.Transport.start();
```

### Template: Strudel Full Track

```javascript
stack(
  // Drums
  s("bd*4").gain(1.5),
  s("~ sd ~ sd").gain(0.8),
  s("hh*8").gain(0.4).hpf(8000),

  // Bass
  note("a1 ~ ~ a1 g1 ~ f1 ~").s("sawtooth").lpf(800).gain(0.7),

  // Melody
  note("c4 e4 g4 b4").s("triangle").room(0.5).gain(0.3)
).cpm(120/4)
```

---

## Remember

- **Start simple**: One sound at a time
- **Copy everything**: That's how you learn syntax
- **Change one thing**: Modify one parameter, hear the difference
- **Break things**: Errors teach you boundaries
- **Have fun**: If it sounds good, it is good

**Print this. Keep it next to your keyboard while you code.**
