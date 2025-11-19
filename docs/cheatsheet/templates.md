# Copy-Paste Templates

Ready-to-use code blocks. Copy, paste, modify, learn.

## Template Index

- [Quick Test](#quick-test) - Verify audio works
- [Simple Melody](#simple-melody) - Basic sequence
- [Techno Beat](#techno-beat) - Kick + bass + hats
- [Ambient Pad](#ambient-pad) - Atmospheric sound
- [Generative Pattern](#generative-pattern) - Self-playing music
- [Effect Showcase](#effect-showcase) - Hear different effects
- [Strudel Starter](#strudel-starter) - Basic Strudel pattern
- [Berlin Techno](#berlin-techno) - Industrial pattern
- [House Beat](#house-beat) - Four-on-floor groove
- [Acid Bass](#acid-bass) - 303-style bassline
- [Breakbeat](#breakbeat) - Drum & bass style

---

## Quick Test

**Use this to verify audio is working:**

```javascript
await Tone.start();
console.log("Audio ready!");

const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");

// Should hear a short beep
```

---

## Simple Melody

```javascript
await Tone.start();

const synth = new Tone.Synth().toDestination();

const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, ["C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4"]).start(0);

Tone.Transport.bpm.value = 120;
Tone.Transport.start();

// Stop after 8 seconds
setTimeout(() => Tone.Transport.stop(), 8000);
```

**Modify:**
- Change `["C4", "E4"...]` to different notes
- Change `"8n"` to `"4n"` (slower) or `"16n"` (faster)
- Change BPM to speed up/slow down

---

## Techno Beat

```javascript
await Tone.start();

// Kick drum
const kick = new Tone.MembraneSynth().toDestination();
const kickPattern = new Tone.Loop((time) => {
  kick.triggerAttackRelease("C1", "8n", time);
}, "4n").start(0);

// Bass line
const bass = new Tone.FMSynth().toDestination();
const bassLine = new Tone.Sequence((time, note) => {
  bass.triggerAttackRelease(note, "8n", time);
}, ["C2", "C2", "G2", "G2"], "4n").start(0);

// Hi-hat
const hat = new Tone.NoiseSynth().toDestination();
const hatPattern = new Tone.Loop((time) => {
  hat.triggerAttackRelease("16n", time);
}, "8n").start(0);

Tone.Transport.bpm.value = 130;
Tone.Transport.start();
```

---

## Ambient Pad

```javascript
await Tone.start();

// Create pad with effects
const pad = new Tone.PolySynth();
const reverb = new Tone.Reverb(4);
const chorus = new Tone.Chorus(2, 2.5, 0.5);
const volume = new Tone.Volume(-12);

pad.chain(chorus, reverb, volume, Tone.Destination);

// Slow chord progression
const chords = [
  ["C3", "E3", "G3", "B3"],
  ["A2", "C3", "E3", "A3"],
  ["F2", "A2", "C3", "F3"],
  ["G2", "B2", "D3", "G3"]
];

let chordIndex = 0;
const chordLoop = new Tone.Loop((time) => {
  pad.triggerAttackRelease(chords[chordIndex], "2n", time);
  chordIndex = (chordIndex + 1) % chords.length;
}, "2n").start(0);

Tone.Transport.bpm.value = 60; // Slow
Tone.Transport.start();
```

---

## Generative Pattern

```javascript
await Tone.start();

const synth = new Tone.FMSynth();
const reverb = new Tone.Reverb(2);
synth.chain(reverb, Tone.Destination);

// Random notes from scale
const notes = ["C4", "D4", "E4", "G4", "A4"];
const durations = ["8n", "16n", "4n"];

const loop = new Tone.Loop((time) => {
  // Pick random elements
  const note = notes[Math.floor(Math.random() * notes.length)];
  const duration = durations[Math.floor(Math.random() * durations.length)];
  
  synth.triggerAttackRelease(note, duration, time);
}, "8n").start(0);

Tone.Transport.start();

// Plays forever - refresh page to stop
```

---

## Effect Showcase

```javascript
await Tone.start();

const synth = new Tone.Synth();

// Try each effect one at a time:

// 1. REVERB
const reverb = new Tone.Reverb(2);
synth.chain(reverb, Tone.Destination);

// 2. DELAY (comment out reverb, uncomment this)
// const delay = new Tone.FeedbackDelay("8n", 0.5);
// synth.chain(delay, Tone.Destination);

// 3. DISTORTION
// const distortion = new Tone.Distortion(0.8);
// synth.chain(distortion, Tone.Destination);

// Play a pattern
const pattern = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "8n", time);
}, "4n").start(0);

Tone.Transport.start();
```

---

## Strudel Starter

```javascript
// Paste this in Strudel interface

// Simple pattern
s("bd sd bd sd")

// With melody
s("bd sd bd sd").stack(
  note("c3 e3 g3 a3").s("sawtooth")
)

// Add effects
s("bd sd bd sd")
  .lpf(1000)
  .room(0.3)
  .stack(
    note("c3 e3 g3 a3")
      .s("sawtooth")
      .lpf(800)
  )
```

---

## Berlin Techno

```javascript
// Paste in Strudel
setcps(0.654) // 157 BPM

stack(
  // Kick - hard and punchy
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000)
    .shape(0.3),
  
  // Snare - aggressive
  s("~ snare ~ snare")
    .gain(0.7)
    .shape(0.5)
    .lpf(4000),
  
  // Hi-hat - rolling 16ths
  s("[hat hat hat hat]*4")
    .gain(0.3)
    .hpf(8000)
    .pan(sine.range(-0.3, 0.3)),
  
  // Bass - filtered and crushed
  note("a1 [a1 a2] a1 [a2 a1]")
    .s("sawtooth")
    .slow(2)
    .lpf(400)
    .resonance(15)
    .shape(0.5)
    .crush(8)
    .gain(0.8)
)
```

---

## House Beat

```javascript
// Paste in Strudel
setcps(0.5) // 120 BPM

stack(
  // Kick - four-on-floor
  s("bd bd bd bd")
    .gain(1.5),
  
  // Claps on 2 & 4
  s("~ cp ~ cp")
    .gain(0.8)
    .room(0.2),
  
  // Hi-hats - offbeat
  s("~ hh ~ hh")
    .gain(0.4)
    .hpf(6000),
  
  // Open hats occasionally
  s("~ ~ ~ oh")
    .gain(0.5)
    .every(4, x => x.fast(2)),
  
  // Bass - simple house bass
  note("c2 ~ c2 ~")
    .s("sawtooth")
    .lpf(300)
    .gain(0.9)
)
```

---

## Acid Bass

```javascript
// Tone.js - 303-style acid bassline
await Tone.start();

const bass = new Tone.MonoSynth({
  oscillator: { type: "sawtooth" },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0,
    release: 0.1
  }
});

const filter = new Tone.Filter({
  frequency: 200,
  type: "lowpass",
  Q: 20  // High resonance = squelchy
});

const distortion = new Tone.Distortion(0.4);

bass.chain(filter, distortion, Tone.Destination);

// Modulate filter with LFO
const lfo = new Tone.LFO("8n", 200, 2000);
lfo.connect(filter.frequency);
lfo.start();

// Pattern
const pattern = new Tone.Sequence((time, note) => {
  bass.triggerAttackRelease(note, "16n", time);
}, ["C2", "C2", "C3", "C2", "D#2", "C2", "C3", "D#2"], "16n").start(0);

Tone.Transport.bpm.value = 130;
Tone.Transport.start();
```

---

## Breakbeat

```javascript
// Strudel - drum & bass style
setcps(0.708) // 170 BPM

stack(
  // Complex kick pattern
  s("bd ~ [~ bd] ~ bd ~ [~ bd] ~")
    .gain(1.5),
  
  // Snare with variations
  s("~ sd ~ [sd ~] ~ sd ~ [~ sd]")
    .gain(0.8)
    .sometimes(x => x.speed(1.2)),
  
  // Fast hi-hats
  s("[hh hh]*8")
    .gain(0.4)
    .sometimes(x => x.degradeBy(0.3)),
  
  // Breakbeat-style bass
  note("a1 [~ a2] d2 [~ e2] a1 [~ g1] d2 ~")
    .s("sawtooth")
    .lpf(slider(600, 300, 1200))
    .resonance(8)
    .shape(0.4)
    .gain(0.9)
)
```

---

## Professional Effect Chain

```javascript
await Tone.start();

// Full production chain
const synth = new Tone.PolySynth();
const filter = new Tone.Filter(2000, "lowpass");
const chorus = new Tone.Chorus(2, 2.5, 0.5);
const delay = new Tone.FeedbackDelay("8n", 0.3);
const reverb = new Tone.Reverb(1.5);
const limiter = new Tone.Limiter(-1);
const volume = new Tone.Volume(-6);

// Chain in order (important!)
synth.chain(
  filter,
  chorus,
  delay,
  reverb,
  limiter,
  volume,
  Tone.Destination
);

// Play something
synth.triggerAttackRelease(["C4", "E4", "G4"], "2n");
```

---

## Minimalist Techno

```javascript
// Strudel - minimal berlin style
setcps(0.654) // 157 BPM

stack(
  // Sparse kick
  s("kick ~ ~ ~ kick ~ ~ ~")
    .gain(1.8)
    .lpf(sine.slow(4).range(1000, 3000)),
  
  // Minimal hi-hat
  s("~ ~ hat ~")
    .gain(0.3)
    .hpf(8000),
  
  // Deep bass (very minimal)
  note("a1 ~ ~ ~ ~ ~ ~ ~")
    .s("sine")
    .slow(2)
    .lpf(150)
    .gain(1.2),
  
  // Atmospheric pad
  note("a2 c3 d3 e3")
    .s("triangle")
    .slow(8)
    .room(0.8)
    .lpf(2000)
    .gain(0.3)
)
```

---

## Arpeggio Pattern

```javascript
await Tone.start();

const synth = new Tone.PolySynth();
const delay = new Tone.FeedbackDelay("8n", 0.4);
const reverb = new Tone.Reverb(2);

synth.chain(delay, reverb, Tone.Destination);

// Arpeggio pattern
const notes = ["C4", "E4", "G4", "B4", "C5"];
let index = 0;

const arp = new Tone.Loop((time) => {
  synth.triggerAttackRelease(notes[index], "16n", time);
  index = (index + 1) % notes.length;
}, "16n").start(0);

Tone.Transport.bpm.value = 120;
Tone.Transport.start();
```

---

## Dub Techno

```javascript
// Strudel - atmospheric dub techno
setcps(0.5) // 120 BPM

stack(
  // Deep kick
  s("kick ~ ~ ~ kick ~ ~ ~")
    .gain(1.5)
    .lpf(800),
  
  // Subtle hats
  s("~ hh ~ [hh ~]")
    .gain(0.2)
    .room(0.5),
  
  // Delay-heavy chords
  note("<c3'm7 f3'm7 bb3'm7 eb3'm7>")
    .s("triangle")
    .slow(4)
    .delay(0.7)
    .room(0.9)
    .lpf(1500)
    .gain(0.4),
  
  // Sub bass
  note("<c1 f1 bb1 eb1>")
    .s("sine")
    .slow(4)
    .lpf(200)
    .gain(1.0)
)
```

---

## How to Use These Templates

### Step-by-Step Process

1. **Copy entire block**
2. **Paste into your editor** (Strudel or Tone.js interface)
3. **Run/play**
4. **Change ONE thing** (a note, a number, an effect)
5. **Listen to what changed**
6. **Repeat**

### Modification Ideas

**Change melody:**
```javascript
// Original
["C4", "E4", "G4", "B4"]
// Try
["A3", "C4", "E4", "A4"]  // Different notes
["C4", "Eb4", "G4", "Bb4"] // Minor chord
```

**Change timing:**
```javascript
// Original
"4n"
// Try
"8n"   // Faster
"2n"   // Slower
"4n."  // Dotted (swing)
```

**Change tempo:**
```javascript
// Original (Tone.js)
Tone.Transport.bpm.value = 120;
// Try
Tone.Transport.bpm.value = 140; // Faster
Tone.Transport.bpm.value = 90;  // Slower

// Original (Strudel)
setcps(0.5)
// Try
setcps(0.654)  // Berlin techno speed
setcps(0.33)   // Slow downtempo
```

**Add effects:**
```javascript
// Original
synth.toDestination();
// Try
const reverb = new Tone.Reverb(2);
synth.chain(reverb, Tone.Destination);

// Or stack multiple
const filter = new Tone.Filter(1000, "lowpass");
const delay = new Tone.FeedbackDelay("8n", 0.3);
synth.chain(filter, delay, Tone.Destination);
```

**Change synth type:**
```javascript
// Original
const synth = new Tone.Synth();
// Try
const synth = new Tone.FMSynth();    // Brighter
const synth = new Tone.AMSynth();    // Hollow
const synth = new Tone.PluckSynth(); // Plucked
```

---

## Troubleshooting Templates

### No Sound?

```javascript
// 1. Check console
console.log("Audio ready!");

// 2. Verify Tone.start() was called
await Tone.start();

// 3. Check Transport is running
console.log(Tone.Transport.state); // Should be "started"
Tone.Transport.start();

// 4. Check volume
synth.volume.value = 0; // Set to 0dB (max)
```

### Pattern Not Looping?

```javascript
// Tone.js - make sure .start(0) is called
const seq = new Tone.Sequence(...).start(0); // ← important!

// And Transport is running
Tone.Transport.start();

// Strudel - patterns loop automatically
// Just make sure pattern is evaluated
```

---

## Next Steps

- Understand components in [Tone Basics](./tone-basics.md)
- Learn effects in [Effects Guide](./tone-effects.md)
- See [Strudel Basics](./strudel-basics.md) for pattern language
- Check [Timing](./timing.md) for rhythm concepts
