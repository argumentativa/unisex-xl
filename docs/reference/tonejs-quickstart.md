# Tone.js Basics

Quick reference for core Tone.js concepts.

## Setup (Always Start Here)

```javascript
// Required before any sound
await Tone.start();
console.log("Audio ready!");

// Basic test
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");
```

---

## Synth Types (Swap These)

```javascript
// Copy/paste any of these
const synth = new Tone.Synth().toDestination();        // Basic sine wave
const synth = new Tone.FMSynth().toDestination();      // Bright, bell-like
const synth = new Tone.AMSynth().toDestination();      // Hollow, metallic
const synth = new Tone.MembraneSynth().toDestination(); // Kick drums
const synth = new Tone.PluckSynth().toDestination();   // Guitar/pluck
const synth = new Tone.NoiseSynth().toDestination();   // Hi-hats, cymbals
```

**When to use which:**
- `Synth` - Melody, leads, simple sounds
- `FMSynth` - Electric piano, bells, bright tones
- `MembraneSynth` - Kicks, toms, bass drums
- `PluckSynth` - Plucked strings, bass
- `NoiseSynth` - Percussion, hi-hats, effects

---

## Playing Notes

```javascript
// Single note
synth.triggerAttackRelease("C4", "8n");
// C4 = note pitch (like a color value)
// "8n" = duration (eighth note)

// Play chord (multiple notes)
const polySynth = new Tone.PolySynth().toDestination();
polySynth.triggerAttackRelease(["C4", "E4", "G4"], "2n");

// Play note at specific time
synth.triggerAttackRelease("C4", "8n", "+0.5"); // 0.5 seconds from now
```

---

## Note Reference

```
Octaves: C3 (low) → C4 (middle) → C5 (high)

Chromatic scale:
C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B

A minor scale: A, B, C, D, E, F, G
B minor scale: B, C#, D, E, F#, G, A
```

---

## Sequences (Looping Melodies)

```javascript
// Basic sequence
const synth = new Tone.Synth().toDestination();

const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, ["C4", "E4", "G4", "A4"]).start(0);
// Array = your melody
// .start(0) = start immediately

// IMPORTANT: Start the transport!
Tone.Transport.start();
```

---

## Loops (Repeating Patterns)

```javascript
// Simple repeating loop
const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "8n", time);
}, "4n").start(0);
// Plays C4 every quarter note

Tone.Transport.start();
```

---

## Controlling Synth Parameters

```javascript
// Configure on creation
const synth = new Tone.Synth({
  oscillator: {
    type: "sine"  // "sine", "square", "sawtooth", "triangle"
  },
  envelope: {
    attack: 0.1,   // Fade in time (seconds)
    decay: 0.2,    // Drop after attack
    sustain: 0.5,  // Held level (0-1)
    release: 1     // Fade out time
  }
}).toDestination();

// Change live
synth.oscillator.type = "square";
synth.envelope.attack = 0.01; // Fast attack = plucky
synth.volume.value = -12;     // Volume in dB (0 = max)
```

**Envelope explained (ADSR):**
- **Attack** - How fast it reaches full volume (0.01 = pluck, 0.5 = pad)
- **Decay** - How fast it drops after attack
- **Sustain** - Level while holding (0-1, where 1 = full)
- **Release** - How fast it fades when stopped

---

## Transport (The Clock)

```javascript
// Set tempo
Tone.Transport.bpm.value = 120; // Beats per minute

// Control playback
Tone.Transport.start();  // Start
Tone.Transport.stop();   // Stop
Tone.Transport.pause();  // Pause (can resume)

// Schedule events
Tone.Transport.scheduleRepeat((time) => {
  synth.triggerAttackRelease("C4", "8n", time);
}, "4n"); // Repeat every quarter note
```

---

## Common Patterns

### Melody Pattern
```javascript
const melody = ["C4", "D4", "E4", "F4", "G4", "F4", "E4", "D4"];
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, melody, "8n").start(0);
```

### Random Notes (Generative)
```javascript
const notes = ["C4", "E4", "G4", "A4"];
const loop = new Tone.Loop((time) => {
  const randomNote = notes[Math.floor(Math.random() * notes.length)];
  synth.triggerAttackRelease(randomNote, "16n", time);
}, "16n").start(0);
```

### Bass Line
```javascript
const bass = new Tone.FMSynth().toDestination();
const bassLine = new Tone.Sequence((time, note) => {
  bass.triggerAttackRelease(note, "4n", time);
}, ["C2", "C2", "G2", "G2"], "4n").start(0);
```

---

## Stopping Everything

```javascript
// Stop transport
Tone.Transport.stop();

// Dispose everything (clean slate)
Tone.Transport.cancel();
synth.dispose();
```

---

## Next Steps

- Learn [Effects & Chains](./tone-effects.md)
- See [Timing Reference](./timing.md) for durations
- Check [Templates](./templates.md) for complete examples
