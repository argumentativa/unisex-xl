# Dance Music Manual - Quick Reference Card
## Rick Snoman's Essential Production Rules

**Print this. Keep it visible while producing.**

---

## Kick Drum Rules

**Three Elements:** Transient + Body + Tail

**Tuning Range:** 36-65 Hz (D1 to C2)  
**Sweet Spots:** E (41), F (44), G (49), **A (55)**, Bb (58)

**EQ Fix:** Cut -8dB at 325 Hz (removes "boxy" sound)

```javascript
// Tone.js
kick.triggerAttackRelease("A1", "8n");

// Strudel
s("kick").note("a1")
```

---

## Four-to-the-Floor Pattern

**Mandatory:** Snare on beats 2 & 4  
**Open Hat:** Every dotted quarter (every 3rd eighth)  
**Closed Hat:** Every 16th (with swing)

```javascript
// Strudel Pattern
stack(
  s("kick ~ kick ~").gain(1.8),        // 1, 3
  s("~ snare ~ snare").gain(0.7),      // 2, 4
  s("~ ~ oh ~").gain(0.5),             // Dotted
  s("[hh]*16").gain(0.3)               // 16ths
)
```

---

## Layering Rules

**KICKS:** Time-based (transient → body → tail)  
**SNARES:** Frequency-based (low → mid → high)

```javascript
// Snare Layers
s("~ snare ~").lpf(800).gain(0.6),    // Body
s("~ cp ~").hpf(1000).gain(0.7),      // Crack
s("~ hh:2 ~").hpf(6000).gain(0.3)     // Sparkle
```

---

## Five Sound Parameters

**Always process in this order:**

1. **Pitch** - `.note()` or sample selection
2. **Transient** - `.decay()` or envelope
3. **EQ** - `.lpf()`, `.hpf()`, `.bpf()`
4. **Dynamics** - `.compress()`, `.shape()`
5. **Reverb** - `.room()`, `.delay()`

---

## Swing & Timing

**Swing Amount:** 51-59%  
**Apply To:** Hi-hats and percussion ONLY  
**Never:** Kick or snare (they stay on beat)

```javascript
// Strudel Swing
s("[hh]*16")
  .late(rand.range(0, 0.03))      // Humanize
  .gain(rand.range(0.25, 0.35))   // Velocity variation
```

---

## Syncopation

**Definition:** Stress on off-beats

**Standard Grid:** [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]  
**Kick:** 1, 5, 9, 13 (every 4)  
**Snare:** 5, 13 (every 8)  
**Syncopated:** 12, 15 (unequal)

```javascript
// Syncopated percussion
s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ perc ~ ~ perc ~")
```

---

## Processing Chains

### Kick
```javascript
s("kick").gain(1.8).lpf(3000).shape(0.3)
```

### Snare (Layered)
```javascript
s("~ snare ~").lpf(800).gain(0.6).room(0.2)
s("~ cp ~").hpf(1000).gain(0.7).shape(0.3)
```

### Hi-Hats
```javascript
s("[hh]*16").gain(0.3).hpf(8000).late(rand.range(0, 0.03))
```

### Bass (Tuned to Kick)
```javascript
note("a1 a2 a1 e2")
  .s("saw")
  .hpf(40)
  .lpf(600)
  .shape(0.6)
  .gain(0.8)
```

---

## Gain Staging

**Relative Levels:**
- Kick: 1.5-1.8 (loudest)
- Snare: 0.6-0.8
- Bass: 0.7-0.9
- Open Hat: 0.4-0.5
- Closed Hat: 0.3-0.4
- Percussion: 0.2-0.4

---

## Common Mistakes

❌ **Kick not tuned** → Sounds out of key  
❌ **Snare off 2 & 4** → Rhythm feels wrong  
❌ **Everything has low-end** → Muddy mix  
❌ **No swing** → Robotic, lifeless  
❌ **No layering** → Thin, boring sounds  

---

## Snoman's Laws

1. **"Tune your kick"** - D1 to C2 range
2. **"Snare on 2 & 4"** - Always
3. **"Layer for texture"** - Never use single samples
4. **"Swing the hats"** - 51-59%
5. **"Cut boxiness"** - -8dB at 325 Hz
6. **"Develop aural memory"** - Stop using reference tracks constantly
7. **"Practice makes permanent"** - Only if you practice correctly

---

## BPM to CPS Conversion

| Genre | BPM | CPS (Strudel) |
|-------|-----|---------------|
| House | 128 | 0.533 |
| Techno | 130 | 0.542 |
| Techno | 138 | 0.575 |
| D&B | 174 | 0.725 |

**Formula:** `CPS = BPM ÷ 60 ÷ 4`

---

## Complete Pattern Template

```javascript
// HOUSE (128 BPM)
setcps(0.533)

stack(
  s("kick ~ kick ~").gain(1.8).lpf(3000).shape(0.3),
  s("~ snare ~").lpf(800).gain(0.6).room(0.2),
  s("~ cp ~").hpf(1000).gain(0.7).shape(0.3),
  s("[hh]*16").gain(0.3).hpf(8000).late(rand.range(0, 0.03)),
  s("~ ~ oh ~").gain(0.5).hpf(6000).room(0.3)
)
```

---

## Resources

📖 **Dance Music Manual** (5th Ed) - Rick Snoman  
🌐 **Altar Academy** - www.altaracademy.com  
💻 **Strudel** - strudel.cc  
🎹 **Tone.js** - tonejs.github.io

---

**Keep creating. Stay professional.**
