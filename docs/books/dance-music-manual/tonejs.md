# Dance Music Manual - Tone.js Cheatsheet
## Based on Rick Snoman's Production Principles

Complete guide to creating professional dance music with Tone.js, following techniques from the Dance Music Manual.

---

## Table of Contents

1. [Kick Drum Design](#kick-drum-design)
2. [Drum Loop Construction](#drum-loop-construction)
3. [Layering Techniques](#layering-techniques)
4. [Rhythm & Timing](#rhythm--timing)
5. [Sound Design Fundamentals](#sound-design-fundamentals)
6. [Complete Track Templates](#complete-track-templates)

---

## Kick Drum Design

### Snoman's Kick Philosophy

**"A kick consists of three essential elements: transient, body, and tail."**

- **Transient**: High-frequency attack (helps cut through mix)
- **Body**: Thud/thump at 100-300 Hz (creates punch)
- **Tail**: Low-frequency sustain (determines key)

### Kick Tuning Guide

**Snoman's Rule:** "The ending frequency should be between D1 and C2 (36-65 Hz)"

```javascript
// OPTIMAL KICK FREQUENCIES (Hz)
const KICK_TUNINGS = {
  E1: 41,    // Sweet spot for many club systems
  F1: 44,    // Sweet spot
  G1: 49,    // Sweet spot
  A1: 55,    // Sweet spot (most common)
  Bb1: 58,   // Sweet spot
  C2: 65     // Upper limit
};
```

### Basic Kick Synthesis

```javascript
await Tone.start();

// SYNTHESIZED KICK DRUM
const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,        // How fast pitch sweeps down
  octaves: 10,             // Pitch sweep range
  oscillator: {
    type: "sine"           // Pure sine for low end
  },
  envelope: {
    attack: 0.001,         // Instant attack
    decay: 0.4,            // Body length
    sustain: 0.01,         // Minimal sustain
    release: 1.4,          // Tail length
    attackCurve: "exponential"  // Snoman's "bowing" effect
  }
}).toDestination();

// Trigger at A1 (55 Hz - sweet spot)
kick.triggerAttackRelease("A1", "8n");
```

### Advanced Kick with EQ

**Snoman's Warning:** "The 300-450 Hz region exhibits a boxy character"

```javascript
// PROFESSIONAL KICK CHAIN
const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10,
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0.01,
    release: 1.4
  }
});

// Remove "boxiness" at 325 Hz
const kickEQ = new Tone.EQ3({
  low: 0,
  mid: -8,           // Cut boxiness
  high: 3,           // Boost transient
  lowFrequency: 120,
  highFrequency: 2500
});

// Additional peak filter for body
const bodyBoost = new Tone.Filter({
  frequency: 100,
  type: "peaking",
  Q: 1.5,
  gain: 3
});

// Transient emphasis
const transientBoost = new Tone.Filter({
  frequency: 5000,
  type: "peaking",
  Q: 1,
  gain: 3
});

kick.chain(bodyBoost, kickEQ, transientBoost, Tone.Destination);
```

### Layered Kick (Time-Based)

**Snoman's Method:** "Layering is time-based, not frequency-based"

```javascript
// THREE-LAYER KICK SYSTEM
// Layer 1: Transient
const transientKick = new Tone.MembraneSynth({
  pitchDecay: 0.01,      // Very short
  octaves: 5,
  envelope: {
    attack: 0.001,
    decay: 0.05,         // Short decay = just transient
    sustain: 0,
    release: 0.01
  }
});

// Layer 2: Body
const bodyKick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 8,
  envelope: {
    attack: 0.001,
    decay: 0.2,          // Medium decay = body
    sustain: 0,
    release: 0.1
  }
});

// Layer 3: Tail (Low-end sustain)
const tailKick = new Tone.MembraneSynth({
  pitchDecay: 0.08,
  octaves: 10,
  envelope: {
    attack: 0.001,
    decay: 0.6,          // Long decay = tail
    sustain: 0.01,
    release: 1.4
  }
});

// Mix and shape each layer
const transientGain = new Tone.Gain(0.7);
const bodyGain = new Tone.Gain(0.8);
const tailGain = new Tone.Gain(1.0);

transientKick.chain(transientGain, Tone.Destination);
bodyKick.chain(bodyGain, Tone.Destination);
tailKick.chain(tailGain, Tone.Destination);

// Trigger all layers with slight delays for crossfading effect
function triggerLayeredKick(time) {
  transientKick.triggerAttackRelease("A1", "32n", time);
  bodyKick.triggerAttackRelease("A1", "16n", time + 0.005);
  tailKick.triggerAttackRelease("A1", "8n", time + 0.015);
}
```

---

## Drum Loop Construction

### Snoman's Loop Philosophy

**"The snare must sit on the bar's second and fourth beat or the third beat."**

### Four-to-the-Floor Pattern (House/Techno)

```javascript
// BASIC FOUR-TO-THE-FLOOR
Tone.Transport.bpm.value = 128;

// Kick - every quarter note
const kickPattern = new Tone.Loop((time) => {
  kick.triggerAttackRelease("A1", "8n", time);
}, "4n").start(0);

// Snare/Clap - beats 2 & 4
const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0
  }
}).toDestination();

const snarePattern = new Tone.Sequence((time, note) => {
  if (note === 1) {  // Beats 2 & 4
    snare.triggerAttackRelease("16n", time);
  }
}, [0, 1, 0, 1], "4n").start(0);

// Open Hi-Hat - every dotted half note (every 3rd eighth)
const openHat = new Tone.MetalSynth({
  frequency: 200,
  envelope: {
    attack: 0.001,
    decay: 0.4,
    release: 0.3
  },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5
}).toDestination();

const openHatPattern = new Tone.Loop((time) => {
  openHat.triggerAttackRelease("8n", time);
}, "4n.").start(0);

Tone.Transport.start();
```

### Professional Loop with Layering

**Snoman's Technique:** "Layer claps, hi-hats and snares for textural variety"

```javascript
// LAYERED SNARE DRUM
// Layer 1: TR-909 Sample (body)
const snare909 = new Tone.Player("samples/909-snare.wav").toDestination();

// Layer 2: Clap (transient)
const clap = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.15,
    sustain: 0
  }
});

const clapFilter = new Tone.Filter({
  frequency: 1200,
  type: "highpass"
}).toDestination();

clap.connect(clapFilter);

// Layer 3: Hi-hat (high-end sparkle)
const hatAccent = new Tone.MetalSynth({
  frequency: 400,
  envelope: {
    attack: 0.001,
    decay: 0.1,
    release: 0.01
  }
}).toDestination();

// Trigger all layers together
function triggerLayeredSnare(time) {
  snare909.start(time);
  clap.triggerAttackRelease("16n", time);
  hatAccent.triggerAttackRelease("32n", time);
}

// In pattern
const snarePattern = new Tone.Sequence((time, beat) => {
  if (beat === 1 || beat === 3) {  // Beats 2 & 4
    triggerLayeredSnare(time);
  }
}, [0, 1, 0, 1], "4n").start(0);
```

---

## Layering Techniques

### Frequency-Based Layering (Snares/Claps)

**Snoman's Method:** "Layering snares and claps is frequency-based"

```javascript
// LAYER 1: LOW-MID BODY (200-800 Hz)
const bodySnare = new Tone.NoiseSynth({
  noise: { type: "brown" },  // Lower frequency content
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0
  }
});

const bodyFilter = new Tone.Filter({
  frequency: 400,
  type: "bandpass",
  Q: 2
}).toDestination();

bodySnare.connect(bodyFilter);

// LAYER 2: MID-HIGH CRACK (1-3 kHz)
const crackSnare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.15,
    sustain: 0
  }
});

const crackFilter = new Tone.Filter({
  frequency: 2000,
  type: "bandpass",
  Q: 3
}).toDestination();

crackSnare.connect(crackFilter);

// LAYER 3: HIGH SIZZLE (5-10 kHz)
const sizzleSnare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0
  }
});

const sizzleFilter = new Tone.Filter({
  frequency: 8000,
  type: "highpass"
}).toDestination();

sizzleSnare.connect(sizzleFilter);

// Trigger all layers with gain balancing
const bodyGain = new Tone.Gain(0.8);
const crackGain = new Tone.Gain(1.0);  // Loudest
const sizzleGain = new Tone.Gain(0.4); // Subtle

bodySnare.disconnect();
crackSnare.disconnect();
sizzleSnare.disconnect();

bodySnare.chain(bodyFilter, bodyGain, Tone.Destination);
crackSnare.chain(crackFilter, crackGain, Tone.Destination);
sizzleSnare.chain(sizzleFilter, sizzleGain, Tone.Destination);

function triggerFullSnare(time) {
  bodySnare.triggerAttackRelease("16n", time);
  crackSnare.triggerAttackRelease("16n", time);
  sizzleSnare.triggerAttackRelease("16n", time);
}
```

### Processing Chain for Layered Elements

**Snoman's Five Processors:**
1. Pitch
2. Transient
3. EQ
4. Dynamics (Compression)
5. Reverberation

```javascript
// COMPLETE PROCESSING CHAIN FOR SNARE
const snare = new Tone.NoiseSynth();

// 1. PITCH (handled by sampler/synth settings)

// 2. TRANSIENT SHAPING
const transientEnv = new Tone.Envelope({
  attack: 0.001,
  decay: 0.15,
  sustain: 0,
  release: 0.05
});

// 3. EQ - Boost crack, cut mud
const snareEQ = new Tone.EQ3({
  low: -3,           // Cut low mud
  mid: 2,            // Slight body boost
  high: 4,           // Crack emphasis
  lowFrequency: 300,
  highFrequency: 3000
});

// 4. COMPRESSION - Hard hitting
const snareComp = new Tone.Compressor({
  threshold: -18,
  ratio: 4,
  attack: 0.001,     // Fast attack captures transient
  release: 0.05      // Quick release
});

// 5. REVERB - Room ambience
const snareReverb = new Tone.Reverb({
  decay: 0.8,        // Short room
  wet: 0.2           // Subtle
}).toDestination();

snare.chain(snareEQ, snareComp, snareReverb);
```

---

## Rhythm & Timing

### Swing/Shuffle

**Snoman's Guidance:** "51% to 59% swing generally provides good results"

```javascript
// SWING IMPLEMENTATION
// Tone.js doesn't have built-in swing, so we manually offset timing

function createSwing(baseTime, swingAmount = 0.54) {
  // swingAmount: 0.5 = no swing, 0.54 = 54% swing
  // Offsets every other 16th note
  return baseTime + (swingAmount - 0.5) * 0.1;
}

// Example: Hi-hat pattern with swing
const swingHats = new Tone.Sequence((time, index) => {
  const swingTime = index % 2 === 1 ? createSwing(time, 0.54) : time;
  closedHat.triggerAttackRelease("32n", swingTime);
}, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "16n").start(0);
```

### Syncopation

**Snoman's Definition:** "Placing stress off the beat"

```javascript
// SYNCOPATED PATTERN
// Standard 16-step grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
// Kick on: 1, 5, 9, 13 (every 4 steps)
// Snare on: 5, 13 (every 8 steps)
// Syncopated percussion on: 12, 15 (unequal divisions)

const percussion = new Tone.MetalSynth().toDestination();

const syncopatedPattern = new Tone.Sequence((time, step) => {
  // Syncopated hits on steps 12 and 15
  if (step === 11 || step === 14) {  // 0-indexed, so 11 = step 12
    percussion.triggerAttackRelease("32n", time);
  }
}, new Array(16).fill(0).map((_, i) => i), "16n").start(0);
```

### Triplets for Interest

```javascript
// TRIPLET PATTERN
// Creates 3 equal subdivisions against standard 4/4

const tripletPerc = new Tone.MembraneSynth({
  pitchDecay: 0.01,
  octaves: 2
}).toDestination();

// Triplet rhythm - 3 hits per quarter note
const tripletPattern = new Tone.Sequence((time) => {
  tripletPerc.triggerAttackRelease("C4", "16t", time);
}, [0, 1, 2], "4n").start(0);  // Three hits per quarter
```

---

## Sound Design Fundamentals

### The Five Modifiable Parameters

**Snoman's Framework:**
1. **Pitch** - Determines character
2. **Transient** - Attack/impact
3. **EQ** - Frequency shaping
4. **Dynamics** - Volume/punch
5. **Reverberation** - Space/depth

### Modifying Timbres for Cohesion

```javascript
// SOUND DESIGN WORKFLOW
// Start with basic sound
const synth = new Tone.FMSynth().toDestination();

// 1. PITCH ADJUSTMENT
synth.set({
  harmonicity: 3,  // Ratio of carrier to modulator
  modulationIndex: 10  // Brightness
});

// 2. TRANSIENT SHAPING
synth.envelope.attack = 0.01;    // Fast = plucky
synth.envelope.decay = 0.2;      // Short = percussive
synth.envelope.sustain = 0.3;    // Level when held
synth.envelope.release = 0.5;    // Fade out

// 3. EQ SCULPTING
const eq = new Tone.EQ3({
  low: -3,     // Remove mud
  mid: 2,      // Presence
  high: -1     // Tame harshness
});

// 4. DYNAMIC CONTROL
const comp = new Tone.Compressor({
  threshold: -24,
  ratio: 3,
  attack: 0.05,
  release: 0.1
});

// 5. SPATIAL TREATMENT
const reverb = new Tone.Reverb({
  decay: 1.5,
  wet: 0.3
});

synth.chain(eq, comp, reverb, Tone.Destination);
```

### Cyclic Filter Modulation

**Snoman's Technique:** "Introduces textural variance"

```javascript
// FILTER MODULATION ON SNARE
const snare = new Tone.NoiseSynth();

const cyclicFilter = new Tone.Filter({
  frequency: 2000,
  type: "lowpass",
  Q: 2
});

// LFO modulates filter - creates subtle variation
const filterLFO = new Tone.LFO({
  frequency: "2n",      // Modulates over 2 bars
  min: 1500,           // Filter range
  max: 3000,
  phase: 90            // Offset for variation
});

filterLFO.connect(cyclicFilter.frequency);
filterLFO.start();

snare.chain(cyclicFilter, Tone.Destination);

// Result: First snare of bar = bright
//         Second snare = slightly darker
//         Creates imperceptible but important variation
```

---

## Complete Track Templates

### Template 1: Four-to-the-Floor House (128 BPM)

```javascript
await Tone.start();
Tone.Transport.bpm.value = 128;

// === KICK ===
const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10,
  envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
});

const kickEQ = new Tone.EQ3({ mid: -8, high: 3 });
kick.chain(kickEQ, Tone.Destination);

const kickPattern = new Tone.Loop((time) => {
  kick.triggerAttackRelease("A1", "8n", time);
}, "4n").start(0);

// === LAYERED SNARE ===
const bodySnare = new Tone.NoiseSynth();
const crackSnare = new Tone.NoiseSynth();

const bodyFilter = new Tone.Filter(400, "bandpass");
const crackFilter = new Tone.Filter(2000, "bandpass");
const snareReverb = new Tone.Reverb(0.8);

bodySnare.chain(bodyFilter, snareReverb, Tone.Destination);
crackSnare.chain(crackFilter, snareReverb, Tone.Destination);

const snarePattern = new Tone.Sequence((time, beat) => {
  if (beat === 1 || beat === 3) {
    bodySnare.triggerAttackRelease("16n", time);
    crackSnare.triggerAttackRelease("16n", time);
  }
}, [0,1,0,1], "4n").start(0);

// === CLOSED HI-HATS (with swing) ===
const closedHat = new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.05, release: 0.01 }
});

const hatFilter = new Tone.Filter(8000, "highpass").toDestination();
closedHat.connect(hatFilter);

let hatStep = 0;
const hatPattern = new Tone.Loop((time) => {
  // Apply 54% swing to off-beats
  const swingTime = hatStep % 2 === 1 ? time + 0.04 : time;
  closedHat.triggerAttackRelease("32n", swingTime);
  hatStep++;
}, "16n").start(0);

// === OPEN HI-HAT ===
const openHat = new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.4, release: 0.3 }
}).toDestination();

const openHatPattern = new Tone.Loop((time) => {
  openHat.triggerAttackRelease("8n", time);
}, "4n.").start(0);  // Dotted quarter = every 3rd eighth

// === PARALLEL COMPRESSION ===
// (In real setup, route all drums through a bus with compression)

Tone.Transport.start();
```

### Template 2: Techno (138 BPM)

```javascript
await Tone.start();
Tone.Transport.bpm.value = 138;

// === INDUSTRIAL KICK ===
const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10
});

const kickSaturation = new Tone.Distortion(0.4);
const kickFilter = new Tone.Filter(100, "lowpass");

kick.chain(kickSaturation, kickFilter, Tone.Destination);

const kickPattern = new Tone.Loop((time) => {
  kick.triggerAttackRelease("A1", "8n", time);
}, "4n").start(0);

// === AGGRESSIVE SNARE ===
const snare = new Tone.NoiseSynth();
const snareHP = new Tone.Filter(2000, "highpass");
const snareDist = new Tone.Distortion(0.6);
const snareCrusher = new Tone.BitCrusher(6);

snare.chain(snareHP, snareDist, snareCrusher, Tone.Destination);

const snarePattern = new Tone.Sequence((time, beat) => {
  if (beat === 1 || beat === 3) {
    snare.triggerAttackRelease("16n", time);
  }
}, [0,1,0,1], "4n").start(0);

// === ROLLING 16TH HI-HATS ===
const hat = new Tone.MetalSynth({
  frequency: 250,
  envelope: { attack: 0.001, decay: 0.03, release: 0.01 }
});

const hatHP = new Tone.Filter(10000, "highpass").toDestination();
hat.connect(hatHP);

const hatPattern = new Tone.Loop((time) => {
  hat.triggerAttackRelease("32n", time);
}, "16n").start(0);

// === SYNCOPATED TOM ===
const tom = new Tone.MembraneSynth({
  pitchDecay: 0.03,
  octaves: 4
}).toDestination();

const tomPattern = new Tone.Sequence((time, step) => {
  if (step === 11 || step === 14) {  // Syncopated positions
    tom.triggerAttackRelease("C3", "32n", time);
  }
}, new Array(16).fill(0).map((_, i) => i), "16n").start(0);

Tone.Transport.start();
```

---

## Key Snoman Principles (Summary)

### Kick Drums
1. **Three elements**: Transient, body, tail
2. **Tune to key**: D1 to C2 (36-65 Hz)
3. **Sweet spots**: E, F, G, A, Bb
4. **Cut boxiness**: -8 dB at 325 Hz

### Drum Loops
1. **Snare position**: Beats 2 & 4 (always)
2. **Open hat timing**: Every dotted half note
3. **Layer for texture**: Claps + hats + snares
4. **Apply swing**: 51-59% on hats/percussion only

### Sound Design
1. **Five parameters**: Pitch, Transient, EQ, Dynamics, Reverb
2. **Process in order**: Pitch → Transient → EQ → Compression → Reverb
3. **Frequency-based layering**: For snares/claps
4. **Time-based layering**: For kicks

### Professional Practices
1. **Develop aural memory**: Don't rely on reference tracks constantly
2. **Listen actively**: Train your ears constantly
3. **Syncopation adds interest**: Off-beat accents
4. **Parallel compression**: New York style for punch
5. **Tempo-synced delays**: Match musical timing

---

## Resources

- **Book:** Dance Music Manual (5th Edition) by Rick Snoman
- **Tone.js Docs:** https://tonejs.github.io
- **Altar Academy:** www.altaracademy.com

---

**Last Updated:** November 18, 2024  
**For:** UNISEX XL Project - Professional Dance Music Production
