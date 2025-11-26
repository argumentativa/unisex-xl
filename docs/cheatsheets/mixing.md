# Mixing Quick Reference Card
## 1-Page Cheatsheet for Live Coding

Based on Steve Savage's "Mixing and Mastering In the Box"

---

## Frequency Map (Hz)

```
20-60     Sub Bass       (felt, not heard)
60-120    Low Bass       (kick fundamental)
120-500   Low Mids       (warmth, can muddy)
500-2k    Mids           (vocals, most instruments)
2k-6k     High Mids      (presence, clarity)
6k-20k    Highs          (air, sparkle)
```

---

## Filter Frequencies (Copy-Paste)

| Instrument | HPF | LPF | Notes |
|------------|-----|-----|-------|
| **Kick** | None | 3000 | Full spectrum |
| **Bass** | 40 | 800 | Remove sub-mud |
| **Snare** | 200 | 8000 | Remove kick freq |
| **Hi-hat** | 8000 | None | Air only |
| **Pad** | 300 | 4000 | No low competition |
| **Lead** | 400 | 3000 | Presence range |

---

## Gain Levels (Relative)

```
Kick:    1.5-1.8  (loudest)
Bass:    0.7-0.9  (just under kick)
Snare:   0.6-0.8  (medium)
Hats:    0.3-0.4  (background)
Pads:    0.2-0.3  (atmosphere)
FX:      0.1-0.2  (subtle)
```

---

## Compression Quick Guide

| Amount | Ratio | Use |
|--------|-------|-----|
| **Light** | 2:1-3:1 | Glue, transparency |
| **Medium** | 4:1-6:1 | Bass, vocals |
| **Heavy** | 8:1+ | Limiting, leveling |

**Attack:** Slow (50-75ms) = preserve punch | Fast (1-10ms) = reduce transient  
**Release:** Slow (100-300ms) = smooth | Fast (10-50ms) = natural

---

## Effects Amounts

```
REVERB (wet)
Drums:  0.1-0.2  (dry)
Bass:   0.0      (none)
Leads:  0.3-0.5  (present)
Pads:   0.6-0.9  (lush)

DELAY (feedback)
Subtle: 0.2-0.3
Medium: 0.4-0.6
Heavy:  0.7-0.8

DISTORTION
Kick:   0.2-0.4  (punch)
Bass:   0.4-0.7  (growl)
Snare:  0.4-0.6  (aggression)
```

---

## Panning Rules

```
CENTER:  Kick, Bass, Snare, Lead
SLIGHT:  Hats (±0.2-0.3)
WIDE:    Pads, FX (±0.6-0.8)

NEVER:   Bass off-center (lopsided mix)
```

---

## Strudel Quick Chains

```javascript
// KICK
s("kick").gain(1.8).lpf(3000).shape(0.3)

// BASS
note("a1").s("saw").hpf(40).lpf(800).shape(0.5).gain(0.8)

// SNARE
s("snare").hpf(200).shape(0.4).gain(0.7)

// HATS
s("hat").hpf(8000).gain(0.3)

// PAD
note("c3 e3 g3").s("tri").hpf(300).room(0.7).gain(0.3)
```

---

## Tone.js Quick Chains

```javascript
// KICK
const kick = new Tone.MembraneSynth();
kick.chain(
  new Tone.Filter(80, "lowpass"),
  new Tone.Distortion(0.3),
  Tone.Destination
);

// BASS
const bass = new Tone.FMSynth();
bass.chain(
  new Tone.Filter(40, "highpass"),
  new Tone.Filter(1000, "peaking"),
  new Tone.Compressor(-24, 6),
  Tone.Destination
);
```

---

## Common Mistakes

❌ Everything has full low-end → **USE HPF!**  
❌ All elements loud → **Balance relatively**  
❌ Bass panned off-center → **Center always**  
❌ Too much compression → **Less is more**  
❌ Mixing too loud → **Conversation level**

---

## Savage's 5 Rules

1. **Have a concept** - Know what you want
2. **Monitor at low-medium** - Ear fatigue = bad decisions
3. **Sounds best ≠ Fits best** - Trust the mix context
4. **Revise, revise, revise** - First pass ≠ final
5. **Live with it** - Test on multiple systems

---

## Emergency Fixes

**Muddy?** → Add HPF at 200-300 Hz on everything except kick/bass  
**Harsh?** → Cut highs around 3-5 kHz  
**Thin?** → Boost 100-200 Hz (but sparingly!)  
**Weak?** → Compress bass harder (4:1 to 6:1)  
**Clipping?** → Lower everything, kick stays loudest

---

## The Golden Rule

> **"Cut to solve problems. Boost to add character."**  
> — Steve Savage

---

**Print this. Keep it visible while coding.**
