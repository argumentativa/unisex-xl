# Tone.js Effects

How to add reverb, delay, filters, and more to your sounds.

## Basic Effect Setup

```javascript
// Create synth and effect
const synth = new Tone.Synth();
const reverb = new Tone.Reverb(2); // 2 = decay time in seconds

// Connect them (ORDER MATTERS)
synth.chain(reverb, Tone.Destination);
// Signal flows: synth → reverb → speakers
```

---

## Common Effects (Copy/Paste)

```javascript
// Reverb - Adds space/depth
const reverb = new Tone.Reverb({
  decay: 2,      // Length of reverb tail (seconds)
  wet: 0.5       // Mix (0 = dry, 1 = fully wet)
}).toDestination();

// Delay - Echo effect
const delay = new Tone.FeedbackDelay({
  delayTime: "8n",  // Time between echoes
  feedback: 0.5     // Amount of repeats (0-1)
}).toDestination();

// Filter - Frequency cutoff
const filter = new Tone.Filter({
  frequency: 1000,  // Cutoff frequency (Hz)
  type: "lowpass",  // "lowpass", "highpass", "bandpass"
  Q: 1              // Resonance (1-20, higher = more emphasis)
}).toDestination();

// Distortion - Adds grit
const distortion = new Tone.Distortion({
  distortion: 0.8,  // Amount (0-1)
  wet: 0.5          // Mix
}).toDestination();

// Chorus - Thickens sound
const chorus = new Tone.Chorus({
  frequency: 4,     // LFO speed (Hz)
  delayTime: 2.5,   // Delay amount
  depth: 0.5        // Modulation depth
}).toDestination();

// Bit Crusher - Lo-fi digital distortion
const crusher = new Tone.BitCrusher({
  bits: 8           // Bit depth (1-16, lower = more distortion)
}).toDestination();

// Phaser - Sweeping filter effect
const phaser = new Tone.Phaser({
  frequency: 0.5,   // LFO speed
  octaves: 3,       // Range of sweep
  baseFrequency: 350 // Center frequency
}).toDestination();
```

---

## Stacking Multiple Effects

```javascript
// Professional effect chain
const synth = new Tone.PolySynth();
const filter = new Tone.Filter(2000, "lowpass");
const delay = new Tone.FeedbackDelay("8n", 0.3);
const reverb = new Tone.Reverb(1.5);
const volume = new Tone.Volume(-6);

// Chain them (order is important!)
synth.chain(filter, delay, reverb, volume, Tone.Destination);

// Play something
synth.triggerAttackRelease(["C4", "E4", "G4"], "2n");
```

**Effect Order Guidelines:**
1. **Distortion/Saturation** - First (colors the sound)
2. **Filters** - Second (shapes frequency)
3. **Modulation** (Chorus/Phaser) - Third
4. **Delay** - Fourth
5. **Reverb** - Last (adds space)
6. **Volume** - Very last (final control)

---

## Berlin Techno Effect Chain

```javascript
// Industrial bass sound
const bass = new Tone.FMSynth();
const filter = new Tone.Filter(400, "lowpass");
filter.Q.value = 15; // High resonance = squelchy

const crusher = new Tone.BitCrusher(8); // Lo-fi grit
const distortion = new Tone.Distortion(0.6);
const reverb = new Tone.Reverb(0.2); // Minimal reverb (dry sound)

bass.chain(filter, crusher, distortion, reverb, Tone.Destination);
```

---

## Changing Effects Live

```javascript
// Sweep filter frequency
const filter = new Tone.Filter(200, "lowpass").toDestination();
synth.connect(filter);

// Animate the cutoff
let freq = 200;
setInterval(() => {
  freq = freq + 50;
  if (freq > 2000) freq = 200;
  filter.frequency.value = freq;
}, 100);

// Or use rampTo for smooth changes
filter.frequency.rampTo(2000, 2); // Ramp to 2000Hz over 2 seconds
```

---

## Filter Types Explained

```javascript
// Lowpass - Cuts high frequencies (darker sound)
const lpf = new Tone.Filter(800, "lowpass");
// Use for: Bass, warmth, darkness

// Highpass - Cuts low frequencies (thinner sound)
const hpf = new Tone.Filter(200, "highpass");
// Use for: Hi-hats, removing muddiness

// Bandpass - Only middle frequencies pass
const bpf = new Tone.Filter(1000, "bandpass");
// Use for: Telephone effect, isolation
```

---

## Wet/Dry Mix

Most effects have a `wet` parameter:

```javascript
const reverb = new Tone.Reverb(2);
reverb.wet.value = 0.3; // 30% effect, 70% dry signal

// 0 = completely dry (no effect)
// 0.5 = 50/50 mix
// 1 = completely wet (100% effect)
```

**Guidelines:**
- **Reverb**: 0.1-0.3 (subtle) or 0.5-0.8 (ambient)
- **Delay**: 0.2-0.5 (typical)
- **Chorus**: 0.3-0.7 (noticeable but not overwhelming)

---

## Complete Examples

### Ambient Pad
```javascript
const pad = new Tone.PolySynth();
const reverb = new Tone.Reverb(4); // Long tail
const delay = new Tone.FeedbackDelay("4n", 0.4);
const chorus = new Tone.Chorus(2, 2.5, 0.5);

pad.chain(chorus, delay, reverb, Tone.Destination);

pad.triggerAttackRelease(["C3", "E3", "G3", "B3"], "2n");
```

### Industrial Kick
```javascript
const kick = new Tone.MembraneSynth();
const distortion = new Tone.Distortion(0.8);
const filter = new Tone.Filter(120, "lowpass");

kick.chain(distortion, filter, Tone.Destination);

kick.triggerAttackRelease("C1", "8n");
```

### Acid Bass
```javascript
const bass = new Tone.MonoSynth();
const filter = new Tone.Filter(200, "lowpass");
filter.Q.value = 20; // High resonance

const lfo = new Tone.LFO("8n", 200, 2000); // Modulate filter
lfo.connect(filter.frequency);
lfo.start();

bass.chain(filter, Tone.Destination);
```

---

## Troubleshooting

**No effect heard:**
- Check wet/dry mix isn't at 0
- Verify connections with `.connect()` or `.chain()`
- Ensure signal flows to `Tone.Destination`

**Too much effect:**
- Lower `wet` value
- Reduce `feedback` on delays
- Shorten reverb `decay` time

**Distorted/clipping:**
- Add `Tone.Volume(-6)` at end of chain
- Reduce synth volume
- Lower effect output levels

---

## Next Steps

- See [Tone Basics](./tone-basics.md) for synth fundamentals
- Check [Templates](./templates.md) for complete examples
- Learn [Timing](./timing.md) for rhythmic effects
