# 🎵 Strudel + Visualizer

**Clean, focused live coding environment** combining Strudel with aggressive ASCII visualization.

## 🚀 Quick Start

Open: `/Users/miguelarias/Code/unisex-xl/strudel-viz.html`

Or click **"🎵 Strudel + Viz"** from any index page.

## ✨ Features

### ✅ **Reliable Strudel Integration**
- Uses **`@strudel/web`** package (official recommended approach)
- Handles all dependencies automatically (soundfonts, synths, samples)
- No manual module loading complexity
- Based on [official Strudel docs](https://strudel.cc/technical-manual/project-start/)

### 🎨 **Aggressive Visual Reactions**
- **Direct Tone.js connection** (no BlackHole needed!)
- **Extreme visual responsiveness**:
  - Aggressive: 1.0-3.0x size changes
  - Extreme: 0.2-6.0x size changes 🔥
  - Subtle: 0.8-1.5x size changes
- **5 layered effects**: bass pulse, wave, ripple, variation, jitter
- Real-time audio level indicators

### 🎹 **Pattern Library**
- 6 pre-loaded patterns from `/strudel/`
- Quick load via dropdown
- Industrial techno, Berlin techno, and more

### ⚡ **Keyboard Shortcuts**
- `Ctrl+Enter` - Play/Restart pattern
- `Ctrl+.` - Stop

## 🆚 Comparison with `live-coding.html`

| Feature | **strudel-viz.html** | live-coding.html |
|---------|---------------------|------------------|
| **Code Size** | ~200 lines | ~600 lines |
| **Strudel Loading** | @strudel/web (official) | Manual modules |
| **Complexity** | Simple & focused | Full-featured |
| **Reliability** | High (official package) | Medium (manual setup) |
| **Use Case** | Live performance | Development/testing |

## 🎯 Why This App?

After building `live-coding.html`, we learned:
1. Manual module loading is complex and error-prone
2. `@strudel/web` handles everything automatically
3. Simpler code = easier to maintain and debug

This app is the **clean, production-ready version** using best practices.

## 📋 What It Does

1. **Loads Strudel** via `@strudel/web` (handles all initialization)
2. **Connects visualizer** directly to Tone.js audio stream
3. **Evaluates patterns** and plays them
4. **Visualizes audio** with aggressive ASCII effects
5. **Provides pattern library** for quick loading

## 🎨 Visual Presets

Toggle in toolbar dropdown:

- **Aggressive** (default) - Balanced, 1.0-3.0x size changes
- **Extreme** - Maximum drama, 0.2-6.0x size changes 🔥
- **Subtle** - Studio work, 0.8-1.5x size changes

## 🔧 Technical Details

### Audio Flow
```
Strudel Pattern
    ↓
@strudel/web (handles initialization)
    ↓
Tone.js (Web Audio API)
    ↓
Tone.Destination (Master Output)
    ├→ Tone.FFT (Frequency Analysis)
    └→ Tone.Meter (Volume Analysis)
    ↓
p5.js Visualizer (ASCII Rendering)
```

### Architecture
- **strudel-viz.html** - Main page (clean UI)
- **src/strudel-viz-app.js** - Application controller (~200 lines)
- **src/live-coding-visualizer.js** - Aggressive visualizer (reused)

## 🎵 Example Pattern

```javascript
cps(0.654) // 157 BPM

stack(
  // Kick - drives the bass pulse
  s("bd ~ bd ~")
    .bank("RolandTR909")
    .gain(1.2),
  
  // Bass - creates color shifts
  note("b1 e2 b1 d3")
    .s("sawtooth")
    .lpf(400)
    .gain(0.8),
  
  // Hi-hats - add sparkle
  s("hh*8")
    .bank("RolandTR909")
    .hpf(8000)
    .gain(0.4)
)
```

Press **`Ctrl+Enter`** and watch it react!

## 🐛 Troubleshooting

### No sound?
1. Click **PLAY** button (user gesture required for AudioContext)
2. Check console for errors
3. Try synth sounds first: `note("c4").s("sawtooth").play()`

### Visual not reacting?
1. Check visual preset (try "Extreme")
2. Ensure pattern is playing (check status indicator)
3. Try patterns with strong bass

### Pattern won't load?
1. Check browser console for HTTP errors
2. Verify `.strudel` files exist in `/patterns/`

## 📚 Resources

- **Strudel Docs**: https://strudel.cc/technical-manual/project-start/
- **Pattern Library**: `/strudel/`
- **Visualizer Code**: `src/live-coding-visualizer.js`

## 🎊 Result

A **clean, reliable, production-ready** live coding environment that:
- ✅ Always works (official @strudel/web package)
- ✅ Visual reactions are OBVIOUS (aggressive effects)
- ✅ Simple codebase (easy to maintain)
- ✅ Direct audio routing (no external setup)

**Perfect for live performances!** 🎵✨

