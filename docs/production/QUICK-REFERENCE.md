# Dance Music Production - Quick Reference Card
## Attack Magazine Techniques for UNISEX-XL

---

## 🎚️ Gain Staging (MEMORIZE THIS!)

```
Kick:    1.0-1.3  (Loudest - Reference)
Bass:    0.7-0.9  (Just below kick)
Snare:   0.6-0.8  (Clear backbeat)
Claps:   0.5-0.7  (Rhythm support)
Hats:    0.3-0.5  (Background)
Leads:   0.4-0.6  (Cut through)
Pads:    0.15-0.25 (Atmosphere)
```

---

## 🎛️ Filter Settings

### Kick
```javascript
.hpf(40).lpf(120).shape(0.2).gain(1.2)
```

### Bass
```javascript
.hpf(35).lpf(400-800).resonance(12-18).shape(0.5-0.7).gain(0.8)
```

### Snare
```javascript
.hpf(200).lpf(8000).shape(0.3).gain(0.65)
```

### Hats
```javascript
.hpf(6000).crush(8).gain(0.3-0.4)
```

### Leads
```javascript
.hpf(400).lpf(4000).shape(0.3).gain(0.5)
```

### Pads
```javascript
.hpf(500).lpf(10000).gain(0.2).room(1.0)
```

---

## 📊 Frequency Separation

```
Sub Bass:   20-60 Hz    (Kick fundamental)
Bass:       60-250 Hz   (Kick punch, Bass body)
Low Mids:   250-500 Hz  (Warmth)
Mids:       500-2000 Hz (Definition)
High Mids:  2-6 kHz     (Clarity/Snap)
Highs:      6-12 kHz    (Air)
```

---

## 🎵 Genre Templates

### TECHNO (130-140 BPM)
```javascript
setcps(0.55)  // 132 BPM
stack(
  s("bd ~ bd ~").bank("RolandTR909").lpf(120).gain(1.2),
  note("a1 [a1 a2]").s("sawtooth").lpf(350).resonance(18).shape(0.65).gain(0.8),
  s("~ sd ~ sd").hpf(200).gain(0.65),
  s("hh*8").hpf(8000).gain(0.4)
).room(0.15).gain(0.85)
```

### DEEP HOUSE (120-125 BPM)
```javascript
setcps(0.52)  // 124 BPM
stack(
  s("bd ~ [~ bd] ~").bank("RolandTR808").lpf(80).gain(1.0),
  note("<a0 e0>").s("sine").slow(2).lpf(100).gain(0.6),
  note("<am7 dm7>").voicing().lpf(800).gain(0.3).room(0.6)
).room(0.4).gain(0.8)
```

---

## 🎛️ Effects Quick Guide

### Reverb
```
Drums: 0-0.2
Bass:  0-0.1
Leads: 0.3-0.6
Pads:  0.8-1.5
```

### Delay
```
Rhythmic: 0.25 (1/4 note)
Fast:     0.125 (1/8 note)
Texture:  0.0625 (1/16 note)
```

### Saturation
```
Kick:  0.1-0.3
Bass:  0.4-0.8
Snare: 0.2-0.4
Leads: 0.3-0.6
```

---

## ⚡ Berlin Techno Recipe

```javascript
setcps(0.583)  // 140 BPM

stack(
  // Layered kick (909 + 808)
  s("bd ~ bd ~").bank("RolandTR909").lpf(120).gain(1.0),
  s("bd ~ bd ~").bank("RolandTR808").lpf(70).gain(0.3),
  
  // Acid bass
  note("a1 [a1 a2] a1 [a2 a1]").s("sawtooth")
    .lpf(slider(350, 200, 600))
    .resonance(slider(18, 10, 25))
    .shape(0.65).slide(-0.5).gain(0.8),
  
  // 909 drums
  s("~ sd ~ sd").hpf(200).gain(0.65),
  s("hh*16").hpf(8000).crush(8).gain(0.4)
)
.room(0.12).lpf(15000).shape(0.15).gain(0.85)
```

---

## 🎯 Mixing Checklist

- [ ] Kick loudest (1.0+)
- [ ] Bass below kick (0.7-0.9)
- [ ] All HPF except kick/bass
- [ ] Snare has snap (3-5 kHz)
- [ ] Hats quiet (0.3-0.4)
- [ ] No frequency clashes
- [ ] Minimal reverb on drums
- [ ] Master at 0.8-0.85
- [ ] No clipping

---

## 🔊 Master Chain

```javascript
stack(/* all tracks */)
  .hpf(35)        // Clean low end
  .lpf(15000)     // Control highs
  .shape(0.15)    // Glue saturation
  .room(0.1)      // Subtle space
  .gain(0.85)     // Leave headroom!
```

---

## 💡 Golden Rules

1. **Kick = Loudest Always**
2. **One element per frequency range**
3. **Cut before boost**
4. **HPF everything except kick/bass**
5. **Keep it simple, keep it tight**

---

**Print this and keep it next to your setup!** 📄

