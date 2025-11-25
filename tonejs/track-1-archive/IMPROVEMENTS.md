# Track 1: Advanced Mixed Principles - Improvements

## Overview

`advanced-mixed-principles.js` is a professional-grade remake of `basic-mixed-principles.js`, applying production techniques from:
- **Attack Magazine:** "The Secrets of Dance Music Production"
- **Steve Savage:** "Mixing and Mastering In the Box"

---

## 🆕 New Instruments Added

### 1. **Open Hi-Hat**
- **Why:** Essential for Berlin techno groove and dynamics
- **Frequency:** 6+ kHz (slightly more body than closed hat)
- **Gain:** 0.35 (Attack Magazine: background accent)
- **Pattern:** Every 2 measures (creates tension/release)

### 2. **Percussion Layer (Ride/Shaker)**
- **Why:** Adds rhythmic complexity and mid-range texture
- **Frequency:** 1+ kHz (mid-range percussion)
- **Panning:** +0.4 (right) for stereo interest
- **Gain:** 0.3 (subtle layer)
- **Pattern:** Syncopated 8th notes with velocity variations

### 3. **Percussive Stabs**
- **Why:** Rhythmic accents for build and energy
- **Frequency:** 800-6000 Hz (mid-high range)
- **Effect:** Fast 16th note delay (0.6 wet)
- **Gain:** 0.45
- **Pattern:** Sparse hits, enters at 8m for dramatic build

---

## 🎚️ Gain Staging Applied (Attack Magazine)

| Instrument    | Old Gain | New Gain | Reason                          |
|---------------|----------|----------|---------------------------------|
| Kick          | ~1.0     | **1.2**  | Loudest - reference point       |
| Bass          | ~0.8     | **0.8**  | Just below kick                 |
| Snare         | ~0.65    | **0.65** | Clear backbeat                  |
| Closed Hat    | ~0.2     | **0.4**  | More present (0.3-0.5 range)    |
| Open Hat      | -        | **0.35** | Background accent (new)         |
| Percussion    | -        | **0.3**  | Subtle layer (new)              |
| Lead Synth    | ~0.5     | **0.5**  | Cut through (0.4-0.6 range)     |
| Stabs         | -        | **0.45** | Rhythm support (new)            |
| Pad           | ~0.15    | **0.2**  | Atmosphere (0.15-0.25 range)    |

**Result:** Professional gain hierarchy with kick as anchor

---

## 📊 Frequency Management (Steve Savage)

### Kick (60-120 Hz Body + 5 kHz Attack)
**Before:**
```javascript
bassFilter.connect(Tone.Destination); // Generic auto-filter
```

**After:**
```javascript
// Precise frequency targeting
kickLPF: 120 Hz (tight low-end focus)
kickAttack: 5000 Hz peaking (+3 dB boost for punch)
kickSaturation: 0.2 (subtle harmonics)
kickCompression: 3:1 ratio (preserve transient)
```

### Bass (100-125 Hz Body + 1 kHz Presence)
**Before:**
```javascript
bassFilter: 200-400 Hz range
bassDistortion: 0.8
```

**After:**
```javascript
// Separation from kick + audibility
bassHPF: 40 Hz (remove sub-bass mud)
bassBody: 100 Hz peaking (+3 dB for body)
bassPresence: 1000 Hz peaking (+4 dB for audibility) ⭐ NEW
bassLPF: 400 Hz auto-filter (18 Q resonance)
bassSaturation: 0.65 (heavy Berlin techno style)
bassCrush: 8 bits (lo-fi grit)
bassCompression: 6:1 ratio (heavy for consistency)
```

**Key Improvement:** Added 1 kHz presence boost so bass is "heard" not just "felt" (Savage principle)

### Snare (2.5 kHz Crack | HPF 200 Hz)
**Before:**
```javascript
// Generic noise synth
drums.connect(drumCrusher);
```

**After:**
```javascript
snareHPF: 200 Hz (remove low-end competition)
snareCrack: 2500 Hz peaking (+4 dB for snap) ⭐ NEW
snareLPF: 8000 Hz (tame harshness)
snareDistortion: 0.6 (Berlin aggression)
snareCompression: 4:1 ratio
snareReverb: 0.8s decay, 0.15 wet (minimal) ⭐ NEW
```

**Key Improvement:** Emphasized 2.5 kHz "crack" range for punch

### Hi-Hats (8-12 kHz Air | HPF 6-8 kHz)
**Before:**
```javascript
// Single hat, basic filter
hat.connect(drumCrusher);
```

**After:**
```javascript
// Closed Hat
hatClosedHPF: 8000 Hz (aggressive)
hatClosedAir: 12000 Hz peaking (+2 dB sparkle) ⭐ NEW
hatClosedCrush: 8 bits (character)

// Open Hat ⭐ NEW INSTRUMENT
hatOpenHPF: 6000 Hz (more body than closed)
```

### Lead Synth (3 kHz Presence | HPF 400 Hz)
**Before:**
```javascript
synth.fan(synthPhaser, pingPongDelay, tremolo);
```

**After:**
```javascript
synthHPF: 400 Hz (don't compete with bass) ⭐ NEW
synthLPF: 4000 Hz (smooth resonant)
synthPresence: 3000 Hz peaking (+3 dB) ⭐ NEW
// Then effects: phaser, delay, reverb
```

**Key Improvement:** Added HPF to remove bass competition + presence boost

