# Attack Magazine - Dance Music Production Guide
## Sound Design, Mixing & Mastering Reference for UNISEX-XL

**Source:** "The Secrets of Dance Music Production" by Attack Magazine  
**Application:** Techno, House, Industrial, and Electronic Dance Music  
**For Use With:** UNISEX-XL (Tone.js & Strudel)

---

## Table of Contents

1. [Kick Drum Design](#kick-drum-design)
2. [Snare & Clap Design](#snare--clap-design)
3. [Hi-Hat Design](#hi-hat-design)
4. [Bass Synthesis](#bass-synthesis)
5. [Lead Synthesis](#lead-synthesis)
6. [Pad & Atmosphere Design](#pad--atmosphere-design)
7. [Mixing Fundamentals](#mixing-fundamentals)
8. [Frequency Ranges](#frequency-ranges)
9. [Effects Processing](#effects-processing)
10. [Genre-Specific Techniques](#genre-specific-techniques)
11. [Mastering Chain](#mastering-chain)
12. [Strudel Implementation](#strudel-implementation)

---

## Kick Drum Design

### The Foundation of Dance Music

The kick drum is THE most important element in dance music. It must be:
- **Punchy** - Clear attack
- **Powerful** - Sub-bass weight
- **Clean** - No frequency mud
- **Consistent** - Same level throughout

### Classic Kick Types

#### 1. **TR-909 Style (Techno/House)**
```
Characteristics:
- Tight attack (5-10ms)
- Frequency: 50-100 Hz fundamental
- Pitch envelope: Starts high, drops quickly
- Duration: 100-300ms
```

**Strudel Implementation:**
```javascript
s("bd ~ bd ~")
  .bank("RolandTR909")
  .gain(1.2)              // Loud and proud
  .lpf(120)               // Tight low-pass (80-200 Hz)
  .hpf(40)                // Remove sub-rumble
  .shape(0.2)             // Minimal saturation
  .speed(1.0)             // Standard pitch
```

#### 2. **TR-808 Style (Deep House/Hip-Hop)**
```
Characteristics:
- Deep sub-bass
- Longer decay (300-800ms)
- Frequency: 40-60 Hz fundamental
- Smooth, round tone
```

**Strudel Implementation:**
```javascript
s("bd ~ bd ~")
  .bank("RolandTR808")
  .gain(1.0)
  .lpf(80)                // Very low for sub weight
  .speed(0.9)             // Slightly lower pitch
  .end(0.3)               // Cut for tightness
```

#### 3. **Layered Kick (Modern Techno)**
```
Attack Magazine Technique:
Layer 909 (punch) + 808 (sub)
```

**Strudel Implementation:**
```javascript
stack(
  // 909 layer - attack and punch
  s("bd ~ bd ~")
    .bank("RolandTR909")
    .gain(0.7)
    .lpf(200)
    .hpf(60),            // Cut below 60 Hz
  
  // 808 layer - sub bass
  s("bd ~ bd ~")
    .bank("RolandTR808")
    .gain(0.4)
    .lpf(80)             // Only sub frequencies
    .hpf(35)
)
```

### Kick Processing Chain

**Attack Magazine Recommended Order:**
1. **EQ** - Shape frequency content
2. **Compression** - Control dynamics (not needed for samples)
3. **Saturation** - Add harmonics and warmth
4. **Limiting** - Prevent clipping

**Strudel Chain:**
```javascript
s("bd ~ bd ~")
  .hpf(40)               // 1. Cut sub-rumble
  .lpf(120)              // 2. Remove harsh highs
  .shape(0.3)            // 3. Saturation for warmth
  .gain(1.2)             // 4. Final level
```

### Kick Mixing Tips

| Parameter | Range | Purpose |
|-----------|-------|---------|
| **Gain** | 1.0-1.5 | Loudest element in mix |
| **LPF** | 80-200 Hz | Tighten the sound |
| **HPF** | 30-50 Hz | Remove rumble |
| **Saturation** | 0.1-0.3 | Add warmth/weight |
| **Sidechain** | N/A | Duck bass when kick hits |

---

## Snare & Clap Design

### Snare Fundamentals

Attack Magazine: "The snare provides the backbeat and drives the groove forward."

#### Classic Snare Types

**1. TR-909 Snare (Techno)**
```
Characteristics:
- Metallic ring
- Sharp attack
- Frequency: 200 Hz body, 8-10 kHz snap
```

**Strudel:**
```javascript
s("~ sd ~ sd")
  .bank("RolandTR909")
  .gain(0.7)
  .hpf(200)              // Remove low-end clash
  .lpf(8000)             // Tame harshness
  .shape(0.15)           // Subtle saturation
  .room(0.1)             // Minimal reverb
```

**2. Clap (House/Disco)**
```
Characteristics:
- Multiple transients
- Wide stereo image
- Frequency: 1-4 kHz range
```

**Strudel:**
```javascript
s("~ cp ~ cp")
  .bank("RolandTR909")
  .gain(0.65)
  .hpf(300)
  .lpf(6000)
  .delay(0.02)           // Slight delay for width
  .room(0.2)
```

### Snare Processing

**Attack Magazine Chain:**
1. **HPF at 150-300 Hz** - Remove low-end mud
2. **Boost 200-400 Hz** - Add body (if thin)
3. **Cut 400-800 Hz** - Remove boxiness
4. **Boost 3-5 kHz** - Add snap/crack
5. **Compression** - Control dynamics
6. **Reverb** - Add space (plate or room)

**Strudel Implementation:**
```javascript
s("~ sd ~ sd")
  .hpf(200)              // Step 1
  .lpf(10000)            // Control brightness
  .shape(0.3)            // Compression via saturation
  .room(0.15)            // Step 6: subtle space
  .delay(0.1)
```

### Mixing Levels

| Element | Gain Relative to Kick | Notes |
|---------|----------------------|-------|
| Kick | 1.0 (reference) | Loudest |
| Snare | 0.6-0.8 | Second loudest |
| Clap | 0.5-0.7 | Slightly quieter |

---

## Hi-Hat Design

### Hat Fundamentals

Attack Magazine: "Hi-hats provide rhythmic momentum and high-frequency content."

#### Types

**1. Closed Hat**
```
Characteristics:
- Short (50-100ms)
- Frequency: 6-14 kHz
- Crisp, tight
```

**Strudel:**
```javascript
s("hh*8")                // 8th notes
  .bank("RolandTR909")
  .gain(0.3)             // Quiet in mix
  .hpf(6000)             // Only high frequencies
  .speed(1.5)            // Bright tone
  .crush(8)              // Digital edge
  .pan(sine.range(-0.2, 0.2).slow(4))  // Subtle movement
```

**2. Open Hat**
```
Characteristics:
- Long decay (300-600ms)
- Creates groove/swing
- Frequency: 4-12 kHz
```

**Strudel:**
```javascript
s("~ oh ~ ~")
  .bank("RolandTR909")
  .gain(0.4)
  .hpf(4000)
  .decay(0.4)            // Control ring
  .cut(1)                // Closed hat cuts open
  .delay(0.15)
```

### Hat Processing

**Attack Magazine:**
- **HPF 4-8 kHz** - Remove low-end completely
- **Light compression** - Even out dynamics
- **Bit reduction** - Add digital character
- **Panning** - Stereo width

**Strudel:**
```javascript
s("hh*8, ~ oh ~ ~")
  .hpf(6000)
  .crush(slider(8, 4, 16))
  .gain(slider(0.35, 0.2, 0.6))
  .pan(sine.range(-0.3, 0.3))
```

---

## Bass Synthesis

### Bass is King in Dance Music

Attack Magazine: "The bassline must work WITH the kick, not against it."

### Bass Types

#### 1. **Sub Bass (Deep House/Minimal)**

**Characteristics:**
- Pure sine wave or simple waveform
- Frequency: 30-100 Hz
- Mono (centered)
- Long notes

**Strudel:**
```javascript
note("<a0 e0 d0 g0>")
  .s("sine")             // Pure tone
  .slow(4)               // Long notes
  .gain(0.6)
  .lpf(100)              // Only sub frequencies
  .clip(0.9)             // Fit to beat
```

#### 2. **Reese Bass (Drum & Bass/Dubstep)**

**Characteristics:**
- Detuned sawtooth waves
- Heavy low-pass filtering
- Modulation
- Frequency: 40-200 Hz

**Strudel:**
```javascript
note("a1 e2 a1 d2")
  .s("sawtooth")
  .stack(
    s("sawtooth").speed(1.01)  // Detuned layer
  )
  .lpf(slider(400, 100, 800))
  .resonance(slider(10, 5, 20))
  .gain(0.8)
```

#### 3. **Acid Bass (Techno/Acid House)**

**Characteristics:**
- TB-303 style
- High resonance
- Filter envelope modulation
- Sequence-based

**Strudel:**
```javascript
note("a1 [a1 a2] a1 [a2 a1] a1 [e2 a1] [g1 a1] [a1 a2]")
  .s("sawtooth")
  .lpf(slider(300, 150, 600))   // Sweet spot 200-400
  .resonance(slider(18, 10, 25)) // High resonance!
  .shape(slider(0.6, 0.3, 0.9)) // Saturation
  .slide(-0.5)                   // Glide between notes
  .crush(8)
```

### Bass Frequency Separation

**Attack Magazine Rule:**
```
Kick occupies: 40-100 Hz
Bass occupies: 100-200 Hz (or 40-80 if no sub kick)
```

**Implementation:**
```javascript
stack(
  // Kick - sub focus
  s("bd ~ bd ~")
    .lpf(100)            // 40-100 Hz
    .gain(1.2),
  
  // Bass - above kick
  note("a1 e2 a1 d2")
    .s("sawtooth")
    .hpf(100)            // Cut below 100 Hz
    .lpf(500)            // Top at 500 Hz
    .gain(0.75)
)
```

### Bass Processing Chain

**Attack Magazine:**
1. **HPF 30-40 Hz** - Remove sub-rumble
2. **LPF 500-2000 Hz** - Shape tone
3. **Resonance** - Add character
4. **Saturation/Distortion** - Add harmonics
5. **Compression** - Sustain and power

**Strudel:**
```javascript
note("a1 e2 a1 d2")
  .s("sawtooth")
  .hpf(35)               // 1. Clean low end
  .lpf(slider(600, 300, 1500))  // 2. Tone shaping
  .resonance(slider(12, 5, 20)) // 3. Character
  .shape(slider(0.5, 0.2, 0.8)) // 4. Saturation
  .crush(slider(10, 6, 16))     // Additional texture
  .gain(0.8)
```

### Bass Mixing Levels

| Style | Gain | LPF | Notes |
|-------|------|-----|-------|
| Sub Bass | 0.5-0.7 | 80-120 Hz | Felt, not heard |
| Mid Bass | 0.7-0.9 | 400-800 Hz | Just below kick |
| Acid Bass | 0.6-0.8 | 200-600 Hz | Filter modulation key |

---

## Lead Synthesis

### Lead Design Principles

Attack Magazine: "Leads must cut through the mix without destroying the low-end."

### Lead Types

#### 1. **Techno Lead (Minimal)**

**Characteristics:**
- Simple waveform
- Moderate filtering
- Frequency: 400-4000 Hz

**Strudel:**
```javascript
note("<c4 e4 g4 b4>")
  .s("square")
  .lpf(slider(2000, 800, 4000))
  .hpf(400)              // Cut low-end completely
  .gain(0.5)
  .delay(0.25)
  .room(0.3)
```

#### 2. **Trance Lead (Supersaw)**

**Characteristics:**
- Multiple detuned saws
- Wide stereo
- Bright, aggressive

**Strudel:**
```javascript
note("<c5 e5 g5 b5>")
  .s("supersaw")
  .lpf(slider(6000, 3000, 10000))
  .hpf(800)
  .gain(0.6)
  .jux(rev)              // Stereo width
  .delay(0.3)
  .room(0.5)
```

#### 3. **House Stab**

**Characteristics:**
- Chord-based
- Short, punchy
- Frequency: 500-3000 Hz

**Strudel:**
```javascript
note("<~ c4 ~ e4>")
  .chord("M7")
  .s("square")
  .lpf(2500)
  .hpf(500)
  .decay(0.2)            // Short!
  .gain(0.6)
  .delay(0.2)
```

### Lead Processing

**Attack Magazine Chain:**
1. **HPF 300-800 Hz** - Remove low-end clash
2. **Saturation** - Add harmonics
3. **Chorus/Unison** - Width and thickness
4. **Delay** - Space and depth
5. **Reverb** - Air and dimension

**Strudel:**
```javascript
note("c4 e4 g4 b4")
  .s("sawtooth")
  .hpf(400)              // 1. Clean separation
  .shape(0.3)            // 2. Saturation
  .jux(rev)              // 3. Stereo width
  .delay(slider(0.3, 0, 0.6))    // 4. Space
  .room(slider(0.4, 0, 0.8))     // 5. Dimension
```

---

## Pad & Atmosphere Design

### Pad Fundamentals

Attack Magazine: "Pads fill the frequency spectrum and create emotion."

#### Pad Types

**1. Analog Pad**
```
Characteristics:
- Warm, analog tone
- Slow attack/release
- Frequency: 200-8000 Hz
```

**Strudel:**
```javascript
note("<a3 d4 f#4>")
  .s("sawtooth")
  .slow(8)               // Very slow changes
  .lpf(slider(1200, 400, 3000))
  .gain(0.2)             // Quiet!
  .room(slider(0.9, 0.5, 1.5))   // Lots of reverb
  .delay(slider(0.5, 0, 1))
```

**2. Digital Pad**
```
Characteristics:
- Bright, glassy
- Complex harmonics
- Frequency: 500-12000 Hz
```

**Strudel:**
```javascript
note("<c4 e4 g4>")
  .chord("M7")
  .s("triangle")
  .slow(4)
  .lpf(8000)
  .hpf(500)
  .gain(0.15)            // Very quiet
  .room(1.2)
  .delay(0.6)
```

### Pad Processing

**Attack Magazine:**
- Keep pads QUIET (0.1-0.25 gain)
- Heavy reverb (0.8-1.5)
- Long delay times (0.5-1.0)
- HPF to avoid bass clash

---

## Mixing Fundamentals

### The Attack Magazine Mixing Hierarchy

```
Volume Levels (Relative to 0 dB):

1. Kick Drum:        0 dB  (Reference/Loudest)
2. Bass:            -3 dB  (Just below kick)
3. Snare:           -4 dB  (Clear backbeat)
4. Claps:           -5 dB  (Rhythm support)
5. Hi-Hats:         -8 dB  (Background rhythm)
6. Leads:           -6 dB  (Cut through mix)
7. Pads:           -12 dB  (Subtle atmosphere)
8. FX:             -10 dB  (Texture)
```

**Strudel Implementation:**
```javascript
stack(
  s("bd ~ bd ~").gain(1.0),          // 0 dB - Reference
  note("a1 e2").s("bass").gain(0.7), // -3 dB
  s("~ sd ~ sd").gain(0.6),          // -4 dB
  s("~ cp ~ cp").gain(0.55),         // -5 dB
  s("hh*8").gain(0.4),               // -8 dB
  note("c4 e4").s("lead").gain(0.5), // -6 dB
  note("a3 d4").s("pad").gain(0.25)  // -12 dB
)
```

### Frequency Separation Rules

**Attack Magazine Golden Rules:**

1. **One element per frequency range**
2. **No two loud elements in same range**
3. **Use HPF on everything except kick/bass**
4. **LPF to control brightness**

**Implementation:**
```javascript
stack(
  // Kick: 40-100 Hz
  s("bd").lpf(120).hpf(40).gain(1.0),
  
  // Bass: 100-400 Hz
  note("a1").s("bass").hpf(100).lpf(600).gain(0.7),
  
  // Snare: 200-8000 Hz
  s("sd").hpf(200).lpf(8000).gain(0.6),
  
  // Hats: 6000-14000 Hz
  s("hh*8").hpf(6000).gain(0.3),
  
  // Leads: 400-6000 Hz
  note("c4").s("lead").hpf(400).lpf(6000).gain(0.5),
  
  // Pads: 500-10000 Hz
  note("a3").s("pad").hpf(500).lpf(10000).gain(0.2)
)
```

---

## Frequency Ranges

### The Dance Music Frequency Map

| Range | Frequency | Elements | Purpose |
|-------|-----------|----------|---------|
| **Sub Bass** | 20-60 Hz | Kick fundamental, Sub bass | Feel/Power |
| **Bass** | 60-250 Hz | Kick punch, Bass body | Weight/Groove |
| **Low Mids** | 250-500 Hz | Bass harmonics, Tom body | Warmth |
| **Mids** | 500-2000 Hz | Snare body, Leads | Definition |
| **High Mids** | 2-6 kHz | Snare snap, Lead presence | Clarity |
| **Highs** | 6-12 kHz | Hi-hats, Cymbals | Air/Brightness |
| **Air** | 12-20 kHz | Sizzle, Sparkle | Space |

### Attack Magazine EQ Approach

**For Each Element:**
1. **HPF first** - Remove unnecessary low end
2. **Cut before boost** - Subtract mud, don't add mud
3. **Subtle boosts** - 2-3 dB maximum
4. **Wide cuts** - Narrow boosts

---

## Effects Processing

### Reverb

**Attack Magazine Reverb Rules:**

| Element | Reverb Amount | Room Size | Notes |
|---------|--------------|-----------|-------|
| Kick | 0-0.1 | Small | Keep tight |
| Bass | 0-0.05 | Small | Mono clarity |
| Snare | 0.1-0.3 | Medium | Plate or room |
| Hats | 0.1-0.2 | Small | Subtle space |
| Leads | 0.3-0.6 | Large | Dimension |
| Pads | 0.8-1.5 | Large | Wash |

**Strudel:**
```javascript
stack(
  s("bd").room(0.05),           // Tight
  note("a1").s("bass").room(0), // Dry
  s("sd").room(0.2),            // Medium
  s("hh*8").room(0.15),         // Subtle
  note("c4").s("lead").room(0.5),   // Spacious
  note("a3").s("pad").room(1.2)     // Washy
)
```

### Delay

**Attack Magazine Delay Timing:**
- 1/4 note = Sync to groove
- 1/8 note = Rhythmic energy
- 1/16 note = Texture

**Strudel:**
```javascript
// Delay times based on tempo
setcps(0.654)  // 157 BPM

s("sd")
  .delay(0.25)           // 1/4 note
  .delaytime(0.25)
  .delayfeedback(0.3)

s("hh")
  .delay(0.125)          // 1/8 note
  .delaytime(0.125)
  .delayfeedback(0.2)
```

### Distortion/Saturation

**Attack Magazine:**
- **Kick:** 0.1-0.3 (warmth)
- **Bass:** 0.4-0.8 (aggression)
- **Snare:** 0.2-0.4 (punch)
- **Leads:** 0.3-0.6 (harmonics)

**Strudel:**
```javascript
stack(
  s("bd").shape(0.2),
  note("a1").s("bass").shape(0.6),
  s("sd").shape(0.3),
  note("c4").s("lead").shape(0.4)
)
```

---

## Genre-Specific Techniques

### Techno (Berlin Style)

**Attack Magazine Techno Recipe:**
```
- BPM: 130-140
- Kick: TR-909, very tight, filtered
- Bass: Heavy saturation, high resonance
- Hats: Crisp, loud, aggressive
- Overall: Dark, minimal, hypnotic
```

**Strudel Template:**
```javascript
setcps(0.55)  // 132 BPM

stack(
  // Kick - tight and punchy
  s("bd ~ bd ~")
    .bank("RolandTR909")
    .gain(1.2)
    .lpf(120)
    .hpf(50)
    .shape(0.2),
  
  // Bass - aggressive acid
  note("a1 [a1 a2] a1 [a2 a1]")
    .s("sawtooth")
    .lpf(slider(350, 200, 600))
    .resonance(slider(18, 10, 25))
    .shape(0.65)
    .crush(8)
    .gain(0.8),
  
  // Snare - metallic
  s("~ sd ~ sd")
    .bank("RolandTR909")
    .hpf(200)
    .shape(0.3)
    .gain(0.65),
  
  // Hats - crisp and present
  s("hh*8")
    .bank("RolandTR909")
    .hpf(8000)
    .crush(6)
    .gain(0.4)
)
.room(0.15)              // Minimal global reverb
.lpf(15000)              // Dark top end
.gain(0.85)
```

### Deep House

**Attack Magazine Deep House Recipe:**
```
- BPM: 120-125
- Kick: TR-808, deep and warm
- Bass: Sub bass, sine wave
- Chords: Warm, filtered
- Overall: Groovy, warm, soulful
```

**Strudel Template:**
```javascript
setcps(0.52)  // 124 BPM

stack(
  // Kick - deep 808
  s("bd ~ [~ bd] ~")
    .bank("RolandTR808")
    .gain(1.0)
    .lpf(80)
    .speed(0.9),
  
  // Sub bass
  note("<a0 ~ e0 ~>")
    .s("sine")
    .slow(2)
    .gain(0.6)
    .lpf(100),
  
  // Chords - warm and filtered
  note("<am7 dm7 em7 fm7>")
    .voicing()
    .s("sawtooth")
    .slow(16)
    .lpf(slider(800, 400, 1500))
    .gain(0.3)
    .room(0.6),
  
  // Percussion
  s("~ cp ~ cp, hh*8")
    .gain(0.5)
    .hpf(4000)
)
.room(0.4)               // More reverb than techno
.gain(0.8)
```

### Drum & Bass

**Attack Magazine D&B Recipe:**
```
- BPM: 170-180
- Kick: Layered, punchy
- Bass: Reese, modulated
- Breaks: Amen, chopped
- Overall: Fast, energetic, aggressive
```

**Strudel Template:**
```javascript
setcps(0.725)  // 174 BPM

stack(
  // Kick - layered
  s("bd ~ [bd bd] ~")
    .gain(1.3)
    .lpf(150)
    .shape(0.3),
  
  // Reese bass
  note("a1 ~ d2 [e2 a1]")
    .s("sawtooth")
    .stack(s("sawtooth").speed(1.02))  // Detuned
    .lpf(slider(500, 200, 1000))
    .resonance(15)
    .shape(0.7)
    .gain(0.9),
  
  // Fast breaks
  s("hh*16")
    .speed(rand.range(0.9, 1.1))
    .gain(0.4)
    .hpf(6000)
)
.room(0.2)
.gain(0.85)
```

---

## Mastering Chain

### Attack Magazine Mastering Order

```
1. EQ (corrective)
2. Compression (glue)
3. EQ (enhancement)
4. Saturation (harmonics)
5. Limiter (loudness)
```

### Strudel Global Chain

**Minimal Mastering:**
```javascript
stack(
  // ... all your tracks ...
)
  // 1. Corrective EQ
  .hpf(35)               // Remove sub-rumble
  .lpf(16000)            // Tame harsh highs
  
  // 2. Glue (via saturation)
  .shape(0.15)           // Subtle saturation
  
  // 3. Space
  .room(0.1)             // Tiny bit of glue reverb
  .size(0.5)
  
  // 4. Final gain
  .gain(0.85)            // Leave headroom!
```

### Loudness Targets

**Attack Magazine Guidelines:**

| Genre | Target LUFS | Peak | Notes |
|-------|------------|------|-------|
| Techno | -9 to -6 LUFS | -0.5 dB | Aggressive |
| House | -10 to -8 LUFS | -1.0 dB | Dynamic |
| D&B | -7 to -5 LUFS | -0.3 dB | Very loud |

**Strudel Gain Settings:**
```javascript
// Conservative (dynamic)
.gain(0.75)

// Moderate (club ready)
.gain(0.85)

// Aggressive (maximum loudness)
.gain(0.95)
```

---

## Strudel Implementation

### Complete Berlin Techno Track (Attack Magazine Style)

```javascript
// Berlin Techno - 140 BPM
// Following Attack Magazine principles

setcps(0.583)  // 140 BPM

stack(
  // ========================================
  // DRUMS - TR-909 Foundation
  // ========================================
  
  // KICK - Layered for depth
  s("bd ~ bd ~")
    .bank("RolandTR909")
    .gain(1.0)
    .lpf(120)
    .hpf(50)
    .shape(0.2),
  
  s("bd ~ bd ~")
    .bank("RolandTR808")
    .gain(0.3)
    .lpf(70)
    .hpf(35),
  
  // SNARE - Metallic punch
  s("~ sd ~ sd")
    .bank("RolandTR909")
    .gain(0.65)
    .hpf(200)
    .lpf(8000)
    .shape(0.3)
    .room(0.1),
  
  // CLAPS - Wide stereo
  s("~ ~ [~ cp] ~")
    .bank("RolandTR909")
    .gain(0.5)
    .hpf(300)
    .delay(0.02)
    .room(0.25),
  
  // HI-HATS - Crisp 16ths
  s("hh*16")
    .bank("RolandTR909")
    .gain(slider(0.4, 0.2, 0.6))
    .hpf(8000)
    .crush(slider(8, 4, 12))
    .speed(sine.range(1.4, 1.6).slow(8)),
  
  // OPEN HAT - Groove
  s("~ oh ~ ~")
    .bank("RolandTR909")
    .gain(0.45)
    .hpf(4000)
    .decay(0.4)
    .cut(1)
    .delay(0.15),
  
  // ========================================
  // BASS - Acid Style
  // ========================================
  
  note("a1 [a1 a2] a1 [a2 a1] a1 [e2 a1] [g1 a1] [a1 a2]")
    .s("sawtooth")
    .slow(2)
    .hpf(35)
    .lpf(slider(350, 200, 600))
    .resonance(slider(18, 10, 25))
    .shape(slider(0.65, 0.4, 0.9))
    .crush(slider(8, 6, 12))
    .slide(-0.5)
    .gain(0.8)
    .room(0.05),
  
  // ========================================
  // MELODIC ELEMENTS
  // ========================================
  
  // STABS - Minimal chords
  note("<~ a3 ~ [a3 e4]>")
    .chord("m")
    .s("square")
    .hpf(500)
    .lpf(2500)
    .decay(0.2)
    .gain(0.45)
    .shape(0.3)
    .delay(0.25)
    .room(0.3),
  
  // PAD - Dark atmosphere
  note("<a2 d3 e3>")
    .s("sawtooth")
    .slow(16)
    .hpf(400)
    .lpf(slider(1200, 600, 2000))
    .gain(0.15)
    .room(1.0)
    .delay(0.6)
)
  // ========================================
  // GLOBAL MASTERING
  // ========================================
  .hpf(35)               // Clean low end
  .lpf(15000)            // Dark top end
  .shape(0.15)           // Glue saturation
  .room(0.12)            // Minimal space
  .gain(0.85)            // Leave headroom
```

### Mixing Checklist (Attack Magazine)

**Before Finalizing:**

- [ ] Kick is loudest element (1.0 gain)
- [ ] Bass sits just below kick (0.7-0.8 gain)
- [ ] All non-bass elements HPF'd above 200 Hz
- [ ] Snare has clear snap (200 Hz + 3-5 kHz)
- [ ] Hi-hats are background (0.3-0.4 gain)
- [ ] No frequency masking
- [ ] Reverb is subtle (0.1-0.3 on most elements)
- [ ] Stereo elements are balanced
- [ ] Master gain leaves headroom (0.8-0.85)
- [ ] No clipping anywhere

---

## Quick Reference Tables

### Gain Staging Reference

| Element | Gain | Relative Level |
|---------|------|---------------|
| Kick | 1.0-1.3 | 0 dB (Loudest) |
| Bass | 0.7-0.9 | -3 dB |
| Snare | 0.6-0.8 | -4 dB |
| Claps | 0.5-0.7 | -5 dB |
| Hi-Hats | 0.3-0.5 | -8 dB |
| Leads | 0.4-0.6 | -6 dB |
| Pads | 0.15-0.25 | -12 dB |
| FX | 0.2-0.4 | -10 dB |

### Filter Reference

| Element | HPF | LPF | Purpose |
|---------|-----|-----|---------|
| Kick | 30-50 Hz | 100-200 Hz | Tight punch |
| Bass | 30-40 Hz | 400-1000 Hz | Body control |
| Snare | 150-300 Hz | 8-10 kHz | Clean snap |
| Hats | 6-8 kHz | None | Air only |
| Leads | 400-800 Hz | 6-10 kHz | Clarity |
| Pads | 400-600 Hz | 10-15 kHz | Space |

### Effects Reference

| Effect | Drums | Bass | Leads | Pads |
|--------|-------|------|-------|------|
| Reverb | 0-0.2 | 0-0.1 | 0.3-0.6 | 0.8-1.5 |
| Delay | 0-0.2 | 0-0.1 | 0.2-0.5 | 0.5-1.0 |
| Saturation | 0.1-0.4 | 0.4-0.8 | 0.2-0.5 | 0.1-0.3 |
| Crush | 4-12 | 6-12 | 8-16 | 12-16 |

---

## Resources

### Attack Magazine Links
- [Attack Magazine](https://www.attackmagazine.com)
- [Production Techniques](https://www.attackmagazine.com/technique/)
- [Sound Design Guides](https://www.attackmagazine.com/technique/tutorials/)

### Complementary Resources
- [Strudel Documentation](https://strudel.cc/learn/)
- [Tone.js Reference](https://tonejs.github.io/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

**Last Updated:** November 18, 2024  
**For:** UNISEX-XL Live Coding Platform  
**Based On:** "The Secrets of Dance Music Production" by Attack Magazine

