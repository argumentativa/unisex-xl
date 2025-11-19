# P5.js Demos - Audio-Reactive ASCII Art

This directory contains all P5.js-based audio-reactive ASCII art visualizations.

## Quick Access

**Browse all demos**: [index.html](./index.html)

## Directory Structure

```
p5js/demos/
├── image-ascii/       # Static image ASCII demos (6 variations)
├── video-ascii/       # Webcam ASCII demos (2 variations)
├── strudel/          # Strudel integration demos
└── misc/             # Experimental demos
```

## Featured Demos ⭐

### 🎵 Strudel + ASCII Visualizer
**[strudel/demo-with-strudel.html](strudel/demo-with-strudel.html)**
- Full split-screen interface
- Live coding editor (Strudel) + ASCII visualizer
- Industrial techno pattern (157 BPM)
- Keyboard shortcuts: `Ctrl+Enter` to play, `Ctrl+.` to stop

### 🖼️ Optimized ASCII Visualizer
**[image-ascii/image-ascii-color-bold-OPTIMIZED.html](image-ascii/image-ascii-color-bold-OPTIMIZED.html)**
- Performance-optimized version
- Audio-reactive with BlackHole/system audio
- Bold colored ASCII characters
- Real-time frequency analysis (bass, mid, treble)

### 🎤 Microphone ASCII
**[image-ascii/image-ascii-color-bold-mic.html](image-ascii/image-ascii-color-bold-mic.html)**
- Uses microphone input for audio reactivity
- No external audio routing needed
- Perfect for live performances

## All Demos

### Image ASCII Art (6 demos)
1. **[image-ascii.html](image-ascii/image-ascii.html)** - Basic monochrome
2. **[image-ascii-color.html](image-ascii/image-ascii-color.html)** - With color
3. **[image-ascii-color-bold.html](image-ascii/image-ascii-color-bold.html)** - Bold + audio reactive ⭐
4. **[image-ascii-color-bold-mic.html](image-ascii/image-ascii-color-bold-mic.html)** - Microphone input 🎤
5. **[image-ascii-color-bold-OPTIMIZED.html](image-ascii/image-ascii-color-bold-OPTIMIZED.html)** - Performance optimized ⭐
6. **[image-ascii-color-bold-strudel.html](image-ascii/image-ascii-color-bold-strudel.html)** - Strudel integration 🎵

### Video ASCII Art (2 demos)
1. **[video-ascii.html](video-ascii/video-ascii.html)** - Basic webcam ASCII
2. **[video-ascii-bold.html](video-ascii/video-ascii-bold.html)** - Bold version with enhanced contrast

### Strudel Integration (2 demos)
1. **[demo-with-strudel.html](strudel/demo-with-strudel.html)** - Full split-screen environment ⭐🎵
2. **[test-tonejs.html](strudel/test-tonejs.html)** - Tone.js test pattern

### Experimental (1 demo)
1. **[test-animation.html](misc/test-animation.html)** - Animation tests

## Technical Details

- **Graphics**: p5.js v2.1.1
- **Audio**: Tone.js v15.0.4, p5.sound.js
- **Live Coding**: Strudel (@strudel/repl)
- **ASCII Characters**: Custom density-based character sets
- **Resolution**: Various (64×48 to 128×96)

## Audio Routing

### For BlackHole Audio (macOS)
1. Install [BlackHole](https://github.com/ExistentialAudio/BlackHole)
2. Configure Multi-Output Device in Audio MIDI Setup
3. Select BlackHole as input in demos

### For Microphone
- Use the `-mic.html` versions
- Grant microphone permissions when prompted

## Navigation

- **Main App**: [../../index.html](../../index.html)
- **Root Demos**: [../../demos/index.html](../../demos/index.html)
- **P5.js Playground**: [../index.html](../index.html)

## Development

All source code is in `../src/`:
- `../src/image-ascii/` - Image ASCII implementations
- `../src/video-ascii/` - Video ASCII implementations

## Performance Tips

- Use OPTIMIZED versions for better performance
- Close unused browser tabs
- Reduce canvas size for lower-end machines
- Disable audio analysis debug overlay if needed

---

**Legend**: ⭐ Featured | 🎵 Live Coding | 🎤 Microphone Input
