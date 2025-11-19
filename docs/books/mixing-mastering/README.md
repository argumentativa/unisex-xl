# Mixing and Mastering In the Box - UNISEX XL Guide

## About This Book

- **Full Title:** Mixing and Mastering In the Box
- **Author:** Steve Savage
- **Publisher:** Oxford University Press
- **Status:** Professional mixing principles for DAW-based production
- **Purpose:** Apply mixing fundamentals to live-coded music

## Contents

### Implementations

1. **[Tone.js Mixing Guide](./tonejs.md)** (945 lines)
   - Mixing principles in Tone.js
   - EQ strategies
   - Compression techniques
   - Effects chains
   - Complete mix templates

2. **[Strudel Mixing Guide](./strudel.md)** (853 lines)
   - Pattern-based mixing
   - Real-time parameter control
   - Creative effects usage
   - Live performance mixing

3. **[Quick Reference](./quick-ref.md)** (175 lines)
   - EQ frequency charts
   - Compression ratios
   - Reverb/delay times
   - Pan positions

## Steve Savage's Five Best Practices

### 1. Have a Concept
"Know what you want the mix to feel like before you start."
- Reference professional tracks
- Make intentional choices
- Define your sonic goals

### 2. Monitor at Multiple Levels
"Your ears deceive you at high volumes."
- Mix primarily at low-to-medium levels
- Check at loud volumes occasionally
- Verify on different systems

### 3. Less is More
"Every process should have a clear purpose."
- Don't add effects just because you can
- Each EQ cut/boost should solve a problem
- Trust what sounds good

### 4. Create Space Through Contrast
"Mixing is about relationships, not absolutes."
- Use frequency separation
- Employ stereo width strategically
- Balance dynamics

### 5. Ears Over Eyes
"If it sounds good, it is good."
- Trust your ears over meters
- Meters are guides, not rules
- Context matters

## Core Mixing Concepts

### Frequency Management
- **Low End (20-200 Hz):** Power and weight
- **Low Mids (200-500 Hz):** Body and warmth
- **Mids (500 Hz-2 kHz):** Presence and character
- **High Mids (2-6 kHz):** Clarity and definition
- **Highs (6-20 kHz):** Air and sparkle

### Dynamics Processing
- **Compression:** Control dynamics, add punch
- **Limiting:** Prevent clipping, increase loudness
- **Transient shaping:** Emphasize attack or sustain

### Spatial Processing
- **Panning:** Create width
- **Reverb:** Add depth
- **Delay:** Create space and movement

## How to Use These Guides

### For Mixing:
```
1. Build your pattern/track
   ↓
2. Reference appropriate guide (Tone.js or Strudel)
   ↓
3. Apply frequency separation
   ↓
4. Add compression where needed
   ↓
5. Create space with effects
   ↓
6. Reference quick-ref.md for specific values
```

### For Learning:
- Start with frequency management
- Master one concept before moving to next
- A/B compare with professional references
- Take notes on what works

## Common Mixing Workflow

**In UNISEX XL:**
```javascript
// 1. Gain staging
kickGain.value = -3;
bassGain.value = -6;

// 2. Frequency cleanup
kickLPF.frequency.value = 120;  // Remove unnecessary highs
bassHPF.frequency.value = 40;   // Remove sub-sonic rumble

// 3. Dynamics
compressor.threshold.value = -18;
compressor.ratio.value = 4;

// 4. Space
reverb.wet.value = 0.2;
delay.wet.value = 0.15;
```

## Professional Mixing Checklist

- [ ] All elements audible and balanced
- [ ] Low end tight and controlled
- [ ] Frequency conflicts resolved
- [ ] Dynamics managed (not over-compressed)
- [ ] Stereo field utilized effectively
- [ ] Effects serve the mix (not overpowering)
- [ ] Reference checked on multiple systems
- [ ] Headroom for mastering (~-6 dB peak)

## Related Resources

- Mixing & Mastering In the Box (Steve Savage)
- UNISEX XL reference: `/docs/reference/tonejs-effects.md`
- Example mixes: `/patterns/`

---

**Note:** These guides adapt Savage's principles for live coding contexts. Professional mixing requires practice and critical listening.

**Last Updated:** November 18, 2024
