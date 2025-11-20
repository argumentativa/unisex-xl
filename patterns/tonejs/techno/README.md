# Tone.js Techno Patterns

Professional Tone.js translations of Strudel techno patterns, featuring full effect chains, mixing principles, and real-time controls.

## 🎵 Patterns

### berlin-techno-tonejs.js
**Berlin-style techno with layered kick technique**

- **BPM**: 157
- **Instruments**: 7 layers
  - Kick 909 (punch and attack)
  - Kick 808 (sub-bass weight)
  - Clap/Snare (909)
  - Closed Hi-Hat (909, crisp)
  - Open Hi-Hat (909, metallic)
  - Bass (sawtooth progression)
  - Stabs (supersaw chords)

- **Features**:
  - Layered kick (Attack Magazine technique)
  - Full effect chains (HPF, LPF, distortion, delay, reverb)
  - 30+ interactive controls
  - Real-time parameter adjustment
  - Strategic frequency management

- **Controls**:
  ```javascript
  setKick909Gain(0.5-1.0)
  setKick909LPF(80-200)
  setKick808LPF(60-120)
  setBassLPF(250-800)
  setBassResonance(10-20)
  setStabsDelay(0-0.4)
  setMasterLPF(10000-20000)
  setMasterGain(0.6-0.9)
  // ...and 20+ more
  ```

### industrial-157bpm-tonejs.js
**Industrial techno with advanced mixing principles**

- **BPM**: 157
- **Instruments**: 9 layers
  - Kick (TR-909)
  - Bass (industrial progression)
  - Snare (909, aggressive)
  - Closed Hi-Hat (16ths)
  - Open Hi-Hat (accents)
  - Percussion (rim/ride)
  - Lead Synth (melody + phaser)
  - Arpeggio (fast cycling)
  - Pad (atmospheric)
  - Stabs (rhythmic accents)

- **Mixing Techniques**:
  - Attack Magazine gain staging
  - Steve Savage frequency management
  - Strategic HPF on all non-bass elements
  - Bass presence at 1 kHz
  - Minimal drum reverb (0-0.2)
  - Master saturation for glue
  - Headroom preservation (0.85 master gain)

- **Controls**:
  ```javascript
  setBassFilter(200-600)    // Sweeping filter
  setLeadDelay(0-0.6)       // Ping-pong delay
  setStabsDelay(0.3-0.8)    // Fast 16th delay
  ```

## 🎛️ Usage

### Basic Playback
```javascript
import { start, stop } from './berlin-techno-tonejs.js';

// Start playback
await start();

// Stop playback
stop();
```

### Real-Time Control
```javascript
import { 
  start, 
  setKick909LPF, 
  setBassLPF,
  setMasterGain 
} from './berlin-techno-tonejs.js';

await start();

// Tighten kick
setKick909LPF(150);

// Open bass filter
setBassLPF(600);

// Adjust master volume
setMasterGain(0.85);
```

## 🎚️ Mixing Principles

### Attack Magazine Checklist
- ✅ Kick loudest (1.0+ gain)
- ✅ Bass below kick (0.7-0.9 gain)
- ✅ HPF on all except kick/bass
- ✅ Snare emphasis (2-5 kHz via shape)
- ✅ Quiet hi-hats (0.3-0.4 gain)
- ✅ No frequency clashes
- ✅ Minimal reverb on drums
- ✅ Master at 0.8-0.85
- ✅ No clipping

### Steve Savage's Rules
- ✅ "Cut, don't boost" - HPF before effects
- ✅ "Bass presence" - 1 kHz boost for audibility
- ✅ "Less is more" - Strategic low-frequency management
- ✅ "Stereo interest" - Panning and auto-pan for width
- ✅ "Sounds best vs. fits best" - Mix context over solo sound

## 📊 Frequency Map

### berlin-techno-tonejs.js
```
Kick 909:     50-120 Hz    (punch and attack)
Kick 808:     35-80 Hz     (sub-bass only)
Clap:         200-8000 Hz  (remove lows, control highs)
Closed Hat:   8000+ Hz     (air and sizzle)
Open Hat:     4000+ Hz     (more body than closed)
Bass:         35-400 Hz    (sweeping filter)
Stabs:        400-3000 Hz  (mid-range chords)
```

### industrial-157bpm-tonejs.js
```
Kick:         60-120 Hz    (body) + transient attack
Bass:         40-400 Hz    (body) + 1 kHz (presence)
Snare:        200+ Hz      (HPF) + 2.5 kHz (crack)
Hats:         6-12 kHz     (air)
Lead:         400+ Hz      (HPF) + 3 kHz (presence)
Pad:          500+ Hz      (HPF) + 4-10 kHz (highs)
Stabs:        800-6000 Hz  (mid-high accents)
```

## 🎬 Pattern Timeline

### berlin-techno-tonejs.js
- **0:00** - Core pattern (kicks, clap, hats)
- **0:00** - Bass line enters
- **0:00** - Stabs begin

### industrial-157bpm-tonejs.js
- **0:00** - Core pattern (kick, bass, snare, closed hats, lead)
- **0:08** - Open hats + Percussion enter (16m, 32m)
- **0:16** - Arpeggio enters (32m)
- **0:32** - Pad atmosphere enters (64m)
- **1:04** - Stabs enter for dramatic build (128m)

## 🔊 Effect Chains

### Kick Chain Example
```javascript
Kick → HPF → LPF → Distortion → Volume → Destination
```

### Bass Chain Example
```javascript
Bass → HPF → LPF (resonance) → Saturation → BitCrusher → Reverb → Volume → Destination
```

### Lead Chain Example
```javascript
Lead → HPF → LPF → Phaser → PingPongDelay → Reverb → Volume → Destination
```

## 🎓 Learning Value

These patterns demonstrate:
- Professional effect chain routing
- Proper gain staging
- Frequency separation techniques
- Real-time parameter control
- Modular pattern organization
- Attack Magazine + Steve Savage principles in code

## 🔗 Related Files

- **Source Strudel Patterns**:
  - `../../strudel/techno/berlin-techno.strudel`
  - `../../strudel/techno/industrial-157bpm-advanced.strudel`

- **Samples**:
  - `../../../samples/kick/Kit01_Kick.wav`
  - `../../../samples/snare/Kit01_Snare.wav`
  - `../../../samples/hat/Kit01_Hat.wav`

## 📝 Notes

- Both patterns use the same sample paths (update paths as needed)
- All timing is based on Tone.Transport (measures, beats, notes)
- Effects are pre-configured but adjustable via setter functions
- Master effects apply final polish (HPF, LPF, saturation, reverb)
- Patterns follow modular design for easy integration

## 🚀 Next Steps

To extend these patterns:
1. Add more instruments/layers
2. Create automation sequences for controls
3. Add visual feedback (connect to p5.js visualizers)
4. Implement pattern switching/transitions
5. Add recording capabilities
6. Create preset systems for controls





