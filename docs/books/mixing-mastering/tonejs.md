# Tone.js Mixing Cheatsheet
## Based on "Mixing and Mastering In the Box" by Steve Savage

Professional mixing principles translated into Tone.js code for techno, electronic, and live coding music.

---

## Table of Contents

1. [Core Mixing Principles](#core-mixing-principles)
2. [Frequency Management](#frequency-management)
3. [Instrument-Specific Settings](#instrument-specific-settings)
4. [Compression & Dynamics](#compression--dynamics)
5. [Effects Guidelines](#effects-guidelines)
6. [Panning Strategies](#panning-strategies)
7. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
8. [Complete Mix Templates](#complete-mix-templates)

---

## Core Mixing Principles

### The Five Best Practices

**1. Have a Concept**
- Know what you want the mix to feel like
- Reference professional tracks in your genre
- Make intentional choices, not random ones

**2. Monitor at Multiple Levels**
- Mix at low-to-medium volume (conversation level)
- Check occasionally at loud levels
- Never mix only at loud volumes (ear fatigue + bad decisions)

**3. Sounds Best vs. Fits Best**
- Solo sound might need to sound "wrong" to fit the mix
- Example: Thin acoustic guitar in solo = perfect in full mix
- Trust the full mix context over solo sound

**4. Revise, Revise, Revise**
- First pass is never final
- Come back with fresh ears
- Make small adjustments iteratively

**5. Live with Your Mix**
- Listen in car, headphones, phone speaker
- Leave it overnight and revisit
- Test on different systems before finalizing

---

## Frequency Management

### The Frequency Map (What Lives Where)

```javascript
// FREQUENCY RANGES IN HZ
const FREQ_MAP = {
  // SUB BASS (felt more than heard)
  subBass: "20-60 Hz",
  
  // LOW BASS (kick fundamental, bass body)
  lowBass: "60-120 Hz",
  
  // LOW MIDS (warmth, body, can get muddy)
  lowMids: "120-500 Hz",
  
  // MIDS (vocals, most instruments live here)
  mids: "500-2000 Hz",
  
  // HIGH MIDS (presence, clarity, can get harsh)
  highMids: "2000-6000 Hz",
  
  // HIGHS (air, sparkle, cymbals)
  highs: "6000-20000 Hz"
};
```

### The "Smile EQ" Concept

**Why:** Human ears have a natural bias toward midrange. At lower volumes, we hear less bass and treble.

**Solution:** Boost lows and highs, control mids (creates a "smile" curve)

```javascript
// Applying Smile EQ to a synth
const synth = new Tone.PolySynth();
const eq = new Tone.EQ3({
  low: 3,        // Boost lows +3dB
  mid: -2,       // Slight mid cut -2dB
  high: 4        // Boost highs +4dB
}).toDestination();

synth.connect(eq);
```

### Critical Rule: Boost vs. Cut

**Savage's Principle:** "Cutting is often better than boosting"

**Why:**
- Boosting increases volume (deceives your ear)
- Boosting can introduce phase issues
- Cutting removes problems, doesn't mask them

```javascript
// WRONG - Boosting everything
const badEQ = new Tone.EQ3({
  low: 6,    // Too much boost
  mid: 4,    // Everything boosted
  high: 8    // = muddy, loud mess
});

// RIGHT - Strategic cuts with minimal boosts
const goodEQ = new Tone.EQ3({
  low: -2,   // Cut muddiness
  mid: -1,   // Slight clarity cut
  high: 2    // Gentle air boost
});
```

---

## Instrument-Specific Settings

### 1. Kick Drum (The Foundation)

**Frequency Goals:**
- Attack: 2.5-6 kHz
- Body: 60-120 Hz
- Sub: 40-60 Hz (remove if muddy)

```javascript
const kick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10,
  oscillator: { type: "sine" },
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0.01,
    release: 1.4
  }
});

// EQ Chain for Kick
const kickFilter1 = new Tone.Filter({
  frequency: 80,      // Focus on punch area
  type: "lowpass",
  Q: 1
});

const kickFilter2 = new Tone.Filter({
  frequency: 5000,    // Attack clarity
  type: "peaking",
  Q: 1,
  gain: 3            // Boost attack
});

const kickDistortion = new Tone.Distortion(0.3); // Saturation

kick.chain(kickFilter1, kickFilter2, kickDistortion, Tone.Destination);

// Volume setting (kicks are LOUD)
kick.volume.value = 0;  // 0dB (maximum, but controlled)
```

**Savage's Tip:** "Kick should dominate 60-80 Hz range. Let bass occupy 100-125 Hz."

---

### 2. Bass (The Foundation's Partner)

**Critical Concept:** Bass and kick must work TOGETHER, not compete.

**Frequency Strategy:**
- Kick owns: 60-80 Hz
- Bass owns: 100-125 Hz
- Bass presence/audibility: 900 Hz-1.2 kHz

```javascript
const bass = new Tone.FMSynth({
  harmonicity: 1,
  modulationIndex: 3,
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.3,
    release: 0.5
  }
});

// Bass EQ Chain
const bassHPF = new Tone.Filter({
  frequency: 40,      // Remove sub-bass mud
  type: "highpass",
  Q: 0.7
});

const bassPeak = new Tone.Filter({
  frequency: 100,     // Body
  type: "peaking",
  Q: 1.5,
  gain: 3
});

const bassPresence = new Tone.Filter({
  frequency: 1000,    // Presence (makes it "heard")
  type: "peaking",
  Q: 2,
  gain: 4            // Aggressive boost for cutting through
});

const bassCompressor = new Tone.Compressor({
  threshold: -24,
  ratio: 4,          // 4:1 ratio (can go up to 6:1)
  attack: 0.05,      // Slow attack keeps punch
  release: 0.1
});

bass.chain(bassHPF, bassPeak, bassPresence, bassCompressor, Tone.Destination);

bass.volume.value = -6;  // Leave headroom
```

**Savage's Warning:** 
> "Don't immediately boost low end on bass. In solo it sounds good, but in mix it creates mud. Roll off lows, boost high-mids for presence."

---

### 3. Snare (The Backbeat)

**Frequency Goals:**
- Body: 200-400 Hz
- Crack: 1-3 kHz
- Sizzle: 5-10 kHz

```javascript
const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0
  }
});

// Add tonal component
const snareBody = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 4
});

// Mix both
const snareMix = new Tone.Gain(0.5);
snare.connect(snareMix);
snareBody.connect(snareMix);

// EQ for snare
const snareHPF = new Tone.Filter({
  frequency: 200,     // Remove low end
  type: "highpass"
});

const snareCrack = new Tone.Filter({
  frequency: 2500,
  type: "peaking",
  Q: 2,
  gain: 4            // Emphasize crack
});

const snareDistortion = new Tone.Distortion(0.5); // Berlin techno aggression

snareMix.chain(snareHPF, snareCrack, snareDistortion, Tone.Destination);
snareMix.gain.value = 0.7;  // Relative to kick
```

---

### 4. Hi-Hats (The Glue)

**Frequency Goals:**
- Remove everything below 8 kHz
- Focus on 10-15 kHz for air

```javascript
const hat = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.05,
    sustain: 0
  }
});

const hatHPF = new Tone.Filter({
  frequency: 8000,    // Aggressive highpass
  type: "highpass",
  Q: 1
});

const hatAir = new Tone.Filter({
  frequency: 12000,
  type: "peaking",
  Q: 1,
  gain: 2
});

hat.chain(hatHPF, hatAir, Tone.Destination);
hat.volume.value = -12;  // Hats are background element
```

**Savage's Rule:** "Hi-hats should be felt, not dominate. Keep them quiet in the mix."

---

### 5. Pads/Atmospheres

**Frequency Goals:**
- Cut lows (avoid competing with bass/kick)
- Wide stereo spread
- Long reverb tails

```javascript
const pad = new Tone.PolySynth({
  oscillator: { type: "triangle" },
  envelope: {
    attack: 1.5,
    decay: 1,
    sustain: 0.7,
    release: 3
  }
});

// Remove low end competition
const padHPF = new Tone.Filter({
  frequency: 300,     // Cut lows aggressively
  type: "highpass"
});

const padLPF = new Tone.Filter({
  frequency: 4000,    // Smooth highs
  type: "lowpass",
  Q: 0.5
});

const padChorus = new Tone.Chorus(4, 2.5, 0.5);
const padReverb = new Tone.Reverb(4); // Long tail
const padVolume = new Tone.Volume(-18);

pad.chain(padHPF, padLPF, padChorus, padReverb, padVolume, Tone.Destination);
```

---

### 6. Lead Synth/Melody

**Frequency Goals:**
- Presence: 2-4 kHz
- Air: 8-12 kHz
- Cut mids if too honky

```javascript
const lead = new Tone.Synth({
  oscillator: { type: "sawtooth" },
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.6,
    release: 0.5
  }
});

const leadFilter = new Tone.Filter({
  frequency: 1200,
  type: "lowpass",
  Q: 5              // Resonance for character
});

const leadPresence = new Tone.Filter({
  frequency: 3000,
  type: "peaking",
  Q: 2,
  gain: 3
});

const leadDelay = new Tone.FeedbackDelay("8n", 0.3);
const leadReverb = new Tone.Reverb(1.5);

// LFO for filter movement
const lfo = new Tone.LFO("4n", 800, 2400);
lfo.connect(leadFilter.frequency);
lfo.start();

lead.chain(leadFilter, leadPresence, leadDelay, leadReverb, Tone.Destination);
lead.volume.value = -3;
```

---

## Compression & Dynamics

### Understanding Compression Parameters

**Savage's Compression Guide:**

```javascript
// COMPRESSOR PARAMETERS EXPLAINED

const compressor = new Tone.Compressor({
  threshold: -24,    // When compression starts (dB)
  ratio: 4,          // How much to compress (4:1 = medium)
  attack: 0.05,      // How fast it reacts (seconds)
  release: 0.1,      // How fast it lets go (seconds)
  knee: 12           // Soft knee = gentle, hard knee = aggressive
});

// RATIOS:
// 2:1 to 3:1   = Light/transparent
// 4:1 to 6:1   = Medium/noticeable
// 8:1 to 10:1  = Heavy/limiting
// 20:1+        = Brickwall limiter
```

### Compression by Instrument

```javascript
// === KICK - Light compression, preserve transient ===
const kickComp = new Tone.Compressor({
  threshold: -20,
  ratio: 3,
  attack: 0.001,    // Fast attack (but not instant)
  release: 0.05     // Fast release
});

// === BASS - Heavy compression for consistency ===
const bassComp = new Tone.Compressor({
  threshold: -24,
  ratio: 6,         // Aggressive!
  attack: 0.05,     // Slow attack preserves pluck
  release: 0.1      // Auto-release if available
});

// === SNARE - Medium compression ===
const snareComp = new Tone.Compressor({
  threshold: -18,
  ratio: 4,
  attack: 0.001,
  release: 0.05
});

// === PAD - Light compression for glue ===
const padComp = new Tone.Compressor({
  threshold: -30,
  ratio: 2,
  attack: 0.1,      // Slow = transparent
  release: 0.3
});
```

**Savage's Compression Rules:**
1. **Slow attack** = preserves transient/punch
2. **Fast attack** = reduces transient/punch
3. **Slow release** = smooth, but can pump
4. **Fast release** = natural, but can sound choppy
5. **Soft knee** = gentle, musical
6. **Hard knee** = aggressive, obvious

---

## Effects Guidelines

### Reverb Strategy

**Savage's Reverb Philosophy:**
- Drums: Minimal (0.1-0.3 wet)
- Bass: None (except maybe for ballads)
- Leads/Pads: Medium to Heavy (0.3-0.8 wet)
- Vocals: Multiple reverbs layered

```javascript
// === SHORT REVERB (Room) ===
const shortReverb = new Tone.Reverb({
  decay: 0.8,
  wet: 0.2
});

// === MEDIUM REVERB (Hall) ===
const mediumReverb = new Tone.Reverb({
  decay: 2,
  wet: 0.3
});

// === LONG REVERB (Cathedral) ===
const longReverb = new Tone.Reverb({
  decay: 4,
  wet: 0.5
});

// Apply to different elements
kick.connect(Tone.Destination); // No reverb!
snare.connect(shortReverb);     // Just a touch
pad.connect(longReverb);        // Lush space
```

### Delay Strategy

**Sync delays to tempo:**

```javascript
// TIMING REFERENCE (at 157 BPM / Berlin techno)
const delays = {
  doubling: "12ms",    // Thickness
  slapback: "120ms",   // Vintage effect
  eighth: "8n",        // Rhythmic
  quarter: "4n",       // Spacious
  dotted: "8n.",       // U2-style
  triplet: "8t"        // Rhythmic variation
};

// Rhythmic delay setup
const delay = new Tone.FeedbackDelay({
  delayTime: "8n",     // Synced to tempo
  feedback: 0.4,       // Amount of repeats
  wet: 0.3            // Mix
});

// Use on lead synth
lead.chain(delay, Tone.Destination);
```

**Savage's Delay Rules:**
- Always sync to tempo
- Use multiple delay times for complexity
- Feedback: 0.2-0.4 (subtle), 0.5-0.7 (obvious)

### Distortion/Saturation

**When to use:**
- Kick: Subtle (0.2-0.4) for presence
- Snare: Medium (0.4-0.6) for Berlin techno aggression
- Bass: Heavy (0.5-0.7) for growl
- Pads: Light (0.1-0.3) for warmth

```javascript
// Saturation levels
const subtleSaturation = new Tone.Distortion(0.3);
const mediumDistortion = new Tone.Distortion(0.5);
const heavyDistortion = new Tone.Distortion(0.8);

// Berlin techno bass chain
bass.chain(
  bassEQ,
  new Tone.Distortion(0.6),  // Heavy saturation
  new Tone.BitCrusher(8),    // Lo-fi grit
  bassCompressor,
  Tone.Destination
);
```

---

## Panning Strategies

### Stereo Field Concept

**Savage's Panning Rules:**
1. Center = most important (kick, bass, lead vocal/lead)
2. Wide panning = stereo interest (hats, effects, pads)
3. Avoid panning bass (makes mix lopsided)
4. Symmetric panning for balance

```javascript
// PANNING VALUES (-1 = left, 0 = center, 1 = right)

// === CENTER (Most Important) ===
kick.connect(new Tone.Panner(0));     // Center
bass.connect(new Tone.Panner(0));     // Center
snare.connect(new Tone.Panner(0));    // Center (or slight left)
lead.connect(new Tone.Panner(0));     // Center

// === STEREO SPREAD ===
const hatL = new Tone.Panner(-0.3);   // Slight left
const hatR = new Tone.Panner(0.3);    // Slight right

const padL = new Tone.Panner(-0.7);   // Wide left
const padR = new Tone.Panner(0.7);    // Wide right

// === DYNAMIC PANNING (Movement) ===
const autoPan = new Tone.AutoPanner({
  frequency: "4n",    // Speed of pan
  depth: 0.5         // Amount of movement
}).toDestination().start();

hat.connect(autoPan); // Hat moves left/right

// === LFO PANNING (Sine wave) ===
const panner = new Tone.Panner(0).toDestination();
const lfo = new Tone.LFO("2n", -0.5, 0.5); // Slow sweep
lfo.connect(panner.pan);
lfo.start();

pad.connect(panner);
```

### Berlin Techno Panning Template

```javascript
// Typical Berlin techno stereo image
stack(
  s("kick").pan(0),                    // Dead center
  s("snare").pan(0),                   // Center
  s("[hat]*16").pan(sine.range(-0.3, 0.3)), // Moving hats
  note("a1 a2 a1 e2")
    .s("sawtooth")
    .pan(0),                           // Bass center
  note("c4 e4 g4")
    .s("triangle")
    .pan(perlin.range(-0.8, 0.8))     // Wide wandering pad
)
```

---

## Common Mistakes to Avoid

### Mistake 1: Poor Low-End Control

**Problem:** Muddy, boomy mix. Can't hear individual instruments.

**Savage's Solution:**
- Remove sub-bass from everything except kick and bass
- Use highpass filters liberally
- Don't boost lows on everything

```javascript
// WRONG - Everything has low end
kick.connect(Tone.Destination);     // Full spectrum
bass.connect(Tone.Destination);     // Full spectrum
pad.connect(Tone.Destination);      // Full spectrum
guitar.connect(Tone.Destination);   // Full spectrum
// = MUD CITY

// RIGHT - Strategic low-end management
const kickFull = kick.toDestination(); // Full lows

const bassHPF = new Tone.Filter(40, "highpass");
bass.chain(bassHPF, Tone.Destination); // Clean low-end

const padHPF = new Tone.Filter(300, "highpass");
pad.chain(padHPF, Tone.Destination);   // No low-end

const guitarHPF = new Tone.Filter(200, "highpass");
guitar.chain(guitarHPF, Tone.Destination); // No low-end
```

### Mistake 2: Overly Bright Mixes

**Problem:** Harsh, fatiguing, shrill sound.

**Savage's Cause:** "Smile EQ" taken too far, or monitoring too quietly.

**Solution:**
- Monitor at conversation level
- Use gentle high-frequency boosts (+2 to +4 dB max)
- Cut instead of boost when possible

```javascript
// WRONG - Too bright
const brightEQ = new Tone.EQ3({
  low: 8,
  mid: 0,
  high: 12  // Ouch! Way too much
});

// RIGHT - Controlled highs
const balancedEQ = new Tone.EQ3({
  low: 3,
  mid: -1,
  high: 2   // Subtle air
});
```

### Mistake 3: Over-Compression

**Problem:** Lifeless, flat, pumping mixes.

**Savage's Warning:** "Compression is friend, not savior."

**Solution:**
- Use gentle ratios (2:1 to 4:1) for most things
- Reserve heavy compression (6:1+) for bass and problem sources
- Check for "pumping" (unnatural volume swells)

```javascript
// WRONG - Everything slammed
const overComp = new Tone.Compressor({
  threshold: -30,
  ratio: 10,    // Way too much!
  attack: 0.001,
  release: 0.01
});

// RIGHT - Gentle glue
const gentleComp = new Tone.Compressor({
  threshold: -24,
  ratio: 3,     // Transparent
  attack: 0.05,
  release: 0.1
});
```

### Mistake 4: Trusting Bad Monitoring

**Problem:** Mix sounds great in studio, terrible everywhere else.

**Savage's Solution:**
- Use reference tracks
- Check on multiple systems
- Don't trust headphones alone
- Test in car, phone speaker, earbuds

```javascript
// Create reference system
const refTrack = new Tone.Player("reference-track.mp3").toDestination();
const myMix = new Tone.Player("my-mix.mp3").toDestination();

// A/B between them at SAME VOLUME
refTrack.volume.value = -6;
myMix.volume.value = -6;

// Listen for:
// - Low-end balance
// - Brightness
// - Loudness/dynamics
// - Stereo width
```

---

## Complete Mix Templates

### Template 1: Berlin Techno Mix

```javascript
// 157 BPM Industrial Techno Mix
await Tone.start();
Tone.Transport.bpm.value = 157;

// === KICK ===
const kick = new Tone.MembraneSynth().toDestination();
const kickFilter = new Tone.Filter(80, "lowpass").toDestination();
const kickGain = new Tone.Gain(1.2);
kick.chain(kickFilter, kickGain, Tone.Destination);

// === BASS ===
const bass = new Tone.FMSynth();
const bassHPF = new Tone.Filter(40, "highpass");
const bassPeak = new Tone.Filter(100, "peaking");
bassPeak.Q.value = 1.5;
bassPeak.gain.value = 3;
const bassPresence = new Tone.Filter(1000, "peaking");
bassPresence.Q.value = 2;
bassPresence.gain.value = 4;
const bassComp = new Tone.Compressor(-24, 6);
const bassSat = new Tone.Distortion(0.5);
const bassCrush = new Tone.BitCrusher(8);
bass.chain(bassHPF, bassPeak, bassPresence, bassSat, bassCrush, bassComp, Tone.Destination);

// === SNARE ===
const snare = new Tone.NoiseSynth();
const snareHPF = new Tone.Filter(200, "highpass");
const snareCrack = new Tone.Filter(2500, "peaking");
snareCrack.gain.value = 4;
const snareDist = new Tone.Distortion(0.5);
snare.chain(snareHPF, snareCrack, snareDist, Tone.Destination);
snare.volume.value = -3;

// === HI-HAT ===
const hat = new Tone.NoiseSynth();
const hatHPF = new Tone.Filter(8000, "highpass");
hat.chain(hatHPF, Tone.Destination);
hat.volume.value = -12;

// === PAD ===
const pad = new Tone.PolySynth();
const padHPF = new Tone.Filter(300, "highpass");
const padChorus = new Tone.Chorus(4, 2.5, 0.5);
const padReverb = new Tone.Reverb(4);
pad.chain(padHPF, padChorus, padReverb, Tone.Destination);
pad.volume.value = -18;

// === MASTER BUS ===
const masterComp = new Tone.Compressor({
  threshold: -12,
  ratio: 2,
  attack: 0.1,
  release: 0.3
});
const masterLimiter = new Tone.Limiter(-0.5);

// Connect everything through master
// (In actual setup, you'd use a master bus)
Tone.Destination.chain(masterComp, masterLimiter);
```

### Template 2: House Mix

```javascript
// 120 BPM House Mix
await Tone.start();
Tone.Transport.bpm.value = 120;

// === FOUR-ON-FLOOR KICK ===
const kick = new Tone.MembraneSynth();
const kickComp = new Tone.Compressor(-20, 3);
kick.chain(kickComp, Tone.Destination);
kick.volume.value = 0;

// === CLAP/SNARE ===
const clap = new Tone.NoiseSynth();
const clapReverb = new Tone.Reverb(0.8);
clapReverb.wet.value = 0.2;
clap.chain(clapReverb, Tone.Destination);
clap.volume.value = -3;

// === BASS (Warm House Bass) ===
const bass = new Tone.MonoSynth();
const bassLPF = new Tone.Filter(300, "lowpass");
bassLPF.Q.value = 5; // Resonant
const bassComp = new Tone.Compressor(-24, 4);
bass.chain(bassLPF, bassComp, Tone.Destination);
bass.volume.value = -6;

// === PIANO CHORDS ===
const piano = new Tone.PolySynth();
const pianoDelay = new Tone.FeedbackDelay("8n", 0.3);
const pianoReverb = new Tone.Reverb(2);
piano.chain(pianoDelay, pianoReverb, Tone.Destination);
piano.volume.value = -9;

// === HI-HATS (Offbeat) ===
const hat = new Tone.NoiseSynth();
const hatHPF = new Tone.Filter(10000, "highpass");
hat.chain(hatHPF, Tone.Destination);
hat.volume.value = -12;
```

---

## Quick Reference: Frequency Cheat Sheet

```javascript
// COPY-PASTE FILTERS BY INSTRUMENT

// KICK
new Tone.Filter(80, "lowpass")         // Body
new Tone.Filter(5000, "peaking")       // Attack (boost +3dB)

// BASS
new Tone.Filter(40, "highpass")        // Clean lows
new Tone.Filter(100, "peaking")        // Body (boost +3dB)
new Tone.Filter(1000, "peaking")       // Presence (boost +4dB)

// SNARE
new Tone.Filter(200, "highpass")       // Remove mud
new Tone.Filter(2500, "peaking")       // Crack (boost +4dB)

// HI-HAT
new Tone.Filter(8000, "highpass")      // Remove everything else

// PAD/STRINGS
new Tone.Filter(300, "highpass")       // Don't compete with bass
new Tone.Filter(4000, "lowpass")       // Smooth highs

// LEAD
new Tone.Filter(3000, "peaking")       // Presence (boost +3dB)
new Tone.Filter(8000, "peaking")       // Air (boost +2dB)
```

---

## Mixing Workflow (Step-by-Step)

### Phase 1: Balance (No Processing)

1. **Set all faders to -6dB**
2. **Get rough balance with volume only**
3. **Don't add effects yet**
4. **Listen at conversation level**

### Phase 2: EQ (Subtraction First)

1. **Highpass everything except kick/bass**
   ```javascript
   instrument.connect(new Tone.Filter(200, "highpass"));
   ```
2. **Cut mud (200-500 Hz)**
3. **Then boost for clarity/presence**

### Phase 3: Compression

1. **Start with bass (needs most)**
2. **Then vocals/lead elements**
3. **Light compression on everything else**
4. **Check for pumping**

### Phase 4: Effects

1. **Add reverb/delay to taste**
2. **Keep drums dry**
3. **Sync delays to tempo**
4. **Check mono compatibility**

### Phase 5: Final Polish

1. **Automate levels (rides)**
2. **Check reference track**
3. **Test on multiple systems**
4. **Export and live with it**

---

## Key Takeaways from Steve Savage

1. **"Sounds best vs. fits best"** - Solo sound is deceiving
2. **"Cut, don't boost"** - Solve problems by removal
3. **"Less is more"** - Especially with low frequencies
4. **"Monitor level matters"** - Quiet reveals truth
5. **"Compression is friend, not savior"** - Don't overdo it
6. **"Reference constantly"** - Use professional tracks
7. **"Live with it"** - Time reveals mix problems

---

## Resources

- **Book:** "Mixing and Mastering In the Box" by Steve Savage
- **Tone.js Docs:** https://tonejs.github.io
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

---

**Last Updated:** November 18, 2024  
**For:** UNISEX XL Project - Berlin Techno Production
