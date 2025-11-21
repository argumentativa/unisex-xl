# UNISEX XL - Live Coding + Visualizer

## Overview

A unified live coding environment combining **Strudel** (Tidal Cycles syntax) with aggressive **ASCII visualization**. Designed for live performance, live coding, and studio work with **direct audio routing** (no BlackHole required).

## Key Features

### ✅ No External Audio Routing
- Direct Tone.js → Visualizer connection
- No BlackHole or Loopback required
- Always works, zero setup

### 🎨 Aggressive Visual Reactions
- **Extreme** visual responsiveness (0.5-4.0x size changes)
- Multi-layered effects:
  - Bass pulse (overall size)
  - Wave effect (mid-frequencies)
  - Ripple from center
  - Position-based variation
  - Volume jitter
- Real-time color shifting
- Screen flash on heavy bass
- Audio level indicators overlay

### 🎹 Strudel Live Coding
- Full Tidal Cycles syntax support
- Pattern library integration
- Load pre-made patterns from `/patterns/strudel/`
- Save patterns locally
- Syntax highlighting (in code editor)

### ⚡ Keyboard-Driven Workflow
- `Ctrl+Enter` - Play/Restart pattern
- `Ctrl+.` - Stop
- `Ctrl+S` - Save pattern
- `Ctrl+E` - Toggle editor (fullscreen viz)
- `Ctrl+O` - Load pattern dialog
- `Ctrl+D` - Duplicate pattern
- `?` - Toggle help

### 🎭 Three Workflow Modes

**Live Coding Mode** (Default)
- 50/50 split editor/visualizer
- Pattern library visible
- Console for feedback

**Performance Mode**
- Large visualizer, small editor
- Pattern library hidden
- Focus on mixing/effects

**Studio Mode**
- Large editor, standard visualizer
- Full console visible
- Pattern management tools

### 🎚️ Visual Presets
- **Aggressive** (1.0-3.0x) - Default, balanced
- **Extreme** (0.2-6.0x) - Dramatic for performances
- **Subtle** (0.8-1.5x) - For studio work

## Quick Start

1. **Open the app**:
   ```
   /Users/miguelarias/Code/unisex-xl/live-coding.html
   ```

2. **Write or load a pattern**:
   - Use the pattern dropdown to load examples
   - Or write your own Strudel code

3. **Play**: Press `Ctrl+Enter` or click ▶️ PLAY

4. **Watch**: Visual reactions are immediate and obvious

## Technical Architecture

### Audio Flow
```
Strudel Pattern
    ↓
Tone.js (Web Audio)
    ↓
Tone.Destination (Master Output)
    ├→ Tone.FFT (Frequency Analysis)
    └→ Tone.Meter (Volume Analysis)
    ↓
p5.js Visualizer (ASCII Rendering)
```

### Components

**`live-coding.html`**
- Main application page
- Split-screen layout
- Responsive design

**`src/live-coding-visualizer.js`**
- Aggressive ASCII visualizer class
- Direct Tone.js connection
- Visual presets
- Debug panel

**`src/live-coding-app.js`**
- Application controller
- Strudel integration
- Pattern library management
- Keyboard shortcuts
- Mode switching

## Pattern Library

Pre-loaded patterns from `/patterns/strudel/`:
- Industrial 157 BPM (Advanced) ⭐
- Industrial 157 BPM
- Berlin Techno
- Techno Roland
- Der Der v1
- Der Der v2

To add patterns:
1. Save `.strudel` files to `/patterns/strudel/`
2. Update `patterns` object in `live-coding-app.js`

## Visual Settings

### Resolution
- Default: 24x16 (optimized for performance)
- Can be adjusted in `live-coding-visualizer.js`:
  ```javascript
  this.w = 24;  // Width
  this.h = 16;  // Height
  ```

### ASCII Characters
```javascript
this.asciiChars = "█▓▒░@%#*+=:. ";
```
Ordered from darkest to lightest

### Effect Multipliers
Adjust in visualizer for different intensity:
```javascript
this.bass = this.getFrequencyEnergy(spectrum, 20, 250) * 4.0;  // Bass multiplier
this.mid = this.getFrequencyEnergy(spectrum, 250, 4000) * 4.0;
this.treble = this.getFrequencyEnergy(spectrum, 4000, 20000) * 4.0;
```

## Troubleshooting

### Visual reactions not obvious?
1. Check visual preset (try "Extreme")
2. Ensure pattern is actually playing (check console)
3. Try patterns with strong bass (Industrial 157 BPM)
4. Check browser console for errors

### Pattern won't load?
1. Check path in pattern library
2. Ensure `.strudel` file exists
3. Check browser console for HTTP errors

### Audio not connecting?
1. Click PLAY button to start Tone.js context
2. Check browser console for Tone.js errors
3. Refresh page and try again

## Performance Tips

- **Lower resolution**: Reduce `w` and `h` for faster rendering
- **Simpler ASCII set**: Use fewer characters
- **Disable debug panel**: Set `this.showDebug = false`
- **Close other tabs**: Free up browser resources
- **Use Performance mode**: Hides unnecessary UI

## Comparison with Other Apps

| Feature | Live Coding App | demo-with-strudel.html | OPTIMIZED-autostart.html |
|---------|----------------|----------------------|------------------------|
| Audio Routing | Direct (Tone.js) | Direct (Tone.js) | BlackHole (external) |
| Visual Intensity | ⭐⭐⭐⭐⭐ Aggressive | ⭐⭐ Subtle | ⭐⭐⭐⭐⭐ Aggressive |
| Pattern Library | ✅ Yes | ❌ No | ❌ No |
| Keyboard Shortcuts | ✅ Complete | ⭐ Basic | ❌ None |
| Mode Switching | ✅ 3 modes | ❌ No | ❌ No |
| Best For | All use cases | Quick tests | Performance only |

## Future Enhancements

Potential additions:
- [ ] Pop-out visualizer window
- [ ] MIDI controller support
- [ ] Real-time pattern editing with syntax highlighting
- [ ] Recording/export functionality
- [ ] More visual modes (particles, mesh, etc.)
- [ ] Pattern sharing/import from URL
- [ ] BPM detection and display
- [ ] Master effects (reverb, delay, EQ)

## Credits

Built with:
- **p5.js** - Creative coding framework
- **Tone.js** - Web Audio framework
- **Strudel** - Tidal Cycles for the browser
- **Modular architecture** - From unisex-xl codebase

Inspired by:
- Tidal Cycles community
- Live coding practices
- Berlin techno culture
- Attack Magazine mixing principles

## License

Part of the UNISEX XL project.