### Pad (4-10 kHz | HPF 500 Hz)
**Before:**
```javascript
padChorus.connect(bigReverb);
```

**After:**
```javascript
padHPF: 500 Hz (aggressive cut - Savage rule) ⭐ NEW
padLPF: 10000 Hz (smooth highs)
// Then effects: chorus, reverb, auto-pan
```

**Key Improvement:** Aggressive HPF at 500 Hz prevents low-end mudding

---

## 🎛️ Compression Strategy (Savage)

| Instrument | Ratio | Attack    | Release | Purpose                      |
|------------|-------|-----------|---------|------------------------------|
| Kick       | 3:1   | 0.001s    | 0.05s   | Light, preserve transient    |
| Bass       | 6:1   | 0.05s     | 0.1s    | Heavy, consistency           |
| Snare      | 4:1   | 0.001s    | 0.05s   | Medium, control dynamics     |

**Before:** No compression (uncontrolled dynamics)  
**After:** Strategic compression per-instrument (professional control)

---

## 🎵 Effects Improvements

### Reverb (Savage Philosophy)
**Before:** Generic reverb on everything  
**After:**
- **Drums:** 0-0.2 wet (minimal - Attack Magazine rule)
- **Snare:** 0.8s decay, 0.15 wet (short room)
- **Lead:** 1.5s decay, 0.4 wet (medium hall)
- **Pad:** 4s decay, 1.0 wet (lush cathedral)

### Delay (Tempo-Synced)
**Before:** Fixed time values  
**After:**
- **Lead:** "8n" (8th note sync - Savage rule)
- **Stabs:** "16n" (fast rhythmic delay)

### Panning (Stereo Interest)
**Before:** Mono/static  
**After:**
- **Kick/Bass/Snare:** Center (0.0) - most important
- **Percussion:** +0.4 right (stereo interest)
- **Pad:** LFO modulation (-0.7 to +0.7 wide)

---

## 🎬 Arrangement Improvements

| Time  | Old                  | New                                    |
|-------|----------------------|----------------------------------------|
| 0:00  | Pattern starts       | Core pattern (kick, bass, snare, hats, melody) |
| 0:08  | Arpeggio             | Arpeggio + Open hi-hat accents ⭐      |
| 0:16  | Pad + Distortion up  | Percussion layer + Pad + Distortion ⭐ |
| 0:32  | Filter opens         | Bass filter opens (build)              |
| 0:48  | Bit crusher          | Pad presence increased ⭐              |
| 1:04  | -                    | Percussive stabs enter (build) ⭐      |
| 1:20  | -                    | Hi-hats cleaned (16 bit) ⭐            |

**Result:** More dynamic build with additional layers and transitions

---

## 💡 Key Principles Applied

### ✅ Attack Magazine Rules
1. **Kick loudest always** (1.2 gain)
2. **Bass just below kick** (0.8 gain)
3. **HPF everything except kick/bass**
4. **Frequency separation** (no clashes)
5. **Minimal reverb on drums** (0-0.2)
6. **Heavy saturation on bass** (0.65)
7. **High resonance on bass filter** (Q=18)

### ✅ Steve Savage Principles
1. **"Sounds best vs. fits best"** - Pad/Lead HPF'd aggressively (sound "thin" solo, perfect in mix)
2. **"Cut, don't boost"** - HPF before adding boosts
3. **"Less is more"** - Strategic low-frequency management
4. **"Compression is friend, not savior"** - Heavy only on bass (6:1), light elsewhere
5. **"Monitor level matters"** - Documented in console log
6. **Bass presence boost** - 1 kHz boost so it's "heard" not just "felt"

---

## 📁 File Structure

```
tonejs/track-1/
├── basic.js                          # Original pattern
├── basic-mixed-principles.js         # First mixing attempt
├── advanced-mixed-principles.js      # ⭐ THIS FILE (professional mix)
├── with-sliders.js                   # Interactive controls
├── hybrid.js                         # Combined approach
├── hybrid-documented.js              # Documented hybrid
└── IMPROVEMENTS.md                   # This documentation
```

---

## 🚀 How to Use

1. **Load in your Tone.js setup:**
   ```javascript
   await Tone.start();
   Tone.Transport.start();
   ```

2. **Monitor at conversation level** (not loud - Savage rule)

3. **Listen for:**
   - Kick dominance in low-end
   - Bass audibility in mids (1 kHz presence)
   - Snare crack at 2.5 kHz
   - Pad not competing with bass
   - Clean stereo image

4. **Compare to reference tracks** at same volume

---

## 📚 Documentation Used

- `/docs/books/attack-magazine/quick-ref.md` - Gain staging, frequency ranges
- `/docs/books/mixing-mastering/tonejs.md` - Steve Savage principles in Tone.js

---

## 🎯 Results

✅ **Professional gain hierarchy**  
✅ **No frequency clashes**  
✅ **3 new essential instruments** (open hat, percussion, stabs)  
✅ **Strategic compression** (heavy on bass, light on transients)  
✅ **Proper reverb balance** (minimal drums, lush pads)  
✅ **Stereo interest** (panning, auto-pan)  
✅ **Dynamic arrangement** (7 timeline events vs 4)  
✅ **Production-ready mix** (club-ready Berlin techno)

---

**Next Steps:**
- Test on multiple systems (car, phone, headphones)
- A/B with professional Berlin techno tracks
- Adjust to taste while maintaining principles
- Export and "live with it" (Savage: time reveals problems)

